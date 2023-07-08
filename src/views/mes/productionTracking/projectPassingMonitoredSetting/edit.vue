<template>
    <div>
        <el-dialog
            visible
            v-dialogDrag
            :append-to-body="true"
            width="600px"
            @close="cancel"
        >
            <dialogHeader
                slot="title"
                :title="textMap[showType]"
                :style-type="$store.state.app.dialogType"
            />
            <div class="form_wrap" v-if="type == '1'">
                <div class="flex row_between m_b_10">
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>生产线
                        </div>
                        <el-input
                            v-model="formField.PROCESS_CODE"
                            :disabled="true"
                        >
                        </el-input>
                    </div>
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>生产线名
                        </div>
                        <el-input
                            v-model="formField.PROCESS_NAME"
                            :disabled="true"
                            placeholder=""
                        >
                        </el-input>
                    </div>
                </div>
                <div class="flex row_between m_b_10">
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>时长（m）
                        </div>
                        <el-input
                            v-model="formField.DURATION"
                            type="number"
                            @change="changeInput"
                            placeholder="请输入时长"
                        >
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="form_wrap" v-if="type == '2'">
                <div class="flex row_between m_b_10">
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>工程点位编码
                        </div>
                        <el-input
                            v-model="formField.PROCESS_CODE"
                            :disabled="true"
                        >
                        </el-input>
                    </div>
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>工程点位名
                        </div>
                        <el-input
                            :disabled="true"
                            v-model="formField.PROCESS_NAME"
                        >
                        </el-input>
                    </div>
                </div>
                <div class="flex row_between m_b_10">
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>时长（m）
                        </div>
                        <el-input
                            v-model="formField.DURATION"
                            type="number"
                            @change="changeInput"
                            placeholder="请输入时长"
                        >
                        </el-input>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    size="small"
                    :icon="
                        loading ? 'el-icon-loading' : 'iconfont  icon-confirm'
                    "
                    :disabled="loading ? true : false"
                    @click="save"
                    >确认</el-button
                >
                <el-button
                    size="small"
                    icon="iconfont  icon-cancel"
                    :disabled="loading ? true : false"
                    @click="cancel"
                    >取消</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { updateProjectTrack } from "@/api/apiList/mes";
import { ConsoleWriter } from "istanbul-lib-report";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        showType: {
            type: String,
            default: "edit",
        },
        type: {
            type: String,
            default: "1",
        },
        clickRowsData: {},
        mainForm: {},
        headData: {},
        formHome: {},
    },
    data() {
        return {
            isShowCarModel: false,
            loading: false,
            // 标题
            textMap: {
                add: "编辑",
                edit: "修改",
            },

            formField: {
                PLANT_CODE: this.$PLANT_CODE,
            },
        };
    },
    created() {
        // console.log(this.clickRowsData);
        // if (this.showType === "edit" && this.clickRowsData.DEVICE_ID) {
        //     this.linkEquipmentDetail();
        // }
        console.log(this.clickRowsData);
        this.formField = JSON.parse(JSON.stringify(this.clickRowsData));
        this.formField.PLANT_CODE = this.$PLANT_CODE;
        this.type = this.formField.TYPE;
    },
    methods: {
        changeInput() {
            var pattern = /^[1-9][0-9]*$/;
            if (!pattern.test(this.formField.DURATION)) {
                this.$nextTick(() => {
                    this.formField.DURATION = undefined;
                });
            }
        },
        save() {
            if (!this.formField.DURATION) {
                return this.$utils.message({
                    message: "请填写时长!",
                });
            }

            this.loading = true;
            this.formField.DURATION = Number(this.formField.DURATION);
            const param = { ...this.mainForm, ...this.formField };
            const rows = [JSON.parse(JSON.stringify(param))];
            param.rows = rows;
            updateProjectTrack(param)
                .then((res) => {
                    this.loading = false;
                    if (res.result === "1") {
                        this.$utils.message({
                            message: "保存成功！",
                        });
                        this.$emit("close", true);
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
        cancel() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.margin-top-15 {
    margin-top: 15px;
}
.form_wrap {
    padding: 16px;
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .row_between {
        justify-content: space-between;
        .el-input {
            width: 160px;
        }
        .el-select {
            width: 160px;
            line-height: 32px;
        }
    }
    .label {
        flex-shrink: 0;
        width: 100px;
    }

    /deep/ .el-textarea__inner {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
    }

    .margin-style {
        border-top: 1px solid lightgray;
        margin-top: 25px;
    }
}

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

/deep/ .el-checkbox__input {
    cursor: pointer;
    outline: 0;
    line-height: 3;
    vertical-align: middle;
}

.iconRequiredNo::before {
    content: "*";
    color: white;
    font-style: normal;
}
.margin-right-20 {
    margin-right: 20px;
}
</style>
