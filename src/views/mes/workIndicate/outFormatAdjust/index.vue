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
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="false"
        >
            <template v-slot:FORMAT_ID="scope">
                <el-select
                    v-model="scope.row.FORMAT_ID"
                    clearable
                    @change="changeKey(scope.row, 'FORMAT_NAME', 'FORMAT_ID')"
                >
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.FORMAT_ID"
                        :label="item.FORMAT_ID"
                        :value="item.FORMAT_ID"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:CHANGE_FORMAT_ID1="scope">
                <el-select
                    v-model="scope.row.CHANGE_FORMAT_ID1"
                    :disabled="!equipmentInfo.FILTER_CATEGORY_NO"
                    clearable
                    @change="
                        changeKey(
                            scope.row,
                            'CHANGE_FORMAT_NAME1',
                            'CHANGE_FORMAT_ID1'
                        )
                    "
                >
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.FORMAT_ID"
                        :label="item.FORMAT_ID"
                        :value="item.FORMAT_ID"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:CHANGE_FORMAT_ID2="scope">
                <el-select
                    v-model="scope.row.CHANGE_FORMAT_ID2"
                    :disabled="!equipmentInfo.FILTER_CATEGORY_NO2"
                    clearable
                    @change="
                        changeKey(
                            scope.row,
                            'CHANGE_FORMAT_NAME2',
                            'CHANGE_FORMAT_ID2'
                        )
                    "
                >
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.FORMAT_ID"
                        :label="item.FORMAT_ID"
                        :value="item.FORMAT_ID"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:CHANGE_FORMAT_ID3="scope">
                <el-select
                    v-model="scope.row.CHANGE_FORMAT_ID3"
                    :disabled="!equipmentInfo.FILTER_CATEGORY_NO3"
                    clearable
                    @change="
                        changeKey(
                            scope.row,
                            'CHANGE_FORMAT_NAME3',
                            'CHANGE_FORMAT_ID3'
                        )
                    "
                >
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.FORMAT_ID"
                        :label="item.FORMAT_ID"
                        :value="item.FORMAT_ID"
                    >
                    </el-option>
                </el-select>
            </template>
        </n-data-table>
        <copyData
            v-if="showDialog"
            @close="showDialog = false"
            @choose="chooseData"
        />
        <selectFormat
            v-if="showDialog2"
            :plantCode="formField.PLANT_CODE"
            @close="showDialog2 = false"
        />
    </div>
</template>
<script>
import {
    mesApis,
    queryDeviceList,
    queryEquipmentDetail,
    queryOutFormatDropdown,
    getEquipmentInfo,
    saveOutFormat,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "outFormatAdjust",
    components: {
        selectFormat: () => import("./selectFormat"),
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
            // 网格查询API配置对象
            apiConfig: mesApis.queryOutFormatList,
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
                            type: "",
                            size: "small",
                            clickEvent: () => (this.showDialog = true),
                              text: "复制源选择",
                        },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => (this.showDialog2 = true),
                              text: "格式设定输出",
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
                            prop: "CATEGORY_CODE",
                            label: "作业基准类别No",
                        },
                        {
                            prop: "CATEGORY_NAME",
                            label: "作业基准类别名",
                          },
                        {
                            prop: "FORMAT_ID",
                            label: "既定输出格式ID",
                              isSlot: true,
                        },
                        {
                            prop: "FORMAT_NAME",
                              label: "既定输出格式名",
                        },
                        {
                            prop: "CHANGE_FORMAT_ID1",
                              label: "变更输出格式ID1",
                            isSlot: true,
                        },
                        {
                            prop: "CHANGE_FORMAT_NAME1",
                            label: "变更输出格式名1",
                        },
                        {
                            prop: "CHANGE_FORMAT_ID2",
                            label: "变更输出格式ID2",
                            isSlot: true,
                          },
                        {
                            prop: "CHANGE_FORMAT_NAME2",
                            label: "变更输出格式名2",
                        },
                        {
                            prop: "CHANGE_FORMAT_ID3",
                            label: "变更输出格式ID3",
                              isSlot: true,
                        },
                        {
                            prop: "CHANGE_FORMAT_NAME3",
                              label: "变更输出格式名3",
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
                DEVICE_ID: "",
            },
            copyData: null, // 复制源数据
            clickRowsData: {}, //点击行对象
            equipmentInfo: {},
            showDialog: false,
            showDialog2: false,
            selectOptions: [],
        };
    },
    watch: {
        "formField.DEVICE_ID": function (val) {
            this.resultField.DEVICE_ID = val;
            this.$nextTick(() => this.search());
            this.queryEquipmentDetail();
            this.getEquipmentInfo();
        },
        "formField.PLANT_CODE": async function () {
            await this.queryEquipmentList();
            const params = sessionStorage.getItem("outFormatAdjust");
            if (params) {
                this.formField.DEVICE_ID = JSON.parse(params).value;
                sessionStorage.removeItem("outFormatAdjust");
                this.$nextTick(() => this.search());
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.DEVICE_ID = this.$route.params.value;
            //     this.$nextTick(() => this.search());
            // }
        },
    },
    activated() {
        let params = sessionStorage.getItem("outFormatAdjust");
        if (params) {
            this.formField.DEVICE_ID = JSON.parse(params).value;
            this.search();
            sessionStorage.removeItem("outFormatAdjust");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.DEVICE_ID = this.$route.params.value;
        //     this.search();
        // }
    },
    methods: {
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
        getEquipmentInfo() {
            getEquipmentInfo({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.formField.DEVICE_ID,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.equipmentInfo = res.rows;
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
        queryEquipmentDetail() {
            queryEquipmentDetail({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.formField.DEVICE_ID,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.queryOutFormatDropdown(
                            res.rows[0].SUB_DEVICE_TYPE
                        );
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
        queryOutFormatDropdown(type) {
            queryOutFormatDropdown({
                PLANT_CODE: this.formField.PLANT_CODE,
                SUB_DEVICE_TYPE: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectOptions = res.rows;
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
        search() {
            this.queryTable(1);
        },
        save() {
            this.$confirm("是否保存修改?", "提示", {
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
                    saveOutFormat({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        DEVICE_ID: this.formField.DEVICE_ID,
                        rows: this.$refs.multipleTable.list,
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
        changeKey(row, name, value) {
            row[name] = row[value];
        },
        chooseData(data) {
            data.forEach((item) => {
                item.DEVICE_ID = this.formField.DEVICE_ID;
            });
            this.$refs.multipleTable.list = data;
            this.showDialog = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesBaseInfoManagement/vehiclesBaseInfoManagement.scss";
</style>
