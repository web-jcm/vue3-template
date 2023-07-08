<template>
    <div class="app-container app-container-table">
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
            :dynamic-is-show-select="true"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="true"
            :isUsePathQuery="false"
        >
            <template v-slot:barCodeCategoryCode="scope">
                <el-select
                    v-model="scope.row.barCodeCategoryCode"
                    clearable
                    @change="changeKey(scope.row)"
                >
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.barCodeCategoryCode"
                        :label="item.barCodeCategoryName"
                        :value="item.barCodeCategoryCode"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:isEnable="scope">
                <el-checkbox
                    v-model="scope.row.isEnable"
                    true-label="1"
                    false-label="0"
                    @change="changeEnable(scope.row)"
                ></el-checkbox>
            </template>
            <template v-slot:button="scope">
                <el-button
                    type="primary"
                    :disabled="!scope.row.tableId"
                    @click="clickEdit(scope.row)"
                    >编辑明细</el-button
                >
            </template>
        </n-data-table>
        <detail
            v-if="showDetail"
            :tableId="currentTableId"
            :plantCode="formField.PLANT_CODE"
            @close="closeDialog"
        />
    </div>
</template>
<script>
import {
    mesApis,
    savePartsCodeManage,
    queryLookupValues,
    delPartsCodeManage,
    enablePartsCode,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "partsCodeManage",
    components: {
        Detail: () => import("./detail"),
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
            apiConfig: mesApis.queryPartsCodeManage,
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
                        {
                            compKey: "btnKey_delete",
                              type: "",
                            size: "small",
                            clickEvent: () => this.delete(),
                            text: this.$t("sys.button.delete"),
                            name: "quanbushanchu",
                            position: "center",
                          },
                        {
                            compKey: "btnKey_add",
                            type: "",
                            size: "small",
                            clickEvent: () => this.add(),
                            text: "新增行",
                            name: "add",
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
                            compKey: "barCodeCategoryCode",
                            labelName: "条码类别",
                            codeField: "barCodeCategoryCode",
                            oFields:
                                  "barCodeCategoryCode,barCodeCategoryName",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            options: [],
                          },
                        {
                            compKey: "barCodeName",
                            labelName: "条码名称",
                            codeField: "barCodeName",
                            component: () =>
                                import("@/components/org/commonInput"),
                            isMust: true,
                          },
                        {
                            compKey: "isEnable",
                            labelName: "是否启用",
                            codeField: "isEnable",
                            component: () =>
                                import("@/components/org/checkBox"),
                            isMust: true,
                          },
                    ],
            infoComponents: [
                {
                    compKey: "barCodeCategoryCode",
                    labelName: "条码类别",
                    codeField: "barCodeCategoryCode",
                    component: () => import("@/components/org/commonInput"),
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
                            prop: "barCodeCategoryCode",
                            label: "条码类别",
                            isSlot: true,
                            width: 150,
                          },
                        {
                            prop: "barCodeCategoryName",
                            label: "类别名称",
                            width: 200,
                          },
                        {
                            prop: "barCodeCode",
                            label: "条码编码",
                            isComponent: true,
                              comps: [
                                {
                                    compKey: "compKey_barCodeCode",
                                    codeField: "barCodeCode",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                },
                            ],
                            width: 200,
                          },
                        {
                            prop: "barCodeName",
                            label: "条码名称",
                            isComponent: true,
                              comps: [
                                {
                                    compKey: "compKey_barCodeName",
                                    codeField: "barCodeName",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                },
                            ],
                        },
                        {
                            prop: "barCodeLength",
                              label: "条码长度",
                            isComponent: true,
                            comps: [
                                  {
                                    compKey: "compKey_barCodeLength",
                                    codeField: "barCodeLength",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                },
                            ],
                            width: 100,
                          },
                        {
                            prop: "isEnable",
                              label: "是否启用",
                            isSlot: true,
                            width: 80,
                        },
                        {
                              prop: "button",
                            label: "操作",
                            width: 100,
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
                    barCodeCategoryCode: "",
                    barCodeName: "",
                    isEnable: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                barCodeCategoryCode: "",
            },
            selectOptions: [],
            showDetail: false,
            currentTableId: "",
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.barCodeCategoryCode = val.barCodeCategoryCode;
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues("BARCODE_CATEGORY");
        },
    },
    created() {
        // this.tableComponents[1].options = this.selectOptions
    },
    methods: {
        queryLookupValues(type) {
            queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: type,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        if (type === "EDIT_PATTERN_TYPE") {
                            this.tableComponents[1].options = res.rows;
                            this.formField.EDIT_PATTERN_TYPE =
                                res.rows[0].LOOKUP_VALUE_CODE;
                        } else {
                            res.rows.forEach(function (item) {
                                item.barCodeCategoryName =
                                    item.LOOKUP_VALUE_NAME; //+ '(' + item.LOOKUP_VALUE_CODE + ')'
                                item.barCodeCategoryCode =
                                    item.LOOKUP_VALUE_CODE;
                            });
                            this.tableComponents[1].options = res.rows;
                            this.selectOptions = res.rows;
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
        changeKey(row) {
            this.selectOptions.some((sel) => {
                if (sel.barCodeCategoryCode === row.barCodeCategoryCode) {
                    row.barCodeCategoryName = sel.barCodeCategoryName;
                }
            });
        },
        changeEnable(row) {
            if (row.tableId) {
                this.loading = this.$loading({
                    lock: true,
                    text: "请求中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                // let arr = [row];
                // arr[0].isEnable = row.isEnable ? "1" : "0";
                enablePartsCode({
                    plantCode: this.formField.PLANT_CODE,
                    ROWS: [row],
                })
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "0") {
                            row.isEnable = row.isEnable === "0" ? "1" : "0";
                        }
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            } else {
                row.isEnable = "0";
                this.$utils.message({
                    message: "请先保存新增数据！",
                });
            }
        },
        showEdit(row) {
            console.log(row);
        },
        save() {
            let index = 0;
            this.$refs.multipleTable.list.some((sel, idx) => {
                if (
                    !sel.barCodeCategoryCode ||
                    sel.barCodeCode === "" ||
                    sel.barCodeName === "" ||
                    sel.barCodeLength === ""
                ) {
                    index = idx + 1;
                    return true;
                }
            });
            if (index > 0) {
                this.$utils.message({
                    message: `请把第${index}行数据填写完整！`,
                });
            } else {
                this.$confirm("是否对当前修改进行保存?", "提示", {
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
                        savePartsCodeManage({
                            plantCode: this.formField.PLANT_CODE,
                            ROWS: this.$refs.multipleTable.list,
                        })
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
            }
        },
        add() {
            let index;
            this.$refs.multipleTable.list.some((sel, idx) => {
                if (
                    !sel.barCodeCategoryCode ||
                    sel.barCodeCode === "" ||
                    sel.barCodeName === "" ||
                    sel.barCodeLength === ""
                ) {
                    index = idx + 1;
                    return true;
                }
            });
            if (index) {
                this.$utils.message({
                    message: `请把第${index}行数据填写完整！`,
                });
            } else {
                this.$refs.multipleTable.list.push({
                    index: this.$refs.multipleTable.list.length,
                    barCodeCategoryCode: "",
                    barCodeCode: "",
                    barCodeName: "",
                    barCodeLength: "",
                    isEnable: "0",
                });
            }
        },
        delete() {
            if (this.$refs.multipleTable.selection.length) {
                this.$confirm("此操作将删除数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let arr = [];
                        this.$refs.multipleTable.selection.forEach((item) => {
                            arr.push(item.tableId);
                        });
                        this.loading = this.$loading({
                            lock: true,
                            text: "删除中",
                            background: "rgba(0, 0, 0, 0.7)",
                        });
                        delPartsCodeManage({
                            plantCode: this.formField.PLANT_CODE,
                            tableIds: arr,
                        })
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
                this.$utils.message({
                    message: "请选择数据！",
                });
            }
        },
        clickEdit(row) {
            // console.log(row)
            this.showDetail = true;
            this.currentTableId = row.tableId;
        },
        closeDialog() {
            this.showDetail = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/editParmSet/editParmSet.scss";
</style>
