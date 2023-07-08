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
            :isShowPagination="false"
            @inputblur="handleBlur"
        >
            <template v-slot:FIX_DATA="scope">
                <el-input
                    v-model="scope.row.FIX_DATA"
                    v-rule="'24'"
                    :disabled="scope.row.EDIT_DATA_TYPE !== 'SR'"
                ></el-input>
            </template>
            <template v-slot:EDIT_DATA_TYPE="scope">
                <el-select
                    v-model="scope.row.EDIT_DATA_TYPE"
                    @change="typeChange(scope.row)"
                >
                    <el-option
                        v-for="item in typeList"
                        :key="item.LOOKUP_VALUE_CODE"
                        :label="
                            item.LOOKUP_VALUE_CODE +
                            ' | ' +
                            item.LOOKUP_VALUE_NAME
                        "
                        :value="item.LOOKUP_VALUE_CODE"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:KEY_DATA_1="scope">
                <el-select
                    v-model="scope.row.KEY_NAME_1"
                    :loading="keyLoading"
                    @change="changeKey1(scope.row)"
                    @click.native="queryCarEditDown(scope.row, 1)"
                >
                    <el-option
                        v-for="item in keyObj1[scope.row.EDIT_DATA_TYPE]"
                        :key="scope.row.index + item.KEY_CODE1"
                        :label="item.KEY_CODE1 + ' | ' + item.KEY_VALUE1"
                        :value="item.KEY_VALUE1"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:KEY_DATA_2="scope">
                <el-select
                    v-model="scope.row.KEY_NAME_2"
                    :loading="keyLoading"
                    @change="changeKey2(scope.row)"
                    @click.native="queryCarEditDown(scope.row, 2)"
                    :key="scope.row.KEY_DATA_2"
                >
                    <el-option
                        v-for="item in keyObj2[
                            scope.row.EDIT_DATA_TYPE + scope.row.KEY_DATA_1
                        ]"
                        :key="scope.row.index + item.KEY_CODE2"
                        :label="item.KEY_CODE2 + ' | ' + item.KEY_VALUE2"
                        :value="item.KEY_VALUE2"
                    >
                    </el-option>
                </el-select>
            </template>
        </n-data-table>
    </div>
</template>
<script>
import {
    mesApis,
    queryCarEditDown,
    queryLookupValues,
    getEditParmSetId,
    saveEditParmSet,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "editParmSet",
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
            apiConfig: mesApis.queryEditParam,
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
                            compKey: "EDIT_PATTERN_TYPE",
                            labelName: "编辑区分",
                              codeField: "EDIT_PATTERN_TYPE",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
                          },
                        {
                            compKey: "EDIT_PATTERN_ID",
                            labelName: "编辑参数ID",
                            codeField: "EDIT_PATTERN_ID",
                            oFields: "EDIT_PATTERN_ID,EDIT_PATTERN_ID",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [],
                        },
                    ],
            infoComponents: [
                {
                    compKey: "EDIT_PATTERN_TYPE",
                    labelName: "编辑区分",
                    codeField: "EDIT_PATTERN_TYPE",
                    component: () => import("@/components/org/commonInput"),
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "EDIT_PATTERN_ID",
                    labelName: "编辑参数ID",
                    codeField: "EDIT_PATTERN_ID",
                    component: () => import("@/components/org/commonInput"),
                    isComponent: true,
                    rule: "23",
                },
                {
                    compKey: "DESCRIPTION",
                    labelName: "注释",
                    codeField: "DESCRIPTION",
                    component: () => import("@/components/org/commonInput"),
                    inputType: "textarea",
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
                            prop: "EDIT_POS",
                            label: "编辑位置",
                        },
                        {
                            prop: "EDIT_DATA_TYPE",
                            label: "数据分类",
                              isSlot: true,
                            noShowTooltip: true,
                        },
                        {
                            prop: "FIX_DATA",
                            label: "直接输入",
                            isSlot: true,
                            noShowTooltip: true,
                        },
                        {
                            prop: "KEY_DATA_1",
                            label: "第1Key",
                            isSlot: true,
                            noShowTooltip: true,
                        },
                          {
                            prop: "KEY_DATA_2",
                            label: "第2Key",
                            isSlot: true,
                            noShowTooltip: true,
                          },
                        {
                            prop: "DATA_START_POS",
                            label: "截取开始",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                {
                                    compKey: "compKey_DATA_START_POS",
                                    codeField: "DATA_START_POS",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "number",
                                    isMust: true,
                                    isShowLabel: false,
                                    clearable: true, // 是否可清除
                                      rule: "25",
                                },
                            ],
                        },
                        {
                            prop: "DATA_SIZE",
                            label: "截取长度",
                            align: "center",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                {
                                    compKey: "compKey_DATA_SIZE",
                                    codeField: "DATA_SIZE",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "number",
                                    isMust: true,
                                    isShowLabel: false,
                                    clearable: true, // 是否可清除
                                      rule: "26",
                                },
                              ],
                        },
                        {
                            prop: "REMARK",
                            label: "备注",
                              align: "center",
                            isComponent: true,
                            noShowTooltip: true,
                            comps: [
                                {
                                    compKey: "compKey_REMARK",
                                    codeField: "REMARK",
                                    component: () =>
                                        import(
                                            "@/components/org/commonInput"
                                        ),
                                    type: "inputText",
                                    isMust: true,
                                    isShowLabel: false,
                                    clearable: true, // 是否可清除
                                    rule: "27",
                                },
                            ],
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    EDIT_PATTERN_TYPE: "",
                    EDIT_PATTERN_ID: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                EDIT_PATTERN_TYPE: "",
                EDIT_PATTERN_ID: "",
                DESCRIPTION: "",
            },
            keyObj1: {},
            keyObj2: {},
            keyLoading: false,
            typeList: [],
        };
    },
    watch: {
        "formField.EDIT_PATTERN_TYPE": {
            handler: function (val) {
                this.tableComponents[1].options.some((sel) => {
                    if (sel.LOOKUP_VALUE_CODE === val) {
                        this.resultField.EDIT_PATTERN_TYPE =
                            sel.LOOKUP_VALUE_NAME;
                        return true;
                    }
                });
                this.formField.EDIT_PATTERN_ID = "";
                this.tableComponents[2].options = [];
                if (val || val === 0) {
                    this.getEditParmSetId();
                }
            },
            immediate: true,
        },
        "formField.EDIT_PATTERN_ID": function (val) {
            this.tableComponents[2].options.some((sel) => {
                if (sel.EDIT_PATTERN_ID === val) {
                    this.resultField.DESCRIPTION = sel.DESCRIPTION;
                    return true;
                }
            });
            this.resultField.EDIT_PATTERN_ID = val;
            if (val) {
                this.search();
            }
        },
        "formField.PLANT_CODE": function () {
            this.queryLookupValues("EDIT_PATTERN_TYPE");
            this.queryLookupValues("EDIT_DATA_TYPE");
        },
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
                            this.typeList = res.rows;
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
        getEditParmSetId() {
            this.tableComponents[2].options = [];
            this.formField.EDIT_PATTERN_ID = "";
            return getEditParmSetId({
                PLANT_CODE: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                EDIT_PATTERN_TYPE: this.formField.EDIT_PATTERN_TYPE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[2].options = res.rows;
                        this.formField.EDIT_PATTERN_ID =
                            res.rows[0].EDIT_PATTERN_ID;
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
        queryCarEditDown(row, type) {
            if (type === 1 && this.keyObj1[row.EDIT_DATA_TYPE]) return;
            if (type === 2 && this.keyObj2[row.EDIT_DATA_TYPE + row.KEY_DATA_1])
                return;
            this.keyLoading = true;
            queryCarEditDown({
                PLANT_CODE: this.formField.PLANT_CODE,
                IS_SEARCH: 1,
                EDIT_DATA_TYPE: row.EDIT_DATA_TYPE,
                KEY_ID_1: type === 1 ? "" : row.KEY_DATA_1,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        let arr1 = [];
                        let arr2 = [];
                        if (type === 1) {
                            res.rows.forEach((item) => {
                                if (
                                    item.KEY_CODE1 &&
                                    item.KEY_VALUE1 &&
                                    !arr1.includes(item.KEY_VALUE1)
                                ) {
                                    arr1.push(item.KEY_VALUE1);
                                    arr2.push({
                                        KEY_CODE1: item.KEY_CODE1,
                                        KEY_VALUE1: item.KEY_VALUE1,
                                    });
                                }
                            });
                            this.$set(this.keyObj1, row.EDIT_DATA_TYPE, arr2);
                        } else {
                            res.rows.forEach((item) => {
                                if (item.KEY_CODE2 && item.KEY_VALUE2) {
                                    arr2.push({
                                        KEY_CODE2: item.KEY_CODE2,
                                        KEY_VALUE2: item.KEY_VALUE2,
                                    });
                                }
                            });
                            this.$set(
                                this.keyObj2,
                                row.EDIT_DATA_TYPE + row.KEY_DATA_1,
                                arr2
                            );
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.keyLoading = false;
                })
                .catch((err) => {
                    this.keyLoading = false;
                    console.log(err);
                });
        },
        search() {
            this.$refs.multipleTable.list = [];
            this.queryTable(1);
        },
        typeChange(row) {
            row.FIX_DATA = "";
            row.KEY_DATA_1 = "";
            row.KEY_DATA_2 = "";
            row.KEY_NAME_1 = "";
            row.KEY_NAME_2 = "";
        },
        handleBlur(name, value, row) {
            if (
                name === "DATA_START_POS" &&
                value !== "" &&
                !/\d/.test(value)
            ) {
                this.$utils.message({
                    message: "截取开始请填写数字",
                });
                row.DATA_START_POS = "";
            }
            if (name === "DATA_SIZE") {
                if (value !== "" && !/\d/.test(value)) {
                    this.$utils.message({
                        message: "截取长度请填写数字",
                    });
                    row.DATA_SIZE = "";
                } else {
                    //重新计算编辑位置
                    this.$refs.multipleTable.list.forEach((item, index) => {
                        if (index === 0) {
                            item.EDIT_POS = 1;
                        } else {
                            item.EDIT_POS =
                                Number(
                                    this.$refs.multipleTable.list[index - 1]
                                        .EDIT_POS
                                ) +
                                Number(
                                    this.$refs.multipleTable.list[index - 1]
                                        .DATA_SIZE
                                );
                        }
                    });
                }
            }
        },
        changeKey1(row) {
            if (row.KEY_NAME_1) {
                // 取缓存的第一列下拉列表
                this.keyObj1[row.EDIT_DATA_TYPE].some((sel) => {
                    if (sel.KEY_VALUE1 === row.KEY_NAME_1) {
                        row.KEY_DATA_1 = sel.KEY_CODE1;
                        return true;
                    }
                });
            } else {
                row.KEY_DATA_1 = "";
            }
            row.KEY_DATA_2 = "";
            row.KEY_NAME_2 = "";
        },
        changeKey2(row) {
            if (row.KEY_NAME_2) {
                // 取缓存的第二列下拉列表
                this.keyObj2[row.EDIT_DATA_TYPE + row.KEY_DATA_1].some(
                    (sel) => {
                        if (sel.KEY_VALUE2 === row.KEY_NAME_2) {
                            row.KEY_DATA_2 = sel.KEY_CODE2;
                            return true;
                        }
                    }
                );
            } else {
                row.KEY_DATA_2 = "";
            }
        },
        save() {
            let flag = this.validateRow(this.$refs.multipleTable.list).flag;
            let index =
                this.validateRow(this.$refs.multipleTable.list).index + 1;
            if (flag) {
                this.$confirm(
                    `是否对参数ID ${this.resultField.EDIT_PATTERN_ID}进行修改?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                    .then(() => {
                        this.saveEditParmSet(
                            "1",
                            this.$refs.multipleTable.list
                        );
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$utils.message({
                    message: `请把第${index}行数据填写完整！`,
                });
            }
        },
        saveEditParmSet(type, arr) {
            this.loading = this.$loading({
                lock: true,
                text: "保存中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            saveEditParmSet({
                PLANT_CODE: this.formField.PLANT_CODE,
                DESCRIPTION: this.resultField.DESCRIPTION,
                EDIT_PATTERN_ID: this.resultField.EDIT_PATTERN_ID,
                EDIT_PATTERN_TYPE: this.formField.EDIT_PATTERN_TYPE,
                OPE_TYPE: type,
                ROWS: arr,
            })
                .then(async (res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                    });
                    if (res.result === "1") {
                        this.getEditParmSetId();
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        add() {
            this.$refs.multipleTable.list = this.$refs.multipleTable.list
                ? this.$refs.multipleTable.list
                : [];
            let flag = this.validateRow(this.$refs.multipleTable.list).flag;
            let index =
                this.validateRow(this.$refs.multipleTable.list).index + 1;
            if (flag) {
                const last =
                    this.$refs.multipleTable.list[
                        this.$refs.multipleTable.list.length - 1
                    ];
                this.$refs.multipleTable.list.push({
                    index: last ? last.index + 1 : 0,
                    EDIT_POS: last ? last.EDIT_POS + (last.DATA_SIZE - 0) : 1,
                    EDIT_DATA_TYPE: "",
                    FIX_DATA: "",
                    KEY_DATA_1: "",
                    KEY_DATA_2: "",
                    DATA_START_POS: "",
                    DATA_SIZE: "",
                    REMARK: "",
                });
            } else {
                this.$utils.message({
                    message: `请把第${index}行数据填写完整！`,
                });
            }
        },
        delete() {
            if (!this.$refs.multipleTable.selection.length) {
                return this.$utils.message({
                    message: `请先勾选数据！`,
                });
            }
            this.$refs.multipleTable.list = this.$refs.multipleTable.list
                ? this.$refs.multipleTable.list
                : [];
            this.$confirm(
                `此操作将删除参数ID ${this.resultField.EDIT_PATTERN_ID}选中的数据, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    if (
                        this.$refs.multipleTable.selection.length ===
                        this.$refs.multipleTable.list.length
                    ) {
                        this.saveEditParmSet(
                            "0",
                            this.$refs.multipleTable.list
                        );
                    } else {
                        let arr = [];
                        arr = this.$refs.multipleTable.list.filter((item) => {
                            return !this.$refs.multipleTable.selection.some(
                                (sel) => sel.index === item.index
                            );
                        });
                        if (arr.length > 1) {
                            arr[0].EDIT_POS = 1;
                            arr.forEach((items, index) => {
                                items.index = index;
                                if (index !== 0) {
                                    items.EDIT_POS =
                                        arr[index - 1].EDIT_POS +
                                        arr[index - 1].DATA_SIZE;
                                }
                            });
                        } else if (arr.length === 1) {
                            arr[0].EDIT_POS = 1;
                            arr[0].index = 0;
                        }
                        let flag = this.validateRow(arr).flag;
                        let index = this.validateRow(arr).index + 1;
                        if (flag) {
                            this.saveEditParmSet("1", arr);
                        } else {
                            this.$utils.message({
                                message: `请把第${index}行数据填写完整！`,
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        validateRow(list) {
            let flag = true;
            let idx;
            list.some((sel, index) => {
                if (!sel.EDIT_DATA_TYPE) {
                    flag = false;
                    idx = index;
                    return true;
                }
                if (sel.EDIT_DATA_TYPE === "SR" && sel.FIX_DATA === "") {
                    flag = false;
                    idx = index;
                    return true;
                }
                if (
                    this.keyObj1[sel.EDIT_DATA_TYPE]?.length &&
                    sel.KEY_DATA_1 === ""
                ) {
                    flag = false;
                    idx = index;
                    return true;
                }
                if (
                    this.keyObj1[sel.EDIT_DATA_TYPEE + sel.KEY_DATA_1]
                        ?.length &&
                    sel.KEY_DATA_2 === ""
                ) {
                    flag = false;
                    idx = index;
                    return true;
                }
                if (sel.DATA_START_POS === "" || sel.DATA_SIZE === "") {
                    flag = false;
                    idx = index;
                    return true;
                }
            });
            return { flag: flag, index: idx };
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/editParmSet/editParmSet.scss";
</style>
