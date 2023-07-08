<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="600px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="编辑VIN码后6位"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <div class="flex m_b_10">
                <div class="flex width50">
                    <div class="label m_r_10">车辆类型</div>
                    <div>{{ formData.REMARK }}</div>
                </div>
                <div class="flex width50">
                    <div class="label m_r_10">当前流水号</div>
                    <el-input
                        v-rule="'36'"
                        v-model="formData.NEXT_SERIAL_NO"
                    ></el-input>
                </div>
            </div>
            <div class="flex">
                <div class="flex width50">
                    <div class="label m_r_10">最小流水号</div>
                    <el-input
                        v-rule="'36'"
                        v-model="formData.MIN_SERIAL_NO"
                    ></el-input>
                </div>
                <div class="flex width50">
                    <div class="label m_r_10">最大流水号</div>
                    <el-input
                        v-rule="'36'"
                        v-model="formData.MAX_SERIAL_NO"
                    ></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog_footer">
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="closeMoule">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { saveVinRulesAfter } from "@/api/apiList/mes";
export default {
    name: "editAfter",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        plantCode: {
            type: String,
            default: "",
        },
        afterRow: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            formData: {
                PLANT_CODE: "",
                SERIAL_NO_CTRL_ID: "",
                REMARK: "",
                NEXT_SERIAL_NO: "",
                MIN_SERIAL_NO: "",
                MAX_SERIAL_NO: "",
            },
        };
    },
    created() {
        this.formData.PLANT_CODE = this.plantCode;
        this.formData.SERIAL_NO_CTRL_ID = this.afterRow.SERIAL_NO_CTRL_ID;
        this.formData.REMARK = this.afterRow.REMARK;
        this.formData.NEXT_SERIAL_NO = this.afterRow.NEXT_SERIAL_NO;
        this.formData.MIN_SERIAL_NO = this.afterRow.MIN_SERIAL_NO;
        this.formData.MAX_SERIAL_NO = this.afterRow.MAX_SERIAL_NO;
    },
    methods: {
        save() {
            if (
                !this.formData.NEXT_SERIAL_NO ||
                !this.formData.MIN_SERIAL_NO ||
                !this.formData.MAX_SERIAL_NO
            ) {
                return this.$utils.message({
                    message: "请填写完整信息！",
                });
            }
            if (
                Number(this.formData.NEXT_SERIAL_NO) <
                    Number(this.formData.MIN_SERIAL_NO) ||
                Number(this.formData.NEXT_SERIAL_NO) >
                    Number(this.formData.MAX_SERIAL_NO)
            ) {
                return this.$utils.message({
                    message:
                        "当前流水号不在最小流水号和最大流水号区间，请重新填写！",
                });
            }
            this.$confirm("是否保存数据?", "提示", {
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
                    saveVinRulesAfter(this.formData)
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") {
                                this.closeMoule();
                            }
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_wrap {
    padding: 10px 16px;
    line-height: 32px;
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .m_r_10 {
        margin-right: 10px;
    }
    .el-input {
        width: 160px;
    }
    .label {
        width: 80px;
        flex-shrink: 0;
    }
    .width50 {
        width: 50%;
    }
    .dialog_footer {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
