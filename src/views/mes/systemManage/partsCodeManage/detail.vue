<template>
    <el-dialog
        visible
        :append-to-body="true"
        width="800px"
        top="20px"
        @close="handleClose"
    >
        <dialogHeader
            slot="title"
            title="条码明细"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <div class="btn_wrap">
                <el-button @click="add">新 增</el-button>
            </div>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column label="条码项">
                    <template v-slot="scope">
                        <el-select
                            v-model="scope.row.barCodeItemCode"
                            clearable
                            @change="changeKey(scope.row)"
                        >
                            <el-option
                                v-for="item in select"
                                :key="item.LOOKUP_VALUE_CODE"
                                :label="item.LOOKUP_VALUE_NAME"
                                :value="item.LOOKUP_VALUE_CODE"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="barCodeItemName"
                    label="条码项名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="规格开始位置">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.barCodeItemIndex"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="规格长度">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.barCodeItemLength"
                            v-rule="scope.row.barCodeItemCode"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template v-slot="scope">
                        <el-button type="primary" @click="del(scope.row)"
                            >删 除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog_footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import {
    queryPartsCodeDetail,
    savePartsCodeDetail,
    queryLookupValues,
} from "@/api/apiList/mes";
export default {
    name: "detail",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), //弹窗标题
    },
    props: {
        plantCode: {
            type: String,
            default: "",
        },
        tableId: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            tableData: [],
            select: [
                {
                    value: "factoryName",
                    name: "厂家名称",
                },
                {
                    value: "partName",
                    name: "零件名称",
                },
                {
                    value: "partCode",
                    name: "零件码",
                },
                {
                    value: "serialNo",
                    name: "序列号",
                },
            ],
        };
    },
    mounted() {
        this.queryPartsCodeDetail();
        this.queryLookupValues();
    },
    methods: {
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "KEYPARTS_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.select = res.rows;
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
        handleClose() {
            this.$emit("close");
        },
        queryPartsCodeDetail() {
            this.loading = this.$loading({
                lock: true,
                text: "保存中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryPartsCodeDetail({
                plantCode: this.plantCode,
                pId: this.tableId,
            })
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach((item, index) => {
                            item.index = index;
                        });
                        this.tableData = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        save() {
            let index = 0;
            this.tableData.some((sel, idx) => {
                if (
                    !sel.barCodeItemCode ||
                    sel.barCodeItemName === "" ||
                    sel.barCodeItemIndex === "" ||
                    sel.barCodeItemLength === ""
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
                        savePartsCodeDetail({
                            plantCode: this.plantCode,
                            ROWS: this.tableData,
                        })
                            .then((res) => {
                                this.loading.close();
                                this.$utils.message({
                                    message: res.msg,
                                });
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
            let index = 0;
            this.tableData.some((sel, idx) => {
                if (
                    !sel.barCodeItemCode ||
                    sel.barCodeItemName === "" ||
                    sel.barCodeItemIndex === "" ||
                    sel.barCodeItemLength === ""
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
                this.tableData.push({
                    index: this.tableData.length,
                    pId: this.tableId,
                    barCodeItemCode: "",
                    barCodeItemIndex: "",
                    barCodeItemLength: "",
                    barCodeItemName: "",
                });
            }
        },
        del(row) {
            this.tableData.splice(row.index, 1);
            this.tableData.forEach((item, index) => {
                item.index = index;
            });
        },
        changeKey(row) {
            this.select.some((sel) => {
                if (sel.LOOKUP_VALUE_CODE === row.barCodeItemCode) {
                    row.barCodeItemName = sel.LOOKUP_VALUE_NAME;
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.popup_wrap {
    .btn_wrap {
        padding: 10px;
    }
    .dialog_footer {
        display: flex;
        padding: 10px;
        justify-content: flex-end;
    }
}
</style>
