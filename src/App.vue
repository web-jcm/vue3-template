<template>
    <n-config-provider
        :theme="theme"
        :theme-overrides="themeOverrides"
        :locale="zhCN"
        :date-locale="dateZhCN"
    >
        <n-global-style />
        <n-loading-bar-provider
            :loading-bar-style="{
                loading: 'background:green',
                error: 'background:red',
            }"
        >
            <n-notification-provider>
                <n-dialog-provider>
                    <n-message-provider>
                        <ViewComponent />
                    </n-message-provider>
                </n-dialog-provider>
            </n-notification-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>
<script setup>
import { mainStore } from "@/store";
import { zhCN, dateZhCN, darkTheme, useOsTheme } from "naive-ui";
import { RouterView } from "vue-router";
const ViewComponent = defineComponent({
    render: () => h(RouterView),
    setup: () => {
        window.$message = useMessage();
        window.$dialog = useDialog();
        window.$notification = useNotification();
        window.$loadingBar = useLoadingBar();
    },
});
const osThemeRef = useOsTheme();
const appStore = mainStore();
watch(osThemeRef, () => {
    if (osThemeRef.value === "dark") {
        appStore.changeThemeMode("dark");
    } else {
        appStore.changeThemeMode("light");
    }
});
const themeOverrides = computed(() => {
    return {
        common: {
            primaryColor: appStore.themeColor,
            primaryColorHover: appStore.themeColor,
        },
    };
});
const theme = computed(() =>
    appStore.themeMode === "dark" ? darkTheme : null
);
</script>
<style lang="scss">
@import "@/style.scss";
</style>
