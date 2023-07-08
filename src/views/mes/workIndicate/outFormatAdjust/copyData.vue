<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="80%"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="输出格式复制源选择"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
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
            >
            </n-data-table>
        </div>
    </el-dialog>
</template>
<script>
import { mesApis, queryDeviceList } from "@/api/apiList/mes";

export default {
    name: "copyData",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    props: {},
    data() {
        return {
            // 网格查询API配置对象
            apiConfig: mesApis.queryOutFormatList,
            tableButtons: [
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
                    type: "primary",
                    size: "small",
                    clickEvent: () => this.choose(),
                    text: "选择复制源",
                    name: "preservation",
                    position: "center",
                },
            ],
            tableComponents: [
                {
                    compKey: "PLANT_CODE",
                    labelName: "工厂名称",
                    codeField: "PLANT_CODE",
                    oFields: "PLANT_CODE,PLANT_NAME",
                    lookuptype: "queryPlant",
                    component: () => import("@/components/org/LookupValue"),
                    isMust: true,
                    isRequire: true,
                    clearable: false,
                },
                {
                    compKey: "DEVICE_ID",
                    labelName: "接续设备",
                    codeField: "DEVICE_ID",
                    oFields: "DEVICE_ID,DEVICE_NAME",
                    lookuptype: "_is_null_code_",
                    component: () => import("@/components/org/LookupValue"),
                    isMust: true,
                    clearable: false,
                    isRequire: true,
                    isConcat: true,
                    options: [],
                },
            ],
            infoComponents: [
                {
                    compKey: "DEVICE_ID",
                    labelName: "接续设备ID",
                    codeField: "DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
            ],
            tableCols: [
                {
                    prop: "CATEGORY_CODE",
                    label: "作业基准类别No",
                },
                {
                    prop: "CATEGORY_NAME",
                    label: "作业基准类别名",
                },
                {
                    prop: "FORMAT_ID",
                    label: "既定输出格式ID",
                },
                {
                    prop: "FORMAT_NAME",
                    label: "既定输出格式名",
                },
                {
                    prop: "CHANGE_FORMAT_ID1",
                    label: "变更输出格式ID1",
                },
                {
                    prop: "CHANGE_FORMAT_NAME1",
                    label: "变更输出格式名1",
                },
                {
                    prop: "CHANGE_FORMAT_ID2",
                    label: "变更输出格式ID2",
                },
                {
                    prop: "CHANGE_FORMAT_NAME2",
                    label: "变更输出格式名2",
                },
                {
                    prop: "CHANGE_FORMAT_ID3",
                    label: "变更输出格式ID3",
                },
                {
                    prop: "CHANGE_FORMAT_NAME3",
                    label: "变更输出格式名3",
                },
            ],
            formField: {
                PLANT_CODE: "",
                DEVICE_ID: "",
            },
            resultField: {
                DEVICE_ID: "",
            },
        };
    },
    watch: {
        "formField.DEVICE_ID": function (val) {
            this.resultField.DEVICE_ID = val;
            this.$nextTick(() => this.search());
        },
        "formField.PLANT_CODE": function () {
            this.queryEquipmentList();
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        queryEquipmentList() {
            queryDeviceList({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_TYPE: "2",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.DEVICE_ID = res.rows[0].DEVICE_ID;
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
        choose() {
            if (this.resultField.DEVICE_ID === "") return;
            this.$confirm("是否确认选择当前复制源?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$emit("choose", this.$refs.multipleTable.list);
                })
                .catch(() => {});
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_wrap {
    height: 400px;
    /deep/.filter-params {
        margin: 0;
    }
}
</style>
