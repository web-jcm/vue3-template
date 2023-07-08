<template>
    <div style="height: 100vh; width: 100vh">
        <div class="Resize">
            <div class="title">
                <el-row class="title-row">
                    <el-col
                        :span="8"
                        class="full-col"
                        style="text-align: left; padding-left: 20px"
                    >
                        <img
                            src="@/assets/M.png"
                            style="height: 64px; margin-right: 10px"
                            alt=""
                        />
                        <img src="@/assets/logo.png" alt="" />
                    </el-col>
                    <el-col :span="8" class="full-col">
                        <div class="title-text">
                            <b class="title-b">猛士汽车涂装1线</b>
                        </div>
                    </el-col>
                    <el-col :span="8" class="full-col">
                        <span class="time-show"
                            >{{ dateFormat(date) }} {{ week }}</span
                        >
                    </el-col>
                </el-row>
            </div>
            <div class="content">
                <div class="left">
                    <div class="list">
                        <span class="name">{{ "当前班次" }}</span
                        ><span class="number">{{ productInfo.shift }}</span>
                    </div>
                    <div class="list">
                        <span class="name">{{ "当班计划" }}</span
                        ><span class="number">{{
                            productInfo.planCountShift
                        }}</span>
                    </div>
                    <div class="list">
                        <span class="name">{{ "当前计划" }}</span
                        ><span class="number">{{
                            productInfo.planCountNow
                        }}</span>
                    </div>
                    <div class="list">
                        <span class="name">{{ "当前实际" }}</span
                        ><span class="number">{{ productInfo.achvCount }}</span>
                    </div>
                    <div class="list">
                        <span class="name">{{ "当前差值" }}</span
                        ><span class="number">{{ productInfo.diffCount }}</span>
                    </div>
                </div>
                <div class="right">
                    <!-- <div class="list"
            v-for="item in andonList"
            :key="item.time">
            <el-row class="content-row-col">
              <el-col :span="7"
                class="andon-list"><span class="span-style">{{ item.pointCode }}工位</span></el-col>
              <el-col :span="5"
                class="andon-list"><span class="span-style"
                  style="color:red">{{ item.andonType }}
                </span></el-col>
              <el-col :span="8"
                class="andon-list"><span class="span-style">{{
                            item.andonSdt
                        }}</span></el-col>
              <el-col :span="4"
                class="andon-list"><span class="span-style">{{
                            item.timeDiff
                        }}</span></el-col>
            </el-row>
          </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getProductInfo } from "@/api/apiList/mes";
export default {
    data() {
        return {
            date: new Date(),
            week: this.getWeek(new Date()),
            productInfo: {
                shift: undefined,
                planCountShift: undefined,
                planCountNow: undefined,
                achvCount: undefined,
                diffCount: undefined,
            },
        };
    },
    methods: {
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

        getMainData() {
            var _this = this;
            const params = {
                plantCode: this.$PLANT_CODE,
                pointCode: "1P0",
                processLocation: "P",
            };
            getProductInfo(params)
                .then((res) => {
                    if (res.result === "1") {
                        const temp = res.rows[0];
                        _this.productInfo = {
                            shift: temp.shift,
                            planCountShift: temp.planCountShift,
                            planCountNow: temp.planCountNow,
                            achvCount: temp.achvCount,
                            diffCount: temp.diffCount,
                        };
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
        },
    },
    mounted() {
        document.documentElement.requestFullscreen();
        //显示当前日期时间
        let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
        this.timer = setInterval(() => {
            _this.date = new Date(); // 修改数据date
        }, 1000);
        this.getMainData();
        // this.getAndonData();
        this.timerDate = setInterval(() => {
            this.getMainData(); // 定时获取左边主数据date
        }, 10000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
            clearInterval(this.timerDate);
        }
    },
};
</script>

<style lang="scss" scoped>
.time-show {
    color: #01ffff;
    font-size: calc(25vw * 100 / 1920);
    margin-right: 20px;
    float: right;
}
.Resize {
    height: 1080px;
    width: 1920px;
    background-image: url("~@/assets/kanban-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 20px;

    .title {
        width: 100%;
        height: 110px;
        margin-bottom: 18px;
        background: #004fd9ad;
        border-radius: 8px;
        border: 2px solid #004fd9ad;
        font-size: 42px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 110px;
        text-align: center;
    }

    .content {
        display: flex;
        justify-content: space-between;
        margin-bottom: 17px;

        .left {
            width: 26%;
            height: 900px;
            border-radius: 8px;
            border: 2px solid #004fd9;
            padding: 17px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .list {
                //width: 443px;
                width: 100%;
                height: 90px;
                background: #004fd9;
                border-radius: 8px;
                //opacity: 0.68;
                border: 2px solid #004fd9;
                display: flex;
                align-items: center;
                justify-content: space-around;

                .name {
                    display: block;
                    width: 150px;
                    font-size: 32px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #ffffff;
                }

                .number {
                    display: block;
                    width: 50px;
                    font-size: 24px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #ffdc51;
                }
            }
        }

        .right {
            width: 74%;
            color: white;
            height: 900px;
            border-radius: 8px;
            // border: 2px solid #004fd9;
            padding: 17px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            //border-radius: 8px;
            //border: 2px solid #004FD9;
            .list {
                width: 100%;
                height: 90px;
                // background: #004fd9;
                border-radius: 8px;
                //opacity: 0.68;
                border: 2px solid #004fd9;
                display: flex;
                align-items: center;
                justify-content: space-around;
                .content-row-col {
                    width: 100%;
                    font-size: 32px;
                    text-align: center;
                }
            }

            .bottom {
                width: 100%;
                border-radius: 8px;
                border: 2px solid #004fd9;
                height: 397px;
                padding: 17px;
                display: flex;
                justify-content: space-between;
            }
        }
    }

    .bottom-box {
        //width: 1820px;
        //width: 1820px;
        height: 82px;
        background: #b00000;
        border-radius: 8px;
        margin-left: 50px;
        position: relative;
        width: 100%;
        .wig-img {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: -25px;
            z-index: 99999;
        }
        .writer {
            font-size: 26px;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            height: 82px;
            line-height: 82px;
            //width: 1800px;
        }
    }

    .warningshwo {
        animation: ismymove 3s ease;
        opacity: 0;
    }

    @keyframes ismymove {
        0% {
            bottom: 0px;
            opacity: 1;
        }
        100% {
            bottom: -100px;
            opacity: 0;
        }
    }

    .isshwo {
        animation: mymove 3s ease;
        opacity: 1;
    }

    @keyframes mymove {
        0% {
            bottom: -100px;
            opacity: 0;
        }
        100% {
            bottom: 0px;
            opacity: 1;
        }
    }

    .bbsInfo {
        //background: pink;
        height: 80px;
        width: 100%;
        overflow: hidden;
    }
}
</style>
