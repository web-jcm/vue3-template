<template>
    <el-dialog
        visible
        :append-to-body="true"
        width="80%"
        top="20px"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            :title="textMap[popupsState]"
            :style-type="$store.state.app.dialogType"
        />
        <div class="form_wrap">
            <div class="label1">文字列变换设定</div>
            <div class="flex m_b_10">
                <div class="label2">文字列变换设定ID</div>
                <el-input
                    v-model="formData.CHAR_CONV_ID"
                    :disabled="popupsState === 'edit'"
                    size="mini"
                ></el-input>
            </div>
            <div class="flex m_b_10">
                <div class="label2">文字列变换设定名</div>
                <el-input
                    v-model="formData.CHAR_CONV_NAME"
                    size="mini"
                ></el-input>
            </div>
            <div class="flex m_b_10">
                <div class="label2">文字列变换设定说明</div>
                <el-input v-model="formData.DESCRIPTION" size="mini"></el-input>
            </div>
            <div class="label2">文字列变换设定详情</div>
            <el-table
                class="m_b_10"
                height="180"
                ref="multipleTable2"
                :data="tableData2"
                v-loading="loading2"
                tooltip-effect="dark"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column prop="CATEGORY_CODE" label="基准类别编号">
                </el-table-column>
                <el-table-column prop="CATEGORY_NAME" label="基准类别名">
                </el-table-column>
                <el-table-column label="文字列变换模式" align="center">
                    <template v-slot="scope">
                        <el-checkbox v-model="scope.row.isCheck"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="文字列变换开始位置">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.CHAR_CONV_START"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="EDIT_DATA_TYPE"
                    label="文字列变换数据类型"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="文字列变换数据类名">
                    <template v-slot="scope">
                        <el-select
                            v-model="scope.row.EDIT_DATA_TYPE"
                            clearable
                            @change="changeType(scope.row)"
                        >
                            <el-option
                                v-for="item in selectArr"
                                :key="item.LOOKUP_VALUE_CODE"
                                :label="item.LOOKUP_VALUE_NAME"
                                :value="item.LOOKUP_VALUE_CODE"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="KEY_ID_1"
                    label="文字列变换Key数据"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="文字列变换Key数据名">
                    <template v-slot="scope">
                        <el-select
                            v-model="scope.row.KEY_NAME_1"
                            clearable
                            :loading="keyLoading"
                            @change="changeKey(scope.row)"
                            @click.native="queryCarEditDown(scope.row)"
                            v-if="keyObj[scope.row.EDIT_DATA_TYPE]"
                        >
                            <el-option
                                v-for="item in keyObj[scope.row.EDIT_DATA_TYPE]"
                                :key="item.KEY_CODE1"
                                :label="item.KEY_VALUE1"
                                :value="item.KEY_VALUE1"
                            >
                            </el-option>
                        </el-select>
                        <el-select
                            v-model="scope.row.KEY_NAME_1"
                            :loading="keyLoading"
                            @click.native="queryCarEditDown(scope.row)"
                            v-else
                        >
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex m_b_10">
                <div class="m_r_10">文字列变换源文字数</div>
                <el-input
                    class="text_input m_r_10"
                    v-model="formData.CHAR_CONV_ORG_SIZE"
                    oninput="value=value.replace(/[^0-9$]/g,'')"
                    size="mini"
                ></el-input>
                <div class="m_r_10">文字列变换后文字数</div>
                <el-input
                    class="text_input"
                    v-model="formData.CHAR_CONV_CONV_SIZE"
                    oninput="value=value.replace(/[^0-9$]/g,'')"
                    size="mini"
                ></el-input>
            </div>
            <el-table
                height="180"
                ref="multipleTable3"
                :data="tableData3"
                v-loading="loading3"
                tooltip-effect="dark"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column label="文字列变换前数据">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.CHAR_CONV_ORG_DATA"
                            oninput="value=value.replace(/[^A-Z0-9 $]/g,'')"
                            @change="addRow"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="文字列变换后数据">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.CHAR_CONV_CONV_DATA"
                            oninput="value=value.replace(/[^A-Z0-9 $]/g,'')"
                            @change="addRow"
                        ></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog_footer">
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="closeMoule">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import {
    queryCarEditDown,
    queryWordChangeDetail,
    queryWordChangeData,
    queryLookupValues,
    saveWordChange,
} from "@/api/apiList/mes";
export default {
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
        popupsState: {
            type: String,
            default: "add",
        },
        currentRow: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            // 标题
            textMap: {
                edit: "文字列变换设定编辑",
                add: "文字列变换设定新增",
            },
            loading1: false,
            tableData2: [],
            loading2: false,
            tableData3: [],
            loading3: false,
            selectArr: [],
            keyObj: {},
            keyLoading: false,
            formData: {
                WI_CHAR_CONV_ID: "",
                CHAR_CONV_ID: "",
                CHAR_CONV_NAME: "",
                DESCRIPTION: "",
                CHAR_CONV_ORG_SIZE: "",
                CHAR_CONV_CONV_SIZE: "",
            },
        };
    },
    created() {
        if (this.popupsState === "edit") {
            this.formData.WI_CHAR_CONV_ID = this.currentRow.WI_CHAR_CONV_ID;
            this.formData.CHAR_CONV_ID = this.currentRow.CHAR_CONV_ID;
            this.formData.CHAR_CONV_NAME = this.currentRow.CHAR_CONV_NAME;
            this.formData.DESCRIPTION = this.currentRow.DESCRIPTION;
            this.formData.CHAR_CONV_ORG_SIZE =
                this.currentRow.CHAR_CONV_ORG_SIZE;
            this.formData.CHAR_CONV_CONV_SIZE =
                this.currentRow.CHAR_CONV_CONV_SIZE;
            this.queryWordChangeData();
        } else {
            this.tableData3.push({
                CHAR_CONV_ORG_DATA: "",
                CHAR_CONV_CONV_DATA: "",
            });
        }
        this.queryLookupValues();
        this.queryWordChangeDetail();
    },
    methods: {
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "EDIT_DATA_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr = res.rows;
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
        queryWordChangeDetail() {
            this.loading2 = true;
            queryWordChangeDetail({
                PLANT_CODE: this.plantCode,
                CATEGORY_TYPE: "W1", // W1:作业指示  P2：总装
                WI_CHAR_CONV_ID:
                    this.popupsState === "edit"
                        ? this.currentRow.WI_CHAR_CONV_ID
                        : "",
                IS_ALL: this.popupsState === "edit" ? "1" : "0",
            })
                .then((res) => {
                    this.loading2 = false;
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach((item) => {
                            item.isCheck =
                                item.CHAR_CONV_MODE === "1" ? true : false;
                        });
                        this.tableData2 = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading2 = false;
                    console.log(err);
                });
        },
        queryCarEditDown(row) {
            if (this.keyObj[row.EDIT_DATA_TYPE] || !row.EDIT_DATA_TYPE) return;
            this.keyLoading = true;
            queryCarEditDown({
                PLANT_CODE: this.plantCode,
                IS_SEARCH: 1,
                EDIT_DATA_TYPE: row.EDIT_DATA_TYPE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        let arr1 = [],
                            arr2 = [];
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
                        this.keyObj[row.EDIT_DATA_TYPE] = arr2;
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
        queryWordChangeData() {
            this.loading3 = true;
            queryWordChangeData({
                PLANT_CODE: this.plantCode,
                WI_CHAR_CONV_ID: this.formData.WI_CHAR_CONV_ID,
            })
                .then((res) => {
                    this.loading3 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData3 = res.rows;
                        this.tableData3.push({
                            CHAR_CONV_ORG_DATA: "",
                            CHAR_CONV_CONV_DATA: "",
                        });
                    } else if (res.result === "0") {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading3 = false;
                    console.log(err);
                });
        },
        save() {
            if (this.formData.CHAR_CONV_ID === "") {
                return this.$utils.message({
                    message: "请输入设定ID！",
                });
            }
            if (this.formData.CHAR_CONV_ID === "") {
                return this.$utils.message({
                    message: "请输入设定名！",
                });
            }
            if (this.formData.CHAR_CONV_ORG_SIZE === "") {
                return this.$utils.message({
                    message: "请输入文字列变换源文字数！",
                });
            }
            if (this.formData.CHAR_CONV_CONV_SIZE === "") {
                return this.$utils.message({
                    message: "请输入文字列变换后文字数！",
                });
            }
            let arr = [];
            let flag = false;
            this.tableData2.forEach((item) => {
                item.CHAR_CONV_MODE = item.isCheck ? "1" : "0";
                if (item.isCheck) {
                    if (
                        item.CHAR_CONV_START !== "" &&
                        item.EDIT_DATA_TYPE &&
                        item.KEY_ID_1
                    ) {
                        arr.push(item);
                    } else {
                        flag = true;
                    }
                } else if (item.CONV_COND_ID) {
                    arr.push(item);
                }
            });
            if (flag) {
                return this.$utils.message({
                    message: "请把已勾选变换模式的基准类别填写完整！",
                });
            }
            let idx = null;
            this.tableData3.some((item, index) => {
                if (
                    item.CHAR_CONV_ORG_DATA?.length >
                        this.formData.CHAR_CONV_ORG_SIZE ||
                    item.CHAR_CONV_CONV_DATA?.length >
                        this.formData.CHAR_CONV_CONV_SIZE
                ) {
                    idx = index;
                    return true;
                }
            });
            if (idx !== null) {
                return this.$utils.message({
                    message: `第${idx + 1}行的文字列变换数据超过文字数！`,
                });
            }
            this.$confirm("是否保存当前修改?", "提示", {
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
                    saveWordChange({
                        PLANT_CODE: this.plantCode,
                        WI_CHAR_CONV_ID: this.formData.WI_CHAR_CONV_ID,
                        CHAR_CONV_ID: this.formData.CHAR_CONV_ID,
                        CHAR_CONV_NAME: this.formData.CHAR_CONV_NAME,
                        DESCRIPTION: this.formData.DESCRIPTION,
                        CHAR_CONV_CONV_SIZE: this.formData.CHAR_CONV_CONV_SIZE,
                        CHAR_CONV_ORG_SIZE: this.formData.CHAR_CONV_ORG_SIZE,
                        CONV_TYPE: "1", // 1:作业指示  2：总装
                        ROWS: arr,
                        DATA_ROWS: this.tableData3,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            this.closeMoule();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        changeType(row) {
            if (row.EDIT_DATA_TYPE) {
                this.selectArr.some((sel) => {
                    if (sel.LOOKUP_VALUE_CODE === row.EDIT_DATA_TYPE) {
                        row.EDIT_DATA_NAME = sel.LOOKUP_VALUE_NAME;
                        return true;
                    }
                });
                this.queryCarEditDown(row);
            } else {
                row.EDIT_DATA_NAME = "";
            }
            row.KEY_NAME_1 = "";
            row.KEY_ID_1 = "";
        },
        changeKey(row) {
            if (row.KEY_NAME_1) {
                this.keyObj[row.EDIT_DATA_TYPE].some((sel) => {
                    if (sel.KEY_VALUE1 === row.KEY_NAME_1) {
                        row.KEY_ID_1 = sel.KEY_CODE1;
                        return true;
                    }
                });
            } else {
                row.KEY_ID_1 = "";
            }
        },
        addRow() {
            let flag = true;
            this.tableData3.some((item) => {
                if (
                    item.CHAR_CONV_ORG_DATA === "" &&
                    item.CHAR_CONV_CONV_DATA === ""
                ) {
                    flag = false;
                    return true;
                }
            });
            if (flag) {
                this.tableData3.push({
                    CHAR_CONV_ORG_DATA: "",
                    CHAR_CONV_CONV_DATA: "",
                });
            }
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.form_wrap {
    height: 650px;
    background: #fff;
    padding: 16px;
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .m_r_10 {
        margin-right: 10px;
    }
    .btn_wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-button {
            margin-left: 10px;
        }
    }
    .label1 {
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .label2 {
        width: 150px;
        font-size: 14px;
    }
    .text_input {
        width: 100px;
    }
    .dialog_footer {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
