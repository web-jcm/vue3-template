<template>
    <div class="app-container app-container-table">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :infoComponents="infoComponents"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        />
        <el-dialog
            v-dialogDrag
            :visible="dialogVisible"
            :close-on-click-modal="true"
            :append-to-body="true"
            width="500px"
            @close="dialogVisible = false"
        >
            <dialogHeader
                slot="title"
                title="作业指示格式新增"
                :style-type="$store.state.app.dialogType"
            />
            <div class="upload_wrap">
                <div class="flex m_b_10">
                    <div class="label">作业指示格式ID</div>
                    <el-input
                        v-model="FORMAT_ID"
                        placeholder="请输入格式ID"
                    ></el-input>
                </div>
                <div class="flex m_b_10">
                    <div class="label">作业指示格式名</div>
                    <el-input
                        v-model="FORMAT_NAME"
                        placeholder="请输入格式名"
                    ></el-input>
                </div>
                <div class="flex">
                    <div class="label">文件名</div>
                    <el-input
                        v-model="WI_FORMAT_FILE"
                        placeholder="请输入文件名"
                    ></el-input>
                    <div style="flex-shrink: 0">.html</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadFile">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    mesApis,
    formatUpload,
    formatTestPrint,
    formatDelete,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "workIndicateFormat",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    // 组件混入对象
    mixins: [],
    // 阻塞路由预加载网格中组件的数据
    beforeRouteEnter(to, from, next) {
        Vue.prototype.$ConfigCache.CacheConfig.initData(
            // 同时加载当前页面和编辑框页面的配置
            [to.path],
            function () {
                next();
            }
        );
    },
    data() {
        // 页面标识（与上面beforeRouteEnter中的对应）
        const viewPageCode = this.$route.path;
        // 绑定事件配置化事件
        this.$ConfigCache.CacheConfig.bindEvent(this, [viewPageCode]);
        // const thatObj = this
        return {
            // 网格查询API配置对象
            apiConfig: mesApis.queryWorkIndicateFormat,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableButtons
                    : [
                        {
                            compKey: "btnKey_query",
                            type: "primary",
                            size: "small",
                            clickEvent: () => this.search(),
                            text: this.$t("sys.button.query"),
                              name: "search",
                        },
                        {
                            compKey: "btnKey_importTemplate",
                            size: "small",
                            clickEvent: () => (this.dialogVisible = true),
                            text: "新增",
                            name: "importTemplate",
                          },
                        {
                            compKey: "btnKey_print",
                            size: "small",
                            clickEvent: () => this.testPrint(),
                            text: "测试打印",
                            name: "printing",
                        },
                        {
                            compKey: "del",
                            size: "small",
                            clickEvent: () => this.delFile(),
                            text: "格式文件删除",
                            name: "delete",
                          },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableComponents
                    : [
                        {
                            compKey: "PLANT_CODE",
                            labelName: "工厂名称",
                            codeField: "PLANT_CODE",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            isRequire: true,
                            clearable: false,
                          },
                    ],
            // 动态生成网格列
            tableCols:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableCols
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableCols
                    : [
                        {
                            prop: "FORMAT_ID",
                            label: "作业指示格式ID",
                        },
                        {
                            prop: "FORMAT_NAME",
                            label: "作业指示格式名",
                        },
                        {
                            prop: "SUB_DEVICE_TYPE",
                            label: "作业指示接续设备类型ID",
                        },
                        {
                            prop: "SUB_DEVICE_NAME",
                            label: "作业指示接续设备名",
                        },
                        {
                            prop: "LAST_UPDATED_DATE",
                            label: "更新时间",
                        },
                        {
                            prop: "CREATED_DATE",
                            label: "上传时间",
                        },
                        //   {
                        //       prop: "USER_NAME",
                          //       label: "上传用户名",
                        //   },
                    ],
            infoComponents: [
                {
                    compKey: "DEVICE_ID",
                    labelName: "测试打印接续设备ID",
                    codeField: "DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        maxWordCount: 10,
                        placeholder: "",
                    },
                    labelWidth: 120,
                    isComponent: true,
                },
                {
                    compKey: "CTRL_KEY",
                    labelName: "测试打印管理号",
                    codeField: "CTRL_KEY",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        maxWordCount: 7,
                        placeholder: "",
                    },
                    labelWidth: 110,
                    isComponent: true,
                },
            ],
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            resultField: {
                DEVICE_ID: "",
                CTRL_KEY: "",
            },
            clickRowsData: {}, //点击行对象
            WI_FORMAT_FILE: "",
            FORMAT_ID: "",
            FORMAT_NAME: "",
            dialogVisible: false,
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        testPrint() {
            if (!this.clickRowsData.FORMAT_ID) {
                return this.$utils.message({
                    message: "请先选择数据！",
                });
            }
            if (!this.resultField.DEVICE_ID) {
                return this.$utils.message({
                    message: "请输入设备ID！",
                });
            }
            if (!this.resultField.CTRL_KEY) {
                return this.$utils.message({
                    message: "请输入管理号！",
                });
            }
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            formatTestPrint({
                PLANT_CODE: this.formField.PLANT_CODE,
                CTRL_KEY: this.resultField.CTRL_KEY,
                DEVICE_ID: this.resultField.DEVICE_ID,
                FORMAT_ID: this.clickRowsData.FORMAT_ID,
                SUB_DEVICE_TYPE: this.clickRowsData.SUB_DEVICE_TYPE,
            })
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        delFile() {
            if (!this.clickRowsData.FORMAT_ID) {
                return this.$utils.message({
                    message: "请先选择数据！",
                });
            }
            this.$confirm("是否删除当前选择数据?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "删除中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    formatDelete({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        FORMAT_ID: this.clickRowsData.FORMAT_ID,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") this.search();
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        async uploadFile() {
            if (!this.FORMAT_ID) {
                this.$message({
                    message: "请输入格式ID!",
                    type: "warning",
                });
                return;
            }
            if (!this.FORMAT_NAME) {
                this.$message({
                    message: "请输入格式名!",
                    type: "warning",
                });
                return;
            }
            if (!this.WI_FORMAT_FILE) {
                this.$message({
                    message: "请输入文件名!",
                    type: "warning",
                });
                return;
            }
            let str = this.WI_FORMAT_FILE;
            const key = str.substring(str.length - 5);
            if (key !== ".html") {
                str = str + ".html";
            }
            this.loading = this.$loading({
                lock: true,
                text: "上传中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            formatUpload({
                PLANT_CODE: this.formField.PLANT_CODE,
                FORMAT_ID: this.FORMAT_ID,
                FORMAT_NAME: this.FORMAT_NAME,
                SUB_DEVICE_TYPE: "DRIVE",
                WI_FORMAT_FILE: str,
                WI_FORMAT_FILE_B: "",
            })
                .then((res) => {
                    this.loading.close();
                    this.dialogVisible = false;
                    this.$utils.message({
                        message: res.msg,
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    this.dialogVisible = false;
                    console.log(err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mes/workIndicateFormat/workIndicateFormat.scss";
</style>
