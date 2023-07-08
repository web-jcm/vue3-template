<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="false"
            :sectionH="'auto'"
        >
        </n-data-table>
        <div class="form_wrap">
            <div class="left_wrap">
                <div class="flex m_b_10">
                    <div class="flex m_r_20">
                        <div class="label">生产线</div>
                        <el-select
                            v-model="formData.LINE_NO"
                            placeholder="请选择生产线"
                        >
                            <el-option
                                v-for="item in lineList"
                                :key="item.LINE_NO"
                                :label="item.LINE_NAME"
                                :value="item.LINE_NO"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="flex">
                        <div class="label">区域</div>
                        <el-select
                            v-model="formData.ZONE_CODE"
                            placeholder="请选择区域"
                        >
                            <el-option
                                v-for="item in zoneList"
                                :key="item.ZONE_CODE"
                                :label="item.ZONE_NAME"
                                :value="item.ZONE_CODE"
                                :disabled="
                                    formData.LINE_NO === copyData.LINE_NO &&
                                    formField.isSame === '0' &&
                                    copyData.ZONE_CODE === item.ZONE_CODE
                                "
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="table_wrap">
                    <el-table
                        height="100%"
                        ref="multipleTableL"
                        :data="tableDataL"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChangeL"
                        @row-click="rowClick"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            align="center"
                            v-if="formField.isSame !== '1'"
                        ></el-table-column>
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                        ></el-table-column>
                        <el-table-column prop="BATCH_NO" label="计划批次">
                        </el-table-column>
                        <el-table-column prop="CTRL_KEY" label="管理号">
                        </el-table-column>
                        <el-table-column prop="VIN" label="VIN" width="140">
                        </el-table-column>
                        <el-table-column
                            prop="MODEL"
                            label="车型"
                            width="140"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="CONFIGURATION"
                            label="配置"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="COLOR_K"
                            label="外饰色"
                            width="50"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="COLOR_I"
                            label="内饰色"
                            width="50"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="cneter_wrap">
                <div>移动到序号</div>
                <el-input
                    v-model="insertIdx"
                    placeholder="输入序号"
                    size="mini"
                ></el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="moveTo()"
                    :disabled="formField.isSame === '1'"
                    >右　移<i class="el-icon-arrow-right"></i
                ></el-button>
                <el-button
                    type="primary"
                    size="mini"
                    @click="insertTo()"
                    :disabled="formField.isSame !== '1'"
                    >上下移<i class="el-icon-arrow-down"></i
                ></el-button>
                <el-button
                    type="primary"
                    size="mini"
                    @click="moveOut()"
                    :disabled="formField.isSame === '1'"
                    >移除<i class="el-icon-delete"></i
                ></el-button>
            </div>
            <div class="right_wrap">
                <div class="flex m_b_10">
                    <div class="flex m_r_20">
                        <div class="label">生产线</div>
                        <el-select
                            v-model="copyData.LINE_NO"
                            placeholder="请选择生产线"
                            :disabled="formField.isSame === '1'"
                        >
                            <el-option
                                v-for="item in lineList"
                                :key="item.LINE_NO"
                                :label="item.LINE_NAME"
                                :value="item.LINE_NO"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="flex">
                        <div class="label">区域</div>
                        <el-select
                            v-model="copyData.ZONE_CODE"
                            placeholder="请选择区域"
                            :disabled="formField.isSame === '1'"
                        >
                            <el-option
                                v-for="item in zoneList2"
                                :key="item.ZONE_CODE"
                                :label="item.ZONE_NAME"
                                :value="item.ZONE_CODE"
                                :disabled="
                                    formData.LINE_NO === copyData.LINE_NO &&
                                    formField.isSame === '0' &&
                                    formData.ZONE_CODE === item.ZONE_CODE
                                "
                            >
                            </el-option>
                        </el-select>
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
                        <el-table-column
                            type="selection"
                            width="55"
                            align="center"
                            v-if="formField.isSame !== '1'"
                        ></el-table-column>
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                        ></el-table-column>
                        <el-table-column prop="BATCH_NO" label="计划批次">
                        </el-table-column>
                        <el-table-column prop="CTRL_KEY" label="管理号">
                        </el-table-column>
                        <el-table-column prop="VIN" label="VIN" width="140">
                        </el-table-column>
                        <el-table-column
                            prop="MODEL"
                            label="车型"
                            width="140"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="CONFIGURATION"
                            label="配置"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="COLOR_K"
                            label="外饰色"
                            width="50"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="COLOR_I"
                            label="内饰色"
                            width="50"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="pagination_wrap" v-if="false">
            <el-pagination
                @size-change="handleSizeChangeL"
                @current-change="handleCurrentChangeL"
                v-model:current-page="pageConfig.currentPageL"
                :page-sizes="[100, 1000, 5000]"
                :page-size="100"
                layout="sizes, prev, pager, next"
                :total="pageConfig.totalL"
            >
            </el-pagination>
            <el-pagination
                @size-change="handleSizeChangeR"
                @current-change="handleCurrentChangeR"
                v-model:current-page="pageConfig.currentPageR"
                :page-sizes="[100, 1000, 5000]"
                :page-size="100"
                layout="sizes, prev, pager, next"
                :total="pageConfig.totalR"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {
    queryTrackingPTF,
    saveTrackingAdjust,
    queryLineNo,
    getCarSearchZone,
    queryLookupValues,
} from "@/api/apiList/mes";
import Sortable from "sortablejs";

export default {
    name: "productTrackingAdjust",
    components: {},
    // 组件混入对象
    mixins: [],
    data() {
        const viewPageCode = this.$route.path;
        return {
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
                            compKey: "plantCode",
                            labelName: "工厂名称",
                            codeField: "plantCode",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
                        },
                        {
                            compKey: "PRODUCT_TYPE",
                            labelName: "生产类型",
                            codeField: "PRODUCT_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            clearable: false,
                            isRequire: true,
                            options: [],
                          },
                        {
                            compKey: "isSame",
                            labelName: "同区域移动",
                            codeField: "isSame",
                            component: () =>
                                import("@/components/org/checkBox"),
                            isMust: true,
                            dataToObject: {
                                maxWordCount: 7,
                            },
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
                    plantCode: "",
                    isSame: "0",
                    PRODUCT_TYPE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            tableDataL: [],
            tableDataR: [],
            formData: {
                LINE_NO: "",
                ZONE_CODE: "",
            },
            copyData: {
                LINE_NO: "",
                ZONE_CODE: "",
            },
            lineList: [],
            zoneList: [],
            zoneList2: [],
            multipleSelectionL: [],
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
        "formField.plantCode": async function () {
            await this.queryLookupValues();
            this.queryLineNo();
        },
        "formData.LINE_NO": function (val) {
            if (this.formField.isSame === "1") {
                this.copyData.LINE_NO = this.formData.LINE_NO;
            }
            if (val && this.formField.PRODUCT_TYPE) {
                this.getCarSearchZone(1);
            }
        },
        "copyData.LINE_NO": function (val) {
            if (val && this.formField.PRODUCT_TYPE) {
                this.getCarSearchZone(2);
            }
        },
        "formData.ZONE_CODE": function () {
            if (this.formField.isSame === "1") {
                this.zoneList2 = [...this.zoneList];
                this.copyData.ZONE_CODE = this.formData.ZONE_CODE;
            }
        },
        "formField.isSame": function (res) {
            this.copyData.LINE_NO = this.formData.LINE_NO = "";
            this.copyData.ZONE_CODE = this.formData.ZONE_CODE = "";
            this.tableDataL = [];
            this.tableDataR = [];
            this.zoneList = [];
            this.zoneList2 = [];
            if (res === "1") {
                this.rowDrop();
            } else {
                this.sortable.destroy();
            }
        },
        "formField.PRODUCT_TYPE": function (val) {
            this.copyData.ZONE_CODE = this.formData.ZONE_CODE = "";
            this.tableDataL = [];
            this.tableDataR = [];
            this.zoneList = [];
            this.zoneList2 = [];
            if (val && this.formData.LINE_NO) {
                this.getCarSearchZone(1);
                this.getCarSearchZone(2);
            }
        },
    },
    mounted() {
        if (this.formField.isSame === "1") {
            this.rowDrop();
        }
    },
    methods: {
        queryLineNo() {
            this.lineList = [];
            queryLineNo({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
                            this.lineList = res.rows;
                            this.formData.LINE_NO = res.rows[0].LINE_NO;
                            if (this.formField.isSame === "0") {
                                this.copyData.LINE_NO = res.rows[0].LINE_NO;
                            }
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
        queryLookupValues() {
            this.tableComponents[1].options = [];
            return queryLookupValues({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "PRODUCT_TYPE",
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
                            this.tableComponents[1].options = res.rows;
                            this.formField.PRODUCT_TYPE =
                                res.rows[0].LOOKUP_VALUE_CODE;
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
        getCarSearchZone(type) {
            getCarSearchZone({
                PLANT_CODE: this.formField.plantCode,
                PRODUCT_TYPE: this.formField.PRODUCT_TYPE,
                LINE_NO:
                    type === 1 ? this.formData.LINE_NO : this.copyData.LINE_NO,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (type === 1) {
                            this.zoneList = res.rows;
                        } else {
                            this.zoneList2 = res.rows;
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
        async search() {
            if (
                !this.copyData.LINE_NO ||
                !this.copyData.ZONE_CODE ||
                !this.copyData.LINE_NO ||
                !this.copyData.ZONE_CODE
            ) {
                return this.$utils.message({
                    message: "请选择生产线和区域!",
                });
            }
            this.changeArr = [];
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            await this.queryTrackingPTF1();
            if (this.formField.isSame !== "1") {
                await this.queryTrackingPTF2();
            }
            this.loading.close();
        },
        queryTrackingPTF1() {
            let pram = {
                PLANT_CODE: this.formField.plantCode,
                LINE_NO: this.formData.LINE_NO,
                PRODUCT_TYPE: this.formField.PRODUCT_TYPE,
                ZONE_CODE: this.formData.ZONE_CODE,
            };
            this.tableDataL = [];
            return queryTrackingPTF(pram)
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.pageConfig.totalL = res.records;
                        this.pageConfig.currentPageL = res.pageindex;
                        this.tableDataL = res.rows;
                        if (this.formField.isSame === "1") {
                            this.pageConfig.totalR = res.records;
                            this.pageConfig.currentPageR = res.pageindex;
                            this.tableDataR = [...this.tableDataL];
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        queryTrackingPTF2() {
            let pram = {
                PLANT_CODE: this.formField.plantCode,
                LINE_NO: this.copyData.LINE_NO,
                PRODUCT_TYPE: this.formField.PRODUCT_TYPE,
                ZONE_CODE: this.copyData.ZONE_CODE,
            };
            this.tableDataR = [];
            return queryTrackingPTF(pram)
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.pageConfig.totalR = res.records;
                        this.pageConfig.currentPageR = res.pageindex;
                        this.tableDataR = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        save() {
            this.$confirm("是否保存当前调整?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let pram = {
                        plantCode: this.formField.plantCode,
                        productType: this.formField.PRODUCT_TYPE,
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
        },
        handleSelectionChangeL(val) {
            this.multipleSelectionL = val;
        },
        handleSelectionChangeR(val) {
            this.multipleSelectionR = val;
        },
        handleCurrentChangeL(val) {
            this.currentRow = val;
        },
        handleCurrentChangeR(val) {
            this.currentRow = val;
        },
        handleSizeChangeL() {
            this.search();
        },
        handleSizeChangeR() {
            this.search();
        },
        rowClick(row) {
            this.$refs.multipleTableL.toggleRowSelection(row);
        },
        moveTo() {
            if (this.multipleSelectionL.length) {
                let arr = this.multipleSelectionL.filter((item) => {
                    return !this.tableDataR.some(
                        (sel) => sel.CTRL_KEY === item.CTRL_KEY
                    );
                });
                if (this.insertIdx) {
                    let num = Number(this.insertIdx);
                    if (num > 0 && num <= this.tableDataR.length) {
                        this.tableDataR.splice(num - 1, 0, ...arr);
                        arr.forEach((item) => {
                            let obj = {
                                zoneCode1: this.formData.ZONE_CODE,
                                zoneCode2: this.copyData.ZONE_CODE,
                                ctrlKey: item.CTRL_KEY,
                                position: num,
                            };
                            this.changeArr.some((sel, index) => {
                                if (item.CTRL_KEY === sel.ctrlKey) {
                                    this.changeArr.splice(index, 1);
                                    return true;
                                }
                            });
                            this.changeArr.push(obj);
                            num++;
                        });
                    } else {
                        this.$utils.message({
                            message: "请输入已存在的序号！",
                        });
                    }
                } else {
                    let num = this.tableDataR.length + 1;
                    arr.forEach((item) => {
                        let obj = {
                            zoneCode1: this.formData.ZONE_CODE,
                            zoneCode2: this.copyData.ZONE_CODE,
                            ctrlKey: item.CTRL_KEY,
                            position: num,
                        };
                        this.changeArr.some((sel, index) => {
                            if (item.CTRL_KEY === sel.ctrlKey) {
                                this.changeArr.splice(index, 1);
                                return true;
                            }
                        });
                        this.changeArr.push(obj);
                        num++;
                    });
                    this.tableDataR.push(...arr);
                }
            } else {
                this.$utils.message({
                    message: "请先选择左侧数据！",
                });
            }
        },
        moveOut() {
            let arr = this.multipleSelectionR.filter((item) => {
                return this.tableDataL.some(
                    (sel) => sel.CTRL_KEY === item.CTRL_KEY
                );
            });
            if (arr.length) {
                this.tableDataR = this.tableDataR.filter((item) => {
                    return !arr.some((sel) => sel.CTRL_KEY === item.CTRL_KEY);
                });
                this.changeArr = this.changeArr.filter((item) => {
                    return !arr.some((sel) => sel.CTRL_KEY === item.ctrlKey);
                });
            } else {
                this.$utils.message({
                    message: "只能移除移入的数据！",
                });
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
                        if (this.formField.isSame === "1") {
                            const targetRow = this.tableDataR.splice(
                                evt.oldIndex,
                                1
                            )[0];
                            this.tableDataR.splice(evt.newIndex, 0, targetRow);
                            let obj = {
                                zoneCode1: this.formData.ZONE_CODE,
                                zoneCode2: this.copyData.ZONE_CODE,
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
                        }
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
                    zoneCode1: this.formData.ZONE_CODE,
                    zoneCode2: this.copyData.ZONE_CODE,
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
                    message: "请先选择右侧数据并输入已存在序号！",
                });
            }
            //以下代码为带多选框时的逻辑，不完善暂时放弃
            // if (this.multipleSelectionR.length && this.insertIdx) {
            //     let CTRL_KEY;
            //     this.tableDataR.forEach((item, index) => {
            //         if (index === this.insertIdx - 1) {
            //             CTRL_KEY = item.CTRL_KEY;
            //         }
            //     });
            //     if (!CTRL_KEY) {
            //         return this.$utils.message({
            //             message: "请输入正确位置！",
            //         });
            //     }
            //     let arr = this.tableDataR.filter((item) => {
            //         return !this.multipleSelectionR.some(
            //             (sel) => sel.CTRL_KEY === item.CTRL_KEY
            //         );
            //     });
            //     if (!arr.length) return; //如果勾选的元素是全部则停止
            //     arr.some((item, index) => {
            //         if (item.CTRL_KEY === CTRL_KEY) {
            //             console.log(item, index, this.multipleSelectionR);
            //             arr.splice(index, 0, ...this.multipleSelectionR);
            //             return true;
            //         }
            //     });
            //     this.tableDataR = arr;
            //     this.changeArr.push(...this.multipleSelectionR);
            //     this.changeArr = [...new Set(this.changeArr)];
            // } else {
            //     this.$utils.message({
            //         message: "请先选择并输入位置！",
            //     });
            // }
        },
        addStyle(e) {
            if (this.formField.isSame === "1") {
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
            } else {
                let changeRow = false;
                this.tableDataL.some((item) => {
                    if (item.CTRL_KEY === e.row.CTRL_KEY) {
                        changeRow = true;
                        return true;
                    }
                });
                if (changeRow) {
                    return { background: "#F56C6C" };
                }
            }
        },
    },
    beforeUnmount() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productTrackingAdjust/productTrackingAdjust.scss";
</style>
