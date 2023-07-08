<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicRowStyle="setRowstyle"
            :stripe="false"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
            <template v-slot:OUTPUT_TYPE="scope">
                <div>
                    {{
                        scope.row.OUTPUT_TYPE === "1" ? "正常输出" : "指定输出"
                    }}
                </div>
            </template>
        </n-data-table>
        <selectEquipment
            v-if="showDialog"
            :plantCode="formField.PLANT_CODE"
            @close="dialogClose"
        />
    </div>
</template>
<script>
import {
    queryLineNo,
    queryCtrlKey,
    queryLookupValues,
    queryAssemblyPLCExport,
    cancelAssemblyPLCExport,
} from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "assemblyPLCExport",
    components: {
        selectEquipment: () => import("./selectEquipment"),
    },
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
                            clickEvent: () => this.save("0"),
                            text: "取消输出",
                            name: "preservation",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => this.save("1"),
                              text: "取消全部输出",
                            name: "preservation",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => (this.showDialog = true),
                            text: "指定输出",
                        },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length >
                    (0).length >
                    0
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
                            compKey: "LINE_NO",
                            labelName: "生产线",
                            codeField: "LINE_NO",
                            oFields: "LINE_NO,LINE_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            clearable: false,
                            isRequire: true,
                            span: 4,
                            options: [],
                        },
                        {
                            compKey: "SUB_LINE_NO",
                            labelName: "子线号",
                            codeField: "SUB_LINE_NO",
                            component: () =>
                                import("@/components/org/commonInput"),
                            isRequire: true,
                              span: 4,
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
                            clearable: false,
                            span: 4,
                            options: [],
                          },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            component: () =>
                                import("@/components/org/commonInput"),
                              isMust: true,
                        },
                        {
                            compKey: "SIZE",
                            labelName: "取得数据件数",
                            codeField: "SIZE",
                            span: 4,
                            component: () =>
                                import("@/components/org/commonInput"),
                          },
                    ],
            infoComponents: [
                {
                    labelName: "未输出",
                    style: {
                        width: "10%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #73fbfb",
                        whiteSpace: "nowrap",
                    },
                },
                {
                    labelName: "",
                    style: {
                        width: "24px",
                        height: "24px",
                        background: "#fff",
                        border: "1px solid",
                    },
                },
                {
                    labelName: "正常输出",
                    style: {
                        width: "10%",
                        padding: "2px 10px",
                        whiteSpace: "nowrap",
                    },
                },
                {
                    labelName: "取消输出",
                    style: {
                        width: "10%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #e93ff5",
                        whiteSpace: "nowrap",
                    },
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
                            prop: "LINE_NO",
                            label: "生产线",
                        },
                        {
                            prop: "SUB_LINE_NO",
                            label: "生产子线NO",
                        },
                        {
                            prop: "SUB_LINE_NAME",
                            label: "生产子线名称",
                        },
                        {
                            prop: "TRIM_SERIAL_NO",
                            label: "总装连续编号",
                        },
                        {
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                        {
                            prop: "REQUEST_TIME",
                            label: "作业指示要求时间",
                          },
                        {
                            prop: "OUTPUT_TIME",
                            label: "作业指示输出时间",
                          },
                        {
                            prop: "OUTPUT_TYPE",
                            label: "输出类型",
                            isSlot: true,
                        },
                        {
                            prop: "INST_DATA",
                              label: "输出内容",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    searchKey: "",
                    searchValue: "",
                    LINE_NO: "",
                    SUB_LINE_NO: "",
                    CTRL_KEY: "",
                    SIZE: "500",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            showDialog: false,
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLineNo();
            this.queryLookupValues();
        },
    },
    methods: {
        queryLineNo() {
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[1].options = res.rows;
                            this.formField.LINE_NO = res.rows[0].LINE_NO;
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
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "QUERY_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[3].options = res.rows;
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
                    this.loading.close();
                    console.log(err);
                });
        },
        async search() {
            if (!this.formField.SUB_LINE_NO) {
                return this.$utils.message({
                    message: "请输入子线号！",
                });
            }
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            this.formField.CTRL_KEY = "";
            if (this.formField.searchValue) await this.queryCtrlKey();
            this.queryAssemblyPLCExport();
        },
        queryAssemblyPLCExport() {
            this.$refs.multipleTable.list = [];
            queryAssemblyPLCExport(this.formField)
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        this.$refs.multipleTable.list = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        save(type) {
            if (type === "0" && !this.clickRowsData.ID) {
                return this.$utils.message({
                    message: "请先选择数据！",
                });
            }
            this.$confirm("是否提交修改?", "提示", {
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
                    cancelAssemblyPLCExport({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        LINE_NO: this.formField.LINE_NO,
                        SUB_LINE_NO: this.formField.SUB_LINE_NO,
                        ID: type === "0" ? this.clickRowsData.ID : "",
                        CTRL_KEY:
                            type === "0" ? this.clickRowsData.CTRL_KEY : "",
                        IS_ALL_CANCLE: type,
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
        dialogClose() {
            this.showDialog = false;
            this.search();
        },
        setRowstyle(e) {
            if (e.row.OUTPUT_TYPE === "1") {
                return {
                    background: "#FFF",
                };
            } else {
                if (e.row.OUTPUT_STATUS === "0") {
                    return {
                        background: "#73fbfb",
                    };
                } else {
                    return {
                        background: "#e93ff5",
                    };
                }
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesBaseInfoManagement/vehiclesBaseInfoManagement.scss";
</style>
