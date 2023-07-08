<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicResultField="resultField"
            :dynamicIsShowSelect="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :dynamic-export-converts="exportConverts"
        >
            <template v-slot:DEVICE_STATUS="scope">
                <div
                    style="color: green"
                    v-if="scope.row.DEVICE_STATUS === '在线'"
                >
                    {{ scope.row.DEVICE_STATUS }}
                </div>
                <div
                    style="color: blue"
                    v-else-if="scope.row.DEVICE_STATUS === '处理中'"
                >
                    {{ scope.row.DEVICE_STATUS }}
                </div>
                <div style="color: red" v-else>
                    {{ scope.row.DEVICE_STATUS }}
                </div>
            </template>
        </n-data-table>
        <edit
            :showType="showType"
            :clickRowsData="clickRowsData"
            :plantCode="formField.PLANT_CODE"
            v-if="editPopupsVisible"
            @close="closeDialog"
        />
    </div>
</template>
<script>
import {
    mesApis,
    queryLookupValues,
    getNotOutputData,
    delLinkEquipment,
    initWorkIndicateState,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "linkEquipmentManage",
    components: {
        Edit: () => import("./edit"),
    },
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path, "workIndicateBasicTypeEdit"],
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
            apiConfig: mesApis.queryLinkEquipment,
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
                            compKey: "btnKey_newAdd",
                            type: "",
                            size: "small",
                            clickEvent: () => this.add(),
                            text: this.$t("sys.button.newAdd"),
                            name: "add",
                            position: "left",
                          },
                        {
                            compKey: "btnKey_edit",
                              type: "",
                            size: "small",
                            clickEvent: () => this.edit(),
                            text: this.$t("sys.button.edit"),
                            name: "edit",
                            position: "left",
                        },
                        {
                              compKey: "btnKey_delete",
                            type: "",
                            size: "small",
                            clickEvent: () => this.delete(),
                              text: this.$t("sys.button.delete"),
                            name: "quanbushanchu",
                            position: "left",
                            disabled: false,
                        },
                        {
                            compKey: "btnKey_detail",
                              size: "small",
                            clickEvent: () => this.initWorkIndicateState(1),
                            text: "状态初始化",
                        },
                          {
                            compKey: "btnKey_detail",
                            size: "small",
                            clickEvent: () => this.initWorkIndicateState(0),
                            text: "全部状态初始化",
                        },
                    ],
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
                            compKey: "DEVICE_TYPE",
                            labelName: "设备类型",
                            codeField: "DEVICE_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                              lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
                        },
                        {
                            compKey: "KEY_WORD",
                            labelName: "说明关键词",
                            codeField: "KEY_WORD",
                            component: () =>
                                import("@/components/org/commonInput"),
                          },
                        {
                            compKey: "searchTime",
                            labelName: "更新时间(秒)",
                            codeField: "searchTime",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "number",
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
                            label: "连接设备ID",
                        },
                        {
                            prop: "DEVICE_NAME",
                              label: "设备名称",
                        },
                        {
                            prop: "DEVICE_STATUS",
                            label: "设备状态",
                            isSlot: true,
                        },
                          {
                            prop: "DEVICE_TYPE_NAME",
                            label: "设备类型名",
                        },
                        {
                            prop: "SUB_DEVICE_TYPE",
                            label: "设备子类型名",
                          },
                        {
                            prop: "IPADDRESS",
                              label: "IP地址",
                        },
                        {
                            prop: "DEVICE_PORT",
                              label: "端口",
                        },
                        {
                            prop: "PROCESS_LOCATION_NAME",
                            label: "车间",
                        },
                        {
                            prop: "DEVICE_CALL_NAME",
                            label: "设备名称说明",
                          },
                        {
                            prop: "DESCRIPTION",
                            label: "设备描述",
                          },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    DEVICE_TYPE: "",
                    KEY_WORD: "",
                    searchTime: 30,
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            resultField: {
                result: "",
            },
            showType: "add",
            timer: null,
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.result = val.CATEGORY_CODE;
        },
        "formField.searchTime": function () {
            clearInterval(this.timer);
            if (this.formField.searchTime > 0) {
                this.timer = setInterval(
                    () => this.queryTable(1),
                    this.formField.searchTime * 1000
                );
            }
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
        },
    },
    created() {
        if (this.formField.searchTime > 0) {
            this.timer = setInterval(
                () => this.search(),
                this.formField.searchTime * 1000
            );
        }
    },
    methods: {
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "DEVICE_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
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
        add() {
            this.showType = "add";
            this.editPopupsVisible = true;
            clearInterval(this.timer);
        },
        edit() {
            if (this.clickRowsData.DEVICE_ID !== undefined) {
                this.showType = "edit";
                this.editPopupsVisible = true;
                clearInterval(this.timer);
            } else {
                this.$utils.message({
                    message: "请选择需要修改的数据！",
                });
            }
        },
        delete() {
            if (this.clickRowsData.DEVICE_ID !== undefined) {
                this.$confirm("是否删除所选设备?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.getNotOutputData();
                    })
                    .catch(() => {});
            } else {
                this.$utils.message({
                    message: "请选择需要删除的设备！",
                });
            }
        },
        initWorkIndicateState(type) {
            this.$confirm("是否初始化设备?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "初始化中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    initWorkIndicateState({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        DEVICE_ID: type ? this.clickRowsData.DEVICE_ID : "",
                        TYPE: type ? "" : "1",
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") {
                                if (type) {
                                    this.$refs.multipleTable.list.forEach(
                                        (item) => {
                                            if (
                                                item.DEVICE_ID ===
                                                this.clickRowsData.DEVICE_ID
                                            ) {
                                                item.DEVICE_STATUS = "初始化";
                                            }
                                        }
                                    );
                                } else {
                                    this.search();
                                }
                            }
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        getNotOutputData() {
            this.loading = this.$loading({
                lock: true,
                text: "删除中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            getNotOutputData({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.clickRowsData.DEVICE_ID,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.$confirm(
                                "当前设备尚未打印完，是否删除?",
                                "提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    this.delLinkEquipment();
                                })
                                .catch(() => {});
                        } else {
                            this.delLinkEquipment();
                        }
                    } else {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        delLinkEquipment() {
            delLinkEquipment({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID: this.clickRowsData.DEVICE_ID,
                DEVICE_TYPE: this.clickRowsData.DEVICE_TYPE,
                SUB_DEVICE_TYPE: this.clickRowsData.SUB_DEVICE_TYPE,
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
        },
        closeDialog() {
            this.editPopupsVisible = false;
            this.search();
            if (this.formField.searchTime > 0) {
                this.timer = setInterval(
                    () => this.search(),
                    this.formField.searchTime * 1000
                );
            }
        },
    },
    deactivated() {
        clearInterval(this.timer);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesProductIndicateType/vehiclesProductIndicateType.scss";
</style>
