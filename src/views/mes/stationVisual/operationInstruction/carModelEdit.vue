<template>
    <el-dialog
        visible
        v-dialogDrag
        :append-to-body="true"
        width="600px"
        @close="cancel"
    >
        <dialogHeader
            slot="title"
            :title="textMap[showType]"
            :style-type="$store.state.app.dialogType"
        />
        <div class="form_wrap">
            <div class="flex row_between m_b_10">
                <div class="flex">
                    <div class="label"><i class="iconRequired"></i>车系</div>
                    <el-select
                        v-model="formField.carSerial"
                        @change="changeSelect"
                        :disabled="showType === 'edit'"
                    >
                        <el-option
                            v-for="item in carSerialArr"
                            :label="item.carSerial"
                            :value="item.carSerial"
                            :key="item.carSerial"
                        ></el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <div class="label">车型范围</div>
                    <el-radio-group v-model="formField.carModelRange">
                        <el-radio :label="'全部'">全部</el-radio>
                        <el-radio :label="'部分'">部分车型</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="flex row_between">
                <div class="label"><i class="iconRequiredNo"></i>备注</div>
                <el-input
                    type="textarea"
                    :rows="1"
                    placeholder="请输入内容"
                    v-model="formField.remark"
                >
                </el-input>
            </div>
            <div v-if="formField.carModelRange === '部分'" class="margin-style">
                <div class="flex margin-top-15">
                    <div class="label">车型</div>
                    <el-input
                        style="padding-right: 10px"
                        type="text"
                        placeholder="请输入内容"
                        v-model="carModel"
                    ></el-input>
                    <el-button type="primary" @click="changeSelect"
                        >查询</el-button
                    >
                </div>
                <el-table
                    class="margin-top-15"
                    ref="singleTable"
                    :data="tableData"
                    highlight-current-row
                    tooltip-effect="dark"
                    style="width: 100%; height: 300px"
                    @row-click="clickRow"
                >
                    <el-table-column type="selection" align="center">
                    </el-table-column>
                    <el-table-column
                        prop="carModel"
                        label="车型"
                        align="center"
                    >
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                size="small"
                :icon="loading ? 'el-icon-loading' : 'iconfont  icon-confirm'"
                :disabled="loading ? true : false"
                @click="save"
                >确认</el-button
            >
            <el-button
                size="small"
                icon="iconfont  icon-cancel"
                :disabled="loading ? true : false"
                @click="cancel"
                >取消</el-button
            >
        </div>
    </el-dialog>
</template>
<script>
import {
    queryCarSerial,
    queryCarModels,
    saveInstructorCarSerial,
    editInstructorCarSerial,
} from "@/api/apiList/mes";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        showType: {
            type: String,
            default: "add",
        },

        clickRowsData: {},
    },
    data() {
        return {
            loading: false,
            // 标题
            textMap: {
                add: "车型新增",
                edit: "车型修改",
            },
            carModel: undefined,
            carSerialArr: [],
            tableData: [],
            formField: {
                plantCode: this.$PLANT_CODE,
                carSerial: undefined,
                remark: undefined,
                carModelRange: "全部",
            },
            selectArr1: [],
            selectArr2: [],
        };
    },
    created() {
        console.log(this.clickRowsData);
        this.queryCarSerial();
        // if (this.showType === "edit" && this.clickRowsData.DEVICE_ID) {
        //     this.linkEquipmentDetail();
        // }
        if (this.showType === "edit") {
            this.setDefault();
        }
    },
    methods: {
        setDefault() {
            this.formField.carSerial = this.clickRowsData.carSerial;
            this.formField.carModelRange = this.clickRowsData.carModelRange;
            this.formField.remark = this.clickRowsData.remark;
            this.changeSelect();
        },
        clickRow(row) {
            this.$refs.singleTable.toggleRowSelection(row);
        },
        queryCarSerial() {
            queryCarSerial({ plantCode: this.formField.plantCode }).then(
                (res) => {
                    if (res.result === "1") {
                        this.carSerialArr = res.rows;
                        console.log(res.rows);
                    }
                }
            );
        },
        changeSelect() {
            const that = this;
            queryCarModels({
                plantCode: this.formField.plantCode,
                baseModel: this.formField.carSerial,
                model: this.carModel,
            }).then((res) => {
                if (res.result === "1") {
                    this.tableData = res.rows;
                    if (
                        this.formField.carModelRange === "部分" &&
                        this.showType == "edit"
                    ) {
                        const arr = this.clickRowsData.carModel.split(",");
                        console.log(arr);
                        this.$nextTick(() => {
                            that.tableData.forEach(function (item, i) {
                                console.log(item);
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i] == item.carModel) {
                                        that.$refs.singleTable.toggleRowSelection(
                                            item,
                                            true
                                        );
                                    }
                                }
                            });
                        });
                    }
                    // console.log(res.rows);
                }
            });
        },

        save() {
            if (!this.formField.carSerial) {
                return this.$utils.message({
                    message: "请选择车系!",
                });
            }
            if (
                this.formField.carModelRange === "部分" &&
                this.$refs.singleTable.selection.length == 0
            ) {
                return this.$utils.message({
                    message: "请选择至少选择一个车型!",
                });
            }
            // this.$confirm("确定要保存吗?", "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning",
            // })
            //     .then(() => {
            let saveItem = {
                plantCode: this.formField.plantCode,
                carSerial: this.formField.carSerial,
                carModelRange: this.formField.carModelRange,
                orderNo: 1,
                remark: this.formField.remark,
            };

            if (this.formField.carModelRange === "部分") {
                saveItem.instructorCarModelList = [];
                this.$refs.singleTable.selection.forEach(function (ec, i) {
                    saveItem.instructorCarModelList.push({
                        carModel: ec.carModel,
                        orderNo: i + 1,
                    });
                });
            }

            this.loading = true;
            if (this.showType === "edit") {
                saveItem.tableId = this.clickRowsData.tableId;
                editInstructorCarSerial(saveItem)
                    .then((res) => {
                        this.loading = false;
                        if (res.result === "1") {
                            this.$utils.message({
                                message: "修改成功！",
                            });
                            this.$emit("close", true);
                        } else {
                            this.$utils.message({
                                message: res.msg,
                            });
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        console.log(err);
                    });
            } else {
                saveInstructorCarSerial(saveItem)
                    .then((res) => {
                        this.loading = false;
                        if (res.result === "1") {
                            this.$utils.message({
                                message: "保存成功！",
                            });
                            this.$emit("close", true);
                        } else {
                            this.$utils.message({
                                message: res.msg,
                            });
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        console.log(err);
                    });
            }
            // })
            // .catch(() => {});
        },
        cancel() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.margin-top-15 {
    margin-top: 15px;
}
.form_wrap {
    padding: 16px;
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .row_between {
        justify-content: space-between;
        .el-input {
            width: 160px;
        }
        .el-select {
            width: 160px;
            line-height: 32px;
        }
    }
    .label {
        flex-shrink: 0;
        width: 100px;
    }

    /deep/ .el-textarea__inner {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
    }

    .margin-style {
        border-top: 1px solid lightgray;
        margin-top: 25px;
    }
}

.iconRequiredNo::before {
    content: "*";
    color: white;
    font-style: normal;
}
</style>
