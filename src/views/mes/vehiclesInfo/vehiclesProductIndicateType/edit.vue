<template>
    <el-dialog
        :key="popupsTableKey"
        visible
        :close-on-click-modal="false"
        :title="textMap[popupsState]"
        :append-to-body="true"
        width="750px"
        top="1vh"
        @close="sendCode"
    >
        <dialogHeader
            slot="title"
            :title="textMap[popupsState]"
            :style-type="$store.state.app.dialogType"
        />
        <div class="form_wrap">
            <el-divider content-position="left">车辆式样类别编辑</el-divider>
            <div class="form_item_wrap">
                <div class="form_item flex">
                    <div class="flex">
                        <div class="label">生产指示类别No</div>
                        <el-input
                            v-model="formField.CATEGORY_CODE"
                            disabled
                        ></el-input>
                    </div>
                    <div class="flex">
                        <div class="label">类别区分</div>
                        <el-select v-model="formField.CATEGORY_TYPE" disabled>
                        </el-select>
                    </div>
                </div>
                <div class="form_item flex">
                    <div class="flex">
                        <div class="label">生产指示类别名</div>
                        <el-input
                            v-rule="'33'"
                            v-model="formField.CATEGORY_NAME"
                            :disabled="
                                popupsState === 'view' || popupsState === 'del'
                            "
                        ></el-input>
                    </div>
                    <div class="flex">
                        <div class="label">说明</div>
                        <el-input
                            v-rule="'34'"
                            v-model="formField.CATEGORY_COMMENT"
                            :disabled="
                                popupsState === 'view' || popupsState === 'del'
                            "
                        ></el-input>
                    </div>
                </div>
            </div>
            <el-divider content-position="left">车辆基本信息</el-divider>
            <div class="form_item_wrap">
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
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
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
                        class="m_r_10 center_input"
                        v-rule="'29'"
                        v-model="info.SPEC_VALUE"
                        @focus="clickInput(1, index)"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-input>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        round
                        v-if="index === 0"
                        @click="addInfo()"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-minus"
                        round
                        v-if="index === baseInfo.length - 1 && index !== 0"
                        @click="minusInfo1()"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
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
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
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
                        class="m_r_10 center_input"
                        v-rule="'29'"
                        v-model="info.SPEC_VALUE"
                        @focus="clickInput(2, index)"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-input>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        round
                        v-if="index === 0"
                        @click="addInfo2()"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-minus"
                        round
                        v-if="index === baseInfo2.length - 1 && index !== 0"
                        @click="minusInfo2()"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-button>
                </div>
                <div class="assist_wrap">
                    <div class="m_r_10">辅助Key</div>
                    <el-button
                        type="warning"
                        @click="clickAssist('|')"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                        >OR(|)</el-button
                    >
                    <el-button
                        type="warning"
                        @click="clickAssist('*')"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                        >部分一致(*)</el-button
                    >
                    <el-button
                        type="warning"
                        @click="clickAssist('?')"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                        >一文字(?)</el-button
                    >
                </div>
            </div>
            <el-divider content-position="left">作业指示代码</el-divider>
            <div class="form_item_wrap">
                <div class="flex m_b_10">
                    <div class="title m_r_10">指示区分</div>
                    <div class="title m_r_10">读取位置</div>
                    <div class="title m_r_10">条件</div>
                </div>
                <div
                    class="flex m_b_10"
                    v-for="(info, index) in baseInfo3"
                    :key="index + '3'"
                >
                    <div class="m_r_10">
                        <el-select
                            v-model="info.DIVISION"
                            placeholder="请选择区域"
                            :disabled="
                                popupsState === 'view' || popupsState === 'del'
                            "
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
                            :disabled="
                                popupsState === 'view' || popupsState === 'del'
                            "
                        ></el-input>
                    </div>
                    <div class="m_r_10">
                        <el-input
                            v-rule="'30'"
                            v-model="info.INST_CONDITION"
                            :disabled="
                                popupsState === 'view' || popupsState === 'del'
                            "
                        ></el-input>
                    </div>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        round
                        v-if="index === 0"
                        @click="addInfo3()"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-minus"
                        round
                        v-if="index === baseInfo3.length - 1 && index !== 0"
                        @click="minusInfo3()"
                        :disabled="
                            popupsState === 'view' || popupsState === 'del'
                        "
                    ></el-button>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <template v-for="comp in tableButtons">
                <el-button
                    v-if="
                        comp.compKey === 'btnKey_cancel' ||
                        ((popupsState === 'edit' || popupsState === 'add') &&
                            comp.compKey === 'btnKey_confirm') ||
                        (popupsState === 'del' &&
                            comp.compKey === 'btnKey_delete')
                    "
                    :key="comp.compKey"
                    :type="comp.type"
                    :size="comp.size"
                    :icon="loading ? 'el-icon-loading' : comp.icon"
                    :disabled="loading ? true : false"
                    @click="comp.clickEvent"
                >
                    {{ comp.text }}
                </el-button>
            </template>
        </div>
    </el-dialog>
</template>
<script>
import { formMixins } from "@/components/mixins/formMixins";
import {
    getProductIndicateInfo,
    queryLookupValues,
    queryCarEditDown,
    saveProductIndicate,
    delProductIndicate,
} from "@/api/apiList/mes";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [formMixins],
    props: {
        plantCode: {
            type: String,
            default: "",
        },
        addId: "",
    },
    data() {
        // 弹窗页面标识（由引用页面赋值）
        const viewPageCode = "typeEdit";
        return {
            loading: false,
            // 保存API配置对象
            apiConfig: "",
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
                            compKey: "btnKey_confirm",
                            type: "primary",
                            size: "small",
                            icon: "iconfont  icon-confirm",
                            clickEvent: () => this.save(),
                            text: this.$t("sys.button.confirm"), // 确认
                          },
                        {
                            compKey: "btnKey_delete",
                            type: "primary",
                            size: "small",
                            icon: "iconfont icon-quanbushanchu",
                            clickEvent: () => this.delete(),
                            text: this.$t("sys.button.delete"),
                        },
                        {
                              compKey: "btnKey_cancel",
                            type: "",
                            size: "small",
                            icon: "iconfont  icon-cancel",
                              clickEvent: () => this.sendCode(),
                            text: this.$t("sys.button.cancel"), // 取消
                        },
                    ],
            // 标题
            textMap: {
                edit: "生产指示类别编辑",
                add: "生产指示类别新增",
                view: "生产指示类别详情",
                del: "生产指示类别详情",
            },
            // 表单数据（无需赋值，由混入对象赋值）
            formField: this.$utils.getFormField(
                this,
                {
                    CATEGORY_CODE: "",
                    CATEGORY_TYPE: "P1",
                    CATEGORY_NAME: "",
                    CATEGORY_COMMENT: "",
                    CAR_SPEC_ROWS: [],
                    WI_ROWS: [],
                    PLANT_CODE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode],
                null,
                "formComponents"
            ),
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
            selectArr1: [],
            baseInfo3: [
                {
                    DIVISION: "",
                    INST_CONDITION: "",
                    POSITION: "",
                },
            ],
            selectArr2: [],
            currentInput: [],
        };
    },
    created() {
        if (!this.selectArr1.length) {
            this.queryCarEditDown();
        }
        if (!this.selectArr2.length) {
            this.queryLookupValues();
        }
        this.formField.PLANT_CODE = this.plantCode;
        this.formField.CATEGORY_CODE = this.addId;
        if (
            this.dynamicEditRowData.CATEGORY_CODE &&
            this.popupsState !== "add"
        ) {
            this.formField.CATEGORY_CODE =
                this.dynamicEditRowData.CATEGORY_CODE;
            this.formField.CATEGORY_NAME =
                this.dynamicEditRowData.CATEGORY_NAME;
            this.formField.CATEGORY_COMMENT =
                this.dynamicEditRowData.CATEGORY_COMMENT;
            this.formField.CATEGORY_TYPE =
                this.dynamicEditRowData.CATEGORY_TYPE;
            this.$nextTick(() => this.search());
        }
    },
    methods: {
        queryCarEditDown() {
            queryCarEditDown({
                PLANT_CODE: this.plantCode,
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
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "WI_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr2 = res.rows;
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
            let pram = {
                CATEGORY_CODE: this.dynamicEditRowData.CATEGORY_CODE,
                PLANT_CODE: this.plantCode,
            };
            this.loading = true;
            getProductIndicateInfo(pram)
                .then((res) => {
                    this.loading = false;
                    if (res.result === "1" && res.rows) {
                        this.baseInfo = res.rows.CAR_SPEC_ROWS.filter(
                            (o) => o.TYPE === "1"
                        );
                        if (!this.baseInfo.length) {
                            this.baseInfo.push({
                                SPEC_KEY: "",
                                SPEC_VALUE: "",
                                TYPE: "1",
                            });
                        }
                        this.baseInfo2 = res.rows.CAR_SPEC_ROWS.filter(
                            (o) => o.TYPE === "2"
                        );
                        if (!this.baseInfo2.length) {
                            this.baseInfo2.push({
                                SPEC_KEY: "",
                                SPEC_VALUE: "",
                                TYPE: "2",
                            });
                        }
                        this.baseInfo3 = res.rows.WI_ROWS;
                        if (!this.baseInfo3.length) {
                            this.baseInfo3.push({
                                DIVISION: "",
                                INST_CONDITION: "",
                                POSITION: "",
                            });
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading = false;
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
        // 保存
        save() {
            this.loading = true;
            if (
                this.formField.CATEGORY_CODE === "" ||
                this.formField.CATEGORY_NAME === "" ||
                this.formField.CATEGORY_COMMENT === ""
            ) {
                this.loading = false;
                return this.$utils.message({
                    message: "请填写上方类别信息!",
                });
            }
            if (
                (this.baseInfo.length &&
                    this.baseInfo[0].SPEC_KEY &&
                    this.baseInfo[0].SPEC_VALUE) ||
                (this.baseInfo2.length &&
                    this.baseInfo2[0].SPEC_KEY &&
                    this.baseInfo2[0].SPEC_VALUE) ||
                (this.baseInfo3.length &&
                    this.baseInfo3[0].DIVISION &&
                    this.baseInfo3[0].INST_CONDITION &&
                    this.baseInfo3[0].POSITION)
            ) {
                this.baseInfo.forEach((item) => {
                    if (item.SPEC_KEY && item.SPEC_VALUE) {
                        this.formField.CAR_SPEC_ROWS.push(item);
                    } else {
                        item.SPEC_VALUE = "";
                    }
                });
                this.baseInfo2.forEach((item) => {
                    if (item.SPEC_KEY && item.SPEC_VALUE) {
                        this.formField.CAR_SPEC_ROWS.push(item);
                    } else {
                        item.SPEC_VALUE = "";
                    }
                });
                this.baseInfo3.forEach((item) => {
                    if (item.DIVISION && item.INST_CONDITION && item.POSITION) {
                        this.formField.WI_ROWS.push(item);
                    } else {
                        item.INST_CONDITION = "";
                        item.POSITION = "";
                    }
                });
                this.$confirm(
                    `确定要${
                        this.popupsState === "add" ? "新增" : "修改"
                    }数据吗?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                    .then(() => {
                        saveProductIndicate(this.formField)
                            .then((res) => {
                                this.$utils.message({
                                    message: res.msg,
                                });
                                this.loading = false;
                                if (res.result === "1") this.sendCode("1");
                            })
                            .catch((err) => {
                                this.loading = false;
                                console.log(err);
                            });
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else {
                this.loading = false;
                this.$utils.message({
                    message: "车辆基本信息和作业指示至少填写一项!",
                });
            }
        },
        delete() {
            this.$confirm("此操作将删除数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = true;
                    delProductIndicate({
                        CATEGORY_CODE: this.dynamicEditRowData.CATEGORY_CODE,
                        PLANT_CODE: this.plantCode,
                    })
                        .then((res) => {
                            this.$utils.message({
                                message: res.msg,
                            });
                            this.loading = false;
                            if (res.result === "1") this.sendCode("1");
                        })
                        .catch((err) => {
                            this.loading = false;
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesProductIndicateType/edit.scss";
</style>
