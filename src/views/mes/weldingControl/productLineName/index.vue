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
            <div class="flex title">
                <div class="flex width25">
                    <div class="index">No</div>
                    <div class="name">生产线名</div>
                </div>
                <div class="flex width25">
                    <div class="index">No</div>
                    <div class="name">生产线名</div>
                </div>
                <div class="flex width25">
                    <div class="index">No</div>
                    <div class="name">生产线名</div>
                </div>
                <div class="flex width25">
                    <div class="index">No</div>
                    <div class="name">生产线名</div>
                </div>
            </div>
            <div class="flex border">
                <div
                    class="flex width25"
                    v-for="item in formList"
                    :key="item.SUB_LINE_NO"
                >
                    <div class="index">{{ item.SUB_LINE_NO }}</div>
                    <el-input v-model="item.SUB_LINE_NAME"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { queryLineNo, querySubline, saveSublineName } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "productLineName",
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
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length >
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableButtons
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
                            compKey: "PLANT_CODE",
                              labelName: "工厂名称",
                            codeField: "PLANT_CODE",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () => import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
                        },
                        {
                            compKey: "LINE_NO",
                            labelName: "生产线",
                            codeField: "LINE_NO",
                            oFields: "LINE_NO,LINE_NAME",
                            component: () => import("@/components/org/LookupValue"),
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
                    : [],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    PROCESS_LOCATION: "M",
                    LINE_NO: "",
                    ORDER_BY: "1",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            formList: [],
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
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            querySubline(this.formField)
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        this.formList = res.rows;
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
        save() {
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = {
                    PLANT_CODE: this.formField.PLANT_CODE,
                    LINE_NO: this.formField.LINE_NO,
                    PROCESS_LOCATION: this.formField.PROCESS_LOCATION,
                    ROWS: this.formList,
                };
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveSublineName(pram)
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "1") {
                            this.search();
                        }
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productLineName/productLineName.scss";
</style>
