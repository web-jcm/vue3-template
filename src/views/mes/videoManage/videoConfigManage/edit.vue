<!--
* description: 视频截取配置-新增/修改弹窗
* author: xufan
* createdDate: 2022-07-25
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
    saveVideoConfig,
    editVideoConfig,
    queryPlant,
    queryLineNo,
    queryLocation,
    getPointCode,
} from "@/api/apiList/mes";
export default {
    // 组件混入对象
    mixins: [formMixins],
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), //弹窗标题
    },
    data() {
        const viewPageCode = "videoConfigEdit";
        return {
            saveFlag: 1, //为1时保存按钮可用，为0时保存按钮禁用
            // 保存API配置对象
            // apiConfig: orgApis.saveAndonType,
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

            // 静态组件-查询条件
            tableComponents: [
                {
                    compKey: "compKey_cameraCode",
                    labelName: "摄像头编号",
                    codeField: "cameraCode",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    disabled: this.popupsState === "edit",
                    isMust: true,
                },
                {
                    compKey: "compKey_cameraName",
                    labelName: "摄像头名称",
                    codeField: "cameraName",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                },
                {
                    compKey: "compKey_IP",
                    labelName: "摄像头IP",
                    codeField: "ip",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                },
                {
                    compKey: "compKey_port",
                    labelName: "摄像头端口",
                    codeField: "port",
                    isRequire: true,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                },
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
                        this.tableComponents[5].options = [];
                        this.tableComponents[6].options = [];
                        this.tableComponents[7].options = [];
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
                        this.tableComponents[6].options = [];
                        this.tableComponents[7].options = [];
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
                        this.tableComponents[7].options = [];
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
                    compKey: "cutStartLong-e",
                    labelName: "开始(N分钟后)",
                    codeField: "cutStartLong",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    isRequire: true,
                    maxWordCount: 16,
                    changed: () => {
                        var pattern = /^[1-9][0-9]*$/;
                        if (!pattern.test(this.formField.cutStartLong)) {
                            this.$nextTick(() => {
                                this.formField.cutStartLong = undefined;
                            });
                        }
                    },
                },
                {
                    compKey: "cutTimeLong-e",
                    labelName: "截取时长(分钟)",
                    codeField: "cutTimeLong",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                    isRequire: true,
                    maxWordCount: 16,
                    changed: () => {
                        var pattern = /^[1-9][0-9]*$/;
                        if (!pattern.test(this.formField.cutTimeLong)) {
                            this.$nextTick(() => {
                                this.formField.cutTimeLong = undefined;
                            });
                        }
                    },
                },

                {
                    compKey: "remark-e",
                    labelName: "备注",
                    codeField: "remark",
                    inputType: "textarea",
                    isRequire: false,
                    component: () => import("@/components/org/commonInput"),
                    type: "inputText",
                    isMust: true,
                }, //备注
            ],
            // 标题
            textMap: {
                edit: "修改", //修改弹框名字
                add: "新增", //新增弹框名字
            },
            // 表单数据（无需赋值，由混入对象赋值）
            formField: {
                cameraCode: "",
                cameraName: "",
                ip: "",
                port: "",
                pointCode: "",
                cutStartLong: "",
                cutTimeLong: "",
                lineNo: "",
                processLocation: "",
                remark: "",
                createdDate: "",
                creator: "",
                isEnable: "",
                lastUpdatedDate: "",
                modifier: "",
                orderNo: 1,
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
    // created() {
    //     this.getPassingPoint();
    // },
    mounted() {
        // console.log(this);
        // this.queryLineNo();
        // this.queryLocation();
        // this.queryProcessPoint();
    },
    watch: {
        popupsVisible(newName, oldName) {
            console.log(newName);
            var that = this;
            if (newName) {
                this.queryPlant();
                // that.queryLineNo()
                that.queryLocation();
                // that.getPassingPoint()
            }
        },
    },

    methods: {
        queryPlant() {
            queryPlant({
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
        queryLocation() {
            queryLocation({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[5].options = res.rows;
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
                            this.tableComponents[6].options = res.rows;
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
                            this.tableComponents[7].options = res.rows;
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
            saveVideoConfig(this.formField)
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
            editVideoConfig(this.formField)
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
