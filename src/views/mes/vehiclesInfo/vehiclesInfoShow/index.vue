<template>
    <div class="app-container app-container-table">
        <div class="nav_wrap">
            <div
                class="nav_btn"
                @click="navigate('vehiclesBaseInfoManagement')"
            >
                车辆基本信息管理
            </div>
            <div
                class="nav_btn"
                @click="navigate('vehiclesProductTimeManagement')"
            >
                车辆生产时间管理
            </div>
            <div
                class="nav_btn"
                @click="navigate('vehiclesProductIndicateManagement')"
            >
                车辆生产指示管理
            </div>
        </div>
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :isUsePathQuery="false"
            :dynamic-export-converts="exportConverts"
            :sectionH="'auto'"
        >
        </n-data-table>
        <div class="info_wrap">
            <div class="info_card">
                <div class="flex">
                    <div class="width6 name">管理号</div>
                    <div class="width6">{{ formData.CTRL_KEY }}</div>
                    <div class="width6 name">中心化车型</div>
                    <div class="width6">{{ formData.MODEL }}</div>
                    <div class="width6 name">车型（22位码）</div>
                    <div class="width6">{{ formData.CONFIGURATION }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">外饰色</div>
                    <div class="width6">{{ formData.COLOR_K }}</div>
                    <div class="width6 name">内饰色</div>
                    <div class="width6">{{ formData.COLOR_I }}</div>
                    <div class="width6 name">VIN码</div>
                    <div class="width6">{{ formData.VIN_NO }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">基准车系</div>
                    <div class="width6">{{ formData.BASE_MODEL }}</div>
                    <div class="width6 name">生产车系</div>
                    <div class="width6">{{ formData.BODY_PRODUCT_CODE }}</div>
                    <div class="width6 name">车辆类别</div>
                    <div class="width6">{{ formData.TYPE_CD }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">区域编码</div>
                    <div class="width6">{{ formData.ZONE_CODE }}</div>
                    <div class="width6 name">区域名称</div>
                    <div class="width6">{{ formData.ZONE_NAME }}</div>
                    <div class="width6 name">搬入时间</div>
                    <div class="width6">{{ formData.IN_TIME }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">工厂编码</div>
                    <div class="width6">{{ formData.PLANT_CODE }}</div>
                    <div class="width6 name">计划批次号</div>
                    <div class="width6">{{ formData.BATCH_NO }}</div>
                    <div class="width6 name">订单号</div>
                    <div class="width6">{{ formData.ORDER_ID }}</div>
                </div>
                <!-- <div class="flex">
          <div class="width6 name">租户ID</div>
          <div class="width6">{{ formData.TENANCY_ID }}</div>
          
          
        </div> -->
            </div>
            <div class="info_card m_tb_16">
                <div class="flex">
                    <div class="width6 name">焊装生产线(M)</div>
                    <div class="width6">{{ formData.LINE_M }}</div>
                    <div class="width6 name">涂装生产线(P)</div>
                    <div class="width6">{{ formData.LINE_P }}</div>
                    <div class="width6 name">总装生产线(T)</div>
                    <div class="width6">{{ formData.LINE_T }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">终整生产线(F)</div>
                    <div class="width6">{{ formData.LINE_F }}</div>
                    <div class="width6 name">焊装连续编号</div>
                    <div class="width6">{{ formData.BODY_SERIAL_NO }}</div>
                    <div class="width6 name">总装连续编号</div>
                    <div class="width6">{{ formData.TRIM_SERIAL_NO }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">发动机型号</div>
                    <div class="width6">{{ formData.ENGINE_TYPE }}</div>
                    <div class="width6 name">电机型号1</div>
                    <div class="width6">{{ formData.MOTOR_PATTERNCODE1 }}</div>
                    <div class="width6 name">电机型号2</div>
                    <div class="width6">{{ formData.MOTOR_PATTERNCODE2 }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">发动机号</div>
                    <div class="width6">{{ formData.ENGINE_NO }}</div>
                    <div class="width6 name">电机编码1</div>
                    <div class="width6">{{ formData.MOTOR_NO1 }}</div>
                    <div class="width6 name">电机编码2</div>
                    <div class="width6">{{ formData.MOTOR_NO2 }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">车架管理号</div>
                    <div class="width6">{{ formData.FRAME_CTRL_KEY }}</div>
                    <div class="width6 name">电机编码3</div>
                    <div class="width6">{{ formData.MOTOR_NO3 }}</div>
                    <div class="width6 name">电机编码4</div>
                    <div class="width6">{{ formData.MOTOR_NO4 }}</div>
                </div>
                <div class="flex">
                    <div class="width6 name">打刻标识</div>
                    <div class="width6">{{ formData.VIN_FLAG }}</div>
                    <div class="width6 name">无实绩送信标识</div>
                    <div class="width6">{{ formData.NO_ACHV_FLAG }}</div>
                    <div class="width6 name">BOM提取日期</div>
                    <div class="width6">{{ formData.BOM_DATE }}</div>
                </div>
            </div>
            <div class="info_card">
                <div class="flex">
                    <div class="width6 name">工程</div>
                    <div class="width6 name">同期编号</div>
                    <div class="width6 name">计划日期</div>
                    <div class="width6 name">计划班次</div>
                    <div class="width6 name">计划时间</div>
                    <div class="width6 name"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">焊装上线</div>
                    <div class="width6">{{ formData.DOUKI_NO1 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE1 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT1 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME1 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">焊装下线</div>
                    <div class="width6">{{ formData.DOUKI_NO2 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE2 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT2 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME2 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">涂装上线</div>
                    <div class="width6">{{ formData.DOUKI_NO3 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE3 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT3 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME3 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">涂装下线</div>
                    <div class="width6">{{ formData.DOUKI_NO4 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE4 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT4 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME4 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">PBSOUT</div>
                    <div class="width6">{{ formData.DOUKI_NO5 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE5 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT5 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME5 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">总装上线</div>
                    <div class="width6">{{ formData.DOUKI_NO6 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE6 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT6 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME6 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">总装下线</div>
                    <div class="width6">{{ formData.DOUKI_NO7 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE7 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT7 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME7 }}</div>
                    <div class="width6"></div>
                </div>
                <div class="flex">
                    <div class="width6 name">终整下线</div>
                    <div class="width6">{{ formData.DOUKI_NO8 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT_DATE8 }}</div>
                    <div class="width6">{{ formData.PLAN_SHIFT8 }}</div>
                    <div class="width6">{{ formData.PLAN_TIME8 }}</div>
                    <div class="width6"></div>
                </div>
            </div>
        </div>
        <el-dialog
            v-model:visible="showPopup"
            v-dialogDrag
            :append-to-body="true"
        >
            <dialogHeader
                slot="title"
                title="焊装生产指示"
                :style-type="$store.state.app.dialogType"
            />
            <div class="popup_wrap">
                <div>焊装生产线</div>
                <el-input
                    v-model="formData.PRODUCTION_FLAG"
                    disabled
                    class="popup_input"
                ></el-input>
                <div>指示完成</div>
                <el-input
                    v-model="formData.INSTRUCTED_FLAG"
                    disabled
                    class="popup_input"
                ></el-input>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { showCarInfo, queryLookupValues } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesInfoShow",
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
                        // {
                        //   compKey: 'btnKey_reset',
                        //   type: '',
                        //   size: 'small',
                        //   clickEvent: () => this.reset(),
                        //   text: this.$t('sys.button.reset'),
                        //   name: 'reset',
                        //   position: 'center',
                        // },
                        {
                              compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => (this.showPopup = true),
                            text: "焊装生产指示",
                              name: "",
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
                            compKey: "searchKey",
                            labelName: "查询KEY",
                            codeField: "searchKey",
                            oFields: "LOOKUP_VALUE_CODE,LOOKUP_VALUE_NAME",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            clearable: false,
                            isRequire: true,
                            options: [],
                          },
                        {
                            compKey: "searchValue",
                            codeField: "searchValue",
                            component: () =>
                                import("@/components/org/commonInput"),
                              isMust: true,
                            rule: "",
                        },
                    ],
            // 动态生成网格列
            tableCols:
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode] &&
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode].tableCols
                    .length > 0
                    ? this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
                        .tableCols
                    : [],
            formField: this.$utils.getFormField(
                this,
                {
                    PLANT_CODE: "",
                    searchKey: "",
                    searchValue: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            formData: {},
            showPopup: false,
            clickRowsData: {}, //点击行对象
        };
    },
    watch: {
        "formField.searchKey": function (val) {
            if (val === "ctrlKey") {
                this.tableComponents[2].rule = "1";
            } else if (val === "vin") {
                this.tableComponents[2].rule = "2";
            } else if (val === "orderId") {
                this.tableComponents[2].rule = "3";
            }
        },
        "formField.PLANT_CODE": async function () {
            await this.queryLookupValues();
            let params = sessionStorage.getItem("vehiclesInfoShow");
            if (params) {
                this.formField.searchKey = JSON.parse(params).key;
                this.formField.searchValue = JSON.parse(params).value;
                this.search();
                sessionStorage.removeItem("vehiclesInfoShow");
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.searchKey = this.$route.params.key;
            //     this.formField.searchValue = this.$route.params.value;
            //     this.search();
            // }
        },
    },
    activated() {
        let params = sessionStorage.getItem("vehiclesInfoShow");
        if (params) {
            this.formField.searchKey = JSON.parse(params).key;
            this.formField.searchValue = JSON.parse(params).value;
            this.search();
            sessionStorage.removeItem("vehiclesInfoShow");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.searchKey = this.$route.params.key;
        //     this.formField.searchValue = this.$route.params.value;
        //     this.search();
        // }
    },
    methods: {
        queryLookupValues() {
            return queryLookupValues({
                plantCode: this.formField.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "QUERY_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.tableComponents[1].options = res.rows;
                        this.formField.searchKey =
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
        search() {
            if (!this.formField.searchKey || !this.formField.searchValue) {
                return this.$utils.message({
                    message: "查询值不能为空!",
                });
            }
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            showCarInfo(this.formField)
                .then((res) => {
                    this.formData = {};
                    if (res.result === "1" && res.rows) {
                        for (let key in res.rows[0]) {
                            this.$set(this.formData, key, res.rows[0][key]);
                        }
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.formData = {};
                    this.loading.close();
                    console.log(err);
                });
        },
        navigate(path) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        key: this.formField.searchKey,
                        value: this.formField.searchValue,
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
            //         key: this.formField.searchKey,
            //         value: this.formField.searchValue,
            //     },
            // });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesInfoShow/vehiclesInfoShow.scss";
</style>
