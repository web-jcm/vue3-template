<template>
    <div class="app-container app-container-table">
        <el-row class="halfBottom text-center padding-bottom-20">
            <el-col :span="8">
                <div class="text-center">
                    Andon状态：<span class="important">{{
                        andonInfo.andonType
                    }}</span>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="text-center">
                    持续时长：<span class="important">{{
                        andonInfo.standTime
                    }}</span>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="text-center">
                    报警时间：<span class="important">{{
                        andonInfo.andonTime
                    }}</span>
                </div>
            </el-col>
        </el-row>
        <el-card
            class="cardStyle"
            v-loading="loading"
            style="overflow-y: scroll; padding-top: 0"
        >
            <el-col
                class="colStyle-33"
                :span="8"
                v-for="item in andonList"
                :key="item.tableId"
            >
                <el-button
                    class="colButton"
                    type="primary"
                    :disabled="!isCouldClick"
                    @click="changeBtn(item)"
                >
                    {{ item.andonType }}
                </el-button>
            </el-col>
        </el-card>
        <el-row>
            <el-button
                type="success"
                class="cancelBtn"
                :disabled="isCouldClick"
                @click="confirm"
                >解除警报</el-button
            >
        </el-row>
    </div>
</template>
<script>
import {
    queryAndonType,
    queryandoninfo,
    callandoninfo,
    relieveandoninfo,
} from "@/api/apiList/mes";
import Moment from "moment";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        pointCode: {
            type: String,
            default: "0",
        },
        currentCarInfo: {},
        plantInfo: {},
    },
    data() {
        return {
            isCouldClick: true,
            loading: false,
            andonInfo: {
                andonType: undefined,
                standTime: undefined,
                andonTime: undefined,
                andonCode: undefined,
                isStopLine: false,
            },
            form: {
                noticeTitle: undefined,
                createdDateSE: [
                    Moment(new Date()).startOf("day"),
                    Moment(new Date()).endOf("day"),
                ],
                noticeType: "",
                isRead: "",
            },
            currentAndon: undefined,
            andonList: [],
        };
    },
    created() {
        this.queryAndonType();
    },
    watch: {
        currentCarInfo: {
            handler(newValue, oldValue) {
                if (newValue) {
                    if (
                        !oldValue ||
                        (oldValue && newValue.ctrlKey != oldValue.ctrlKey)
                    ) {
                        //
                    }
                }
            },
            deep: true,
            immediate: true,
        },
        plantInfo: {
            handler(newValue, oldValue) {
                if (newValue) {
                    if (newValue.processLocation) {
                        this.queryandoninfo();
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
        queryandoninfo() {
            const _this = this;
            const params = {
                plantCode: this.$PLANT_CODE,
                processLocation: this.plantInfo.processLocation,
                lineNo: this.plantInfo.lineNo,
                pointCode: this.pointCode,
                andonStatus: "1",
            };
            queryandoninfo(params).then((res) => {
                if (res.result === "1") {
                    // console.log(res.rows)
                    if (res.rows.length > 0) {
                        const item = res.rows[0];
                        this.andonInfo.andonType = item.andonType;
                        this.andonInfo.andonCode = item.andonCode;
                        this.andonInfo.andonTime = Moment(item.andonSdt).format(
                            "YYYY-MM-DD HH:mm:ss"
                        );
                        this.timer = setInterval(() => {
                            _this.date = new Date(); // 修改数据date
                            //计算停留时间
                            if (_this.andonInfo.andonTime) {
                                const end_date = Moment(_this.date);
                                const start_date = Moment(
                                    _this.andonInfo.andonTime
                                );
                                const eTime = end_date.diff(
                                    start_date,
                                    "seconds"
                                );
                                // console.log(eTime);
                                // console.log(this.changeSecondsTo(eTime));
                                _this.andonInfo.standTime =
                                    _this.changeSecondsTo(eTime);
                            }
                        }, 1000);
                        this.isCouldClick = false;
                    }
                }
            });
        },
        queryAndonType() {
            const params = {
                plantCode: this.$PLANT_CODE,
            };
            queryAndonType(params).then((res) => {
                // if (res.result === "1") {
                // console.log(res.rows)
                this.andonList = res.rows;

                // }
            });
        },
        changeBtn(item) {
            this.$confirm(
                "确认进行【" + item.andonType + "】 Andon？",
                "提示",
                {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                }
            )
                .then(() => {
                    this.andonInfo.isStopLine = "0";
                    this.dealAndon(item);
                    // this.$confirm("是否停线？", "提示", {
                    //     distinguishCancelAndClose: true,
                    //     confirmButtonText: "停线",
                    //     cancelButtonText: "不停线",
                    // })
                    //     .then(() => {
                    //         //停线
                    //         this.andonInfo.isStopLine = "1";
                    //         this.dealAndon(item);
                    //     })
                    //     .catch((action) => {
                    //         //不停线
                    //         if (action === "cancel") {

                    //         }
                    //     });
                })
                .catch((action) => {});
        },
        dealAndon(item) {
            const _this = this;
            this.currentAndon = item;
            this.andonInfo.andonType = item.andonType;
            this.andonInfo.andonCode = item.andonCode;
            this.andonInfo.andonTime = Moment(new Date()).format(
                "YYYY-MM-DD HH:mm:ss"
            );

            const params = {
                plantCode: this.$PLANT_CODE,
                processLocation: this.plantInfo.processLocation,
                lineNo: this.plantInfo.lineNo,
                pointCode: this.pointCode,
                andonSdt: this.andonInfo.andonTime,
                andonCode: this.andonInfo.andonCode,
                andonType: this.andonInfo.andonType,
                isStopLine: this.andonInfo.isStopLine,
            };
            this.loading = true;
            callandoninfo(params).then((res) => {
                this.loading = false;
                if (res.result === "1") {
                    this.isCouldClick = !this.isCouldClick;
                    this.$message({
                        message: res.msg,
                        type: "success",
                    });
                    this.timer = setInterval(() => {
                        _this.date = new Date(); // 修改数据date
                        //计算停留时间
                        if (_this.andonInfo.andonTime) {
                            const end_date = Moment(_this.date);
                            const start_date = Moment(
                                _this.andonInfo.andonTime
                            );
                            const eTime = end_date.diff(start_date, "seconds");
                            // console.log(eTime);
                            // console.log(this.changeSecondsTo(eTime));
                            _this.andonInfo.standTime =
                                _this.changeSecondsTo(eTime);
                        }
                    }, 1000);
                } else {
                    this.$message({
                        message: res.msg,
                        type: "error",
                    });
                    this.currentAndon = {};
                    this.andonInfo.andonType = undefined;
                    this.andonInfo.andonTime = undefined;
                    this.andonInfo.standTime = undefined;
                    this.andonInfo.andonCode = undefined;
                    this.andonInfo.isStopLine = false;
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
        confirm() {
            this.$confirm("确认解除Andon警报？", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            })
                .then(() => {
                    const params = {
                        plantCode: this.$PLANT_CODE,
                        processLocation: this.plantInfo.processLocation,
                        lineNo: this.plantInfo.lineNo,
                        pointCode: this.pointCode,
                        andonSdt: this.andonInfo.andonTime,
                        andonEdt: Moment(new Date()).format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                        andonCode: this.andonInfo.andonCode,
                        andonType: this.andonInfo.andonType,
                        isStopLine: this.andonInfo.isStopLine,
                    };
                    this.loading = true;
                    relieveandoninfo(params).then((res) => {
                        this.loading = false;
                        if (res.result === "1") {
                            this.isCouldClick = !this.isCouldClick;
                            this.$message({
                                message: res.msg,
                                type: "success",
                            });
                            this.andonInfo.andonType = undefined;
                            this.andonInfo.andonTime = undefined;
                            this.andonInfo.standTime = undefined;
                            this.andonInfo.andonCode = undefined;
                            this.andonInfo.isStopLine = false;
                            if (this.timer) {
                                clearInterval(this.timer);
                            }
                        } else {
                            this.$message({
                                message: res.msg,
                                type: "error",
                            });
                        }
                    });
                })
                .catch((action) => {});
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/ .el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
    color: #c0c4cc !important;
    cursor: not-allowed;
    background-image: none;
    background-color: gray !important;
    border-color: #ebeef5 !important;
}
.halfStyle {
    height: 50%;
    text-align: left;
}
.colStyle-33 {
    height: 138px;
}
.cardStyle {
    height: calc(100vh - 340px);
    // overflow: scroll;
}
.colDiv {
    height: 108px;
}

.colButton {
    height: 100px;
    width: 250px;
    margin-top: 50px;
    margin-bottom: 50px;
}

.cancelBtn {
    width: 600px;
    height: 100px;
    margin-top: 20px;
}
.currentStyle {
    background-color: white;
    margin-bottom: 10px;
}
.margin-top-10 {
    margin-top: 10px;
}

.padding-bottom-20 {
    padding-bottom: 20px;
}

.margin-left-10 {
    margin-left: 10px;
}
.nextStyle {
    background-color: white;
}
.bg-blue {
    background-color: #00b2ff;
    color: red;
}

.halfBottom {
    border-bottom: 1px solid gray;
}

/deep/ .el-tag--medium {
    height: 50px;
    line-height: 50px;
    font-size: 32px;
}
.rowStyle-20 {
    height: 20%;
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
    font-size: 28px;
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

.important {
    color: red;
}

/deep/ .el-table {
    height: 100%;
    font-size: 28px;
    position: relative;
}

/deep/ .el-table__empty-text {
    position: absolute;
    display: block;
    width: 105px;
    height: 90px;
    left: calc(50% - 52.5px);
    background: url(/vue-dist/mesControl/static/img/biaogewushuju@1x.c9f9c8d6.png)
        no-repeat top;
    background-size: 100% 100%;
    color: #909399;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // line-height: 180px;
    font-size: 24px;
}
</style>
