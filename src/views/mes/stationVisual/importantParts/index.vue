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
        >
            <template v-slot:traceType="scope">
                <div class="one_line">
                    {{ formatter(scope.row) }}
                </div>
            </template>
        </n-data-table>
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org.js";

import { exportCommon } from "@/utils/utils";
import Vue from "vue";
import { queryLookupValues } from "@/api/apiList/mes";
export default {
    name: "ImportantParts",
    components: {},
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    // beforeRouteEnter(to, from, next) {
    //     Vue.prototype.$ConfigCache.CacheConfig.initData(
    //         // 同时加载当前页面和编辑框页面的配置
    //         [to.path, "warehouseInfoEdit"],
    //         function () {
    //             next();
    //         }
    //     );
    // },
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            // 网格查询API配置对象
            // apiConfig: sccApis.lmdDbWarehouseQuery,
            apiConfig: orgApis.queryimportparts,
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
                            clickEvent: () => this.queryData(1),
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
                        {
                            compKey: "btnKey_export",
                            type: "",
                            size: "small",
                            clickEvent: () => this.export(),
                            text: "导出",
                            name: "export",
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
                            compKey: "partsCode",
                              labelDesc: "零件码",
                            labelName: "零件码",
                            codeField: "partsCode",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                              hidden: false,
                            dataToObject: {
                                maxWordCount: 7,
                            },
                        },
                        {
                            compKey: "scanType",
                            labelDesc: "扫描类型",
                            labelName: "扫描类型",
                            codeField: "scanType",
                            oFields:
                                  "barCodeCategoryCode,barCodeCategoryName",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
                          },
                        {
                            compKey: "ctrlKey",
                            labelDesc: "车辆管理号",
                            labelName: "车辆管理号",
                            codeField: "ctrlKey",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                            hidden: false,
                            dataToObject: {
                                maxWordCount: 7,
                            },
                        },
                        {
                            compKey: "VIN",
                            labelDesc: "VIN码",
                            labelName: "VIN码",
                            codeField: "vin",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                            hidden: false,
                            dataToObject: {
                                maxWordCount: 7,
                            },
                        },
                        {
                            compKey: "scanSDT",
                            labelDesc: "扫描时间起",
                            labelName: "扫描时间起",
                            codeField: "scanSDT",
                              component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
                          },
                        {
                            compKey: "scanEDT",
                            labelDesc: "扫描时间止",
                            labelName: "扫描时间止",
                            codeField: "scanEDT",
                              component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
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
                        // {
                        //   prop: 'pointCode',
                        //   label: '点位',
                        //   width: null,
                        //   align: 'center',
                        //   hidden: false,
                        // },
                        {
                            prop: "ctrlKey",
                            label: "车辆管理号",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "model",
                            label: "车型",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "vin",
                            label: "VIN",
                            width: 140,
                              align: "center",
                            hidden: false,
                        },
                          {
                            prop: "scanDt",
                            label: "扫描时间",
                            width: 150,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "scanType",
                            label: "扫描类型",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "partsBarCode",
                            label: "零件条码",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "partsCode",
                            label: "零件码",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "partsName",
                              label: "零件名称",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        // {
                          //   prop: 'partsModel',
                        //   label: '零件型号',
                        //   width: null,
                        //   align: 'center',
                        //   hidden: false,
                          // },
                        {
                            prop: "num",
                            label: "数量",
                            width: null,
                            align: "center",
                              hidden: false,
                        },
                        {
                            prop: "productYear",
                            label: "生产年份",
                            align: "center",
                            hidden: false,
                        },

                        {
                            prop: "productMonth",
                            label: "生产月份",
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "productDay",
                            label: "生产日",
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "supplyCode",
                            label: "供应商编码",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "traceNo",
                            label: "追溯流水号",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "traceType",
                            label: "追溯类型",
                            width: null,
                            align: "center",
                              isSlot: true,
                            hidden: false,
                        },
                    ],
            // 字段格式化转换（用于导出excel）（kvs表示键值转换）
            exportConverts: {},
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    partsCode: "",
                    scanType: "",
                    ctrlKey: "",
                    vin: "",
                    scanSDT: "",
                    scanEDT: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            traceTypeList: [
                {
                    name: "单件",
                    code: "1",
                },
                {
                    name: "批量",
                    code: "2",
                },
            ],
            // 是否使用刷新Key的方式刷新弹窗
            resetDialogKey: false,
            printPopupsVisible: false,
        };
    },
    mounted() {
        this.queryLookupValues("SCAN_TYPE");
    },
    methods: {
        formatter(val) {
            if (val.traceType) {
                const obj = this.traceTypeList.find(
                    (item) => item.code == val.traceType
                );
                return obj ? obj.name : "";
            } else {
                return "";
            }
        },
        queryLookupValues(type) {
            queryLookupValues({
                plantCode: this.$PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach(function (item) {
                            item.barCodeCategoryName = item.LOOKUP_VALUE_NAME; //+ '(' + item.LOOKUP_VALUE_CODE + ')'
                            item.barCodeCategoryCode = item.LOOKUP_VALUE_CODE;
                        });
                        this.tableComponents[1].options = res.rows;
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
        queryData() {
            const sdt = new Date(this.formField.scanSDT.replace(/-/g, "/"));
            const sdt2 = new Date(this.formField.scanEDT.replace(/-/g, "/"));
            if (sdt > sdt2) {
                this.$alert("扫描时间起不能大于扫描时间止！", "提示");
                return;
            }
            this.queryTable(1);
        },
        printTest(param1, param2) {
            console.log(param1, param2);
            this.printPopupsVisible = true;
        },
        closePrint() {
            this.printPopupsVisible = false;
        },
        // 编辑按钮事件
        edit(index) {
            var curIndex = index;
            const that = this.$refs[this.tableRef];
            if (curIndex === undefined || curIndex === null) {
                var currentRow;
                if (that.isMul === true) {
                    // 多选
                    var selectData = that.selection;
                    if (selectData.length > 0) {
                        currentRow = selectData[0];
                    }
                } else {
                    // 单选
                    currentRow = that.currentRow;
                }
                if (currentRow) {
                    curIndex = currentRow.index;
                }
            }

            if (curIndex === undefined || curIndex === null) {
                this.$alert("请选择需要修改的数据", "提示");
                return;
            }
            this.editRowData = that.list[curIndex];
            this.showEdit("edit");
        },
        delete(index) {
            var curIndex = index;
            const that = this.$refs.multipleTable;
            if (curIndex === undefined || curIndex === null) {
                var currentRow;
                if (that.isMul === true) {
                    // 多选
                    var selectData = that.selection;
                    if (selectData.length > 0) {
                        currentRow = selectData[0];
                    }
                } else {
                    // 单选
                    currentRow = that.currentRow;
                }
                if (currentRow) {
                    curIndex = currentRow.index;
                }
            }
            if (curIndex === undefined || curIndex === null) {
                this.$alert("请选择需要删除的数据", "提示");
                return;
            }
            this.$confirm("此操作将删除此行数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    var editRowData = that.list[curIndex];
                    editRowData.isEnable = 2;
                    editAndonType(editRowData)
                        .then((res) => {
                            this.loading = false;
                            if (res.result === "1") {
                                this.$message({
                                    message: "删除成功！",
                                    type: "success",
                                });
                                // console.log(this)
                                this.queryTable();
                            }
                        })
                        .catch((err) => {
                            this.loading = false;
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.tableButtons[2].disabled = false;
                });
        },
        export() {
            exportCommon(
                "/ly/mp/mom/mes/vmes/importparts/exportImportParts.do",
                this.formField,
                "关重件查询"
            );
        },
    },
};
</script>
