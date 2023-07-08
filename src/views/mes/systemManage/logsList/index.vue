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
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="true"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isUsePathQuery="true"
            :pageSizeArray="pageSizeArr"
            :dynamic-export-converts="exportConverts"
            @row-click="rowClick"
            @inputblur="handleBlur"
        >
            <template v-slot:logLevel="scope">
                <div class="one_line">
                    {{ formatter(scope.row) }}
                </div>
            </template>
            <!-- <template #logLevel="{ row }">
        <div class="one_line">
          {{ formatter(row) }}
        </div>
      </template> -->
        </n-data-table>
        <el-dialog
            title="日志详情"
            v-model:visible="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="true"
            width="80%"
            :center="true"
        >
            <div class="log_detail">
                {{ moreContent }}
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { orgApis } from "@/api/apiList/org";

import { queryLogModules, queryLogDetail } from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "logsList",
    components: {},
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
            apiConfig: orgApis.searchLog,
            dialogVisible: false,
            moreContent: "",
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
                            clickEvent: () => this.queryData(),
                            text: this.$t("sys.button.query"),
                            name: "search",
                            position: "right",
                        },
                        {
                            compKey: "btnKey_reset",
                            type: "",
                            size: "small",
                            clickEvent: () => this.reset(),
                            text: this.$t("sys.button.reset"),
                              name: "reset",
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
                            compKey: "plantCode",
                            labelName: "工厂名称",
                            codeField: "plantCode",
                            oFields: "PLANT_CODE,PLANT_NAME",
                            lookuptype: "queryPlant",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              isMust: true,
                            isRequire: true,
                            clearable: false,
                        },
                          {
                            compKey: "modules",
                            labelName: "模块",
                            codeField: "modules",
                            oFields: "logModulesId,logModulesName",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                            options: [],
                        },
                        {
                            compKey: "startTime",
                            labelName: "开始时间",
                            codeField: "startTime",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
                            dataToObject: {
                                maxWordCount: 12,
                            },
                        },
                        {
                            compKey: "endTime",
                            labelName: "结束时间",
                            codeField: "endTime",
                            component: () =>
                                import(
                                    "@/components/org/datePicker/dateTimePick"
                                ),
                            type: "datePicker",
                            dateType: "datetime",
                            format: "yyyy-MM-dd HH:mm:ss",
                            isMust: false,
                            dataToObject: {
                                maxWordCount: 12,
                              },
                        },
                        {
                            compKey: "level",
                            labelName: "级别",
                            codeField: "level",
                            oFields: "lookupValueCode,lookupValueName",
                            lookuptype: "_is_null_code_",
                            component: () =>
                                import("@/components/org/LookupValue"),
                              options: [],
                        },
                          {
                            compKey: "keyWord",
                            labelName: "关键词",
                            codeField: "keyWord",
                            component: () =>
                                import("@/components/org/commonInput"),
                            type: "inputText",
                          },
                        {
                            compKey: "logId",
                            labelName: "日志ID",
                            codeField: "logId",
                            component: () =>
                                import("@/components/org/commonInput"),
                              type: "inputText",
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
                            prop: "createdDate",
                            label: "时间",
                            width: 200,
                        },
                        {
                            prop: "logId",
                            label: "日志ID",
                        },
                        {
                            prop: "logMsg",
                            label: "消息",
                        },
                        {
                            prop: "logLevel",
                            label: "级别",
                            isSlot: true,
                        },
                        {
                            prop: "logModulesId",
                            label: "模块",
                          },
                        {
                            prop: "plantCode",
                            label: "工厂",
                        },
                    ],
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: this.$PLANT_CODE,
                    modules: "",
                    startTime: "",
                    endTime: "",
                    level: "",
                    keyWord: "",
                    logId: "",
                    sysCode: "mes",
                    tenantId: this.$store.state.user.tenancyId,
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            levelList: [
                {
                    lookupValueName: "Alarm",
                    lookupValueCode: "1",
                },
                {
                    lookupValueName: "Warning",
                    lookupValueCode: "2",
                },
                {
                    lookupValueName: "Message",
                    lookupValueCode: "3",
                },
                {
                    lookupValueName: "Log",
                    lookupValueCode: "4",
                },
                {
                    lookupValueName: "Trace",
                    lookupValueCode: "5",
                },
            ],
            pageSizeArr: [10, 100, 300, 500],
        };
    },
    mounted() {
        this.tableComponents[4].options = this.levelList;
        this.queryLogModules();
    },
    methods: {
        handleTableRowDbClick(row) {
            console.log(row);
            queryLogDetail({
                plantCode: this.formField.PLANT_CODE,
                sysCode: "mes",
                logId: row.logRecordId,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.dialogVisible = true;
                        this.moreContent = res.rows;
                        // this.$alert(res.rows, '消息明细', {
                        //   customClass: 'customAlertClass',
                        // })
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
        formatter(val) {
            if (val.logLevel) {
                const obj = this.levelList.find(
                    (item) => item.lookupValueCode == val.logLevel
                );
                return obj ? obj.lookupValueName : "";
            } else {
                return "";
            }
        },
        save() {},
        queryData() {
            const sdt = new Date(this.formField.startTime.replace(/-/g, "/"));
            const sdt2 = new Date(this.formField.endTime.replace(/-/g, "/"));
            if (sdt > sdt2) {
                this.$alert("起始时间不能大于结束时间！", "提示");
                return;
            }
            this.queryTable(1);
        },
        queryLogModules() {
            queryLogModules({
                plantCode: this.formField.PLANT_CODE,
                sysCode: "mes",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach(function (item) {
                            item.logModulesName =
                                item.logModulesName + " - " + item.logModulesId;
                        });

                        this.tableComponents[1].options = res.rows;
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
        handleBlur(name, value) {
            console.log("handleBlur", name, value);
        },
        rowClick(row) {
            //   this.$refs.multipleTable.toggleRowSelection(row)
            console.log(row.logMsg);
        },
        dbClick(row) {
            console.log(row);
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/projectPassRecord/projectPassRecord.scss";
.customAlertClass {
    text-align: left;
}
.log_detail {
    height: 400px;
    overflow-y: auto;
    padding: 10px;
    word-break: normal;
}
</style>
