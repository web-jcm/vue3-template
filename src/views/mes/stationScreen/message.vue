<template>
    <div class="app-container app-container-table clip">
        <el-row class="margin-bottom-15">
            <el-col :span="8">
                <div class="flex">
                    <div class="label">主题：</div>
                    <el-input
                        type="text"
                        placeholder="请输入内容"
                        v-model="form.noticeTitle"
                    ></el-input>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="flex">
                    <div class="label">日期范围：</div>
                    <el-date-picker
                        class="width-100"
                        v-model="form.createdDateSE"
                        type="datetimerange"
                        range-separator="至"
                        format="yyyy-MM-dd HH:mm"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        prefix-icon=""
                    >
                    </el-date-picker>
                </div>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="queryMain" class="buttonStyle"
                    >查询</el-button
                >

                <el-button
                    class="margin-left-20 buttonStyle"
                    type="primary"
                    @click="readAll"
                    >标记全部已读</el-button
                >
                <el-button type="" @click="defaultQuery" class="buttonStyle"
                    >重置</el-button
                >
            </el-col>
        </el-row>
        <el-row class="margin-bottom-15">
            <el-col :span="8">
                <div class="flex">
                    <div class="label">状态：</div>
                    <el-select v-model="form.isRead" class="width-100">
                        <el-option
                            class="optionStyle"
                            v-for="item in stateTypeArr"
                            :label="item.typeName"
                            :value="item.type"
                            :key="item.type"
                        ></el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="flex">
                    <div class="label">消息类型：</div>
                    <el-select v-model="form.noticeType" class="width-100">
                        <el-option
                            class="optionStyle"
                            v-for="item in mesTypeArr"
                            :label="item.typeName"
                            :value="item.type"
                            :key="item.type"
                        ></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-table
            v-loading="loading"
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            tooltip-effect="dark"
            @row-click="clickRow"
            :stripe="true"
            :border="true"
            :header-row-style="{ height: '80px' }"
            :row-style="{ height: '83px' }"
            :cell-style="{ padding: '2px' }"
            :height="`calc(100vh-420px)`"
        >
            <el-table-column
                type="index"
                width="80"
                label="序号"
                align="center"
            >
            </el-table-column>
            <el-table-column prop="noticeTitle" label="主题" align="center">
            </el-table-column>
            <el-table-column prop="createdDate" label="消息时间" align="center">
            </el-table-column>
            <el-table-column prop="noticeType" label="类型" align="center">
            </el-table-column>
            <el-table-column prop="isRead" label="已读" align="center">
                <template v-slot="scope">
                    <span v-if="scope.row.isRead == '1'" class="green"
                        >已读</span
                    ><span v-if="scope.row.isRead == '0'" class="red"
                        >未读</span
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageIndex"
            :page-sizes="[5, 10, 30, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.records"
            :prev-text="'上一页'"
            :next-text="'下一页'"
            class="pagenationStyle"
        >
        </el-pagination>
    </div>
</template>

<script>
import { queryPointNotice, pointNoticeRead } from "@/api/apiList/mes";
import moment from "moment";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        pointCode: {
            type: String,
            default: "0",
        },
    },
    data() {
        return {
            loading: false,
            currentPage: 1,
            mesTypeArr: [
                { typeName: "全部", type: "" },
                { typeName: "消息", type: "1" },
                { typeName: "错误", type: "2" },
                { typeName: "警告", type: "3" },
            ],

            stateTypeArr: [
                { typeName: "全部", type: "" },
                { typeName: "未读", type: "0" },
                { typeName: "已读", type: "1" },
            ],
            form: {
                noticeTitle: undefined,
                createdDateSE: [
                    moment(new Date()).startOf("day"),
                    moment(new Date()).endOf("day"),
                ],
                noticeType: "",
                isRead: "",
            },
            page: { pageIndex: 1, pageSize: 5, records: 0 },
            tableData: [],
            canShowAlert: true,
        };
    },
    created() {
        this.queryPointNotice();
    },
    watch: {
        pointCode: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.queryPointNotice();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.page.pageSize = val;
            this.queryPointNotice();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page.pageIndex = val;
            this.queryPointNotice();
        },
        defaultQuery() {
            this.form = {
                noticeTitle: undefined,
                createdDateSE: [
                    moment(new Date()).startOf("day"),
                    moment(new Date()).endOf("day"),
                ],
                noticeType: "",
                isRead: "",
            };
            this.queryPointNotice();
        },
        queryMain() {
            this.queryPointNotice();
        },
        readAll() {
            if (this.tableData.length > 0) {
                const list = [];
                this.tableData.forEach(function (item) {
                    if (item.isRead == "0") {
                        list.push(item.tableId);
                    }
                });
                // console.log(list)
                if (list.length > 0) {
                    const str = list.join(",");
                    pointNoticeRead({ tableIds: str }).then((res) => {
                        if (res.result === "1") {
                            this.queryMain();
                        }
                    });
                } else {
                    this.$alert("表格内的数据已经全部是已读状态了！", "提示");
                }
            } else {
                this.$alert("没有可操作的数据！", "提示");
            }
        },
        queryPointNotice() {
            const that = this;
            this.loading = true;
            const params = {
                pageIndex: this.page.pageIndex,
                pageSize: this.page.pageSize,
                plantCode: this.$PLANT_CODE,
                pointCode: this.pointCode,
                noticeTitle: this.form.noticeTitle,
                SDT: moment(this.form.createdDateSE[0]).format(
                    "YYYY-MM-DD HH:mm:ss"
                ),
                EDT: moment(this.form.createdDateSE[1]).format(
                    "YYYY-MM-DD HH:mm:ss"
                ),
                noticeType: this.form.noticeType,
                isRead: this.form.isRead,
            };
            queryPointNotice(params).then((res) => {
                this.loading = false;
                this.queryErrorPointNotice();
                if (res.result === "1") {
                    this.tableData = res.rows;
                    // res.rows.forEach(function (item) {
                    //   if (item.isRead == '0' && item.noticeType == '错误')
                    //     that
                    //       .$confirm(item.noticeContent, item.noticeTitle, {
                    //         confirmButtonText: '确定',
                    //         cancelButtonText: '取消',
                    //         type: 'warning',
                    //       })
                    //       .then(() => {
                    //         if (item.isRead == '0') {
                    //           pointNoticeRead({ tableIds: item.tableId }).then((res) => {
                    //             if (res.result === '1') {
                    //               that.queryMain()
                    //             }
                    //           })
                    //         }
                    //       })
                    //       .catch(() => {})
                    // })
                    this.page.records = res.records;
                    // console.log(res.rows)
                }
            });
        },
        queryErrorPointNotice() {
            const that = this;
            const params = {
                pageIndex: 1,
                pageSize: 1,
                plantCode: this.$PLANT_CODE,
                pointCode: this.pointCode,
                SDT: moment(new Date())
                    .startOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                EDT: moment(new Date())
                    .endOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                noticeType: "2",
                isRead: "0",
            };
            queryPointNotice(params).then((res) => {
                if (res.result === "1") {
                    if (!this.canShowAlert) {
                        return;
                    }
                    res.rows.forEach(function (item) {
                        that.canShowAlert = false;
                        that.$confirm(item.noticeContent, item.noticeTitle, {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnClickModal: false,
                            type: "warning",
                        })
                            .then(() => {
                                that.canShowAlert = true;
                                if (item.isRead == "0") {
                                    pointNoticeRead({
                                        tableIds: item.tableId,
                                    }).then((res) => {
                                        if (res.result === "1") {
                                            that.queryMain();
                                        }
                                    });
                                }
                            })
                            .catch(() => {
                                that.canShowAlert = true;
                            });
                    });
                    // console.log(res.rows)
                }
            });
        },
        clickRow(row) {
            // console.log(row);
            this.$confirm(row.noticeContent, row.noticeTitle, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    if (row.isRead == "0") {
                        pointNoticeRead({ tableIds: row.tableId }).then(
                            (res) => {
                                if (res.result === "1") {
                                    this.queryMain();
                                }
                            }
                        );
                    }
                })
                .catch(() => {});
            // this.$alert(row.noticeContent, row.noticeTitle, {
            //   customClass: 'customAlertClass',
            // })
        },
    },
};
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    align-items: center;
}

.margin-top-15 {
    margin-top: 15px;
}

.margin-bottom-15 {
    margin-bottom: 15px;
}

.margin-left-20 {
    margin-left: 20px;
}

.width-100 {
    width: 100%;
}

.green {
    color: green;
}

.red {
    color: red;
}
/deep/ .el-icon-time {
    display: none;
}

/deep/ .el-date-editor .el-range-separator {
    padding: 0px;
    font-size: 12px;
    width: 18px;
    line-height: 24px;
    position: relative;
    left: -9px;
}
/deep/ .el-col {
    position: relative;
    font-size: 32px;
    height: 100%;
}
.buttonStyle {
    height: 48px;
    margin-left: 30px;
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
.label {
    flex-shrink: 0;
    width: 200px;
    text-align: right;
    margin-left: 10px;
}
.width-300 {
    width: 300px;
}
/deep/ .el-input__suffix-inner {
    pointer-events: all;
    // line-height: 48px;
}
/deep/ .el-range-editor .el-range-input {
    font-size: 12px;
}
/deep/ .el-range-editor--small.el-input__inner {
    height: 48px;
}

/deep/ .el-date-editor .el-range-separator {
    padding: 0px;
    font-size: 18px;
    width: 18px;
    line-height: 38px;
    position: relative;
    left: -9px;
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

/deep/ .width-100 .el-input .el-input__suffix .el-input__suffix-inner {
    line-height: 48px !important;
}

.optionStyle {
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    padding: 0 8px;
}

.clip {
    overflow-x: clip;
}
</style>

<style>
.customAlertClass {
    font-size: 32px;
}

/* .el-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  font-size: 24px;
  line-height: 1;
  color: #303133;
}

.el-message-box__content {
  padding: 10px 15px;
  color: #606266;
  font-size: 24px !important;
} */

/* .el-button span {
  font-size: 20px;
  padding: 0 5px;
  vertical-align: bottom;
} */
</style>
