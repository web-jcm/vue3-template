<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="false"
        >
            <template v-slot:isTwoColor="scope">
                {{ scope.row.isTwoColor === "0" ? "否" : "是" }}
            </template>
        </n-data-table>
    </div>
</template>
<script>
import {
    queryCarInfo,
    saveTwoColorCar,
    queryCtrlKey,
    queryLookupValues,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "twoColorCar",
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
                            compKey: "searchKey",
                            labelName: "查询KEY",
                            codeField: "searchKey",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () => import("@/components/org/LookupValue"),
                            isMust: true,
                            clearable: false,
                            isRequire: true,
                            options: [],
                        },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            component: () => import("@/components/org/commonInput"),
                            isMust: true,
                            rule: "",
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
                            prop: "ctrlKey",
                            label: "管理号",
                          },
                        {
                            prop: "isTwoColor",
                            label: "是否双色车",
                            isSlot: true,
                          },
                        {
                            prop: "doublePassCount",
                            label: "颜色指示",
                            isComponent: true,
                            width: 140,
                            comps: [
                                {
                                    compKey: "compKey_doublePassCount",
                                    codeField: "doublePassCount",
                                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                                    component: () => import("@/components/org/LookupValue"),
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    options: [],
                                },
                            ],
                              noShowTooltip: true,
                        },
                        {
                            prop: "doubleCheckStatus",
                              label: "状态",
                            isComponent: true,
                            width: 140,
                            comps: [
                                {
                                    compKey: "compKey_doubleCheckStatus",
                                    codeField: "doubleCheckStatus",
                                    component: () => import("@/components/org/LookupValue"),
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    options: [
                                        {
                                            lookupValueName: "",
                                            lookupValueCode: "",
                                        },
                                        {
                                            lookupValueName: "NG",
                                            lookupValueCode: "0",
                                        },
                                        {
                                            lookupValueName: "OK",
                                            lookupValueCode: "1",
                                        },
                                    ],
                                },
                            ],
                            noShowTooltip: true,
                          },
                        {
                            prop: "zoneName",
                            label: "区域",
                          },
                        {
                            prop: "model",
                            label: "车型",
                            width: 160,
                          },
                        {
                            prop: "vinNo",
                            label: "VIN",
                              width: 160,
                        },
                        {
                            prop: "colorI",
                            label: "内饰色",
                          },
                        {
                            prop: "colorK",
                            label: "外饰色",
                          },
                        {
                            prop: "colorK0",
                            label: "中涂色",
                          },
                        {
                            prop: "colorK1",
                            label: "第一面漆",
                          },
                        {
                            prop: "colorK2",
                            label: "第二面漆",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    searchKey: "",
                    searchValue: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
        };
    },
    watch: {
        "formField.searchKey": function (val) {
            if (val === "ctrlKey") {
                this.tableComponents[2].rule = "1";
            } else if (val === "vin") {
                this.tableComponents[2].rule = "2";
            } else if (val === "orderId") {
                this.tableComponents[2].rule = "3";
            }
        },
        "formField.PLANT_CODE": async function () {
            await this.queryLookupValues("QUERY_TYPE");
        },
    },
    methods: {
        async search() {
            if (!this.formField.searchKey || !this.formField.searchValue) {
                return this.$utils.message({
                    message: "查询值不能为空!",
                });
            }
            await this.queryCtrlKey();
            if (this.formField.CTRL_KEY) {
                this.queryTable();
            }
        },
        queryTable() {
            this.$refs.multipleTable.listLoading = true;
            this.$refs.multipleTable.list = [];
            queryCarInfo(this.formField)
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows?.rows?.length) {
                            if (res.rows.rows[0].isTwoColor === "0") {
                                this.queryLookupValues("NO_DOUBLE_PASS_COUNT");
                            } else {
                                this.queryLookupValues("DOUBLE_PASS_COUNT");
                            }
                            this.$refs.multipleTable.list = res.rows.rows;
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.$refs.multipleTable.listLoading = false;
                })
                .catch((err) => {
                    this.$refs.multipleTable.listLoading = false;
                    console.log(err);
                });
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
        queryLookupValues(type) {
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "QUERY_TYPE") {
                            this.tableComponents[1].options = res.rows;
                            this.formField.searchKey =
                                res.rows[0].LOOKUP_VALUE_CODE;
                        }
                        if (type === "DOUBLE_PASS_COUNT") {
                            this.tableCols[2].comps[0].options = res.rows;
                        }
                        if (type === "NO_DOUBLE_PASS_COUNT") {
                            this.tableCols[2].comps[0].options = res.rows;
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
        save() {
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = {
                    PLANT_CODE: this.formField.PLANT_CODE,
                    CTRL_KEY: this.formField.CTRL_KEY,
                    DOUBLE_PASS_COUNT:
                        this.$refs.multipleTable.list[0].doublePassCount,
                    DOUBLE_CHECK_STATUS:
                        this.$refs.multipleTable.list[0].doubleCheckStatus,
                };
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveTwoColorCar(pram)
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "1") {
                            this.search();
                        }
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/.comwidth {
    justify-content: center;
}
</style>
