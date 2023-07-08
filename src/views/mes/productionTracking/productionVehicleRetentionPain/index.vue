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
            <template v-slot:productType="scope">
                <span>{{
                    scope.row.productType == "1" ? "车身" : "车架"
                }}</span>
            </template>
            <template v-slot:restoreStatus="scope">
                <span>{{
                    scope.row.restoreStatus == "0" ? "未恢复" : "恢复"
                }}</span>
            </template>
        </n-data-table>

        <edit
            :showType="showType"
            :clickRowsData="selectedRow"
            v-if="editShow"
            @close="close"
        />

        <team :clickRowsData="selectedRow" v-if="teamShow" @close="closeTeam" />
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org.js";
import { deleteCarException, restorecarexception } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "productionVehicleRetention",
    components: {
        Edit: () => import("./edit"),
        Team: () => import("./team"),
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
            apiConfig: orgApis.querycarexception,
            editShow: false,
            showType: undefined,
            teamShow: false,
            selectedRow: undefined,
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
                            compKey: "btnKey_newAdd",
                            type: "",
                            size: "small",
                            clickEvent: () => {
                                this.add();
                            },
                            text: "车辆弹出",
                            name: "add",
                              position: "left",
                        },
                        //   {
                        //       compKey: "btnKey_edit",
                        //       type: "",
                        //       size: "small",
                        //       clickEvent: () => this.edit(),
                        //       text: "修改",
                        //       name: "edit",
                        //       position: "left",
                        //   },
                        //   {
                          //       compKey: "btnKey_delete",
                        //       type: "",
                        //       size: "small",
                          //       clickEvent: () => this.delete(),
                        //       text: this.$t("sys.button.delete"),
                        //       name: "delete",
                          //       position: "left",
                        //       disabled: false,
                        //   },
                          {
                            compKey: "btnKey_recover",
                            type: "",
                            size: "small",
                            clickEvent: () => this.edit(),
                            text: "入线",
                            name: "edit",
                            position: "left",
                            disabled: false,
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
                    .tableComponents.length >
                    (0).length >
                    0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                          .tableComponents
                    : [
                        {
                            compKey: "ctrlKey",
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
                            compKey: "exceptionType",
                            labelName: "异常类型",
                            codeField: "exceptionType",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                            hidden: true,
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
                            component: () =>
                                import("@/components/org/LookupValue"),
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
                            prop: "productType",
                            label: "生产类型",
                              width: null,
                            align: "center",
                            hidden: false,
                            isSlot: true,
                        },
                        // {
                        //     prop: "exceptionType",
                          //     label: "异常类型",
                        //     width: null,
                        //     align: "center",
                        //     hidden: false,
                        // },
                        //   {
                        //       prop: "exceptionChildType",
                        //       label: "异常子类",
                        //       width: null,
                        //       align: "center",
                        //       hidden: false,
                        //   },
                          {
                            prop: "restoreStatus",
                            label: "恢复状态",
                            width: null,
                            align: "center",
                            hidden: false,
                            isSlot: true,
                        },
                        {
                            prop: "exceptionCause",
                            label: "保留原因",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "exceptionDay",
                            label: "保留天数",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "exceptionHour",
                            label: "保留小时",
                            width: null,
                            align: "center",
                              hidden: false,
                        },
                        {
                            prop: "exceptionMi",
                              label: "保留分钟",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "lineNo",
                            label: "产线",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "originZoneCode",
                            label: "来源区域",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "retainZoneCode",
                            label: "保留区域",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "targetZoneCode",
                            label: "入线区域",
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
                            prop: "modifier",
                              label: "恢复人",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "createdDate",
                            label: "创建时间",
                              width: 150,
                            align: "center",
                            hidden: false,
                        },
                          {
                            prop: "creator",
                            label: "创建人",
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
                    exceptionType: "1",
                    processLocation: "P",
                    productType: "",
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
        close(isSaved) {
            this.editShow = false;
            if (isSaved) {
                this.queryTable(1);
            }
        },
        closeTeam(isSaved) {
            this.teamShow = false;
            if (isSaved) {
                this.queryTable(1);
            }
        },
        add() {
            this.showType = "add";
            this.editShow = true;
        },
        // 编辑按钮事件
        edit() {
            console.log(this.$refs.multipleTable.currentRow);
            if (!this.$refs.multipleTable.currentRow) {
                this.$utils.message({
                    message: "请选择要修改数据！",
                });
                return;
            }
            this.selectedRow = this.$refs.multipleTable.currentRow;
            if (!this.selectedRow.retainZoneCode) {
                this.$utils.message({
                    message: "当前区域为空，不能进行入线操作！",
                });
                return;
            }
            if (this.selectedRow.restoreStatus == "1") {
                this.$utils.message({
                    message: "当前车辆已是恢复状态，不能再入线！",
                });
                return;
            }
            this.teamShow = true;
        },
        recover(index) {
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
                this.$alert("请选择需要恢复的数据", "提示");
                return;
            }
            this.$confirm("此操作将恢复保留车, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    var editRowData = that.list[curIndex];
                    console.log(editRowData);
                    const params = {
                        productType: editRowData.productType,
                        ctrlKey: editRowData.ctrlKey,
                    };
                    restorecarexception(params)
                        .then((res) => {
                            this.loading = false;
                            if (res.result === "1") {
                                this.$message({
                                    message: "恢复保留车成功！",
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
