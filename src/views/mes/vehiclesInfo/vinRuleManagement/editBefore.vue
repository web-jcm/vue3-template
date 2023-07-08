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
            title="编辑VIN码前11位"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <div class="flex m_b_10">
                <div class="label m_r_10">车型</div>
                <div>{{ formData.MODEL }}</div>
            </div>
            <div class="flex">
                <div class="flex m_r_10">
                    <div class="label m_r_10">VIN1-8</div>
                    <el-input
                        v-rule="'35'"
                        v-model="formData.VIN_NUM8"
                    ></el-input>
                </div>
                <div class="flex">
                    <div class="label m_r_10">VIN11</div>
                    <el-select v-model="formData.FACTORY_CODE">
                        <el-option
                            v-for="item in factoryList"
                            :key="item.LOOKUP_VALUE_CODE"
                            :label="item.LOOKUP_VALUE_NAME"
                            :value="item.LOOKUP_VALUE_CODE"
                        >
                        </el-option>
                    </el-select>
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
import { queryLookupValues, saveVinRulesBefore } from "@/api/apiList/mes";
export default {
    name: "editBefore",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        plantCode: {
            type: String,
            default: "",
        },
        beforeRow: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            formData: {
                PLANT_CODE: "",
                MODEL: "",
                MODEL_ID: "",
                VIN_NUM8: "",
                FACTORY_CODE: "",
            },
            factoryList: [],
        };
    },
    created() {
        this.formData.PLANT_CODE = this.plantCode;
        if (this.beforeRow.MODEL_ID) {
            this.formData.MODEL = this.beforeRow.MODEL;
            this.formData.MODEL_ID = this.beforeRow.MODEL_ID;
            this.formData.VIN_NUM8 = this.beforeRow.VIN_NUM8 || "";
            this.formData.FACTORY_CODE = this.beforeRow.FACTORY_CODE;
        }
        this.queryLookupValues();
    },
    methods: {
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formData.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "FACTORY",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.factoryList = res.rows;
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
            if (this.formData.VIN_NUM8.length !== 8) {
                return this.$utils.message({
                    message: "请填写完整前8位！",
                });
            }
            if (!this.formData.FACTORY_CODE) {
                return this.$utils.message({
                    message: "请选择装配厂！",
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
                    saveVinRulesBefore(this.formData)
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
    .el-input {
        width: 160px;
    }
    .el-select {
        width: 160px;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .m_t_10 {
        margin-top: 10px;
    }
    .m_r_10 {
        margin-right: 10px;
    }
    .label {
        width: 80px;
        flex-shrink: 0;
    }
    .dialog_footer {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
