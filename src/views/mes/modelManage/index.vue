<template>
    <div class="contain_wrap">
        <SearchForm />
    </div>
</template>
<script>
import SearchForm from "@/components/searchForm.vue";
export default defineComponent({
    name: "ModelManage",
    components: {
        SearchForm,
    },
    setup() {
        return {};
    },
});
</script>
<style lang="scss" scoped></style>
