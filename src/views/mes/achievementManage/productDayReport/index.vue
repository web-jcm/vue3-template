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
        >
        </n-data-table>
        <div class="contain">
            <div class="flex">
                <div class="name shrink0">车间</div>
                <div class="name width23">焊装车间</div>
                <div class="name width23">涂装车间</div>
                <div class="name width23">总装车间</div>
                <div class="name width23">报交入库</div>
            </div>
            <div class="flex">
                <div class="shrink0">
                    <div class="name">车系</div>
                    <div class="name">日计划</div>
                    <div class="name">日实绩</div>
                    <div class="name">日差异</div>
                    <div class="name">日达成率</div>
                    <div class="name">月累计划</div>
                    <div class="name">月累实绩</div>
                    <div class="name">月累差异</div>
                    <div class="name">月累达成率</div>
                </div>
                <div class="width23 flex">
                    <div
                        :class="item.FORM_NAME === '合计' ? 'total' : 'single'"
                        v-for="(item, index) in formList.M"
                        :key="index"
                    >
                        <div class="name" :title="item.FORM_NAME">
                            {{ item.FORM_NAME }}
                        </div>
                        <div class="item" :title="item.S_PLAN_VOL">
                            {{ item.S_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.S_ACHV_VOL">
                            {{ item.S_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_VOL">
                            {{ item.DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_RATE">
                            {{ item.DIFF_RATE }}
                        </div>
                        <div class="item" :title="item.M_PLAN_VOL">
                            {{ item.M_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.M_ACHV_VOL">
                            {{ item.M_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_VOL">
                            {{ item.MONTH_DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_RATE">
                            {{ item.MONTH_DIFF_RATE }}
                        </div>
                    </div>
                </div>
                <div class="width23 flex">
                    <div
                        :class="item.FORM_NAME === '合计' ? 'total' : 'single'"
                        v-for="(item, index) in formList.P"
                        :key="index"
                    >
                        <div class="name" :title="item.FORM_NAME">
                            {{ item.FORM_NAME }}
                        </div>
                        <div class="item" :title="item.S_PLAN_VOL">
                            {{ item.S_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.S_ACHV_VOL">
                            {{ item.S_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_VOL">
                            {{ item.DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_RATE">
                            {{ item.DIFF_RATE }}
                        </div>
                        <div class="item" :title="item.M_PLAN_VOL">
                            {{ item.M_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.M_ACHV_VOL">
                            {{ item.M_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_VOL">
                            {{ item.MONTH_DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_RATE">
                            {{ item.MONTH_DIFF_RATE }}
                        </div>
                    </div>
                </div>
                <div class="width23 flex">
                    <div
                        :class="item.FORM_NAME === '合计' ? 'total' : 'single'"
                        v-for="(item, index) in formList.T"
                        :key="index"
                    >
                        <div class="name" :title="item.FORM_NAME">
                            {{ item.FORM_NAME }}
                        </div>
                        <div class="item" :title="item.S_PLAN_VOL">
                            {{ item.S_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.S_ACHV_VOL">
                            {{ item.S_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_VOL">
                            {{ item.DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_RATE">
                            {{ item.DIFF_RATE }}
                        </div>
                        <div class="item" :title="item.M_PLAN_VOL">
                            {{ item.M_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.M_ACHV_VOL">
                            {{ item.M_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_VOL">
                            {{ item.MONTH_DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_RATE">
                            {{ item.MONTH_DIFF_RATE }}
                        </div>
                    </div>
                </div>
                <div class="width23 flex">
                    <div
                        :class="item.FORM_NAME === '合计' ? 'total' : 'single'"
                        v-for="(item, index) in formList.F"
                        :key="index"
                    >
                        <div class="name" :title="item.FORM_NAME">
                            {{ item.FORM_NAME }}
                        </div>
                        <div class="item" :title="item.S_PLAN_VOL">
                            {{ item.S_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.S_ACHV_VOL">
                            {{ item.S_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_VOL">
                            {{ item.DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.DIFF_RATE">
                            {{ item.DIFF_RATE }}
                        </div>
                        <div class="item" :title="item.M_PLAN_VOL">
                            {{ item.M_PLAN_VOL }}
                        </div>
                        <div class="item" :title="item.M_ACHV_VOL">
                            {{ item.M_ACHV_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_VOL">
                            {{ item.MONTH_DIFF_VOL }}
                        </div>
                        <div class="item" :title="item.MONTH_DIFF_RATE">
                            {{ item.MONTH_DIFF_RATE }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { queryProductDayReport, queryLookupValues } from "@/api/apiList/mes";
import Vue from "vue";
import Moment from "moment";

export default {
    name: "productDayReport",
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
                            compKey: "WORK_DATE",
                            labelName: "年月日",
                            codeField: "WORK_DATE",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/datePicker"
                                ),
                            type: "datePicker",
                              isMust: true,
                            isRequire: true,
                        },
                        {
                            compKey: "SHIFT",
                            labelName: "班次",
                            codeField: "SHIFT",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
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
                    : [],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    SHIFT: "",
                    WORK_DATE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            formList: {},
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
            this.$nextTick(() => this.search());
        },
    },
    created() {
        this.formField.WORK_DATE = new Date();
    },
    methods: {
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "SHIFT",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[2].options = res.rows;
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
            if (!this.formField.WORK_DATE) {
                return this.$utils.message({
                    message: "请选择时间！",
                });
            }
            this.formList = {};
            this.queryProductDayReport();
        },
        queryProductDayReport() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryProductDayReport({
                PLANT_CODE: this.formField.PLANT_CODE,
                SHIFT: this.formField.SHIFT,
                WORK_DATE: Moment(this.formField.WORK_DATE).format(
                    "YYYY-MM-DD"
                ),
            })
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        this.$set(
                            this.formList,
                            "M",
                            this.getSum(res.rows[0].M)
                        );
                        this.$set(
                            this.formList,
                            "P",
                            this.getSum(res.rows[0].P)
                        );
                        this.$set(
                            this.formList,
                            "T",
                            this.getSum(res.rows[0].T)
                        );
                        this.$set(
                            this.formList,
                            "F",
                            this.getSum(res.rows[0].F)
                        );
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
        getSum(arr) {
            let obj = {
                FORM_NAME: "合计",
                S_PLAN_VOL: 0,
                S_ACHV_VOL: 0,
                DIFF_VOL: 0,
                DIFF_RATE: 0,
                M_PLAN_VOL: 0,
                M_ACHV_VOL: 0,
                MONTH_DIFF_VOL: 0,
                MONTH_DIFF_RATE: 0,
            };
            arr.forEach((item) => {
                obj.S_PLAN_VOL += item.S_PLAN_VOL;
                obj.S_ACHV_VOL += item.S_ACHV_VOL;
                obj.DIFF_VOL += item.DIFF_VOL;
                obj.DIFF_RATE += item.DIFF_RATE;
                obj.M_PLAN_VOL += item.M_PLAN_VOL;
                obj.M_ACHV_VOL += item.M_ACHV_VOL;
                obj.MONTH_DIFF_VOL += item.MONTH_DIFF_VOL;
                obj.MONTH_DIFF_RATE += item.MONTH_DIFF_RATE;
            });
            arr.push(obj);
            arr.forEach((item) => {
                item.DIFF_RATE = (item.DIFF_RATE * 100).toFixed(2) + "%";
                item.MONTH_DIFF_RATE =
                    (item.MONTH_DIFF_RATE * 100).toFixed(2) + "%";
            });
            return arr;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productDayReport/productDayReport.scss";
</style>
