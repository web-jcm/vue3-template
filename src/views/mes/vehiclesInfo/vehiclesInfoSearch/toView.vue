<template>
    <el-dialog
        width="1200px"
        :visible="handleVisible"
        :append-to-body="true"
        center
        @close="handleClose"
    >
        <dialogHeader
            slot="title"
            :title="showTitle"
            :styleType="$store.state.app.dialogType"
        ></dialogHeader>
        <div class="dialog_wrap">
            <n-data-table
                ref="multipleTable"
                :dynamicApiConfig="apiConfig"
                :dynamicTableCols="tableCols"
                :dynamic-buttons="tableButtons"
                :dynamic-components="tableComponents"
                :dynamicFormFields="formField"
                :dynamicIsShowSelect="false"
                :dynamicIsInitTable="false"
                :isShowPagination="false"
            />
        </div>
    </el-dialog>
</template>
<script>
import { mesApis } from "@/api/apiList/mes";

import { exportCommon } from "@/utils/utils";
export default {
    mixins: [],
    name: "toView",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), //弹窗标题
    },
    props: {
        handleVisible: {
            type: Boolean,
            default: function () {
                return false;
            },
        },
    },
    data() {
        const viewPageCode = "vehiclesInfoSearch-toView";
        return {
            apiConfig: mesApis.queryVehiclesInfo,
            showTitle: "车辆检索",
            formField: {
                CTRL_KEY: "",
                CAR_SPEC_ROWS: [],
                EMPTY_FLAG: "",
                PLANT_CODE: "",
                SERIAL_NO_END: "",
                SERIAL_NO_START: "",
                SERIAL_TYPE: "",
                SPEC_ID_WITH_IN: "",
                SPEC_WITH_IN_FROM: "",
                SPEC_WITH_IN_TO: "",
                WI_ROWS: [],
                ZONE_NAME_FROM: "",
                ZONE_NAME_TO: "",
            },
            tableCols: this.getCols(),
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
                            compKey: "btnKey_nav",
                            type: "primary",
                            size: "small",
                            clickEvent: () =>
                                this.navigate("vehiclesInfoShow"),
                            text: "车辆信息显示",
                            name: "naviget",
                            position: "right",
                          },
                        {
                            compKey: "btnKey_nav",
                            type: "primary",
                            size: "small",
                            clickEvent: () => this.export(),
                              text: "导出",
                            name: "naviget",
                            position: "right",
                        },
                    ],
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .formComponents.length >
                    (0).length >
                    0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .formComponents
                    : [
                        {
                            compKey: "CTRL_KEY",
                            labelName: "管理号",
                            codeField: "CTRL_KEY",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "inputText",
                            disabled: true,
                            isMust: true,
                          },
                    ],
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        // clickRowsData: {
        //     deep: true,
        //     handler(val) {
        //         console.log(val);
        //         this.formField.CTRL_KEY = val.CTRL_KEY;
        //     },
        // },
        clickRowsData(val) {
            this.formField.CTRL_KEY = val.CTRL_KEY;
        },
        handleVisible(val) {
            if (val) {
                for (let key in this.$parent.formData) {
                    this.formField[key] = this.$parent.formData[key];
                }
                this.$nextTick(() => this.queryTable(1));
            }
        },
    },
    methods: {
        handleTableRowDbClick() {
            this.navigate("vehiclesInfoShow");
        },
        navigate(path) {
            this.handleClose();
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
        export() {
            exportCommon(
                "/ly/mp/mom/mes/vmes/vehicle/cis/exportExcel.do",
                this.formField,
                "车辆检索导出"
            );
        },
        handleClose() {
            this.formField.CTRL_KEY = "";
            this.$emit("close");
        },
        getCols() {
            var cols = [];
            if (
                this.$ConfigCache.CacheConfig.cacheData[this.$route.path] &&
                this.$ConfigCache.CacheConfig.cacheData[this.$route.path]
                    .tableCols.length > 0
            ) {
                cols = cols.concat(
                    this.$ConfigCache.CacheConfig.cacheData[this.$route.path]
                        .tableCols
                );
            } else {
                cols = cols.concat([
                    {
                        prop: "CTRL_KEY",
                        label: "管理号",
                        clickEvent: (e) => console.log(e),
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
                        width: 120,
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
                        prop: "DOUKI_NO",
                        label: "同期编号",
                    },
                    {
                        prop: "ENGINE_NO",
                        label: "发动机编号",
                    },
                    {
                        prop: "TRIM_SERIAL_NO",
                        label: "总装连续编号",
                    },
                ]);
            }
            return cols;
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog_wrap {
    height: 500px;
    /deep/ .filter-params {
        margin: 0;
    }
    /deep/ .operation-btn {
        padding-top: 0;
    }
}
</style>
