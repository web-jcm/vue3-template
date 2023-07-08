<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            @inputblur="handleBlur"
        >
        </n-data-table>
    </div>
</template>
<script>
import {
    mesApis,
    queryManageData,
    saveManageData,
    queryLookupValues,
} from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "manageDataAdjust",
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
            apiConfig: mesApis.queryManageData,
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
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => this.save(),
                            text: this.$t("sys.button.save"),
                            name: "preservation",
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
                            compKey: "queryType",
                            labelName: "查询KEY",
                            codeField: "queryType",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            span: 4,
                            options: [],
                            change: () => (this.formField.queryCode = []),
                        },
                        {
                            compKey: "queryCode",
                            codeField: "queryCode",
                              labelName: "",
                            component: () => import("@/components/org/tag"),
                            isMust: true,
                              span: 10,
                        },
                    ],
            infoComponents: [
                {
                    compKey: "y1",
                    labelName: "Y1···车体OK禁止(0:正常、1:NG)",
                    style: { width: "18%", padding: "2px 4px" },
                },
                {
                    compKey: "y2",
                    labelName: "Y2···涂装OK禁止(0:正常、1:NG)",
                    style: { width: "18%", padding: "2px 4px" },
                },
                {
                    compKey: "y3",
                    labelName: "Y3···总装投入禁止(0:正常、1:NG)",
                    style: { width: "18%", padding: "2px 4px" },
                },
                {
                    compKey: "y4",
                    labelName: "Y4···最终工序OK禁止(0:正常、1:NG)",
                    style: { width: "18%", padding: "2px 4px" },
                },
                {
                    compKey: "y5",
                    labelName:
                        "Y5···无实绩送信标志(非生产车Mark(0:送信、1、2:不送信))",
                    style: { width: "28%", padding: "2px 4px" },
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
                            label: "管理号",
                        },
                        //   {
                        //       prop: "result",
                        //       label: "结果",
                          //   },
                        {
                            prop: "model",
                            label: "车型",
                        },
                        {
                            prop: "doukiNo",
                            label: "同期编号",
                          },
                        {
                            prop: "lineF",
                            label: "总装线",
                        },
                        {
                            prop: "trimSerialNo",
                            label: "总装连续编号",
                            isComponent: true,
                              comps: [
                                {
                                    compKey: "compKey_trimSerialNo",
                                    codeField: "trimSerialNo",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: false,
                                    dataToObject: { maxLength: 10 },
                                },
                            ],
                        },
                        {
                            prop: "y1",
                            label: "Y1",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_y1",
                                    codeField: "y1",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: false,
                                    dataToObject: { maxLength: 1 },
                                },
                            ],
                        },
                        {
                            prop: "y2",
                            label: "Y2",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_y2",
                                    codeField: "y2",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: false,
                                    dataToObject: { maxLength: 1 },
                                },
                            ],
                        },
                        {
                            prop: "y3",
                            label: "Y3",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_y3",
                                    codeField: "y3",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: false,
                                    dataToObject: { maxLength: 1 },
                                },
                            ],
                        },
                        {
                            prop: "y4",
                            label: "Y4",
                            isComponent: true,
                              comps: [
                                {
                                    compKey: "compKey_y4",
                                    codeField: "y4",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: false,
                                    dataToObject: { maxLength: 1 },
                                },
                            ],
                        },
                        {
                            prop: "y5",
                            label: "Y5",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_y5",
                                    codeField: "y5",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: false,
                                    dataToObject: { maxLength: 1 },
                                },
                              ],
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                    queryType: "",
                    queryCode: [],
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            changeRow: [],
        };
    },
    watch: {
        "formField.plantCode": function () {
            this.queryLookupValues("QUERY_TYPE");
        },
    },
    methods: {
        search() {
            if (!this.formField.queryType || !this.formField.queryCode.length) {
                return this.$utils.message({
                    message: "查询值不能为空!",
                });
            }
            this.tableComponents[1].options.forEach((item) => {
                if (item.LOOKUP_VALUE_CODE === this.formField.queryType) {
                    this.formField[item.LOOKUP_VALUE_CODE] =
                        this.formField.queryCode.join(",");
                } else {
                    this.formField[item.LOOKUP_VALUE_CODE] = "";
                }
            });
            this.changeRow = [];
            this.queryTable(1);
        },
        save() {
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                let pram = this.formField;
                pram[pram.queryType] = pram.queryCode.join(",");
                pram.rows = this.changeRow;
                saveManageData(pram)
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
        queryLookupValues(type) {
            queryLookupValues({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.queryType =
                            res.rows[0].LOOKUP_VALUE_CODE;
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
        handleTableRowDbClick(val) {
            console.log("double click");
        },
        reset() {
            this.formField.plantCode = "";
            this.formField.queryType = "";
            this.formField.queryCode = [];
        },
        handleBlur(name, value, row) {
            if (!/^\d+$/.test(value)) {
                this.$utils.message({
                    message: "请输入整数!",
                });
                row[name] = "";
            }
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
<style lang="scss" scoped>
@import "@/styles/mes/manageDataAdjust/manageDataAdjust.scss";
</style>
