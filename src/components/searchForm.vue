<template>
    <div class="searchForm_wrap">
        <n-form ref="formRef" :model="formData">
            <n-grid
                :cols="formCols"
                :collapsed="gridCollapsed"
                :collapsed-rows="collapsedRows"
            >
                <n-form-item-gi
                    v-for="item in form"
                    :key="item.code"
                    :label-width="item.labelWidth || 80"
                    :label-placement="item.labelPlacement || 'left'"
                    :label-align="item.labelAlign || 'right'"
                    :label="item.label"
                    :rule="item.rule"
                    :path="item.code"
                >
                    <n-input
                        v-if="item.type === 'input'"
                        v-model:value="formData[item.code]"
                    />
                    <n-select
                        v-if="item.type === 'select'"
                        v-model:value="formData[item.code]"
                        :options="item.options"
                        :label-field="item.labelField"
                        :value-field="item.valueField"
                    />
                    <n-date-picker
                        v-if="item.type === 'dateMonth'"
                        v-model:value="formData[item.code]"
                        type="month"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    class="suffix"
                    suffix
                    :label-placement="'left'"
                    :label-align="'right'"
                >
                    <n-button @click="reset()">重置</n-button>
                    <n-button type="primary" @click="(e) => validateSearch(e)"
                        >查询</n-button
                    >
                </n-form-item-gi>
            </n-grid>
        </n-form>
    </div>
</template>

<script setup>
const props = defineProps({
    formCols: {
        type: Number,
        default: 4,
    },
    gridCollapsed: {
        type: Boolean,
        default: false,
    },
    collapsedRows: {
        type: Number,
        default: 2,
    },
    data: {
        type: Object,
        default: () => {},
    },
    form: {
        type: Array,
        default: () => [],
    },
});
let formData = reactive(props.data);
const formRef = ref(null);
const emit = defineEmits({
    reset: null,
    search: null,
});
function reset(e) {
    emit("reset", e);
}
function validateSearch(e) {
    formRef.value?.validate((errors) => {
        if (!errors) {
            emit("search", e);
        } else {
            console.log(errors);
        }
    });
}
</script>

<style lang="scss" scoped>
.searchForm_wrap {
    background: var(--n-color);
    padding: 10px 16px 0;
    margin-bottom: 10px;
    .n-grid {
        .suffix {
            :deep(.n-form-item-blank) {
                justify-content: flex-end;
                padding: 0 16px;
                .n-button {
                    width: 80px;
                    margin-left: 16px;
                }
            }
        }
        .n-date-picker {
            width: 100%;
        }
    }
}
</style>
