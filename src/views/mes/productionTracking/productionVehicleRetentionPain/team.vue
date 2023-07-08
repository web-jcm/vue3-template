<template>
    <el-dialog
        visible
        v-dialogDrag
        :append-to-body="true"
        width="800px"
        @close="cancel"
    >
        <dialogHeader
            slot="title"
            :title="title"
            :style-type="$store.state.app.dialogType"
        />
        <div class="form_wrap" v-loading="loading">
            <el-row>
                <el-col :span="10"
                    ><b>管理号：</b> {{ carInfo.ctrlKey }}</el-col
                >
                <el-col :span="8"
                    ><b>焊装连续编号：</b> {{ carInfo.orderNum }}</el-col
                >
                <el-col :span="6"
                    ><b>类&emsp;型：</b>
                    {{ carType == "1" ? "车身" : "车架" }}</el-col
                >
            </el-row>
            <el-row>
                <el-col :span="10"
                    ><b>车&emsp;种：</b> {{ carInfo.model }}</el-col
                >
                <el-col :span="8"><b>区域：</b> {{ carInfo.ZONE_NAME }}</el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <!-- <el-card class="box-card margin-top-10">
        <div slot="header"
          class="clearfix">
          <el-tag>车辆信息</el-tag>
        </div>
        <div class="text item">
          <b>管理号：</b> {{ carInfo.ctrlKey }}
        </div>
        <div class="text item">
          <b>焊装连续编号：</b> {{ carInfo.orderNum }}
        </div>
        <div class="text item">
          <b>类&emsp;型：</b>
          {{ carType == "1" ? "车身" : "车架" }}
        </div>
        <div class="text item">
          <b>车&emsp;种：</b> {{ carInfo.model }}
        </div>
        <div class="text-label sure-state">

          <b>区&emsp;域：</b> {{carInfo.ZONE_NAME}}
        </div>
      </el-card> -->
            <el-row class="margin-top-10">
                <el-col :span="10">
                    <span class="label">生产线：</span>
                    <el-select
                        v-model="copyData.LINE_NO"
                        @change="copyData.ZONE_CODE = undefined"
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
                </el-col>
                <el-col :span="10">
                    <span class="label">区域：</span>
                    <el-select
                        v-model="copyData.ZONE_CODE"
                        @change="search"
                        placeholder="请选择区域"
                    >
                        <el-option
                            v-for="item in zoneList"
                            :key="item.ZONE_CODE"
                            :label="item.ZONE_NAME"
                            :value="item.ZONE_CODE"
                            :disabled="
                                clickRowsData.retainZoneCode === item.ZONE_CODE
                            "
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4"> </el-col>
            </el-row>

            <div class="table_wrap" style="margin-top: 10px">
                <el-table
                    height="100%"
                    ref="multipleTableR"
                    :data="tableData"
                    tooltip-effect="dark"
                    row-key="CTRL_KEY"
                    :highlight-current-row="true"
                >
                    <!-- <el-table-column type="selection"
            width="55"
            align="center"
            v-if="formField.isSame !== '1'"></el-table-column> -->
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                    ></el-table-column>
                    <el-table-column prop="BATCH_NO" label="计划批次">
                    </el-table-column>
                    <el-table-column prop="CTRL_KEY" label="管理号">
                    </el-table-column>
                    <el-table-column prop="VIN" label="VIN" width="140">
                    </el-table-column>
                    <el-table-column
                        prop="MODEL"
                        label="车型"
                        width="140"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="CONFIGURATION"
                        label="配置"
                        width="60"
                    >
                    </el-table-column>
                    <el-table-column prop="COLOR_K" label="外饰色" width="50">
                    </el-table-column>
                    <el-table-column prop="COLOR_I" label="内饰色" width="50">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <span class="label">移动到序号：</span>
            <el-input-number
                v-model="insertIdx"
                style="width: 30%; margin-right: 15px"
                placeholder="输入序号"
                :min="1"
                :precision="0"
                size="mini"
            ></el-input-number>
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
    queryTrackingPTF,
    SaveRestoreCarRetain,
    queryLineNo,
    getCarSearchZone,
    queryLookupValues,
    getCarInfo,
} from "@/api/apiList/mes";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        clickRowsData: {},
    },
    data() {
        return {
            zone: undefined,
            carType: "1",
            loading: false,
            // 标题
            title: "涂装车辆入线",
            searchValue: undefined,
            processLocation: "P",
            copyData: {},
            lineList: [],
            zoneList: [],
            insertIdx: undefined,
            tableData: [],
            selectArr: [],
            zoneArr: [],
            formField: {},
            carInfo: {},
            rules: {},
            pageConfig: {
                total: 0,
                currentPage: 1,
            },
        };
    },
    created() {
        console.log(this.clickRowsData);
        // if (this.showType === "edit" && this.clickRowsData.DEVICE_ID) {
        //     this.linkEquipmentDetail();
        // }
        this.queryLineNo();
        this.queryCarInfo();
    },
    methods: {
        queryCarInfo() {
            // this.carInfo.ctrlKey = ec.slice(1, 11)
            const _this = this;

            const params = {
                PLANT_CODE: this.$PLANT_CODE,
                carType: this.clickRowsData.productType,
                searchKey: "ctrlKey",
                searchValue: this.clickRowsData.ctrlKey,
                lineNo: this.clickRowsData.lineNo,
                processLocation: this.clickRowsData.processLocation,
            };
            this.loading = true;
            getCarInfo(params).then((res) => {
                console.log(res);
                if (res.result === "1") {
                    if (res.rows.length > 0) {
                        const item = res.rows[0];
                        _this.carInfo.model = item.MODEL;
                        _this.carInfo.ctrlKey = item.CTRL_KEY;
                        _this.carInfo.orderNum = item.BODY_SERIAL_NO;
                        _this.carInfo.zoneCode = item.ZONE_CODE;
                        _this.carInfo.ZONE_NAME = item.ZONE_NAME;
                    }
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                }
                this.loading = false;
            });
        },
        save() {
            if (!this.copyData.ZONE_CODE) {
                this.$alert("请选择区域！", "提示");
                return;
            }
            // if (this.tableData.length == 0) {
            //   this.$alert('请先搜索区域车辆！', '提示')
            //   return
            // }

            if (!this.insertIdx) {
                this.$alert("请填写移动到序号！", "提示");
                return;
            }
            if (this.insertIdx > this.tableData.length + 1) {
                this.$alert(
                    "移动到序号最大只能是" + (this.tableData.length + 1) + "！",
                    "提示"
                );
                return;
            }

            const _this = this;
            const params = {
                plantCode: this.$PLANT_CODE,
                processLocation: this.processLocation,
                lineNo: this.copyData.LINE_NO,
                productType: this.clickRowsData.productType,
                ctrlKey: this.clickRowsData.ctrlKey,
                zoneCode1: this.clickRowsData.retainZoneCode,
                zoneCode2: this.copyData.ZONE_CODE,
                position: this.insertIdx,
            };
            this.loading = true;
            SaveRestoreCarRetain(params).then((res) => {
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
        },
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
                            this.copyData.LINE_NO = res.rows[0].LINE_NO;
                        }
                        // }
                        this.getCarSearchZone();
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
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.$PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "PRODUCT_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.PRODUCT_TYPE =
                            res.rows[0].LOOKUP_VALUE_CODE;
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
        getCarSearchZone() {
            getCarSearchZone({
                PLANT_CODE: this.$PLANT_CODE,
                LINE_NO: this.copyData.LINE_NO,
                PROCESS_LOCATION: this.processLocation,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.zoneList = res.rows;
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
        async search() {
            if (!this.copyData.LINE_NO || !this.copyData.ZONE_CODE) {
                return this.$utils.message({
                    message: "请选择生产线和区域!",
                });
            }
            this.changeArr = [];
            // this.loading = this.$loading({
            //   lock: true,
            //   text: '请求中',
            //   background: 'rgba(0, 0, 0, 0.7)',
            // })
            await this.queryTrackingPTF2();
            // this.loading.close()
        },

        queryTrackingPTF2() {
            let pram = {
                PLANT_CODE: this.$PLANT_CODE,
                LINE_NO: this.copyData.LINE_NO,
                PRODUCT_TYPE: this.clickRowsData.productType,
                ZONE_CODE: this.copyData.ZONE_CODE,
            };
            return queryTrackingPTF(pram)
                .then((res) => {
                    this.tableData = [];
                    if (res.result === "1" && res.rows) {
                        this.pageConfig.total = res.records;
                        this.pageConfig.currentPage = res.pageindex;
                        this.tableData = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.tableData = [];
                    this.loading.close();
                    console.log(err);
                });
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

    /deep/ .el-input__suffix-inner {
        line-height: 32px;
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
