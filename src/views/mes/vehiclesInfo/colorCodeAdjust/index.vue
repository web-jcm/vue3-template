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
            :dynamicIsShowSelect="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :dynamic-export-converts="exportConverts"
        >
            <template v-slot:IS_TWO_COLOR="scope">
                {{
                    scope.row.IS_TWO_COLOR === "1"
                        ? "是"
                        : scope.row.IS_TWO_COLOR === "0"
                        ? "否"
                        : scope.row.IS_TWO_COLOR
                }}
            </template>
            <template v-slot:button="scope">
                <el-button @click="clickEdit(scope.row)">编辑</el-button>
                <!-- <el-button @click="clickDel(scope.row)">删除</el-button> -->
            </template>
        </n-data-table>
        <edit v-if="showDialog" :editData="formData" @close="dialogClose" />
    </div>
</template>
<script>
import { mesApis, saveColorCode } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "colorCodeAdjust",
    components: {
        Edit: () => import("./edit"),
    },
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path, "productIndicateTypeEdit"],
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
            apiConfig: mesApis.queryColorCode,
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
                        //   {
                        //       compKey: "btnKey_newAdd",
                        //       type: "",
                        //       size: "small",
                        //       clickEvent: () => this.add(),
                        //       text: this.$t("sys.button.newAdd"),
                        //       name: "add",
                        //       position: "left",
                        //   },
                        {
                            compKey: "btnKey_export",
                            type: "",
                            size: "small",
                            clickEvent: () => this.onExport(),
                            text: "导出",
                            name: "etc",
                            position: "left",
                        },
                    ],
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
                            compKey: "COLOR_K",
                            labelName: "颜色",
                            codeField: "COLOR_K",
                            component: () =>
                                import("@/components/org/commonInput"),
                              isMust: true,
                            rule: "15",
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
                            prop: "COLOR_K",
                            label: "颜色编码",
                        },
                        {
                            prop: "COLOR_NAME",
                              label: "颜色名称",
                        },
                        {
                            prop: "IS_TWO_COLOR",
                            label: "是否双色",
                            isSlot: true,
                        },
                        {
                            prop: "COLOR_K0",
                            label: "中涂色",
                        },
                        {
                            prop: "COLOR_K1",
                            label: "第一面漆色",
                        },
                        {
                            prop: "COLOR_K2",
                            label: "第二面漆色",
                          },
                        {
                            prop: "button",
                            label: "操作",
                            width: 160,
                            align: "center",
                            fixed: "right",
                              right: 0,
                            isSlot: true,
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    COLOR_K: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            formData: {},
            showDialog: false,
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        add() {
            this.formData = {
                PLANT_CODE: this.formField.PLANT_CODE,
                OPT_TYPE: "C",
                ID: "",
                COLOR_K: "",
                COLOR_NAME: "",
                IS_TWO_COLOR: "",
                COLOR_K0: "",
                COLOR_K1: "",
                COLOR_K2: "",
            };
            this.showDialog = true;
        },
        clickEdit(row) {
            this.formData = row;
            this.formData.PLANT_CODE = this.formField.PLANT_CODE;
            this.formData.OPT_TYPE = row.ID ? "U" : "C";
            this.showDialog = true;
        },
        clickDel(row) {
            this.formData = row;
            this.formData.PLANT_CODE = this.formField.PLANT_CODE;
            this.formData.OPT_TYPE = "D";
            this.$confirm("是否删除数据?", "提示", {
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
                    saveColorCode(this.formData)
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
                })
                .catch(() => {});
        },
        dialogClose() {
            this.showDialog = false;
            this.search();
        },
        onExport() {
            if (this.$refs.multipleTable.list?.length) {
                const filename = "颜色特征码";
                const autoWidth = true;
                const bookType = "xlsx";
                const header = [
                    "颜色编码",
                    "颜色名称",
                    "是否双色(0:否,1:是)",
                    "中涂色",
                    "第一面漆色",
                    "第二面漆色",
                ];
                const headValue = [
                    "COLOR_K",
                    "COLOR_NAME",
                    "IS_TWO_COLOR",
                    "COLOR_K0",
                    "COLOR_K1",
                    "COLOR_K2",
                ];
                const formatJson = (headValue, jsonData) => {
                    return jsonData.map((v) => headValue.map((j) => v[j]));
                };
                // 引入本地的 Export2Excel.js
                import("@/utils/Export2Excel.js").then((moudle) => {
                    moudle.export_json_to_excel({
                        header,
                        data: formatJson(
                            headValue,
                            this.$refs["multipleTable"].list
                        ),
                        filename,
                        autoWidth,
                        bookType,
                    });
                });
            } else {
                this.$utils.message({
                    message: "空数据",
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped></style>
