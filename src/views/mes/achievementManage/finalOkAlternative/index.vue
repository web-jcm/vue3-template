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
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="true"
            :dynamic-export-converts="exportConverts"
            @inputblur="handleBlur"
        >
        </n-data-table>
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org";
import Vue from "vue";

export default {
    name: "submitAchievement",
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
            apiConfig: orgApis.wmBuCommonQueryFindAll,
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
                            //   clickEvent: () => this.queryData(),
                            text: this.$t("sys.button.query"),
                            name: "search",
                            position: "right",
                        },
                        {
                            compKey: "btnKey_save",
                              type: "",
                            size: "small",
                            clickEvent: () => this.save(),
                              text: "FinalOK代用",
                            name: "preservation",
                            position: "center",
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
                            compKey: "productionLine",
                            labelName: "生产线",
                            codeField: "productionLine",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                              span: 4,
                            options: [],
                        },
                        {
                            compKey: "searchKey",
                            labelName: "查询KEY",
                            codeField: "searchKey",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            span: 4,
                            options: [],
                            change: () => (this.formField.queryCode = []),
                          },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            labelName: "",
                            component: () => import("@/components/org/tag"),
                            isMust: true,
                              span: 8,
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
                            prop: "no",
                            label: "管理号",
                            align: "center",
                            isComponent: true,
                              comps: [
                                {
                                    compKey: "compKey_no",
                                    codeField: "no",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                },
                            ],
                        },
                        {
                            prop: "engineNo",
                            label: "发动机编号/Motor No",
                            align: "center",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_engineNo",
                                    codeField: "engineNo",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                },
                              ],
                        },
                        {
                              prop: "motorNo",
                            label: "Motor No",
                            align: "center",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_motorNo",
                                    codeField: "motorNo",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                      clearable: true, // 是否可清除
                                },
                            ],
                        },
                        {
                            prop: "completeDay",
                            label: "完成检查日(YYMMDD)",
                              align: "center",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_completeDay",
                                    codeField: "completeDay",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                      type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                },
                            ],
                        },
                        {
                            prop: "navigationId",
                            label: "导航ID",
                            align: "center",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_navigationId",
                                    codeField: "navigationId",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                },
                            ],
                        },
                        {
                            prop: "ignitionKey",
                            label: "打火钥匙",
                            align: "center",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_ignitionKey",
                                    codeField: "ignitionKey",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                },
                            ],
                        },
                        {
                            prop: "result",
                            label: "处理信息结果",
                            align: "center",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                    productionLine: "1",
                    searchKey: "1",
                    searchValue: ["999100004"],
                    dataCode: "wmDbFunctionStrategyFindAll",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            resultField: {
                result: "601",
            },
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.result = val.no;
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.tableComponents[1].options.push(
                ...[
                    {
                        lookupValueName: "1",
                        lookupValueCode: "1",
                    },
                ]
            );
            this.tableComponents[2].options.push(
                ...[
                    {
                        lookupValueName: "管理号",
                        lookupValueCode: "1",
                    },
                    {
                        lookupValueName: "VIN码",
                        lookupValueCode: "2",
                    },
                ]
            );
            this.$refs["multipleTable"].pageTotal = 1;
            this.$refs["multipleTable"].list.push(
                ...[
                    {
                        index: 0,
                        no: "999100004",
                        engineNo: "",
                        motorNo: "",
                        completeDay: "",
                        navigationId: "",
                        ignitionKey: "",
                        result: "车辆区域错误",
                    },
                ]
            );
        });
    },
    methods: {
        handleTableRowDbClick(val) {
            console.log("double click");
        },
        queryData() {
            this.queryTable(1);
        },
        handleBlur(name, value) {
            console.log("handleBlur", name, value);
            var zg = /^[0-9]*$/;
            if (
                name === "passingDay" &&
                (!zg.test(value) || value.length < 6)
            ) {
                this.$utils.message({
                    message: "请输入六位正整数",
                });
                this.$refs["multipleTable"].list.forEach((item) => {
                    if (item[name] === value) item[name] = "";
                });
            }
            if (
                name === "passingTime" &&
                (!zg.test(value) || value.length < 4)
            ) {
                this.$utils.message({
                    message: "请输入四位正整数",
                });
                this.$refs["multipleTable"].list.forEach((item) => {
                    if (item[name] === value) item[name] = "";
                });
            }
        },
        save() {},
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/finalOkAlternative/finalOkAlternative.scss";
</style>
