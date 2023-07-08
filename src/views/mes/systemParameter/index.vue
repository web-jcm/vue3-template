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

        <edit
            :key="editPopupsKey"
            :dynamic-edit-row-data="editRowData"
            :popups-visible="editPopupsVisible"
            :popups-state="editPopupsState"
            :is-set-default-brand="false"
            @close="close"
        />
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org.js";

import { editAndonType, querySystemParameter } from "@/api/apiList/mes";
import { exportCommon } from "@/utils/utils";

import Vue from "vue";

export default {
    name: "SystemParameter",
    components: {
        Edit: () => import("./edit"),
    },
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
            apiConfig: orgApis.querySystemParameter,
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
                            compKey: "btnKey_edit",
                            type: "",
                            size: "small",
                            clickEvent: () => this.edit(),
                            text: this.$t("sys.button.edit"),
                            name: "edit",
                            position: "left",
                        },
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
                            compKey: "parameterType",
                            labelDesc: "参数类型",
                            labelName: "参数类型",
                            codeField: "parameterType",
                            oFields: "PARAMETERTYPE,PARAMETERTYPE",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              options: [],
                        },
                        {
                            compKey: "parameterName",
                              labelDesc: "参数名称",
                            labelName: "参数名称",
                            codeField: "parameterName",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                              hidden: false,
                            dataToObject: {
                                maxWordCount: 7,
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
                            prop: "parameterType",
                            labelDesc: "参数类型",
                            label: "参数类型",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "parameterCode",
                            labelDesc: "参数编码",
                              label: "参数编码",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "parameterName",
                            labelDesc: "参数名称",
                            label: "参数名称",
                              width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "parameterValue",
                            labelDesc: "参数值",
                            label: "参数值",
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
                    parameterType: "",
                    parameterName: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            // 是否使用刷新Key的方式刷新弹窗
            resetDialogKey: false,
            printPopupsVisible: false,
        };
    },
    created() {
        this.querySystemParameter();
    },
    methods: {
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
        querySystemParameter() {
            querySystemParameter({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[0].options = res.rows;
                        // this.formField.parameterType = res.rows[0].LOOKUP_VALUE_CODE;
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
