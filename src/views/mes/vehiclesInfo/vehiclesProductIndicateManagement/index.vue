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
        </div>
        <n-data-table
            ref="multipleTable"
            :key="oneTableKey"
            :dynamic-buttons="tableButtons"
            :dynamic-components="tableComponents"
            :infoComponents="infoComponents"
            :dynamic-table-cols="tableCols"
            :dynamic-form-fields="formField"
            :dynamicResultField="resultField"
            :dynamic-is-show-select="false"
            :dynamic-is-init-table="false"
            :dynamic-is-column-drop="false"
            :is-set-default-brand="false"
            :isShowPagination="false"
            :dynamic-export-converts="exportConverts"
            :sectionH="'auto'"
        >
        </n-data-table>
        <div class="contain">
            <el-tabs v-model="activeName">
                <el-tab-pane label="焊装特征码" name="B">
                    <div class="tab_wrap">
                        <div class="flex">
                            <div class="blank_num"></div>
                            <div v-for="num in 25" :key="num" class="num">
                                {{ num }}
                            </div>
                        </div>
                        <div
                            :class="['flex', item % 2 ? '' : 'bgColor']"
                            v-for="item in arr.length"
                            :key="item"
                        >
                            <div class="blank_item">{{ (item - 1) * 25 }}</div>
                            <div
                                v-for="(word, index) in arr[item - 1]"
                                :key="index"
                                class="item"
                                @click="clickItem((item - 1) * 25 + index + 1)"
                            >
                                <el-input
                                    v-model="arr[item - 1][index]"
                                    maxlength="2"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="涂装特征码" name="P">
                    <div class="tab_wrap">
                        <div class="flex">
                            <div class="blank_num"></div>
                            <div v-for="num in 25" :key="num" class="num">
                                {{ num }}
                            </div>
                        </div>
                        <div
                            :class="['flex', item % 2 ? '' : 'bgColor']"
                            v-for="item in arr2.length"
                            :key="item"
                        >
                            <div class="blank_item">{{ (item - 1) * 25 }}</div>
                            <div
                                v-for="(word, index) in arr2[item - 1]"
                                :key="index"
                                class="item"
                                @click="clickItem((item - 1) * 25 + index + 1)"
                            >
                                <el-input
                                    v-model="arr2[item - 1][index]"
                                    maxlength="2"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="总装特征码" name="T">
                    <div class="tab_wrap">
                        <div class="flex">
                            <div class="blank_num"></div>
                            <div v-for="num in 25" :key="num" class="num">
                                {{ num }}
                            </div>
                        </div>
                        <div
                            :class="['flex', item % 2 ? '' : 'bgColor']"
                            v-for="item in arr3.length"
                            :key="item"
                        >
                            <div class="blank_item">{{ (item - 1) * 25 }}</div>
                            <div
                                v-for="(word, index) in arr3[item - 1]"
                                :key="index"
                                class="item"
                                @click="clickItem((item - 1) * 25 + index + 1)"
                            >
                                <el-input
                                    v-model="arr3[item - 1][index]"
                                    maxlength="2"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="零件特征码" name="Long Code Item">
                    <div class="tab_wrap">
                        <div class="flex">
                            <div class="blank_num"></div>
                            <div v-for="num in 5" :key="num" class="num2">
                                {{ num }}
                            </div>
                        </div>
                        <div
                            :class="['flex', item % 2 ? '' : 'bgColor']"
                            v-for="item in arr4.length"
                            :key="item"
                        >
                            <div class="blank_item">{{ (item - 1) * 5 }}</div>
                            <div
                                v-for="(word, index) in arr4[item - 1]"
                                :key="index"
                                class="item2"
                                @click="clickItem((item - 1) * 5 + index + 1)"
                            >
                                <el-input
                                    v-model="arr4[item - 1][index]"
                                    maxlength="12"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="flex">
                <div>生产指示项目名</div>
                <div class="current_click">{{ currentClick }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    queryCarInfo,
    queryCarProductIndicate,
    saveCarProductIndicate,
    queryLookupValues,
} from "@/api/apiList/mes";

import Vue from "vue";

export default {
    name: "vehiclesProductIndicateManagement",
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
                            name: "save",
                            position: "right",
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
            infoComponents: [
                {
                    compKey: "ctrlKey",
                    labelName: "管理号",
                    codeField: "ctrlKey",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "zoneName",
                    labelName: "区域",
                    codeField: "zoneName",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "model",
                    labelName: "车型",
                    codeField: "model",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "configuration",
                    labelName: "配置",
                    codeField: "configuration",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "colorI",
                    labelName: "内饰色",
                    codeField: "colorI",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "colorK",
                    labelName: "外饰色",
                    codeField: "colorK",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
                },
                {
                    compKey: "vinNo",
                    labelName: "VIN",
                    codeField: "vinNo",
                    component: () => import("@/components/org/commonInput"),
                    dataToObject: {
                        placeholder: "",
                    },
                    disabled: true,
                    isComponent: true,
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
            resultField: {
                ctrlKey: "",
                zoneName: "",
                model: "",
                configuration: "",
                colorI: "",
                colorK: "",
                vinNo: "",
            },
            activeName: "B",
            arr: [],
            arr2: [],
            arr3: [],
            arr4: [],
            currentClick: "",
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
            const params = sessionStorage.getItem(
                "vehiclesProductIndicateManagement"
            );
            if (params) {
                this.formField.searchKey = JSON.parse(params).key;
                this.formField.searchValue = JSON.parse(params).value;
                this.$nextTick(() => this.search());
                sessionStorage.removeItem("vehiclesProductIndicateManagement");
            }
            //不集成mp
            // if (this.$route.params.value) {
            //     this.formField.searchKey = this.$route.params.key;
            //     this.formField.searchValue = this.$route.params.value;
            //     this.$nextTick(() => this.search());
            // }
        },
    },
    activated() {
        let params = sessionStorage.getItem(
            "vehiclesProductIndicateManagement"
        );
        if (params) {
            this.formField.searchKey = JSON.parse(params).key;
            this.formField.searchValue = JSON.parse(params).value;
            this.search();
            sessionStorage.removeItem("vehiclesProductIndicateManagement");
        }
        //不集成mp
        // if (this.$route.params.value) {
        //     this.formField.searchKey = this.$route.params.key;
        //     this.formField.searchValue = this.$route.params.value;
        //     this.search();
        // }
    },
    methods: {
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
            if (!this.formField.searchValue) {
                return this.$utils.message({
                    message: "请输入查询值！",
                    type: "wran",
                });
            }
            this.tableComponents[1].options.forEach((item) => {
                if (item.LOOKUP_VALUE_CODE === this.formField.searchKey) {
                    this.formField[item.LOOKUP_VALUE_CODE] =
                        this.formField.searchValue;
                } else {
                    this.formField[item.LOOKUP_VALUE_CODE] = "";
                }
            });
            this.queryInfo();
            this.queryTable();
        },
        queryTable() {
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryCarProductIndicate({
                searchKey: this.formField.searchKey,
                searchValue: this.formField.searchValue,
                PLANT_CODE: this.formField.PLANT_CODE,
            })
                .then((res) => {
                    this.arr = [];
                    this.arr2 = [];
                    this.arr3 = [];
                    this.arr4 = [];
                    if (res.result === "1" && res.rows) {
                        res.rows.forEach((item) => {
                            if (item.INST_TYPE === "1") {
                                this.splitKey(item.INST_DATA, this.arr, 50, 2);
                            } else if (item.INST_TYPE === "2") {
                                this.splitKey(item.INST_DATA, this.arr2, 50, 2);
                            } else if (item.INST_TYPE === "3") {
                                this.splitKey(item.INST_DATA, this.arr3, 50, 2);
                            } else if (item.INST_TYPE === "4") {
                                this.splitKey(
                                    item.INST_DATA,
                                    this.arr4,
                                    60,
                                    12
                                );
                            }
                        });
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                    this.loading.close();
                })
                .catch((err) => {
                    this.arr = [];
                    this.arr2 = [];
                    this.arr3 = [];
                    this.arr4 = [];
                    this.loading.close();
                    console.log(err);
                });
        },
        splitKey(key, arr, numi, numj) {
            let idx = 0;
            for (let i = 0; i < key.length; i = i + numi) {
                let word = "";
                if (i + numi > key.length) {
                    word = key.slice(i);
                } else {
                    word = key.slice(i, i + numi);
                }
                arr.push([]);
                for (let j = 0; j < word.length; j = j + numj) {
                    if (j + numj > word.length) {
                        arr[idx].push(word.slice(j));
                    } else {
                        arr[idx].push(word.slice(j, j + numj));
                    }
                }
                idx++;
            }
        },
        queryInfo() {
            let pram = this.formField;
            pram.tenancyId = this.$store.state.user.tenancyId;
            pram.plantCode = this.formField.PLANT_CODE;
            queryCarInfo(pram)
                .then((res) => {
                    this.resultField.ctrlKey = "";
                    this.resultField.zoneName = "";
                    this.resultField.model = "";
                    this.resultField.configuration = "";
                    this.resultField.colorI = "";
                    this.resultField.colorK = "";
                    this.resultField.vinNo = "";
                    if (res.result === "1" && res.rows?.rows?.length) {
                        let rows = res.rows.rows[0];
                        this.resultField.ctrlKey = rows.ctrlKey;
                        this.resultField.zoneName = rows.zoneName;
                        this.resultField.model = rows.model;
                        this.resultField.configuration = rows.configuration;
                        this.resultField.colorI = rows.colorI;
                        this.resultField.colorK = rows.colorK;
                        this.resultField.vinNo = rows.vinNo;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.resultField.ctrlKey = "";
                    this.resultField.zoneName = "";
                    this.resultField.model = "";
                    this.resultField.configuration = "";
                    this.resultField.colorI = "";
                    this.resultField.colorK = "";
                    this.resultField.vinNo = "";
                    console.log(err);
                });
        },
        clickItem(num) {
            this.currentClick =
                this.activeName +
                (this.activeName === "Long Code Item" ? "" : "0") +
                num;
        },
        save() {
            this.$confirm("是否保存修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let pram = {
                    CTRL_KEY: this.formField.ctrlKey,
                    PLANT_CODE: this.formField.PLANT_CODE,
                    carProduceInstructViList: [],
                };
                pram.carProduceInstructViList.push({
                    INST_DATA: this.arr
                        .flat()
                        .map((item) => {
                            return item.padEnd(2, " ");
                        })
                        .join(""),
                    INST_TYPE: "1",
                });
                pram.carProduceInstructViList.push({
                    INST_DATA: this.arr2
                        .flat()
                        .map((item) => {
                            return item.padEnd(2, " ");
                        })
                        .join(""),
                    INST_TYPE: "2",
                });
                pram.carProduceInstructViList.push({
                    INST_DATA: this.arr3
                        .flat()
                        .map((item) => {
                            return item.padEnd(2, " ");
                        })
                        .join(""),
                    INST_TYPE: "3",
                });
                pram.carProduceInstructViList.push({
                    INST_DATA: this.arr4
                        .flat()
                        .map((item) => {
                            return item.padEnd(12, " ");
                        })
                        .join(""),
                    INST_TYPE: "4",
                });
                this.loading = this.$loading({
                    lock: true,
                    text: "保存中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                saveCarProductIndicate(pram)
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
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesProductIndicateManagement/vehiclesProductIndicateManagement.scss";
</style>
