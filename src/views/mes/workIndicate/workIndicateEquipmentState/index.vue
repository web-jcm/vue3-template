<template>
    <div class="app-container">
        <div class="nav_wrap">
            <div class="nav_btn" @click="navigate('equipmentOutFactorAdjust')">
                设备输出条件维护
            </div>
            <div class="nav_btn" @click="navigate('outFormatAdjust')">
                输出格式维护
            </div>
            <div class="nav_btn" @click="navigate('workIndicateReexport')">
                作业指示再输出
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
            :infoComponents="infoComponents"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
        >
            <template v-slot:DEVICE_STATUS="scope">
                <div v-if="scope.row.DEVICE_STATUS === '-1'" style="color: red">
                    初始化
                </div>
                <div v-if="scope.row.DEVICE_STATUS === '0'" style="color: red">
                    停止
                </div>
                <div
                    v-if="scope.row.DEVICE_STATUS === '1'"
                    style="color: green"
                >
                    在线
                </div>
                <div v-if="scope.row.DEVICE_STATUS === '2'" style="color: red">
                    处理中
                </div>
                <div v-if="scope.row.DEVICE_STATUS === '3'" style="color: red">
                    异常停止
                </div>
            </template>
            <template v-slot:SUSPEND_STATUS="scope">
                <div v-if="scope.row.SUSPEND_STATUS === '0'">普通</div>
                <div v-if="scope.row.SUSPEND_STATUS === '1'" style="color: red">
                    输出抑制
                </div>
                <div
                    v-if="scope.row.SUSPEND_STATUS === '2'"
                    style="color: fuchsia"
                >
                    要求抑制
                </div>
            </template>
        </n-data-table>
        <el-dialog
            v-dialogDrag
            :visible="showDialog"
            :close-on-click-modal="true"
            :append-to-body="true"
            width="400px"
            @close="showDialog = false"
        >
            <dialogHeader
                slot="title"
                title="作业指示要求初始化"
                :style-type="$store.state.app.dialogType"
            />
            <div class="popup_container">
                <div class="flex m_b_10">
                    <div class="label">接续设备ID</div>
                    <el-input
                        v-model="clickRowsData.DEVICE_ID"
                        :disabled="true"
                    >
                    </el-input>
                </div>
                <el-radio-group v-model="requirType">
                    <el-radio :label="1">全作业指示要求初始化</el-radio>
                    <el-radio :label="2">先头作业指示要求初始化</el-radio>
                    <el-radio :label="3">全部再输出要求初始化</el-radio>
                    <!-- <el-radio :label="4">部分作业指示要求初始化</el-radio> -->
                </el-radio-group>
                <!-- <div class="flex">
                    <div class="tip">截止顺序</div>
                    <el-input
                        v-model="TRIM_SERIAL_NO"
                        :disabled="requirType !== 4"
                    >
                    </el-input>
                </div> -->
                <div slot="footer" class="dialog-footer">
                    <el-button
                        type="primary"
                        icon="iconfont  icon-confirm"
                        @click="save"
                    >
                        保存
                    </el-button>
                    <el-button
                        icon="iconfont  icon-cancel"
                        @click="showDialog = false"
                    >
                        取消
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    mesApis,
    updateWorkIndicateState,
    initWorkIndicateState,
    initWorkIndicateRequire,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "workIndicateEquipmentState",
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
            apiConfig: mesApis.queryWorkIndicateEquipmentState,
            // 动态组件-按钮
            tableButtons:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableButtons.length >
                    (0).length >
                    0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableButtons
                    : [
                        {
                            compKey: "btnKey_query",
                            type: "primary",
                              size: "small",
                            clickEvent: () => this.search(),
                              text: "查询",
                            name: "search",
                            position: "right",
                          },
                        {
                            compKey: "btnKey_out",
                            size: "small",
                            clickEvent: () => this.stateUpdate("1"),
                            text: "输出抑制",
                        },
                        {
                            compKey: "btnKey_require",
                            size: "small",
                            clickEvent: () => this.stateUpdate("2"),
                              text: "要求抑制",
                        },
                        {
                              compKey: "btnKey_state",
                            size: "small",
                            clickEvent: () => this.initUpdate(1),
                            text: "状态初始化",
                          },
                        {
                            compKey: "btnKey_all",
                            size: "small",
                            clickEvent: () => this.initUpdate(),
                              text: "全部状态初始化",
                        },
                        {
                            compKey: "btnKey_indicate",
                            size: "small",
                            clickEvent: () => (this.showDialog = true),
                            text: "指示要求初始化",
                        },
                    ],
            // 动态组件-查询条件
            tableComponents:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                    .tableComponents.length >
                    (0).length >
                    0
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
                            prop: "DEVICE_ID",
                            label: "接续设备ID",
                        },
                        {
                            prop: "DEVICE_NAME",
                            label: "接续设备名",
                            width: 140,
                        },
                        {
                            prop: "IPADDRESS",
                            label: "设备IP地址",
                          },
                        {
                            prop: "DEVICE_STATUS",
                            label: "设备状态",
                            isSlot: true,
                          },
                        {
                            prop: "DEVICE_STATUS_FACTOR",
                            label: "设备状态要因",
                        },
                        {
                            prop: "WI_DEVICE_TYPE_NAME",
                              label: "接续设备类型名",
                        },
                        {
                            prop: "SUSPEND_STATUS",
                            label: "设备抑制状态",
                            isSlot: true,
                        },
                        {
                            prop: "LAST_EDITREQ_SEQ",
                            label: "最终要求编辑顺序",
                        },
                        {
                            prop: "LAST_OUTPUT_SEQ",
                            label: "最终输出顺序",
                        },
                        {
                            prop: "DESCRIPTION",
                            label: "设备说明",
                            width: 180,
                          },
                    ],
            infoComponents: [
                {
                    compKey: "DEVICE_ID",
                    labelName: "设备ID",
                    codeField: "DEVICE_ID",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
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
            clickRowsData: {},
            resultField: {
                DEVICE_ID: "",
            },
            showDialog: false,
            requirType: "",
            TRIM_SERIAL_NO: "",
        };
    },
    watch: {
        clickRowsData(val) {
            this.resultField.DEVICE_ID = val.DEVICE_ID;
            if (val.SUSPEND_STATUS === "0") {
                this.tableButtons[1].text = "输出抑制";
                this.tableButtons[2].text = "要求抑制";
            }
            if (val.SUSPEND_STATUS === "1") {
                this.tableButtons[1].text = "输出抑制解除";
                this.tableButtons[2].text = "要求抑制";
            }
            if (val.SUSPEND_STATUS === "2") {
                this.tableButtons[1].text = "输出抑制";
                this.tableButtons[2].text = "要求抑制解除";
            }
        },
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
                        key: "DEVICE_ID",
                        value: this.clickRowsData.DEVICE_ID,
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
            //         key: "DEVICE_ID",
            //         value: this.clickRowsData.DEVICE_ID,
            //     },
            // });
        },
        search() {
            this.queryTable(1);
        },
        stateUpdate(type) {
            this.$confirm(
                `是否要修改设备${this.clickRowsData.DEVICE_ID}抑制状态?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    let state = "0";
                    if (this.clickRowsData.SUSPEND_STATUS === "0") {
                        state = type;
                    } else {
                        state =
                            this.clickRowsData.SUSPEND_STATUS === type
                                ? "0"
                                : type;
                    }
                    updateWorkIndicateState({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        DEVICE_ID: this.clickRowsData.DEVICE_ID,
                        SUSPEND_STATUS: state,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") {
                                this.$refs.multipleTable.list.forEach(
                                    (item) => {
                                        if (
                                            item.DEVICE_ID ===
                                            this.clickRowsData.DEVICE_ID
                                        ) {
                                            item.SUSPEND_STATUS = state;
                                            if (state === "0") {
                                                this.tableButtons[1].text =
                                                    "输出抑制";
                                                this.tableButtons[2].text =
                                                    "要求抑制";
                                            }
                                            if (state === "1") {
                                                this.tableButtons[1].text =
                                                    "输出抑制解除";
                                                this.tableButtons[2].text =
                                                    "要求抑制";
                                            }
                                            if (state === "2") {
                                                this.tableButtons[1].text =
                                                    "输出抑制";
                                                this.tableButtons[2].text =
                                                    "要求抑制解除";
                                            }
                                        }
                                    }
                                );
                            }
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        initUpdate(type) {
            this.$confirm(
                `是否要初始化设备${
                    type ? this.clickRowsData.DEVICE_ID : ""
                }作业指示状态?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    initWorkIndicateState({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        DEVICE_ID: type ? this.clickRowsData.DEVICE_ID : "",
                    })
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") {
                                if (type) {
                                    this.$refs.multipleTable.list.forEach(
                                        (item) => {
                                            if (
                                                item.DEVICE_ID ===
                                                this.clickRowsData.DEVICE_ID
                                            ) {
                                                item.DEVICE_STATUS = "-1";
                                            }
                                        }
                                    );
                                } else {
                                    this.search();
                                }
                            }
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        save() {
            this.$confirm("是否保存当前修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    initWorkIndicateRequire({
                        PLANT_CODE: this.formField.PLANT_CODE,
                        DEVICE_ID: this.clickRowsData.DEVICE_ID,
                        TYPE: this.requirType,
                        TRIM_SERIAL_NO: this.TRIM_SERIAL_NO,
                    })
                        .then((res) => {
                            this.loading.close();
                            this.showDialog = false;
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
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/workIndicateEquipmentState/workIndicateEquipmentState.scss";
</style>
