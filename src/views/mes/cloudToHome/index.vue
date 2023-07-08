<template>
    <div class="mainView">
        <el-row class="divMain">
            <el-col :span="12" class="text-center">
                <button class="btn btn3" @click="open">
                    <span>物流管理</span>
                </button>
            </el-col>
            <el-col :span="12" class="text-center">
                <button class="btn btn3" @click="open">
                    <span>重保件管理</span>
                </button>
            </el-col>
            <!-- <el-col :span="8"
        class="text-center">
        <button class="btn btn3"
          @click="open"><span>合格证管理</span></button>
      </el-col> -->
        </el-row>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import { queryLookupValues } from "@/api/apiList/mes.js";
export default {
    data() {
        return {
            // 查询表单

            // 所有需要的下拉框
            dropListAll: {
                com_craft_type: [], // 工艺类型 下拉框
            },
            cloudURL: "",
            payType: [
                { label: "有效", value: "1" },
                { label: "无效", value: "2" },
            ],
            ifGdp: [
                { label: "是", value: "2" },
                { label: "否", value: "1" },
            ],
        };
    },
    computed: {},
    async created() {
        queryLookupValues({
            plantCode: "K",
            tenancyId: this.$store.state.user.tenancyId,
            lookupType: "CLOUD_URL",
        })
            .then((res) => {
                if (res.result === "1") {
                    if (res.rows.length > 0) {
                        this.cloudURL = res.rows[0].LOOKUP_VALUE_CODE;
                    } else {
                        this.$utils.message({
                            message: "请配置云跳转地址！",
                        });
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
    mounted() {},
    methods: {
        open() {
            const token = Cookies.get("token");
            window.open(`${this.cloudURL}/index.html?ssotoken=${token}`);
        },
    },
};
</script>
<style lang="scss" scoped>
$btn3-color: #81d3f8;
$btn3-end-color: #07587d;
.mainView {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    // background-color: #292929;
    background: linear-gradient(0deg, #e4eaf6, #4475bb);
    width: 100%;
    .divMain {
        position: absolute;
        margin: auto;
        width: 100%;
        display: flex;
    }
}

button {
    border: none;
    outline: none;
    background-color: transparent;
    margin: 10px;
}

.btn {
    width: 200px;
    height: 60px;
    color: #fff;
    border-radius: 5px;
    padding: 10px 25px;
    font-family: Lato, sans-serif;
    font-size: 24px;
    margin: 0 3px;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    box-shadow: inset 2px 2px 2px 0 rgb(255, 255, 255),
        7px 7px 20px 0 rgb(255, 255, 255), 4px 4px 5px 0 rgb(255, 255, 255);
    outline: none;
}

.btn:hover {
    color: #fff;
}

.btn3 {
    background: linear-gradient(0deg, $btn3-color, $btn3-end-color);
    line-height: 60px;
    padding: 0;
    border: none;
}

.btn3::before {
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    background: $btn3-color;
    box-shadow: -7px -7px 20px 0 rgb(255, 255, 255),
        -4px -4px 5px 0 rgb(255, 255, 255), 7px 7px 20px 0 rgb(255, 255, 255),
        4px 4px 5px 0 rgb(255, 255, 255);
    transition: all 0.3s ease;
    height: 0%;
    width: 2px;
}

.btn3::after {
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    background: $btn3-color;
    box-shadow: -7px -7px 20px 0 rgb(255, 255, 255),
        -4px -4px 5px 0 rgb(255, 255, 255), 7px 7px 20px 0 rgb(255, 255, 255),
        4px 4px 5px 0 rgb(255, 255, 255);
    transition: all 0.3s ease;
    width: 0;
    height: 2px;
}

.btn3 span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
}

.btn3 span::before {
    width: 2px;
    height: 0%;
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    background: $btn3-color;
    box-shadow: -7px -7px 20px 0 rgb(255, 255, 255),
        -4px -4px 5px 0 rgb(255, 255, 255), 7px 7px 20px 0 rgb(255, 255, 255),
        4px 4px 5px 0 rgb(255, 255, 255);
    transition: all 0.3s ease;
}

.btn3 span::after {
    height: 2px;
    width: 0;
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    background: $btn3-color;
    box-shadow: -7px -7px 20px 0 rgb(255, 255, 255),
        -4px -4px 5px 0 rgb(255, 255, 255), 7px 7px 20px 0 rgb(255, 255, 255),
        4px 4px 5px 0 rgb(255, 255, 255);
    transition: all 0.3s ease;
}

.btn3:hover {
    color: #fff;
    // background: transparent;
}

.btn3:hover::before {
    height: 100%;
}

.btn3:hover::after {
    width: 100%;
}

.btn3 span:hover:before {
    height: 100%;
}

.btn3 span:hover:after {
    width: 100%;
}
.text-center {
    text-align: center;
}

.gradient {
    /* 设置容器尺寸 - 原理1 */
    width: 100%;
    height: 100%;
    /* 背景渐变色 - 原理2 */
    background: linear-gradient(-45deg, #8d6558, #d190a9, #8fbaca, #23d5ab);
    /* 背景尺寸 - 原理3 */
    background-size: 600% 600%;
    /* 循环动画 - 原理4 */
    animation: gradientBG 10s ease infinite;
}

/* 动画，控制背景 background-position */
@keyframes gradientBG {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
