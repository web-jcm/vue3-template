<template>
    <el-dialog
        visible
        :close-on-click-modal="true"
        :append-to-body="true"
        width="800px"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="作业指示格式设定输出"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <n-data-table
                ref="multipleTable"
                :key="oneTableKey"
                :dynamic-buttons="tableButtons"
                :dynamic-components="tableComponents"
                :dynamic-api-config="apiConfig"
                :dynamic-table-cols="tableCols"
                :dynamic-form-fields="formField"
                :dynamic-is-show-select="false"
                :dynamic-is-init-table="true"
                :dynamic-is-column-drop="false"
                :is-set-default-brand="false"
                :isShowPagination="false"
            >
            </n-data-table>
        </div>
    </el-dialog>
</template>
<script>
import { mesApis, getOutFormatDownload } from "@/api/apiList/mes";

export default {
    name: "selectFormat",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    props: {
        plantCode: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            apiConfig: mesApis.queryOutFormatDownloadList,
            tableButtons: [
                {
                    compKey: "btnKey_query",
                    type: "primary",
                    size: "small",
                    clickEvent: () => this.getOutFormatDownload(),
                    text: "导出",
                },
            ],
            tableComponents: [
                {
                    compKey: "TYPE",
                    labelName: "输出模式",
                    codeField: "TYPE",
                    component: () => import("@/components/org/radioBox"),
                    isComponent: true,
                    options: [
                        {
                            label: "全部接续设备输出",
                            value: "1",
                        },
                        {
                            label: "指定接续设备输出",
                            value: "2",
                        },
                    ],
                },
            ],
            tableCols: [
                {
                    prop: "DEVICE_ID",
                    label: "接续设备ID",
                },
                {
                    prop: "DEVICE_NAME",
                    label: "接续设备名",
                },
                {
                    prop: "SUB_DEVICE_TYPE",
                    label: "接续设备类型ID",
                },
                {
                    prop: "SUB_DEVICE_TYPE_NAME",
                    label: "接续设备类型名",
                },
                {
                    prop: "DESCRIPTION",
                    label: "接续设备类型说明",
                },
            ],
            formField: {
                PLANT_CODE: this.plantCode,
                TYPE: "1",
            },
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.TYPE": function (val) {
            this.clickRowsData = {};
            this.queryTable(1);
        },
    },
    methods: {
        getOutFormatDownload() {
            let DEVICE_IDs = [];
            if (this.formField.TYPE === "1") {
                this.$refs.multipleTable.list.forEach((item) => {
                    DEVICE_IDs.push(item.DEVICE_ID);
                });
            } else {
                if (!this.clickRowsData.DEVICE_ID) {
                    return this.$utils.message({
                        message: "请选择一条数据！",
                    });
                } else {
                    DEVICE_IDs.push(this.clickRowsData.DEVICE_ID);
                }
            }
            this.loading = this.$loading({
                lock: true,
                text: "导出中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            getOutFormatDownload({
                PLANT_CODE: this.formField.PLANT_CODE,
                DEVICE_ID_LIST: DEVICE_IDs,
            })
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach((item) => {
                            this.getFile(item.DEVICE_ID, item.DATA);
                        });
                    }
                    this.$utils.message({
                        message: res.msg,
                    });
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        getFile(name, text) {
            let link = document.createElement("a");
            let exportContent = "\uFEFF";
            let blob = new Blob([exportContent + text], {
                type: "text/plain;charset=utrf-8",
            });
            link.id = "download-csv";
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", name + ".csv");
            document.body.appendChild(link);
            link.click();
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_wrap {
    height: 500px;
    /deep/.filter-params {
        margin: 0;
    }
    /deep/ .operation-btn {
        padding-top: 0;
    }
    /deep/ .el-radio {
        width: 130px;
    }
}
</style>
