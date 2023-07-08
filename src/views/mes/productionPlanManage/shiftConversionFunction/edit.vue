<template>
    <el-dialog
        v-model:visible="dialogVisible"
        :close-on-click-modal="true"
        :append-to-body="true"
        width="800px"
        top="10%"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="生产日期变更"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_container">
            <div class="title m_b_10">日期变更对象</div>
            <div class="flex m_b_10">
                <div class="flex">
                    <div class="label">管理区间:</div>
                    <el-input
                        v-model="formField.sectionCode"
                        disabled
                    ></el-input>
                </div>
                <div class="flex">
                    <div class="label">管理区间名:</div>
                    <el-input
                        v-model="formField.sectionName"
                        disabled
                    ></el-input>
                </div>
            </div>
            <div class="title m_b_10">当班信息</div>
            <div class="flex m_b_10">
                <div class="flex">
                    <div class="label">生产日:</div>
                    <el-input v-model="formField.workDate" disabled></el-input>
                </div>
                <div class="flex">
                    <div class="label">班次:</div>
                    <el-input v-model="formField.shift" disabled></el-input>
                </div>
                <div class="flex">
                    <div class="label">形式:</div>
                    <el-input
                        v-model="formField.shiftPatternCode"
                        disabled
                    ></el-input>
                </div>
            </div>
            <div class="title m_b_10">更新后班信息</div>
            <div class="flex m_b_10">
                <div class="flex">
                    <div class="label">生产日:</div>
                    <el-date-picker
                        v-model="formField.updateWorkDate"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="date"
                        class="el-date-picker"
                        clear-icon="el-input__icon"
                        placeholder="选择时间"
                    >
                    </el-date-picker>
                </div>
                <div class="flex">
                    <div class="label">
                        <span style="color: red">*</span>班次:
                    </div>
                    <el-select
                        v-model="formField.updateShift"
                        placeholder="请选择"
                        class="el-option"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.LOOKUP_VALUE_CODE"
                            :label="item.LOOKUP_VALUE_NAME"
                            :value="item.LOOKUP_VALUE_CODE"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <div class="label">形式:</div>
                    <el-select
                        v-model="formField.updateShiftPatternCode"
                        placeholder="请选择"
                        class="el-option"
                    >
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <template v-for="comp in tableButtons">
                    <el-button
                        :key="comp.compKey"
                        :type="comp.type"
                        :icon="comp.icon"
                        @click="comp.clickEvent"
                    >
                        {{ comp.text }}
                    </el-button>
                </template>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import {
    saveSwitchShiftTime,
    queryProductionType,
    queryLookupValues,
} from "@/api/apiList/mes";
export default {
    name: "shitfEdit",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    props: {
        selectRow: { type: Object, default: () => {} },
        dialogVisible: { type: Boolean, default: false },
    },
    data() {
        return {
            // 动态组件-按钮
            tableButtons: [
                {
                    compKey: "btnKey_confirm",
                    type: "primary",
                    size: "small",
                    icon: "iconfont  icon-confirm",
                    clickEvent: () => this.save(),
                    text: this.$t("保存"),
                },
                {
                    compKey: "btnKey_cancel",
                    type: "",
                    size: "small",
                    icon: "iconfont  icon-cancel",
                    clickEvent: () => this.closeMoule(),
                    text: this.$t("取消"),
                },
            ],
            options: [],
            formField: {
                sectionCode: this.selectRow.sectionCode,
                sectionName: this.selectRow.sectionName,
                workDate: this.selectRow.workDate,
                shift: this.selectRow.shift,
                shiftPatternCode: this.selectRow.shiftPatternCode,
                updateWorkDate: this.selectRow.updateWorkDate || "",
                updateShift: this.selectRow.updateShift || "",
                updateShiftPatternCode:
                    this.selectRow.updateShiftPatternCode || "",
            },
            typeList: [],
        };
    },
    created() {
        this.queryProductionType();
        this.queryShift();
    },
    methods: {
        queryProductionType() {
            queryProductionType({
                plantCode: this.$parent.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        res.rows.rows.forEach((item) => {
                            if (item.shiftPatternCode !== "0") {
                                this.typeList.push({
                                    label: `${item.shiftPatternName} | ${item.shiftStartHhmm}-${item.shiftEndHhmm}`,
                                    value: item.shiftPatternCode,
                                });
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
        queryShift() {
            queryLookupValues({
                plantCode: this.$parent.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "SHIFT",
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.options = res.rows;
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
        save() {
            if (!this.formField.updateShift) {
                return this.$utils.message({
                    message: "请选择班次",
                });
            }
            this.$confirm("是否保存?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.formField.plantCode = this.$parent.formField.plantCode;
                this.formField.tenancyId = this.$store.state.user.tenancyId;
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveSwitchShiftTime(this.formField)
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "1") this.closeMoule();
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_container {
    padding: 16px 20px;
    .title {
        font-size: 14px;
        font-weight: bold;
        position: relative;
        &:before {
            position: absolute;
            display: block;
            width: 2px;
            height: 12px;
            background: #c3002f;
            z-index: 1;
        }
    }
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .label {
        width: 80px;
        text-align: right;
        flex-shrink: 0;
        margin-right: 10px;
    }
    /deep/ .el-input__inner {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
    }
    /deep/ .el-input {
        width: 160px;
    }
    .el-select {
        line-height: 32px;
    }
    .dialog-footer {
        display: flex;
        align-content: center;
        justify-content: flex-end;
    }
}
</style>
