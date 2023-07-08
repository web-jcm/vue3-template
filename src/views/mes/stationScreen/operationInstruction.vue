<template>
    <div class="app-container app-container-table clip">
        <el-row>
            <el-col :span="8">
                <div class="flex">
                    <div class="label">车型：</div>
                    <el-input
                        class="width-300"
                        type="text"
                        placeholder="请输入内容"
                        v-model="formField.carModel"
                    ></el-input>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="flex">
                    <div class="label">卡片代码：</div>
                    <el-input
                        class="width-300"
                        type="text"
                        placeholder="请输入内容"
                        v-model="formField.cardCode"
                    ></el-input>
                </div>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="queryList" class="buttonStyle"
                    >查询</el-button
                >
                <el-button type="" @click="defaultQuery" class="buttonStyle"
                    >重置</el-button
                >
            </el-col>
        </el-row>

        <el-row class="height-100 margin-top-20">
            <el-col :span="8">
                <el-table
                    v-loading="loading"
                    ref="singleTable"
                    :data="tableData"
                    highlight-current-row
                    tooltip-effect="dark"
                    style="width: 100%; height: 100%"
                    :stripe="true"
                    :border="true"
                    @row-click="preview"
                    :header-row-style="{ height: '40px' }"
                    :row-style="{ height: '70px' }"
                    :cell-style="{ padding: '2px' }"
                    height="calc(100vh-300px)"
                >
                    <el-table-column
                        type="index"
                        width="80"
                        label="序号"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="carModel"
                        label="车型"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="cardCode"
                        label="卡片代码"
                        width="300"
                        align="center"
                    >
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="16" v-loading="isLoading" class="colImageStyle">
                <el-image
                    class="imageStyle"
                    style="width: 100%; height: 100%"
                    fit="fill"
                    :src="url"
                    :preview-src-list="srcList"
                >
                    <div slot="error" class="image-slot"></div>
                </el-image>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {
    queryInstructorManagement,
    queryInstructorImage,
} from "@/api/apiList/mes";
import Moment from "moment";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        pointCode: {
            type: String,
            default: "0",
        },
        currentCarInfo: {},
    },
    data() {
        return {
            isLoading: false,
            url: undefined,
            srcList: [],
            loading: false,
            standTime: undefined,
            formField: {
                carModel: undefined,

                cardCode: undefined,
            },

            tableData: [],
        };
    },
    created() {},
    watch: {
        currentCarInfo: {
            handler(newValue, oldValue) {
                if (newValue) {
                    if (
                        !oldValue ||
                        (oldValue && newValue.ctrlKey != oldValue.ctrlKey)
                    ) {
                        //查询装车清单
                        // console.log(this.currentCarInfo)
                        this.formField.carModel = this.currentCarInfo.model;
                        this.queryList();
                        this.url = undefined;
                    }
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        preview(row) {
            const params = {
                imageFtpUrl: row.imageFtpUrl,
                ftpImageName: row.ftpImageName,
            };
            this.isLoading = true;
            queryInstructorImage(params).then((res) => {
                const blob = new Blob([res], {
                    type: "application/octet-stream;charset=UTF-8",
                });
                this.srcList = [];
                this.url = URL.createObjectURL(blob);
                this.srcList.push(this.url);
                this.isLoading = false;
            });
        },
        closeViewer() {
            this.showImage = false;
            this.imgUrlList = [];
        },
        queryList() {
            queryInstructorManagement({
                plantCode: this.$PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                processLocation: this.currentCarInfo.processLocation,
                lineNo: this.currentCarInfo.lineNo,
                pointCode: this.formField.pointCode,
                carSerial: this.currentCarInfo.baseModel,
                carModel: this.formField.carModel || this.currentCarInfo.model,
                cardCode: this.formField.cardCode,
                needImage: 0,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableData = res.rows;
                        if (res.rows.length > 0) {
                            this.$refs.singleTable.toggleRowSelection(
                                res.rows[0],
                                true
                            );
                            this.$refs.singleTable.setCurrentRow(res.rows[0]);
                            this.preview(res.rows[0]);
                        } else {
                            this.url = undefined;
                            this.srcList = [];
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.tableData = [];
                    console.log(err);
                });
        },
        defaultQuery() {
            this.formField.carModel = undefined;
            this.formField.cardCode = undefined;
            this.queryList();
        },
    },
};
</script>
<style lang="scss" scoped>
.halfStyle {
    height: 50%;
    text-align: left;
}

.currentStyle {
    background-color: white;
    margin-bottom: 10px;
}
.margin-top-20 {
    margin-top: 20px;
}

.margin-bottom-10 {
    margin-bottom: 10px;
}

.flex {
    display: flex;
    align-items: center;
    height: 100%;
    text-align: left;
}

.label {
    flex-shrink: 0;
    width: 180px;
    text-align: left;
    margin-left: 10px;
}

/deep/ .el-col {
    position: relative;
    font-size: 32px;
    height: 100%;
}

.text-center {
    text-align: center;
}

.height-100 {
    height: 100%;
}
.clip {
    overflow-x: clip;
    height: 92%;
}
.buttonStyle {
    height: 48px;
    margin-left: 30px;
    width: 200px;
}

/deep/ .el-button span {
    font-size: 18px;
    padding: 0 5px;
    vertical-align: bottom;
}

/deep/ .el-input--small .el-input__inner {
    height: 48px !important;
    line-height: 48px;
    color: #333;
    padding-left: 8px;
    min-width: 0px;
    font-size: 24px;
}

.width-300 {
    width: 300px;
}

.imageStyle {
    padding-left: 20px;
}
.important {
    color: red;
}

/deep/ .el-table {
    height: 100%;
    font-size: 28px;
    position: relative;
}

/deep/ .el-table__empty-text {
    position: absolute;
    display: block;
    width: 105px;
    height: 90px;
    left: calc(50% - 52.5px);
    background: url(/vue-dist/mesControl/static/img/biaogewushuju@1x.c9f9c8d6.png)
        no-repeat top;
    background-size: 100% 100%;
    color: #909399;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // line-height: 180px;
    font-size: 24px;
}
</style>
