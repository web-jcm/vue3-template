<template>
    <div class="contain_wrap">
        <el-tree
            style="height: 100%; overflow: auto"
            :data="treeList"
            node-key="id"
            highlight-current
            :default-expanded-keys="defaultArr"
            :expand-on-click-node="false"
            @node-click="nodeClick"
        >
            <template #default="{ node, data }">
                <div class="tree_label" :title="node.label">
                    {{ node.label }}
                </div>
            </template>
        </el-tree>
        <div class="form_wrap">
            <div class="btn_wrap">
                <el-button
                    icon="iconfont icon-search"
                    type="primary"
                    @click="search()"
                    >查询</el-button
                >
                <el-button
                    v-if="currentLevel === 6"
                    icon="iconfont  icon-preservation"
                    @click="save()"
                    >保存</el-button
                >
            </div>
            <el-form label-width="80px" :model="currentData">
                <template v-if="currentLevel === 2">
                    <el-form-item label="工厂编码">
                        <el-input
                            v-model="currentData.PLANT_CODE"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="工厂名称">
                        <el-input
                            v-model="currentData.PLANT_NAME"
                            disabled
                        ></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="currentLevel === 3">
                    <el-form-item label="工厂名称">
                        <el-input
                            v-model="currentData.label2"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="车间编码">
                        <el-input
                            v-model="currentData.PROCESS_LOCATION"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="车间名称">
                        <el-input
                            v-model="currentData.PROCESS_LOCATION_NAME"
                            disabled
                        ></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="currentLevel === 4">
                    <el-form-item label="工厂名称">
                        <el-input
                            v-model="currentData.label2"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="车间名称">
                        <el-input
                            v-model="currentData.label3"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="生产线编码">
                        <el-input
                            v-model="currentData.LINE_NO"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="生产线名称">
                        <el-input
                            v-model="currentData.LINE_NAME"
                            disabled
                        ></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="currentLevel === 6">
                    <el-form-item label="工厂名称">
                        <el-input
                            v-model="currentData.label2"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="车间名称">
                        <el-input
                            v-model="currentData.label3"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="生产线名称">
                        <el-input
                            v-model="currentData.label4"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <template v-if="currentData.labelType === 'zone'">
                        <el-form-item label="区域编码">
                            <el-input
                                v-model="currentData.ZONE_CODE"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="区域名称">
                            <el-input
                                v-model="currentData.ZONE_NAME"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="最大在制">
                            <el-input
                                v-model="currentData.MAX_ONHAND"
                                v-rule="'19'"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="最小在制">
                            <el-input
                                v-model="currentData.MIN_ONHAND"
                                v-rule="'20'"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="标准在制">
                            <el-input
                                v-model="currentData.STD_ONHAND"
                                v-rule="'21'"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="是否顺序区">
                            <el-radio-group v-model="currentData.ZONE_TYPE">
                                <el-radio label="S">是</el-radio>
                                <el-radio label="R">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <template v-if="currentData.labelType === 'point'">
                        <el-form-item label="点位编码">
                            <el-input
                                v-model="currentData.POINT_CODE"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="点位名称">
                            <el-input
                                v-model="currentData.POINT_NAME"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="点位前区域">
                            <el-input
                                v-model="currentData.FRONT_ZONE"
                                disabled
                            ></el-input>
                            <!-- <el-select v-model="currentData.FRONT_ZONE"
                disabled>
                <el-option v-for="item in zoneList"
                  :key="item.ZONE_CODE"
                  :label="item.ZONE_NAME"
                  :value="item.ZONE_CODE">
                </el-option>
              </el-select> -->
                        </el-form-item>
                        <el-form-item label="点位后区域">
                            <el-input
                                v-model="currentData.BEHIND_ZONE"
                                disabled
                            ></el-input>
                            <!-- <el-select v-model="currentData.BEHIND_ZONE"
                disabled>
                <el-option v-for="item in zoneList"
                  :key="item.ZONE_CODE"
                  :label="item.ZONE_NAME"
                  :value="item.ZONE_CODE">
                </el-option>
              </el-select> -->
                        </el-form-item>
                        <el-form-item label="工位编码">
                            <el-input
                                v-model="currentData.STATION_CODE"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="工位名称">
                            <el-input
                                v-model="currentData.STATION_NAME"
                                disabled
                            ></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="currentData.labelType === 'station'">
                        <el-form-item label="工位类型">
                            <el-span>{{
                                currentData.POINT_TYPE == 1
                                    ? "车身"
                                    : currentData.POINT_TYPE == 2
                                    ? "车架"
                                    : ""
                            }}</el-span>
                            <!-- <el-input v-model="currentData.POINT_TYPE"
                disabled></el-input> -->
                        </el-form-item>
                        <el-form-item label="工位分组">
                            <el-input
                                v-model="currentData.POINT_GROUP"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="工位编码">
                            <el-input
                                v-model="currentData.POINT_CODE"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="工位名称">
                            <el-input
                                v-model="currentData.POINT_NAME"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="当前车辆管理号">
                            <el-input
                                v-model="currentData.CTRL_KEY"
                                disabled
                            ></el-input>
                        </el-form-item>
                    </template>
                </template>
                <template v-else>
                    <el-empty description="当前节点无数据"></el-empty>
                </template>
            </el-form>
        </div>
    </div>
</template>
<script>
import {
    queryTree,
    queryZones,
    saveFactory,
    savePlant,
    saveLine,
    saveZone,
    savePoint,
    saveStation,
} from "@/api/apiList/mes";
export default {
    name: "factoryModel",
    data() {
        return {
            formData: {},
            options: [],
            options2: [],
            treeList: [],
            zoneList: [],
            currentLevel: 1,
            currentData: {},
            defaultArr: [],
        };
    },
    watch: {
        currentLevel: function (val) {
            if (val > 1) {
                if (this.currentData.PLANT_CODE) {
                    this.queryZones();
                }
            }
        },
    },
    created() {
        this.search();
    },
    methods: {
        search() {
            this.treeList = [];
            this.queryTree();
        },
        queryZones() {
            queryZones({
                PLANT_CODE: this.currentData.PLANT_CODE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.zoneList = res.rows;
                    } else {
                        this.$utils.message({
                            message: res.msg,
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        queryTree() {
            this.currentLevel = 1;
            this.currentData = {};
            this.loading = this.$loading({
                lock: true,
                text: "请求中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            queryTree({
                ORDERBY: "ORDER_NO",
                IS_VISUAL: 1,
            })
                .then((res) => {
                    this.loading.close();
                    if (res.result === "1" && res.rows) {
                        this.treeList = this.bfsTreeEach(res.rows);
                    } else {
                        this.$utils.message({
                            message: res.msg,
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },

        bfsTreeEach(tree) {
            let node,
                nodes = tree.slice();
            let flag = true;
            let id = 1;
            while ((node = nodes.shift())) {
                //处理tree
                // console.log(node)
                node.id = id;

                if (node.PROCESS_LOCATION_NAME || flag) {
                    this.defaultArr.push(node.id);
                }
                if (node.PROCESS_LOCATION_NAME) {
                    flag = false;
                }
                id++;
                if (node.children && node.children.length) {
                    nodes.push(...node.children);
                }
            }
            console.log(tree);
            return tree;
        },

        nodeClick(item, node, el) {
            console.log(this.currentLevel);
            this.currentLevel = node.level;
            this.currentData = item;
        },
        save() {
            if (this.currentData.PLANT_CODE) {
                this.currentData.OPT_TYPE = "U";
                if (this.currentLevel === 2) {
                    // this.saveFactory();
                } else if (this.currentLevel === 3) {
                    // this.savePlant();
                } else if (this.currentLevel === 4) {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    this.saveLine();
                } else if (this.currentLevel === 6) {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    if (this.currentData.labelType === "zone") {
                        this.saveZone();
                    } else if (this.currentData.labelType === "point") {
                        this.savePoint();
                    } else if (this.currentData.labelType === "station") {
                        this.saveStation();
                    }
                }
            }
        },
        saveFactory() {
            saveFactory(this.currentData)
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                        type: res.result === "0" ? "warning" : "success",
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        savePlant() {
            savePlant(this.currentData)
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                        type: res.result === "0" ? "warning" : "success",
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        saveLine() {
            saveLine(this.currentData)
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                        type: res.result === "0" ? "warning" : "success",
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        saveZone() {
            saveZone(this.currentData)
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                        type: res.result === "0" ? "warning" : "success",
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        savePoint() {
            savePoint(this.currentData)
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                        type: res.result === "0" ? "warning" : "success",
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        saveStation() {
            saveStation(this.currentData)
                .then((res) => {
                    this.loading.close();
                    this.$utils.message({
                        message: res.msg,
                        type: res.result === "0" ? "warning" : "success",
                    });
                    if (res.result === "1") this.search();
                })
                .catch((err) => {
                    this.loading.close();
                    console.log(err);
                });
        },
        getParentName(level, arr, labelId) {
            let newArr = [];
            arr.forEach((element) => {
                if (element[key].indexOf(value) > -1) {
                    // 判断条件
                    newArr.push(element);
                } else {
                    if (element.children && element.children.length > 0) {
                        let redata = getParentName(
                            value,
                            element.children,
                            key
                        );
                        if (redata && redata.length > 0) {
                            let obj = {
                                ...element,
                                children: redata,
                            };
                            newArr.push(obj);
                        }
                    }
                }
            });
            return newArr;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/factoryModel/factoryModel.scss";
</style>
