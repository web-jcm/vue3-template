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
            title="颜色特征码维护"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <div class="flex m_b_10">
                <div class="flex width50">
                    <div class="label m_r_10">颜色编码</div>
                    <el-input disabled v-model="formData.COLOR_K"></el-input>
                </div>
                <div class="flex width50">
                    <div class="label m_r_10">颜色名称</div>
                    <el-input disabled v-model="formData.COLOR_NAME"></el-input>
                </div>
            </div>
            <div class="flex m_b_10">
                <div class="flex width50">
                    <div class="label m_r_10">
                        <span style="color: red">*</span>是否双色
                    </div>
                    <el-select v-model="formData.IS_TWO_COLOR">
                        <el-option label="是" value="1"> </el-option>
                        <el-option label="否" value="0"> </el-option>
                    </el-select>
                </div>
                <div class="flex width50">
                    <div class="label m_r_10">
                        <span style="color: red">*</span>中涂色
                    </div>
                    <el-input
                        v-rule="'37'"
                        v-model="formData.COLOR_K0"
                    ></el-input>
                </div>
            </div>
            <div class="flex">
                <div class="flex width50">
                    <div class="label m_r_10">
                        <span style="color: red">*</span>第一面漆色
                    </div>
                    <el-input
                        v-rule="'38'"
                        v-model="formData.COLOR_K1"
                    ></el-input>
                </div>
                <div class="flex width50">
                    <div class="label m_r_10">
                        <span
                            v-show="formData.IS_TWO_COLOR === '1'"
                            style="color: red"
                            >*</span
                        >第二面漆色
                    </div>
                    <el-input
                        v-rule="'39'"
                        :disabled="formData.IS_TWO_COLOR === '0'"
                        v-model="formData.COLOR_K2"
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
import { saveColorCode } from "@/api/apiList/mes";
export default {
    name: "editAfter",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        editData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            formData: {
                PLANT_CODE: "",
                OPT_TYPE: "",
                ID: "",
                COLOR_K: "",
                COLOR_NAME: "",
                IS_TWO_COLOR: "",
                COLOR_K0: "",
                COLOR_K1: "",
                COLOR_K2: "",
            },
        };
    },
    watch: {
        "formData.IS_TWO_COLOR": function (val) {
            if (val === "0") {
                this.formData.COLOR_K2 = "";
            }
        },
    },
    created() {
        this.formData.PLANT_CODE = this.editData.PLANT_CODE;
        this.formData.OPT_TYPE = this.editData.OPT_TYPE;
        this.formData.ID = this.editData.ID;
        this.formData.COLOR_K = this.editData.COLOR_K;
        this.formData.COLOR_NAME = this.editData.COLOR_NAME;
        this.formData.IS_TWO_COLOR = this.editData.IS_TWO_COLOR;
        this.formData.COLOR_K0 = this.editData.COLOR_K0;
        this.formData.COLOR_K1 = this.editData.COLOR_K1;
        this.formData.COLOR_K2 = this.editData.COLOR_K2;
    },
    methods: {
        save() {
            if (
                !this.formData.IS_TWO_COLOR ||
                !this.formData.COLOR_K0 ||
                !this.formData.COLOR_K1
            ) {
                return this.$utils.message({
                    message: "请填写完整信息！",
                });
            }
            if (this.formData.IS_TWO_COLOR === "1" && !this.formData.COLOR_K2) {
                return this.$utils.message({
                    message: "请填写第二面漆色！",
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
                    saveColorCode(this.formData)
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
    .el-input,
    .el-select {
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
