<template>
    <!-- <iframe
        :disabled="true"
        class="iframe"
        :src="url"
        scrolling="no"
        frameborder="0"
        width="100%"
        height="99%"
        style="z-index: 1"
    ></iframe> -->
    <div>嵌入页面</div>
</template>

<script>
export default {
    components: {
        dialogHeader: () => import("@/components/dialogHeader"), // 弹窗标题
    },
    props: {
        pointCode: {
            type: String,
            default: "0",
        },
        currentCarInfo: {},
    },
    data() {
        return {
            url: "http://www.baidu.com/",
        };
    },
    created() {},
    watch: {
        currentCarInfo: {
            handler(newValue, oldValue) {
                if (
                    !oldValue ||
                    (oldValue && newValue.ctrlKey != oldValue.ctrlKey)
                ) {
                    // if (newValue.ctrlKey != oldValue.ctrlKey) {
                    // }
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {},
};
</script>

<style scoped>
/* .iframe {
    width: 100%;
    height: 99%;
    overflow-y: hidden;
} */
</style>
