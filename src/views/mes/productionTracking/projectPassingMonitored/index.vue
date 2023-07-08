<template>
    <div class="contain_wrap">
        <div class="main_wrap">
            <div class="flex operation_btn labelContentQuery">
                <el-row class="labelContent">
                    <el-col :span="12">
                        <div class="flex labelContent labelContentQuery">
                            <label class="labelW">MMPT:</label>
                            <el-select
                                v-model="formField.MMPT"
                                placeholder="请选择"
                                @change="changeSelect()"
                            >
                                <el-option
                                    v-for="item in MMPTList"
                                    :key="item.MMPT"
                                    :label="item.MMPT"
                                    :value="item.MMPT"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="flex labelContent labelContentQuery">
                            <label class="labelW2"
                                ><i class="iconRequired"></i
                                >刷新频率（s）:</label
                            >
                            <el-input
                                v-model="formField.refreshS"
                                type="number"
                                @change="changeInput"
                            >
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="table_wrap">
                <div class="width5">
                    <el-table
                        ref="tableDataL"
                        v-loading="isLoadingL"
                        :data="tableDataL"
                        highlight-current-row
                        tooltip-effect="dark"
                        style="width: 100%"
                        :row-style="setRowstyle"
                        height="calc(100% - 94px)"
                    >
                        <el-table-column
                            type="index"
                            width="60"
                            label="No."
                            align="center"
                        >
                        </el-table-column>

                        <el-table-column
                            prop="PROCESS_CODE"
                            label="生产线"
                            width="100"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="PROCESS_NAME"
                            label="生产线名"
                            width="200"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="前回通过时刻"
                            width="150"
                            align="center"
                            prop="PASS_TIME"
                        >
                        </el-table-column>
                        <el-table-column
                            label="净时间差(m)"
                            align="center"
                            prop="WORKE_TIME"
                        >
                        </el-table-column>
                        <el-table-column
                            label="时长(m)"
                            align="center"
                            prop="DURATION"
                        >
                        </el-table-column>
                        <!-- <el-table-column label="监视"
              align="center"
              prop="remark4">
            </el-table-column>
            <el-table-column label="报警"
              align="center"
              prop="remark5">
            </el-table-column> -->
                    </el-table>
                </div>
                <div class="width5 m_l_40">
                    <el-table
                        v-loading="isLoadingR"
                        ref="tableDataR"
                        highlight-current-row
                        :data="tableDataR"
                        tooltip-effect="dark"
                        :row-style="setRowstyle"
                        style="width: 100%"
                        height="calc(100% - 94px)"
                    >
                        <el-table-column
                            type="index"
                            width="60"
                            label="No."
                            align="center"
                        >
                        </el-table-column>

                        <el-table-column
                            prop="PROCESS_CODE"
                            label="工程点位编码"
                            width="150"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="PROCESS_NAME"
                            label="工程点位名"
                            width="150"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="前回通过时刻"
                            width="150"
                            align="center"
                            prop="PASS_TIME"
                        >
                        </el-table-column>
                        <el-table-column
                            label="净时间差(m)"
                            align="center"
                            prop="WORKE_TIME"
                        >
                        </el-table-column>
                        <el-table-column
                            label="时长(m)"
                            align="center"
                            prop="DURATION"
                        >
                        </el-table-column>
                        <!-- <el-table-column label="监视"
              align="center"
              prop="remark4">
            </el-table-column>
            <el-table-column label="报警"
              align="center"
              prop="remark5">
            </el-table-column> -->
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org";
import Moment from "moment";
import {
    queryMMPTList,
    queryProjectLine,
    queryProjectPointLocation,
} from "@/api/apiList/mes";
export default {
    name: "projectPassingMonitored",
    components: {},
    // 组件混入对象
    mixins: [],
    data() {
        return {
            isLoadingL: false,
            isLoadingR: false,
            tableDataL: [],
            tableDataR: [],
            MMPTList: [],
            formField: {
                plantCode: this.$PLANT_CODE,
                MMPT: undefined,
                refreshS: 30,
            },
        };
    },
    created() {
        this.queryMMPT();
    },
    beforeUnmount() {
        if (this.timeS) {
            clearInterval(this.timeS); // 在Vue实例销毁前，清除我们的定时器
        }
    },
    methods: {
        setRowstyle(e) {
            const time = Moment(new Date());
            if (e.row.PASS_TIME) {
                const passTime = Moment(e.row.PASS_TIME);
                const diff = time.diff(passTime, "minutes");
                e.row.WORKE_TIME = diff;
                if (diff > e.row.DURATION) {
                    return {
                        background: "khaki",
                    };
                }
            }
        },
        changeInput() {
            const _this = this;
            var pattern = /^[1-9][0-9]*$/;
            if (!pattern.test(this.formField.refreshS)) {
                this.$nextTick(() => {
                    this.formField.refreshS = 30;
                });
            } else {
                if (this.timeS) {
                    clearInterval(this.timeS);
                }
                this.timeS = setInterval(function () {
                    _this.queryProjectLine();
                    _this.queryProjectPointLocation();
                }, _this.formField.refreshS * 1000);
            }
        },

        queryMMPT() {
            const _this = this;
            const params = {
                PLANT_CODE: this.formField.plantCode,
            };
            // this.isLoading = true;
            queryMMPTList(params).then((res) => {
                console.log(res);
                this.MMPTList = res.rows;
                if (res.rows.length > 0) {
                    this.formField.MMPT = res.rows[0].MMPT;
                }
                _this.queryProjectLine();
                _this.queryProjectPointLocation();
                this.timeS = setInterval(function () {
                    _this.queryProjectLine();
                    _this.queryProjectPointLocation();
                }, _this.formField.refreshS * 1000);

                // this.isLoading = false;
            });
        },
        queryProjectLine() {
            console.log(this.formField.MMPT);
            const params = {
                plantCode: this.formField.plantCode,
                mmpt: this.formField.MMPT,
            };
            this.isLoadingL = true;
            queryProjectLine(params).then((res) => {
                console.log(res);
                this.tableDataL = res.rows;
                this.isLoadingL = false;
            });
        },
        queryProjectPointLocation() {
            const params = {
                plantCode: this.formField.plantCode,
                mmpt: this.formField.MMPT,
            };
            this.isLoadingR = true;
            queryProjectPointLocation(params).then((res) => {
                console.log(res);
                this.tableDataR = res.rows;
                this.isLoadingR = false;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.labelContentQuery {
    display: block;
}
.labelContent {
    width: 100%;
}
.labelW {
    width: 40px;
}
.labelW2 {
    width: 140px;
}
.padding-left-5 {
    padding-left: 5px;
}
@import "@/styles/mes/productionTypeManagement/productionTypeManagement.scss";

/deep/ .el-input__inner {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
}

.iconRequiredNo::before {
    content: "*";
    color: white;
    font-style: normal;
}
</style>
