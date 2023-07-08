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
    queryCtrlKey,
    saveLineList,
    queryLookupValues,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "productLineAdjust",
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
            apiConfig: mesApis.queryLineList,
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
                        {
                            compKey: "btnKey_isall",
                              type: "",
                            size: "small",
                            clickEvent: () => this.selectAll(),
                            text: "全部选择",
                            name: "adopt",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_notall",
                            type: "",
                              size: "small",
                            clickEvent: () => this.selectNone(),
                              text: "全部解除",
                            name: "reject",
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
                            compKey: "searchKey",
                            labelName: "查询KEY",
                            codeField: "searchKey",
                              oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
                            options: [],
                        },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            component: () =>
                                import("@/components/org/commonInput"),
                            isMust: true,
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
                            prop: "SUB_LINE_NO",
                            label: "生产线编号",
                        },
                        {
                            prop: "SUB_LINE_NAME",
                            label: "生产线名",
                          },
                        {
                            prop: "PRODUCTION_FLAG",
                            label: "指示状态",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                  {
                                    compKey: "compKey_PRODUCTION_FLAG",
                                    codeField: "PRODUCTION_FLAG",
                                    component: () =>
                                        import("@/components/org/checkBox"),
                                      isMust: true,
                                },
                            ],
                        },
                        //   {
                        //       prop: "BOUND_FLAG",
                        //       label: "搬出标识",
                        //       isComponent: true,
                        //       noShowTooltip: true,
                          //       comps: [
                        //           {
                        //               compKey: "compKey_BOUND_FLAG",
                        //               codeField: "BOUND_FLAG",
                        //               component: () =>
                        //                   import("@/components/org/checkBox"),
                          //               isMust: true,
                        //           },
                        //       ],
                        //   },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    searchKey: "",
                    searchValue: "",
                    CTRL_KEY: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
        },
    },
    methods: {
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "QUERY_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.searchKey =
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
        async search() {
            if (!this.formField.searchKey || !this.formField.searchValue) {
                return this.$utils.message({
                    message: "查询值不能为空!",
                });
            }
            await this.queryCtrlKey();
            if (this.formField.CTRL_KEY) this.queryTable(1);
        },
        queryCtrlKey() {
            return queryCtrlKey({
                PLANT_CODE: this.formField.PLANT_CODE,
                searchKey: this.formField.searchKey,
                searchValue: this.formField.searchValue,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.formField.CTRL_KEY = res.rows[0].CTRL_KEY;
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
        save() {
            this.$confirm("是否保存修改?", "提示", {
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
                    saveLineList({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        CTRL_KEY: this.formField.CTRL_KEY,
                        ROWS: this.$refs.multipleTable.list,
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
                .catch(() => {});
        },
        selectAll() {
            this.$refs.multipleTable.list.forEach((item) => {
                item.BOUND_FLAG = "1";
                item.PRODUCTION_FLAG = "1";
            });
        },
        selectNone() {
            this.$refs.multipleTable.list.forEach((item) => {
                item.BOUND_FLAG = "0";
                item.PRODUCTION_FLAG = "0";
            });
        },
    },
};
</script>
<style lang="scss" scoped></style>
