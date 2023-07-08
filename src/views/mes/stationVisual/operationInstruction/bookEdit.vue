<template>
    <div>
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
                        <div class="label">
                            <i class="iconRequiredNo"></i>车系
                        </div>
                        <el-input
                            v-model="formField.carSerial"
                            :disabled="true"
                        >
                        </el-input>
                    </div>
                    <div class="flex" @click="showCarModel(formField.carModel)">
                        <div class="label">
                            <i class="iconRequiredNo"></i>车种
                        </div>
                        <el-input v-model="formField.carModel" :disabled="true">
                        </el-input>
                    </div>
                </div>
                <div class="flex row_between m_b_10">
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>车间
                        </div>
                        <el-select
                            v-model="formField.processLocation"
                            placeholder="请选择"
                            @change="changeSelect()"
                        >
                            <el-option
                                v-for="item in processArr"
                                :key="item.PROCESS_LOCATION"
                                :label="
                                    item.PROCESS_LOCATION_NAME +
                                    '(' +
                                    item.PROCESS_LOCATION +
                                    ')'
                                "
                                :value="item.PROCESS_LOCATION"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>工位
                        </div>
                        <el-select
                            v-model="formField.pointCode"
                            placeholder="请选择"
                            @change="changeSelect2"
                        >
                            <el-option
                                v-for="item in pointArr"
                                :key="item.POINT_CODE"
                                :label="
                                    item.POINT_NAME +
                                    '(' +
                                    item.POINT_CODE +
                                    '+)'
                                "
                                :value="item.POINT_CODE"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="flex row_between m_b_10">
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>卡片号
                        </div>
                        <el-input
                            v-model="formField.cardCode"
                            placeholder="请输入卡片号"
                        >
                        </el-input>
                    </div>
                    <div class="flex">
                        <div class="label">
                            <i class="iconRequired"></i>排序号
                        </div>
                        <el-input
                            type="number"
                            v-model="formField.orderNo"
                            placeholder=""
                        >
                        </el-input>
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
                <div class="flex margin-top-15">
                    <div class="label">
                        <i class="iconRequired"></i>图片上传
                    </div>
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img
                            v-if="formField.image"
                            :src="formField.image"
                            class="avatar"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-checkbox v-model="isContinue" class="margin-right-20"
                    >连续新增</el-checkbox
                >
                <el-button
                    type="primary"
                    size="small"
                    :icon="
                        loading ? 'el-icon-loading' : 'iconfont  icon-confirm'
                    "
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
        <el-dialog
            title="详细车种"
            v-dialogDrag
            :append-to-body="true"
            :visible="isShowCarModel"
            width="350px"
            @close="closeShowModel"
        >
            <div class="form_wrap">
                <el-table
                    :data="carModelData"
                    stripe
                    highlight-current-row
                    style="width: 100%; height: 100%"
                >
                    <el-table-column
                        type="index"
                        width="80"
                        label="序号"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        property="carModel"
                        label="车种"
                        align="center"
                    ></el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    queryLocation,
    getPointCode,
    saveInstructorManagement,
    editInstructorManagement,
    queryInstructorImage,
} from "@/api/apiList/mes";
import { ConsoleWriter } from "istanbul-lib-report";
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
        headData: {},
        formHome: {},
    },
    data() {
        return {
            isShowCarModel: false,
            carModelData: [],
            loading: false,
            // 标题
            textMap: {
                add: "作业指导书编辑",
                edit: "作业指导书修改",
            },
            carModel: undefined,
            processArr: [],
            pointArr: [],
            tableData: [],
            formField: {
                plantCode: this.$PLANT_CODE,
                carSerial: undefined,
                remark: undefined,
                carModel: undefined,
                processLocation: undefined,
                lineNo: undefined,
                pointCode: undefined,
                cardCode: undefined,
                orderNo: undefined,
                imageName: undefined,
                image: undefined,
            },
            isContinue: false,
            selectArr1: [],
            selectArr2: [],
            imageUrl: undefined,
        };
    },
    created() {
        // console.log(this.clickRowsData);
        // if (this.showType === "edit" && this.clickRowsData.DEVICE_ID) {
        //     this.linkEquipmentDetail();
        // }
        this.formField.carSerial = this.headData.carSerial;
        this.formField.carModel = this.headData.carModel;
        if (this.showType === "edit") {
            this.setDefault();
            this.showEditImage(this.clickRowsData);
        }
        this.queryLocation();
        if (this.showType === "add" && this.formHome.processLocation) {
            this.formField.processLocation = this.formHome.processLocation;
            this.formField.lineNo = this.formHome.lineNo;
            this.changeSelect();

            this.formField.pointCode = this.formHome.pointCode;
        }
    },
    methods: {
        closeShowModel() {
            this.isShowCarModel = false;
            this.carModelData = [];
        },
        showCarModel(model) {
            if (model && model != "全部") {
                const arr = model.split(",");
                let list = [];
                arr.forEach(function (item) {
                    list.push({ carModel: item });
                });
                this.carModelData = list;
                this.isShowCarModel = true;
                console.log(this.carModelData);
            }
        },
        showEditImage(row) {
            const params = {
                imageFtpUrl: "/" + row.imageFtpUrl,
                ftpImageName: row.ftpImageName,
            };
            this.isLoading = true;
            queryInstructorImage(params).then((res) => {
                const blob = new Blob([res], {
                    type: "application/octet-stream;charset=UTF-8",
                });
                // const url = URL.createObjectURL(blob);
                var file = new File([blob], row.ftpImageName);
                this.getBase64(file)
                    .then((data) => {
                        // const base = data.split(",")[1];
                        this.isLoading = false;
                        this.formField.image = data;
                        // console.log(this.imgUrlList);
                    })
                    .catch(() => {});
            });
        },
        // 图片转 base64
        getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        },
        beforeAvatarUpload(file) {
            const isJPG =
                file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 5;

            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG或者PNG 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 5MB!");
                return false;
            }
            this.formField.imageName = file.name;
            this.getBase64(file)
                .then((data) => {
                    // const base = data.split(",")[1];
                    this.formField.image = data;
                })
                .catch(() => {});

            // isJPG &&
            return false;
        },
        queryLocation() {
            queryLocation({ plantCode: this.formField.plantCode }).then(
                (res) => {
                    if (res.result === "1") {
                        this.processArr = res.rows;
                        console.log(res.rows);
                    }
                }
            );
        },
        changeSelect() {
            this.pointArr = [];
            this.formField.pointCode = undefined;
            getPointCode({
                plantCode: this.formField.plantCode,
                processLocation: this.formField.processLocation,
            })
                .then((res) => {
                    if (res.result === "1") {
                        console.log(res);
                        if (res.rows) {
                            this.pointArr = res.rows;
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
            // getPassingPoint({
            //   plantCode: this.formField.plantCode,
            //   processLocation: this.formField.processLocation,
            // }).then((res) => {
            //   if (res.result === '1') {
            //     this.pointArr = res.rows
            //     console.log(res.rows)
            //   }
            // })
        },

        changeSelect2(item) {
            console.log(item);
            for (let i = 0; i < this.pointArr.length; i++) {
                if (item == this.pointArr[i].POINT_CODE) {
                    this.formField.lineNo = this.pointArr[i].LINE_NO;
                }
            }
        },
        setDefault() {
            // this.formField.carSerial = this.clickRowsData.carSerial;
            // this.formField.carModelRange = this.clickRowsData.carModelRange;
            this.formField.processLocation = this.clickRowsData.processLocation;
            this.changeSelect();
            this.formField.lineNo = this.clickRowsData.lineNo;
            this.formField.pointCode = this.clickRowsData.pointCode;
            this.formField.cardCode = this.clickRowsData.cardCode;
            this.formField.orderNo = this.clickRowsData.orderNo;
            this.formField.image = this.clickRowsData.image;
            this.formField.imageName = this.clickRowsData.imageName;
            this.formField.remark = this.clickRowsData.remark;
            // this.changeSelect();
        },
        clickRow(row) {
            this.$refs.singleTable.toggleRowSelection(row);
        },

        save() {
            if (!this.formField.processLocation) {
                return this.$utils.message({
                    message: "请选择车间!",
                });
            }
            if (!this.formField.pointCode) {
                return this.$utils.message({
                    message: "请选择工位!",
                });
            }
            if (!this.formField.cardCode) {
                return this.$utils.message({
                    message: "请填写卡片号!",
                });
            }
            if (!this.formField.orderNo) {
                return this.$utils.message({
                    message: "请填写排序号!",
                });
            }
            if (!this.formField.image) {
                return this.$utils.message({
                    message: "请选择图片!",
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
                processLocation: this.formField.processLocation,
                lineNo: this.formField.lineNo,
                pointCode: this.formField.pointCode,
                cardCode: this.formField.cardCode,
                orderNo: this.formField.orderNo,
                remark: this.formField.remark,
                image: this.formField.image,
                imageName: this.formField.imageName,
                instructorCarSerialID: this.headData.tableId,
            };

            this.loading = true;
            if (this.showType === "edit") {
                saveItem.tableId = this.clickRowsData.tableId;
                editInstructorManagement(saveItem)
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
                saveInstructorManagement(saveItem)
                    .then((res) => {
                        this.loading = false;
                        if (res.result === "1") {
                            this.$utils.message({
                                message: "保存成功！",
                            });
                            if (this.isContinue) {
                                this.formField.cardCode = undefined;
                                this.formField.orderNo = undefined;
                                this.formField.image = undefined;
                                this.formField.imageName = undefined;
                                this.formField.remark = undefined;
                                this.$emit("noCloseRefresh");
                            } else {
                                this.$emit("close", true);
                            }
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

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

/deep/ .el-checkbox__input {
    cursor: pointer;
    outline: 0;
    line-height: 3;
    vertical-align: middle;
}

.iconRequiredNo::before {
    content: "*";
    color: white;
    font-style: normal;
}
.margin-right-20 {
    margin-right: 20px;
}
</style>
