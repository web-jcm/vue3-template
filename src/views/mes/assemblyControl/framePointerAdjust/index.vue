<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamicResultField="resultField"
            :dynamic-api-config="apiConfig"
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
        </n-data-table>
    </div>
</template>
<script>
import {
    queryLineNo,
    queryLookupValues,
    queryProductPointerList,
    saveAssemblyPointerList,
} from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "framePointerAdjust",
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
                            compKey: "btnKey_query",
                            size: "small",
                            clickEvent: () => this.save("0"),
                            text: "更新",
                        },
                        {
                            compKey: "btnKey_query",
                            size: "small",
                            clickEvent: () => this.save("1"),
                            text: "指针初始化",
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
                              compKey: "LINE_NO",
                            labelName: "生产线",
                            codeField: "LINE_NO",
                            oFields: "LINE_NO,LINE_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            clearable: false,
                            isRequire: true,
                            options: [],
                        },
                    ],
            infoComponents: [
                {
                    compKey: "TRIM_SERIAL_NO",
                    labelName: "总装连续编号",
                    codeField: "TRIM_SERIAL_NO",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 100,
                },
                {
                    labelName: "指示完成",
                    style: {
                        width: "15%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #A9A9A9",
                        whiteSpace: "nowrap",
                    },
                },
                {
                    labelName: "指示中",
                    style: {
                        width: "15%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #00BFFF",
                        whiteSpace: "nowrap",
                    },
                },
                {
                    labelName: "未指示",
                    style: {
                        width: "15%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #00FFFF",
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
                            prop: "TRIM_SERIAL_NO",
                            label: "总装连续编号",
                          },
                        {
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                        {
                            prop: "MODEL",
                            label: "车型",
                        },
                        {
                            prop: "VIN_NO",
                            label: "VIN码",
                        },
                        {
                            prop: "PLAN_DATE7",
                            label: "下线计划",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    LINE_NO: "",
                    SUB_LINE_NO: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                TRIM_SERIAL_NO: "",
            },
            clickRowsData: {}, //点击行对象
            showDialog: false,
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLineNo();
            this.queryLookupValues();
        },
        clickRowsData: function (val) {
            this.resultField.TRIM_SERIAL_NO = val.TRIM_SERIAL_NO;
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
                lookupType: "FRAME_LINE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.formField.SUB_LINE_NO =
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
        search() {
            this.queryProductPointerList();
        },
        queryProductPointerList() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryProductPointerList({
                PLANT_CODE: this.formField.PLANT_CODE,
                LINE_NO: this.formField.LINE_NO,
                PROCESS_LOCATION: "T",
                SUB_LINE_NO: this.formField.SUB_LINE_NO,
                IS_SUB_LINE: "1",
            })
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
            if (this.clickRowsData.CTRL_KEY || type === "1") {
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
                        saveAssemblyPointerList({
                            PLANT_CODE: this.formField.PLANT_CODE,
                            LINE_NO: this.formField.LINE_NO,
                            SUB_LINE_NO: this.formField.SUB_LINE_NO,
                            PROCESS_LOCATION: "T",
                            SERIAL_NO:
                                type === "0"
                                    ? this.clickRowsData.TRIM_SERIAL_NO
                                    : "",
                            CTRL_KEY:
                                type === "0" ? this.clickRowsData.CTRL_KEY : "",
                            IS_ALL_CANCEL: type,
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
            } else {
                this.$utils.message({
                    message: "请选择数据！",
                });
            }
        },
        setRowstyle(e) {
            if (e.row.TRIM_INSTR_STATUS === "0") {
                console.log(e.row);
                return {
                    background: "#00FFFF",
                };
            }
            if (e.row.TRIM_INSTR_STATUS === "1") {
                console.log(e.row);
                return {
                    background: "#A9A9A9",
                };
            }
            if (e.row.TRIM_INSTR_STATUS === "2") {
                console.log(e.row);
                return {
                    background: "#00BFFF",
                };
            }
        },
    },
};
</script>
<style lang="scss" scoped></style>
