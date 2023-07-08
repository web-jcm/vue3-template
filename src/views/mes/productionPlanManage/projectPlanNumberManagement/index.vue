<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            @inputblur="handleBlur"
            @closeTag="closeTag"
            class="table_style"
        />
    </div>
</template>
<script>
import Vue from "vue";
import {
    queryPlanningDesks,
    queryPlanningDesksDownBox,
    savePlanningDesks,
    queryLookupValues,
} from "@/api/apiList/mes";

export default {
    name: "projectPlanNumberManagement",
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
        // const thatObj = this
        return {
            keyPrefix: "",
            dialogVisible: false,
            // 网格查询API配置对象
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
                            position: "right",
                        },
                        {
                            //保存
                            compKey: "btnKey_save",
                              type: "",
                            size: "small",
                            name: "preservation",
                            position: "right",
                            disabled: false,
                            clickEvent: () => this.save(),
                            text: this.$t("org.label.save"),
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
                            span: 5,
                        },
                        {
                            compKey: "processCode",
                            labelName: "工程名称",
                            codeField: "processCode",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            clearable: false,
                            isRequire: true,
                            span: 5,
                            options: [],
                        },
                        {
                            compKey: "statisticalType",
                            labelName: "统计类型",
                            codeField: "statisticalType",
                            component: () => import("@/components/cascader"),
                            isMust: true,
                            span: 5,
                            options: [],
                            change: (e) => this.cascaderChange(e),
                        },
                        {
                            compKey: "statisArr",
                            codeField: "statisArr",
                            labelName: "",
                            component: () => import("@/components/org/tag"),
                            isMust: true,
                            isAdd: false,
                            span: 8,
                        },
                        {
                            compKey: "dateFormat",
                            labelName: "年月",
                            codeField: "dateFormat",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/datePicker"
                                ),
                            dateType: "month",
                            isMust: false,
                            clearable: false,
                            isRequire: true,
                            span: 5,
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
                            prop: "workDate",
                            label: "日期",
                        },
                        {
                            prop: "weekDay",
                            label: "星期",
                        },
                        {
                            prop: "sPlanVol1",
                            label: "1班生产计划台数",
                            noShowTooltip: true,
                            isComponent: true,
                            comps: [
                                {
                                      compKey: "compKey_sPlanVol1",
                                    codeField: "sPlanVol1",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput/numberInp"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: true,
                                    clearable: true, // 是否可清除
                                },
                            ],
                        },
                          {
                            prop: "sPlanVol2",
                              label: "2班生产计划台数",
                            noShowTooltip: true,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_sPlanVol2",
                                    codeField: "sPlanVol2",
                                      component: () =>
                                        import(
                                            "@/components/org/commonInput/numberInp"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: true,
                                    clearable: true, // 是否可清除
                                  },
                            ],
                        },
                        {
                            prop: "sPlanVol3",
                            label: "3班生产计划台数",
                            noShowTooltip: true,
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_sPlanVol3",
                                    codeField: "sPlanVol3",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput/numberInp"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: true,
                                    clearable: true, // 是否可清除
                                },
                            ],
                        },
                        {
                            prop: "sAchvVol1",
                            label: "1班生产实绩台数",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                {
                                    compKey: "compKey_sAchvVol1",
                                    codeField: "sAchvVol1",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput/numberInp"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: true,
                                    clearable: true, // 是否可清除
                                },
                            ],
                        },
                        {
                            prop: "sAchvVol2",
                            label: "2班生产实绩台数",
                            isComponent: true,
                              noShowTooltip: true,
                            comps: [
                                {
                                    compKey: "compKey_sAchvVol2",
                                    codeField: "sAchvVol2",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput/numberInp"
                                        ),
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: true,
                                    clearable: true, // 是否可清除
                                },
                              ],
                        },
                        {
                            prop: "sAchvVol3",
                            label: "3班生产实绩台数",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                  {
                                    compKey: "compKey_sAchvVol3",
                                    codeField: "sAchvVol3",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput/numberInp"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: true,
                                    clearable: true, // 是否可清除
                                  },
                            ],
                        },
                    ],
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                    processCode: "",
                    statisticalType: [],
                    statisArr: [],
                    dateFormat: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            changeRow: [],
            isDisabled: true,
        };
    },
    watch: {
        "formField.plantCode": function () {
            this.queryProcess();
            this.queryType();
        },
    },
    async created() {
        this.formField.dateFormat =
            new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
    },
    provide() {
        return {
            getChilds: (node, resolve) => {
                this.queryPlanningDesksDownBox(node, resolve);
            },
        };
    },
    methods: {
        queryProcess() {
            queryLookupValues({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "PROCESS_CODE_PLAN",
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows.length) {
                            this.tableComponents[1].options = res.rows;
                            res.rows.forEach((item) => {
                                if (item.LOOKUP_VALUE_NAME === "总装下线") {
                                    this.formField.processCode =
                                        item.LOOKUP_VALUE_CODE;
                                }
                            });
                            if (!this.formField.processCode) {
                                this.formField.processCode =
                                    res.rows[0].LOOKUP_VALUE_CODE;
                            }
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
        queryType() {
            queryLookupValues({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "CAR_COUNT_TYPE",
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableComponents[2].options = [];
                        res.rows.forEach((item) => {
                            this.tableComponents[2].options.push({
                                label: item.LOOKUP_VALUE_NAME,
                                value: item.REMARK,
                                disabled: false,
                            });
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
        cascaderChange(e) {
            if (e.length > 1) {
                this.tableComponents[2].options.forEach((item) => {
                    if (item.value === e[0]) {
                        this.formField.statisArr.push(`${item.label}/${e[1]}`);
                        item.disabled = true;
                    }
                });
            }
            this.formField.statisticalType = [];
        },
        reset() {
            this.formField.plantCode = "";
            this.formField.processCode = "";
            this.formField.statisticalType = [];
            this.formField.statisArr = [];
            this.formField.dateFormat =
                new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
            this.tableComponents[2].options.forEach((item) => {
                item.disabled = false;
            });
        },
        closeTag() {
            this.tableComponents[2].options.forEach((item) => {
                item.disabled = false;
                this.formField.statisArr.forEach((sel) => {
                    let name = sel.split("/")[0];
                    if (item.label === name) {
                        item.disabled = true;
                    }
                });
            });
            if (this.formField.statisArr.length < 5) this.isDisabled = true;
            this.formField.statisticalType = [];
        },
        search() {
            if (!this.formField.processCode) {
                return this.$utils.message({
                    message: "工程不能为空!",
                });
            }
            let pram = {
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                processCode: this.formField.processCode,
                dateFormat: this.formField.dateFormat,
            };
            this.formField.statisArr.forEach((item) => {
                let name = item.split("/")[0];
                let value = item.split("/")[1];
                this.tableComponents[2].options.some((sel) => {
                    if (sel.label === name) {
                        pram[sel.value] = value;
                        return true;
                    }
                });
            });
            this.isDisabled = true;
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryPlanningDesks(pram)
                .then((res) => {
                    this.$refs.multipleTable.list = [];
                    this.changeRow = [];
                    if (res.result === "1" && res.rows?.rows?.length) {
                        if (
                            this.formField.statisArr.length ===
                            this.tableComponents[2].options.length
                        ) {
                            //先控制是否可以修改保存
                            this.isDisabled = false;
                        }
                        this.tableCols.forEach((item) => {
                            if (item.isComponent)
                                item.comps[0].disabled = this.isDisabled;
                        });
                        res.rows.rows.forEach((item) => {
                            item.weekDay = this.$utils.getWeekDay(item.wDay);
                            this.$refs.multipleTable.list.push(item);
                        });
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.$refs.multipleTable.list = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        queryPlanningDesksDownBox(node, resolve) {
            let pram = {
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                columns: node.value,
            };
            this.formField.statisArr.forEach((item) => {
                let name = item.split("/")[0];
                let value = item.split("/")[1];
                this.tableComponents[2].options.some((sel) => {
                    if (sel.label === name) {
                        pram[sel.value] = value;
                        return true;
                    }
                });
            });
            queryPlanningDesksDownBox(pram)
                .then((res) => {
                    if (res.result === "1") {
                        let nodes = [];
                        res.rows.rows.forEach((item) => {
                            nodes.push({
                                label: item[node.value],
                                value: item[node.value],
                                leaf: node.level >= 1,
                            });
                        });
                        resolve(nodes);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        save() {
            if (this.isDisabled) {
                return this.$utils.message({
                    message: "统计类型未选满无法保存！",
                });
            }
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = {
                    plantCode: this.formField.plantCode,
                    processCode: this.formField.processCode,
                    dateFormat: this.formField.dateFormat,
                };
                this.formField.statisArr.forEach((item) => {
                    let name = item.split("/")[0];
                    let value = item.split("/")[1];
                    this.tableComponents[2].options.some((sel) => {
                        if (sel.label === name) {
                            pram[sel.value] = value;
                            return true;
                        }
                    });
                });
                pram.rows = this.changeRow;
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                savePlanningDesks(pram)
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
        handleBlur(name, value, row) {
            if (this.changeRow.length) {
                let flag = true;
                this.changeRow.forEach((item) => {
                    if (item.workDate === row.workDate) {
                        item = row;
                        flag = false;
                    }
                });
                if (flag) {
                    this.changeRow.push(row);
                }
            } else {
                this.changeRow.push(row);
            }
        },
    },
};
</script>
