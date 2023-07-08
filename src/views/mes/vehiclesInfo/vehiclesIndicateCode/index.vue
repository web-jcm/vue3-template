<template>
    <div class="contain_wrap">
        <div class="btn_wrap">
            <div class="flex">
                <div class="label"><i class="iconRequired"></i>工厂名称</div>
                <el-select v-model="formField.PLANT_CODE" placeholder="请选择">
                    <el-option
                        v-for="item in plants"
                        :key="item.PLANT_CODE"
                        :label="item.PLANT_NAME"
                        :value="item.PLANT_CODE"
                    ></el-option>
                </el-select>
            </div>
            <div class="flex">
                <div class="label"><i class="iconRequired"></i>车型</div>
                <el-input
                    v-rule="'13'"
                    v-model="formField.MODEL"
                    size="mini"
                ></el-input>
            </div>
            <!-- <div class="flex">
                <div class="label"><i class="iconRequired"></i>外饰色</div>
                <el-input
                    v-rule="'15'"
                    v-model="formField.COLOR_K"
                    size="mini"
                ></el-input>
            </div>
            <div class="flex">
                <div class="label"><i class="iconRequired"></i>内饰色</div>
                <el-input
                    v-rule="'16'"
                    v-model="formField.COLOR_I"
                    size="mini"
                ></el-input>
            </div> -->
            <div class="flex justify_end">
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
        <div class="contain">
            <el-tabs v-model="activeName">
                <el-tab-pane label="焊装特征码" name="B">
                    <div class="flex">
                        <div class="idx_wrap">
                            <div class="idx_title"></div>
                            <div
                                class="idx"
                                v-for="idx in Math.ceil(wordLength.arr / 25)"
                                :key="idx"
                            >
                                {{ idx * 25 }}
                            </div>
                        </div>
                        <div class="tab_wrap">
                            <div class="flex">
                                <div v-for="num in 25" :key="num" class="num">
                                    {{ num }}
                                </div>
                            </div>
                            <div class="flex_wrap">
                                <el-input
                                    v-for="item in wordLength.arr"
                                    :key="item"
                                    v-model="arr[item - 1]"
                                    maxlength="2"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="涂装特征码" name="P">
                    <div class="flex">
                        <div class="idx_wrap">
                            <div class="idx_title"></div>
                            <div
                                class="idx"
                                v-for="idx in Math.ceil(wordLength.arr2 / 25)"
                                :key="idx"
                            >
                                {{ idx * 25 }}
                            </div>
                        </div>
                        <div class="tab_wrap">
                            <div class="flex">
                                <div v-for="num in 25" :key="num" class="num">
                                    {{ num }}
                                </div>
                            </div>
                            <div class="flex_wrap">
                                <el-input
                                    v-for="item in wordLength.arr2"
                                    :key="item"
                                    v-model="arr2[item - 1]"
                                    maxlength="2"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="总装特征码" name="T">
                    <div class="flex">
                        <div class="idx_wrap">
                            <div class="idx_title"></div>
                            <div
                                class="idx"
                                v-for="idx in Math.ceil(wordLength.arr3 / 25)"
                                :key="idx"
                            >
                                {{ idx * 25 }}
                            </div>
                        </div>
                        <div class="tab_wrap">
                            <div class="flex">
                                <div v-for="num in 25" :key="num" class="num">
                                    {{ num }}
                                </div>
                            </div>
                            <div class="flex_wrap">
                                <el-input
                                    v-for="item in wordLength.arr3"
                                    :key="item"
                                    v-model="arr3[item - 1]"
                                    maxlength="2"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="零件特征码" name="Long Code Item">
                    <div class="flex">
                        <div class="idx_wrap">
                            <div class="idx_title"></div>
                            <div
                                class="idx"
                                v-for="idx in Math.ceil(wordLength.arr4 / 5)"
                                :key="idx"
                            >
                                {{ idx * 5 }}
                            </div>
                        </div>
                        <div class="tab_wrap">
                            <div class="flex">
                                <div v-for="num in 5" :key="num" class="num2">
                                    {{ num }}
                                </div>
                            </div>
                            <div class="flex_wrap4">
                                <el-input
                                    v-for="item in wordLength.arr4"
                                    :key="item"
                                    v-model="arr4[item - 1]"
                                    maxlength="12"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import {
    queryCarModel,
    queryLookupValues,
    saveIndicateSet,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "vehiclesIndicateCode",
    data() {
        return {
            formField: {
                PLANT_CODE: "",
                MODEL: "",
                COLOR_K: "",
                COLOR_I: "",
                MODEL_ID: "",
            },
            activeName: "B",
            plants: [],
            arr: [],
            arr2: [],
            arr3: [],
            arr4: [],
            wordLength: {
                arr: 0,
                arr2: 0,
                arr3: 0,
                arr4: 0,
            },
        };
    },
    async created() {
        await this.queryPlant();
        const params = sessionStorage.getItem("vehiclesIndicateCode");
        if (params) {
            this.formField.MODEL = JSON.parse(params).MODEL;
            this.formField.COLOR_I = JSON.parse(params).COLOR_I;
            this.formField.COLOR_K = JSON.parse(params).COLOR_K;
            this.$nextTick(() => this.search());
            sessionStorage.removeItem("vehiclesIndicateCode");
        }
        //不集成mp
        // if (this.$route.params.MODEL) {
        //     this.formField.MODEL = this.$route.params.MODEL;
        //     this.formField.COLOR_I = this.$route.params.COLOR_I;
        //     this.formField.COLOR_K = this.$route.params.COLOR_K;
        //     this.$nextTick(() => this.search());
        // }
    },
    activated() {
        let params = sessionStorage.getItem("vehiclesIndicateCode");
        if (params) {
            this.formField.MODEL = JSON.parse(params).MODEL;
            this.formField.COLOR_I = JSON.parse(params).COLOR_I;
            this.formField.COLOR_K = JSON.parse(params).COLOR_K;
            this.search();
            sessionStorage.removeItem("vehiclesIndicateCode");
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
        async search() {
            if (
                !this.formField.MODEL &&
                !this.formField.COLOR_K &&
                !this.formField.COLOR_I
            ) {
                return this.$utils.message({
                    message: "请输入查询值！",
                    duration: 1000,
                });
            }
            await this.queryLookupValues();
            this.queryTable();
        },
        queryLookupValues() {
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "WI_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach((item) => {
                            if (item.ATT2 === "BODY_WI") {
                                this.wordLength.arr = Math.ceil(item.ATT1 / 2);
                            }
                            if (item.ATT2 === "PAINT_WI") {
                                this.wordLength.arr2 = Math.ceil(item.ATT1 / 2);
                            }
                            if (item.ATT2 === "TRIM_WI") {
                                this.wordLength.arr3 = Math.ceil(item.ATT1 / 2);
                            }
                            if (item.ATT2 === "LONG_WI") {
                                this.wordLength.arr4 = Math.ceil(
                                    item.ATT1 / 12
                                );
                            }
                        });
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
        queryTable() {
            this.arr = [];
            this.arr2 = [];
            this.arr3 = [];
            this.arr4 = [];
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryCarModel(this.formField)
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.formField.MODEL_ID = res.rows[0].MODEL_ID;
                        this.splitKey(res.rows[0].BODY_WI || "", "arr", 2);
                        this.splitKey(res.rows[0].PAINT_WI || "", "arr2", 2);
                        this.splitKey(res.rows[0].TRIM_WI || "", "arr3", 2);
                        this.splitKey(res.rows[0].LONG_WI || "", "arr4", 12);
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        splitKey(key, arr, numi) {
            let idx = 0;
            for (let i = 0; i < this.wordLength[arr]; i++) {
                if (idx + numi <= key.length) {
                    this[arr].push(key.slice(idx, idx + numi));
                } else {
                    this[arr].push(key.slice(idx).padEnd(numi, " "));
                }
                idx += numi;
            }
        },
        save() {
            this.$confirm("是否保存修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = {
                    PLANT_CODE: this.formField.PLANT_CODE,
                    MODEL_ID: this.formField.MODEL_ID,
                    BODY_WI: this.arr
                        .map((item) => {
                            return item.padEnd(2, " ");
                        })
                        .join(""),
                    PAINT_WI: this.arr2
                        .map((item) => {
                            return item.padEnd(2, " ");
                        })
                        .join(""),
                    TRIM_WI: this.arr3
                        .map((item) => {
                            return item.padEnd(2, " ");
                        })
                        .join(""),
                    LONG_WI: this.arr4
                        .map((item) => {
                            return item.padEnd(12, " ");
                        })
                        .join(""),
                };
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveIndicateSet(pram)
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
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesIndicateCode/vehiclesIndicateCode.scss";
</style>
