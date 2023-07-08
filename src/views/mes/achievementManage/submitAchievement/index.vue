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
                              text: "实绩再送",
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
                            change: () => (this.formField.searchValue = []),
                          },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            labelName: "",
                            component: () => import("@/components/org/tag"),
                              isMust: true,
                            span: 10,
                        },
                        {
                            compKey: "engineering",
                              labelName: "工程",
                            codeField: "engineering",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
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
                            width: 100,
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
                            prop: "result",
                            label: "处理信息结果",
                            align: "center",
                            width: 100,
                        },
                        {
                            prop: "productionLineDif",
                              label: "生产线区分",
                            align: "center",
                            width: 100,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_productionLineDif",
                                      codeField: "productionLineDif",
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
                            prop: "trimId",
                            label: "Trim连续编号",
                            align: "center",
                            width: 100,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_trimId",
                                    codeField: "trimId",
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
                            prop: "downlineId",
                            label: "下线编号",
                              align: "center",
                            width: 100,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_downlineId",
                                    codeField: "downlineId",
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
                            prop: "type",
                            label: "车型",
                            align: "center",
                            width: 170,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_type",
                                    codeField: "type",
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
                            prop: "coloring",
                            label: "涂色",
                            align: "center",
                            width: 80,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_coloring",
                                    codeField: "coloring",
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
                            prop: "interior",
                            label: "内饰",
                            align: "center",
                            width: 80,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_interior",
                                    codeField: "interior",
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
                            prop: "engineType",
                            label: "发动机型式/Motor Type",
                            align: "center",
                            width: 140,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_engineType",
                                    codeField: "engineType",
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
                            prop: "engineNo",
                            label: "发动机编号/Motor No",
                            align: "center",
                            width: 130,
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
                            prop: "motorType",
                            label: "Motor Type",
                            align: "center",
                            width: 120,
                            isComponent: true,
                            comps: [
                                  {
                                    compKey: "compKey_motorType",
                                    codeField: "motorType",
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
                              width: 120,
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
                            prop: "faceToFace",
                            label: "面向地",
                            align: "center",
                              width: 80,
                            isComponent: true,
                            comps: [
                                {
                                      compKey: "compKey_faceToFace",
                                    codeField: "faceToFace",
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
                            prop: "exNo",
                            label: "ExNo",
                            align: "center",
                            width: 80,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_exNo",
                                    codeField: "exNo",
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
                            prop: "passingDay",
                            label: "工程通过日(YYMMDD)",
                            align: "center",
                            width: 130,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_passingDay",
                                      codeField: "passingDay",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "number",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                      dataToObject: {
                                        maxLength: 6,
                                        minLength: 6,
                                    },
                                },
                            ],
                        },
                        {
                            prop: "passingClass",
                            label: "工程通过班",
                            align: "center",
                            width: 100,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_passingClass",
                                    codeField: "passingClass",
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
                            prop: "passingTime",
                            label: "工程通过时刻(HHMM)",
                            align: "center",
                            width: 130,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_passingTime",
                                    codeField: "passingTime",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                    dataToObject: { maxLength: 4 },
                                  },
                            ],
                        },
                        {
                            prop: "bodyNumber",
                            label: "车身号码",
                            align: "center",
                            width: 140,
                            isComponent: true,
                            comps: [
                                  {
                                    compKey: "compKey_bodyNumber",
                                    codeField: "bodyNumber",
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
                            width: 130,
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
                            prop: "area",
                            label: "区域",
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
                    engineering: "BE | SetUp",
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
        "formField.plantCode": function () {},
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
            this.tableComponents[4].options.push(
                ...[
                    {
                        lookupValueName: "BE | SetUp",
                        lookupValueCode: "1",
                    },
                    {
                        lookupValueName: "MO | Metal OK",
                        lookupValueCode: "2",
                    },
                    {
                        lookupValueName: "PA | PaintIn (前处理入口)",
                        lookupValueCode: "3",
                    },
                    {
                        lookupValueName: "PO | Paint OK",
                        lookupValueCode: "4",
                    },
                    {
                        lookupValueName: "PS | PBS Out",
                        lookupValueCode: "5",
                    },
                    {
                        lookupValueName: "10 | Offline",
                        lookupValueCode: "6",
                    },
                    {
                        lookupValueName: "20 | Final OK",
                        lookupValueCode: "7",
                    },
                ]
            );
            this.$refs["multipleTable"].pageTotal = 1;
            this.$refs["multipleTable"].list.push(
                ...[
                    {
                        index: 0,
                        no: "999100004",
                        result: "",
                        productionLineDif: "1111",
                        trimId: "101372",
                        downlineId: "101372",
                        type: "TDNALDW145UXA----A",
                        coloring: "QAB",
                        interior: "K",
                        engineType: "KR15",
                        engineNo: "",
                        motorType: "",
                        motorNo: "",
                        faceToFace: "PRC",
                        exNo: "",
                        passingDay: "112233",
                        passingClass: "",
                        passingTime: "1700",
                        bodyNumber: "LGBM26E85MW100004",
                        completeDay: "",
                        area: "S1L03",
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
@import "@/styles/mes/submitAchievement/submitAchievement.scss";
</style>
