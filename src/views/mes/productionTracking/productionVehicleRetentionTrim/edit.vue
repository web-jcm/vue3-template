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
        <div class="form_wrap" v-loading="loading">
            <div class="margin-style">
                <span class="label">生产线：</span>
                <el-select
                    v-model="LINE_NO"
                    @change="changeQuery"
                    placeholder="请选择生产线"
                >
                    <el-option
                        v-for="item in lineList"
                        :key="item.LINE_NO"
                        :label="item.LINE_NAME"
                        :value="item.LINE_NO"
                    >
                    </el-option>
                </el-select>
                <div class="flex margin-top-15" v-if="showType != 'edit'">
                    <div class="label">车辆信息搜索</div>
                    <el-radio v-model="carType" @change="changeQuery" label="1"
                        >车身</el-radio
                    >
                    <el-radio v-model="carType" @change="changeQuery" label="2"
                        >车架</el-radio
                    >
                    <el-input
                        style="padding-right: 10px"
                        type="text"
                        placeholder="请输入管理号搜索"
                        v-model="searchValue"
                    ></el-input>
                    <el-button type="primary" @click="search">查询</el-button>
                </div>
                <el-card class="box-card margin-top-10">
                    <div slot="header" class="clearfix">
                        <el-tag>车辆信息</el-tag>
                    </div>
                    <div class="text item">
                        <b>管理号：</b> {{ carInfo.ctrlKey }}
                    </div>
                    <div class="text item">
                        <b>总装连续编号：</b> {{ carInfo.orderNum }}
                    </div>
                    <div class="text item">
                        <b>类&emsp;型：</b>
                        {{ carType == "1" ? "车身" : "车架" }}
                    </div>
                    <div class="text item">
                        <b>车&emsp;种：</b> {{ carInfo.model }}
                    </div>
                    <div class="text-label sure-state">
                        <b>区&emsp;域：</b> {{ carInfo.ZONE_NAME }}
                    </div>
                </el-card>
            </div>
            <el-form
                :model="exce"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="保留区域：">
                    <el-select
                        v-model="zone"
                        placeholder="请选择"
                        @change="changeSelect"
                    >
                        <el-option
                            v-for="item in zoneArr"
                            :key="item.ZONE_CODE"
                            :label="item.ZONE_NAME"
                            :value="item.ZONE_CODE"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保留时长：">
                    <el-col :span="8">
                        <el-form-item class="shortCol">
                            <el-input
                                v-model="exce.exceptionDay"
                                type="number"
                                @blur="change"
                            ></el-input
                            ><span class="margin-left-5"> 天</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="shortCol">
                            <el-input
                                v-model="exce.exceptionHour"
                                type="number"
                                @blur="change1"
                            ></el-input
                            ><span class="margin-left-5"> 时</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="shortCol">
                            <el-input
                                v-model="exce.exceptionMi"
                                type="number"
                                @blur="change2"
                            ></el-input
                            ><span class="margin-left-5"> 分</span>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="保留原因：">
                    <el-select
                        v-model="exce.exceptionCode"
                        placeholder="请选择"
                        @change="changeSelect"
                    >
                        <el-option
                            v-for="item in selectArr"
                            :key="item.LOOKUP_VALUE_CODE"
                            :label="item.LOOKUP_VALUE_NAME"
                            :value="item.LOOKUP_VALUE_CODE"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                size="small"
                :icon="loading ? 'el-icon-loading' : 'iconfont  icon-confirm'"
                :disabled="disBtn || loading ? true : false"
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
    getCarInfo,
    getCarExcetionInfo,
    weldingRepairSubmit,
    saveCarRetain,
    queryRetainReason,
    queryZone,
    queryLineNo,
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
            zone: undefined,
            carType: "1",
            loading: false,
            lineList: [],
            LINE_NO: undefined,
            disBtn: false,
            processLocation: "T",
            // 标题
            textMap: {
                add: "总装车辆弹出",
            },
            searchValue: undefined,
            carInfo: {
                model: undefined,
                ctrlKey: undefined,
                orderNum: undefined,
            },
            restoreStatus: undefined,

            selectArr: [],
            zoneArr: [],
            exce: {
                exceptionDay: undefined,
                exceptionHour: undefined,
                exceptionMi: undefined,
                exceptionCode: undefined,
                exceptionCause: undefined,
            },
            rules: {},
        };
    },
    created() {
        console.log(this.clickRowsData);
        // if (this.showType === "edit" && this.clickRowsData.DEVICE_ID) {
        //     this.linkEquipmentDetail();
        // }
        this.queryRetainReason();
        this.queryLineNo();
        // this.queryZone()
        if (this.showType === "edit") {
            this.setDefault();
        }
    },
    methods: {
        queryLineNo() {
            queryLineNo({
                plantCode: this.$PLANT_CODE,
                processLocation: this.processLocation,
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.lineList = res.rows;
                        // if (this.formField.isSame === '0') {
                        if (res.rows.length > 0) {
                            this.LINE_NO = res.rows[0].LINE_NO;
                            this.queryZone();
                        }

                        // }
                        // this.getCarSearchZone()
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
        changeSelect(item) {
            // console.log(item);
            for (let i = 0; i < this.selectArr.length; i++) {
                if (item == this.selectArr[i].LOOKUP_VALUE_CODE) {
                    this.exce.exceptionCause =
                        this.selectArr[i].LOOKUP_VALUE_NAME;
                }
            }
        },
        queryRetainReason() {
            const params = {
                lookupTypeCode: "CAR_RETAIN_REASON",
            };
            queryRetainReason(params).then((res) => {
                // console.log(res);
                if (res.result === "1") {
                    this.selectArr = res.rows;
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                }
            });
        },
        changeQuery() {
            this.zone = undefined;
            this.carInfo = {};
            this.queryZone();
        },
        queryZone() {
            const params = {
                plantCode: this.$PLANT_CODE,
                processLocation: this.processLocation,
                lineNo: this.LINE_NO,
                isVisual: "1",
                isRetainZone: "1",
                carType: this.carType,
            };
            queryZone(params).then((res) => {
                // console.log(res);
                if (res.result === "1") {
                    this.zoneArr = res.rows;
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                }
            });
        },
        setDefault() {
            this.exce.exceptionDay = this.clickRowsData.exceptionDay;
            this.exce.exceptionHour = this.clickRowsData.exceptionHour;
            this.exce.exceptionMi = this.clickRowsData.exceptionMi;
            this.exce.exceptionCode = this.clickRowsData.exceptionCode;
            this.exce.exceptionCause = this.clickRowsData.exceptionCause;
            this.searchValue =
                this.clickRowsData.productType + this.clickRowsData.ctrlKey;
            this.search();
        },
        change() {
            if (this.exce.exceptionDay < 1) {
                this.exce.exceptionDay = undefined;
            }
        },
        change1() {
            if (!this.exce.exceptionHour) {
                return;
            }
            if (this.exce.exceptionHour > 23) {
                this.exce.exceptionHour = 23;
            }
            if (this.exce.exceptionHour < 1) {
                this.exce.exceptionHour = 1;
            }
        },
        change2() {
            if (!this.exce.exceptionMi) {
                return;
            }
            if (this.exce.exceptionMi > 59) {
                this.exce.exceptionMi = 59;
            }
            if (this.exce.exceptionMi < 1) {
                this.exce.exceptionMi = 1;
            }
        },
        save() {
            if (!this.carInfo.ctrlKey) {
                this.$alert("请先输入车辆管理号搜索车辆信息", "提示");
                return;
            }
            if (!this.zone) {
                this.$alert("请选择保留区域！", "提示");
                return;
            }
            if (
                !this.exce.exceptionDay &&
                !this.exce.exceptionHour &&
                !this.exce.exceptionMi
            ) {
                this.$alert("请填写影响时长", "提示");
                return;
            }

            const _this = this;
            const params = {
                plantCode: this.$PLANT_CODE,
                processLocation: this.processLocation,
                productType: this.carType,
                lineNo: this.LINE_NO,
                ctrlKey: this.carInfo.ctrlKey,
                exceptionDay: this.exce.exceptionDay,
                exceptionHour: this.exce.exceptionHour,
                exceptionMi: this.exce.exceptionMi,
                exceptionCode: this.exce.exceptionCode,
                exceptionCause: this.exce.exceptionCause,
                exceptionType: "1",
                zoneCode1: this.carInfo.zoneCode,
                zoneCode2: this.zone,
            };
            this.loading = true;
            if (this.showType === "edit") {
                saveCarRetain(params).then((res) => {
                    console.log(res);
                    if (res.result === "1") {
                        this.$message({
                            message: "修改保存成功！",
                            type: "success",
                        });
                        this.$emit("close", true);
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "warning",
                        });
                    }
                    this.loading = false;
                });
            } else {
                saveCarRetain(params).then((res) => {
                    console.log(res);
                    if (res.result === "1") {
                        this.$message({
                            message: "保存成功！",
                            type: "success",
                        });
                        this.$emit("close", true);
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "warning",
                        });
                    }
                    this.loading = false;
                });
            }
        },
        search() {
            if (!this.searchValue) {
                this.$message({
                    message: "请先输入车辆信息管理号搜索车辆信息",
                    type: "warning",
                });
                return;
            }
            this.carInfo = {};
            this.queryCarInfo(this.searchValue);
        },
        queryCarInfo(ec) {
            this.disBtn = false;
            // this.carInfo.ctrlKey = ec.slice(1, 11)
            const _this = this;
            if (ec.length == 9) {
                const params = {
                    PLANT_CODE: this.$PLANT_CODE,
                    carType: this.carType,
                    searchKey: "ctrlKey",
                    searchValue: ec,
                    lineNo: this.LINE_NO,
                    processLocation: this.processLocation,
                };
                this.loading = true;
                this.getCarExcetionInfo(ec);
                getCarInfo(params).then((res) => {
                    console.log(res);
                    if (res.result === "1") {
                        if (res.rows.length > 0) {
                            const item = res.rows[0];
                            _this.carInfo.model = item.MODEL;
                            _this.carInfo.ctrlKey = item.CTRL_KEY;
                            _this.carInfo.orderNum = item.TRIM_SERIAL_NO;
                            _this.carInfo.zoneCode = item.ZONE_CODE;
                            _this.carInfo.ZONE_NAME = item.ZONE_NAME;
                            if (item.IS_RETAIN_ZONE == "1") {
                                //禁止弹出
                                this.disBtn = true;
                            }
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "warning",
                        });
                    }
                    this.loading = false;
                });
            } else {
                this.$message({
                    message: "请输入9位管理号！",
                    type: "warning",
                });
            }
        },
        getCarExcetionInfo(ec) {
            // this.carInfo.ctrlKey = ec.slice(1, 11)
            const _this = this;
            if (ec.length >= 10) {
                const params = {
                    pageIndex: 0,
                    pageSize: 0,
                    PLANT_CODE: this.$PLANT_CODE,
                    processLocation: "HZ",
                    productType: this.carInfo.carType,
                    ctrlKey: ec,
                };
                this.isLoading = true;
                getCarExcetionInfo(params).then((res) => {
                    console.log(res);
                    if (res.result === "1") {
                        if (res.rows.length > 0) {
                            const item = res.rows[0];
                            this.exce.exceptionDay = item.exceptionDay;
                            this.exce.exceptionHour = item.exceptionHour;
                            this.exce.exceptionMi = item.exceptionMi;
                            this.exce.exceptionCause = item.exceptionCause;
                            this.restoreStatus = item.restoreStatus;
                            console.log(res);
                            // _this.carInfo.model = item.MODEL
                            // _this.carInfo.ctrlKey = item.CTRL_KEY
                            // _this.carInfo.orderNum = item.BODY_SERIAL_NO
                        } else {
                            this.exce = {
                                exceptionDay: undefined,
                                exceptionHour: undefined,
                                exceptionMi: undefined,
                                exceptionCause: undefined,
                            };
                        }
                    }
                    this.isLoading = false;
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

/deep/ .shortCol {
    width: 60%;
    height: 32px;
    .el-form-item__content {
        display: flex;
    }
}
/deep/ .el-col {
    height: 32px;
}
.margin-top-10 {
    margin-top: 10px;
}

.margin-left-5 {
    margin-left: 5px;
}
/deep/ .el-card__header {
    padding: 0;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
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
            // line-height: 32px;
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
        border-bottom: 1px solid lightgray;
        margin-bottom: 25px;
    }
}

.iconRequiredNo::before {
    content: "*";
    color: white;
    font-style: normal;
}
</style>
