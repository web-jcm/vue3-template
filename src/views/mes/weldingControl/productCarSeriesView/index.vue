<template>
    <div class="app-container app-container-table">
        <one-table-columns
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
            :dynamicIsFixIndex="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
        </one-table-columns>
    </div>
</template>
<script>
import { mesApis, queryLineNo } from "@/api/apiList/mes";
import OneTableColumns from "@/components/templates/oneTableColumns";
import Vue from "vue";

export default {
    name: "productCarSeriesView",
    components: {
        OneTableColumns,
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
            // 网格查询API配置对象
            apiConfig: mesApis.queryProductCarSeriesView,
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
                            compKey: "LINE_NO",
                            labelName: "生产线",
                            codeField: "LINE_NO",
                            oFields: "LINE_NO,LINE_NAME",
                            component: () =>
                                import("@/components/org/LookupValue"),
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
                            prop: "SUB_LINE_NO",
                            label: "生产线No",
                        },
                        {
                              prop: "SUB_LINE_NAME",
                            label: "生产线名",
                            width: 200,
                        },
                        {
                            prop: "carName",
                            label: "生产车系",
                            children: [
                                { prop: "0", label: "0", width: 50 },
                                { prop: "1", label: "1", width: 50 },
                                { prop: "2", label: "2", width: 50 },
                                { prop: "3", label: "3", width: 50 },
                                { prop: "4", label: "4", width: 50 },
                                { prop: "5", label: "5", width: 50 },
                                { prop: "6", label: "6", width: 50 },
                                { prop: "7", label: "7", width: 50 },
                                { prop: "8", label: "8", width: 50 },
                                { prop: "9", label: "9", width: 50 },
                                { prop: "A", label: "A", width: 50 },
                                { prop: "B", label: "B", width: 50 },
                                { prop: "C", label: "C", width: 50 },
                                { prop: "D", label: "D", width: 50 },
                                { prop: "E", label: "E", width: 50 },
                                { prop: "F", label: "F", width: 50 },
                                { prop: "G", label: "G", width: 50 },
                                { prop: "H", label: "H", width: 50 },
                                { prop: "I", label: "I", width: 50 },
                                { prop: "J", label: "J", width: 50 },
                                { prop: "K", label: "K", width: 50 },
                                { prop: "L", label: "L", width: 50 },
                                { prop: "M", label: "M", width: 50 },
                                { prop: "N", label: "N", width: 50 },
                                { prop: "O", label: "O", width: 50 },
                                { prop: "P", label: "P", width: 50 },
                                { prop: "Q", label: "Q", width: 50 },
                                { prop: "R", label: "R", width: 50 },
                                { prop: "S", label: "S", width: 50 },
                                { prop: "T", label: "T", width: 50 },
                                { prop: "U", label: "U", width: 50 },
                                { prop: "V", label: "V", width: 50 },
                                { prop: "W", label: "W", width: 50 },
                                { prop: "X", label: "X", width: 50 },
                                { prop: "Y", label: "Y", width: 50 },
                                { prop: "Z", label: "Z", width: 50 },
                              ],
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    LINE_NO: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
        };
    },
    watch: {
        "formField.LINE_NO": function () {
            this.search();
        },
        "formField.PLANT_CODE": function () {
            this.queryLineNo();
        },
    },
    methods: {
        queryLineNo() {
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.tableComponents[1].options = res.rows;
                            this.formField.LINE_NO = res.rows[0].LINE_NO;
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
        search() {
            this.queryTable();
        },
    },
};
</script>
<style lang="scss" scoped></style>
