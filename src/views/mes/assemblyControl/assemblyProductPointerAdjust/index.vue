<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :infoComponents="infoComponents"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
        </n-data-table>
        <indicateAdjust
            :plantCode="formField.PLANT_CODE"
            :lineNo="formField.LINE_NO"
            :subLineNo="clickRowsData.SUB_LINE_NO"
            :serialNo="clickRowsData.SERIAL_NO"
            v-if="showTable"
            @close="dialogClose"
        />
    </div>
</template>
<script>
import { querySubline, queryLineNo } from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "assemblyProductPointerAdjust",
    components: {
        indicateAdjust: () => import("./indicateAdjust"),
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
                            prop: "SUB_LINE_NO",
                            label: "生产线编号",
                        },
                        {
                            prop: "SUB_LINE_NAME",
                            label: "生产线名",
                        },
                        {
                            prop: "SERIAL_NO",
                            label: "总装连续编号",
                        },
                        {
                            prop: "LAST_OUT_TIME",
                              label: "时间",
                        },
                    ],
            infoComponents: [
                {
                    compKey: "isAllLine",
                    labelName: "查询模式",
                    codeField: "isAllLine",
                    component: () => import("@/components/org/radioBox"),
                    isComponent: true,
                    options: [
                        {
                            label: "全部生产线",
                            value: "0",
                        },
                        {
                            label: "指定生产线",
                            value: "1",
                        },
                    ],
                },
                {
                    compKey: "searchTime",
                    labelName: "更新时间",
                    codeField: "searchTime",
                    isComponent: true,
                    clearable: false,
                    component: () => import("@/components/org/commonInput"),
                },
            ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    Line_NO: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            resultField: {
                isAllLine: "0",
                searchTime: 30,
            },
            showTable: false,
            timer: null,
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLineNo();
        },
        "resultField.searchTime": function () {
            clearInterval(this.timer);
            if (this.resultField.searchTime > 0) {
                this.timer = setInterval(
                    () => this.queryTable(1),
                    this.resultField.searchTime * 1000
                );
            }
        },
        "resultField.isAllLine": function (val) {
            if (val === "0") {
                if (this.resultField.searchTime > 0) {
                    this.timer = setInterval(
                        () => this.search(),
                        this.resultField.searchTime * 1000
                    );
                }
            } else {
                clearInterval(this.timer);
            }
        },
    },
    created() {
        if (this.resultField.searchTime > 0) {
            this.timer = setInterval(
                () => this.search(),
                this.resultField.searchTime * 1000
            );
        }
    },
    methods: {
        queryLineNo() {
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.LINE_NO = res.rows[0].LINE_NO;
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
            if (this.resultField.isAllLine === "1") {
                if (this.clickRowsData.SUB_LINE_NO) {
                    this.showTable = true;
                } else {
                    this.$utils.message({
                        message: "请选择生产线！",
                    });
                }
            } else {
                this.querySubline();
            }
        },
        querySubline() {
            this.$refs.multipleTable.list = [];
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            querySubline({
                PLANT_CODE: this.formField.PLANT_CODE,
                LINE_NO: this.formField.LINE_NO,
                PROCESS_LOCATION: "T",
            })
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        this.$refs.multipleTable.list = res.rows;
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
        dialogClose() {
            this.showTable = false;
            this.querySubline();
        },
    },
    deactivated() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
};
</script>
<style lang="scss" scoped></style>
