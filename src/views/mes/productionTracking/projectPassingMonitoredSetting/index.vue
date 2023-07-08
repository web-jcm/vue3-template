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
                </el-row>
            </div>
            <div class="table_wrap">
                <div class="width5">
                    <el-table
                        ref="tableDataL"
                        :data="tableDataL"
                        @row-dblclick="clickRow"
                        highlight-current-row
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="calc(100%)"
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
                            label="时长（m）"
                            align="center"
                            prop="DURATION"
                        >
                        </el-table-column>
                    </el-table>
                </div>
                <div class="width5 m_l_40">
                    <el-table
                        v-loading="isLoading"
                        ref="tableDataR"
                        highlight-current-row
                        :data="tableDataR"
                        @row-dblclick="clickRow"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="calc(100%)"
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
                            label="时长（m）"
                            align="center"
                            prop="DURATION"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <edit
            :clickRowsData="selectedRow"
            :mainForm="formField"
            v-if="editShow"
            @close="closeDialog"
        />
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org";
import Moment from "moment";
import { queryMMPTList, queryProjectTrack } from "@/api/apiList/mes";
export default {
    name: "projectPassingMonitoredSettinh",
    components: { Edit: () => import("./edit") },
    // 组件混入对象
    mixins: [],
    data() {
        return {
            isLoading: false,
            tableDataL: [],
            tableDataR: [],
            MMPTList: [],
            selectedRow: undefined,
            editShow: false,
            formField: {
                plantCode: this.$PLANT_CODE,
                MMPT: undefined,
            },
        };
    },
    created() {
        this.queryMMPT();
    },
    methods: {
        changeSelect() {
            this.queryProjectLine();
        },
        clickRow(row) {
            console.log(row);
            this.selectedRow = row;
            this.editShow = true;
        },
        closeDialog(isRefresh) {
            this.editShow = false;
            if (isRefresh) {
                this.queryProjectLine();
            }
        },

        queryMMPT() {
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
                this.queryProjectLine();
                // this.isLoading = false;
            });
        },
        queryProjectLine() {
            console.log(this.formField.MMPT);
            const _this = this;
            const params = {
                PLANT_CODE: this.formField.plantCode,
                MMPT: this.formField.MMPT,
            };
            // this.isLoading = true;
            _this.tableDataL = [];
            _this.tableDataR = [];
            queryProjectTrack(params).then((res) => {
                console.log(res);
                res.rows.forEach(function (item) {
                    if (item.TYPE == "1") {
                        _this.tableDataL.push(item);
                    } else if (item.TYPE == "2") {
                        _this.tableDataR.push(item);
                    }
                });
                // this.isLoading = false;
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
</style>
