<!--
* description: Andon类型维护-新增/修改弹窗
* author: xufan
* createdDate: 2022-07-08
-->

<template>
    <section class="editWholeRoleManage">
        <el-dialog
            v-if="curPopupsVisible"
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
                        :oFields="comp.oFields"
                        :isRequire="comp.isRequire"
                        :isMul="comp.isMul"
                        :span="comp.span || 24"
                        :labelName="comp.labelName"
                        :lookuptype="comp.lookuptype"
                        :options="comp.options"
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
import {
    queryUsers,
    queryPlant,
    queryLineNo,
    queryLocation,
    getPointCode,
    saveUserPoint,
    editUserPoint,
    querySysUser,
} from "@/api/apiList/mes";
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
            apiConfig: orgApis.saveUserPoint,
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
                    labelName: "用户名",
                    codeField: "userId",
                    isRequire: true,
                    oFields: "user_id,user_name",
                    component: () => import("@/components/org/LookupValue"),
                    lookuptype: "_is_null_code_",
                    type: "dropdownList",
                    disabled: this.popupsState == "edit",
                    isMust: true,
                    options: [],
                    maxWordCount: 10,
                }, //Andon编码
                {
                    compKey: "compKey2",
                    labelName: "工位屏编码",
                    codeField: "stationScreenCode",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                    maxWordCount: 10,
                }, //Andon类型
                {
                    compKey: "plantCode-e",
                    labelName: "工厂",
                    codeField: "plantCode",
                    oFields: "PLANT_CODE,PLANT_NAME",
                    component: () => import("@/components/org/LookupValue"),
                    lookuptype: "_is_null_code_",
                    type: "dropdownList",
                    isMust: true,
                    changed: () => {
                        this.tableComponents[3].options = [];
                        this.tableComponents[4].options = [];
                        this.tableComponents[5].options = [];
                        this.formField.processLocation = "";
                        this.formField.lineNo = "";
                        this.formField.pointCode = "";
                        this.queryLocation();
                    },
                    isMul: false,
                    isRequire: true,
                    options: [],
                },
                {
                    compKey: "processLocation",
                    labelName: "车间",
                    codeField: "processLocation",
                    oFields: "PROCESS_LOCATION,PROCESS_LOCATION_NAME",
                    component: () => import("@/components/org/LookupValue"),
                    lookuptype: "_is_null_code_",
                    type: "dropdownList",
                    isMust: true,
                    changed: () => {
                        this.tableComponents[4].options = [];
                        this.tableComponents[5].options = [];
                        this.formField.lineNo = "";
                        this.formField.pointCode = "";
                        this.queryLineNo();
                    },
                    isMul: false,
                    isRequire: true,
                    options: [],
                },
                {
                    compKey: "lineNo-e",
                    labelName: "生产线",
                    codeField: "lineNo",
                    oFields: "LINE_NO,LINE_NAME",
                    component: () => import("@/components/org/LookupValue"),
                    lookuptype: "_is_null_code_",
                    type: "dropdownList",
                    isMust: true,
                    changed: () => {
                        this.tableComponents[5].options = [];
                        this.formField.pointCode = "";
                        this.getPointCode();
                    },
                    isMul: false,
                    isRequire: true,
                    options: [],
                },

                {
                    compKey: "compKey_pointCode",
                    labelName: "工位",
                    codeField: "pointCode",
                    oFields: "POINT_CODE,POINT_NAME",
                    lookuptype: "_is_null_code_",
                    component: () => import("@/components/org/LookupValue"),
                    type: "dropdownList",
                    isMust: true,
                    isMul: false,
                    isRequire: true,
                    options: [],
                    // disabled: false,
                    // edit_disabled: true,
                    // add_disabled: false,
                },
                {
                    compKey: "compKey6",
                    labelName: "位置",
                    codeField: "position",
                    inputType: "textarea",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                },
                {
                    compKey: "compKey7",
                    labelName: "扩展参数",
                    codeField: "extParam",
                    inputType: "textarea",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                },
                {
                    compKey: "compKey8",
                    labelName: "备注",
                    codeField: "remark",
                    inputType: "textarea",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    disabled: false,
                },
            ],

            // 表单数据（无需赋值，由混入对象赋值）
            formField: {
                userId: "",
                userName: "",
                stationScreenCode: "",
                plantCode: this.$PLANT_CODE,
                processLocation: "",
                lineNo: "",
                pointCode: "",
                position: "",
                extParam: "",
                remark: "",
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
        this.onCheckSaveButton(1);
    },
    watch: {
        // curPopupsVisible: {
        // handler: function () {
        //     if (this.popupsState == "edit") {
        //         this.tableComponents[0].disabled = true;
        //     } else {
        //         this.tableComponents[0].disabled = false;
        //     }
        // },
        // },
        popupsVisible(newName, oldName) {
            console.log(newName);
            var that = this;
            if (newName) {
                this.querySysUser();
                this.queryPlant();
                that.queryLineNo();
                that.queryLocation();
                that.getPointCode();
            }
        },
    },
    methods: {
        querySysUser() {
            const params = {
                userName: "",
            };
            querySysUser(params)
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[0].options = res.rows;
                            // this.formField.lineNo = res.rows[0].LINE_NO;
                            // console.log(this.tableComponents);
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
        querySysUser2() {
            const params = {
                pagesize: 9999,
                pageindex: 1,
                sort: "asc",
                sortfield: "user_name",
                orgid: "89133e0d58514c8eb1aa459a2c526f80",
                // oldorgid: "09f925373a1340608c8d4fb014654e97",
                searchchild: "1",
                // menuId: "2d0c9ff8-c50b-11ec-944c-005056857d12",
                // menuName: "用户权限",
                orgTemplateId: "149f0ef062e34bb197e000432183aa34",
                // ClientServer: "http://172.24.162.143",
                // tenancyId: "39a67be9e7d845f0a9978daae247897c",
                // sign: "D24903A79F80F5AA780C44C9BDD5C3C4",
            };
            queryUsers(params)
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[0].options = res.rows;
                            // this.formField.lineNo = res.rows[0].LINE_NO;
                            // console.log(this.tableComponents);
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

        queryPlant() {
            queryPlant({
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[2].options = res.rows;
                            // this.formField.lineNo = res.rows[0].LINE_NO;
                            // console.log(this.tableComponents);
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
        queryLocation() {
            queryLocation({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[3].options = res.rows;
                            // const list = res.rows.map((item) => {
                            //     return {
                            //         lookupValueCode: item.PROCESS_LOCATION,
                            //         lookupValueName: item.PROCESS_LOCATION_NAME,
                            //     };
                            // });
                            // this.$nextTick(() => {
                            //     this.staticTableComponents[6].options = list;
                            // });

                            // this.formField.processLocation =
                            //     res.rows[0].PROCESS_LOCATION;
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
                plantCode: this.formField.plantCode,
                processLocation: this.formField.processLocation,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[4].options = res.rows;
                            // this.formField.lineNo = res.rows[0].LINE_NO;
                            // console.log(this.tableComponents);
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
        getPointCode() {
            var that = this;
            getPointCode({
                plantCode: this.formField.plantCode,
                processLocation: this.formField.processLocation,
                lineNo: this.formField.lineNo,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        console.log(res);
                        if (res.rows) {
                            // this.$set(
                            //     staticTableComponents[2],
                            //     "options",
                            //     res.rows
                            // );
                            res.rows.forEach(function (item) {
                                item.POINT_NAME =
                                    item.POINT_NAME +
                                    "(" +
                                    item.POINT_CODE +
                                    ")";
                            });
                            this.tableComponents[5].options = res.rows;
                            // this.$forceUpdate();
                            //     // console.log(this.tableComponents);
                            //     // this.tableComponents[2].isShow = false;
                            // });

                            // this.formField.pointCode = res.rows[0].PROCESS_NAME;
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
            saveUserPoint(this.formField)
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
            editUserPoint(this.formField)
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
