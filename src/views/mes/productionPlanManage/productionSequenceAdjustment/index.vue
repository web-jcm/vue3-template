<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
        >
        </n-data-table>
        <div class="form_wrap">
            <div class="left_wrap">
                <div class="title">源数据</div>
                <div class="table_wrap">
                    <el-table
                        height="100%"
                        ref="multipleTableL"
                        :data="tableDataL"
                        tooltip-effect="dark"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                        ></el-table-column>

                        <el-table-column
                            prop="CTRL_KEY"
                            align="center"
                            label="管理号"
                        >
                        </el-table-column>
                        <!-- <el-table-column prop="VIN" label="VIN" width="140">
                        </el-table-column> -->
                        <el-table-column
                            prop="MODEL"
                            align="center"
                            label="车型"
                            width="160"
                        >
                        </el-table-column>

                        <el-table-column
                            prop="COLOR_I"
                            align="center"
                            label="内饰色"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="COLOR_K"
                            align="center"
                            label="外饰色"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="CONFIGURATION"
                            align="center"
                            label="配置"
                            width="160"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="BATCH_NO"
                            align="center"
                            label="计划批次"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="right_wrap">
                <div class="title flex">
                    <div>调整后</div>
                    <div class="adjust flex">
                        <div>所选项移动到序号</div>
                        <el-input
                            v-model="insertIdx"
                            placeholder="请输入序号"
                            size="mini"
                        ></el-input>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="insertTo()"
                            >移动</el-button
                        >
                    </div>
                </div>
                <div class="table_wrap">
                    <el-table
                        height="100%"
                        ref="multipleTableR"
                        :data="tableDataR"
                        tooltip-effect="dark"
                        row-key="CTRL_KEY"
                        :row-style="addStyle"
                        :highlight-current-row="true"
                        @selection-change="handleSelectionChangeR"
                        @current-change="handleCurrentChangeR"
                    >
                        <!-- <el-table-column
                            type="selection"
                            width="55"
                            align="center"
                        >
                        </el-table-column> -->
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                        ></el-table-column>

                        <el-table-column
                            prop="CTRL_KEY"
                            align="center"
                            label="管理号"
                        >
                        </el-table-column>
                        <!-- <el-table-column prop="VIN" label="VIN" width="140">
                        </el-table-column> -->
                        <el-table-column
                            prop="MODEL"
                            align="center"
                            label="车型"
                            width="160"
                        >
                        </el-table-column>

                        <el-table-column
                            prop="COLOR_I"
                            align="center"
                            label="内饰色"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="COLOR_K"
                            align="center"
                            label="外饰色"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="CONFIGURATION"
                            align="center"
                            label="配置"
                            width="160"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="BATCH_NO"
                            align="center"
                            label="计划批次"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="pagination_wrap" v-if="false">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-model:current-page="pageConfig.currentPage"
                :page-sizes="[100, 1000, 5000]"
                :page-size="100"
                layout="sizes, prev, pager, next"
                :total="pageConfig.total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org";
import {
    queryTrackingBody,
    saveTrackingAdjust,
    queryZone,
} from "@/api/apiList/mes";
import Sortable from "sortablejs";
export default {
    name: "productionSequenceAdjustment",
    components: {},
    // 组件混入对象
    mixins: [],
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            // 网格查询API配置对象
            apiConfig: orgApis.wmBuCommonQueryFindAll,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableButtons
                    : [
                        {
                            compKey: "btnKey_query",
                              type: "primary",
                            size: "small",
                            clickEvent: () => this.search(),
                            text: this.$t("sys.button.query"),
                            name: "search",
                            position: "right",
                        },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                              clickEvent: () => this.save(),
                            text: this.$t("sys.button.save"),
                              name: "preservation",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_reset",
                              type: "",
                            size: "small",
                            clickEvent: () => this.returnTo(),
                            text: this.$t("sys.button.reset"),
                            name: "returnTo",
                            position: "right",
                        },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableComponents
                    : [
                          {
                            compKey: "PLANT_CODE",
                            labelName: "工厂名称",
                            codeField: "PLANT_CODE",
                            oFields: "PLANT_CODE,PLANT_NAME",
                              lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
                        },
                        {
                            compKey: "ZONE_CODE",
                            labelName: "区域",
                              codeField: "ZONE_CODE",
                            oFields: "ZONE_CODE,ZONE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            options: [],
                        },
                    ],
            // 动态生成网格列
            tableCols:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableCols
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableCols
                    : [],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    ZONE_CODE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            tableDataL: [],
            tableDataR: [],
            multipleSelectionR: [],
            currentRow: null,
            changeArr: [],
            sortable: null,
            insertIdx: "",
            pageConfig: {
                total: 0,
                currentPage: 1,
            },
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryZone();
        },
        "formField.ZONE_CODE": function () {
            if (this.formField.ZONE_CODE) {
                this.search();
            }
        },
    },
    mounted() {
        this.rowDrop();
    },
    methods: {
        queryZone() {
            queryZone({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                TEMP_ZONES: ["B#S01", "B#H01"],
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[1].options = res.rows;
                            this.formField.ZONE_CODE = res.rows[0].ZONE_CODE;
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
            let pram = this.formField;
            if (!pram.ZONE_CODE) {
                return this.$utils.message({
                    message: "请选择区域",
                });
            }
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryTrackingBody(pram)
                .then((res) => {
                    this.changeArr = [];
                    this.tableDataL = [];
                    this.tableDataR = [];
                    if (res.result === "1" && res.rows) {
                        this.pageConfig.total = res.records;
                        this.pageConfig.currentPage = res.pageindex;
                        this.tableDataL = [...res.rows];
                        this.tableDataR = [...res.rows];
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.changeArr = [];
                    this.tableDataL = [];
                    this.tableDataR = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        save() {
            if (this.changeArr.length) {
                this.$confirm("是否保存当前调整?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let pram = {
                            plantCode: this.formField.PLANT_CODE,
                            rows: this.changeArr,
                        };
                        this.loading = this.$loading({
                            lock: true,
                            text: "保存中",
                            background: "rgba(0, 0, 0, 0.7)",
                        });
                        saveTrackingAdjust(pram)
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
                    })
                    .catch(() => {});
            }
        },
        handleSelectionChangeR(val) {
            this.multipleSelectionR = val;
        },
        handleCurrentChangeR(val) {
            this.currentRow = val;
        },
        handleSizeChange() {
            this.search();
        },
        handleCurrentChange() {
            if (this.changeArr.length) {
                this.$confirm("是否先保存当前调整?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.save();
                    })
                    .catch(() => {});
            }
        },
        rowDrop() {
            this.sortable = Sortable.create(
                this.$refs.multipleTableR.$el.querySelectorAll(
                    ".el-table__body-wrapper > table > tbody"
                )[0],
                {
                    setData: function (dataTransfer) {
                        // to avoid Firefox bug
                        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                        dataTransfer.setData("Text", "");
                    },
                    onEnd: (evt) => {
                        const targetRow = this.tableDataR.splice(
                            evt.oldIndex,
                            1
                        )[0];
                        this.tableDataR.splice(evt.newIndex, 0, targetRow);
                        let obj = {
                            zoneCode1: this.formField.ZONE_CODE,
                            zoneCode2: this.formField.ZONE_CODE,
                            ctrlKey: targetRow.CTRL_KEY,
                            position: evt.newIndex + 1,
                        };
                        this.changeArr.some((sel, index) => {
                            if (targetRow.CTRL_KEY === sel.ctrlKey) {
                                this.changeArr.splice(index, 1);
                                return true;
                            }
                        });
                        this.changeArr.push(obj);
                    },
                }
            );
        },
        insertTo() {
            if (
                this.currentRow &&
                this.insertIdx > 0 &&
                this.insertIdx <= this.tableDataR.length
            ) {
                let idx;
                this.tableDataR.forEach((item, index) => {
                    if (item.CTRL_KEY === this.currentRow.CTRL_KEY) {
                        idx = index;
                    }
                });
                this.tableDataR.splice(idx, 1);
                this.tableDataR.splice(this.insertIdx - 1, 0, this.currentRow);
                let obj = {
                    zoneCode1: this.formField.ZONE_CODE,
                    zoneCode2: this.formField.ZONE_CODE,
                    ctrlKey: this.currentRow.CTRL_KEY,
                    position: this.insertIdx,
                };
                this.changeArr.some((sel, index) => {
                    if (this.currentRow.CTRL_KEY === sel.ctrlKey) {
                        this.changeArr.splice(index, 1);
                        return true;
                    }
                });
                this.changeArr.push(obj);
            } else {
                this.$utils.message({
                    message: "请先选择数据并输入已存在的序号！",
                });
            }
            //以下代码为带多选框时的逻辑，不完善暂时放弃
            // if (this.multipleSelectionR.length) {
            //     if (this.insertIdx != 0) {
            //         if (this.insertIdx <= this.tableDataR.length && this.insertIdx > 0) {
            //             this.multipleSelectionR.forEach((item) => {
            //                 let obj = {
            //                     zoneCode1: this.formField.ZONE_CODE,
            //                     zoneCode2: this.formField.ZONE_CODE,
            //                     ctrlKey: item.CTRL_KEY,
            //                     position: this.insertIdx,
            //                 };
            //                 this.changeArr.some((sel, index) => {
            //                     if (item.CTRL_KEY === sel.ctrlKey) {
            //                         this.changeArr.splice(index, 1);
            //                         return true;
            //                     }
            //                 });
            //                 this.changeArr.push(obj);
            //             });
            //             let CTRL_KEY = this.tableDataR[this.insertIdx - 1].CTRL_KEY;
            //             let arr = this.tableDataR.filter((item) => {
            //                 return !this.multipleSelectionR.some(
            //                     (sel) => sel.CTRL_KEY === item.CTRL_KEY
            //                 );
            //             });
            //             let idx;
            //             arr.forEach((item, index) => {
            //                 if (item.CTRL_KEY === CTRL_KEY) {
            //                     idx = index;
            //                 }
            //             });
            //             arr.splice(idx + 1, 0, ...this.multipleSelectionR);
            //             this.tableDataR = arr;
            //         }
            //     } else {
            //         let arr = this.tableDataR.filter((item) => {
            //             return !this.multipleSelectionR.some(
            //                 (sel) => sel.CTRL_KEY === item.CTRL_KEY
            //             );
            //         });
            //         arr.splice(0, 0, ...this.multipleSelectionR);
            //         this.tableDataR = arr;
            //         let num = 1;
            //         this.multipleSelectionR.forEach((item) => {
            //             let obj = {
            //                 zoneCode1: this.formField.ZONE_CODE,
            //                 zoneCode2: this.formField.ZONE_CODE,
            //                 ctrlKey: item.CTRL_KEY,
            //                 position: num,
            //             };
            //             this.changeArr.some((sel, index) => {
            //                 if (item.CTRL_KEY === sel.ctrlKey) {
            //                     this.changeArr.splice(index, 1);
            //                     return true;
            //                 }
            //             });
            //             this.changeArr.push(obj);
            //             num++;
            //         });
            //     }
            // } else {
            //     this.$utils.message({
            //         message: "请先选择数据！",
            //     });
            // }
        },
        returnTo() {
            this.tableDataR = [...this.tableDataL];
            this.changeArr = [];
            this.multipleSelectionR = [];
            this.currentRow = null;
            this.$refs.multipleTableR.setCurrentRow();
            this.insertIdx = "";
        },
        addStyle(e) {
            let changeRow = null;
            this.changeArr.some((item) => {
                if (item.ctrlKey === e.row.CTRL_KEY) {
                    changeRow = item;
                    return true;
                }
            });
            if (changeRow && e.row.POSITION !== e.rowIndex + 1) {
                return { background: "#F56C6C" };
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productionSequenceAdjustment/productionSequenceAdjustment.scss";
</style>
