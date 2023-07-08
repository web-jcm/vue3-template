<template>
    <div class="contain_wrap">
        <div class="btn_wrap">
            <div class="flex">
                <div class="flex">
                    <div class="label">
                        <i class="iconRequired"></i>工厂名称
                    </div>
                    <el-select v-model="formField.PLANT_CODE">
                        <el-option
                            v-for="item in plants"
                            :key="item.PLANT_CODE"
                            :label="item.PLANT_NAME"
                            :value="item.PLANT_CODE"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <div class="label"><i class="iconRequired"></i>生产线</div>
                    <el-select v-model="formField.LINE_NO">
                        <el-option
                            v-for="item in lineList"
                            :key="item.LINE_NO"
                            :label="item.LINE_NAME"
                            :value="item.LINE_NO"
                        ></el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <div class="label">区域</div>
                    <el-select v-model="formField.ZONE_CODE">
                        <el-option
                            v-for="item in zoneList"
                            :key="item.ZONE_CODE"
                            :label="item.ZONE_NAME"
                            :value="item.ZONE_CODE"
                        ></el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <div class="label">连续编号</div>
                    <el-input
                        v-model="formField.SERIAL_NO_START"
                        size="mini"
                    ></el-input>
                    <div>——</div>
                    <el-input
                        v-model="formField.SERIAL_NO_END"
                        size="mini"
                    ></el-input>
                </div>
            </div>
            <div class="row_between">
                <div class="flex">
                    <div class="label">
                        <i class="iconRequired"></i>生产车系
                    </div>
                    <el-input v-model="formField.SYAKEI" size="mini"></el-input>
                </div>
                <div class="flex">
                    <el-button
                        type="primary"
                        icon="iconfont icon-search"
                        @click="search"
                    >
                        查询
                    </el-button>
                    <el-button icon="iconfont  icon-preservation" @click="save">
                        保存
                    </el-button>
                </div>
            </div>
        </div>
        <div class="contain">
            <el-table
                class="tableL"
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
                ></el-table-column>
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column prop="CTRL_KEY" label="管理号" align="center">
                </el-table-column>
                <el-table-column prop="VIN_NO" label="VIN码" align="center">
                </el-table-column>
            </el-table>
            <el-table
                height="100%"
                class="tableR"
                ref="multipleTableR"
                :data="tableDataR"
                tooltip-effect="dark"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="SUB_LINE_NO"
                    label="生产线编号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="SUB_LINE_NAME"
                    label="生产线名"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="指示状态" align="center">
                    <template v-slot="scope">
                        <el-checkbox
                            v-model="scope.row.VALUE"
                            true-label="1"
                            false-label="0"
                        ></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {
    queryBitCar,
    queryBitLine,
    saveBitAdjust,
    queryLineNo,
    queryZone,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "productIndicateBitAdjust",
    data() {
        return {
            formField: {
                PLANT_CODE: "",
                LINE_NO: "",
                ZONE_CODE: "",
                SYAKEI: "",
                SERIAL_NO_START: "",
                SERIAL_NO_END: "",
            },
            tableDataL: [],
            tableDataR: [],
            plants: [],
            lineList: [],
            zoneList: [],
            multipleSelectionL: [],
        };
    },
    async created() {
        await this.queryPlant();
        this.queryLineNo();
        this.queryZone();
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
        queryLineNo() {
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.lineList = res.rows;
                        this.formField.LINE_NO = res.rows[0].LINE_NO;
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
        queryZone() {
            queryZone({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                TEMP_ZONES: ["B#J01"],
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.zoneList = res.rows;
                        this.formField.ZONE_CODE = res.rows[0].ZONE_CODE;
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
            if (!this.formField.SYAKEI) {
                return this.$utils.message({
                    message: "请输入生产车系！",
                });
            }
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            await this.queryBitCar();
            this.queryBitLine();
        },
        queryBitCar() {
            this.tableDataL = [];
            return queryBitCar(this.formField)
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableDataL = res.rows;
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
        queryBitLine() {
            this.tableDataR = [];
            queryBitLine(this.formField)
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        let tempArr = [];
                        res.rows.forEach(function (item) {
                            if (item.SUB_LINE_NAME) {
                                tempArr.push(item);
                            }
                        });
                        this.tableDataR = tempArr;
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
                        PLANT_CODE: this.formField.PLANT_CODE,
                        SYAKEI: this.formField.SYAKEI,
                        LINE_NO: this.formField.LINE_NO,
                        ROWS: this.tableDataR,
                        ROWS_CAR: this.multipleSelectionL,
                    };
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveBitAdjust(pram)
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
        rowClick(row) {
            this.$refs.multipleTableL.toggleRowSelection(row);
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productIndicateBitAdjust/productIndicateBitAdjust.scss";
</style>
