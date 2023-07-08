<template>
    <el-container class="height-100">
        <el-header height="100px">
            <el-row class="rowStyle">
                <el-col :span="4" class="important"
                    ><b>{{ this.pointName }}</b></el-col
                >
                <el-col :span="14" class="text-center important text-50">
                    <my-marquee
                        @click.native="toFirst"
                        class="marqueeStyle"
                        :lists="lists"
                    ></my-marquee>
                </el-col>
                <el-col :span="6" class="text-right"
                    ><b>当前时间：</b
                    ><span class="time-show">{{
                        dateFormat(date)
                    }}</span></el-col
                >
            </el-row>
            <el-row class="rowStyle">
                <el-col :span="4">
                    <span class="important"
                        ><b>管理号:</b> {{ currentCarInfo.ctrlKey }}</span
                    >
                </el-col>
                <el-col :span="7">
                    <b>车型:</b> {{ currentCarInfo.model }}
                </el-col>
                <el-col :span="7">
                    <b>VIN:</b> {{ currentCarInfo.vinNO }}
                </el-col>
                <el-col :span="6" class="text-right"
                    ><b>到位时间：</b
                    >{{
                        currentCarInfo.arriveDT || "0000-00-00 00:00:00"
                    }}</el-col
                >
            </el-row>
        </el-header>
        <el-main>
            <message
                v-show="currentMenu.srcMenuCode === '1'"
                ref="message"
                :pointCode="this.pointCode"
            ></message>

            <car-info-monitor-one
                v-show="
                    currentMenu.srcMenuCode === 'MESPV1100' ||
                    currentMenu.srcMenuCode === 'MESPV1101' ||
                    currentMenu.srcMenuCode === 'MESPV1102' ||
                    currentMenu.srcMenuCode === 'MESPV1103'
                "
                :srcMenuCode="currentMenu.srcMenuCode"
                :pointCode="pointCode"
                :currentCarInfo="currentCarInfo"
                :plantInfo="plantInfo"
                @changeCurrentCar="changeCurrentCar"
            ></car-info-monitor-one>

            <car-assembly-list
                v-show="currentMenu.srcMenuCode === 'MESPV1104'"
                :pointCode="pointCode"
                :currentCarInfo="currentCarInfo"
                :plantInfo="plantInfo"
            ></car-assembly-list>
            <operation-instruction
                v-show="currentMenu.srcMenuCode === 'MESPV1105'"
                :pointCode="pointCode"
                :currentCarInfo="currentCarInfo"
                :plantInfo="plantInfo"
            ></operation-instruction>

            <andon
                v-show="currentMenu.srcMenuCode === 'MESPV1106'"
                :pointCode="pointCode"
                :currentCarInfo="currentCarInfo"
                :plantInfo="plantInfo"
            ></andon>
            <production-queue-query
                v-show="currentMenu.srcMenuCode === 'MESPV1107'"
                :pointCode="pointCode"
                :currentCarInfo="currentCarInfo"
                :plantInfo="plantInfo"
            ></production-queue-query>
            <tightening-instructions
                v-show="currentMenu.srcMenuCode === 'MESPV1108'"
                :pointCode="pointCode"
                :currentCarInfo="currentCarInfo"
                :plantInfo="plantInfo"
            ></tightening-instructions>
        </el-main>
        <el-footer height="100px">
            <div class="divStyle">
                <span class="spanStyle"
                    ><img src="@/assets/index/Mlogo.png" alt=""
                /></span>
            </div>
            <el-tabs
                :tab-position="tabPosition"
                class="tabStyle"
                @tab-click="clickTab"
                v-model="tabShow"
            >
                <el-tab-pane
                    :label="item.menuName"
                    v-for="item in menuList"
                    :key="item.menuId"
                ></el-tab-pane>

                <el-tab-pane
                    name="more"
                    class="more-btn"
                    v-if="menuList2.length > 0"
                    ><span slot="label">
                        <el-popover
                            v-model="showMore"
                            @hide="hidePopover"
                            placement="top"
                            width="300"
                            trigger="click"
                            :tabindex="9999"
                        >
                            <div>
                                <div
                                    class="div-tabs-button"
                                    v-for="(item, index) in menuList2"
                                    :key="item.menuId"
                                    @click.capture="clickTab2(index)"
                                >
                                    {{ item.menuName }}
                                </div>
                            </div>
                            <el-button slot="reference" class="tabs-button"
                                >更多</el-button
                            >
                        </el-popover>
                    </span></el-tab-pane
                >
            </el-tabs>
        </el-footer>
    </el-container>

    <!-- <edit-car
            :showType="showType"
            :clickRowsData="selectedRow"
            v-if="editCar"
            @close="closeDialog1"
        />
        <edit-book
            :showType="showType2"
            :headData="selectedRow"
            :clickRowsData="selectedRow2"
            v-if="editBook"
            @close="closeDialog2"
            @noCloseRefresh="noCloseRefresh"
        /> -->
</template>
<script>
import { orgApis } from "@/api/apiList/org";
import {
    fetchMenu,
    queryPointNotice,
    queryCarMonitor,
    getPointCode,
    queryMyPoint,
    deleteInstructorManagement,
} from "@/api/apiList/mes";
import moment from "moment";
// import myMarquee from "./my-marquee";

export default {
    name: "stationScreenIndex",
    components: {
        myMarquee: () => import("./marquee"),
        message: () => import("./message"),
        carInfoMonitorOne: () => import("./carInfoMonitorOne"),
        carAssemblyList: () => import("./carAssemblyList"),
        operationInstruction: () => import("./operationInstruction"),
        andon: () => import("./andon"),
        productionQueueQuery: () => import("./productionQueueQuery"),
        tighteningInstructions: () => import("./tighteningInstructions"),
    },
    // 组件混入对象
    mixins: [],
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            showMore: false,
            tabPosition: "top",
            tabShow: "0",
            pointCode: undefined,
            pointName: undefined,
            menuList: [{ menuId: "1", menuName: "首页", srcMenuCode: "1" }],
            menuList2: [],
            currentMenu: undefined,
            date: new Date(),
            week: this.getWeek(new Date()),
            // 网格查询API配置对象
            apiConfig: orgApis.wmBuCommonQueryFindAll,
            options: [
                {
                    value: this.$PLANT_CODE,
                    label: "猛士工厂",
                },
            ],
            lists: [],
            formField: {
                plantCode: this.$PLANT_CODE,
                carModel: undefined,
                pointCode: undefined,
                processLocation: undefined,
            },
            currentCarInfo: {
                ctrlKey: undefined,
                model: undefined,
                colorI: undefined,
                colorK: undefined,
                arriveDT: undefined,
                baseModel: undefined,
                bodySerialNo: undefined,
                trimSerialNo: undefined,
                vinNO: undefined,
            },
            plantInfo: {
                plantCode: this.$PLANT_CODE,
                processLocation: undefined,
                lineNo: undefined,
                pointCode: undefined,
            },
            editBook: false,
            editCar: false,
            showType: undefined,
            showType2: undefined,
            selectedRow: undefined,
            selectedRow2: undefined,
            tableDataL: [],
            tableDataR: [],
            processArr: [],
            pointArr: [],
            loading: null,
            currentCode: "",
        };
    },
    created() {
        // document.documentElement.requestFullscreen()
        this.currentMenu = this.menuList[0];
        //显示当前日期时间
        let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
        this.timer = setInterval(() => {
            _this.date = new Date(); // 修改数据date
            //计算停留时间
            // if (_this.currentCarInfo.arriveDT) {
            //     const end_date = Moment(_this.date);
            //     const start_date = Moment(_this.currentCarInfo.arriveDT);
            //     const eTime = end_date.diff(start_date, "seconds");
            //     // console.log(eTime);
            //     // console.log(this.changeSecondsTo(eTime));
            //     _this.currentCarInfo.standTime = _this.changeSecondsTo(eTime);
            // }
        }, 1000);
        this.queryMyPoint();
        this.queryList();
        // console.log(this.$refs.message)

        // console.log(this.$route);
        // this.getURLParams();
        // console.log(window.parent.$api);
        // const vv = window.parent.$api.auth.getCurrentUser();
        // console.log(window.localStorage);
        // if (window.localStorage.code) {
        //     this.pointCode = JSON.parse(window.localStorage.code);
        //     this.plantInfo.pointCode = this.pointCode;
        //     //根据点位查询车间，生产线信息
        //     this.getProcessAndLineInfo();
        // } else {
        //     this.$alert("请在Local Storage中配置工位号！", "提示");
        // }
    },
    beforeUnmount() {
        if (this.messageInt) {
            clearInterval(this.messageInt); // 在Vue实例销毁前，清除我们的定时器
        }
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (this.currentCarTimer) {
            clearInterval(this.currentCarTimer);
        }
    },
    methods: {
        //获取我的工位
        queryMyPoint() {
            queryMyPoint().then((res) => {
                if (res.result === "1") {
                    // console.log(res)
                    if (res.rows.userName) {
                        this.pointName = res.rows.pointName;
                        this.pointCode = res.rows.pointCode;
                        this.plantInfo.pointCode = this.pointCode;
                        this.getMessageUnread();
                        this.getProcessAndLineInfo();
                        this.messageInt = setInterval(() => {
                            this.getMessageUnread(); // 定时刷新未读消息
                            this.$refs.message.queryPointNotice();
                        }, 30000);
                    }
                } else {
                    this.$alert("请配置用户与工位的关系！", "提示");
                }
            });
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
        changeCurrentCar() {
            // console.log("刷新当前车辆");
            this.queryCurrentCarInfo();
            //刷新队列
        },
        getMessageUnread() {
            // console.log('9999')
            this.lists = [];
            const params = {
                pageIndex: 1,
                pageSize: 10,
                plantCode: this.$PLANT_CODE,
                pointCode: this.pointCode,
                SDT: moment(new Date())
                    .startOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                EDT: moment(new Date())
                    .endOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                isRead: "0",
            };
            // console.log(params)
            queryPointNotice(params).then((res) => {
                // console.log(res)
                if (res.result === "1") {
                    // const list = [];
                    // res.rows.forEach(function (ec) {
                    //     list.push(ec.noticeTitle);
                    // });
                    this.lists = res.rows;
                }
            });
        },
        getProcessAndLineInfo() {
            const params = {
                pageIndex: 0,
                pageSize: 0,
                plantCode: this.$PLANT_CODE,
                pointCode: this.pointCode,
            };
            getPointCode(params).then((res) => {
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
                        this.$alert(
                            "错误的工位配置，未查询到对应的车间信息！",
                            "提示"
                        );
                    }
                }
            });
        },
        getPointCode() {
            var that = this;
            getPointCode({
                plantCode: this.formField.plantCode,
                processLocation: this.formField.processLocation,
                lineNo: this.formField.lineNo,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        // console.log(res)
                        if (res.rows) {
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
        //查询当前工位车辆信息
        queryCurrentCarInfo() {
            const params2 = {
                pageIndex: 0,
                pageSize: 0,
                plantCode: this.$PLANT_CODE,
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

        queryList() {
            const that = this;
            const params = {
                pageIndex: -1,
                pageSize: 10,
                deviceType: "MESPV",
                dataCode: "prcDbMobileMenuQuery",
            };
            fetchMenu(params).then((res) => {
                if (res.result === "1") {
                    if (res.rows.rows.length > 6) {
                        res.rows.rows.forEach(function (ec, i) {
                            if (i < 5) {
                                that.menuList.push(ec);
                            } else if (i > 4) {
                                that.menuList2.push(ec);
                            }
                        });
                    } else {
                        res.rows.rows.forEach(function (ec) {
                            that.menuList.push(ec);
                        });
                    }

                    // console.log(that.menuList)
                }
            });
        },
        clickTab(tab) {
            if (this.menuList2.length > 0 && tab.index == 6) {
            } else {
                this.tabShow = tab.index;
                this.currentMenu = this.menuList[Number(tab.index)];
            }
            // console.log(this.currentMenu);
        },
        clickTab2(index) {
            const temp = this.menuList[5];
            this.menuList[5] = this.menuList2[index];
            this.menuList2[index] = temp;
            this.tabShow = "5";
            this.currentMenu = this.menuList[Number(5)];
            this.showMore = false;
            // console.log(this.currentMenu);
        },
        hidePopover() {},
        toFirst() {
            this.tabShow = "0";
            this.currentMenu = this.menuList[0];
        },
    },
};
</script>
<style lang="scss" scoped>
.height-100 {
    height: 100%;
}
.el-header {
    background-color: #b3c0d1;
    color: #333;
    text-align: left;
    .rowStyle {
        height: 50px;
        line-height: 50px;
        font-size: 24px;
    }
}

.el-footer {
    background-color: #00b2ff;
    color: #333;
    text-align: left;
    padding: 0;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    height: calc(100% - 200px);
}

.spanStyle {
    height: 100px;
    // width: 100px;
    font-size: 40px;
    margin-left: 20px;
    margin-right: 20px;
    line-height: 100px;
}

.divStyle {
    height: 100px;
    display: inline-block;
    position: absolute;
}
.tabStyle {
    background-color: #00b2ff;
    display: inline-block;
    height: 100px;
    font-size: 50px;
    margin-left: 200px;
}

/deep/ .el-tabs__item {
    height: 76px;
    font-size: 24px;
    line-height: 76px;
    color: white;
}

.tabs-button {
    font-size: 24px !important;
    // line-height: 96px;
    color: white;
    background-color: transparent;
    border: 0;
}

.div-tabs-button {
    height: 76px;
    font-size: 24px;
    line-height: 76px;
    color: white;
    background-color: #00b2ff;
    text-align: center;
    border-bottom: 1px solid white;
}
.div-tabs-button:hover {
    color: #c90329;
}
/deep/ .tabs-button span {
    font-size: 24px !important;
}
/deep/ .el-tabs--bottom .el-tabs__header.is-bottom {
    margin-top: 0;
}

.text-center {
    text-align: center;
}

.important {
    color: red;
}

.text-right {
    text-align: right;
}

.marqueeStyle {
    display: inline-block;
    width: 100%;
}

.text-50 {
    height: 50px;
}
</style>
