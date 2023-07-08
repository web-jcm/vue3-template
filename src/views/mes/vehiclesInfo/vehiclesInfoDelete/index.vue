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
            :dynamic-is-show-select="true"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
        >
        </n-data-table>
    </div>
</template>
<script>
import {
    mesApis,
    delCarInfo,
    queryZone,
    queryLookupValues,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesInfoDelete",
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
            apiConfig: mesApis.queryProductPlan,
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
                            compKey: "btnKey_delete",
                            type: "",
                            size: "small",
                            clickEvent: () => this.delete(),
                            text: this.$t("sys.button.delete"),
                            name: "quanbushanchu",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_reset",
                            type: "",
                              size: "small",
                            clickEvent: () => this.reset(),
                            text: this.$t("sys.button.reset"),
                              name: "reset",
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
                            span: 4,
                        },
                        {
                            compKey: "BATCH_NO",
                            labelName: "批次号",
                            codeField: "BATCH_NO",
                            component: () =>
                                import("@/components/org/commonInput"),
                              isMust: true,
                        },
                        {
                            compKey: "queryType",
                            labelName: "查询KEY",
                              codeField: "queryType",
                            oFields: "ATT1,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            clearable: false,
                            span: 4,
                            options: [],
                            change: () => (this.formField.queryCode = []),
                          },
                        {
                            compKey: "queryCode",
                            codeField: "queryCode",
                            labelName: "",
                            component: () => import("@/components/org/tag"),
                              isMust: true,
                            span: 9,
                              rule: "",
                        },
                        {
                            compKey: "ZONE_CODE",
                            labelName: "区域",
                            codeField: "ZONE_CODE",
                            oFields: "ZONE_CODE,ZONE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isMul: true,
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
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                          {
                            prop: "RESULT",
                            label: "结果",
                        },
                        {
                            prop: "ZONE_CODE",
                            label: "区域编码",
                        },
                        {
                            prop: "ZONE_NAME",
                            label: "区域名称",
                          },
                        {
                            prop: "LAST_UPDATED_DATE",
                            label: "更新时间",
                            width: 140,
                        },
                        {
                            prop: "MODEL",
                            label: "车型",
                            width: 150,
                        },
                        {
                            prop: "CONFIGURATION",
                              label: "配置",
                            width: 150,
                        },
                        {
                            prop: "COLOR_K",
                            label: "外饰色",
                        },
                        {
                            prop: "COLOR_I",
                            label: "内饰色",
                        },
                          {
                            prop: "VIN_NO",
                            label: "VIN",
                            width: 140,
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    queryType: "",
                    BATCH_NO: "",
                    queryCode: [],
                    ZONE_CODE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.queryType": function (val) {
            if (val === "CTRL_KEY") {
                this.tableComponents[3].rule = "1";
            } else if (val === "VIN_NO") {
                this.tableComponents[3].rule = "2";
            } else if (val === "ORDER_ID") {
                this.tableComponents[3].rule = "3";
            }
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
            this.queryZone();
            this.search();
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
                        this.tableComponents[2].options = res.rows;
                        this.formField.queryType = res.rows[0].ATT1;
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
        queryZone() {
            queryZone({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                NOT_TEMP_ZONES: ["B#S01", "B#H01"],
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[4].options = res.rows;
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
        search() {
            this.tableComponents[2].options.forEach((item) => {
                if (item.ATT1 === this.formField.queryType) {
                    this.formField[item.ATT1 + "S"] = this.formField.queryCode;
                } else {
                    this.formField[item.ATT1 + "S"] = "";
                }
            });
            if (!this.formField.ZONE_CODE.length) {
                if (!this.formField.queryCode.length) {
                    this.formField.ZONE_CODES = [];
                    this.tableComponents[4].options.forEach((item) => {
                        this.formField.ZONE_CODES.push(item.ZONE_CODE);
                    });
                }
            } else if (
                typeof this.formField.ZONE_CODE === "string" &&
                this.formField.ZONE_CODE.length > 0
            ) {
                this.formField.ZONE_CODES = this.formField.ZONE_CODE.split(",");
            }
            this.queryTable(1);
        },
        reset() {
            this.formField.PLANT_CODE = "";
            this.formField.BATCH_NO = "";
            this.formField.queryCode = [];
            this.formField.ZONE_CODE = "";
        },
        delete() {
            if (this.$refs.multipleTable.selection.length) {
                this.$confirm("此操作将删除选择数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let arr1 = [];
                        let arr2 = [];
                        this.$refs.multipleTable.selection.forEach((item) => {
                            arr1.push(item.CTRL_KEY);
                            arr2.push(item.ZONE_CODE);
                        });
                        this.loading = this.$loading({
                            lock: true,
                            text: "删除中",
                            background: "rgba(0, 0, 0, 0.7)",
                        });
                        delCarInfo({
                            PLANT_CODE: this.formField.PLANT_CODE,
                            CTR_KEY_ROW: arr1,
                            ZONE_ROW: arr2,
                        })
                            .then((res) => {
                                this.loading.close();
                                this.$utils.message({
                                    message: res.msg,
                                });
                                if (res.rows.length) {
                                    let arr = [
                                        ...this.$refs.multipleTable.list,
                                    ];
                                    res.rows.forEach((item) => {
                                        arr.some((sel) => {
                                            if (
                                                item.CTRL_KEY === sel.CTRL_KEY
                                            ) {
                                                sel.RESULT = item.RESULT;
                                                return true;
                                            }
                                        });
                                    });
                                    this.$refs.multipleTable.list = [...arr];
                                }
                            })
                            .catch((err) => {
                                this.loading.close();
                                console.log(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$utils.message({
                    message: "请选择需要删除的数据！",
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesInfoDelete/vehiclesInfoDelete.scss";
</style>
