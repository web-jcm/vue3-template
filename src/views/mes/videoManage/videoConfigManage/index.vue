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

import {
    editVideoConfig,
    queryLineNo,
    queryLocation,
    getPointCode,
} from "@/api/apiList/mes";
import { exportCommon } from "@/utils/utils";
import Vue from "vue";

export default {
    name: "videoManage",
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
            apiConfig: orgApis.getVideoConfigList,
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
                            clickEvent: () => this.resetData(),
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
                        {
                            compKey: "cameraName",
                            labelDesc: "名称",
                            labelName: "名称",
                            codeField: "cameraName",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "inputText",
                            hidden: false,
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
                            prop: "cameraCode",
                              labelDesc: "摄像头编号",
                            label: "摄像头编号",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "cameraName",
                            labelDesc: "摄像头名称",
                            label: "摄像头名称",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "ip",
                            labelDesc: "摄像头IP",
                            label: "摄像头IP",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "port",
                            labelDesc: "摄像头端口",
                              label: "摄像头端口",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "pointName",
                            labelDesc: "工位",
                            label: "工位",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "cutStartLong",
                            labelDesc: "开始(N分钟后)",
                            label: "开始(N分钟后)",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "cutTimeLong",
                            labelDesc: "截取时长(分钟)",
                            label: "截取时长(分钟)",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "lineName",
                            labelDesc: "生产线",
                            label: "生产线",
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
                            prop: "plantName",
                            labelDesc: "工厂",
                            label: "工厂",
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
                    plantCode: this.$PLANT_CODE,
                    pointCode: "",
                    processLocation: "",
                    lineNo: "",
                    cameraName: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            // 是否使用刷新Key的方式刷新弹窗
            resetDialogKey: false,
            printPopupsVisible: false,
        };
    },
    created() {
        // this.queryLineNo()
        this.queryLocation();
        // this.getPassingPoint()
    },
    watch: {
        // formField: {
        //   handler(newValue, oldValue) {
        //     if (newValue) {
        //       console.log(newValue)
        //       let _this = this
        //       if (
        //         !oldValue ||
        //         (oldValue && newValue.processLocation != oldValue.processLocation)
        //       ) {
        //         this.queryLineNo()
        //       }
        //       if (!oldValue || (oldValue && newValue.lineNo != oldValue.lineNo)) {
        //         this.getPassingPoint()
        //       }
        //     }
        //   },
        //   deep: true,
        //   immediate: true,
        // },
    },
    methods: {
        resetData() {
            this.tableComponents[1].options = [];
            this.tableComponents[2].options = [];
            this.reset();
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
        printTest(param1, param2) {
            console.log(param1, param2);
            this.printPopupsVisible = true;
        },
        closePrint() {
            this.printPopupsVisible = false;
        },
        // 导出
        exportExcel() {
            exportCommon(
                "/ly/mp/mom/mes/vmes/videoconfig/exportVideoConfig.do",
                this.formField,
                "工位视频截取配置导出"
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
                    editVideoConfig(editRowData)
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
