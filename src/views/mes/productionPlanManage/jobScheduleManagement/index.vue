<template>
    <div class="contain_wrap">
        <SearchForm
            :form="tableForm"
            :data="formData"
            @reset="reset"
            @search="search"
        />
        <div class="table_wrap">
            <div class="flex m_b_10">
                <n-button class="m_r_10" @click="save">保存</n-button>
                <n-upload
                    class="m_r_10"
                    :custom-request="uploadFile"
                    :show-file-list="false"
                >
                    <n-button>导入</n-button>
                </n-upload>
                <n-button @click="downloadTemplate">下载模板</n-button>
            </div>
            <n-data-table
                :key="(row) => row.workDate"
                :columns="columns"
                :data="data"
                flex-height
                style="height: 100%"
            >
            </n-data-table>
        </div>
    </div>
</template>
<script setup>
import {
    queryCalendar,
    saveCalendar,
    uploadCalendar,
    queryProductionType,
} from "@/api/mes";
import SearchForm from "@/components/searchForm.vue";
import { NSelect } from "naive-ui";
import dayjs from "dayjs";
import { getWeekDay } from "@/utils";
import {
    usePlant,
    useOrgnaztion,
    useLocation,
    useLineNo,
} from "@/views/commonFn/requestFn.js";
let formData = reactive({
    plantCode: "",
    mesOrgCode: "",
    processLocation: "",
    lineNo: "",
    dateFormat: Date.now(),
});
let file = reactive({ name: "" });
let typeList = reactive([]);
let data = reactive([]);
let tableForm = reactive([
    {
        label: "工厂名称",
        code: "plantCode",
        type: "select",
        options: [],
        labelField: "PLANT_NAME",
        valueField: "PLANT_CODE",
        rule: {
            required: true,
            trigger: ["change", "blur"],
        },
    },
    {
        label: "组织",
        code: "mesOrgCode",
        type: "select",
        options: [],
        labelField: "MES_ORG_NAME",
        valueField: "MES_ORG_CODE",
        rule: {
            required: true,
            trigger: ["change", "blur"],
        },
    },
    {
        label: "车间",
        code: "processLocation",
        type: "select",
        options: [],
        labelField: "PROCESS_LOCATION_NAME",
        valueField: "PROCESS_LOCATION",
        rule: {
            required: true,
            trigger: ["change", "blur"],
        },
    },
    {
        label: "生产线",
        code: "lineNo",
        type: "select",
        options: [],
        labelField: "LINE_NAME",
        valueField: "LINE_NO",
        rule: {
            required: true,
            trigger: ["change", "blur"],
        },
    },
    {
        label: "年月",
        code: "dateFormat",
        type: "dateMonth",
        rule: {
            type: "number",
            required: true,
            trigger: ["change", "blur"],
        },
    },
]);
let columns = reactive([
    {
        key: "workDate",
        title: "日期",
    },
    {
        key: "wDay",
        title: "星期",
        render(row) {
            return h("div", {}, { default: () => getWeekDay(row.wDay) });
        },
    },
    {
        key: "processLocationName",
        title: "车间",
    },
    {
        key: "lineName",
        title: "生产线",
    },
    {
        key: "shiftPatternCode1",
        title: "班1",
        render(row, index) {
            return h(NSelect, {
                value: row.shiftPatternCode1,
                options: typeList,
                onUpdateValue(v) {
                    data[index].shiftPatternCode1 = v;
                },
            });
        },
    },
    {
        key: "shiftPatternCode2",
        title: "班2",
        render(row, index) {
            return h(NSelect, {
                value: row.shiftPatternCode2,
                options: typeList,
                onUpdateValue(v) {
                    data[index].shiftPatternCode2 = v;
                },
            });
        },
    },
    {
        key: "shiftPatternCode3",
        title: "班3",
        render(row, index) {
            return h(NSelect, {
                value: row.shiftPatternCode3,
                options: typeList,
                onUpdateValue(v) {
                    data[index].shiftPatternCode3 = v;
                },
            });
        },
    },
]);

watch(
    () => formData.plantCode,
    async (val) => {
        formData.mesOrgCode = "";
        tableForm[1].options = [];
        if (val) {
            tableForm[1].options = await useOrgnaztion({
                plantCode: formData.plantCode,
            });
            formData.mesOrgCode = tableForm[1].options[0]?.MES_ORG_CODE;
        }
    }
);
watch(
    () => formData.mesOrgCode,
    async (val) => {
        formData.processLocation = "";
        tableForm[2].options = [];
        typeList = [];
        if (val) {
            getProductionType();
            tableForm[2].options = await useLocation({
                plantCode: formData.plantCode,
                mesOrgCode: formData.mesOrgCode,
            });
            formData.processLocation =
                tableForm[2].options[0]?.PROCESS_LOCATION;
        }
    }
);
watch(
    () => formData.processLocation,
    async (val) => {
        formData.lineNo = "";
        tableForm[3].options = [];
        if (val) {
            tableForm[3].options = await useLineNo({
                plantCode: formData.plantCode,
                mesOrgCode: formData.mesOrgCode,
                processLocation: formData.processLocation,
            });
            formData.lineNo = tableForm[3].options[0]?.LINE_NO;
        }
    }
);
watch(typeList, (val) => {
    tableCols[4].comps[0].options = val;
    tableCols[5].comps[0].options = val;
    tableCols[6].comps[0].options = val;
});
onMounted(async () => {
    tableForm[0].options = await usePlant();
    formData.plantCode = tableForm[0].options[0]?.PLANT_CODE;
});
async function getProductionType() {
    try {
        const res = await queryProductionType({
            plantCode: formData.plantCode,
            mesOrgCode: formData.mesOrgCode,
        });
        if (res.result == "1") {
            res.rows.rows.forEach((item) => {
                if (item.shiftPatternCode === "0") {
                    typeList.push({
                        label: `${item.shiftPatternName} | 不生产`,
                        value: item.shiftPatternCode,
                    });
                } else {
                    typeList.push({
                        label: `${item.shiftPatternName} | ${item.shiftStartHhmm}-${item.shiftEndHhmm}`,
                        value: item.shiftPatternCode,
                    });
                }
            });
        } else {
            $message.warning(res.msg);
        }
    } catch (err) {
        $message.warning(err.message);
    }
}
async function search() {
    try {
        data.length = 0;
        const res = await queryCalendar({
            plantCode: formData.plantCode,
            mesOrgCode: formData.mesOrgCode,
            processLocation: formData.processLocation,
            lineNo: formData.lineNo,
            dateFormat: dayjs(formData.dateFormat).format("YYYY-MM"),
        });
        if (res.result == "1") {
            $message.success(res.msg);
            data.push(...res.rows.rows);
        } else {
            $message.warning(res.msg);
        }
    } catch (err) {
        $message.warning(err.message);
    }
}
function save() {
    if (!data.length) return;
    const d = $dialog.warning({
        title: "提示",
        content: "是否保存当前修改?",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            try {
                d.loading = true;
                const res = await saveCalendar({
                    plantCode: formData.plantCode,
                    mesOrgCode: formData.mesOrgCode,
                    processLocation: formData.processLocation,
                    lineNo: formData.lineNo,
                    row: data,
                });
                if (res.result == "1") {
                    $message.success(res.msg);
                    search();
                } else {
                    $message.warning(res.msg);
                }
            } catch (err) {
                $message.warning(err.message);
            }
        },
    });
}
function downloadTemplate() {
    let hrefStr = encodeURI(
        "/vue-dist/mesControl/ImportTemplate/工作日历管理_导入模板.xlsx"
    );
    window.location.href = hrefStr;
}
async function uploadFile({ file }) {
    if (!formData.mesOrgCode || !formData.processLocation || !formData.lineNo) {
        return $message.warning("组织、车间、生产线不能为空!");
    }
    var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
    const extension = testmsg === "xls";
    const extension2 = testmsg === "xlsx";
    if (!extension && !extension2) {
        return $message.warning("上传文件只能是 xls、xlsx格式!");
    }
    try {
        // const res = await uploadCalendar({params:{
        //     plantCode: formData.plantCode,
        //     mesOrgCode: formData.mesOrgCode,
        //     processLocation: formData.processLocation,
        //     lineNo: formData.lineNo,
        //     dateFormat: dayjs(formData.dateFormat).format("YYYY-MM"),
        // },file: });
        // if (res.result === "1") {
        //     $message.success("导入成功！");
        // } else {
        //     $message.error(res.msg);
        // }
        // this.$requestImport(
        //     "/ly/mp/mom/mes/vmes/plan/calendarService/importCalendar.do",
        //     file,
        //     (res) => {
        //         if (res.result == "1") {
        //             $message.success("导入成功！");
        //             search();
        //         } else {
        //             $message.warning(res.msg);
        //         }
        //     },
        //     `&plantCode=${formData.plantCode}&processLocation=${formData.processLocation}&lineNo=${formData.lineNo}`
        // );
    } catch (err) {
        $message.warning(err.message);
    }
}
function reset() {
    formData.plantCode = "";
    formData.mesOrgCode = "";
    formData.processLocation = "";
    formData.lineNo = "";
    formData.dateFormat = Date.now();
}
</script>
<style lang="scss" scoped></style>
