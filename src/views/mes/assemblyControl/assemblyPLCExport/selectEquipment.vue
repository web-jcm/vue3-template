<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="75%"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="总装作业指示PLC指定输出"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <div class="flex_between m_b_10">
                <div class="flex">
                    <div class="m_r_10">生产线</div>
                    <el-select v-model="formField.LINE_NO">
                        <el-option
                            v-for="item in lineList"
                            :key="item.LINE_NO"
                            :label="item.LINE_NAME"
                            :value="item.LINE_NO"
                        ></el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <el-button
                        icon="iconfont icon-search"
                        type="primary"
                        @click="search()"
                        >查询</el-button
                    >
                    <el-button
                        icon="iconfont  icon-preservation"
                        @click="save()"
                        >保存</el-button
                    >
                </div>
            </div>
            <div class="label m_b_10">指定输出候补接续设备一览</div>
            <el-table
                class="m_b_10"
                ref="multipleTable1"
                :data="tableData1"
                v-loading="loading1"
                tooltip-effect="dark"
                height="100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="SUB_LINE_NO"
                    label="生产子线No"
                    align="center"
                >
                </el-table-column>
                <el-table-column prop="SUB_LINE_NAME" label="生产子线名称">
                </el-table-column>
                <el-table-column prop="IPADDRESS" label="IP地址">
                </el-table-column>
            </el-table>
            <div class="label">车辆指定条件</div>
            <div class="search_wrap flex">
                <div class="flex m_r_10">
                    <el-radio v-model="formField.TYPE" label="1"
                        >管理号指定</el-radio
                    >
                    <el-input
                        v-model="formField.CTRL_KEY"
                        size="mini"
                        :disabled="formField.TYPE !== '1'"
                    ></el-input>
                </div>
                <div class="flex">
                    <el-radio v-model="formField.TYPE" label="2"
                        >总装一连NO范围指定</el-radio
                    >
                    <el-input
                        v-model="formField.TRIM_SERIAL_NO_START"
                        size="mini"
                        :disabled="formField.TYPE !== '2'"
                    ></el-input>
                    <div class="width50">-</div>
                    <el-input
                        v-model="formField.TRIM_SERIAL_NO_END"
                        size="mini"
                        :disabled="formField.TYPE !== '2'"
                    ></el-input>
                </div>
            </div>
            <div class="label m_b_10">指定输出车辆信息</div>
            <el-table
                ref="multipleTable2"
                :data="tableData2"
                v-loading="loading2"
                tooltip-effect="dark"
                height="100%"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column prop="LINE_NO" label="生产线">
                </el-table-column>
                <el-table-column prop="CTRL_KEY" label="管理号">
                </el-table-column>
                <el-table-column prop="MODEL" label="车型"></el-table-column>
                <el-table-column prop="COLOR_K" label="外饰色">
                </el-table-column>
                <el-table-column prop="COLOR_I" label="内饰色">
                </el-table-column>
                <el-table-column
                    prop="VIN"
                    width="140"
                    label="VIN码"
                ></el-table-column>
                <el-table-column prop="TRIM_SERIAL_NO" label="总装连续编号">
                </el-table-column>
                <el-table-column prop="DOUKI_NO" label="同期编号">
                </el-table-column>
                <el-table-column prop="ENGINE_NO" label="发动机编号">
                </el-table-column>
                <el-table-column
                    prop="PLAN_DATE7"
                    width="120"
                    label="OFFLINE计划"
                >
                </el-table-column>
                <el-table-column
                    prop="PLAN_DATE8"
                    width="120"
                    label="Final OK计划"
                >
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>
<script>
import {
    queryLineNo,
    queryAssemblyPLCLine,
    queryAssemblyPLCCar,
    saveAssemblyPLCExport,
} from "@/api/apiList/mes";
export default {
    name: "selectEquipment",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        plantCode: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            formField: {
                PLANT_CODE: "",
                LINE_NO: "",
                CTRL_KEY: "",
                TRIM_SERIAL_NO_START: "",
                TRIM_SERIAL_NO_END: "",
                TYPE: "1",
            },
            lineList: [],
            tableData1: [],
            tableData2: [],
            loading1: false,
            loading2: false,
            selection: [],
        };
    },
    watch: {
        "formField.LINE_NO": function () {
            this.tableData1 = [];
            this.queryAssemblyPLCLine();
        },
    },
    created() {
        this.formField.PLANT_CODE = this.plantCode;
        this.queryLineNo();
    },
    methods: {
        search() {
            this.tableData2 = [];
            this.queryAssemblyPLCCar();
        },
        queryLineNo() {
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.lineList = res.rows;
                        this.formField.LINE_NO = res.rows[0].LINE_NO;
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
        queryAssemblyPLCLine() {
            this.loading1 = true;
            queryAssemblyPLCLine({
                PLANT_CODE: this.formField.PLANT_CODE,
                LINE_NO: this.formField.LINE_NO,
                PROCESS_LOCATION: "T",
            })
                .then((res) => {
                    this.loading1 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData1 = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading1 = false;
                    console.log(err);
                });
        },
        queryAssemblyPLCCar() {
            this.loading2 = true;
            queryAssemblyPLCCar({
                PLANT_CODE: this.formField.PLANT_CODE,
                CTRL_KEY: this.formField.CTRL_KEY,
                TRIM_SERIAL_NO_START: this.formField.TRIM_SERIAL_NO_START,
                TRIM_SERIAL_NO_END: this.formField.TRIM_SERIAL_NO_END,
            })
                .then((res) => {
                    this.loading2 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData2 = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading2 = false;
                    console.log(err);
                });
        },
        save() {
            if (!this.selection.length) {
                return this.$utils.message({
                    message: "请选择生产线！",
                });
            }
            if (!this.tableData2.length) {
                return this.$utils.message({
                    message: "请查询车辆！",
                });
            }
            this.$confirm("是否保存数据?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let pram = {
                        PLANT_CODE: this.formField.PLANT_CODE,
                        LINE_NO: this.formField.LINE_NO,
                        ROWS1: [{ SUB_LINE_NO: [] }],
                        ROWS2: [{ CTRL_KEY: [] }],
                    };
                    this.selection.forEach((item) => {
                        pram.ROWS1[0].SUB_LINE_NO.push(item.SUB_LINE_NO);
                    });
                    this.tableData2.forEach((item) => {
                        pram.ROWS2[0].CTRL_KEY.push(item.CTRL_KEY);
                    });
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveAssemblyPLCExport(pram)
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
        },
        handleSelectionChange(val) {
            this.selection = val;
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
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    line-height: 32px;
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .m_r_10 {
        margin-right: 10px;
    }
    .label {
        font-size: 14px;
        font-weight: bold;
    }
    .flex_between {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search_wrap {
        padding: 10px 0px;
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
            width: 120px;
        }
    }
}
</style>
