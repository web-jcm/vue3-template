<template>
    <div class="contain_wrap">
        <div class="btn_wrap flex">
            <div class="flex">
                <div class="label"><i class="iconRequired"></i>工厂名称</div>
                <el-select v-model="formField.PLANT_CODE" placeholder="请选择">
                    <el-option
                        v-for="item in plants"
                        :key="item.PLANT_CODE"
                        :label="item.PLANT_NAME"
                        :value="item.PLANT_CODE"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="flex">
                <el-button
                    type="primary"
                    icon="iconfont icon-search"
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    icon="iconfont icon-newlyAdded"
                    @click="showDialog('add')"
                >
                    新增
                </el-button>
                <el-button
                    icon="iconfont icon-inventoryModification"
                    @click="showDialog('edit')"
                >
                    修改
                </el-button>
                <el-button
                    icon="iconfont icon-quanbushanchu"
                    @click="handleDel"
                >
                    删除
                </el-button>
            </div>
        </div>
        <div class="contain">
            <div class="label1">文字列变换设定列表</div>
            <el-table
                height="180"
                ref="multipleTable1"
                :data="tableData1"
                v-loading="loading1"
                highlight-current-row
                tooltip-effect="dark"
                @row-click="clickList"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                ></el-table-column>
                <el-table-column prop="CHAR_CONV_ID" label="文字列变换设定ID">
                </el-table-column>
                <el-table-column prop="CHAR_CONV_NAME" label="文字列变换设定名">
                </el-table-column>
                <el-table-column prop="DESCRIPTION" label="文字列变换设定说明">
                </el-table-column>
                <el-table-column
                    prop="CHAR_CONV_ORG_SIZE"
                    label="文字列变换变化前大小"
                >
                </el-table-column>
                <el-table-column
                    prop="CHAR_CONV_CONV_SIZE"
                    label="文字列变换变化后大小"
                >
                </el-table-column>
            </el-table>
            <div class="label2">文字列变换设定详情</div>
            <el-table
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
                <el-table-column label="文字列变换模式">
                    <template v-slot="scope">
                        <el-checkbox
                            v-model="scope.row.isCheck"
                            disabled
                        ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="CHAR_CONV_START"
                    label="文字列变换开始位置"
                >
                </el-table-column>
                <el-table-column
                    prop="EDIT_DATA_TYPE"
                    label="文字列变换数据类型"
                >
                </el-table-column>
                <el-table-column
                    prop="EDIT_DATA_NAME"
                    label="文字列变换数据类名"
                >
                </el-table-column>
                <el-table-column prop="KEY_ID_1" label="文字列变换Key数据">
                </el-table-column>
                <el-table-column prop="KEY_NAME_1" label="文字列变换Key数据名">
                </el-table-column>
            </el-table>
            <div class="label2">文字列变换数据</div>
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
                <el-table-column
                    prop="CHAR_CONV_ORG_DATA"
                    label="文字列变换前数据"
                >
                </el-table-column>
                <el-table-column
                    prop="CHAR_CONV_CONV_DATA"
                    label="文字列变换后数据"
                >
                </el-table-column>
            </el-table>
        </div>
        <edit
            ref="edit"
            :currentRow="currentRow"
            :plantCode="formField.PLANT_CODE"
            :popupsState="popupsState"
            v-if="editPopupsVisible"
            @close="dialogClose"
        />
    </div>
</template>
<script>
import {
    queryWordChangeList,
    queryWordChangeDetail,
    queryWordChangeData,
    delWordChange,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "wordChangeAdjust",
    components: {
        edit: () => import("./edit"),
    },
    // 组件混入对象
    mixins: [],
    data() {
        return {
            plants: [],
            tableData1: [],
            loading1: false,
            tableData2: [],
            loading2: false,
            tableData3: [],
            loading3: false,
            editPopupsVisible: false,
            popupsState: "add",
            formField: {
                CONV_TYPE: "1",
                PLANT_CODE: "",
            },
            currentRow: {},
            loading: null,
        };
    },
    async created() {
        await this.queryPlant();
        this.search();
    },
    methods: {
        queryPlant() {
            return queryPlant({
                tenancyId: this.$store.state.user.tenancyId,
            })
                .then((res) => {
                    if (res.result === "1") {
                        if (res.rows) {
                            this.plants = res.rows;
                            this.formField.PLANT_CODE = res.rows[0].PLANT_CODE;
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
        async search() {
            await this.queryWordChangeList();
            if (this.tableData1.length && !this.currentRow.WI_CHAR_CONV_ID) {
                this.currentRow = this.tableData1[0];
                this.$refs.multipleTable1.setCurrentRow(this.currentRow);
                this.queryWordChangeDetail();
                this.queryWordChangeData();
            }
        },
        queryWordChangeList() {
            this.currentRow = {};
            this.loading1 = true;
            return queryWordChangeList(this.formField)
                .then((res) => {
                    this.loading1 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData1 = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading1 = false;
                    console.log(err);
                });
        },
        queryWordChangeDetail() {
            this.loading2 = true;
            this.tableData2 = [];
            queryWordChangeDetail({
                PLANT_CODE: this.formField.PLANT_CODE,
                WI_CHAR_CONV_ID: this.currentRow.WI_CHAR_CONV_ID,
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
        queryWordChangeData() {
            this.loading3 = true;
            this.tableData3 = [];
            queryWordChangeData({
                PLANT_CODE: this.formField.PLANT_CODE,
                WI_CHAR_CONV_ID: this.currentRow.WI_CHAR_CONV_ID,
            })
                .then((res) => {
                    this.loading3 = false;
                    if (res.result === "1" && res.rows) {
                        this.tableData3 = res.rows;
                    } else {
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
        handleDel() {
            this.$confirm("是否删除当前所选文字列变换?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "提交中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    delWordChange({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        CONV_TYPE: this.formField.CONV_TYPE,
                        WI_CHAR_CONV_ID: this.currentRow.WI_CHAR_CONV_ID,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            this.search();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        showDialog(type) {
            this.popupsState = type;
            this.editPopupsVisible = true;
        },
        dialogClose() {
            this.editPopupsVisible = false;
            this.search();
        },
        clickList(row) {
            this.currentRow = row;
            this.queryWordChangeDetail();
            this.queryWordChangeData();
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/wordChangeAdjust/wordChangeAdjust.scss";
</style>
