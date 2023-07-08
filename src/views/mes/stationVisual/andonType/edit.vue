<!--
* description: Andon类型维护-新增/修改弹窗
* author: xufan
* createdDate: 2022-07-08
-->

<template>
    <section class="editWholeRoleManage">
        <el-dialog
            v-dialogDrag
            :close-on-click-modal="false"
            :title="textMap[popupsState]"
            :append-to-body="true"
            v-model:visible="curPopupsVisible"
            @close="sendCode"
            width="500px"
        >
            <dialogHeader
                slot="title"
                :title="textMap[popupsState]"
                :styleType="$store.state.app.dialogType"
            ></dialogHeader>
            <div class="filter-container filter-params">
                <el-row :gutter="26" ref="vailComponentList">
                    <component
                        v-for="comp in tableComponents.filter(
                            (o) => o.isMust === true
                        )"
                        :ref="
                            comp.isRequire
                                ? comp.isRequire + comp.compKey
                                : comp.compKey
                        "
                        :validrule="comp.validrule"
                        :key="comp.compKey"
                        :codeField="comp.codeField"
                        :textField="comp.textField"
                        :popupsKey="comp.compKey"
                        :is="comp.component"
                        :code="formField[comp.codeField]"
                        @changeCode="getComponentCode"
                        @focusCode="getFocusCode"
                        :disabled="comp.disabled"
                        :isRequire="comp.isRequire"
                        :isMul="comp.isMul"
                        :span="comp.span || 24"
                        :labelName="comp.labelName"
                        :lookuptype="comp.lookuptype"
                        :dateOptionsType="comp.dateOptionsType"
                        :dataToObject="{ maxWordCount: comp.maxWordCount }"
                    ></component>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                    v-for="comp in tableButtons"
                    :key="comp.compKey"
                    :type="comp.type"
                    :disabled="comp.disabled"
                    @click="comp.clickEvent"
                    >{{ comp.text }}</el-button
                >
            </div>
        </el-dialog>
    </section>
</template>
<script>
import { formMixins } from "@/components/mixins/formMixins";
import { orgApis } from "@/api/apiList/org";
import { saveAndonType, editAndonType } from "@/api/apiList/mes";
export default {
    // 组件混入对象
    mixins: [formMixins],
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), //弹窗标题
    },
    data() {
        return {
            isDisabled: false,
            saveFlag: 1, //为1时保存按钮可用，为0时保存按钮禁用
            // 保存API配置对象
            apiConfig: orgApis.saveAndonType,
            // 动态组件-按钮
            tableButtons: [
                {
                    compKey: "btnKey1",
                    type: "primary",
                    size: "small",
                    disabled: false,
                    name: "saveButton",
                    clickEvent: () => this.save(),
                    text: this.$t("sys.button.save"),
                }, // '保存'
                {
                    compKey: "btnKey2",
                    type: "",
                    size: "small",
                    clickEvent: () => this.reset(),
                    text: this.$t("sys.button.reset"),
                }, //重置
            ],
            // 标题
            textMap: {
                edit: "修改", //修改弹框名字
                add: "新增", //新增弹框名字
            },
            // 动态组件-查询条件
            tableComponents: [
                {
                    compKey: "compKey1",
                    labelName: "Andon编码:",
                    codeField: "andonCode",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    // disabled: this.popupsState !== "add",
                    isMust: true,
                    maxWordCount: 10,
                }, //Andon编码
                {
                    compKey: "compKey2",
                    labelName: "Andon类型:",
                    codeField: "andonType",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                    maxWordCount: 10,
                }, //Andon类型
                {
                    compKey: "compKey3",
                    labelName: "排序号:",
                    codeField: "orderNo",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                    maxWordCount: 10,
                }, //Andon类型
                {
                    compKey: "compKey4",
                    labelName: "备注",
                    codeField: "remark",
                    inputType: "textarea",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                }, //备注
            ],

            // 表单数据（无需赋值，由混入对象赋值）
            formField: {
                andonCode: "",
                andonType: "",
                createdDate: "",
                creator: "",
                isEnable: "",
                lastUpdatedDate: "",
                modifier: "",
                orderNo: "",
                plantCode: this.$PLANT_CODE,
                remark: "",
                sdpOrgId: "",
                sdpUserId: "",
                tableId: "",
                tenancyId: "",
                updateControlId: "",
            },
        };
    },
    mounted() {
        console.log(this);
        this.onCheckSaveButton(1);
    },
    watch: {
        curPopupsVisible: {
            handler: function () {
                if (this.popupsState == "edit") {
                    this.tableComponents[0].disabled = true;
                } else {
                    this.tableComponents[0].disabled = false;
                }
            },
        },
    },
    methods: {
        //控制保存按钮的disabled
        onCheckSaveButton(saveFlag) {
            const savetableButtons = this.tableButtons.filter(
                (o) => o.name === "saveButton"
            );
            if (saveFlag == 0) {
                savetableButtons[0].disabled = true;
            } else {
                savetableButtons[0].disabled = false;
            }
        },
        // 新增保存api
        add() {
            saveAndonType(this.formField)
                .then((res) => {
                    this.saveFlag = 1;
                    this.onCheckSaveButton(this.saveFlag);
                    this.$utils.message({
                        message: res.msg,
                    });
                    this.loading = false;
                    if (res.result === "1") {
                        this.curPopupsVisible = false;
                        this.sendCode("1");
                    }
                })
                .catch((err) => {
                    this.saveFlag = 1;
                    this.onCheckSaveButton(this.saveFlag);
                    this.loading = false;
                    console.log(err);
                });
            console.log(this.formField);
            // this.$store
            //   .dispatch("apiManage/addManage", this.formField)
            //   .then(response => {
            //     if (response.result == "1") {
            //       this.$message({
            //         message: this.$t("sys.tips.esTip5") /*保存成功*/,
            //         type: "success",
            //         duration: 2000
            //       });
            //       this.saveFlag = 1;
            //       this.onCheckSaveButton(this.saveFlag);
            //       this.curPopupsVisible = false;
            //       this.$parent.query();
            //     } else {
            //       this.saveFlag = 1;
            //       this.onCheckSaveButton(this.saveFlag);
            //       let errInfo = "保存失败,请重试";
            //       if (this.infos[response.msg]) {
            //         errInfo = this.infos[response.msg];
            //       }
            //       this.$message({
            //         message: errInfo,
            //         type: "warning",
            //         duration: 2000
            //       });
            //     }
            //   })
            //   .catch(error => {
            //     this.saveFlag = 1;
            //     this.onCheckSaveButton(this.saveFlag);
            //     reject(error);
            //   });
        },
        // 编辑保存api
        edit() {
            editAndonType(this.formField)
                .then((res) => {
                    this.saveFlag = 1;
                    this.onCheckSaveButton(this.saveFlag);
                    this.$utils.message({
                        message: res.msg,
                    });
                    this.loading = false;
                    if (res.result === "1") {
                        this.curPopupsVisible = false;
                        this.sendCode("1");
                    }
                })
                .catch((err) => {
                    this.saveFlag = 1;
                    this.onCheckSaveButton(this.saveFlag);
                    this.loading = false;
                    console.log(err);
                });
            // this.$store
            //   .dispatch("apiManage/updateManage", this.formField)
            //   .then(response => {
            //     if (response.result == "1") {
            //       this.$message({
            //         message: this.$t("sys.tips.esTip5") /*保存成功*/,
            //         type: "success",
            //         duration: 2000
            //       });
            //       this.saveFlag = 1;
            //       this.onCheckSaveButton(this.saveFlag);
            //       this.curPopupsVisible = false;
            //       this.$parent.query();
            //     } else {
            //       this.saveFlag = 1;
            //       this.onCheckSaveButton(this.saveFlag);
            //       let errInfo = "保存失败,请重试";
            //       if (this.infos[response.msg]) {
            //         errInfo = this.infos[response.msg];
            //       }
            //       this.$message({
            //         message: errInfo,
            //         type: "warning",
            //         duration: 2000
            //       });
            //     }
            //   })
            //   .catch(error => {
            //     this.saveFlag = 1;
            //     this.onCheckSaveButton(this.saveFlag);
            //     reject(error);
            //   });
        },
        //新增/编辑保存按钮
        save() {
            console.log(this);
            const that = this;
            this.$utils.validataMoth(this, "validpopup");
            if (this.valid) {
                this.saveFlag = 0;
                //第一次点击保存按钮之后禁用按钮，防止多次点击
                this.onCheckSaveButton(this.saveFlag);
                if (that.popupsState === "edit") {
                    // that.formField.apiId = that.$parent.deleteObj.apiIds
                    that.edit();
                } else {
                    that.add();
                }
            }
        },
    },
};
</script>
<style scoped>
.filter-container /deep/.el-select {
    width: 74%;
}

.el-col /deep/.el-input {
    width: 75%;
}

.filter-container /deep/ label {
    width: 20%;
}
</style>
