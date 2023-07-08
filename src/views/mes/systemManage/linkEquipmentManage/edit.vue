<template>
    <el-dialog
        visible
        v-dialogDrag
        :append-to-body="true"
        width="600px"
        top="20px"
        @close="cancel"
    >
        <dialogHeader
            slot="title"
            :title="textMap[showType]"
            :style-type="$store.state.app.dialogType"
        />
        <div class="form_wrap">
            <div class="flex row_between m_b_10">
                <div class="flex">
                    <div class="label"><i class="iconRequired"></i>设备ID</div>
                    <el-input v-model="formField.DEVICE_ID"></el-input>
                </div>
                <div class="flex">
                    <div class="label">
                        <i class="iconRequired"></i>设备名称
                    </div>
                    <el-input v-model="formField.DEVICE_NAME"></el-input>
                </div>
            </div>
            <div class="flex m_b_10">
                <div class="label">
                    <i class="iconRequired"></i>设备名称说明
                </div>
                <el-input v-model="formField.DEVICE_CALL_NAME"></el-input>
            </div>
            <div class="flex m_b_10">
                <div class="label"><i class="iconRequired"></i>设备描述</div>
                <el-input v-model="formField.DESCRIPTION"></el-input>
            </div>
            <div class="flex row_between m_b_10">
                <div class="flex">
                    <div class="label">
                        <i class="iconRequired"></i>设备类型
                    </div>
                    <el-select v-model="formField.DEVICE_TYPE">
                        <el-option
                            v-for="item in selectArr1"
                            :label="item.LOOKUP_VALUE_NAME"
                            :value="item.LOOKUP_VALUE_CODE"
                            :key="item.LOOKUP_VALUE_CODE"
                        ></el-option>
                    </el-select>
                </div>
                <div class="flex">
                    <div class="label">
                        <i class="iconRequired"></i>设备子类型
                    </div>
                    <el-select v-model="formField.SUB_DEVICE_TYPE">
                        <el-option
                            v-for="item in selectArr2"
                            :label="item.subDeviceName"
                            :value="item.subDeviceType"
                            :key="item.subDeviceType"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div class="flex row_between m_b_10">
                <div class="flex">
                    <div class="label"><i class="iconRequired"></i>IP地址</div>
                    <el-input v-model="formField.IPADDRESS"></el-input>
                </div>
                <div class="flex">
                    <div class="label">端口</div>
                    <el-input v-model="formField.DEVICE_PORT"></el-input>
                </div>
            </div>
            <div class="flex row_between">
                <div class="flex">
                    <div class="label"><i class="iconRequired"></i>车间</div>
                    <el-select v-model="formField.GROUP_ID">
                        <el-option
                            v-for="item in selectArr3"
                            :label="item.PROCESS_LOCATION_NAME"
                            :value="item.PROCESS_LOCATION"
                            :key="item.PROCESS_LOCATION"
                        ></el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                size="small"
                :icon="loading ? 'el-icon-loading' : 'iconfont  icon-confirm'"
                :disabled="loading ? true : false"
                @click="save"
                >确认</el-button
            >
            <el-button
                size="small"
                icon="iconfont  icon-cancel"
                :disabled="loading ? true : false"
                @click="cancel"
                >取消</el-button
            >
        </div>
    </el-dialog>
</template>
<script>
import {
    linkEquipmentDetail,
    queryLookupValues,
    saveLinkEquipment,
    querySubEquipment,
    queryWorkShopList,
} from "@/api/apiList/mes";
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        plantCode: {
            type: String,
            default: "",
        },
        showType: {
            type: String,
            default: "add",
        },
        clickRowsData: {},
    },
    data() {
        return {
            loading: false,
            // 标题
            textMap: {
                add: "连接设备新增",
                edit: "连接设备编辑",
            },
            formField: {
                GROUP_ID: "",
                DEVICE_ID: "",
                DEVICE_NAME: "",
                DEVICE_CALL_NAME: "",
                DESCRIPTION: "",
                DEVICE_TYPE: "",
                IPADDRESS: "",
                DEVICE_PORT: "",
                SUB_DEVICE_TYPE: "",
            },
            selectArr1: [],
            selectArr2: [],
            selectArr3: [],
            selectLoading: false,
        };
    },
    watch: {
        "formField.DEVICE_TYPE": function (val, old) {
            if (old) {
                this.formField.SUB_DEVICE_TYPE = "";
            }
            this.querySubEquipment();
        },
    },
    async created() {
        this.formField.PLANT_CODE = this.plantCode;
        await this.queryWorkShopList();
        await this.queryLookupValues();
        if (this.showType === "edit" && this.clickRowsData.DEVICE_ID) {
            this.linkEquipmentDetail();
        }
    },
    methods: {
        queryWorkShopList() {
            this.selectArr3 = [];
            return queryWorkShopList({
                PLANT_CODE: this.plantCode,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr3 = res.rows;
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
            return queryLookupValues({
                plantCode: this.plantCode,
                tenancyId: this.$store.state.user.tenancyId,
                lookupType: "DEVICE_TYPE",
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr1 = res.rows;
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
        querySubEquipment() {
            this.selectArr2 = [];
            querySubEquipment({
                plantCode: this.plantCode,
                lookupTypeCode: "SUB_DEVICE_TYPE",
                lookupValueCode:
                    this.formField.DEVICE_TYPE ||
                    this.clickRowsData.DEVICE_TYPE,
            })
                .then((res) => {
                    if (res.result === "1" && res.rows) {
                        this.selectArr2 = res.rows;
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
        linkEquipmentDetail() {
            this.loading = true;
            linkEquipmentDetail({
                PLANT_CODE: this.plantCode,
                DEVICE_ID: this.clickRowsData.DEVICE_ID,
            })
                .then((res) => {
                    this.loading = false;
                    if (res.result === "1" && res.rows) {
                        this.formField = res.rows[0];
                    } else {
                        this.$utils.message({
                            message: res.msg,
                        });
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
        },
        save() {
            if (!this.formField.GROUP_ID) {
                return this.$utils.message({
                    message: "请选择车间!",
                });
            }
            if (!this.formField.DEVICE_ID) {
                return this.$utils.message({
                    message: "请填写设备ID!",
                });
            }
            if (!this.formField.DEVICE_NAME) {
                return this.$utils.message({
                    message: "请填写设备名称!",
                });
            }
            if (!this.formField.DEVICE_CALL_NAME) {
                return this.$utils.message({
                    message: "请填写设备名称说明!",
                });
            }
            if (!this.formField.DESCRIPTION) {
                return this.$utils.message({
                    message: "请填写设备描述!",
                });
            }
            if (!this.formField.DEVICE_TYPE) {
                return this.$utils.message({
                    message: "请选择设备!",
                });
            }
            if (!this.formField.SUB_DEVICE_TYPE) {
                return this.$utils.message({
                    message: "请选择子设备!",
                });
            }
            this.$confirm("确定要保存吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.formField.DEVICE_STATUS =
                        this.showType === "add" ? "-1" : "";
                    this.loading = true;
                    saveLinkEquipment({
                        PLANT_CODE: this.plantCode,
                        ROWS: [this.formField],
                    })
                        .then((res) => {
                            this.$utils.message({
                                message: res.msg,
                            });
                            this.loading = false;
                            if (res.result === "1") this.cancel();
                        })
                        .catch((err) => {
                            this.loading = false;
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        cancel() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="scss" scoped>
.form_wrap {
    padding: 16px;
    .flex {
        display: flex;
        align-items: center;
    }
    .m_b_10 {
        margin-bottom: 10px;
    }
    .row_between {
        justify-content: space-between;
        .el-input {
            width: 160px;
        }
        .el-select {
            width: 160px;
            line-height: 32px;
        }
    }
    .label {
        flex-shrink: 0;
        width: 100px;
    }
}
</style>
