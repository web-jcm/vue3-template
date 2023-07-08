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
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="true"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :dynamic-export-converts="exportConverts"
        />
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org.js";
import { queryLocation } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "abnormalVehicleQuery",
    components: {},
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path, "abnormalVehicleQuery"],
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
            // apiConfig: sccApis.lmdDbWarehouseQuery,
            apiConfig: orgApis.querycarexception,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length >
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableButtons
                    : [
                        {
                            compKey: "btnKey_query",
                            type: "primary",
                            size: "small",
                            clickEvent: () => this.queryTable(1),
                            text: this.$t("sys.button.query"),
                            name: "search",
                            position: "right",
                          },
                        {
                            compKey: "btnKey_reset",
                            type: "",
                            size: "small",
                            clickEvent: () => this.reset(),
                            text: this.$t("sys.button.reset"),
                            name: "reset",
                            position: "right",
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
                            compKey: "ctrlKey",
                            labelName: "车辆管理号",
                            codeField: "ctrlKey",
                            component: () => import("@/components/org/commonInput"),
                            type: "inputText",
                            hidden: false,
                            dataToObject: {
                                maxWordCount: 7,
                              },
                        },
                        {
                            compKey: "processLocation",
                              labelName: "车间",
                            codeField: "processLocation",
                            oFields: "PROCESS_LOCATION,PROCESS_LOCATION_NAME",
                              lookuptype: "PROCESS_LOCATION",
                            component: () => import("@/components/org/LookupValue"),
                            options: [],
                            hidden: false,
                            dataToObject: {
                                maxWordCount: 7,
                              },
                        },
                        {
                            compKey: "productType",
                            labelDesc: "生产类型",
                            labelName: "生产类型",
                            codeField: "productType",
                            oFields: "value,name",
                            lookuptype: "value",
                            component: () => import("@/components/org/LookupValue"),
                            isMust: false,
                            clearable: false,
                            isRequire: false,
                            options: [
                                { name: "车身", value: "1" },
                                { name: "车架", value: "2" },
                              ],
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
                            prop: "ctrlKey",
                            label: "车辆管理号",
                            width: null,
                              align: "center",
                            hidden: false,
                          },
                        {
                            prop: "processLocationName",
                            label: "车间",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "productTypeName",
                            label: "生产类型",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "exceptionTypeName",
                            label: "异常类型",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "exceptionChildTypeName",
                            label: "异常子类",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        //   {
                        //     prop: 'exceptionCode',
                        //     label: '异常原因编码',
                        //     width: null,
                        //     align: 'center',
                        //     hidden: false,
                        //   },
                        {
                            prop: "exceptionCause",
                            label: "异常原因",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "exceptionDay",
                            label: "异常天数",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "exceptionHour",
                            label: "异常小时",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "exceptionMi",
                            label: "异常分钟",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "restoreStatusName",
                            label: "恢复状态",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                              prop: "restoreDt",
                            label: "恢复时间",
                            width: 150,
                            align: "center",
                            hidden: false,
                        },
                        {
                              prop: "remark",
                            labelDesc: "备注",
                            label: "备注",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                    ],
            // 字段格式化转换（用于导出excel）（kvs表示键值转换）
            exportConverts: {},
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    ctrlKey: "",
                    exceptionType: "",
                    productType: "",
                    processLocation: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            // 是否使用刷新Key的方式刷新弹窗
            resetDialogKey: false,
            printPopupsVisible: false,
        };
    },
    mounted() {
        this.queryLocation();
    },
    methods: {
        queryLocation() {
            queryLocation({
                plantCode: this.$PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            console.log(res);
                            this.tableComponents[1].options = res.rows;
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
    },
};
</script>
