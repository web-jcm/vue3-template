<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="false"
        >
        </n-data-table>
        <copyData v-if="showDialog" @close="dialogClose" @choose="chooseData" />
    </div>
</template>
<script>
import {
    queryEquipmentOutFactorAdjust,
    saveEquipmentOutFactorAdjust,
    queryDeviceList,
    queryLookupValues,
    queryProduceType,
    getOrderSerialNumber,
    queryWorkShopList,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "equipmentOutFactorAdjust",
    components: {
        copyData: () => import("./copyData"),
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
                            clickEvent: () => this.save(),
                            text: this.$t("sys.button.save"),
                            name: "preservation",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_save",
                            size: "small",
                            clickEvent: () => (this.showDialog = true),
                            text: "复制源选择",
                          },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length >
                    (0).length >
                    0
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
                            prop: "IS_SELECT",
                            label: "作业指示事件指定",
                            isComponent: true,
                              comps: [
                                {
                                    compKey: "compKey_IS_SELECT",
                                    codeField: "IS_SELECT",
                                    component: () =>
                                        import("@/components/org/checkBox"),
                                },
                            ],
                            noShowTooltip: true,
                              width: 120,
                        },
                        {
                            prop: "POINT_CODE",
                            label: "事件ID",
                            width: 120,
                        },
                        {
                            prop: "POINT_NAME",
                            label: "事件名",
                        },
                    ],
            infoComponents: [
                {
                    compKey: "DEVICE_ID",
                    labelName: "接续设备ID",
                    codeField: "DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                },
                {
                    compKey: "DEVICE_NAME",
                    labelName: "接续设备名",
                    codeField: "DEVICE_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                },
                {
                    compKey: "UPPER_DEVICE_ID",
                    labelName: "上层接续设备ID",
                    codeField: "UPPER_DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                    dataToObject: {
                        maxWordCount: 8,
                    },
                },
                {
                    compKey: "UPDATE_DEVICE_NAME",
                    labelName: "上层接续设备名",
                    codeField: "UPDATE_DEVICE_NAME",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    labelWidth: 120,
                    dataToObject: {
                        maxWordCount: 7,
                    },
                },
                {
                    compKey: "DESCRIPTION",
                    labelName: "接续设备说明",
                    codeField: "DESCRIPTION",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    labelWidth: 120,
                },
                {
                    compKey: "DEVICE_TYPE",
                    labelName: "接续设备类型",
                    codeField: "DEVICE_TYPE",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    disabled: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "FILTER_CATEGORY_NO",
                    labelName: "格式变更类别1",
                    codeField: "FILTER_CATEGORY_NO",
                    oFields: "CATEGORY_CODE,CATEGORY_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 7,
                },
                {
                    compKey: "FILTER_CATEGORY_NO2",
                    labelName: "格式变更类别2",
                    codeField: "FILTER_CATEGORY_NO2",
                    oFields: "CATEGORY_CODE,CATEGORY_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 7,
                },
                {
                    compKey: "FILTER_CATEGORY_NO3",
                    labelName: "格式变更类别3",
                    codeField: "FILTER_CATEGORY_NO3",
                    oFields: "CATEGORY_CODE,CATEGORY_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 7,
                },
                {
                    compKey: "REISSUE_FLAG",
                    labelName: "再输出设定",
                    codeField: "REISSUE_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "RECOVER_FLAG",
                    labelName: "自动恢复设定",
                    codeField: "RECOVER_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "DISABLE_FLAG",
                    labelName: "接续设备无效设定",
                    codeField: "DISABLE_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    disabled: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 8,
                },
                {
                    compKey: "TEST_DEVICE_FLAG",
                    labelName: "测试连接设备",
                    codeField: "TEST_DEVICE_FLAG",
                    oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "WI_SERIAL_SECTION_ID",
                    labelName: "顺序编号表示工程",
                    codeField: "WI_SERIAL_SECTION_ID",
                    oFields: "SECTION_CODE,SECTION_NAME",
                    lookuptype: "_is_null_code_",
                    clearable: false,
                    isComponent: true,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                    maxWordCount: 8,
                },
                {
                    compKey: "GROUP_ID",
                    labelName: "管理区分",
                    codeField: "GROUP_ID",
                    oFields: "PROCESS_LOCATION,PROCESS_LOCATION_NAME",
                    lookuptype: "_is_null_code_",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/LookupValue"),
                    options: [],
                    labelWidth: 120,
                },
                {
                    compKey: "COPIES",
                    labelName: "输出数",
                    codeField: "COPIES",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    labelWidth: 120,
                },
                {
                    compKey: "OFFSET_NUMBER",
                    labelName: "偏移数",
                    codeField: "OFFSET_NUMBER",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    labelWidth: 120,
                },
                {
                    compKey: "REQ_WARNING_VOL",
                    labelName: "警告通知停留数据数",
                    codeField: "REQ_WARNING_VOL",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    isComponent: true,
                    labelWidth: 120,
                    dataToObject: {
                        maxWordCount: 9,
                    },
                },
            ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    DEVICE_ID: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                COPIES: "",
                DESCRIPTION: "",
                DEVICE_ID: "",
                DEVICE_NAME: "",
                DEVICE_TYPE: "",
                DISABLE_FLAG: "",
                FILTER_CATEGORY_NO: "",
                FILTER_CATEGORY_NO2: "",
                FILTER_CATEGORY_NO3: "",
                GROUP_ID: "",
                OFFSET_NUMBER: "",
                POINT_CODES: "",
                RECOVER_FLAG: "",
                REISSUE_FLAG: "",
                REQ_WARNING_VOL: "",
                TEST_DEVICE_FLAG: "",
                WI_SERIAL_SECTION_ID: "",
                UPPER_DEVICE_ID: "",
                UPDATE_DEVICE_NAME: "",
            },
            showDialog: false,
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.DEVICE_ID": function () {
            this.search();
        },
        "formField.PLANT_CODE": async function () {
            await this.queryEquipmentList();
            await this.queryLookupValues("REISSUE_FLAG");
            await this.queryLookupValues("RECOVER_FLAG");
            await this.queryLookupValues("TEST_DEVICE_FLAG");
            await this.queryLookupValues("DISABLE_FLAG");
            await this.queryLookupValues("DEVICE_TYPE");
            await this.queryProduceType();
            await this.getOrderSerialNumber();
            await this.queryWorkShopList();
            const params = sessionStorage.getItem("equipmentOutFactorAdjust");
            if (params) {
                this.formField.DEVICE_ID = JSON.parse(params).value;
                sessionStorage.removeItem("equipmentOutFactorAdjust");
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.DEVICE_ID = this.$route.params.value;
            // }
            this.$nextTick(() => this.search());
        },
    },
    activated() {
        let params = sessionStorage.getItem("equipmentOutFactorAdjust");
        if (params) {
            this.formField.DEVICE_ID = JSON.parse(params).value;
            this.search();
            sessionStorage.removeItem("equipmentOutFactorAdjust");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.DEVICE_ID = this.$route.params.value;
        //     this.search();
        // }
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        queryTable(size) {
            this.$refs.multipleTable.listLoading = true;
            queryEquipmentOutFactorAdjust(this.formField)
                .then((res) => {
                    this.$refs.multipleTable.list = [];
                    if (res.result === "1" && res.rows) {
                        for (let key in res.rows) {
                            this.resultField[key] = res.rows[key];
                        }
                        this.$refs.multipleTable.list =
                            this.resultField.POINT_CODES;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.$refs.multipleTable.listLoading = false;
                })
                .catch((err) => {
                    this.$refs.multipleTable.list = [];
                    this.$refs.multipleTable.listLoading = false;
                    console.log(err);
                });
        },
        queryEquipmentList() {
            return queryDeviceList({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_TYPE: "2",
            })
                .then((res) => {
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
                    console.log(err);
                });
        },
        queryWorkShopList() {
            return queryWorkShopList({
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.infoComponents[14].options = res.rows;
                        this.formField.POINT_CODES = res.rows[0].SECTION_CODE;
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
        getOrderSerialNumber() {
            return getOrderSerialNumber({
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.infoComponents[13].options = res.rows;
                        this.formField.WI_SERIAL_SECTION_ID =
                            res.rows[0].SECTION_CODE;
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
        queryProduceType() {
            return queryProduceType({
                PLANT_CODE: this.formField.PLANT_CODE,
                CATEGORY_TYPE: "W2",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        res.rows.unshift({
                            CATEGORY_NAME: "没有指定",
                            CATEGORY_CODE: "",
                        });
                        this.infoComponents[6].options = res.rows;
                        this.infoComponents[7].options = res.rows;
                        this.infoComponents[8].options = res.rows;
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
        queryLookupValues(type) {
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "DEVICE_TYPE") {
                            this.infoComponents[5].options = res.rows;
                        }
                        if (type === "REISSUE_FLAG") {
                            this.infoComponents[9].options = res.rows;
                        }
                        if (type === "RECOVER_FLAG") {
                            this.infoComponents[10].options = res.rows;
                        }
                        if (type === "DISABLE_FLAG") {
                            this.infoComponents[11].options = res.rows;
                        }
                        if (type === "TEST_DEVICE_FLAG") {
                            this.infoComponents[12].options = res.rows;
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
        save() {
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = JSON.parse(JSON.stringify(this.resultField));
                pram.PLANT_CODE = this.formField.PLANT_CODE;
                pram.POINT_CODES = [];
                this.resultField.POINT_CODES.forEach((item) => {
                    if (item.IS_SELECT === "1") {
                        pram.POINT_CODES.push(item.POINT_CODE);
                    }
                });
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveEquipmentOutFactorAdjust(pram)
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "1") {
                            this.search();
                        }
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
        chooseData(data) {
            for (let key in data) {
                if (key !== "DEVICE_ID" && key !== "DEVICE_NAME") {
                    this.resultField[key] = data[key];
                }
            }
            this.$refs.multipleTable.list = this.resultField.POINT_CODES;
            this.showDialog = false;
        },
        dialogClose() {
            this.showDialog = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/rfidAlternative/rfidAlternative.scss";
</style>
