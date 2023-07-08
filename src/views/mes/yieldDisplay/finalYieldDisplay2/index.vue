<template>
    <div class="full-content">
        <el-row class="title-row">
            <el-col :span="6" class="full-col"></el-col>
            <el-col :span="10" class="full-col">
                <div class="title-text">
                    <b class="title-b">总装下线看板</b>
                </div>
            </el-col>
            <el-col :span="8" class="full-col">
                <span class="time-show">{{ dateFormat(date) }} {{ week }}</span>
            </el-col>
        </el-row>
        <el-row class="content-row">
            <el-col :span="11" class="full-col">
                <el-row class="content-row-col"
                    ><span class="col-text margin-left-100"
                        >当前班次：{{ productInfo.shift }}</span
                    ></el-row
                >
                <el-row class="content-row-col"
                    ><span class="col-text margin-left-100"
                        >当班计划：{{ productInfo.planCountShift }}</span
                    ></el-row
                >
                <el-row class="content-row-col"
                    ><span class="col-text green-color margin-left-100"
                        >当前计划：{{ productInfo.planCountNow }}</span
                    ></el-row
                >
                <el-row class="content-row-col"
                    ><span class="col-text green-color margin-left-100"
                        >当前实际：{{ productInfo.achvCount }}</span
                    ></el-row
                >
                <el-row class="content-row-col"
                    ><span class="col-text red-color margin-left-100"
                        >当前差值：{{ productInfo.diffCount }}</span
                    ></el-row
                >
            </el-col>
            <el-col :span="12" class="full-col right-col">
                <el-row
                    v-for="item in andonList"
                    :key="item.key"
                    class="content-row-col"
                >
                    <el-col
                        :span="24"
                        class="andon-list"
                        style="text-align: center"
                        ><span class="col-text red-color">{{
                            item.info
                        }}</span></el-col
                    >
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getProductInfo, getProductAndonInfo } from "@/api/apiList/mes";
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
            andonPage: {
                pageIndex: 1,
                pageSize: 5,
            },
            andonList: [
                { key: "1", info: undefined },
                { key: "2", info: "快乐工作！" },
                { key: "3", info: "快乐生活！" },
                { key: "4", info: "快乐成长！" },
            ],
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
                plantCode: "K",
                pointCode: "110",
                processLocation: "T",
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

        getAndonData() {
            var _this = this;
            const params = {
                plantCode: "K",
                andonStatus: "1",
                processLocation: "1",
                pageIndex: _this.andonPage.pageIndex,
                pageSize: _this.andonPage.pageSize,
            };
            getProductAndonInfo(params)
                .then((res) => {
                    if (res.result === "1") {
                        // console.log(res.rows);
                        this.andonList = res.rows;
                        this.andonList.forEach(function (item, i, arr) {
                            const now = new Date();
                            const andonTime = new Date(item.andonSdt);
                            item.timeDiff = parseInt(
                                (now - andonTime) / 1000 / 60
                            );
                            if (item.timeDiff > 9999) {
                                item.timeDiff = 9999 + "分钟";
                            } else {
                                item.timeDiff = item.timeDiff + "分钟";
                            }
                        });
                        _this.andonPage.pages = res.pages;
                        // const temp = res.rows[0];
                        // _this.productInfo = {
                        //     shift: temp.shift,
                        //     planCountShift: temp.planCountShift,
                        //     planCountNow: temp.planCountNow,
                        //     achvCount: temp.achvCount,
                        //     diffCount: temp.diffCount,
                        // };
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
        }, 60000);
        // this.timerAndonDate = setInterval(() => {
        //     if (
        //         _this.andonPage.pages &&
        //         _this.andonPage.pages > _this.andonPage.pageIndex
        //     ) {
        //         _this.andonPage.pageIndex++;
        //     } else {
        //         _this.andonPage.pageIndex = 1;
        //     }
        //     this.getAndonData(); // 定时获取左边主数据date
        // }, 5000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
            clearInterval(this.timerDate);
            // clearInterval(this.timerAndonDate);
        }
    },
};
</script>

<style lang="scss" scoped>
.margin-left-100 {
    margin-left: 100px;
}
.time-show {
    color: #01ffff;
    font-size: calc(35vw * 100 / 1920);
    line-height: 4;
    margin-left: 20px;
}

.title-text {
    text-align: center;
}
.title-b {
    font-size: calc(75vw * 100 / 1920);
    color: white;
}
.full-content {
    height: 100%;
    background-color: black;
}
.full-col {
    height: 100%;
}
.title-row {
    height: 10%;
    border-bottom: 2px solid;
}
.right-col {
    border-left: 2px solid;
}
.content-row {
    height: 90%;
}
.content-row-col {
    height: 20%;
    color: white;
    .col-text {
        font-size: calc(80vw * 100 / 1920);
        line-height: 2;
        margin-left: 200px;
    }
}
.button-list {
    margin-top: 10px;
    margin-left: 10px;
}
.andon-list {
    // font-size: calc(40vw * 100 / 1920);
    // line-height: 4;
}
.span-style {
    color: #dc2323;
    margin-left: 20px;
}

.green-color {
    color: #00ff33;
}

.red-color {
    color: #ff3333;
}
</style>
