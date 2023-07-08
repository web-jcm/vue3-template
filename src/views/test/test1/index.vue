<template>
    <div
        style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        "
    >
        <div>test1</div>
        <Icon iconName="home"></Icon>
        <n-input v-model:value="content" />
    </div>
</template>
<script>
export default defineComponent({
    name: "Test1",
    setup() {
        const content = ref("");
        return {
            content,
        };
    },
    onActivated: () => {
        console.log("onActivated");
    },
    onDeactivated: () => {
        console.log("onDeactivated");
    },
});
</script>

<style lang="scss" scoped></style>
