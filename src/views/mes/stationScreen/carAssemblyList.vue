<template>
    <div class="app-container app-container-table">
        <el-tag type="danger" size="medium" class="bg-blue"
            >车辆装配清单</el-tag
        >
        <div class="height-100 currentStyle">
            <el-table
                v-loading="loading"
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%; height: 100%"
                :stripe="true"
                :border="true"
                :header-row-style="{ height: '80px' }"
                :row-style="{ height: '103px' }"
                :cell-style="{ padding: '2px' }"
                height="calc(100vh-300px)"
            >
                <el-table-column
                    type="index"
                    width="80"
                    label="序号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="pointName"
                    label="工位"
                    width="280"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="materialCode"
                    label="物料编码"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="materialName"
                    label="物料名称"
                    align="center"
                >
                </el-table-column>
                <!-- <el-table-column
                    prop="assemblyLine"
                    label="装配路线"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="makeLine"
                    label="制造路线"
                    align="center"
                >
                </el-table-column> -->
                <!-- <el-table-column prop="color"
          label="颜色"
          align="center">
        </el-table-column> -->
                <el-table-column
                    prop="number"
                    label="数量"
                    width="150"
                    align="center"
                >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getVisualSysParameter, getAssemblyList } from "@/api/apiList/mes";
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
    },
    data() {
        return {
            loading: false,
            standTime: undefined,
            mesTypeArr: [
                { typeName: "全部", type: "" },
                { typeName: "错误", type: "错误" },
                { typeName: "警告", type: "警告" },
                { typeName: "消息", type: "消息" },
            ],

            stateTypeArr: [
                { typeName: "全部", type: "" },
                { typeName: "未读", type: "0" },
                { typeName: "已读", type: "1" },
            ],
            form: {
                noticeTitle: undefined,
                createdDateSE: [
                    Moment(new Date()).startOf("day"),
                    Moment(new Date()).endOf("day"),
                ],
                noticeType: "",
                isRead: "",
            },

            tableData: [],
        };
    },
    created() {
        // this.getVisualSysParameter()
    },
    watch: {
        currentCarInfo: {
            handler(newValue, oldValue) {
                if (newValue) {
                    if (
                        !oldValue ||
                        (oldValue && newValue.ctrlKey != oldValue.ctrlKey)
                    ) {
                        //查询装车清单
                        // console.log(newValue.ctrlKey)
                        this.getVisualSysParameter();
                    }
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getVisualSysParameter() {
            // console.log(this.pointCode)
            const param = {
                plantCode: this.$PLANT_CODE,
                parameterCode: "LESAPIUrl1",
            };
            getVisualSysParameter(param).then((res) => {
                if (res.result == "1") {
                    const data = {
                        url: res.msg,
                        carTypeCode: this.currentCarInfo.model,
                        pointCode: this.pointCode,
                    };
                    getAssemblyList(data).then((res) => {
                        // console.log(res)
                        // if (res.result == '1') {
                        this.tableData = res.rows.rows.rows;
                        // console.log(this.tableData)
                        // }
                    });
                }
                // console.log(res)
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
