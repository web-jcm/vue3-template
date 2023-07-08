<template>
    <div class="app-container">
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :dynamic-api-config="apiConfig"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamic-is-show-select="true"
            :dynamicIsClickShowSelect="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :isShowPagination="false"
        >
            <template v-slot:shiftStartHhmm="scope">
                <div>{{ getTime(scope.row.shiftStartHhmm) }}</div>
            </template>
            <template v-slot:shiftEndHhmm="scope">
                <div>{{ getTime(scope.row.shiftEndHhmm) }}</div>
            </template>
            <template v-slot:nextShiftStartHhmm="scope">
                <div>{{ getTime(scope.row.nextShiftStartHhmm) }}</div>
            </template>
            <template v-slot:nextShiftEndHhmm="scope">
                <div>{{ getTime(scope.row.nextShiftEndHhmm) }}</div>
            </template>
            <template v-slot:changeType="scope">
                <div>{{ scope.row.changeType === "0" ? "手动" : "自动" }}</div>
            </template>
        </n-data-table>
        <edit
            v-if="dialogVisible2"
            :dialogVisible="dialogVisible2"
            :selectRow="selectRow"
            @close="dialogClose"
        />
        <check
            v-if="dialogVisible"
            :dialogVisible="dialogVisible"
            @close="dialogClose"
        />
    </div>
</template>
<script>
import { saveSwitchShift, mesApis } from "@/api/apiList/mes";
import Vue from "vue";

export default {
    name: "shiftConversionFunction",
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
        Edit: () => import("./edit"),
        check: () => import("./check"),
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
            dialogVisible: false,
            dialogVisible2: false,
            // 网格查询API配置对象
            apiConfig: mesApis.querySwitchShift,
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
                              text: "查询",
                            name: "search",
                            position: "right",
                        },
                        {
                              compKey: "btnKey_save",
                            type: "",
                            size: "small",
                            clickEvent: () => this.save(),
                            text: "班转换",
                            name: "preservation",
                            position: "right",
                          },
                        {
                            compKey: "btnKey_check",
                            type: "",
                            size: "small",
                            clickEvent: () => (this.dialogVisible = true),
                            text: "转换条件",
                            name: "chakan",
                            position: "right",
                        },
                        {
                            compKey: "btnKey_edit",
                              type: "",
                            size: "small",
                            clickEvent: () => this.edit(),
                            text: "生产日期变更",
                            name: "edit",
                            disabled: false,
                            position: "right",
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
                            prop: "sectionCode",
                            label: "管理区间",
                        },
                        {
                            prop: "sectionName",
                            label: "管理区间名",
                        },
                        {
                            prop: "workDate",
                            label: "当班生产日",
                        },
                        {
                            prop: "shift",
                              label: "当班",
                            width: 50,
                        },
                        {
                            prop: "shiftPatternCode",
                            label: "当班形式",
                            width: 50,
                          },
                        {
                            prop: "shiftStartHhmm",
                            label: "当班开始",
                            isSlot: true,
                        },
                        {
                            prop: "shiftEndHhmm",
                            label: "当班结束",
                            isSlot: true,
                        },
                        {
                            prop: "shiftWorkingHhmm",
                              label: "当班作业时间",
                        },
                        {
                            prop: "shiftChangeDate",
                            label: "转换时间",
                            width: 110,
                        },
                        {
                            prop: "nextWorkDate",
                            label: "次班生产日",
                        },
                        {
                            prop: "nextShift",
                            label: "次班",
                            width: 50,
                        },
                        {
                            prop: "nextShiftPatternCode",
                            label: "次班形式",
                            width: 50,
                        },
                        {
                            prop: "nextShiftStartHhmm",
                              label: "次班开始",
                            isSlot: true,
                          },
                        {
                            prop: "nextShiftEndHhmm",
                            label: "次班结束",
                            isSlot: true,
                          },
                        {
                            prop: "changeType",
                            label: "转换方式",
                            isSlot: true,
                          },
                    ],
            // 表单查询数据
            formField: this.$utils.getFormField(
                this,
                {
                    plantCode: "",
                },
                this.$ConfigCache.CacheConfig.cacheData[viewPageCode]
            ),
            selectRow: {},
        };
    },
    watch: {
        "formField.plantCode": function () {
            this.$nextTick(() => this.search());
        },
    },
    methods: {
        search() {
            this.queryTable(1);
        },
        getTime(timeStr) {
            if (timeStr) {
                let time = timeStr.split("");
                time.splice(2, 0, ":");
                time = time.join().replace(/,/g, "");
                return time;
            }
        },
        save() {
            let sectionData = this.$refs.multipleTable.selection;
            if (sectionData.length) {
                this.$confirm("是否保存当前修改?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    let arr = [];
                    sectionData.forEach((item) => {
                        arr.push(item.sectionCode);
                    });
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveSwitchShift({
                        plantCode: this.formField.plantCode,
                        sectionCode: arr,
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
                });
            } else {
                this.$utils.message({
                    message: "请选择要转换的数据!",
                });
            }
        },
        // 编辑生产日期变更按钮事件
        edit() {
            let sectionData = this.$refs.multipleTable.selection;
            if (sectionData.length === 1) {
                this.selectRow = sectionData[0];
                this.dialogVisible2 = true;
            } else {
                this.$utils.message({
                    message: "请选择一个变更的数据!",
                });
            }
        },
        handleDialogSave() {
            this.$emit("handleDialogSave");
        },
        dialogClose() {
            this.dialogVisible = false;
            this.dialogVisible2 = false;
            this.search();
        },
    },
};
</script>
