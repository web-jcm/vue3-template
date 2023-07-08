<template>
    <div class="form_wrap">
        <div class="btn_wrap flex">
            <div class="flex">
                <div class="label">
                    <span style="color: red">*</span>工厂名称
                </div>
                <el-select v-model="formData.PLANT_CODE" placeholder="请选择">
                    <el-option
                        v-for="item in plants"
                        :key="item.PLANT_CODE"
                        :label="item.PLANT_NAME"
                        :value="item.PLANT_CODE"
                    >
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button
                    icon="iconfont icon-search"
                    type="primary"
                    @click="search()"
                    >查询</el-button
                >
            </div>
        </div>
        <div class="form_item_wrap">
            <div class="width5 m_r_10">
                <el-divider content-position="left">车辆识别Key</el-divider>
                <div class="form_item">
                    <div class="flex justify_between m_b_10">
                        <div class="width5">区域 从</div>
                        <div class="width5">至</div>
                    </div>
                    <div class="flex justify_between m_b_10">
                        <div class="width5">
                            <el-select
                                v-model="formData.ZONE_NAME_FROM"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                    :label="item.ZONE_NAME"
                                    :value="item.ZONE_CODE"
                                    v-for="item in selectArr3"
                                    :key="item.ZONE_CODE"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="width5">
                            <el-select
                                v-model="formData.ZONE_NAME_TO"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                    :label="item.ZONE_NAME"
                                    :value="item.ZONE_CODE"
                                    v-for="item in selectArr3"
                                    :key="item.ZONE_CODE"
                                ></el-option>
                            </el-select>
                        </div>
                    </div>
                    <!-- <div class="flex justify_around m_b_10">
                        <div class="width5">空识别标志</div>
                        <div class="width5">
                            <el-checkbox v-model="formData.EMPTY_FLAG"
                                >有效</el-checkbox
                            >
                        </div>
                    </div> -->
                </div>
                <el-divider content-position="left">范围指定</el-divider>
                <div class="form_item">
                    <div class="flex m_b_10">
                        <div class="title m_r_10">对象范围</div>
                        <div class="title m_r_10">从</div>
                        <div class="title m_r_10">至</div>
                    </div>
                    <div class="flex m_b_10">
                        <div class="m_r_10">
                            <el-select
                                v-model="formData.SPEC_ID_WITH_IN"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                    :label="item.KEY_VALUE1"
                                    :value="item.KEY_CODE1"
                                    v-for="item in selectArr1"
                                    :key="item.KEY_CODE1"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="m_r_10">
                            <el-input
                                v-rule="'28'"
                                v-model="formData.SPEC_WITH_IN_FROM"
                            ></el-input>
                        </div>
                        <div class="m_r_10">
                            <el-input
                                v-rule="'28'"
                                v-model="formData.SPEC_WITH_IN_TO"
                            ></el-input>
                        </div>
                    </div>
                    <div class="flex m_b_10">
                        <div class="title m_r_10">连续编号</div>
                        <div class="title m_r_10">从</div>
                        <div class="title m_r_10">至</div>
                    </div>
                    <div class="flex m_b_10">
                        <div class="m_r_10">
                            <el-select
                                v-model="formData.SERIAL_TYPE"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                    :label="item.LOOKUP_VALUE_NAME"
                                    :value="item.LOOKUP_VALUE_CODE"
                                    v-for="item in selectArr4"
                                    :key="item.LOOKUP_VALUE_CODE"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="m_r_10">
                            <el-input
                                v-rule="SERIAL_TYPE_rule"
                                v-model="formData.SERIAL_NO_START"
                            ></el-input>
                        </div>
                        <div class="m_r_10">
                            <el-input
                                v-rule="SERIAL_TYPE_rule"
                                v-model="formData.SERIAL_NO_END"
                            ></el-input>
                        </div>
                    </div>
                </div>
                <el-divider content-position="left">作业指示代码</el-divider>
                <div class="form_item">
                    <div class="flex m_b_10 form_item_left">
                        <div class="title m_r_10">指示区分</div>
                        <div class="title m_r_10">读取位置</div>
                        <div class="title m_r_10">条件</div>
                    </div>
                    <div
                        class="flex m_b_10"
                        v-for="(info, index) in baseInfo3"
                        :key="index + '3'"
                    >
                        <div class="flex form_item_left">
                            <div class="m_r_10">
                                <el-select
                                    v-model="info.DIVISION"
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                        :label="item.LOOKUP_VALUE_NAME"
                                        :value="item.LOOKUP_VALUE_CODE"
                                        v-for="item in selectArr2"
                                        :key="item.LOOKUP_VALUE_CODE"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="m_r_10">
                                <el-input
                                    v-rule="'31'"
                                    v-model="info.POSITION"
                                ></el-input>
                            </div>
                            <div class="m_r_10">
                                <el-input
                                    v-rule="'30'"
                                    v-model="info.INST_CONDITION"
                                ></el-input>
                            </div>
                        </div>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            round
                            v-if="index === 0"
                            @click="addInfo3()"
                        ></el-button>
                        <el-button
                            type="primary"
                            icon="el-icon-minus"
                            round
                            v-if="index === baseInfo3.length - 1 && index !== 0"
                            @click="minusInfo3()"
                        ></el-button>
                    </div>
                </div>
            </div>
            <div class="width5">
                <el-divider content-position="left">车辆基本信息</el-divider>
                <div class="form_item">
                    <div class="m_b_10">对象（AND）</div>
                    <div
                        class="m_b_10"
                        v-for="(info, index) in baseInfo"
                        :key="index"
                    >
                        <el-select
                            v-model="info.SPEC_KEY"
                            placeholder="请选择"
                            class="m_r_10"
                            clearable
                        >
                            <el-option
                                :label="item.KEY_VALUE1"
                                :value="item.KEY_CODE1"
                                v-for="item in selectArr1"
                                :key="item.KEY_CODE1"
                            ></el-option>
                        </el-select>
                        <el-input
                            class="m_r_10"
                            v-rule="'29'"
                            v-model="info.SPEC_VALUE"
                            @focus="clickInput(1, index)"
                        ></el-input>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            round
                            v-if="index === 0"
                            @click="addInfo()"
                        ></el-button>
                        <el-button
                            type="primary"
                            icon="el-icon-minus"
                            round
                            v-if="index === baseInfo.length - 1 && index !== 0"
                            @click="minusInfo1()"
                        ></el-button>
                    </div>
                    <div class="m_b_10">对象外（NOT OR）</div>
                    <div
                        class="m_b_10"
                        v-for="(info, index) in baseInfo2"
                        :key="index + '2'"
                    >
                        <el-select
                            v-model="info.SPEC_KEY"
                            placeholder="请选择"
                            class="m_r_10"
                            clearable
                        >
                            <el-option
                                :label="item.KEY_VALUE1"
                                :value="item.KEY_CODE1"
                                v-for="item in selectArr1"
                                :key="item.KEY_CODE1"
                            ></el-option>
                        </el-select>
                        <el-input
                            class="m_r_10"
                            v-rule="'29'"
                            v-model="info.SPEC_VALUE"
                            @focus="clickInput(2, index)"
                        ></el-input>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            round
                            v-if="index === 0"
                            @click="addInfo2()"
                        ></el-button>
                        <el-button
                            type="primary"
                            icon="el-icon-minus"
                            round
                            v-if="index === baseInfo2.length - 1 && index !== 0"
                            @click="minusInfo2()"
                        ></el-button>
                    </div>
                    <div class="assist_wrap">
                        <div class="m_r_10">辅助Key</div>
                        <el-button type="warning" @click="clickAssist('|')"
                            >OR(|)</el-button
                        >
                        <el-button type="warning" @click="clickAssist('*')"
                            >部分一致(*)</el-button
                        >
                        <el-button type="warning" @click="clickAssist('?')"
                            >一文字(?)</el-button
                        >
                    </div>
                </div>
            </div>
        </div>
        <to-view ref="toView" :handleVisible="visible" @close="close" />
    </div>
</template>
<script>
import {
    queryLookupValues,
    queryCarEditDown,
    getCarSearchZone,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "vehiclesInfoSearch",
    components: {
        ToView: () => import("./toView"),
    },
    // 组件混入对象
    mixins: [],
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            // 网格查询API配置对象
            apiConfig: "",
            formData: {
                CAR_SPEC_ROWS: [],
                WI_ROWS: [],
                PLANT_CODE: "",
                EMPTY_FLAG: "0",
                ZONE_NAME_FROM: "",
                ZONE_NAME_TO: "",
                SPEC_WITH_IN_FROM: "",
                SPEC_WITH_IN_TO: "",
                SPEC_ID_WITH_IN: "",
                SERIAL_NO_END: "",
                SERIAL_NO_START: "",
                SERIAL_TYPE: "",
            },
            baseInfo: [
                {
                    SPEC_KEY: "",
                    SPEC_VALUE: "",
                    TYPE: "1",
                },
            ],
            baseInfo2: [
                {
                    SPEC_KEY: "",
                    SPEC_VALUE: "",
                    TYPE: "2",
                },
            ],
            baseInfo3: [
                {
                    DIVISION: "",
                    INST_CONDITION: "",
                    POSITION: "",
                },
            ],
            selectArr1: [],
            selectArr2: [],
            selectArr3: [],
            selectArr4: [],
            currentInput: [],
            checked: false,
            visible: false,
            plants: [],
        };
    },
    computed: {
        SERIAL_TYPE_rule: function () {
            let rule = "";
            if (this.formData.SERIAL_TYPE === "1") {
                rule = "9";
            } else if (this.formData.SERIAL_TYPE === "2") {
                rule = "10";
            }
            return rule;
        },
    },
    async created() {
        await this.queryPlant();
        this.queryCarEditDown();
        this.queryLookupValues("WI_TYPE");
        this.queryLookupValues("SERIAL_TYPE");
        this.getCarSearchZone();
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
                            this.formData.PLANT_CODE = res.rows[0].PLANT_CODE;
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
            this.formData.CAR_SPEC_ROWS = [];
            this.formData.WI_ROWS = [];
            if (!this.formData.SPEC_ID_WITH_IN) {
                this.formData.SPEC_WITH_IN_FROM = "";
                this.formData.SPEC_WITH_IN_TO = "";
            }
            if (!this.formData.SERIAL_TYPE) {
                this.formData.SERIAL_NO_START = "";
                this.formData.SERIAL_NO_END = "";
            }
            this.baseInfo.forEach((item) => {
                if (item.SPEC_VALUE && item.SPEC_KEY) {
                    this.formData.CAR_SPEC_ROWS.push(item);
                } else {
                    item.SPEC_VALUE = "";
                }
            });
            this.baseInfo2.forEach((item) => {
                if (item.SPEC_VALUE && item.SPEC_KEY) {
                    this.formData.CAR_SPEC_ROWS.push(item);
                } else {
                    item.SPEC_VALUE = "";
                }
            });
            this.baseInfo3.forEach((item) => {
                if (item.DIVISION && item.INST_CONDITION && item.POSITION) {
                    this.formData.CAR_SPEC_ROWS.push(item);
                } else {
                    item.INST_CONDITION = "";
                    item.POSITION = "";
                }
            });
            this.visible = true;
        },
        queryCarEditDown() {
            queryCarEditDown({
                PLANT_CODE: this.formData.PLANT_CODE,
                EDIT_DATA_TYPE: "03",
                IS_SEARCH: "1",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr1 = res.rows;
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
        queryLookupValues(type) {
            queryLookupValues({
                plantCode: this.formData.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "WI_TYPE") {
                            this.selectArr2 = res.rows;
                        } else {
                            this.selectArr4 = res.rows;
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
        getCarSearchZone() {
            getCarSearchZone({
                PLANT_CODE: this.formData.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr3 = res.rows;
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
        clickInput(type, index) {
            this.currentInput = [];
            this.currentInput.push(type);
            this.currentInput.push(index);
        },
        clickAssist(text) {
            if (this.currentInput.length) {
                if (this.currentInput[0] === 1) {
                    this.baseInfo[this.currentInput[1]].SPEC_VALUE += text;
                } else {
                    this.baseInfo2[this.currentInput[1]].SPEC_VALUE += text;
                }
            }
        },
        addInfo() {
            if (this.baseInfo.length < 5) {
                this.baseInfo.push({
                    SPEC_KEY: "",
                    SPEC_VALUE: "",
                    TYPE: "1",
                });
            }
        },
        minusInfo1() {
            this.baseInfo.pop();
        },
        addInfo2() {
            if (this.baseInfo2.length < 5) {
                this.baseInfo2.push({
                    SPEC_KEY: "",
                    SPEC_VALUE: "",
                    TYPE: "2",
                });
            }
        },
        minusInfo2() {
            this.baseInfo2.pop();
        },
        addInfo3() {
            if (this.baseInfo3.length < 5) {
                this.baseInfo3.push({
                    DIVISION: "",
                    INST_CONDITION: "",
                    POSITION: "",
                });
            }
        },
        minusInfo3() {
            this.baseInfo3.pop();
        },
        close() {
            this.visible = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesInfoSearch/vehiclesInfoSearch.scss";
</style>
