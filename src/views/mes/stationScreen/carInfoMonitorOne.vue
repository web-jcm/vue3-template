<template>
    <div class="app-container app-container-table">
        <el-tag type="danger" size="medium" class="bg-red">当前车辆</el-tag>
        <div class="halfStyle currentStyle" v-loading="loading">
            <el-row
                class="rowStyle-33 halfBottom text-center"
                v-if="srcMenuCode === 'MESPV1101'"
            >
                <el-col :span="24">
                    <div class="flex">
                        <div class="label">管理号：</div>
                        <el-input
                            class="width-300"
                            type="text"
                            placeholder="请输入内容"
                            v-model="form.ctrlKey"
                        ></el-input>
                        <el-button
                            type="primary"
                            class="buttonStyle"
                            @click="AGVBinding"
                            >绑定AGV</el-button
                        >
                    </div>
                </el-col>
            </el-row>
            <el-row
                class="rowStyle-33 halfBottom text-center"
                v-if="srcMenuCode === 'MESPV1102'"
            >
                <el-col :span="24">
                    <div class="flex">
                        <el-button
                            type="primary"
                            class="buttonStyle"
                            @click="changeNextCar"
                            >切换下一辆车</el-button
                        >
                    </div>
                </el-col>
            </el-row>
            <el-row
                class="rowStyle-33 halfBottom text-center"
                v-if="srcMenuCode === 'MESPV1103'"
            >
                <el-col :span="24">
                    <div class="flex">
                        <el-select
                            v-model="form.type"
                            class="buttonStyle width-100"
                        >
                            <el-option
                                class="optionStyle"
                                v-for="item in typeArr"
                                :label="item.name"
                                :value="item.name"
                                :key="item.name"
                            ></el-option>
                        </el-select>
                        <el-input
                            class="width-300 buttonStyle"
                            type="text"
                            placeholder="请输入内容"
                            v-model="form.ctrlKey"
                        ></el-input>
                        <el-button
                            type="primary"
                            class="buttonStyle"
                            @click="SetCurrentCar"
                            >切换为当前车辆</el-button
                        >
                    </div>
                </el-col>
            </el-row>
            <el-row class="rowStyle-33">
                <el-col :span="6">
                    <div class="flex margin-left-10">
                        管理号：{{ currentCarInfo.ctrlKey }}
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="flex">车　型：{{ currentCarInfo.model }}</div>
                </el-col>

                <el-col :span="9">
                    <div class="flex">VIN：{{ currentCarInfo.vinNO }}</div>
                </el-col>
            </el-row>
            <el-row class="rowStyle-33">
                <el-col :span="5">
                    <div class="flex margin-left-10">
                        车身色：{{ currentCarInfo.colorK }}
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="flex">内饰色：{{ currentCarInfo.colorI }}</div>
                </el-col>
                <el-col :span="5">
                    <div class="flex">
                        连续编号：{{ currentCarInfo.bodySerialNo }}
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="flex">
                        停留时长：<span class="important">{{ standTime }}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-tag type="success" size="medium" class="margin-top-10 bg-green"
            >下一辆车</el-tag
        >
        <div class="halfStyle nextStyle">
            <el-row class="rowStyle-33">
                <el-col :span="6">
                    <div class="flex margin-left-10">
                        管理号：{{ nextCar.CTRL_KEY }}
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="flex">车　型：{{ nextCar.MODEL }}</div>
                </el-col>

                <el-col :span="9">
                    <div class="flex">VIN：{{ nextCar.VIN_NO }}</div>
                </el-col>
            </el-row>
            <el-row class="rowStyle-33">
                <el-col :span="5">
                    <div class="flex margin-left-10">
                        车身色：{{ nextCar.COLOR_K }}
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="flex">内饰色：{{ nextCar.COLOR_I }}</div>
                </el-col>
                <el-col :span="5">
                    <div class="flex">
                        连续编号：{{ nextCar.BODY_SERIAL_NO }}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import {
    queryPointNotice,
    pointNoticeRead,
    queryProductionQueue,
    AGVBinding,
} from "@/api/apiList/mes";
import Moment from "moment";
import { emit } from "process";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        pointCode: {
            type: String,
            default: "0",
        },
        srcMenuCode: {
            type: String,
            default: "0",
        },
        currentCarInfo: {},
        plantInfo: {},
    },
    data() {
        return {
            loading: false,
            typeArr: [{ name: "管理号" }, { name: "VIN" }],
            standTime: undefined,
            nextCar: {},
            form: {
                type: "管理号",
                ctrlKey: undefined,
            },

            tableData: [],
        };
    },
    created() {},
    watch: {
        currentCarInfo: {
            handler(newValue, oldValue) {
                if (newValue) {
                    // console.log(newValue)
                    let _this = this;
                    if (
                        !oldValue ||
                        (oldValue && newValue.ctrlKey != oldValue.ctrlKey)
                    ) {
                        this.timer = setInterval(() => {
                            _this.date = new Date(); // 修改数据date
                            //计算停留时间
                            if (_this.currentCarInfo.arriveDT) {
                                const end_date = Moment(_this.date);
                                const start_date = Moment(
                                    _this.currentCarInfo.arriveDT
                                );
                                const eTime = end_date.diff(
                                    start_date,
                                    "seconds"
                                );
                                // console.log(eTime);
                                // console.log(this.changeSecondsTo(eTime));
                                _this.standTime = _this.changeSecondsTo(eTime);
                            }
                        }, 1000);
                        //查询生产队列
                        this.queryProductionQueue(newValue.ctrlKey);
                    }
                }
            },
            deep: true,
            immediate: true,
        },
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        SetCurrentCar() {
            if (!this.form.ctrlKey) {
                this.$alert("请输入需要绑定的数据！", "提示");
                return;
            }
            let ec = {};
            if (this.form.type == "VIN") {
                ec.vin = this.form.ctrlKey;
                ec.ctrlKey = undefined;
            } else {
                ec.ctrlKey = this.form.ctrlKey;
                ec.vin = undefined;
            }
            this.$confirm("是否确定切换当前车辆？", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "切换",
                cancelButtonText: "取消",
            })
                .then(() => {
                    //绑定
                    this.BingCar(ec);
                })
                .catch((action) => {
                    if (action === "cancel") {
                    }
                });
        },
        changeNextCar() {
            if (this.nextCar.CTRL_KEY) {
                let ec = {};
                ec.ctrlKey = this.nextCar.CTRL_KEY;
                this.$confirm("是否确定切换当前车辆？", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "切换",
                    cancelButtonText: "取消",
                })
                    .then(() => {
                        //绑定
                        this.BingCar(ec);
                    })
                    .catch((action) => {
                        if (action === "cancel") {
                        }
                    });
            } else {
                this.$alert("没有下一辆车可供切换！", "提示");
            }
        },
        AGVBinding() {
            if (!this.form.ctrlKey) {
                this.$alert("请输入需要绑定的管理号！", "提示");
                return;
            }
            let ec = {};
            ec.ctrlKey = this.form.ctrlKey;
            this.$confirm("是否确定切换当前车辆？", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "切换",
                cancelButtonText: "取消",
            })
                .then(() => {
                    //绑定
                    this.BingCar(ec, "1");
                })
                .catch((action) => {
                    if (action === "cancel") {
                    }
                });
        },
        BingCar(ec, isAGV) {
            const params = {
                pointCode: this.pointCode,
                PLANT_CODE: this.$PLANT_CODE,
                PROCESS_LOCATION: this.plantInfo.processLocation,
                LINE_NO: this.plantInfo.lineNo,
                POINT_CODE: this.pointCode,
                POINT_TYPE: "1",
                SEND_AGV: isAGV,
                EVENT_DATE: Moment(new Date()).format("yyyyMMDDHHmmss"),
                ARRIVE_DT: Moment(new Date()).format("yyyy-MM-DD HH:mm:ss.SSS"),
            };
            if (ec.ctrlKey) {
                params.CTRL_KEY = ec.ctrlKey;
            }
            if (ec.vin) {
                params.VIN = ec.vin;
            }
            this.loading = true;
            AGVBinding(params).then((res) => {
                // console.log(res)
                this.loading = false;
                if (res.result === "1") {
                    this.$message("AGV绑定成功", "提示");
                    this.$emit("changeCurrentCar");
                } else {
                    this.$message(res.msg, "提示");
                }
            });
        },
        changeSecondsTo(num) {
            const s = num % 60;
            const m = parseInt((num % 3600) / 60);
            const h = parseInt(num / 3600);
            let str =
                (h ? h + "小时" : "") +
                (m ? m + "分钟" : "") +
                (s ? s + "秒" : "");

            return str;
        },
        queryProductionQueue(ctrlKey) {
            const params = {
                plantCode: this.$PLANT_CODE,
                ctrlKey: ctrlKey,
                pointCode: this.pointCode,
            };
            this.nextCar = {};
            queryProductionQueue(params).then((res) => {
                if (res.result === "1") {
                    if (res.rows.length > 1) {
                        this.nextCar = res.rows[1];
                    }
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.halfStyle {
    height: 50%;
    text-align: left;
}

.currentStyle {
    background-color: white;
    margin-bottom: 10px;
}
.margin-top-10 {
    margin-top: 10px;
}

.margin-left-10 {
    margin-left: 10px;
}
.nextStyle {
    background-color: white;
}
.bg-red {
    background-color: #e9c4c4;
}
.bg-green {
    background-color: #c7efb0;
}

.halfBottom {
    border-bottom: 1px solid gray;
}

/deep/ .el-tag--medium {
    height: 50px;
    line-height: 50px;
    font-size: 32px;
}
.rowStyle-33 {
    height: 33%;
}

.flex {
    display: flex;
    align-items: center;
    height: 100%;
    text-align: left;
}

.label {
    flex-shrink: 0;
    width: 135px;
    text-align: left;
    margin-left: 10px;
}

/deep/ .el-col {
    position: relative;
    font-size: 32px;
    height: 100%;
}

.text-center {
    text-align: center;
}

.height-100 {
    height: 100%;
}

.buttonStyle {
    height: 48px;
    margin-left: 30px;
}

/deep/ .el-button span {
    font-size: 18px;
    padding: 0 5px;
    vertical-align: bottom;
}

/deep/ .el-input--small .el-input__inner {
    height: 48px !important;
    line-height: 48px;
    color: #333;
    padding-left: 8px;
    min-width: 0px;
    font-size: 24px;
}

.width-300 {
    width: 300px;
}

.width-100 {
    width: 150px;
}

.optionStyle {
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    padding: 0 8px;
}

/deep/ .width-100 .el-input .el-input__suffix .el-input__suffix-inner {
    line-height: 48px !important;
}
.important {
    color: red;
}
</style>
