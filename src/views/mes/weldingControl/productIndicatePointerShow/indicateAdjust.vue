<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="900px"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="生产指示pointer修正"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
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
            </n-data-table>
        </div>
    </el-dialog>
</template>
<script>
import {
    queryProductPointerList,
    saveProductPointerList,
} from "@/api/apiList/mes";

export default {
    name: "indicateAdjust",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    props: {
        plantCode: "",
        lineNo: "",
        subLineNo: "",
        serialNo: "",
    },
    data() {
        return {
            tableButtons: [
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
            tableComponents: [
                {
                    compKey: "LINE_NO",
                    labelName: "生产线",
                    codeField: "LINE_NO",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                },
                {
                    compKey: "SUB_LINE_NO",
                    labelName: "生产线NO",
                    codeField: "SUB_LINE_NO",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                },
                {
                    compKey: "BODY_SERIAL_NO",
                    labelName: "焊装连续编号",
                    codeField: "BODY_SERIAL_NO",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                },
                {
                    compKey: "SERIAL_NO",
                    labelName: "最终生产指示Pointer",
                    codeField: "SERIAL_NO",
                    component: () => import("@/components/org/commonInput"),
                    disabled: true,
                    dataToObject: {
                        maxWordCount: 13,
                        placeholder: "",
                    },
                    labelWidth: 120,
                },
                {
                    compKey: "isAllLine",
                    labelName: "查询模式",
                    codeField: "isAllLine",
                    component: () => import("@/components/org/radioBox"),
                    options: [
                        {
                            label: "车身生产线",
                            value: "0",
                        },
                        {
                            label: "车架生产线",
                            value: "2",
                        },
                        {
                            label: "指定生产线",
                            value: "1",
                        },
                    ],
                },
            ],
            tableCols: [
                {
                    prop: "BODY_SERIAL_NO",
                    label: "车体连续编号",
                },
                {
                    prop: "OUT_STAUTS",
                    label: "搬出标识",
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
                    prop: "PLAN_DATE2",
                    label: "Metal OK计划",
                },
                {
                    prop: "PLAN_DATE7",
                    label: "下线计划",
                },
            ],
            infoComponents: [
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
            formField: {
                PLANT_CODE: "",
                LINE_NO: "",
                SUB_LINE_NO: "",
                BODY_SERIAL_NO: "",
                SERIAL_NO: "",
                isAllLine: "1",
            },
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        clickRowsData: function (val) {
            this.formField.BODY_SERIAL_NO = val.BODY_SERIAL_NO;
        },
        "formField.isAllLine": function (val) {
            this.search();
        },
    },
    created() {
        this.formField.PLANT_CODE = this.plantCode;
        this.formField.LINE_NO = this.lineNo;
        this.formField.SUB_LINE_NO = this.subLineNo;
        this.formField.SERIAL_NO = this.serialNo;
        this.$nextTick(() => {
            this.search();
        });
    },
    methods: {
        search() {
            this.queryProductPointerList();
        },
        queryProductPointerList() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            this.$refs.multipleTable.list = [];
            queryProductPointerList({
                PLANT_CODE: this.formField.PLANT_CODE,
                LINE_NO: this.formField.LINE_NO,
                PROCESS_LOCATION: "M",
                SUB_LINE_NO: this.formField.SUB_LINE_NO,
                IS_SUB_LINE: this.formField.isAllLine,
            })
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        this.$refs.multipleTable.list = res.rows;
                        res.rows.some((sel) => {
                            if (
                                sel.BODY_SERIAL_NO === this.formField.SERIAL_NO
                            ) {
                                this.$refs.multipleTable.$refs.multipleTable.setCurrentRow(
                                    sel
                                );
                                return true;
                            }
                        });
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
            if (this.formField.isAllLine !== "1") {
                this.$utils.message({
                    message: "请查询指定生产线时修改！",
                });
            } else {
                if (
                    (type === "0" && this.clickRowsData.CTRL_KEY) ||
                    type === "1"
                ) {
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
                            saveProductPointerList({
                                PLANT_CODE: this.formField.PLANT_CODE,
                                LINE_NO: this.formField.LINE_NO,
                                SUB_LINE_NO: this.formField.SUB_LINE_NO,
                                PROCESS_LOCATION: "M",
                                SERIAL_NO:
                                    type === "0"
                                        ? this.clickRowsData.BODY_SERIAL_NO
                                        : "",
                                CTRL_KEY:
                                    type === "0"
                                        ? this.clickRowsData.CTRL_KEY
                                        : "",
                                IS_ALL_CANCEL: type,
                            })
                                .then((res) => {
                                    this.loading.close();
                                    this.$utils.message({
                                        message: res.msg,
                                    });
                                    if (res.result === "1") {
                                        this.formField.SERIAL_NO =
                                            type === "0"
                                                ? this.clickRowsData
                                                    .BODY_SERIAL_NO
                                                : "";
                                        this.search();
                                    }
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
            }
        },
        closeMoule() {
            this.$emit("close");
        },
        setRowstyle(e) {
            if (e.row.BODY_INSTR_STATUS === "0") {
                return {
                    background: "#00FFFF",
                };
            }
            if (e.row.BODY_INSTR_STATUS === "1") {
                return {
                    background: "#A9A9A9",
                };
            }
            if (e.row.BODY_INSTR_STATUS === "2") {
                return {
                    background: "#00BFFF",
                };
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_wrap {
    height: 500px;
    /deep/.filter-params {
        margin: 0;
    }
    /deep/ .operation-btn {
        padding-top: 0;
    }
    .flex {
        display: flex;
    }
}
</style>
