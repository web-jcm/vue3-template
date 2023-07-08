<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
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
import {
    mesApis,
    queryDeviceList,
    queryLookupValues,
    saveProductIndicateOutput,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesProductIndicateOutput",
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
            apiConfig: mesApis.queryProductIndicateOutput,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length >
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableButtons
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
                            component: () => import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
                          },
                        {
                            compKey: "EDIT_PATTERN_TYPE",
                            labelName: "设备类型",
                            codeField: "EDIT_PATTERN_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () => import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            options: [],
                        },
                        {
                            compKey: "DEVICE_ID",
                            labelName: "设备",
                            codeField: "DEVICE_ID",
                            oFields: "DEVICE_ID,DEVICE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () => import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            isConcat: true,
                              options: [],
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
                            prop: "CATEGORY_CODE",
                            label: "类别",
                        },
                        {
                            prop: "CATEGORY_NAME",
                            label: "类别名",
                          },
                        {
                            prop: "EDIT_PATTERN_ID",
                            label: "PatternID",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                {
                                      compKey: "compKey_EDIT_PATTERN_ID",
                                    codeField: "EDIT_PATTERN_ID",
                                    component: () => import("@/components/org/commonInput"),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                    rule: "23",
                                },
                            ],
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    EDIT_PATTERN_TYPE: "",
                    DEVICE_ID: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
        };
    },
    watch: {
        "formField.EDIT_PATTERN_TYPE": function (val) {
            this.queryDeviceList();
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues("EDIT_PATTERN_TYPE");
        },
        "formField.DEVICE_ID": function () {
            this.$refs.multipleTable.list = [];
            this.search();
        },
    },
    methods: {
        queryLookupValues(type) {
            this.formField.EDIT_PATTERN_TYPE = "";
            this.tableComponents[1].options = [];
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.EDIT_PATTERN_TYPE =
                            res.rows[0].LOOKUP_VALUE_CODE;
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
        queryDeviceList() {
            this.formField.DEVICE_ID = "";
            this.tableComponents[2].options = [];
            queryDeviceList({
                PLANT_CODE: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                SUB_DEVICE_TYPE: this.formField.EDIT_PATTERN_TYPE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows?.length) {
                        this.tableComponents[2].options = res.rows;
                        this.formField.DEVICE_ID = res.rows[0].DEVICE_ID;
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
        search() {
            this.queryTable(1);
        },
        save() {
            let arr = this.$refs.multipleTable.list.filter((item) => {
                return item.EDIT_PATTERN_ID;
            });
            this.$confirm("确定要保存数据吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveProductIndicateOutput({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        DEVICE_ID: this.formField.DEVICE_ID,
                        ROWS: arr,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") this.search();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesProductIndicateOutput/vehiclesProductIndicateOutput.scss";
</style>
