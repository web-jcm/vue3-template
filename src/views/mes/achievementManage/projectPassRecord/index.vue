<template>
    <div class="app-container app-container-table">
        <div class="nav_wrap">
            <div class="nav_btn" @click="navigate('vehiclesInfoShow')">
                车辆信息显示
            </div>
        </div>
        <n-data-table
            ref="multipleTable"
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
            :isShowPagination="false"
        >
        </n-data-table>
    </div>
</template>
<script>
import {
    mesApis,
    queryCtrlKey,
    queryLookupValues,
    queryLineNo,
    queryProcessPoint,
} from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "projectPassRecord",
    components: {},
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
            // 网格查询API配置对象
            apiConfig: mesApis.queryProjectPassRecord,
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
                            compKey: "btnKey_reset",
                              type: "",
                            size: "small",
                            clickEvent: () => this.reset(),
                            text: this.$t("sys.button.reset"),
                              name: "reset",
                            position: "center",
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
                              compKey: "plantCode",
                            labelName: "工厂名称",
                            codeField: "plantCode",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
                            span: 4,
                        },
                        {
                            compKey: "lineNo",
                            labelName: "生产线",
                            codeField: "lineNo",
                            oFields: "LINE_NO,LINE_NAME",
                            lookuptype: "_is_null_code_",
                            span: 4,
                            component: () =>
                                import("@/components/org/LookupValue"),
                              options: [],
                        },
                        {
                            compKey: "PRODUCT_TYPE",
                            labelName: "生产类型",
                            codeField: "PRODUCT_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            span: 4,
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isRequire: true,
                            isMust: true,
                            clearable: false,
                            options: [],
                          },
                        {
                            compKey: "processCode",
                            labelName: "工程",
                            codeField: "processCode",
                            oFields: "PROCESS_CODE,PROCESS_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            options: [],
                            span: 4,
                        },
                        {
                            compKey: "searchKey",
                            labelName: "查询KEY",
                            codeField: "searchKey",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            span: 4,
                            options: [],
                        },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            component: () =>
                                import("@/components/org/commonInput"),
                              isMust: true,
                            dataToObject: { maxLength: 50 },
                            span: 4,
                          },
                        {
                            compKey: "passStartDateTime",
                            labelName: "通过开始时间",
                            codeField: "passStartDateTime",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/datePicker"
                                ),
                            dateType: "datetime",
                            span: 4,
                        },
                        {
                            compKey: "passEndDateTime",
                            labelName: "通过结束时间",
                            codeField: "passEndDateTime",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/datePicker"
                                ),
                            dateType: "datetime",
                            span: 4,
                        },
                        {
                            compKey: "passDate",
                            labelName: "实绩日期",
                            codeField: "passDate",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/datePicker"
                                ),
                            type: "datePicker",
                            span: 4,
                        },
                        {
                            compKey: "passShift",
                              labelName: "实绩班次",
                            codeField: "passShift",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            options: [],
                            span: 4,
                        },
                        {
                            compKey: "isShift",
                            labelName: "班指定",
                            codeField: "isShift",
                            component: () =>
                                import("@/components/org/checkBox"),
                            labelWidth: 50,
                        },
                          {
                            compKey: "isDisplayLast",
                            labelName: "只显示最终通过车辆",
                            labelWidth: 140,
                            codeField: "isDisplayLast",
                            component: () =>
                                import("@/components/org/checkBox"),
                              isComponent: true,
                            dataToObject: {
                                maxWordCount: 9,
                            },
                        },
                        //   {
                        //       compKey: "isRealCar",
                          //       labelName: "只显示实车辆",
                        //       labelWidth: 120,
                        //       codeField: "isRealCar",
                        //       component: () =>
                        //           import("@/components/org/checkBox"),
                          //       isComponent: true,
                        //   },
                        {
                            compKey: "model",
                            labelName: "车型",
                            codeField: "model",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                            span: 4,
                        },
                        {
                            compKey: "colorK",
                            labelName: "外饰色",
                            codeField: "colorK",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "inputText",
                            span: 4,
                        },
                        {
                            compKey: "colorI",
                            labelName: "内饰色",
                            codeField: "colorI",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "inputText",
                            span: 4,
                          },
                        //   {
                        //       compKey: "passStartDate",
                        //       labelName: "计划开始日班",
                        //       codeField: "passStartDate",
                          //       component: () =>
                        //           import(
                        //               "@/components/org/datePicker/datePicker"
                        //           ),
                        //       type: "datePicker",
                          //   },
                        //   {
                        //       compKey: "passStartShift",
                        //       codeField: "passStartShift",
                        //       component: () =>
                        //           import("@/components/org/commonInput"),
                        //       type: "inputText",
                        //       dataToObject: {
                        //           placeholder: "",
                        //       },
                        //       span: 2,
                        //   },
                        //   {
                        //       compKey: "passEndDate",
                        //       labelName: "计划结束日班",
                        //       codeField: "passEndDate",
                        //       component: () =>
                        //           import(
                        //               "@/components/org/datePicker/datePicker"
                        //           ),
                        //       type: "datePicker",
                        //   },
                        //   {
                        //       compKey: "passEndShift",
                        //       codeField: "passEndShift",
                          //       component: () =>
                        //           import("@/components/org/commonInput"),
                        //       type: "inputText",
                        //       dataToObject: {
                        //           placeholder: "",
                          //       },
                        //       span: 2,
                        //   },
                        //   {
                        //       compKey: "metalOk",
                        //       labelName: "只显示通过Metal ok车辆",
                        //       labelWidth: 170,
                        //       codeField: "metalOk",
                        //       component: () =>
                        //           import("@/components/org/checkBox"),
                        //       isComponent: true,
                        //       dataToObject: {
                        //           maxWordCount: 15,
                          //       },
                        //   },
                          //   {
                        //       compKey: "metalRepairOk",
                        //       labelName: "只显示通过Metal repair ok车辆",
                          //       labelWidth: 180,
                        //       codeField: "metalRepairOk",
                          //       component: () =>
                        //           import("@/components/org/checkBox"),
                        //       isComponent: true,
                        //       dataToObject: {
                        //           maxWordCount: 22,
                          //       },
                        //   },
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
                              label: "管理号",
                        },
                        {
                            prop: "processCode",
                            label: "工程点位",
                            width: 50,
                        },
                        {
                            prop: "pointCode",
                            label: "物理点位",
                            width: 50,
                        },
                        {
                            prop: "pointName",
                            label: "点位名称",
                            width: 100,
                          },
                        {
                            prop: "passDate",
                            label: "实绩日期",
                        },
                        {
                            prop: "passShift",
                            label: "实绩班次",
                            width: 60,
                        },
                        {
                            prop: "passOnlineDateShift",
                              label: "实绩时间",
                            width: 130,
                        },
                          {
                            prop: "passCount",
                            label: "通过次数",
                            width: 50,
                        },
                        {
                            prop: "trimSerialNo",
                            label: "总装连续编号",
                          },
                        {
                            prop: "bodySerialNo",
                            label: "焊装连续编号",
                        },
                        {
                            prop: "vinNo",
                            label: "VIN",
                            width: 140,
                        },
                        {
                            prop: "model",
                            label: "车型",
                            width: 250,
                        },
                        {
                              prop: "colorK",
                            label: "外饰色",
                            width: 50,
                        },
                        {
                            prop: "colorI",
                            label: "内饰色",
                            width: 50,
                        },
                          {
                            prop: "lineM",
                            label: "M",
                            width: 50,
                        },
                        {
                            prop: "lineP",
                            label: "P",
                            width: 50,
                          },
                        {
                            prop: "lineT",
                            label: "T",
                            width: 50,
                        },
                        {
                            prop: "lineF",
                            label: "F",
                            width: 50,
                        },

                        {
                            prop: "planShiftDate",
                            label: "计划日期",
                        },
                          {
                            prop: "planShift",
                            label: "计划班次",
                            width: 60,
                        },
                        {
                            prop: "planTime",
                            label: "计划时间",
                            width: 130,
                          },
                        {
                            prop: "delaytime",
                            label: "延迟时间",
                            width: 50,
                        },

                        //   {
                        //     prop: 'doukiNo',
                        //     label: '同期编号',
                        //   },

                        //   {
                        //     prop: 'engineNo',
                          //     label: '发动机编号/Motor No',
                        //     width: 100,
                        //   },
                        //   {
                        //     prop: 'motorNo',
                        //     label: 'Motor No',
                        //   },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                    searchKey: "",
                    searchValue: "",
                    ctrlKey: "",
                    processCode: "",
                    PRODUCT_TYPE: "",
                    passDate: "",
                    passShift: "",
                    model: "",
                    colorI: "",
                    colorK: "",
                    passStartDateTime: "",
                    passEndDateTime: "",
                    // passStartDate: "",
                    // passStartShift: "",
                    // passEndDate: "",
                    // passEndShift: "",
                    lineNo: "",
                    isShift: "0",
                    isDisplayLast: "0",
                    isRealCar: "0",
                    // metalOk: '0',
                    // metalRepairOk: '0',
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.plantCode": function () {
            this.queryLineNo();
            this.queryLookupValues("QUERY_TYPE");
            this.queryLookupValues("SHIFT");
            this.queryLookupValues("PRODUCT_TYPE");
        },
        "formField.PRODUCT_TYPE": function (val) {
            this.formField.processCode = "";
            if (val) {
                this.queryProcessPoint();
            }
        },
    },
    methods: {
        onExport() {
            exportCommon(
                "/ly/mp/mom/mes/vmes/achv/projectpassrecordqueryservice/exportExcel.do",
                this.formField,
                "工厂通过履历查询导出"
            );
        },
        handleTableRowDbClick() {
            this.navigate("vehiclesInfoShow");
        },
        async search() {
            if (
                (this.formField.passStartDateTime &&
                    !this.formField.passEndDateTime) ||
                (!this.formField.passStartDateTime &&
                    this.formField.passEndDateTime)
            ) {
                return this.$utils.message({
                    message: "通过开始时间和通过结束时间须同时填写！",
                });
            }
            // let flag =
            //     (this.formField.passStartDate &&
            //         this.formField.passStartShift &&
            //         this.formField.passEndDate &&
            //         this.formField.passEndShift) ||
            //     (!this.formField.passStartDate &&
            //         !this.formField.passStartShift &&
            //         !this.formField.passEndDate &&
            //         !this.formField.passEndShift);
            // if (!flag) {
            //     return this.$utils.message({
            //         message: "计划开始日班和计划结束日班须同时填写！",
            //     });
            // }
            if (this.formField.isShift === "0") {
                this.formField.passDate = "";
                this.formField.passShift = "";
            }
            if (!this.formField.processCode && !this.formField.searchValue) {
                return this.$utils.message({
                    message: "工程为全部时须填写管理号或vin！",
                });
            }
            this.formField.ctrlKey = "";
            if (this.formField.searchValue) await this.queryCtrlKey();
            if (
                (!this.formField.processCode && this.formField.ctrlKey) ||
                this.formField.processCode
            ) {
                this.queryTable(1);
            }
        },
        queryLineNo() {
            this.tableComponents[1].options = [];
            queryLineNo({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
                            this.tableComponents[1].options = res.rows;
                            this.formField.lineNo = res.rows[0].LINE_NO;
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
        queryCtrlKey() {
            return queryCtrlKey({
                PLANT_CODE: this.formField.plantCode,
                searchKey: this.formField.searchKey,
                searchValue: this.formField.searchValue,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.formField.ctrlKey = res.rows[0].CTRL_KEY;
                    } else {
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
        queryLookupValues(type) {
            queryLookupValues({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "QUERY_TYPE") {
                            this.tableComponents[4].options = res.rows;
                            this.formField.searchKey =
                                res.rows[0].LOOKUP_VALUE_CODE;
                        } else if (type === "SHIFT") {
                            this.tableComponents[9].options = res.rows;
                        } else if (type === "PRODUCT_TYPE") {
                            this.tableComponents[2].options = res.rows;
                            this.formField.PRODUCT_TYPE =
                                res.rows[0].LOOKUP_VALUE_CODE;
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
        queryProcessPoint() {
            this.tableComponents[3].options = [
                {
                    PROCESS_NAME: "全部",
                    PROCESS_CODE: "",
                },
            ];
            queryProcessPoint({
                plantCode: this.formField.plantCode,
                PRODUCT_TYPE: this.formField.PRODUCT_TYPE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[3].options.push(...res.rows);
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
        navigate(path) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        key: "ctrlKey",
                        value: this.clickRowsData.ctrlKey,
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
            //     params: { key: "ctrlKey", value: this.clickRowsData.ctrlKey },
            // });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/projectPassRecord/projectPassRecord.scss";
</style>
