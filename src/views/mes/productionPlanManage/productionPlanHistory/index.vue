<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            id="table"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :pageSizeArray="pageSizeArr"
            @row-click="rowClick"
            class="table_style"
        />
    </div>
</template>
<script>
import { mesApis } from "@/api/apiList/mes";
import {
    delProductPlan,
    queryZone,
    queryLookupValues,
    savePlanYearCode,
} from "@/api/apiList/mes";
import Vue from "vue";
import { exportCommon } from "@/utils/utils";
export default {
    name: "projectPlanNumberManagement",
    components: {
        Export: () => import("@/components/importFile/export.vue"),
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
            file: {
                name: "",
            },
            dialogVisible: false,
            // 网格查询API配置对象
            apiConfig: mesApis.queryProductPlanHistory,
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
                              compKey: "btnKey_query",
                              type: "primary",
                              size: "small",
                              clickEvent: () => this.search(),
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
                              compKey: "btnKey_etc",
                              type: "",
                              size: "small",
                              clickEvent: () => this.onExport(),
                              text: "导出",
                              name: "etc",
                              position: "left",
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
                              compKey: "queryType",
                              labelName: "查询KEY",
                              codeField: "queryType",
                              oFields: "ATT1,LOOKUP_VALUE_NAME",
                              lookuptype: "_is_null_code_",
                              component: () =>
                                  import("@/components/org/LookupValue"),
                              isMust: true,
                              clearable: false,
                              options: [],
                          },
                          {
                              compKey: "queryCode",
                              codeField: "queryCode",
                              component: () =>
                                  import("@/components/org/commonInput"),
                              isMust: true,
                              rule: "",
                          },
                          {
                              compKey: "BATCH_NO",
                              labelName: "计划批次",
                              codeField: "BATCH_NO",
                              component: () =>
                                  import("@/components/org/commonInput"),
                              type: "inputText",
                              isMust: true,
                              dataToObject: { maxLength: 50 },
                          },
                          {
                              compKey: "PLAN_TIME7_START",
                              labelName: "总装下线起",
                              codeField: "PLAN_TIME7_START",
                              component: () =>
                                  import(
                                      "@/components/org/datePicker/datePicker"
                                  ),
                              dateType: "datetime",
                              dataToObject: { maxLength: 50 },
                          },
                          {
                              compKey: "PLAN_TIME7_END",
                              labelName: "总装下线止",
                              codeField: "PLAN_TIME7_END",
                              component: () =>
                                  import(
                                      "@/components/org/datePicker/datePicker"
                                  ),
                              dateType: "datetime",
                              dataToObject: { maxLength: 50 },
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
                              prop: "BATCH_NO",
                              label: "计划批次",
                          },
                          {
                              prop: "PLANT_CODE",
                              label: "工厂编码",
                          },
                          {
                              prop: "CTRL_KEY",
                              label: "管理号",
                          },
                          {
                              prop: "ORDER_ID",
                              label: "订单号",
                          },
                          {
                              prop: "VIN_NO",
                              label: "VIN",
                              width: 135,
                          },
                          {
                              prop: "BODY_PRODUCT_CODE",
                              label: "生产车系",
                          },
                          {
                              prop: "DOUKI_NO",
                              label: "同期号",
                          },
                          {
                              prop: "BASE_MODEL",
                              label: "基准车系",
                          },
                          {
                              prop: "MODEL",
                              label: "车型",
                              width: 135,
                          },
                          {
                              prop: "CONFIGURATION",
                              label: "配置",
                          },
                          {
                              prop: "COLOR_K",
                              label: "外饰色",
                          },
                          {
                              prop: "COLOR_I",
                              label: "内饰色",
                          },
                          {
                              prop: "ZONE_CODE",
                              label: "区域编码",
                          },
                          {
                              prop: "ZONE_NAME",
                              label: "区域名称",
                          },
                          {
                              prop: "PLAN_TIME1",
                              label: "焊装上线时间",
                              width: 135,
                          },
                          {
                              prop: "PLAN_TIME2",
                              label: "焊装下线时间",
                              width: 135,
                          },
                          {
                              prop: "PLAN_TIME3",
                              label: "涂装上线时间",
                              width: 135,
                          },
                          {
                              prop: "PLAN_TIME4",
                              label: "涂装下线时间",
                              width: 135,
                          },
                          {
                              prop: "PLAN_TIME6",
                              label: "总装上线时间",
                              width: 135,
                          },
                          {
                              prop: "PLAN_TIME7",
                              label: "总装下线时间",
                              width: 135,
                          },
                      ],
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    queryType: "",
                    queryCode: "",
                    ZONE_CODES: "",
                    BATCH_NO: "",
                    PLAN_TIME7_START: undefined,
                    PLAN_TIME7_END: undefined,
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            pageSizeArr: [10, 50, 100, 500],
            clickRowsData: {}, //点击行对象
            showDialog: false,
            totalCar: 0,
            selectYear: "",
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
            this.queryZone();
        },
        "formField.queryType": function (val) {
            if (val === "CTRL_KEY") {
                this.tableComponents[2].rule = "1";
            } else if (val === "VIN_NO") {
                this.tableComponents[2].rule = "2";
            } else if (val === "ORDER_ID") {
                this.tableComponents[2].rule = "3";
            }
        },
    },
    methods: {
        onExport() {
            exportCommon(
                "/ly/mp/mom/mes/vmes/base/CarBaseService/queryCarInfoJdbcAllExport.do",
                this.formField,
                "生产计划历史导出"
            );
        },
        navigate(path) {
            if (path === "productionSequenceAdjustment") {
                const myMenu = window.parent.$api.menu.findMenusByPath(path);
                if (myMenu?.length) {
                    window.parent.$multilMenuDo.actions.openMenu(myMenu[0].id);
                    //非菜单页面
                    // window.parent.$multilMenuDo.actions.renderMenu(
                    //     myMenu[0].target,
                    //     myMenu[0].id,
                    //     0,
                    //     myMenu[0].name
                    // );
                }
                //不集成mp
                // this.$router.push({
                //     name: path
                // });
            } else if (path === "vehiclesBaseInfoManagement") {
                const myMenu = window.parent.$api.menu.findMenusByPath(path);
                if (myMenu?.length) {
                    sessionStorage.setItem(
                        path,
                        JSON.stringify({
                            key: "ctrlKey",
                            value: this.clickRowsData.CTRL_KEY,
                        })
                    );
                    window.parent.$multilMenuDo.actions.openMenu(myMenu[0].id);
                    //非菜单页面
                    // window.parent.$multilMenuDo.actions.renderMenu(
                    //     myMenu[0].target,
                    //     myMenu[0].id,
                    //     0,
                    //     myMenu[0].name
                    // );
                }
                //不集成mp
                // this.$router.push({
                //     name: path,
                //     params: {
                //         key: 'ctrlKey',
                //         value: this.clickRowsData.CTRL_KEY,
                //     },
                // });
            }
        },
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "QUERY_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.queryType = res.rows[0].ATT1;
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
        queryZone() {
            queryZone({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                TEMP_ZONES: ["B#S01", "B#H01"],
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableComponents[3].options = res.rows;
                        this.formField.ZONE_CODES = [];
                        this.tableComponents[3].options.forEach((item) => {
                            this.formField.ZONE_CODES.push(item.ZONE_CODE);
                        });
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
            if (!this.formField.ZONE_CODES.length) {
                this.formField.ZONE_CODES = [];
                this.tableComponents[3].options.forEach((item) => {
                    this.formField.ZONE_CODES.push(item.ZONE_CODE);
                });
            } else if (typeof this.formField.ZONE_CODES === "string") {
                this.formField.ZONE_CODES =
                    this.formField.ZONE_CODES.split(",");
            }
            this.tableComponents[1].options.forEach((item) => {
                if (item.ATT1 === this.formField.queryType) {
                    this.formField[item.ATT1] = this.formField.queryCode;
                } else {
                    this.formField[item.ATT1] = "";
                }
            });
            this.queryTable(1);
        },
        submitUpload() {
            if (!this.file.name) {
                this.$message({
                    message: "请先选取文件!",
                    type: "warning",
                });
                return;
            }
            var testmsg = this.file.name.substring(
                this.file.name.lastIndexOf(".") + 1
            );
            const extension = testmsg === "xls";
            const extension2 = testmsg === "xlsx";
            if (!extension && !extension2) {
                this.$message({
                    message: "上传文件只能是 xls、xlsx格式!",
                    type: "warning",
                });
                return;
            }
            this.dialogVisible = false;
            this.loading = this.$loading({
                lock: true,
                text: "导入中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            this.$requestImport(
                "/ly/mp/mom/mes/vmes/plan/planService/importPlan.do",
                { file: this.file },
                (res) => {
                    this.loading.close();
                    if (res.result == "1") {
                        this.$utils.message({
                            message: "导入成功！",
                        });
                        this.search();
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                },
                `&plantCode=${this.formField.PLANT_CODE}`,
                (err) => {
                    this.loading.close();
                    this.$utils.message({
                        message: "保存失败!",
                    });
                }
            );
        },
        handleOpenDialog() {
            this.dialogVisible = true;
        },
        changeFile(e) {
            this.file = e.raw;
        },
        downloadTemplate() {
            // let hrefStr = encodeURI(
            //     "/static/ImportTemplate/mes/生产计划管理_导入模板.xlsx"
            // ); //本地测试url
            let hrefStr = encodeURI(
                "/vue-dist/mesControl/static/ImportTemplate/mes/生产计划管理_导入模板.xlsx"
            ); //线上url
            window.location.href = hrefStr;
        },
        delete() {
            if (this.$refs.multipleTable.selection.length) {
                this.$confirm("是否删除选择的计划?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    let arr = [];
                    this.$refs.multipleTable.selection.forEach((item) => {
                        arr.push(item.CTRL_KEY);
                    });
                    this.loading = this.$loading({
                        lock: true,
                        text: "删除中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    delProductPlan({
                        plantCode: this.formField.PLANT_CODE,
                        ctrlKeys: arr,
                    })
                        .then((res) => {
                            this.$utils.message({
                                message: res.msg,
                            });
                            this.loading.close();
                            if (res.result === "1") this.search();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                });
            } else {
                this.$utils.message({
                    message: "请选择要删除的数据！",
                });
            }
        },
        rowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        editYear() {
            if (this.$refs.multipleTable.selection.length) {
                this.totalCar = this.$refs.multipleTable.selection.length;
                this.showDialog = true;
            } else {
                this.$utils.message({
                    message: "请选择数据！",
                });
            }
        },
        saveEditYear() {
            if (!this.selectYear) {
                return this.$utils.message({
                    message: "请选择年份！",
                });
            }
            this.$confirm("是否要修改年份?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.loading = this.$loading({
                    lock: true,
                    text: "保存钟",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                savePlanYearCode({
                    PLANT_CODE: this.formField.PLANT_CODE,
                    YEAR_CODE: this.selectYear,
                    ROWS: this.$refs.multipleTable.selection,
                })
                    .then((res) => {
                        this.$utils.message({
                            message: res.msg,
                        });
                        this.loading.close();
                        if (res.result === "1") {
                            this.search();
                            this.selectYear = "";
                            this.showDialog = false;
                        }
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productionPlanManagement/productionPlanManagement.scss";
</style>
