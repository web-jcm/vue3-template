<template>
    <div class="contain_wrap">
        <div class="btn_wrap flex">
            <div class="flex">
                <div class="label"><i class="iconRequired"></i>工厂名称</div>
                <el-select v-model="formField.plantCode" placeholder="请选择">
                    <el-option
                        v-for="item in plants"
                        :key="item.PLANT_CODE"
                        :label="item.PLANT_NAME"
                        :value="item.PLANT_CODE"
                    >
                    </el-option>
                </el-select>
            </div>
            <el-button
                icon="iconfont icon-search"
                type="primary"
                @click="search()"
                >查询</el-button
            >
        </div>
        <div class="main_wrap">
            <div>
                <el-button icon="iconfont  icon-preservation" @click="save()"
                    >保存</el-button
                >
                <el-button
                    icon="iconfont icon-importTemplateDownload"
                    @click="downloadExcell()"
                    >模板下载</el-button
                >
                <el-upload
                    class="upload-demo m_l_10"
                    action=""
                    :http-request="uploadFile"
                    :show-file-list="false"
                    accept="xls,xlsx"
                >
                    <el-button icon="iconfont icon-importTemplate"
                        >导入</el-button
                    >
                </el-upload>
            </div>
            <div class="table_wrap">
                <div class="width5">
                    <div class="flex operation_btn">
                        <div class="title">工作模式列表</div>
                        <div class="flex">
                            <el-button
                                icon="iconfont icon-newlyAdded"
                                type="primary"
                                @click="add1()"
                                >添加</el-button
                            >
                            <el-button
                                icon="iconfont icon-quanbushanchu"
                                @click="delete1()"
                                >删除</el-button
                            >
                        </div>
                    </div>
                    <el-table
                        ref="multipleTableL"
                        :data="tableDataL"
                        highlight-current-row
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="calc(100% - 52px)"
                        @current-change="changeRow"
                        @row-click="clickRow"
                        @selection-change="handleSelectionChangeL"
                        @select="selectRow"
                    >
                        <el-table-column
                            type="selection"
                            width="60"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="模式"
                            width="100"
                            align="center"
                        >
                            <template v-slot="scope">
                                <span v-if="scope.row.shiftPatternId">{{
                                    scope.row.shiftPatternCode
                                }}</span>
                                <el-input
                                    v-else
                                    v-model="scope.row.shiftPatternCode"
                                    v-rule="'22'"
                                    @blur="inputBlur"
                                ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="shiftWorkingHhmm"
                            label="工作时长"
                            width="100"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column label="开始时间" align="center">
                            <template v-slot="scope">{{
                                scope.row.shiftStartTime
                            }}</template>
                        </el-table-column>
                        <el-table-column label="结束时间" align="center">
                            <template v-slot="scope">{{
                                scope.row.shiftEndTime
                            }}</template>
                        </el-table-column>
                        <el-table-column
                            label="是否跨天"
                            width="100"
                            align="center"
                        >
                            <template v-slot="scope">{{
                                scope.row.isTomorrow === "1" ? "是" : "否"
                            }}</template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="width5 m_l_40">
                    <div class="flex operation_btn">
                        <div class="title">模式{{ currentCode }}时间明细</div>
                        <div class="flex">
                            <el-button
                                icon="iconfont icon-newlyAdded"
                                type="primary"
                                @click="add2()"
                                >添加</el-button
                            >
                            <el-button
                                icon="iconfont icon-quanbushanchu"
                                @click="delete2()"
                                >删除</el-button
                            >
                        </div>
                    </div>
                    <el-table
                        ref="multipleTableR"
                        :data="tableDataR"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="calc(100% - 52px)"
                        @selection-change="handleSelectionChangeR"
                    >
                        <el-table-column
                            type="selection"
                            width="60"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column label="开始时间">
                            <template v-slot="scope">
                                <el-time-picker
                                    :clearable="false"
                                    v-model="scope.row.stageStartTime"
                                    :picker-options="{
                                        format: 'HH:mm',
                                    }"
                                    default-value="2020-02-02 00:00"
                                    value-format="HH:mm"
                                >
                                </el-time-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="结束时间">
                            <template v-slot="scope">
                                <el-time-picker
                                    :clearable="false"
                                    v-model="scope.row.stageEndTime"
                                    :picker-options="{
                                        format: 'HH:mm',
                                    }"
                                    default-value="2020-02-02 00:00"
                                    value-format="HH:mm"
                                >
                                </el-time-picker>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="是否跨天"
                            align="center"
                            width="100"
                        >
                            <template v-slot="scope">
                                <el-select v-model="scope.row.isTomorrow">
                                    <el-option label="否" value="0">
                                    </el-option>
                                    <el-option label="是" value="1">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Moment from "moment";
import {
    queryProductionType,
    queryProductionTypeItem,
    saveProductionType,
    delProductionType,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "productionTypeManagement",
    components: {},
    // 组件混入对象
    mixins: [],
    data() {
        return {
            plants: [],
            formField: {
                plantCode: "",
            },
            tableDataL: [],
            tableDataR: [],
            multipleSelectionL: [],
            multipleSelectionR: [],
            loading: null,
            currentCode: "",
        };
    },
    async mounted() {
        await this.queryPlant();
        this.search();
    },
    methods: {
        queryPlant() {
            return queryPlant({
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.plants = res.rows;
                            this.formField.plantCode = res.rows[0].PLANT_CODE;
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
        search() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryProductionType({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableDataL = [];
                        res.rows.rows.forEach((item) => {
                            if (item.shiftPatternCode !== "0") {
                                item.shiftEndTime = this.getTime(
                                    item.shiftEndHhmm
                                );
                                item.shiftStartTime = this.getTime(
                                    item.shiftStartHhmm
                                );
                                this.tableDataL.push(item);
                            }
                        });
                        if (this.tableDataL.length) {
                            this.$refs.multipleTableL.setCurrentRow(
                                this.tableDataL[0]
                            );
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.tableDataL = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        getTime(timeStr, type) {
            let time = timeStr.split("");
            time.splice(2, 0, ":");
            time = time.join().replace(/,/g, "");
            if (type) time = time + ":00";
            return time;
        },
        searchItem() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryProductionTypeItem({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                shiftPatternCode: this.currentCode,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableDataR = [];
                        res.rows.rows.forEach((item, index) => {
                            item.stageEndTime = this.getTime(
                                item.stageEndHhmm,
                                1
                            );
                            item.stageStartTime = this.getTime(
                                item.stageStartHhmm,
                                1
                            );
                            item.index = index;
                            this.tableDataR.push(item);
                        });
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.tableDataR = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        changeRow(row, oldRow) {
            this.currentCode = row.shiftPatternCode;
            if (oldRow && row.shiftPatternId !== oldRow.shiftPatternId) {
                // this.$confirm("是否保存当前作业形式?", "提示", {
                //     confirmButtonText: "确定",
                //     cancelButtonText: "取消",
                //     type: "warning",
                // })
                //     .then(() => {
                //         this.save().then(() => {
                //             if (
                //                 row.shiftPatternCode &&
                //                 row.shiftPatternCode !== "0"
                //             ) {
                //                 this.searchItem();
                //             } else {
                //                 this.tableDataR = [];
                //             }
                //         });
                //     })
                //     .catch((err) => {
                if (row.shiftPatternCode && row.shiftPatternCode !== "0") {
                    this.searchItem();
                } else {
                    this.tableDataR = [];
                }
                // });
            } else if (!oldRow) {
                this.searchItem();
            }
        },
        clickRow(row) {
            this.$refs.multipleTableL.toggleRowSelection(row);
        },
        selectRow(selection, row) {
            this.$refs.multipleTableL.setCurrentRow(row);
        },
        handleSelectionChangeR(val) {
            this.multipleSelectionR = val;
        },
        handleSelectionChangeL(val) {
            this.multipleSelectionL = val;
        },
        inputBlur() {
            let flag = 0;
            this.tableDataL.some((item) => {
                if (
                    item.shiftPatternCode ===
                    this.tableDataL[this.tableDataL.length - 1].shiftPatternCode
                ) {
                    flag++;
                    return flag;
                }
            });
            if (flag > 1) {
                this.tableDataL[this.tableDataL.length - 1].shiftPatternCode =
                    "";
                return this.$utils.message({
                    message: "模式名重复！",
                });
            }
            this.currentCode =
                this.tableDataL[this.tableDataL.length - 1].shiftPatternCode;
        },
        add1() {
            if (
                !this.tableDataL.length ||
                this.tableDataL[this.tableDataL.length - 1].shiftPatternId
            ) {
                this.tableDataL.push({
                    shiftPatternCode: "",
                    shiftWorkingHhmm: "0",
                    shiftStartHhmm: "",
                    shiftEndHhmm: "",
                    isTomorrow: "0",
                    shiftPatternId: "",
                });
            } else {
                this.$utils.message({
                    message: "请先保存最后一条数据！",
                });
            }
        },
        delete1() {
            if (this.multipleSelectionL.length || this.currentCode) {
                this.$confirm("是否删除当前工作模式?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    if (this.multipleSelectionL.length) {
                        var arr = this.tableDataL.filter((item) => {
                            return this.multipleSelectionL.some(
                                (sel) =>
                                    sel.shiftPatternId === item.shiftPatternId
                            );
                        });
                    } else {
                        var arr = this.tableDataL.filter((item) => {
                            return this.currentCode === item.shiftPatternId;
                        });
                    }
                    this.loading = this.$loading({
                        lock: true,
                        text: "删除中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    delProductionType({
                        plantCode: this.formField.plantCode,
                        tenancyId: this.$store.state.user.tenancyId,
                        row: arr,
                    })
                        .then((res) => {
                            this.$utils.message({
                                message: res.msg,
                            });
                            this.loading.close();
                            this.search();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                });
            } else {
                this.$utils.message({
                    message: "请选择要删除的数据！",
                });
            }
        },
        add2() {
            if (this.currentCode) {
                if (
                    !this.tableDataR.length ||
                    (this.tableDataR.length && this.verification())
                ) {
                    this.tableDataR.push({
                        stageStartHhmm: "",
                        stageEndHhmm: "",
                        isTomorrow: "0",
                        shiftPatternCode: this.currentCode,
                        index: this.tableDataR.length,
                    });
                }
            } else {
                this.$utils.message({
                    message: "请先填写左侧模式名！",
                });
            }
        },
        delete2() {
            if (this.multipleSelectionR.length) {
                let arr = this.tableDataR.filter((item) => {
                    return !this.multipleSelectionR.some(
                        (sel) => sel.index === item.index
                    );
                });
                if (arr.length) {
                    this.save(arr);
                } else {
                    this.delete1();
                }
            } else {
                this.$utils.message({
                    message: "请选择要删除的数据！",
                });
            }
        },
        save(arr) {
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                if (arr) {
                    this.tableDataR = arr;
                }
                if (this.tableDataR.length) {
                    if (this.verification()) {
                        this.loading = this.$loading({
                            lock: true,
                            text: "保存中",
                            background: "rgba(0, 0, 0, 0.7)",
                        });
                        return saveProductionType({
                            plantCode: this.formField.plantCode,
                            tenancyId: this.$store.state.user.tenancyId,
                            row: this.tableDataR,
                        })
                            .then((res) => {
                                this.loading.close();
                                this.$utils.message({
                                    message: res.msg,
                                });
                                if (res.result === "1") this.search();
                            })
                            .catch((err) => {
                                this.loading.close();
                                console.log(err);
                            });
                    }
                } else {
                    this.$utils.message({
                        message: "请填加工作模式明细！",
                    });
                }
            });
        },
        verification() {
            let key = true;
            this.tableDataR.forEach((item, index) => {
                if (item.stageStartTime && item.stageEndTime) {
                    item.stageStartHhmm = item.stageStartTime
                        .substr(0, 5)
                        .replace(":", "");
                    item.stageEndHhmm = item.stageEndTime
                        .substr(0, 5)
                        .replace(":", "");
                    if (
                        this.computeTime(
                            item.stageEndTime,
                            item.stageStartTime
                        ) &&
                        item.isTomorrow === "0"
                    ) {
                        key = false;
                        return this.$utils.message({
                            message: `第${
                                index + 1
                            }时间段开始时间须小于结束时间！`,
                        });
                    }
                    if (index > 0) {
                        if (item.isTomorrow === "0") {
                            if (this.tableDataR[index - 1].isTomorrow === "1") {
                                key = false;
                                return this.$utils.message({
                                    message: `第${index}时间段不能跨天！`,
                                });
                            }
                            if (
                                this.computeTime(
                                    item.stageStartTime,
                                    this.tableDataR[index - 1].stageEndTime
                                )
                            ) {
                                key = false;
                                return this.$utils.message({
                                    message: `第${
                                        index + 1
                                    }时间段开始时间须大于上一结束时间！`,
                                });
                            }
                        } else {
                            if (
                                this.computeTime(
                                    item.stageStartTime,
                                    item.stageEndTime
                                )
                            ) {
                                if (
                                    this.tableDataR[index - 1].isTomorrow ===
                                    "1"
                                ) {
                                    if (
                                        this.computeTime(
                                            item.stageStartTime,
                                            this.tableDataR[index - 1]
                                                .stageEndTime
                                        )
                                    ) {
                                        key = false;
                                        return this.$utils.message({
                                            message: `第${
                                                index + 1
                                            }时间段开始时间须大于上一结束时间！`,
                                        });
                                    }
                                } else {
                                    if (
                                        this.computeTime(
                                            this.tableDataR[index - 1]
                                                .stageEndTime,
                                            item.stageStartTime
                                        )
                                    ) {
                                        key = false;
                                        return this.$utils.message({
                                            message: `第${
                                                index + 1
                                            }时间段开始时间须小于上一结束时间！`,
                                        });
                                    }
                                }
                            } else {
                                if (
                                    this.tableDataR[index - 1].isTomorrow ===
                                    "1"
                                ) {
                                    key = false;
                                    return this.$utils.message({
                                        message: `第${index}时间段不能跨天！`,
                                    });
                                } else {
                                    if (
                                        this.computeTime(
                                            item.stageStartTime,
                                            this.tableDataR[index - 1]
                                                .stageEndTime
                                        )
                                    ) {
                                        key = false;
                                        return this.$utils.message({
                                            message: `第${
                                                index + 1
                                            }时间段开始时间须大于上一结束时间！`,
                                        });
                                    }
                                }
                            }
                        }
                    }
                } else {
                    key = false;
                    return this.$utils.message({
                        message: `第${index + 1}时间段时间未填写完整！`,
                    });
                }
            });
            return key;
        },
        computeTime(t1, t2) {
            t1 = Moment("2020-02-02 " + t1);
            t2 = Moment("2020-02-02 " + t2);
            return t1.isBefore(t2);
        },
        uploadFile(e) {
            this.loading = this.$loading({
                lock: true,
                text: "导入中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            this.$requestImport(
                "/ly/mp/mom/mes/vmes/plan/workingPartternService/importWorkingParttern.do",
                e,
                (res) => {
                    this.loading.close();
                    if (res.result == "1") {
                        this.$utils.message({
                            message: "导入成功！",
                        });
                        this.search();
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                },
                `&plantCode=${this.formField.plantCode}`
            );
        },
        downloadExcell() {
            // let hrefStr = encodeURI(
            //     "/static/ImportTemplate/mes/作业形式管理_导入模板.xlsx"
            // ); //本地测试url
            let hrefStr = encodeURI(
                "/vue-dist/mesControl/static/ImportTemplate/mes/工作模式管理_导入模板.xlsx"
            ); //线上url
            window.location.href = hrefStr;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productionTypeManagement/productionTypeManagement.scss";
</style>
