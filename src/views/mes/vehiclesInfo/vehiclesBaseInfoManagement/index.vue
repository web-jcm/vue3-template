<template>
    <div class="app-container app-container-table">
        <div class="nav_wrap">
            <div
                class="nav_btn"
                @click="navigate('vehiclesProductTimeManagement')"
            >
                车辆生产时间管理
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
            :isUsePathQuery="false"
            :dynamic-export-converts="exportConverts"
            @inputblur="handleBlur"
        >
            <template v-slot:SPEC="scope">
                <el-input
                    v-model="scope.row.SPEC"
                    :disabled="scope.row.IS_EDIT == 0"
                ></el-input>
            </template>
        </n-data-table>
    </div>
</template>
<script>
import { mesApis } from "@/api/apiList/mes";
import {
    queryCarInfo,
    saveBaseCarInfo,
    queryLookupValues,
} from "@/api/apiList/mes";

import Vue from "vue";
import { reject } from "q";

export default {
    name: "vehiclesBaseInfoManagement",
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
            apiConfig: mesApis.queryBaseCarInfo,
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
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
                        },
                        {
                            compKey: "searchKey",
                            labelName: "查询KEY",
                            codeField: "searchKey",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            clearable: false,
                            isRequire: true,
                            options: [],
                        },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            component: () =>
                                import("@/components/org/commonInput"),
                            isMust: true,
                            rule: "",
                        },
                    ],
            infoComponents: [
                {
                    compKey: "CTRL_KEY",
                    labelName: "管理号",
                    codeField: "CTRL_KEY",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "zoneName",
                    labelName: "区域",
                    codeField: "zoneName",
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
                            prop: "ITEM_VALUE_FIELD_NAME",
                              label: "明细",
                        },
                        {
                            prop: "REMARK",
                            label: "文本类型",
                        },
                        {
                            prop: "ITEM_VALUE_LENGTH",
                            label: "文本长度",
                          },
                        {
                            prop: "SPEC",
                            label: "值",
                            isSlot: true,
                            // isComponent: true,
                            // comps: [
                            //   {
                            //     compKey: 'compKey_SPEC',
                            //     codeField: 'SPEC',
                            //     component: () => import('@/components/org/commonInput'),
                            //     type: 'inputText',
                            //     isMust: true,
                            //     isShowLabel: false,
                            //     disabled: false,
                            //     clearable: true, // 是否可清除
                            //     change: (a, b, c, d, e, f) => {
                            //       console.log(a)
                            //       console.log(b)
                            //       console.log(c)
                            //       console.log(d)
                            //       console.log(e)
                            //       console.log(f)
                            //     },
                            //   },
                            // ],
                          },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    searchKey: "",
                    searchValue: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                CTRL_KEY: "",
                zoneName: "",
            },
            copyData: null,
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.searchKey": function (val) {
            if (val === "ctrlKey") {
                this.tableComponents[2].rule = "1";
            } else if (val === "vin") {
                this.tableComponents[2].rule = "2";
            } else if (val === "orderId") {
                this.tableComponents[2].rule = "3";
            }
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues();
            const params = sessionStorage.getItem("vehiclesBaseInfoManagement");
            if (params) {
                this.formField.searchKey = JSON.parse(params).key;
                this.formField.searchValue = JSON.parse(params).value;
                this.$nextTick(() => this.search());
                sessionStorage.removeItem("vehiclesBaseInfoManagement");
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.searchKey = this.$route.params.key;
            //     this.formField.searchValue = this.$route.params.value;
            //     this.$nextTick(() => this.search());
            // }
        },
    },
    activated() {
        let params = sessionStorage.getItem("vehiclesBaseInfoManagement");
        if (params) {
            this.formField.searchKey = JSON.parse(params).key;
            this.formField.searchValue = JSON.parse(params).value;
            this.search();
            sessionStorage.removeItem("vehiclesBaseInfoManagement");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.searchKey = this.$route.params.key;
        //     this.formField.searchValue = this.$route.params.value;
        //     this.search();
        // }
    },
    methods: {
        navigate(path) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        key: this.formField.searchKey,
                        value: this.formField.searchValue,
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
            //         key: this.formField.searchKey,
            //         value: this.formField.searchValue,
            //     },
            // });
        },
        queryLookupValues() {
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "QUERY_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.searchKey =
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
        async search() {
            if (!this.formField.searchKey || !this.formField.searchValue) {
                return this.$utils.message({
                    message: "查询值不能为空!",
                });
            }
            this.formField.ROWS = [];
            this.copyData = [];
            this.$refs.multipleTable.list = [];
            await this.queryInfo();
            if (this.resultField.CTRL_KEY) {
                this.queryTable(1, null, null, null, this.onQueryReturn);
            }
        },
        queryInfo() {
            this.resultField.CTRL_KEY = "";
            this.resultField.zoneName = "";
            return queryCarInfo(this.formField)
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows?.rows?.length) {
                            let rows = res.rows.rows[0];
                            this.resultField.CTRL_KEY = rows.ctrlKey;
                            this.resultField.zoneName = rows.zoneName;
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
        onQueryReturn(res) {
            this.copyData = JSON.parse(JSON.stringify(res.rows));
            console.log(this.copyData);
        },
        save() {
            let pram = this.formField;
            pram.CTRL_KEY = this.resultField.CTRL_KEY;
            if (this.copyData) {
                pram.ROWS = [];
                this.copyData.forEach((item) => {
                    this.$refs.multipleTable.list.some((sel) => {
                        if (
                            item.ITEM_VALUE_FIELD_CODE ===
                            sel.ITEM_VALUE_FIELD_CODE
                        ) {
                            if (item.SPEC !== sel.SPEC) {
                                pram.ROWS.push(sel);
                            }
                            return;
                        }
                    });
                });
                if (pram.ROWS.length) {
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
                            saveBaseCarInfo(pram)
                                .then((res) => {
                                    this.loading.close();
                                    this.$utils.message({
                                        message: res.msg,
                                    });
                                    if (res.result === "1") this.search();
                                })
                                .catch((err) => {
                                    this.loading.close();
                                    console.log(err);
                                });
                        })
                        .catch(() => {});
                } else {
                    return this.$utils.message({
                        message: "数据未改变!",
                    });
                }
            }
        },
        handleTableRowDbClick(val) {
            console.log("double click");
        },
        handleBlur(name, value, row) {
            let reg = new RegExp(row.ITEM_VALUE_REGULAR);
            if (
                value !== null &&
                value !== "" &&
                (!reg.test(value) || value.length != row.ITEM_VALUE_LENGTH)
            ) {
                this.$utils.message({
                    message: `请输入${row.ITEM_VALUE_LENGTH}位${row.REMARK}!`,
                });
                row[name] = null;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesBaseInfoManagement/vehiclesBaseInfoManagement.scss";
</style>
