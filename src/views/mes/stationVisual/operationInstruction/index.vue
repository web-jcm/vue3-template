<template>
    <div class="contain_wrap">
        <div class="main_wrap">
            <div class="table_wrap">
                <div class="width5">
                    <div class="flex operation_btn">
                        <div class="title title-style">车种车系列表</div>
                        <div class="flex">
                            <el-button
                                icon="iconfont icon-synchronization"
                                @click="refresh1()"
                                >刷新</el-button
                            >
                            <el-button
                                icon="iconfont icon-query"
                                @click="query1()"
                                >查询</el-button
                            >
                            <el-button
                                icon="iconfont icon-newlyAdded"
                                @click="add1()"
                                >新增</el-button
                            >
                            <el-button
                                icon="iconfont icon-applicationComplaint"
                                @click="edit1()"
                                >修改</el-button
                            >
                            <el-button
                                icon="iconfont icon-quanbushanchu"
                                @click="delete1()"
                                type="danger"
                                >删除</el-button
                            >
                        </div>
                    </div>
                    <div class="flex operation_btn labelContentQuery">
                        <div class="flex labelContent labelContentQuery">
                            <label class="labelW">车种:</label>
                            <el-input
                                v-model="formField.carModel"
                                placeholder=""
                            ></el-input>
                        </div>
                    </div>
                    <el-table
                        ref="tableDataL"
                        :data="tableDataL"
                        stripe
                        highlight-current-row
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="calc(100% - 94px)"
                        @row-click="clickRow"
                        @selection-change="handleSelectionChangeL"
                    >
                        <el-table-column
                            type="index"
                            width="60"
                            label="序号"
                            align="center"
                        >
                        </el-table-column>

                        <el-table-column
                            prop="carSerial"
                            label="车系"
                            width="200"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="carModel"
                            label="车种"
                            width="300"
                            align="center"
                        >
                            <template v-slot="scope">
                                <div @click="showCarModel(scope.row.carModel)">
                                    {{ scope.row.carModel }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="备注"
                            align="center"
                            prop="remark"
                        >
                        </el-table-column>
                    </el-table>
                </div>
                <div class="width5 m_l_40">
                    <div class="flex operation_btn">
                        <div class="title title-style">指导书明细</div>
                        <div class="flex">
                            <el-button
                                icon="iconfont icon-synchronization"
                                @click="refresh2()"
                                >刷新</el-button
                            >
                            <el-button
                                icon="iconfont icon-query"
                                @click="query2()"
                                >查询</el-button
                            >
                            <el-button
                                icon="iconfont icon-newlyAdded"
                                @click="add2()"
                                >新增</el-button
                            >
                            <el-button
                                icon="iconfont icon-applicationComplaint"
                                @click="edit2()"
                                >修改</el-button
                            >
                            <el-button
                                icon="iconfont icon-quanbushanchu"
                                @click="delete2()"
                                type="danger"
                                >删除</el-button
                            >
                        </div>
                    </div>
                    <div class="flex operation_btn labelContentQuery">
                        <el-row class="labelContent">
                            <el-col :span="12">
                                <div
                                    class="flex labelContent labelContentQuery"
                                >
                                    <label class="labelW">车间:</label>
                                    <el-select
                                        v-model="formField.processLocation"
                                        placeholder="请选择"
                                        @change="changeSelect"
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
                            </el-col>
                            <el-col :span="12" class="padding-left-5">
                                <div
                                    class="flex labelContent labelContentQuery"
                                >
                                    <label class="labelW">工位:</label>
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
                                                ')'
                                            "
                                            :value="item.POINT_CODE"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-table
                        v-loading="isLoading"
                        ref="tableDataR"
                        stripe
                        highlight-current-row
                        :data="tableDataR"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @row-click="clickRow2"
                        height="calc(100% - 94px)"
                        @selection-change="handleSelectionChangeR"
                    >
                        <el-table-column
                            prop="orderNo"
                            width="60"
                            label="排序号"
                            align="center"
                        >
                        </el-table-column>

                        <el-table-column
                            prop="pointName"
                            label="工位"
                            width="200"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="cardCode"
                            label="卡片号"
                            width="200"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="pp"
                            label="指导书预览"
                            width="200"
                            align="center"
                        >
                            <template v-slot="scope">
                                <el-button
                                    @click="preview(scope.row)"
                                    type="success"
                                    >预览图片</el-button
                                >
                                <!-- <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.image"
                                    :preview-src-list="[scope.row.image]"
                                >
                                </el-image> -->
                                <!-- <el-button
                                    @click="preview(scope.row)"
                                    type="success"
                                    >指导书预览</el-button 
                                >-->
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="备注"
                            align="center"
                            prop="remark"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- <el-image
            v-if="showImage"
            style="width: 100px; height: 100px"
            :src="imgUrl"
            :preview-src-list="[imgUrl]"
        >
        </el-image> -->
        <el-image-viewer
            v-if="showImage"
            :urlList="imgUrlList"
            :on-close="closeViewer"
        ></el-image-viewer>
        <edit-car
            :showType="showType"
            :clickRowsData="selectedRow"
            v-if="editCar"
            @close="closeDialog1"
        />
        <edit-book
            :showType="showType2"
            :formHome="formField"
            :headData="selectedRow"
            :clickRowsData="selectedRow2"
            v-if="editBook"
            @close="closeDialog2"
            @noCloseRefresh="noCloseRefresh"
        />
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
import { orgApis } from "@/api/apiList/org";
import Moment from "moment";
import {
    queryInstructorCarSerial,
    queryInstructorManagement,
    queryLocation,
    getPointCode,
    deleteInstructorCarSerial,
    deleteInstructorManagement,
    queryInstructorImage,
} from "@/api/apiList/mes";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
    name: "productionTypeManagement",
    components: {
        EditCar: () => import("./carModelEdit"),
        EditBook: () => import("./bookEdit"),
        ElImageViewer,
    },
    // 组件混入对象
    mixins: [],
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        return {
            isShowCarModel: false,
            carModelData: [],
            isLoading: false,
            showImage: false,
            imgUrl: undefined,
            imgUrlList: [],
            // 网格查询API配置对象
            apiConfig: orgApis.wmBuCommonQueryFindAll,
            options: [
                {
                    value: this.$PLANT_CODE,
                    label: "猛士工厂",
                },
            ],
            formField: {
                plantCode: this.$PLANT_CODE,
                carModel: undefined,
                pointCode: undefined,
                processLocation: undefined,
            },
            editBook: false,
            editCar: false,
            showType: undefined,
            showType2: undefined,
            selectedRow: undefined,
            selectedRow2: undefined,
            tableDataL: [],
            tableDataR: [],
            processArr: [],
            pointArr: [],
            loading: null,
            currentCode: "",
        };
    },
    created() {
        this.search();
        this.queryLocation();
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
        // 图片转 base64
        getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        },
        preview(row) {
            const params = {
                imageFtpUrl: "/" + row.imageFtpUrl,
                ftpImageName: row.ftpImageName,
            };
            this.isLoading = true;
            queryInstructorImage(params).then((res) => {
                const blob = new Blob([res], {
                    type: "application/octet-stream;charset=UTF-8",
                });
                const url = URL.createObjectURL(blob);
                this.isLoading = false;
                this.showImage = true;
                this.imgUrlList = [url];
                // var file = new File([blob], row.ftpImageName);
                // this.getBase64(file)
                //     .then((data) => {
                //         // const base = data.split(",")[1];
                //         this.isLoading = false;
                //         this.showImage = true;
                //         this.imgUrlList = [data];
                //         console.log(this.imgUrlList);
                //     })
                //     .catch(() => {});
            });
        },
        closeViewer() {
            this.showImage = false;
            this.imgUrlList = [];
        },
        queryLocation() {
            queryLocation({ plantCode: this.formField.plantCode }).then(
                (res) => {
                    if (res.result === "1") {
                        this.processArr = res.rows;
                    }
                }
            );
        },
        changeSelect(item) {
            this.pointArr = [];
            this.formField.pointCode = undefined;
            // this.formField.lineNo = item.lineNo;
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
        },
        changeSelect2(item) {
            if (this.pointArr.length > 0) {
                for (var i = 0; i < this.pointArr.length; i++) {
                    if (item == this.pointArr[i].POINT_CODE) {
                        this.formField.lineNo = this.pointArr[i].LINE_NO;
                    }
                }
            }
            // console.log(this.formField);
        },
        search() {
            const that = this;
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryInstructorCarSerial({
                plantCode: this.formField.plantCode,
                // tenancyId: this.$store.state.user.tenancyId,
                carModel: this.formField.carModel,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableDataL = [];
                        res.rows.forEach((item, index) => {
                            item.index = index;
                            this.tableDataL.push(item);
                        });
                        if (res.rows.length > 0) {
                            this.$nextTick(function () {
                                that.$refs.tableDataL.toggleRowSelection(
                                    res.rows[0],
                                    true
                                );
                                that.$refs.tableDataL.setCurrentRow(
                                    res.rows[0]
                                );
                                that.selectedRow = res.rows[0];
                                that.queryRightTable();
                            });
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.tableDataR = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        handleSelectionChangeL() {},
        handleSelectionChangeR() {},
        selectRow(row, oldRow) {
            this.selectedRow = row;
            this.queryRightTable();
        },
        queryRightTable() {
            if (!this.selectedRow) {
                this.$utils.message({
                    message: "请先选择车系车型数据！",
                });
                return;
            }
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryInstructorManagement({
                plantCode: this.formField.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                carSerialID: this.selectedRow.tableId,
                processLocation: this.formField.processLocation,
                pointCode: this.formField.pointCode,
                needImage: 0,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableDataR = [];
                        res.rows.forEach((item, index) => {
                            item.index = index;
                            this.tableDataR.push(item);
                        });
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.tableDataR = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        clickRow(row) {
            // this.$refs.multipleTableL.toggleRowSelection(row);
            this.selectedRow = row;
            this.queryRightTable();
        },
        clickRow2(row) {
            // this.$refs.multipleTableL.toggleRowSelection(row);
            this.selectedRow2 = row;
        },
        refresh1() {
            this.formField.carModel = undefined;
            this.selectedRow = undefined;
            this.selectedRow2 = undefined;
            this.search();
        },
        refresh2() {
            this.formField.processLocation = undefined;
            this.formField.pointCode = undefined;
            this.queryRightTable();
        },
        query1() {
            this.search();
        },
        query2() {
            this.queryRightTable();
        },
        add1() {
            this.showType = "add";
            this.editCar = true;
        },
        edit1() {
            if (!this.selectedRow) {
                this.$utils.message({
                    message: "请选择要修改数据！",
                });
                return;
            }
            this.showType = "edit";
            this.editCar = true;
        },
        closeDialog1(isSaved) {
            this.editCar = false;
            if (isSaved) {
                this.search();
            }
        },
        closeDialog2(isSaved) {
            this.editBook = false;
            if (isSaved) {
                this.queryRightTable();
            }
        },
        noCloseRefresh() {
            this.queryRightTable();
        },
        delete1() {
            if (!this.selectedRow) {
                this.$utils.message({
                    message: "请先选择车系车型数据！",
                });
                return;
            }
            this.$confirm("是否删除当前选中车型?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.loading = this.$loading({
                    lock: true,
                    text: "删除中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                deleteInstructorCarSerial({
                    plantCode: this.formField.plantCode,
                    tenancyId: this.$store.state.user.tenancyId,
                    tableId: this.selectedRow.tableId,
                })
                    .then((res) => {
                        this.$utils.message({
                            message: res.msg,
                        });
                        this.loading.close();
                        this.search();
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },

        add2() {
            if (!this.selectedRow) {
                this.$utils.message({
                    message: "请先选择车系车型数据！",
                });
                return;
            }
            this.showType2 = "add";
            this.editBook = true;
        },
        edit2() {
            if (!this.selectedRow) {
                this.$utils.message({
                    message: "请先选择车系车型数据！",
                });
                return;
            }
            if (!this.selectedRow2) {
                this.$utils.message({
                    message: "请选择要修改数据！",
                });
                return;
            }
            this.showType2 = "edit";
            this.editBook = true;
        },
        delete2() {
            console.log(this.selectedRow2);
            if (!this.selectedRow2) {
                this.$utils.message({
                    message: "请先选择作业指导书数据！",
                });
                return;
            }
            this.$confirm("是否删除当前选中作业指导书?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.loading = this.$loading({
                    lock: true,
                    text: "删除中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                deleteInstructorManagement({
                    plantCode: this.formField.plantCode,
                    tenancyId: this.$store.state.user.tenancyId,
                    tableId: this.selectedRow2.tableId,
                })
                    .then((res) => {
                        this.$utils.message({
                            message: res.msg,
                        });
                        this.loading.close();
                        this.queryRightTable();
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.title-style {
    font-size: 20px;
}
.labelContentQuery {
    display: block;
}
.labelContent {
    width: 100%;
}
.labelW {
    width: 40px;
}
.padding-left-5 {
    padding-left: 5px;
}
@import "@/styles/mes/productionTypeManagement/productionTypeManagement.scss";

/deep/ .el-input__inner {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
}
</style>
