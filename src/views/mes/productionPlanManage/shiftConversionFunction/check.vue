<template>
    <el-dialog
        v-model:visible="dialogVisible"
        :close-on-click-modal="true"
        :append-to-body="true"
        width="800px"
        top="10%"
        @close="closeMoule"
    >
        <dialogHeader
            slot="title"
            title="班转换条件维护"
            :style-type="$store.state.app.dialogType"
        />
        <div class="popup_wrap">
            <div class="title">班转换基准:班结束后</div>
            <el-table
                height="100%"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    width="55"
                    align="center"
                >
                </el-table-column>
                <el-table-column prop="sectionCode" label="管理区间">
                </el-table-column>
                <el-table-column prop="sectionName" label="管理区间名">
                </el-table-column>
                <el-table-column label="结束后时间(分钟)">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.shiftEndOffsetMin"
                            placeholder="请输入正整数"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="开始前时间(分钟)">
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.shiftStartOffsetMin"
                            placeholder="请输入正整数"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="自动切换" width="60" align="center">
                    <template v-slot="scope">
                        <el-checkbox
                            v-model="scope.row.autoChange"
                        ></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <template v-for="comp in tableButtons">
                    <el-button
                        :key="comp.compKey"
                        :type="comp.type"
                        :icon="comp.icon"
                        @click="comp.clickEvent"
                    >
                        {{ comp.text }}
                    </el-button>
                </template>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import {
    querySwitchShiftCondition,
    saveSwitchShiftCondition,
} from "@/api/apiList/mes";
export default {
    name: "shitfCheck",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        dialogVisible: { type: Boolean, default: false },
    },
    data() {
        return {
            tableButtons: [
                {
                    compKey: "btnKey_confirm",
                    type: "primary",
                    size: "small",
                    icon: "iconfont  icon-confirm",
                    clickEvent: () => this.save(),
                    text: this.$t("保存"),
                },
                {
                    compKey: "btnKey_cancel",
                    type: "",
                    size: "small",
                    icon: "iconfont  icon-cancel",
                    clickEvent: () => this.closeMoule(),
                    text: this.$t("取消"),
                },
            ],
            tableData: [],
        };
    },
    mounted() {
        this.search();
    },
    methods: {
        search() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            querySwitchShiftCondition({
                plantCode: this.$parent.formField.plantCode,
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.tableData = [];
                        res.rows.forEach((item) => {
                            item.autoChange =
                                item.autoChangeFlag === "0" ? false : true;
                            this.tableData.push(item);
                        });
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.tableData = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        save() {
            this.$confirm("是否保存?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.tableData.forEach((item) => {
                    item.autoChangeFlag = item.autoChange ? "1" : "0";
                });
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveSwitchShiftCondition({
                    plantCode: this.$parent.formField.plantCode,
                    rows: this.tableData,
                })
                    .then((res) => {
                        this.loading.close();
                        this.$utils.message({
                            message: res.msg,
                        });
                        if (res.result === "1") this.$emit("close");
                    })
                    .catch((err) => {
                        this.loading.close();
                        console.log(err);
                    });
            });
        },
        closeMoule() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.popup_wrap {
    display: flex;
    flex-direction: column;
    .title {
        padding: 10px;
    }
    .el-table {
        flex-grow: 1;
    }
    .dialog-footer {
        padding: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
