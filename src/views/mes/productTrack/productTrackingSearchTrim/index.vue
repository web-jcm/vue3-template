<template>
    <div class="app-container app-container-table">
        <div class="nav_wrap">
            <div class="nav_btn" @click="navigate('vehiclesInfoShow')">
                车辆信息显示
            </div>
        </div>
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
    queryLineNo,
    queryLookupValues,
    getCarSearchZone,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "productTrackingSearchTrim",
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
            apiConfig: mesApis.queryTrackingPTF,
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
                        {
                            compKey: "LINE_NO",
                            labelName: "生产线",
                            codeField: "LINE_NO",
                            oFields: "LINE_NO,LINE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
                        },
                        {
                            compKey: "PRODUCT_TYPE",
                            labelName: "生产类型",
                            codeField: "PRODUCT_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                              lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
                            options: [],
                          },
                        {
                            compKey: "ZONE_CODE",
                            labelName: "区域",
                            codeField: "ZONE_CODE",
                            oFields: "ZONE_CODE,ZONE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                              isRequire: true,
                            isConcat: true,
                            clearable: false,
                            options: [],
                            labelWidth: 110,
                            maxWordCount: 9,
                        },
                        // {
                        //   compKey: 'STAGE',
                        //   labelName: '空 stage',
                        //   codeField: 'STAGE',
                        //   component: () => import('@/components/org/checkBox'),
                        //   isMust: true,
                        //   dataToObject: {
                        //     maxWordCount: 7,
                        //   },
                        // },
                        // {
                        //   compKey: 'DOLLY',
                        //   labelName: '空 dolly',
                          //   codeField: 'DOLLY',
                        //   component: () => import('@/components/org/checkBox'),
                        //   isMust: true,
                        //   dataToObject: {
                        //     maxWordCount: 7,
                          //   },
                        // },
                    ],
            infoComponents: [
                {
                    compKey: "y1",
                    labelName: "Y1···车体OK禁止",
                    style: { width: "25%", padding: "2px 4px" },
                },
                {
                    compKey: "y2",
                    labelName: "Y2···涂装OK禁止",
                    style: { width: "25%", padding: "2px 4px" },
                },
                {
                    compKey: "y3",
                    labelName: "Y3···总装投入禁止",
                    style: { width: "25%", padding: "2px 4px" },
                },
                {
                    compKey: "y4",
                    labelName: "Y4···最终工序OK禁止",
                    style: { width: "25%", padding: "2px 4px" },
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
                            prop: "LINE_NO",
                            label: "生产线",
                        },
                        {
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                        {
                              prop: "MODEL",
                            label: "车型",
                            width: 160,
                        },
                        {
                            prop: "COLOR_K",
                            label: "外饰色",
                          },
                        {
                            prop: "COLOR_I",
                            label: "内饰色",
                        },
                        {
                            prop: "VIN",
                            label: "VIN",
                            width: 140,
                        },
                        {
                            prop: "TRIM_SERIAL_NO",
                              label: "总装连续编号",
                        },

                        {
                            prop: "DOUKI_NO",
                            label: "同期编号",
                        },
                          {
                            prop: "ENGINE_NO",
                            label: "发动机编号/Motor No",
                            width: 130,
                        },
                        {
                            prop: "motorNo",
                            label: "Motor No",
                        },
                        {
                            prop: "PLAN_TIME7",
                            label: "总装下线计划",
                            width: 130,
                          },
                        // {
                        //   prop: 'P13',
                        //   label: 'P13',
                          // },
                        // {
                        //   prop: 'P14',
                        //   label: 'P14',
                        // },
                          {
                            prop: "Y1",
                            label: "Y1",
                        },
                        {
                            prop: "Y2",
                            label: "Y2",
                        },
                        {
                            prop: "Y3",
                            label: "Y3",
                          },
                        {
                            prop: "Y4",
                            label: "Y4",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    LINE_NO: "",
                    ZONE_CODE: "",
                    STAGE: "0",
                    DOLLY: "0",
                    PRODUCT_TYPE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.queryLineNo();
            this.queryLookupValues();
        },
        "formField.PRODUCT_TYPE": function (val) {
            this.formField.ZONE_CODE = "";
            if (val) {
                this.getCarSearchZone();
            }
        },
        "formField.ZONE_CODE": function (val) {
            if (val) {
                this.search();
            }
        },
    },
    methods: {
        handleTableRowDbClick() {
            this.navigate("vehiclesInfoShow");
        },
        queryLineNo() {
            this.tableComponents[1].options = [];
            queryLineNo({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
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
        queryLookupValues() {
            this.tableComponents[2].options = [];
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "PRODUCT_TYPE",
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
                            this.tableComponents[2].options = res.rows;
                            this.formField.PRODUCT_TYPE =
                                res.rows[0].LOOKUP_VALUE_CODE;
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
        getCarSearchZone() {
            this.tableComponents[3].options = [];
            getCarSearchZone({
                PLANT_CODE: this.formField.PLANT_CODE,
                LINE_NO: this.formField.LINE_NO,
                PRODUCT_TYPE: this.formField.PRODUCT_TYPE,
                PROCESS_LOCATION: "T",
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows && res.rows.length) {
                            this.tableComponents[3].options = res.rows;
                            this.formField.ZONE_CODE = res.rows[0].ZONE_CODE;
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
            if (this.formField.ZONE_CODE) {
                this.queryTable(1);
            } else {
                this.$utils.message({
                    message: "区域不能为空",
                });
            }
        },
        navigate(path) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        key: "ctrlKey",
                        value: this.clickRowsData.CTRL_KEY,
                    })
                );
                window.parent.$multilMenuDo.actions.openMenu(myMenu[0].id);
                //非菜单页面
                // window.parent.$multilMenuDo.actions.renderMenu(
                //     myMenu[0].target,
                //     myMenu[0].id,
                //     0,
                //     myMenu[0].name
                // );
            }
            //不集成mp
            // this.$router.push({
            //     name: path,
            //     params: { key: "ctrlKey", value: this.clickRowsData.CTRL_KEY },
            // });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productTrackingSearchTrim/productTrackingSearchTrim.scss";
</style>
