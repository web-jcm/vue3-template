<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="800px"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="作业指示再输出(复数接续设备指定)"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
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
                :dynamic-is-show-select="true"
                :dynamic-is-init-table="false"
                :dynamic-is-column-drop="false"
                :is-set-default-brand="false"
                :isShowPagination="false"
                @has="getData"
            >
            </n-data-table>
            <div class="bottom_wrap">
                <div>再输出车辆指定</div>
                <div class="flex">
                    <el-radio v-model="formData.TYPE" label="1"
                        >管理号指定</el-radio
                    >
                    <el-input
                        v-model="formData.CTRL_KEY"
                        size="mini"
                        :disabled="formData.TYPE !== '1'"
                    ></el-input>
                    <div class="label width50">输出数</div>
                    <el-input
                        v-model="formData.NUM"
                        size="mini"
                        :disabled="formData.TYPE !== '1'"
                    ></el-input>
                </div>
                <div class="flex">
                    <el-radio v-model="formData.TYPE" label="2"
                        >总装连续编号</el-radio
                    >
                    <el-input
                        v-model="formData.STAR_TRIM_SERIAL_NO"
                        size="mini"
                        :disabled="formData.TYPE !== '2'"
                    ></el-input>
                    <div class="width50">-</div>
                    <el-input
                        v-model="formData.END_TRIM_SERIAL_NO"
                        size="mini"
                        :disabled="formData.TYPE !== '2'"
                    ></el-input>
                </div>
                <div class="flex">
                    <el-radio v-model="formData.TYPE" label="3"
                        >焊装连续编号</el-radio
                    >
                    <el-input
                        v-model="formData.STAR_BODY_SERIAL_NO"
                        size="mini"
                        :disabled="formData.TYPE !== '3'"
                    ></el-input>
                    <div class="width50">-</div>
                    <el-input
                        v-model="formData.END_BODY_SERIAL_NO"
                        size="mini"
                        :disabled="formData.TYPE !== '3'"
                    ></el-input>
                    <div class="label width50">生产线</div>
                    <el-select
                        v-model="formData.LINE_NO"
                        :disabled="formData.TYPE !== '3'"
                    >
                        <el-option
                            v-for="item in lineList"
                            :key="item.LINE_NO"
                            :label="item.LINE_NAME"
                            :value="item.LINE_NO"
                        ></el-option>
                    </el-select>
                    <div class="label">车体顺序区</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import {
    mesApis,
    getIncidentDropdownBox,
    getPointDeviceP,
    queryLineNo,
    saveEquipmentAssign,
} from "@/api/apiList/mes";

export default {
    name: "selectEquipment",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    props: {},
    data() {
        return {
            apiConfig: mesApis.queryReexportEquipment,
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
                    type: "primary",
                    clickEvent: () => this.save(),
                    text: "再编辑输出",
                },
            ],
            tableComponents: [
                {
                    compKey: "POINT_CODE",
                    labelName: "事件",
                    codeField: "POINT_CODE",
                    oFields: "POINT_CODE,POINT_NAME",
                    lookuptype: "_is_null_code_",
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    span: 8,
                    labelWidth: 40,
                    clearbale: true,
                },
            ],
            tableCols: [
                {
                    prop: "DEVICE_ID",
                    label: "接续设备ID",
                },
                {
                    prop: "DEVICE_NAME",
                    label: "接续设备名",
                },
                {
                    prop: "DESCRIPTION",
                    label: "接续设备说明",
                },
            ],
            infoComponents: [
                {
                    compKey: "PROCESS_LOCATION",
                    labelName: "工程",
                    codeField: "PROCESS_LOCATION",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 40,
                },
                {
                    compKey: "POINT_NAME",
                    labelName: "事件",
                    codeField: "POINT_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 40,
                },
                {
                    compKey: "PROCESS_LOCATION_NAME",
                    labelName: "场所",
                    codeField: "PROCESS_LOCATION_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 40,
                },
                {
                    compKey: "ZONE_NAME",
                    labelName: "区域",
                    codeField: "ZONE_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    disabled: true,
                    labelWidth: 40,
                },
            ],
            lineList: [],
            formField: {
                PLANT_CODE: "",
                POINT_CODE: "",
            },
            resultField: {
                PROCESS_LOCATION: "",
                POINT_NAME: "",
                PROCESS_LOCATION_NAME: "",
                ZONE_NAME: "",
            },
            formData: {
                TYPE: "1",
                CTRL_KEY: "",
                NUM: "1",
                DEVICE_IDS: [],
                STAR_TRIM_SERIAL_NO: "",
                END_TRIM_SERIAL_NO: "",
                STAR_BODY_SERIAL_NO: "",
                END_BODY_SERIAL_NO: "",
                LINE_NO: "",
            },
        };
    },
    watch: {
        "formData.TYPE": function (val) {
            if (val === "1") {
                this.formData.STAR_TRIM_SERIAL_NO = "";
                this.formData.END_TRIM_SERIAL_NO = "";
                this.formData.STAR_BODY_SERIAL_NO = "";
                this.formData.END_BODY_SERIAL_NO = "";
                this.formData.LINE_NO = "";
            }
            if (val === "2") {
                this.formData.CTRL_KEY = "";
                this.formData.NUM = "";
                this.formData.STAR_BODY_SERIAL_NO = "";
                this.formData.END_BODY_SERIAL_NO = "";
                this.formData.LINE_NO = "";
            }
            if (val === "3") {
                this.formData.CTRL_KEY = "";
                this.formData.NUM = "";
                this.formData.STAR_TRIM_SERIAL_NO = "";
                this.formData.END_TRIM_SERIAL_NO = "";
            }
        },
    },
    mounted() {
        this.formField.PLANT_CODE = this.$parent.formField.PLANT_CODE;
        this.getIncidentDropdownBox();
        this.queryLineNo();
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        queryLineNo() {
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.lineList = res.rows;
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
            if (this.$refs.multipleTable.selection.length) {
                if (!this.formField.POINT_CODE) {
                    return this.$utils.message({
                        message: "请选择事件！",
                    });
                }
                if (
                    this.formData.TYPE === "1" &&
                    (!this.formData.CTRL_KEY || !this.formData.NUM)
                ) {
                    return this.$utils.message({
                        message: "请填写管理号和输出数！",
                    });
                }
                if (
                    this.formData.TYPE === "2" &&
                    (!this.formData.STAR_TRIM_SERIAL_NO ||
                        !this.formData.END_TRIM_SERIAL_NO)
                ) {
                    return this.$utils.message({
                        message: "请填写总装NO！",
                    });
                }
                if (
                    this.formData.TYPE === "3" &&
                    (!this.formData.STAR_BODY_SERIAL_NO ||
                        !this.formData.END_BODY_SERIAL_NO ||
                        !this.formData.LINE_NO)
                ) {
                    return this.$utils.message({
                        message: "请填写车体顺序号和生产线！",
                    });
                }
                this.formData.DEVICE_IDS = [];
                this.$refs.multipleTable.selection.forEach((item) => {
                    this.formData.DEVICE_IDS.push(item.DEVICE_ID);
                });
                getPointDeviceP({
                    PLANT_CODE: this.formField.PLANT_CODE,
                    DEVICE_IDS: this.formData.DEVICE_IDS.join(),
                    POINT_CODE: this.formField.POINT_CODE,
                })
                    .then((res) => {
                        if (res.result === "1") {
                            if (res.rows[0].DEVICE_ID) {
                                //部分没有关系
                                this.$confirm(
                                    `设备${res.rows[0].DEVICE_ID}与事件${this.formField.POINT_CODE}没有绑定关系，是否继续?`,
                                    "提示",
                                    {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning",
                                    }
                                )
                                    .then(() => {
                                        this.saveEquipmentAssign();
                                    })
                                    .catch(() => {});
                            } else {
                                //全有关系
                                this.saveEquipmentAssign();
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
            } else {
                this.$utils.message({
                    message: "请勾选数据！",
                });
            }
        },
        saveEquipmentAssign() {
            let pram = JSON.parse(JSON.stringify(this.formData));
            pram.PLANT_CODE = this.formField.PLANT_CODE;
            pram.POINT_CODE = this.formField.POINT_CODE;
            saveEquipmentAssign(pram)
                .then((res) => {
                    this.$utils.message({
                        message: res.msg,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getIncidentDropdownBox() {
            getIncidentDropdownBox({
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    this.tableComponents[0].options = [];
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[0].options = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.tableComponents[0].options = [];
                    console.log(err);
                });
        },
        getData(res) {
            this.resultField.PROCESS_LOCATION = res.PROCESS_LOCATION || "";
            this.resultField.POINT_NAME = res.POINT_NAME || "";
            this.resultField.PROCESS_LOCATION_NAME =
                res.PROCESS_LOCATION_NAME || "";
            this.resultField.ZONE_NAME = res.ZONE_NAME || "";
        },
        choose(DEVICE_ID) {
            this.arr.push(DEVICE_ID);
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
    /deep/.table_contain {
        height: calc(100% - 149px) !important;
    }
    .flex {
        display: flex;
    }
    .bottom_wrap {
        padding: 10px 16px;
        line-height: 32px;
        .label {
            flex-shrink: 0;
            font-size: 12px;
        }
        .width50 {
            width: 50px;
            text-align: center;
        }
        .el-input {
            width: 100px;
        }
        .el-select {
            width: 100px;
        }
        .el-radio {
            width: 145px;
        }
    }
}
</style>
