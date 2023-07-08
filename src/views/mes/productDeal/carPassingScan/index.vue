<template>
    <el-container class="height-100" v-loading.fullscreen.lock="isLoading">
        <el-header height="40%">
            <el-row class="rowStyle">
                <el-col :span="6" class="margin-left-10"
                    ><b>{{ pointName || "无工位信息" }}</b></el-col
                >
                <el-col :span="5"
                    ><span v-show="showNetState" style="color: green">在线</span
                    ><span v-show="!showNetState" style="color: red"
                        >离线</span
                    ></el-col
                >
                <el-col :span="12" class="text-right"
                    ><span class="time-show"
                        ><b>{{ dateFormat(date) }}　{{ week }}</b></span
                    ></el-col
                >

                <el-col :span="24" class="text-right"
                    ><span
                        class="time-show"
                        style="margin-right: 50px; font-size: 24px"
                        >班次: <b>{{ numStatic.SHIFT }}</b
                        >　当班计划:
                        <span style="color: green"
                            ><b>{{ numStatic.PLAN_COUNT }}</b></span
                        >
                        　当班实绩:
                        <span style="color: green"
                            ><b>{{ numStatic.ACHV_COUNT }}</b></span
                        >　差异:
                        <span style="color: red"
                            ><b>{{ numStatic.DIFF_COUNT }}</b></span
                        ></span
                    ></el-col
                >
            </el-row>
            <el-row class="rowStyle5">
                <el-col :span="24" class="margin-left-10"
                    >上一台车辆信息</el-col
                >
            </el-row>
            <el-row class="rowStyle text-center">
                <el-col :span="4" class="text-right"> <b>管理号:</b> </el-col>
                <el-col :span="8" class="text-left">
                    <b>　{{ lastCarInfo.CTRL_KEY }}</b>
                </el-col>
                <el-col :span="2" class="text-right"> <b>VIN:</b> </el-col>
                <el-col :span="10" class="text-left">
                    <b>　{{ lastCarInfo.VIN }}</b>
                </el-col>
                <el-col
                    :span="4"
                    v-if="processLocation != 'M'"
                    class="text-right"
                >
                    <b>VSN:</b>
                </el-col>
                <el-col
                    :span="8"
                    v-if="processLocation != 'M'"
                    class="text-left"
                >
                    <b>　{{ lastCarInfo.MODEL }}</b>
                </el-col>
                <el-col
                    :span="2"
                    v-if="processLocation != 'M'"
                    class="text-right"
                >
                    <b>颜色:</b>
                </el-col>
                <el-col
                    :span="10"
                    v-if="processLocation != 'M'"
                    class="text-left"
                >
                    <b
                        >　{{ lastCarInfo.COLOR_K_NAME
                        }}<span v-if="lastCarInfo.COLOR_K"
                            >({{ lastCarInfo.COLOR_K }})</span
                        ></b
                    >
                </el-col>
                <el-col
                    :span="4"
                    v-if="processLocation == 'M'"
                    class="text-right"
                >
                    <b>连续编号:</b>
                </el-col>
                <el-col
                    :span="8"
                    v-if="processLocation == 'M'"
                    class="text-left"
                >
                    <b>　{{ lastCarInfo.BODY_SERIAL_NO }}</b>
                </el-col>
                <el-col
                    :span="2"
                    v-if="processLocation == 'M'"
                    class="text-right"
                >
                    <b>VSN:</b>
                </el-col>
                <el-col
                    :span="10"
                    v-if="processLocation == 'M'"
                    class="text-left"
                >
                    <b>　{{ lastCarInfo.MODEL }}</b>
                </el-col>
                <!-- <el-col :span="12"> <b>管理号:{{lastCarInfo.CTRL_KEY}}</b> </el-col> -->
                <!-- <el-col :span="12">
          <span><b>VIN:{{lastCarInfo.VIN}}</b> </span>
        </el-col>
        <el-col :span="12"> <b>车型:{{lastCarInfo.MODEL}}</b> </el-col>
        <el-col :span="12"> <b>颜色:{{lastCarInfo.COLOR_K}}</b> </el-col> -->
            </el-row>
        </el-header>

        <el-main class="mainContent">
            <el-row
                class="rowStyle2"
                :style="{ 'background-color': mainColor }"
            >
                <el-col :span="24" class="warnStyle"
                    ><span>本次车辆扫描</span>
                </el-col>
            </el-row>
            <el-row
                class="rowStyle3"
                :style="{ 'background-color': mainColor }"
            >
                <div class="divMain">
                    <div class="vinStyle">VIN</div>
                    <el-input
                        class="inputStyle"
                        @keydown.enter.native="showCarInfo($event)"
                        ref="inputVIN"
                        :autofocus="focusVIN"
                        placeholder="VIN码可输入后6位搜索"
                        @focus="focusInput"
                        @blur="focusInput"
                        v-model="inputVIN"
                    ></el-input>
                </div>
            </el-row>
            <el-row class="rowStyle4 text-center">
                <el-col :span="4" class="text-right"> <b>管理号:</b> </el-col>
                <el-col :span="8" class="text-left">
                    <b>　{{ currCarInfo.CTRL_KEY }}</b>
                </el-col>
                <el-col :span="2" class="text-right"> <b>VIN:</b> </el-col>
                <el-col :span="10" class="text-left">
                    <b>　{{ currCarInfo.VIN_NO }}</b>
                </el-col>
                <el-col
                    :span="4"
                    v-if="processLocation != 'M'"
                    class="text-right"
                >
                    <b>VSN:</b>
                </el-col>
                <el-col
                    :span="8"
                    v-if="processLocation != 'M'"
                    class="text-left"
                >
                    <b>　{{ currCarInfo.MODEL }}</b>
                </el-col>
                <el-col
                    :span="2"
                    v-if="processLocation != 'M'"
                    class="text-right"
                >
                    <b>颜色:</b>
                </el-col>
                <el-col
                    :span="10"
                    v-if="processLocation != 'M'"
                    class="text-left"
                >
                    <b
                        >　{{ currCarInfo.COLOR_K_NAME
                        }}<span v-if="currCarInfo.COLOR_K"
                            >({{ currCarInfo.COLOR_K }})</span
                        ></b
                    >
                </el-col>
                <el-col
                    :span="4"
                    v-if="processLocation == 'M'"
                    class="text-right"
                >
                    <b>连续编号:</b>
                </el-col>
                <el-col
                    :span="8"
                    v-if="processLocation == 'M'"
                    class="text-left"
                >
                    <b>　{{ currCarInfo.BODY_SERIAL_NO }}</b>
                </el-col>
                <el-col
                    :span="2"
                    v-if="processLocation == 'M'"
                    class="text-right"
                >
                    <b>VSN:</b>
                </el-col>
                <el-col
                    :span="10"
                    v-if="processLocation == 'M'"
                    class="text-left"
                >
                    <b>　{{ currCarInfo.MODEL }}</b>
                </el-col>
            </el-row>
            <el-row class="rowStyle2" style="background-color: #eeece1">
                <el-col
                    :span="24"
                    class="warnSpan"
                    :style="{
                        color: mainColor != 'red' ? warnColor : mainColor,
                    }"
                    >{{ showMsg }}
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import { orgApis } from "@/api/apiList/org";
import Moment from "moment";
import {
    queryCarMonitor,
    getPassingPoint,
    queryMyPoint,
    passPointByProductType,
    showCarInfo,
    queryLastCar,
    queryCurrCar,
    getTraceResult,
    queryStatistics,
    queryPassCount,
} from "@/api/apiList/mes";

// import myMarquee from "./my-marquee";

export default {
    name: "carPassingScan",
    components: {},
    // 组件混入对象
    mixins: [],
    data() {
        return {
            pointName: "",
            pointCode: "",
            ctrlKey: "",
            showMsg: "",
            focusVIN: true,
            mainColor: "lightgray",
            showNetState: true,
            isLoading: false,
            lastCarInfo: {},
            currCarInfo: {},
            numStatic: {},
            canScanVIN: true,
            inputVIN: undefined,
            processLocation: "",
            // mainColor: "red",
            date: new Date(),
            week: this.getWeek(new Date()),
        };
    },
    created() {
        document.documentElement.requestFullscreen();
        //显示当前日期时间
        let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
        this.timer = setInterval(() => {
            _this.date = new Date(); // 修改数据date
            _this.week = _this.getWeek(_this.date);
            if (navigator && navigator.onLine) {
                this.showNetState = true;
            } else {
                this.showNetState = false;
            }
        }, 1000);
        this.$nextTick(() => {
            //   this.vinF()
            this.$refs.inputVIN.focus();
        });
        // this.init()
        // this.serical()
        this.queryMyPoint();
        this.addScanMonitor();
        this.timer2 = setInterval(() => {
            _this.queryStatistics();
        }, 60000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (this.timer2) {
            clearInterval(this.timer2);
        }
        // this.reader.releaseLock()
        // this.port.close()
    },
    methods: {
        // 监听扫描
        addScanMonitor() {
            window.document.onkeypress = (e) => {
                // console.log(e)
                if (window.event) {
                    // IE
                    this.nextCode = e.keyCode;
                } else if (e.which) {
                    // Netscape/Firefox/Opera
                    this.nextCode = e.which;
                }

                if (e.which === 13) {
                    // 键盘回车事件
                    if (this.code.length < 3) return; // 扫码枪的速度很快，手动输入的时间不会让code的长度大于2，所以这里不会对扫码枪有效
                    // console.log('扫码结束,条形码：', this.code)
                    this.focusVIN = true;
                    this.$nextTick(function () {
                        this.$refs.inputVIN.select();
                    });
                    this.inputVIN = this.code.trim();
                    this.code = undefined;
                    this.showCarInfo();
                    // this.scanningForm.scanCode = this.code
                    this.lastCode = "";
                    this.lastTime = "";
                    // this.handleSubmitScanning()
                    return;
                }

                this.nextTime = new Date().getTime();
                if (!this.lastTime && !this.lastCode) {
                    this.code = ""; // 清空上次的条形码
                    // 继续扫描一下条前关闭弹窗
                    // this.handleCloseTipsVisible()
                    this.code += e.key;
                    // console.log('扫码开始---', this.code)
                }
                if (
                    this.lastCode &&
                    this.lastTime &&
                    this.nextTime - this.lastTime > 500
                ) {
                    // 当扫码前有keypress事件时,防止首字缺失
                    this.code = e.key;
                    // console.log('防止首字缺失。。。', this.code)
                } else if (this.lastCode && this.lastTime) {
                    this.code += e.key;
                    // console.log('扫码中。。。', this.code)
                }
                this.lastCode = this.nextCode;
                this.lastTime = this.nextTime;
            };
        },
        onReset() {
            this.showMsg = undefined;
            this.currCarInfo = {};
        },
        focusInput() {
            this.inputVIN = undefined;
            this.mainColor = "lightgray";
            this.showMsg = undefined;
            this.currCarInfo = {};
            if (this.pointCode) {
                this.queryLastCar();
            }
        },
        //获取我的工位
        queryMyPoint() {
            queryMyPoint().then((res) => {
                console.log(res);
                if (res.result === "1") {
                    console.log(res);
                    if (res.rows.userName) {
                        this.pointName = res.rows.pointName;
                        this.pointCode = res.rows.pointCode;
                        this.processLocation = res.rows.processLocation;
                        this.queryLastCar();
                        this.queryStatistics();
                        // this.plantInfo.pointCode = this.pointCode
                    }
                } else {
                    this.$alert("请配置用户与工位的关系！", "提示");
                }
            });
        },
        queryLastCar() {
            const params = {
                pointCode: this.pointCode,
            };
            queryLastCar(params).then((res) => {
                if (res.result === "1") {
                    if (res.rows.CTRL_KEY) {
                        this.lastCarInfo = res.rows;
                    } else {
                        this.lastCarInfo = {};
                    }

                    console.log(res);
                } else {
                    this.$alert("请配置用户与工位的关系！", "提示");
                }
            });
        },
        showCarInfo() {
            if (this.inputVIN) {
                this.inputVIN = this.inputVIN.toUpperCase();
            }
            this.queryLastCar();
            if (this.canScanVIN) {
                this.canScanVIN = false;
                setTimeout(() => {
                    this.canScanVIN = true;
                }, 200);
            } else {
                return;
            }
            // console.log(e)
            // e.target.select()
            // this.checkAllCollection()
            this.$nextTick(function () {
                this.$refs.inputVIN.select();
            });

            if (!this.inputVIN || this.inputVIN.length < 6) {
                this.showMsg = "至少输入6位进行搜索！";
                this.mainColor = "red";
                return;
            }
            const params = {
                PLANT_CODE: "K",
                searchValue: this.inputVIN,
            };
            if (this.inputVIN.length == 17 || this.inputVIN.length == 16) {
                if (this.inputVIN.length == 17) {
                    params.searchKey = "vin";
                } else if (this.inputVIN.length == 16) {
                    params.searchKey = "inner_code";
                }
                this.isLoading = true;
                showCarInfo(params).then((res) => {
                    this.isLoading = false;
                    console.log(res);
                    if (res.result === "1") {
                        console.log(res);
                        if (res.rows.length > 0) {
                            this.currCarInfo = res.rows[0];
                            this.$nextTick(function () {
                                this.$refs.inputVIN.select();
                            });
                            this.ctrlKey = res.rows[0].CTRL_KEY;
                            if (
                                this.pointCode == "110" ||
                                this.pointCode == "120"
                            ) {
                                // this.ORDER_ID = res.rows[0].ORDER_ID
                                // this.VIN_NO = res.rows[0].VIN_NO
                                this.checkAllCollection(res.rows[0]);
                            } else {
                                this.passPoint();
                            }

                            // this.plantInfo.pointCode = this.pointCode
                        } else {
                            this.showMsg = "未查询到车辆信息！";
                            this.mainColor = "red";
                        }
                    } else {
                        this.showMsg = res.msg;
                        this.mainColor = "red";
                    }
                });
            } else {
                // if(this.inputVIN.length>17){
                //   this.inputVIN = this.inputVIN.substr(-17)
                // }
                const temp = {
                    vin: this.inputVIN,
                };
                this.isLoading = true;
                queryCurrCar(temp).then((res) => {
                    this.isLoading = false;
                    console.log(res);
                    this.$nextTick(function () {
                        this.$refs.inputVIN.select();
                    });
                    if (res.result === "1") {
                        console.log(res);
                        // this.currCarInfo = res.rows[0]
                        if (res.rows.length > 0) {
                            this.currCarInfo = res.rows[0];
                            this.ctrlKey = res.rows[0].CTRL_KEY;
                            if (
                                this.pointCode == "110" ||
                                this.pointCode == "120"
                            ) {
                                // this.ORDER_ID = res.rows[0].ORDER_ID
                                // this.VIN_NO = res.rows[0].VIN_NO
                                this.checkAllCollection(res.rows[0]);
                            } else {
                                this.passPoint();
                            }

                            // this.plantInfo.pointCode = this.pointCode
                        } else {
                            this.showMsg = "未查询到车辆信息！";
                            this.mainColor = "red";
                        }
                    } else {
                        this.showMsg = res.msg;
                        this.mainColor = "red";
                    }
                });
            }
        },
        checkAllCollection(item) {
            const param = {
                vin: item.VIN_NO,
                sapOrderNo: item.ORDER_ID,
                // vin: '111111111111111',
                // sapOrderNo: '001011070003',
            };
            getTraceResult(param).then((res) => {
                if (res.result === "1") {
                    console.log(res);
                    if (res.rows.traceResult) {
                        this.passPoint();
                        // this.plantInfo.pointCode = this.pointCode
                    } else {
                        this.showMsg = "车辆重保件信息未扫描完全，不能过点！";
                        this.mainColor = "red";
                    }
                } else {
                    this.showMsg = res.msg;
                    this.mainColor = "red";
                }
            });
        },
        passPoint() {
            const params = [
                {
                    plantCode: "K",
                    pointCode: this.pointCode,
                    ctrlKey: this.ctrlKey,
                    pointType: "1",
                    productType: "1",
                },
            ];
            const str =
                "?plantCode=K&pointCode=" +
                this.pointCode +
                "&ctrlKey=" +
                this.ctrlKey +
                "&pointType=1&productType=1";
            this.isLoading = true;
            passPointByProductType(str).then((res) => {
                this.isLoading = false;
                if (res.result === "1") {
                    this.showMsg = res.msg;
                    this.mainColor = "#9dbfb1";
                    this.warnColor = "green";
                    //   this.inputVIN = undefined
                    //   this.focusInput()
                    //   this.queryLastCar()
                    this.queryStatistics();
                    this.queryPassCount();
                } else {
                    this.showMsg = res.msg;
                    this.mainColor = "red";
                }
            });
        },
        queryPassCount() {
            const params = {
                plantCode: "K",
                processLocation: this.processLocation,
                pointCode: this.pointCode,
                ctrlKey: this.ctrlKey,
            };
            queryPassCount(params).then((res) => {
                this.isLoading = false;
                if (res.result === "1") {
                    this.showMsg = res.msg;
                } else {
                    this.showMsg = res.msg;
                }
            });
        },
        queryStatistics() {
            const params = {
                plantCode: "K",
                processLocation: this.processLocation,
                pointCode: this.pointCode,
            };
            queryStatistics(params).then((res) => {
                this.isLoading = false;
                if (res.result === "1") {
                    this.numStatic = res.rows;
                } else {
                    this.showMsg = res.msg;
                }
            });
        },
        init() {
            const self = this;
        },
        async serical() {
            const self = this;
            if ("serial" in navigator) {
                console.log("当前浏览器支持serial");

                self.port = await navigator.serial.requestPort();
                await self.port.open({ baudRate: 9600 });
                self.reader = self.port.readable.getReader();

                try {
                    while (true) {
                        const { value, done } = await self.reader.read();
                        if (done) {
                            self.reader.releaseLock();
                            break;
                        }
                        // console.log('value的值是：', value)
                        var weight = self.Uint8ArrayToString(value);
                        // alert(weight)
                        this.focusInput();
                        this.inputVIN = weight.trim();

                        this.showCarInfo();
                        // console.log(weight)
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    self.reader.releaseLock();
                    console.log("允许稍后关闭串口。");
                    await self.port.close();
                }
            } else {
                console.log("当前浏览器不支持 不支持 不支持serial");
            }
        },
        Uint8ArrayToString(serialData) {
            var out, i, len, c;
            var char2, char3;

            out = "";
            len = serialData.length;
            i = 0;
            while (i < len) {
                c = serialData[i++];
                switch (c >> 4) {
                    case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                        break;
                case 12:
                    case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = serialData[i++];
                        out += String.fromCharCode(
                            ((c & 0x1f) << 6) | (char2 & 0x3f)
                        );
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = serialData[i++];
                    char3 = serialData[i++];
                    out += String.fromCharCode(
                            ((c & 0x0f) << 12) |
                                ((char2 & 0x3f) << 6) |
                                ((char3 & 0x3f) << 0)
                    );
                    break;
                }
            }
            return out;
        },

        getURLParams() {
            var url = window.location.href; //获取当前url
            var dz_url = url.split("#")[1]; //获取#/之后的字符串
            var cs = dz_url.split("?")[1]; //获取?之后的参数字符串
            var cs_arr = cs.split("&"); //参数字符串分割为数组
            var cs = {};
            for (var i = 0; i < cs_arr.length; i++) {
                //遍历数组，拿到json对象
                cs[cs_arr[i].split("=")[0]] = cs_arr[i].split("=")[1];
            }
            return cs;
        },

        getProcessAndLineInfo() {
            const params = {
                pageIndex: 0,
                pageSize: 0,
                plantCode: "K",
                pointCode: this.pointCode,
            };
            getPassingPoint(params).then((res) => {
                if (res.result === "1") {
                    // const list = [];
                    // res.rows.forEach(function (ec) {
                    //     list.push(ec.noticeTitle);
                    // });
                    // console.log(res.rows);
                    if (res.rows.length > 0) {
                        this.plantInfo.processLocation =
                            res.rows[0].PROCESS_LOCATION;
                        this.plantInfo.lineNo = res.rows[0].LINE_NO;
                        //开始定时查询当前车辆信息
                        this.queryCurrentCarInfo();
                        this.currentCarTimer = setInterval(() => {
                            this.queryCurrentCarInfo(); // 定时刷新当前车辆信息
                        }, 10000);
                    } else {
                        this.$alert(res.msg, "提示");
                    }
                }
            });
        },
        //查询当前工位车辆信息
        queryCurrentCarInfo() {
            const params2 = {
                pageIndex: 0,
                pageSize: 0,
                plantCode: "K",
                processLocation: this.plantInfo.processLocation,
                lineNo: this.plantInfo.lineNo,
                pointCode: this.plantInfo.pointCode,
            };
            queryCarMonitor(params2).then((res) => {
                if (res.result === "1") {
                    // const list = [];
                    // res.rows.forEach(function (ec) {
                    //     list.push(ec.noticeTitle);
                    // });
                    // console.log(res.rows);
                    if (res.rows.length > 0) {
                        this.currentCarInfo = res.rows[0];
                    } else {
                        // this.$alert(
                        //     "错误的工位配置，未查询到对应的车间信息！",
                        //     "提示"
                        // );
                    }
                }
            });
        },
        dateFormat(time) {
            this.week = this.getWeek(new Date(time));
            var date = new Date(time);
            var year = date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
             * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
             * */
            var month =
                date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1;
            var day =
                date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours =
                date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes =
                date.getMinutes() < 10
                    ? "0" + date.getMinutes()
                    : date.getMinutes();
            var seconds =
                date.getSeconds() < 10
                    ? "0" + date.getSeconds()
                    : date.getSeconds();
            // 拼接
            return (
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hours +
                ":" +
                minutes +
                ":" +
                seconds
            );
        },

        getWeek(date) {
            const week = date.getDay();
            switch (week) {
            case 1:
                return "星期一";
                case 2:
                return "星期二";
            case 3:
                return "星期三";
            case 4:
                return "星期四";
            case 5:
                return "星期五";
            case 6:
                return "星期六";
            case 0:
                return "星期日";
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.mainContent {
    height: 65%;
    .rowStyle2 {
        height: 20%;
        line-height: 200%;
        font-size: 24px;
        text-align: left;
        .warnStyle {
            text-align: left;
            margin: auto;
            margin-left: 10px;
            text-overflow: hidden;
        }
    }
    .rowStyle3 {
        height: 40%;
        font-size: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        .divMain {
            position: absolute;
            margin: auto;
            width: 100%;
            display: flex;
            .vinStyle {
                display: inline-block;
                padding: 10px;
                margin-left: 80px;
                background-color: #eeece1;
            }
            /deep/ .inputStyle {
                text-align: left;
                .el-input__inner {
                    height: 100% !important;
                    margin-left: 10px;
                    width: 90%;
                    line-height: 60px !important;
                    font-size: 60px !important;
                    background-color: #eeece1;
                }
            }
        }
    }
}
.rowStyle4 {
    height: 20%;
    font-size: 24px;
    background-color: #eeece1;
}
.warnSpan {
    font-size: 26px;
    line-height: 52px;
    color: green;
    display: inline-block;
    word-break: break-all;
    white-space: normal;
    flex-direction: column;
}
.height-100 {
    height: 100%;
}
.el-header {
    color: #333;
    text-align: left;
    .rowStyle {
        height: 33%;
        line-height: 200%;
        font-size: 24px;
        background-color: #eeece1;
    }
    .rowStyle5 {
        height: 33%;
        line-height: 400%;
        font-size: 24px;
        background-color: #eeece1;
    }
}

.el-footer {
    background-color: #00b2ff;
    color: #333;
    text-align: left;
    padding: 0;
}

.el-main {
    color: #333;
    text-align: center;
    height: calc(100% - 200px);
}

.text-center {
    text-align: center;
}

.margin-left-10 {
    margin-left: 10px;
}

.text-right {
    text-align: right;
}

.text-left {
    text-align: left;
}
.margin-top-50 {
    margin-top: -50px;
}
</style>
