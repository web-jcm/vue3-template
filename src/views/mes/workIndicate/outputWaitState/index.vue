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
        >
            <template v-slot:W_NUM="scope">
                <div>{{ `${scope.row.W_NUM} (${scope.row.N_NUM})` }}</div>
            </template>
            <template v-slot:N_NUM="scope">
                <el-progress
                    :stroke-width="28"
                    :percentage="
                        Number(scope.row.W_NUM) + Number(scope.row.N_NUM)
                    "
                    :color="
                        Number(scope.row.W_NUM) + Number(scope.row.N_NUM) <= 50
                            ? ''
                            : Number(scope.row.W_NUM) +
                                  Number(scope.row.N_NUM) <=
                              80
                            ? '#e6a23c'
                            : '#f56c6c'
                    "
                    :format="addNumber(scope.row)"
                ></el-progress>
            </template>
        </n-data-table>
    </div>
</template>
<script>
import { mesApis, queryWorkShopList } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "outputWaitState",
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
            apiConfig: mesApis.queryOutputWaitState,
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
                            compKey: "PROCESS_LOCATION",
                            labelName: "管理类型",
                            codeField: "PROCESS_LOCATION",
                            oFields: "PROCESS_LOCATION,PROCESS_LOCATION_NAME",
                            lookuptype: "_is_null_code_",
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
                            prop: "DEVICE_ID",
                            label: "接续设备ID",
                        },
                          {
                            prop: "DEVICE_NAME",
                            label: "接续设备名",
                        },
                        {
                            prop: "W_NUM",
                            label: "输出等待件数",
                            isSlot: true,
                        },

                        {
                            prop: "N_NUM",
                            label: "总件数",
                            isSlot: true,
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    PROCESS_LOCATION: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryWorkShopList();
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        queryWorkShopList() {
            queryWorkShopList({
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
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
            this.queryTable(1);
        },
        addNumber(row) {
            return () => Number(row.N_NUM) + Number(row.W_NUM);
        },
    },
};
</script>
<style lang="scss" scoped></style>
