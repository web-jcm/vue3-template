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
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
        </n-data-table>
    </div>
</template>
<script>
import { mesApis, queryLineNo, queryLookupValues } from "@/api/apiList/mes";
import Vue from "vue";
import { async } from "q";

export default {
    name: "delayCarSearch",
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
            apiConfig: mesApis.getdelayRetentionvehiclelist,
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
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            options: [],
                        },
                        {
                            compKey: "DELAYED_DETENTION",
                            labelName: "车辆类型",
                            codeField: "DELAYED_DETENTION",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
                            options: [
                                {
                                    LOOKUP_VALUE_CODE: "1",
                                    LOOKUP_VALUE_NAME: "延迟车",
                                },
                                {
                                    LOOKUP_VALUE_CODE: "2",
                                    LOOKUP_VALUE_NAME: "滞留车",
                                },
                            ],
                        },
                        {
                            compKey: "START_ZONE_CODE",
                            labelName: "工程开始",
                            codeField: "START_ZONE_CODE",
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
                            compKey: "END_ZONE_CODE",
                            labelName: "工程结束",
                            codeField: "END_ZONE_CODE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
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
                            prop: "ZONE_CODE",
                            label: "区编码",
                        },
                        {
                            prop: "ZONE_NAME",
                            label: "区名称",
                        },
                        {
                            prop: "CTRL_KEY",
                            label: "管理号",
                        },
                        {
                            prop: "SERIAL_NO",
                            label: "车辆连续号",
                        },
                        {
                            prop: "OUT_TIME",
                            label: "延迟/滞留时间(分钟)",
                            width: 160,
                        },
                        {
                            prop: "PROCESS_NAME",
                            label: "工程",
                        },
                        {
                            prop: "LINE_NO",
                            label: "生产线",
                        },
                        {
                            prop: "MODEL",
                            label: "车型",
                        },
                        {
                            prop: "VIN",
                            label: "VIN",
                            width: 140,
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
                            prop: "DOUKI_NO",
                            label: "同期编号",
                        },
                        {
                            prop: "OFFLINE",
                            label: "总装下线计划",
                            width: 130,
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    LINE_NO: "",
                    START_ZONE_CODE: "",
                    END_ZONE_CODE: "",
                    DELAYED_DETENTION: "1",
                    BASIC_TIME: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.PLANT_CODE": async function () {
            this.queryLineNo();
            this.queryLookupValues("ZONE_GROUP_TYPE");
            this.queryLookupValues("ADVANCE_PARAMTER");
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
        queryLookupValues(type) {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (type === "ZONE_GROUP_TYPE" && res.rows) {
                            this.tableComponents[3].options = res.rows;
                            this.formField.START_ZONE_CODE =
                                res.rows[0].LOOKUP_VALUE_CODE;
                            this.tableComponents[4].options = res.rows;
                            this.formField.END_ZONE_CODE =
                                res.rows[0].LOOKUP_VALUE_CODE;
                        } else if (type === "ADVANCE_PARAMTER" && res.rows) {
                            res.rows.some((sel) => {
                                if (sel.LOOKUP_VALUE_CODE === "VUDL") {
                                    return (this.formField.BASIC_TIME =
                                        sel.LOOKUP_VALUE_NAME);
                                }
                            });
                            console.log(this.formField.BASIC_TIME);
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
            //     params: { key: "ctrlKey", value: this.clickRowsData.CTRL_KEY },
            // });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/productTrackingSearchBody/productTrackingSearchBody.scss";
</style>
