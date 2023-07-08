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
            :dynamicIsShowSelect="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :dynamic-export-converts="exportConverts"
        >
        </n-data-table>
        <edit
            ref="edit"
            :key="editPopupsKey"
            :dynamic-edit-row-data="clickRowsData"
            :popups-state="editPopupsState"
            :plantCode="formField.PLANT_CODE"
            :addId="addId"
            v-if="editPopupsVisible"
            @close="close"
        />
    </div>
</template>
<script>
import { mesApis } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "workIndicateBasicType",
    components: {
        Edit: () => import("./edit"),
    },
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path, "workIndicateBasicTypeEdit"],
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
            apiConfig: mesApis.queryProduceType,
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
                            compKey: "btnKey_newAdd",
                              type: "",
                            size: "small",
                            clickEvent: () => this.add(),
                            text: this.$t("sys.button.newAdd"),
                            name: "add",
                            position: "left",
                        },
                        {
                            compKey: "btnKey_edit",
                            type: "",
                            size: "small",
                            clickEvent: () => this.edit(),
                            text: this.$t("sys.button.edit"),
                            name: "edit",
                            position: "left",
                          },
                        {
                            compKey: "btnKey_delete",
                              type: "",
                            size: "small",
                            clickEvent: () => this.delete(),
                            text: this.$t("sys.button.delete"),
                            name: "quanbushanchu",
                            position: "left",
                            disabled: false,
                        },
                        {
                            compKey: "btnKey_detail",
                            type: "",
                              size: "small",
                            clickEvent: () => this.detail(),
                              text: "详情",
                            name: "chakan",
                            position: "left",
                            disabled: false,
                        },
                    ],
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
                    ],
            infoComponents: [
                {
                    compKey: "result",
                    labelName: "表示指定(类别No)",
                    labelWidth: 120,
                    codeField: "result",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                    dataToObject: {
                        maxWordCount: 10,
                    },
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
                              prop: "CATEGORY_CODE",
                            label: "基准类别No",
                          },
                        {
                            prop: "CATEGORY_NAME",
                            label: "基准类别名",
                        },
                        {
                            prop: "CATEGORY_COMMENT",
                            label: "说明",
                          },
                        {
                            prop: "MODIFIER",
                            label: "更新用户",
                        },
                        {
                            prop: "LAST_UPDATED_DATE",
                              label: "更新时间",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    CATEGORY_TYPE: "W1",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            resultField: {
                result: "",
            },
            addId: "", // 新增的自增ID
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.result = val.CATEGORY_CODE;
        },
        "formField.PLANT_CODE": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        handleTableRowDbClick(val) {
            console.log("double click");
        },
        search() {
            this.queryTable(1);
        },
        handleOpenDialog(index) {
            setTimeout(() => {
                let currentRow = this.$refs.multipleTable.list[index];
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.check.queryData(currentRow);
                });
            }, 0);
        },
        add() {
            this.$refs.multipleTable.list = this.$refs.multipleTable.list
                ? this.$refs.multipleTable.list
                : [];
            this.addId = "";
            if (this.$refs.multipleTable.list.length === 0) {
                this.addId = "101";
            } else if (this.$refs.multipleTable.list.length === 1) {
                this.addId =
                    this.$refs.multipleTable.list[0].CATEGORY_CODE - 0 + 1;
            } else {
                for (
                    let i = 0;
                    i < this.$refs.multipleTable.list.length - 1;
                    i++
                ) {
                    if (
                        this.$refs.multipleTable.list[i].CATEGORY_CODE -
                            0 +
                            2 <=
                        this.$refs.multipleTable.list[i + 1].CATEGORY_CODE - 0
                    ) {
                        this.addId =
                            this.$refs.multipleTable.list[i].CATEGORY_CODE -
                            0 +
                            1;
                        break;
                    }
                }
                if (!this.addId) {
                    let idx = this.$refs.multipleTable.list.length - 1;
                    this.addId =
                        this.$refs.multipleTable.list[idx].CATEGORY_CODE -
                        0 +
                        1;
                }
            }
            this.showEdit("add");
        },
        // 编辑按钮事件
        edit() {
            if (this.clickRowsData.CATEGORY_CODE !== undefined) {
                this.showEdit("edit");
            } else {
                this.$utils.message({
                    message: "请选择需要修改的数据！",
                });
            }
        },
        detail() {
            if (this.clickRowsData.CATEGORY_CODE !== undefined) {
                this.showEdit("view");
            } else {
                this.$utils.message({
                    message: "请选择需要查看的数据！",
                });
            }
        },
        delete() {
            if (this.clickRowsData.CATEGORY_CODE !== undefined) {
                this.showEdit("del");
            } else {
                this.$utils.message({
                    message: "请选择需要删除的数据！",
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesProductIndicateType/vehiclesProductIndicateType.scss";
</style>
