<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="80%"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="设备输出条件复制源选择"
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
                :dynamicResultField="resultField"
                :dynamic-is-show-select="false"
                :dynamic-is-init-table="false"
                :dynamic-is-column-drop="false"
                :is-set-default-brand="false"
                :isShowPagination="false"
                :isUsePathQuery="false"
            >
            </n-data-table>
        </div>
    </el-dialog>
</template>
<script>
import {
    queryEquipmentOutFactorAdjust,
    queryDeviceList,
    queryLookupValues,
    queryProduceType,
    getOrderSerialNumber,
    queryWorkShopList,
} from "@/api/apiList/mes";

export default {
    name: "copyData",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    props: {},
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
                    compKey: "btnKey_save",
                    type: "primary",
                    size: "small",
                    clickEvent: () => this.choose(),
                    text: "选择复制源",
                    name: "preservation",
                    position: "center",
                },
            ],
            tableComponents: [
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
                    compKey: "DEVICE_ID",
                    labelName: "接续设备",
                    codeField: "DEVICE_ID",
                    oFields: "DEVICE_ID,DEVICE_NAME",
                    lookuptype: "_is_null_code_",
                    component: () => import("@/components/org/LookupValue"),
                    isMust: true,
                    clearable: false,
                    isRequire: true,
                    isConcat: true,
                    options: [],
                },
            ],
            tableCols: [
                {
                    prop: "IS_SELECT",
                    label: "作业指示事件指定",
                    isComponent: true,
                    comps: [
                        {
                            compKey: "compKey_IS_SELECT",
                            codeField: "IS_SELECT",
                            component: () =>
                                import("@/components/org/checkBox"),
                            disabled: true,
                        },
                    ],
                    width: 120,
                },
                {
                    prop: "POINT_CODE",
                    label: "事件ID",
                    width: 120,
                },
                {
                    prop: "POINT_NAME",
                    label: "事件名",
                },
            ],
            infoComponents: [
                {
                    compKey: "DEVICE_ID",
                    labelName: "接续设备ID",
                    codeField: "DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    disabled: true,
                    labelWidth: 120,
                },
                {
                    compKey: "DEVICE_NAME",
                    labelName: "接续设备名",
                    codeField: "DEVICE_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                },
                {
                    compKey: "UPPER_DEVICE_ID",
                    labelName: "上层接续设备ID",
                    codeField: "UPPER_DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                    dataToObject: {
                        maxWordCount: 8,
                    },
                },
                {
                    compKey: "UPDATE_DEVICE_NAME",
                    labelName: "上层接续设备名",
                    codeField: "UPDATE_DEVICE_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                    dataToObject: {
                        maxWordCount: 7,
                    },
                },
                {
                    compKey: "DESCRIPTION",
                    labelName: "接续设备说明",
                    codeField: "DESCRIPTION",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 120,
                },
                {
                    compKey: "DEVICE_TYPE",
                    labelName: "接续设备类型",
                    codeField: "DEVICE_TYPE",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    disabled: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "FILTER_CATEGORY_NO",
                    labelName: "格式变更类别1",
                    codeField: "FILTER_CATEGORY_NO",
                    oFields: "CATEGORY_CODE,CATEGORY_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    disabled: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 7,
                },
                {
                    compKey: "FILTER_CATEGORY_NO2",
                    labelName: "格式变更类别2",
                    codeField: "FILTER_CATEGORY_NO2",
                    oFields: "CATEGORY_CODE,CATEGORY_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    disabled: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 7,
                },
                {
                    compKey: "FILTER_CATEGORY_NO3",
                    labelName: "格式变更类别3",
                    codeField: "FILTER_CATEGORY_NO3",
                    oFields: "CATEGORY_CODE,CATEGORY_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    disabled: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 7,
                },
                {
                    compKey: "REISSUE_FLAG",
                    labelName: "再输出设定",
                    codeField: "REISSUE_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    disabled: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "RECOVER_FLAG",
                    labelName: "自动恢复设定",
                    codeField: "RECOVER_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    disabled: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "DISABLE_FLAG",
                    labelName: "接续设备无效设定",
                    codeField: "DISABLE_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    disabled: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 8,
                },
                {
                    compKey: "TEST_DEVICE_FLAG",
                    labelName: "测试连接设备",
                    codeField: "TEST_DEVICE_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    disabled: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "WI_SERIAL_SECTION_ID",
                    labelName: "顺序编号表示工程",
                    codeField: "WI_SERIAL_SECTION_ID",
                    oFields: "SECTION_CODE,SECTION_NAME",
                    lookuptype: "_is_null_code_",
                    clearable: false,
                    disabled: true,
                    isComponent: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 8,
                },
                {
                    compKey: "GROUP_ID",
                    labelName: "管理区分",
                    codeField: "GROUP_ID",
                    oFields: "PROCESS_LOCATION,PROCESS_LOCATION_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    disabled: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "COPIES",
                    labelName: "输出数",
                    codeField: "COPIES",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 120,
                },
                {
                    compKey: "OFFSET_NUMBER",
                    labelName: "偏移数",
                    codeField: "OFFSET_NUMBER",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 120,
                },
                {
                    compKey: "REQ_WARNING_VOL",
                    labelName: "警告通知停留数据数",
                    codeField: "REQ_WARNING_VOL",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 120,
                    dataToObject: {
                        maxWordCount: 9,
                    },
                },
            ],
            formField: {
                PLANT_CODE: "",
                DEVICE_ID: "",
            },
            resultField: {
                COPIES: "",
                DESCRIPTION: "",
                DEVICE_ID: "",
                DEVICE_NAME: "",
                DEVICE_TYPE: "",
                DISABLE_FLAG: "",
                FILTER_CATEGORY_NO: "",
                FILTER_CATEGORY_NO2: "",
                FILTER_CATEGORY_NO3: "",
                GROUP_ID: "",
                OFFSET_NUMBER: "",
                POINT_CODES: "",
                RECOVER_FLAG: "",
                REISSUE_FLAG: "",
                REQ_WARNING_VOL: "",
                TEST_DEVICE_FLAG: "",
                WI_SERIAL_SECTION_ID: "",
                UPPER_DEVICE_ID: "",
                UPDATE_DEVICE_NAME: "",
            },
        };
    },
    watch: {
        "formField.DEVICE_ID": function () {
            this.search();
        },
        "formField.PLANT_CODE": function () {
            this.queryEquipmentList();
            this.queryLookupValues("REISSUE_FLAG");
            this.queryLookupValues("RECOVER_FLAG");
            this.queryLookupValues("TEST_DEVICE_FLAG");
            this.queryLookupValues("DISABLE_FLAG");
            this.queryLookupValues("DEVICE_TYPE");
            this.queryProduceType();
            this.getOrderSerialNumber();
            this.queryWorkShopList();
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        queryTable(size) {
            this.$refs.multipleTable.listLoading = true;
            queryEquipmentOutFactorAdjust(this.formField)
                .then((res) => {
                    this.$refs.multipleTable.list = [];
                    if (res.result === "1" && res.rows) {
                        for (let key in res.rows) {
                            this.resultField[key] = res.rows[key];
                        }
                        this.$refs.multipleTable.list =
                            this.resultField.POINT_CODES;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.$refs.multipleTable.listLoading = false;
                })
                .catch((err) => {
                    this.$refs.multipleTable.list = [];
                    this.$refs.multipleTable.listLoading = false;
                    console.log(err);
                });
        },
        queryEquipmentList() {
            queryDeviceList({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_TYPE: "2",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
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
        queryWorkShopList() {
            queryWorkShopList({
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.infoComponents[14].options = res.rows;
                        this.formField.POINT_CODES = res.rows[0].SECTION_CODE;
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
        getOrderSerialNumber() {
            getOrderSerialNumber({
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.infoComponents[13].options = res.rows;
                        this.formField.WI_SERIAL_SECTION_ID =
                            res.rows[0].SECTION_CODE;
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
        queryProduceType() {
            queryProduceType({
                PLANT_CODE: this.formField.PLANT_CODE,
                CATEGORY_TYPE: "W2",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        res.rows.unshift({
                            CATEGORY_NAME: "没有指定",
                            CATEGORY_CODE: "null",
                        });
                        this.infoComponents[6].options = res.rows;
                        this.infoComponents[7].options = res.rows;
                        this.infoComponents[8].options = res.rows;
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
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "DEVICE_TYPE") {
                            this.infoComponents[5].options = res.rows;
                        }
                        if (type === "REISSUE_FLAG") {
                            this.infoComponents[9].options = res.rows;
                        }
                        if (type === "RECOVER_FLAG") {
                            this.infoComponents[10].options = res.rows;
                        }
                        if (type === "DISABLE_FLAG") {
                            this.infoComponents[11].options = res.rows;
                        }
                        if (type === "TEST_DEVICE_FLAG") {
                            this.infoComponents[12].options = res.rows;
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
        choose() {
            if (this.resultField.DEVICE_ID === "") return;
            this.$confirm("是否确认选择当前复制源?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$emit("choose", this.resultField);
                })
                .catch(() => {});
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_wrap {
    height: 600px;
    /deep/.filter-params {
        margin: 0;
    }
}
</style>
