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

import { editAndonType } from "@/api/apiList/mes";
import { exportCommon } from "@/utils/utils";

import Vue from "vue";

export default {
    name: "AndonType",
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
            apiConfig: orgApis.getAndonTypeQueryListAll,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length >
                    (0).length >
                    0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableButtons
                    : [
                        {
                            compKey: "btnKey_newAdd",
                              type: "",
                            size: "small",
                            clickEvent: () => {
                                this.showEdit("add");
                            },
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
                            name: "delete",
                            position: "left",
                            disabled: false,
                        },
                        {
                            compKey: "btnKey_export",
                            type: "",
                            size: "small",
                            clickEvent: () => this.exportExcel(),
                            text: this.$t("sys.button.export"),
                              name: "export",
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
                            compKey: "andonType",
                            labelDesc: "Andon类型",
                            labelName: "Andon类型",
                            codeField: "andonType",
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
                            prop: "andonCode",
                            labelDesc: "andon编码",
                            label: "编码",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "andonType",
                            labelDesc: "andon类型",
                            label: "Andon类型",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "orderNo",
                            labelDesc: "排序号",
                            label: "排序号",
                            width: null,
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
                    andonType: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            // 是否使用刷新Key的方式刷新弹窗
            resetDialogKey: false,
            printPopupsVisible: false,
        };
    },
    methods: {
        printTest(param1, param2) {
            console.log(param1, param2);
            this.printPopupsVisible = true;
        },
        closePrint() {
            this.printPopupsVisible = false;
        },
        // 导出
        exportExcel() {
            console.log("1234");
            exportCommon(
                "/ly/mp/mom/mes/vmes/andontype/exportAndonType.do",
                this.formField,
                "andon类型导出"
            );
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
    },
};
</script>
