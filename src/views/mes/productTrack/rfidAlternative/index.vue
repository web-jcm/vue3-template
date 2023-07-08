<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
        </n-data-table>
    </div>
</template>
<script>
import { mesApis, queryLookupValues } from "@/api/apiList/mes";
import { saveRFIDList } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "rfidAlternative",
    components: {},
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path],
            function () {
                next();
            }
        );
    },
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            // 网格查询API配置对象
            apiConfig: mesApis.queryRFIDList,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableButtons
                    : [
                        {
                            compKey: "btnKey_query",
                              type: "primary",
                            size: "small",
                            clickEvent: () => this.search(),
                            text: this.$t("sys.button.query"),
                            name: "search",
                            position: "right",
                        },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                              clickEvent: () => this.save(),
                            text: this.$t("sys.button.save"),
                            name: "preservation",
                            position: "center",
                          },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                          .tableComponents
                    : [
                        {
                            compKey: "PLANT_CODE",
                            labelName: "工厂名称",
                            codeField: "PLANT_CODE",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                              isRequire: true,
                            clearable: false,
                        },
                        {
                            compKey: "PRODUCT_TYPE",
                            labelName: "生产类型",
                            codeField: "PRODUCT_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            options: [],
                            clearable: false,
                            isRequire: true,
                            isComponent: true,
                        },
                    ],
            // 动态生成网格列
            tableCols:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableCols
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableCols
                    : [
                        {
                            prop: "POINT_CODE",
                            label: "工程编码",
                            align: "center",
                        },
                        {
                            prop: "POINT_NAME",
                            label: "工程名称",
                            align: "center",
                          },
                    ],
            infoComponents: [
                {
                    compKey: "POINT_NAME",
                    labelName: "工程名称",
                    codeField: "POINT_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "CTRL_KEY",
                    labelName: "管理号",
                    codeField: "CTRL_KEY",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                },
            ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    PRODUCT_TYPE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                POINT_NAME: "",
                CTRL_KEY: "",
            },
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.POINT_NAME = val.POINT_NAME;
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
        },
        "formField.PRODUCT_TYPE": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        save() {
            if (this.resultField.CTRL_KEY !== "") {
                this.$confirm("是否保存当前修改?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let pram = {
                            PLANT_CODE: this.formField.PLANT_CODE,
                            POINT_CODE: this.clickRowsData.POINT_CODE,
                            CTRL_KEY: this.resultField.CTRL_KEY,
                            PRODUCT_TYPE: this.formField.PRODUCT_TYPE,
                        };
                        this.loading = this.$loading({
                            lock: true,
                            text: "保存中",
                            background: "rgba(0, 0, 0, 0.7)",
                        });
                        saveRFIDList(pram)
                            .then((res) => {
                                this.loading.close();
                                this.$utils.message({
                                    message: res.msg,
                                });
                            })
                            .catch((err) => {
                                this.loading.close();
                                console.log(err);
                            });
                    })
                    .catch(() => {});
            } else {
                this.$utils.message({
                    message: "请输入管理号！",
                });
            }
        },
        // 获取生产类型下拉列表
        queryLookupValues() {
            this.tableComponents[1].options = [];
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "PRODUCT_TYPE",
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
                            this.tableComponents[1].options = res.rows;
                            this.formField.PRODUCT_TYPE =
                                res.rows[0].LOOKUP_VALUE_CODE;
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        inputBlur(index) {
            this.changeIdx = index;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/rfidAlternative/rfidAlternative.scss";
</style>
