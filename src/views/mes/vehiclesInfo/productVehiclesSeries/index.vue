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
            :isShowPagination="true"
            :isUsePathQuery="false"
        >
        </n-data-table>
        <el-dialog
            :visible="showDialog"
            v-dialogDrag
            :append-to-body="true"
            @close="showDialog = false"
        >
            <dialogHeader
                slot="title"
                title="修改生产车系"
                :style-type="$store.state.app.dialogType"
            />
            <div class="popup_wrap">
                <div class="flex">
                    <div class="flex width50">
                        <div class="label">车系</div>
                        <el-select v-model="BASE_MODEL">
                            <el-option
                                v-for="item in modelList"
                                :key="item.BASE_MODEL"
                                :label="item.BASE_MODEL"
                                :value="item.BASE_MODEL"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="flex width50">
                        <div class="label">生产车系</div>
                        <el-input
                            v-rule="'17'"
                            v-model="BODY_PRODUCT_CODE"
                        ></el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog_footer">
                    <el-button @click="save" type="primary">保存</el-button>
                    <el-button @click="showDialog = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mesApis, saveBodyProductCode, queryCarModel } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "productVehiclesSeries",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
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
            apiConfig: mesApis.queryCarModel,
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
                        },
                        {
                            compKey: "btnKey_edit",
                            size: "small",
                            clickEvent: () => this.edit(),
                            text: "修改生产车系",
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
                            span: 4,
                        },
                        {
                            compKey: "MODEL",
                            labelName: "车型",
                            codeField: "MODEL",
                            component: () =>
                                import("@/components/org/commonInput"),
                              isMust: true,
                            rule: "13",
                        },
                        //   {
                        //       compKey: "COLOR_K",
                        //       labelName: "外饰色",
                        //       codeField: "COLOR_K",
                        //       component: () =>
                        //           import("@/components/org/commonInput"),
                          //       isMust: true,
                        //       rule: "15",
                        //   },
                        //   {
                        //       compKey: "COLOR_I",
                        //       labelName: "内饰色",
                        //       codeField: "COLOR_I",
                        //       component: () =>
                        //           import("@/components/org/commonInput"),
                          //       isMust: true,
                        //       rule: "16",
                        //   },
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
                            prop: "MODEL",
                            label: "车型",
                        },
                          {
                            prop: "BASE_MODEL",
                              label: "车系",
                        },
                        {
                            prop: "BODY_PRODUCT_CODE",
                            label: "生产车系",
                          },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    MODEL: "",
                    // COLOR_K: '',
                    // COLOR_I: '',
                    GROUP_BASE_MODEL: "3",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            showDialog: false,
            BASE_MODEL: "",
            BODY_PRODUCT_CODE: "",
            modelList: [],
            seriesRule: {},
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryCarModel();
            const params = sessionStorage.getItem("productVehiclesSeries");
            if (params) {
                this.formField.MODEL = JSON.parse(params).MODEL;
                // this.formField.COLOR_I = JSON.parse(params).COLOR_I
                // this.formField.COLOR_K = JSON.parse(params).COLOR_K
                sessionStorage.removeItem("productVehiclesSeries");
            }
            //不集成mp
            // if (this.$route.params.MODEL) {
            //     this.formField.MODEL = this.$route.params.MODEL;
            //     this.formField.COLOR_I = this.$route.params.COLOR_I;
            //     this.formField.COLOR_K = this.$route.params.COLOR_K;
            // }
            this.$nextTick(() => this.search());
        },
    },
    activated() {
        const params = sessionStorage.getItem("productVehiclesSeries");
        if (params) {
            this.formField.MODEL = JSON.parse(params).MODEL;
            // this.formField.COLOR_I = JSON.parse(params).COLOR_I
            // this.formField.COLOR_K = JSON.parse(params).COLOR_K
            this.search();
            sessionStorage.removeItem("productVehiclesSeries");
        }
        //不集成mp
        // if (this.$route.params.MODEL) {
        //     this.formField.MODEL = this.$route.params.MODEL;
        //     this.formField.COLOR_I = this.$route.params.COLOR_I;
        //     this.formField.COLOR_K = this.$route.params.COLOR_K;
        //     this.search();
        // }
    },
    methods: {
        search() {
            this.queryTable();
        },
        queryCarModel() {
            queryCarModel({
                PLANT_CODE: this.formField.PLANT_CODE,
                GROUP_BASE_MODEL: "1",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.modelList = res.rows;
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
        save() {
            // let seriesReg = new RegExp(this.seriesRule.ATT1);
            // if (!seriesReg.test(this.BODY_PRODUCT_CODE)) {
            //     return this.$utils.message({
            //         message: `请输入${this.seriesRule.REMARK}生产车系!`,
            //     });
            // }
            this.$confirm("是否保存修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveBodyProductCode({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        BASE_MODEL: this.BASE_MODEL,
                        BODY_PRODUCT_CODE: this.BODY_PRODUCT_CODE,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") {
                                this.showDialog = false;
                                this.search();
                            }
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        edit() {
            this.BASE_MODEL = this.clickRowsData.BASE_MODEL;
            this.BODY_PRODUCT_CODE = this.clickRowsData.BODY_PRODUCT_CODE;
            this.showDialog = true;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productVehiclesSeries/productVehiclesSeries.scss";
</style>
