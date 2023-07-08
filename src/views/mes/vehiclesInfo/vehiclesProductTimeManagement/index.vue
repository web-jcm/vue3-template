<template>
    <div class="app-container app-container-table">
        <div class="nav_wrap">
            <div
                class="nav_btn"
                @click="navigate('vehiclesBaseInfoManagement')"
            >
                车辆基本信息管理
            </div>
        </div>
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="false"
            :dynamic-export-converts="exportConverts"
            @inputblur="handleBlur"
        >
            <template v-slot:shiftValue="scope">
                <el-select v-model="scope.row.shiftValue">
                    <el-option
                        v-for="item in shiftList"
                        :key="item.LOOKUP_VALUE_CODE"
                        :label="item.LOOKUP_VALUE_NAME"
                        :value="item.LOOKUP_VALUE_CODE"
                    >
                    </el-option>
                </el-select>
            </template>
        </n-data-table>
    </div>
</template>
<script>
import {
    queryCarInfo,
    queryCarProduceTime,
    saveProduceTime,
    queryLookupValues,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesProductTimeManagement",
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
                        //   {
                        //       compKey: "btnKey_save",
                        //       type: "",
                        //       size: "small",
                        //       clickEvent: () => this.save(),
                        //       text: this.$t("sys.button.save"),
                        //       name: "preservation",
                        //       position: "right",
                          //   },
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
                          },
                        {
                            compKey: "queryType",
                            labelName: "查询KEY",
                            codeField: "queryType",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            clearable: false,
                            isRequire: true,
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
                    ],
            infoComponents: [
                {
                    compKey: "ctrlKey",
                    labelName: "管理号",
                    codeField: "ctrlKey",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "zoneName",
                    labelName: "区域",
                    codeField: "zoneName",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "model",
                    labelName: "车型",
                    codeField: "model",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "configuration",
                    labelName: "配置",
                    codeField: "configuration",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "colorI",
                    labelName: "内饰色",
                    codeField: "colorI",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "colorK",
                    labelName: "外饰色",
                    codeField: "colorK",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "vinNo",
                    labelName: "VIN",
                    codeField: "vinNo",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
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
                            prop: "processName",
                            label: "工程名称",
                        },
                        {
                            prop: "planShiftDate",
                              label: "计划日期",
                        },
                        {
                            prop: "planShift",
                            label: "计划班次",
                          },
                        {
                            prop: "planTime",
                            label: "计划时间",
                            width: 140,
                        },
                        //   {
                        //       prop: "dateValue",
                        //       label: "修正计划日期",
                        //       isComponent: true,
                        //       noShowTooltip: true,
                        //       comps: [
                        //           {
                        //               compKey: "compKey_dateValue",
                        //               codeField: "dateValue",
                        //               component: () =>
                        //                   import(
                        //                       "@/components/org/datePicker/datePicker"
                          //                   ),
                        //               isMust: true,
                        //               isShowLabel: false,
                        //               disabled: false,
                        //               clearable: true, // 是否可清除
                        //           },
                        //       ],
                        //   },
                        //   {
                        //       prop: "shiftValue",
                        //       label: "修正计划班次",
                        //       isSlot: true,
                        //       noShowTooltip: true,
                        //   },
                        //   {
                        //       prop: "timeValue",
                        //       label: "修正计划时间",
                        //       isComponent: true,
                        //       noShowTooltip: true,
                        //       width: 160,
                        //       comps: [
                        //           {
                        //               compKey: "compKey_timeValue",
                        //               codeField: "timeValue",
                        //               component: () =>
                        //                   import(
                        //                       "@/components/org/datePicker/datePicker"
                        //                   ),
                        //               dateType: "datetime",
                        //               isMust: true,
                        //               isShowLabel: false,
                        //               disabled: false,
                        //               clearable: true, // 是否可清除
                        //           },
                        //       ],
                        //   },
                        {
                            prop: "passDate",
                            label: "通过日期",
                        },
                        {
                            prop: "passShift",
                            label: "通过班次",
                          },
                        {
                            prop: "passTime",
                            label: "通过时间",
                            width: 140,
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                    queryType: "",
                    queryCode: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                ctrlKey: "",
                zoneName: "",
                model: "",
                configuration: "",
                colorI: "",
                colorK: "",
                vinNo: "",
            },
            clickRowsData: {}, //点击行对象
            shiftList: [],
        };
    },
    watch: {
        "formField.queryType": function (val) {
            if (val === "ctrlKey") {
                this.tableComponents[2].rule = "1";
            } else if (val === "vin") {
                this.tableComponents[2].rule = "2";
            } else if (val === "orderId") {
                this.tableComponents[2].rule = "3";
            }
        },
        "formField.plantCode": async function () {
            this.queryLookupValues("SHIFT");
            await this.queryLookupValues("QUERY_TYPE");
            const params = sessionStorage.getItem(
                "vehiclesProductTimeManagement"
            );
            if (params) {
                this.formField.queryType = JSON.parse(params).key;
                this.formField.queryCode = JSON.parse(params).value;
                this.$nextTick(() => this.search());
                sessionStorage.removeItem("vehiclesProductTimeManagement");
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.queryType = this.$route.params.key;
            //     this.formField.queryCode = this.$route.params.value;
            //     this.$nextTick(() => this.search());
            // }
        },
    },
    created() {
        this.formField.tenancyId = this.$store.state.user.tenancyId;
    },
    activated() {
        let params = sessionStorage.getItem("vehiclesProductTimeManagement");
        if (params) {
            this.formField.queryType = JSON.parse(params).key;
            this.formField.queryCode = JSON.parse(params).value;
            this.search();
            sessionStorage.removeItem("vehiclesProductTimeManagement");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.queryType = this.$route.params.key;
        //     this.formField.queryCode = this.$route.params.value;
        //     this.search();
        // }
    },
    methods: {
        navigate(path) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        key: this.formField.queryType,
                        value: this.formField.queryCode,
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
            //         key: this.formField.queryType,
            //         value: this.formField.queryCode,
            //     },
            // });
        },
        search() {
            if (!this.formField.queryCode) {
                return this.$utils.message({
                    message: "请输入查询值！",
                    type: "wran",
                });
            }
            this.tableComponents[1].options.forEach((item) => {
                if (item.LOOKUP_VALUE_CODE === this.formField.queryType) {
                    this.formField[item.LOOKUP_VALUE_CODE] =
                        this.formField.queryCode;
                } else {
                    this.formField[item.LOOKUP_VALUE_CODE] = "";
                }
            });
            this.queryInfo();
            this.queryTable();
        },
        queryTable() {
            this.$refs.multipleTable.listLoading = true;
            this.$refs.multipleTable.list = [];
            queryCarProduceTime(this.formField)
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows?.rows?.length) {
                            res.rows.rows.forEach((item) => {
                                item.dateValue = "";
                                item.shiftValue = "";
                                item.timeValue = "";
                                this.$refs.multipleTable.list.push(item);
                            });
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.$refs.multipleTable.listLoading = false;
                })
                .catch((err) => {
                    this.$refs.multipleTable.listLoading = false;
                    console.log(err);
                });
        },
        queryInfo() {
            this.resultField.ctrlKey = "";
            this.resultField.zoneName = "";
            this.resultField.model = "";
            this.resultField.configuration = "";
            this.resultField.colorI = "";
            this.resultField.colorK = "";
            this.resultField.vinNo = "";
            queryCarInfo(this.formField)
                .then((res) => {
                    if (res.result === "1" && res.rows?.rows?.length) {
                        let rows = res.rows.rows[0];
                        this.resultField.ctrlKey = rows.ctrlKey;
                        this.resultField.zoneName = rows.zoneName;
                        this.resultField.model = rows.model;
                        this.resultField.configuration = rows.configuration;
                        this.resultField.colorI = rows.colorI;
                        this.resultField.colorK = rows.colorK;
                        this.resultField.vinNo = rows.vinNo;
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
        queryLookupValues(type) {
            return queryLookupValues({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "QUERY_TYPE") {
                            this.tableComponents[1].options = res.rows;
                            this.formField.queryType =
                                res.rows[0].LOOKUP_VALUE_CODE;
                        } else if (type === "SHIFT") {
                            this.shiftList = res.rows;
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
        handleBlur(name, value) {
            if (
                value !== null &&
                value !== "" &&
                name === "shiftValue" &&
                (value < 1 || value > 3)
            ) {
                this.$utils.message({
                    message: "请输入数字1至3！",
                });
                this.$refs["multipleTable"].list.forEach((item) => {
                    if (item[name] === value) item[name] = null;
                });
            }
        },
        save() {
            this.$confirm("是否保存修正计划?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = {
                    plantCode: this.formField.plantCode,
                    tenancyId: this.$store.state.user.tenancyId,
                    ctrlKey: this.resultField.ctrlKey,
                    processCodePlanShiftTimeViList: [],
                };
                this.$refs.multipleTable.list.forEach((item) => {
                    if (item.dateValue || item.shiftValue || item.timeValue) {
                        pram.processCodePlanShiftTimeViList.push({
                            planTime: item.timeValue || item.planTime,
                            planShiftDate: item.dateValue || item.planShiftDate,
                            planShift: item.shiftValue || item.planShift,
                            processCode: item.processCode,
                        });
                    }
                });
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveProduceTime(pram)
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "1") this.search();
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
@import "@/styles/mes/vehiclesProductTimeManagement/vehiclesProductTimeManagement.scss";
</style>
