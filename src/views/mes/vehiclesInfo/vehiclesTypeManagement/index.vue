<template>
    <div class="app-container app-container-table">
        <div class="nav_wrap">
            <div class="nav_btn" @click="navigate('vehiclesIndicateCode')">
                指示代码配置
            </div>
            <div class="nav_btn" @click="navigate('productVehiclesSeries')">
                生产车系配置
            </div>
            <div class="nav_btn" @click="navigate('vinRuleManagement')">
                车辆VIN码配置
            </div>
        </div>
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="true"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="true"
            :isUsePathQuery="false"
        >
            <template v-slot:BASE_MODEL="scope">
                <el-select
                    v-model="scope.row.BASE_MODEL"
                    filterable
                    allow-create
                    default-first-option
                    v-rule="'12'"
                >
                    <el-option
                        v-for="item in modelList"
                        :key="item.BASE_MODEL"
                        :label="item.BASE_MODEL"
                        :value="item.BASE_MODEL"
                    >
                    </el-option>
                </el-select>
            </template>
            <template v-slot:WI_FLAG="scope">
                <div
                    :style="{
                        background:
                            scope.row.WI_FLAG === '0' ? '#F56C6C' : '#67C23A',
                    }"
                >
                    {{ scope.row.WI_FLAG === "0" ? "否" : "是" }}
                </div>
            </template>
            <template v-slot:PRODUCT_FLAG="scope">
                <div
                    :style="{
                        background:
                            scope.row.PRODUCT_FLAG === '0'
                                ? '#F56C6C'
                                : '#67C23A',
                    }"
                >
                    {{ scope.row.PRODUCT_FLAG === "0" ? "否" : "是" }}
                </div>
            </template>
            <template v-slot:VIN_FLAG="scope">
                <div
                    :style="{
                        background:
                            scope.row.VIN_FLAG === '0' ? '#F56C6C' : '#67C23A',
                    }"
                >
                    {{ scope.row.VIN_FLAG === "0" ? "否" : "是" }}
                </div>
            </template>
        </n-data-table>
        <el-dialog
            :visible="showDialog"
            v-dialogDrag
            :append-to-body="true"
            @close="cancel"
        >
            <dialogHeader
                slot="title"
                title="新增车型"
                :style-type="$store.state.app.dialogType"
            />
            <div class="popup_wrap">
                <el-form
                    :model="formData"
                    :rules="rules"
                    ref="ruleForm"
                    label-position="left"
                    label-width="80px"
                    class="flex_wrap"
                >
                    <el-form-item label="车型" prop="MODEL" class="width50">
                        <el-input
                            v-rule="'13'"
                            v-model="formData.MODEL"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="外饰色" prop="COLOR_K" class="width50">
                        <el-input
                            v-rule="'15'"
                            v-model="formData.COLOR_K"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="内饰色" prop="COLOR_I" class="width50">
                        <el-input
                            v-rule="'16'"
                            v-model="formData.COLOR_I"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="车系"
                        prop="BASE_MODEL"
                        class="width50"
                    >
                        <el-select
                            v-model="formData.BASE_MODEL"
                            filterable
                            allow-create
                            default-first-option
                            v-rule="'12'"
                        >
                            <el-option
                                v-for="item in modelList"
                                :key="item.BASE_MODEL"
                                :label="item.BASE_MODEL"
                                :value="item.BASE_MODEL"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog_footer">
                    <el-button type="primary" @click="submitForm"
                        >保存</el-button
                    >
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    mesApis,
    saveCarModel,
    delCarModel,
    queryCarModel,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesTypeManagement",
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
        return {
            // 网格查询API配置对象
            apiConfig: mesApis.queryCarModel,
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
                            position: "right",
                        },
                        {
                            compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => this.save(),
                            text: this.$t("sys.button.save"),
                            name: "preservation",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_delete",
                            type: "",
                            size: "small",
                            clickEvent: () => this.delete(),
                            text: this.$t("sys.button.delete"),
                            name: "quanbushanchu",
                            position: "center",
                        },
                        {
                            compKey: "btnKey_add",
                              type: "",
                            size: "small",
                            clickEvent: () => (this.showDialog = true),
                            text: "新增",
                            name: "add",
                            position: "center",
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
                        {
                            compKey: "CONFIG_FLAG",
                            labelName: "是否配置",
                            codeField: "CONFIG_FLAG",
                            oFields: "code,name",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            isMust: true,
                            options: [
                                {
                                      name: "全部",
                                    code: "",
                                },
                                {
                                    name: "未配置",
                                    code: "0",
                                  },
                                {
                                    name: "已配置",
                                    code: "1",
                                },
                            ],
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
                            prop: "MODEL",
                            label: "车型",
                          },
                        {
                            prop: "COLOR_K",
                            label: "外饰色",
                        },
                        {
                            prop: "COLOR_I",
                            label: "内饰色",
                        },
                        {
                            prop: "BASE_MODEL",
                            label: "车系",
                            isSlot: true,
                          },
                        {
                            prop: "WI_FLAG",
                            label: "是否指示代码配置",
                            isSlot: true,
                        },
                        {
                            prop: "PRODUCT_FLAG",
                            label: "是否生产车系配置",
                            isSlot: true,
                        },
                        {
                            prop: "VIN_FLAG",
                            label: "是否VIN码配置",
                              isSlot: true,
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    CONFIG_FLAG: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            clickRowsData: {}, //点击行对象
            modelList: [],
            showDialog: false,
            formData: {
                MODEL: "",
                COLOR_K: "",
                COLOR_I: "",
                BASE_MODEL: "",
            },
            rules: {
                MODEL: [
                    {
                        required: true,
                        message: "不能为空！",
                        trigger: "change",
                    },
                ],
                COLOR_K: [
                    {
                        required: true,
                        message: "不能为空！",
                        trigger: "change",
                    },
                ],
                COLOR_I: [
                    {
                        required: true,
                        message: "不能为空！",
                        trigger: "change",
                    },
                ],
                BASE_MODEL: [
                    {
                        required: true,
                        message: "不能为空！",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    watch: {
        "formField.PLANT_CODE": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        navigate(path) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        MODEL: this.clickRowsData.MODEL,
                        COLOR_I: this.clickRowsData.COLOR_I,
                        COLOR_K: this.clickRowsData.COLOR_K,
                    })
                );
                window.parent.$multilMenuDo.actions.openMenu(myMenu[0].id);
                //非菜单页面
                // window.parent.$multilMenuDo.actions.renderMenu(
                //     myMenu[0].target,
                //     myMenu[0].id,
                //     0,
                //     myMenu[0].name
                // );
            }
            //不集成mp
            // this.$router.push({
            //     name: path,
            //     params: {
            //         MODEL: this.clickRowsData.MODEL,
            //         COLOR_I: this.clickRowsData.COLOR_I,
            //         COLOR_K: this.clickRowsData.COLOR_K,
            //     },
            // });
        },
        queryCarModels() {
            return queryCarModel({
                PLANT_CODE: this.formField.PLANT_CODE,
                GROUP_BASE_MODEL: "1",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.modelList = res.rows;
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
            await this.queryCarModels();
            this.queryTable();
        },
        save() {
            this.$confirm("是否保存修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.saveCarModel();
                })
                .catch(() => {});
        },
        saveCarModel(arr) {
            this.loading = this.$loading({
                lock: true,
                text: "保存中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            saveCarModel({
                PLANT_CODE: this.formField.PLANT_CODE,
                rows: arr ? arr : this.$refs.multipleTable.list,
            })
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                    });
                    if (res.result === "1") {
                        this.cancel();
                        this.search();
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        delete() {
            if (this.$refs.multipleTable.selection.length) {
                this.$confirm("此操作将删除选择数据, 是否继续?", "提示", {
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
                        delCarModel({
                            PLANT_CODE: this.formField.PLANT_CODE,
                            rows: this.$refs.multipleTable.selection,
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
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$utils.message({
                    message: "请选择需要删除的数据！",
                });
            }
        },
        submitForm() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$confirm("是否新增数据?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.saveCarModel([this.formData]);
                        })
                        .catch(() => {});
                }
            });
        },
        cancel() {
            this.formData.MODEL = "";
            this.formData.COLOR_K = "";
            this.formData.COLOR_I = "";
            this.formData.BASE_MODEL = "";
            this.showDialog = false;
            this.$refs.ruleForm.resetFields();
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesTypeManagement/vehiclesTypeManagement.scss";
</style>
