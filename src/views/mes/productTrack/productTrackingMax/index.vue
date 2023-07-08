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
            @inputblur="handleBlur"
        >
        </n-data-table>
    </div>
</template>
<script>
import { mesApis, saveTrackingMax } from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "productTrackingMax",
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
            apiConfig: mesApis.queryTrackingMax,
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
                    .tableComponents.length >
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                          .tableComponents
                    : [
                        {
                            compKey: "plantCode",
                            labelName: "工厂名称",
                            codeField: "plantCode",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () => import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
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
                            prop: "zoneCode",
                              label: "区ID",
                        },
                        {
                              prop: "zoneName",
                            label: "区名称",
                        },
                          {
                            prop: "maxOnhand",
                            label: "设备最大值",
                              isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_maxOnhand",
                                    codeField: "maxOnhand",
                                    component: () => import("@/components/org/commonInput"),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                    dataToObject: { maxLength: 8 },
                                  },
                            ],
                        },
                        {
                            prop: "stdOnhand",
                            label: "标准在制",
                            isComponent: true,
                            comps: [
                                {
                                    compKey: "compKey_stdOnhand",
                                    codeField: "stdOnhand",
                                    component: () => import("@/components/org/commonInput"),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    disabled: false,
                                    clearable: true, // 是否可清除
                                    dataToObject: { maxLength: 8 },
                                },
                            ],
                        },
                        {
                              prop: "fNum",
                            label: "现在在制",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                    isVisual: "1",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            changeRow: [],
        };
    },
    watch: {
        "formField.plantCode": function () {
            this.changeRow = [];
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        search() {
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
                saveTrackingMax({
                    plantCode: this.formField.plantCode,
                    rows: this.changeRow,
                })
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
        handleTableRowDbClick(val) {
            console.log("double click");
        },
        queryData() {
            this.queryTable(1);
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
@import "@/styles/mes/productTrackingMax/productTrackingMax.scss";
</style>
