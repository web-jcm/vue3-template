<template>
    <div class="contain_wrap">
        <div class="btn_wrap flex">
            <div class="flex m_r_10">
                <div class="flex">
                    <div class="label">
                        <i class="iconRequired"></i>工厂名称
                    </div>
                    <el-select
                        v-model="formField.PLANT_CODE"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in plants"
                            :key="item.PLANT_CODE"
                            :label="item.PLANT_NAME"
                            :value="item.PLANT_CODE"
                        >
                        </el-option>
                    </el-select>
                </div>
                <!-- <div class="flex">
          <div class="label">装配工厂</div>
          <el-select v-model="formField.FACTORY_CODE"
            placeholder="请选择">
            <el-option v-for="item in factoryList"
              :key="item.LOOKUP_VALUE_CODE"
              :label="item.LOOKUP_VALUE_NAME"
              :value="item.LOOKUP_VALUE_CODE"></el-option>
          </el-select>
        </div> -->
                <div class="flex">
                    <div class="label">车型</div>
                    <el-input
                        v-rule="'13'"
                        v-model="formField.MODEL"
                        size="mini"
                    ></el-input>
                </div>
                <!-- <div class="flex">
                    <div class="label">外饰色</div>
                    <el-input
                        v-rule="'15'"
                        v-model="formField.COLOR_I"
                        size="mini"
                    ></el-input>
                </div>
                <div class="flex">
                    <div class="label">内饰色</div>
                    <el-input
                        v-rule="'16'"
                        v-model="formField.COLOR_K"
                        size="mini"
                    ></el-input>
                </div> -->
            </div>
            <el-button
                type="primary"
                icon="iconfont icon-search"
                @click="search"
            >
                查询
            </el-button>
        </div>
        <div class="table_wrap">
            <div class="label">
                前11位（1-8制造厂及车辆说明、9校验位、10年代码、11装配厂）
            </div>
            <el-table
                height="100%"
                ref="multipleTable1"
                :data="tableData1"
                v-loading="loading1"
                tooltip-effect="dark"
                style="flex-grow: 2"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column prop="MODEL" label="车型"></el-table-column>
                <el-table-column prop="VIN_NUM8" label="VIN1-8">
                </el-table-column>
                <el-table-column label="VIN9">
                    <template>
                        <div>系统计算</div>
                    </template>
                </el-table-column>
                <el-table-column label="VIN10">
                    <template>
                        <div>自动获取</div>
                    </template>
                </el-table-column>
                <el-table-column prop="LOOKUP_VALUE_NAME" label="VIN11">
                </el-table-column>
                <!-- <el-table-column label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="editBefore(scope.row)">编辑</el-button>
          </template>
        </el-table-column> -->
            </el-table>
            <div class="label">后6位（12-17流水号）</div>
            <el-table
                height="120"
                ref="multipleTable2"
                v-loading="loading2"
                :data="tableData2"
                tooltip-effect="dark"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="REMARK"
                    label="车辆类型"
                ></el-table-column>
                <el-table-column
                    prop="NEXT_SERIAL_NO"
                    label="当前流水号"
                ></el-table-column>
                <el-table-column
                    prop="MIN_SERIAL_NO"
                    label="最小流水号"
                ></el-table-column>
                <el-table-column
                    prop="MAX_SERIAL_NO"
                    label="最大流水号"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <el-button @click="editAfter(scope.row)"
                            >编辑</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <editBefore
            v-if="showDialog"
            :plantCode="formField.PLANT_CODE"
            :beforeRow="beforeRow"
            @close="dialogClose"
        />
        <editAfter
            v-if="showDialog2"
            :plantCode="formField.PLANT_CODE"
            :afterRow="afterRow"
            @close="dialogClose"
        />
    </div>
</template>
<script>
import {
    queryLookupValues,
    queryVinRulesBefore,
    queryVinRulesAfter,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "vinRuleManagement",
    components: {
        editBefore: () => import("./editBefore"),
        editAfter: () => import("./editAfter"),
    },
    data() {
        return {
            plants: [],
            tableData1: [],
            tableData2: [],
            loading1: false,
            loading2: false,
            factoryList: [],
            formField: {
                PLANT_CODE: "",
                // FACTORY_CODE: '',
                MODEL: "",
                // COLOR_I: '',
                // COLOR_K: '',
            },
            showDialog: false,
            showDialog2: false,
            beforeRow: {},
            afterRow: {},
        };
    },
    async created() {
        await this.queryPlant();
        // await this.queryLookupValues()
        const params = sessionStorage.getItem("vinRuleManagement");
        if (params) {
            this.formField.MODEL = JSON.parse(params).MODEL;
            this.formField.COLOR_I = JSON.parse(params).COLOR_I;
            this.formField.COLOR_K = JSON.parse(params).COLOR_K;
            sessionStorage.removeItem("vinRuleManagement");
        }
        //不集成mp
        // if (this.$route.params.MODEL) {
        //     this.formField.MODEL = this.$route.params.MODEL;
        //     this.formField.COLOR_I = this.$route.params.COLOR_I;
        //     this.formField.COLOR_K = this.$route.params.COLOR_K;
        // }
        this.$nextTick(() => this.search());
    },
    activated() {
        let params = sessionStorage.getItem("vinRuleManagement");
        if (params) {
            this.formField.MODEL = JSON.parse(params).MODEL;
            this.formField.COLOR_I = JSON.parse(params).COLOR_I;
            this.formField.COLOR_K = JSON.parse(params).COLOR_K;
            this.search();
            sessionStorage.removeItem("vinRuleManagement");
        }
        //不集成mp
        // if (this.$route.params.MODEL) {
        //     this.formField.MODEL = this.$route.params.MODEL;
        //     this.formField.COLOR_I = this.$route.params.COLOR_I;
        //     this.formField.COLOR_K = this.$route.params.COLOR_K;
        //     this.search();
        // }
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
                            this.formField.PLANT_CODE = res.rows[0].PLANT_CODE;
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
            this.queryVinRulesBefore();
            this.queryVinRulesAfter();
        },
        queryLookupValues() {
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "FACTORY",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.factoryList = res.rows;
                        this.formField.FACTORY_CODE =
                            res.rows[0].LOOKUP_VALUE_CODE;
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
        queryVinRulesBefore() {
            this.tableData1 = [];
            this.loading1 = true;
            queryVinRulesBefore(this.formField)
                .then((res) => {
                    this.loading1 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData1 = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading1 = false;
                    console.log(err);
                });
        },
        queryVinRulesAfter() {
            this.tableData2 = [];
            this.loading2 = true;
            queryVinRulesAfter(this.formField)
                .then((res) => {
                    this.loading2 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData2 = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading2 = false;
                    console.log(err);
                });
        },
        save() {
            let pram = this.formField;
            pram.CTRL_KEY = this.resultField.CTRL_KEY;
            if (this.copyData) {
                pram.ROWS = [];
                this.copyData.forEach((item) => {
                    this.$refs.multipleTable.list.some((sel) => {
                        if (
                            item.ITEM_VALUE_FIELD_CODE ===
                            sel.ITEM_VALUE_FIELD_CODE
                        ) {
                            if (item.SPEC !== sel.SPEC && sel.SPEC !== null) {
                                pram.ROWS.push(sel);
                            }
                            return;
                        }
                    });
                });
                if (pram.ROWS.length) {
                    this.$confirm("是否保存修改?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.loading = this.$loading({
                                lock: true,
                                text: "保存中",
                                background: "rgba(0, 0, 0, 0.7)",
                            });
                            saveBaseCarInfo(pram)
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
                } else {
                    return this.$utils.message({
                        message: "数据未改变!",
                    });
                }
            }
        },
        handleDel() {},
        dialogClose() {
            this.showDialog = false;
            this.showDialog2 = false;
            this.search();
        },
        editBefore(row) {
            if (row.MODEL_ID) {
                this.beforeRow = row;
            } else {
                this.beforeRow = {};
            }
            this.showDialog = true;
        },
        editAfter(row) {
            this.afterRow = row;
            this.showDialog2 = true;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vinRuleManagement/vinRuleManagement.scss";
</style>
