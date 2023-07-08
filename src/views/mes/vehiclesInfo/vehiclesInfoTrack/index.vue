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
            :dynamicResultField="resultField"
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
import { mesApis } from "@/api/apiList/mes";
import { queryLookupValues } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesInfoTrack",
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
            apiConfig: mesApis.queryCarInfoTrack,
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
                            compKey: "btnKey_reset",
                            type: "",
                            size: "small",
                            clickEvent: () => this.reset(),
                            text: this.$t("sys.button.reset"),
                              name: "reset",
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
                            clearable: false,
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
                            rule: "",
                        },
                    ],
            infoComponents: [
                {
                    compKey: "result",
                    labelName: "管理号",
                    codeField: "result",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
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
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                        {
                            prop: "ZONE_CODE",
                            label: "区域编码",
                          },
                        {
                            prop: "ZONE_NAME",
                            label: "区域名称",
                        },
                        {
                            prop: "IN_TIME",
                            label: "搬入时间",
                            width: 130,
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
                            prop: "BASE_MODEL",
                            label: "车系",
                        },
                        {
                            prop: "MODEL",
                            label: "车型",
                            width: 200,
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
                            prop: "VIN_NO",
                            label: "VIN",
                            width: 140,
                          },
                        {
                            prop: "ENGINE_NO",
                            label: "发动机编号",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    queryType: "",
                    queryCode: [],
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            resultField: {
                result: "",
            },
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.result = val.CTRL_KEY;
        },
        "formField.queryType": function (val) {
            if (val === "1") {
                this.tableComponents[2].rule = "1";
            } else if (val === "2") {
                this.tableComponents[2].rule = "3";
            } else if (val === "3") {
                this.tableComponents[2].rule = "10";
            } else if (val === "4") {
                this.tableComponents[2].rule = "32";
            } else if (val === "5") {
                this.tableComponents[2].rule = "4";
            } else if (val === "6") {
                this.tableComponents[2].rule = "9";
            } else if (val === "7") {
                this.tableComponents[2].rule = "2";
            }
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
        },
    },
    methods: {
        handleTableRowDbClick() {
            this.navigate("vehiclesInfoShow");
        },
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "CAR_QUERY_TYPE",
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
        search() {
            if (!this.formField.queryType || !this.formField.queryCode.length) {
                return this.$utils.message({
                    message: "查询值不能为空!",
                });
            }
            this.formField.ROWS = {
                CAR_QUERY_TYPE: this.formField.queryType,
                CAR_QUERY_VALUES: this.formField.queryCode,
            };
            this.resultField.result = "";
            this.queryTable(1);
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
            //     params: {
            //         key: "ctrlKey",
            //         value: this.clickRowsData.CTRL_KEY,
            //     },
            // });
        },
        handleTableRowDbClick(val) {
            console.log("double click");
        },
        handleBlur(name, value) {
            console.log("handleBlur", name, value);
        },
        reset() {
            this.formField.PLANT_CODE = "";
            this.formField.queryType = "";
            this.formField.queryCode = [];
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesInfoTrack/vehiclesInfoTrack.scss";
</style>
