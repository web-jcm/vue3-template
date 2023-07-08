<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-api-config="apiConfig"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :stripe="false"
            :dynamicRowStyle="setRowstyle"
        >
        </n-data-table>
    </div>
</template>
<script>
import { mesApis } from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "productingReport",
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
            apiConfig: mesApis.queryProductingReport,
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
                            prop: "BASE_MODEL",
                            label: "车系",
                        },
                        {
                            prop: "BODY",
                            label: "焊装",
                        },
                        {
                            prop: "PAINT",
                            label: "涂装",
                        },
                        {
                            prop: "TRIM",
                            label: "总装",
                          },
                        {
                            prop: "FINAL",
                            label: "最终工序",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        setRowstyle(e) {
            if (e.row.BASE_MODEL === "实际在制") {
                return {
                    background: "pink",
                };
            } else if (e.row.BASE_MODEL === "标准在制") {
                return {
                    background: "greenyellow",
                };
            } else if (e.row.BASE_MODEL === "在制差异") {
                return {
                    background: "khaki",
                };
            }
        },
    },
};
</script>
<style lang="scss" scoped></style>
