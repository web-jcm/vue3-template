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

import {
    queryLocation,
    queryLineNo,
    getPointCode,
    queryAndonType,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "andonInfoQuery",
    components: {},
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path, "andonInfoQuery"],
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
            apiConfig: orgApis.queryandoninfo,
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
                            clickEvent: () => this.queryData(),
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
                            compKey: "processLocation",
                            labelName: "车间",
                              codeField: "processLocation",
                            oFields: "PROCESS_LOCATION,PROCESS_LOCATION_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            lookuptype: "_is_null_code_",
                            type: "dropdownList",
                              isMust: true,
                            changed: () => {
                                this.tableComponents[1].options = [];
                                this.tableComponents[2].options = [];
                                this.formField.lineNo = "";
                                this.formField.pointCode = "";
                                this.queryLineNo();
                            },
                            isMul: false,
                            isRequire: false,
                            options: [],
                        },
                        {
                            compKey: "lineNo-e",
                            labelName: "生产线",
                            codeField: "lineNo",
                            oFields: "LINE_NO,LINE_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              lookuptype: "_is_null_code_",
                            type: "dropdownList",
                            isMust: true,
                            changed: () => {
                                this.tableComponents[2].options = [];
                                this.formField.pointCode = "";
                                this.getPointCode();
                              },
                            isMul: false,
                            isRequire: false,
                            options: [],
                          },

                        {
                            compKey: "compKey_pointCode",
                            labelName: "工位",
                            codeField: "pointCode",
                            oFields: "POINT_CODE,POINT_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            type: "dropdownList",
                            isMust: true,
                            isMul: false,
                            isRequire: false,
                            options: [],
                            // disabled: false,
                            // edit_disabled: true,
                            // add_disabled: false,
                          },
                        // {
                        //   compKey: 'andonType',
                        //   labelDesc: 'Andon类型',
                        //   labelName: 'Andon类型',
                        //   codeField: 'andonType',
                        //   component: () => import('@/components/org/commonInput'),
                        //   type: 'inputText',
                        //   hidden: false,
                        //   dataToObject: {
                        //     maxWordCount: 7,
                        //   },
                        // },
                          {
                            compKey: "andonType",
                            labelName: "Andon类型",
                            codeField: "andonType",
                            oFields: "andonType,andonType",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            type: "dropdownList",
                            isMust: false,
                            isMul: false,
                              isRequire: false,

                            maxWordCount: 12,
                            options: [],
                        },
                        {
                            compKey: "andonSdt",
                            labelName: "Andon时间起",
                            codeField: "andonSdt",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
                            dataToObject: {
                                maxWordCount: 12,
                            },
                        },
                        {
                            compKey: "andonSdt2",
                            labelDesc: "",
                            labelName: "Andon时间止",
                            codeField: "andonSdt2",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
                            dataToObject: {
                                maxWordCount: 12,
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
                            prop: "processLocationName",
                            label: "车间",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "lineName",
                              label: "产线",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                          {
                            prop: "pointName",
                            label: "工位",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "andonType",
                            label: "Andon类型",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "andonSdt",
                            label: "Andon时间",
                            width: null,
                              align: "center",
                            hidden: false,
                        },
                        {
                            prop: "andonEdt",
                            label: "Andon结束时间",
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
                        // {
                        //   prop: 'andonStatus',
                          //   label: 'Andon状态',
                        //   width: null,
                        //   align: 'center',
                        //   hidden: false,
                        // },
                    ],
            // 字段格式化转换（用于导出excel）（kvs表示键值转换）
            exportConverts: {},
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: this.$PLANT_CODE,
                    pointCode: "",
                    processLocation: "",
                    lineNo: "",
                    andonType: "",
                    andonSdt: "",
                    andonSdt2: "",
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
        this.queryAndonType();
    },
    methods: {
        queryData() {
            const sdt = new Date(this.formField.andonSdt.replace(/-/g, "/"));
            const sdt2 = new Date(this.formField.andonSdt2.replace(/-/g, "/"));
            if (sdt > sdt2) {
                this.$alert("Andon时间起不能大于Andon时间止！", "提示");
                return;
            }
            this.queryTable(1);
        },
        queryLocation() {
            queryLocation({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[0].options = res.rows;
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
                tenancyId: this.$store.state.user.tenancyId,
                processLocation: this.formField.processLocation,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[1].options = res.rows;
                            // this.formField.lineNo = res.rows[0].LINE_NO;
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
            getPointCode({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                processLocation: this.formField.processLocation,
                lineNo: this.formField.lineNo,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            res.rows.forEach(function (item) {
                                item.POINT_NAME =
                                    item.POINT_NAME +
                                    "(" +
                                    item.POINT_CODE +
                                    ")";
                            });
                            this.tableComponents[2].options = res.rows;
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
        queryAndonType() {
            const params = {
                plantCode: this.$PLANT_CODE,
            };
            queryAndonType(params).then((res) => {
                // if (res.result === "1") {
                console.log(res.rows);
                this.tableComponents[3].options = res.rows;

                // }
            });
        },
    },
};
</script>
