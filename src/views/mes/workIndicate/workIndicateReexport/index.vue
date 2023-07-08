<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicRowStyle="setRowstyle"
            :stripe="false"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
        </n-data-table>
        <selectEquipment v-if="showDialog" @close="dialogClose" />
    </div>
</template>
<script>
import { mesApis } from "@/api/apiList/mes";
import {
    queryDeviceList,
    getIncidentDropdownBox,
    getFromatDropdownBox,
    getEquipmentInfo,
    saveWorkIndicateReexport,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "workIndicateReexport",
    components: {
        selectEquipment: () => import("./selectEquipment"),
    },
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path],
            function () {
                next();
            }
        );
    },
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            // 网格查询API配置对象
            apiConfig: mesApis.queryWorkIndicateReexport,
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
                            compKey: "btnKey_query",
                            type: "primary",
                            size: "small",
                            clickEvent: () => this.search(),
                            text: this.$t("sys.button.query"),
                            name: "search",
                            position: "right",
                          },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => this.reexport("1"),
                            text: "再输出",
                            name: "preservation",
                            position: "center",
                          },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => this.reedit("2"),
                            text: "再编辑输出",
                            name: "preservation",
                            position: "center",
                          },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => (this.showDialog = true),
                              text: "复数接续设备指定",
                        },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableComponents
                    : [
                        {
                            compKey: "PLANT_CODE",
                            labelName: "工厂名称",
                            codeField: "PLANT_CODE",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
                          },
                        {
                            compKey: "DEVICE_ID",
                            labelName: "接续设备",
                            codeField: "DEVICE_ID",
                            oFields: "DEVICE_ID,DEVICE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            clearable: false,
                            isRequire: true,
                            isConcat: true,
                            options: [],
                        },
                        {
                            compKey: "POINT_CODE",
                            labelName: "事件",
                            codeField: "POINT_CODE",
                            oFields: "POINT_CODE,POINT_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
                        },
                        {
                            compKey: "FORMAT_ID",
                            labelName: "格式",
                            codeField: "FORMAT_ID",
                            oFields: "FORMAT_ID,FORMAT_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            options: [],
                        },
                        {
                            compKey: "OUTPUT_TYPE",
                              labelName: "状态",
                            codeField: "OUTPUT_TYPE",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [
                                {
                                    lookupValueCode: "",
                                    lookupValueName: "全部",
                                },
                                {
                                    lookupValueCode: "1",
                                    lookupValueName: "未输出",
                                },
                                {
                                    lookupValueCode: "2",
                                    lookupValueName: "取消输出",
                                },
                                {
                                    lookupValueCode: "3",
                                    lookupValueName: "正常输出",
                                },
                            ],
                        },
                        //   {
                        //       compKey: "isUseKey",
                        //       labelName: "车辆识别键指定",
                        //       codeField: "isUseKey",
                        //       component: () =>
                        //           import("@/components/org/checkBox"),
                        //       dataToObject: {
                          //           maxWordCount: 7,
                          //       },
                        //   },
                        //   {
                        //       compKey: "CTRL_KEY",
                        //       labelName: "",
                        //       codeField: "CTRL_KEY",
                        //       component: () =>
                        //           import("@/components/org/commonInput"),
                        //   },
                        {
                            compKey: "SIZE",
                            labelName: "取得数据件数",
                            codeField: "SIZE",
                            component: () =>
                                import("@/components/org/commonInput"),
                        },
                        {
                            compKey: "TYPE",
                            labelName: "再输出日志表示",
                            codeField: "TYPE",
                            component: () =>
                                import("@/components/org/checkBox"),
                            dataToObject: {
                                  maxWordCount: 7,
                            },
                        },
                        {
                            compKey: "DESCRIPTION",
                            labelName: "设备备注",
                            codeField: "DESCRIPTION",
                            component: () =>
                                import("@/components/org/commonInput"),
                            disabled: true,
                          },
                    ],
            infoComponents: [
                {
                    labelName: "未输出",
                    style: {
                        width: "10%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #73fbfb",
                        whiteSpace: "nowrap",
                    },
                },
                {
                    labelName: "",
                    style: {
                        width: "24px",
                        height: "24px",
                        background: "#fff",
                        border: "1px solid",
                    },
                },
                {
                    labelName: "正常输出",
                    style: {
                        width: "10%",
                        padding: "2px 10px",
                        whiteSpace: "nowrap",
                    },
                },
                {
                    labelName: "取消输出",
                    style: {
                        width: "10%",
                        padding: "2px 10px",
                        borderLeft: "25px solid #e93ff5",
                        whiteSpace: "nowrap",
                    },
                },
            ],
            // 动态生成网格列
            tableCols:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableCols
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableCols
                    : [
                        {
                            prop: "DEVICE_ID",
                            label: "接续设备ID",
                            width: 60,
                        },
                        {
                            prop: "DEVICE_NAME",
                            label: "接续设备名",
                          },
                        {
                            prop: "FORMAT_ID",
                            label: "格式ID",
                            width: 60,
                        },
                        {
                            prop: "FORMAT_NAME",
                            label: "格式名",
                            width: 60,
                        },
                        {
                            prop: "POINT_CODE",
                            label: "事件ID",
                            //   width: 60,
                        },
                        {
                              prop: "TRIM_SERIAL_NO",
                            label: "车辆连续号",
                            width: 60,
                        },
                        {
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                        {
                            prop: "REQ_NAME",
                            label: "输出类型名",
                        },
                        {
                            prop: "DISTRIBUTE_TIME",
                            label: "作业指示要求时间",
                        },
                        {
                            prop: "EDIT_TIME",
                            label: "作业指示编辑时间",
                          },
                        {
                            prop: "OUTPUT_TIME",
                            label: "作业指示输出时间",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    DEVICE_ID: "",
                    FORMAT_ID: "",
                    POINT_CODE: "",
                    DESCRIPTION: "",
                    OUTPUT_TYPE: "",
                    SIZE: "500",
                    TYPE: "0",
                    // isUseKey: "0",
                    CTRL_KEY: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            showDialog: false,
            REISSUE_FLAG: "0",
        };
    },
    watch: {
        "formField.DEVICE_ID": function () {
            this.getIncidentDropdownBox();
            this.getFromatDropdownBox();
            this.getEquipmentInfo();
        },
        // "formField.isUseKey": function () {
        //     this.$refs.multipleTable.list = [];
        //     this.clickRowsData = {};
        //     this.formField.CTRL_KEY = "";
        // },
        "formField.PLANT_CODE": async function () {
            await this.queryEquipmentList();
            const params = sessionStorage.getItem("workIndicateReexport");
            if (params) {
                this.formField.DEVICE_ID = JSON.parse(params).value;
                sessionStorage.removeItem("workIndicateReexport");
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.DEVICE_ID = this.$route.params.value;
            // }
        },
    },
    activated() {
        let params = sessionStorage.getItem("workIndicateReexport");
        if (params) {
            this.formField.DEVICE_ID = JSON.parse(params).value;
            sessionStorage.removeItem("workIndicateReexport");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.DEVICE_ID = this.$route.params.value;
        // }
    },
    methods: {
        queryEquipmentList() {
            return queryDeviceList({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_TYPE: "2",
            })
                .then((res) => {
                    this.tableComponents[1].options = [];
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.DEVICE_ID = res.rows[0].DEVICE_ID;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.tableComponents[1].options = [];
                    console.log(err);
                });
        },
        getIncidentDropdownBox() {
            getIncidentDropdownBox({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.formField.DEVICE_ID,
            })
                .then((res) => {
                    this.tableComponents[2].options = [];
                    this.formField.POINT_CODE = "";
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[2].options = res.rows;
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.formField.POINT_CODE = "";
                    this.tableComponents[2].options = [];
                    console.log(err);
                });
        },
        getFromatDropdownBox() {
            getFromatDropdownBox({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.formField.DEVICE_ID,
            })
                .then((res) => {
                    this.tableComponents[3].options = [];
                    this.formField.FORMAT_ID = "";
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[3].options = res.rows;
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.tableComponents[3].options = [];
                    this.formField.FORMAT_ID = "";
                    console.log(err);
                });
        },
        getEquipmentInfo() {
            getEquipmentInfo({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.formField.DEVICE_ID,
            })
                .then((res) => {
                    this.formField.DESCRIPTION = "";
                    this.REISSUE_FLAG = "0";
                    if (res.result === "1" && res.rows) {
                        this.REISSUE_FLAG = res.rows.REISSUE_FLAG;
                        this.formField.DESCRIPTION = res.rows.DESCRIPTION;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.REISSUE_FLAG = "0";
                    this.formField.DESCRIPTION = "";
                    console.log(err);
                });
        },
        search() {
            // if (this.formField.isUseKey === "0") {
            this.queryTable(1);
            // }
        },
        reexport(REQ_TYPE) {
            // if (this.formField.isUseKey === "0") {
            if (this.REISSUE_FLAG === "0") {
                return this.$utils.message({
                    message: "当前设备不允许再输出！",
                });
            }
            if (!this.clickRowsData.CTRL_KEY) {
                return this.$utils.message({
                    message: "请选择数据再输出！",
                });
            }
            if (this.clickRowsData.REQ_TYPE === "4") {
                return this.$utils.message({
                    message: `请选择非${this.clickRowsData.REQ_NAME}数据！`,
                });
            }
            if (this.clickRowsData.TYPE == 1 || this.clickRowsData.TYPE == 2) {
                return this.$utils.message({
                    message: "当前选择数据不允许再输出！",
                });
            }
            this.saveWorkIndicateReexport(REQ_TYPE);
            // }
        },
        reedit(REQ_TYPE) {
            // if (this.formField.isUseKey === "0") {
            if (this.REISSUE_FLAG === "0") {
                return this.$utils.message({
                    message: "当前设备不允许再编辑输出！",
                });
            }
            if (!this.clickRowsData.CTRL_KEY) {
                return this.$utils.message({
                    message: "请选择数据再编辑输出！",
                });
            }
            if (this.clickRowsData.REQ_TYPE === "4") {
                return this.$utils.message({
                    message: `请选择非${this.clickRowsData.REQ_NAME}数据！`,
                });
            }
            if (this.clickRowsData.TYPE == 1) {
                return this.$utils.message({
                    message: "当前选择数据不允许再编辑输出！",
                });
            }
            this.saveWorkIndicateReexport(REQ_TYPE);
            // } else {
            //     if (!this.formField.CTRL_KEY) {
            //         return this.$utils.message({
            //             message: "请输入车辆识别键！",
            //         });
            //     }
            //     if (!this.formField.POINT_CODE) {
            //         return this.$utils.message({
            //             message: "请选择事件！",
            //         });
            //     }
            //     if (!this.formField.FORMAT_ID) {
            //         return this.$utils.message({
            //             message: "请选择格式！",
            //         });
            //     }
            //     this.saveWorkIndicateReexport(REQ_TYPE);
            // }
        },
        saveWorkIndicateReexport(REQ_TYPE) {
            this.$confirm(
                `是否确定${REQ_TYPE === "1" ? "再输出" : "再编辑输出"}?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveWorkIndicateReexport({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        ROWS: [
                            {
                                TABLE_ID: this.clickRowsData.TABLE_ID,
                                // this.formField.isUseKey === "0"
                                //     ? this.clickRowsData.TABLE_ID
                                //     : "",
                                CTRL_KEY: this.clickRowsData.CTRL_KEY,
                                // this.formField.isUseKey === "0"
                                //     ? this.clickRowsData.CTRL_KEY
                                //     : this.formField.CTRL_KEY,
                                DEVICE_ID: this.clickRowsData.DEVICE_ID,
                                // this.formField.isUseKey === "0"
                                //     ? this.clickRowsData.DEVICE_ID
                                //     : this.formField.DEVICE_ID,
                                FORMAT_ID: this.clickRowsData.FORMAT_ID,
                                // this.formField.isUseKey === "0"
                                //     ? this.clickRowsData.FORMAT_ID
                                //     : this.formField.FORMAT_ID,
                                OUTOUT_TYPE: "1",
                                // this.formField.isUseKey === "0" ? "1" : "2",
                                POINT_CODE: this.clickRowsData.POINT_CODE,
                                // this.formField.isUseKey === "0"
                                //     ? this.clickRowsData.POINT_CODE
                                //     : this.formField.POINT_CODE,
                                REQ_TYPE: REQ_TYPE,
                            },
                        ],
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") this.search();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        dialogClose() {
            this.showDialog = false;
            this.search();
        },
        setRowstyle(e) {
            if (Number(e.row.TYPE) === 1) {
                return {
                    background: "#73fbfb!important",
                };
            }
            if (Number(e.row.TYPE) === 2) {
                return {
                    background: "#e93ff5",
                };
            }
            if (Number(e.row.TYPE) === 3) {
                return {
                    background: "#fff",
                };
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesBaseInfoManagement/vehiclesBaseInfoManagement.scss";
</style>
