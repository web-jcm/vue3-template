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
    resendVideo,
    downloadVideo,
    getPassingPoint,
} from "@/api/apiList/mes";
import { downloadFile } from "@/utils/utils";
import Vue from "vue";

export default {
    name: "videoManage",
    components: {
        // Edit: () => import("./edit"),
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
            apiConfig: orgApis.getVideoList,
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
                            compKey: "btnKey_resend",
                            type: "",
                            size: "small",
                            clickEvent: () => {
                                this.resend();
                            },
                              text: "重传",
                            name: "resend",
                            position: "left",
                        },
                        {
                            compKey: "btnKey_download",
                              type: "",
                            size: "small",
                            clickEvent: () => this.downloadVideo(),
                            text: "下载",
                            name: "download",
                            position: "left",
                        },
                        // {
                        //     compKey: "btnKey_delete",
                          //     type: "",
                        //     size: "small",
                        //     clickEvent: () => this.delete(),
                        //     text: this.$t("sys.button.delete"),
                          //     name: "delete",
                        //     position: "left",
                        //     disabled: false,
                        // },
                        // {
                        //     compKey: "btnKey_export",
                          //     type: "",
                        //     size: "small",
                        //     clickEvent: () => this.exportExcel(),
                        //     text: this.$t("sys.button.export"),
                          //     name: "export",
                        //     position: "left",
                        // },
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
                              compKey: "pointCode",
                            labelDesc: "工位",
                            labelName: "工位",
                            codeField: "pointCode",
                            oFields: "POINT_CODE,POINT_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              options: [],
                        },
                        {
                            compKey: "ctrlKey",
                            labelDesc: "管理号",
                            labelName: "管理号",
                            codeField: "ctrlKey",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "inputText",
                            hidden: false,
                          },
                        {
                            compKey: "sdt",
                            labelDesc: "截取开始时间起",
                            labelName: "截取开始时间起",
                            codeField: "sdt",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
                            dataToObject: {
                                maxWordCount: 7,
                              },
                        },
                        {
                            compKey: "sdt2",
                            labelDesc: "截取开始时间止",
                            labelName: "截取开始时间止",
                            codeField: "sdt2",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                              isMust: false,
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
                            prop: "ctrlKey",
                              labelDesc: "管理号",
                            label: "管理号",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
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
                            prop: "pointName",
                            labelDesc: "工位",
                            label: "工位",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                              prop: "videoSDT",
                            labelDesc: "截取开始时间",
                            label: "截取开始时间",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "videoEDT",
                              labelDesc: "截取结束时间",
                            label: "截取结束时间",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "videoName",
                            labelDesc: "视频名称",
                            label: "视频名称",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "videoLocalUrl",
                            labelDesc: "本地视频地址",
                            label: "本地视频地址",
                            width: null,
                            align: "center",
                            hidden: true,
                        },
                        {
                            prop: "videoServiceUrl",
                            labelDesc: "服务器视频地址",
                            label: "服务器视频地址",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                              prop: "videoServiceHttpUrl",
                            labelDesc: "服务器视频http地址",
                            label: "服务器视频地址",
                            width: 300,
                            align: "left",
                            hidden: true,
                        },
                        {
                            prop: "isCut",
                            labelDesc: "是否截取",
                            label: "是否截取",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "cutDt",
                            labelDesc: "截取时间",
                            label: "截取时间",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "cutFailNum",
                            labelDesc: "截取失败次数",
                            label: "截取失败次数",
                            width: null,
                            align: "center",
                              hidden: false,
                        },
                        {
                            prop: "cutMessage",
                            labelDesc: "截取消息",
                            label: "截取消息",
                            width: null,
                            align: "center",
                            hidden: false,
                        },

                        {
                            prop: "isUpload",
                            labelDesc: "是否上传",
                            label: "是否上传",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "uploadDT",
                            labelDesc: "上传时间",
                            label: "上传时间",
                            width: null,
                            align: "center",
                            hidden: false,
                        },
                        {
                            prop: "failNum",
                            labelDesc: "上传失败次数",
                            label: "上传失败次数",
                            width: null,
                            align: "center",
                            hidden: false,
                          },
                        {
                            prop: "uploadMessage",
                            labelDesc: "上传消息",
                            label: "上传消息",
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
                    ctrlKey: "",
                    sdt: "",
                    sdt2: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            // 是否使用刷新Key的方式刷新弹窗
            resetDialogKey: false,
            printPopupsVisible: false,
        };
    },
    created() {
        this.getPassingPoint();
    },
    methods: {
        queryData() {
            const sdt = new Date(this.formField.sdt.replace(/-/g, "/"));
            const sdt2 = new Date(this.formField.sdt2.replace(/-/g, "/"));
            if (sdt > sdt2) {
                this.$alert("截取开始时间起不能大于截取开始时间止！", "提示");
                return;
            }
            this.queryTable(1);
        },
        resend(index) {
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
                this.$alert("请选择需要重传的数据", "提示");
                return;
            }
            var editRowData = that.list[curIndex];
            resendVideo(editRowData)
                .then((res) => {
                    this.loading = false;
                    if (res.result === "1") {
                        this.$message({
                            message: "重传成功！",
                            type: "success",
                        });
                        // console.log(this)
                        this.queryData();
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
            // this.editRowData = that.list[curIndex];
        },

        downloadVideo(index) {
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
                this.$alert("请选择需要下载的数据", "提示");
                return;
            }
            var editRowData = that.list[curIndex];
            downloadVideo(editRowData)
                .then((res) => {
                    this.loading = false;
                    downloadFile(editRowData.videoName, res).then((r) => {
                        // console.log(r);
                    });
                    this.$message({
                        message: "下载成功！",
                        type: "success",
                    });
                    // console.log(this)
                    // this.queryData();
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
            // this.editRowData = that.list[curIndex];
        },

        getPassingPoint() {
            getPassingPoint({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[0].options = res.rows;
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
