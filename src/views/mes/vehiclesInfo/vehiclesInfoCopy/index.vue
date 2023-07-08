<template>
    <div class="contain_wrap">
        <div class="btn_wrap flex">
            <div class="flex">
                <div class="label"><i class="iconRequired"></i>工厂名称</div>
                <el-select v-model="formData.PLANT_CODE" placeholder="请选择">
                    <el-option
                        v-for="item in plants"
                        :key="item.PLANT_CODE"
                        :label="item.PLANT_NAME"
                        :value="item.PLANT_CODE"
                    ></el-option>
                </el-select>
            </div>
            <div class="flex">
                <el-button
                    type="primary"
                    icon="iconfont icon-chakan"
                    @click="view()"
                    >查看复制源</el-button
                >
                <el-button
                    type="primary"
                    icon="iconfont  iconhengshuping-copy"
                    @click="save()"
                    >复制</el-button
                >
            </div>
        </div>
        <div class="form_wrap">
            <el-divider content-position="left">复制车辆信息源</el-divider>
            <div class="form_item_wrap flex">
                <div class="label">管理号</div>
                <el-input
                    v-model="formData.SOURCE_CTRL_KEY"
                    v-rule="'1'"
                ></el-input>
            </div>
            <el-divider content-position="left">建立整车步骤</el-divider>
            <div class="form_item_wrap">
                <div class="flex m_b_10">
                    <div class="label">初始区</div>
                    <el-select
                        v-model="formData.TARGET_ZONE_CODE"
                        placeholder="请选择区"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.ZONE_CODE"
                            :label="item.ZONE_NAME"
                            :value="item.ZONE_CODE"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="flex m_b_10">
                    <div class="label">新管理号</div>
                    <el-input
                        v-model="formData.TARGET_CTRL_KEY"
                        v-rule="'1'"
                    ></el-input>
                </div>
                <div class="flex m_b_10">
                    <div class="label">车辆区分</div>
                    <el-select
                        v-model="formData.TYPE_CD"
                        placeholder="请选择区分"
                    >
                        <el-option
                            v-for="item in options2"
                            :key="item.LOOKUP_VALUE_CODE"
                            :label="item.LOOKUP_VALUE_NAME"
                            :value="item.LOOKUP_VALUE_CODE"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    saveInfoCopy,
    queryZone,
    queryLookupValues,
    queryPlant,
} from "@/api/apiList/mes";

export default {
    name: "vehiclesInfoCopy",
    components: {},
    // 组件混入对象
    mixins: [],
    data() {
        return {
            formData: {
                PLANT_CODE: "",
                TARGET_ZONE_CODE: "",
                SOURCE_CTRL_KEY: "",
                TARGET_CTRL_KEY: "",
                TYPE_CD: "",
            },
            plants: [],
            options: [],
            options2: [],
        };
    },
    async created() {
        await this.queryPlant();
        this.queryLookupValues();
        this.queryZone();
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
                            this.formData.PLANT_CODE = res.rows[0].PLANT_CODE;
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
        queryLookupValues() {
            queryLookupValues({
                plantCode: this.formData.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "CAR_TYPE",
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.options2 = res.rows;
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
        queryZone() {
            queryZone({
                plantCode: this.formData.PLANT_CODE,
                tenancyId: this.$store.state.user.tenancyId,
                TEMP_ZONES: ["B#H01"],
            })
                .then((res) => {
                    if (res.result === "1") {
                        this.options = res.rows;
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
        save() {
            if (
                this.formData.SOURCE_CTRL_KEY.length < 9 &&
                this.formData.TARGET_CTRL_KEY.length < 9
            ) {
                this.$utils.message({
                    message: "管理号由9位数字或数字与字母组成！",
                });
            } else {
                this.$confirm("是否复制当前管理号?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: "保存中",
                        background: "rgba(0, 0, 0, 0.7)",
                    });
                    saveInfoCopy(this.formData)
                        .then((res) => {
                            this.loading.close();
                            this.$utils.message({
                                message: res.msg,
                            });
                            if (res.result === "1") {
                                this.$confirm("是否跳转到新管理号?", "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                }).then(() => {
                                    this.navigate(
                                        "vehiclesBaseInfoManagement",
                                        "ctrlKey",
                                        this.formData.TARGET_CTRL_KEY
                                    );
                                });
                            }
                        })
                        .catch((err) => {
                            this.loading.close();
                            console.log(err);
                        });
                });
            }
        },
        view() {
            if (this.formData.SOURCE_CTRL_KEY.length < 9) {
                this.$utils.message({
                    message: "管理号由9位数字或数字与字母组成！",
                });
            } else {
                this.navigate(
                    "vehiclesBaseInfoManagement",
                    "ctrlKey",
                    this.formData.SOURCE_CTRL_KEY
                );
            }
        },
        navigate(path, key, value) {
            const myMenu = window.parent.$api.menu.findMenusByPath(path);
            if (myMenu?.length) {
                sessionStorage.setItem(
                    path,
                    JSON.stringify({
                        key: key,
                        value: value,
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
            //         key: key,
            //         value: value,
            //     },
            // });
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/mes/vehiclesInfoCopy/vehiclesInfoCopy.scss";
</style>
