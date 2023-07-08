<template>
    <n-layout
        content-style="height: 100vh;width: 100vw;display: flex;flex-direction: column;"
        v-if="isProd"
    >
        <n-layout-header bordered>
            <div class="head_wrap">
                <div class="logo_wrap" :style="`width: ${logoWidth}`">
                    <n-image width="50" src="/logo.png" preview-disabled />
                    <div>LOGO</div>
                </div>
                <n-menu
                    v-if="appStore.siderMode === 'horizontal'"
                    :options="menuArr"
                    :value="activePath"
                    :mode="appStore.siderMode"
                />
                <n-dropdown
                    trigger="hover"
                    size="large"
                    :options="avatarOptions"
                    @select="handleSelect"
                >
                    <n-avatar style="cursor: pointer" round src="/logo.png" />
                </n-dropdown>
            </div>
        </n-layout-header>
        <n-layout has-sider class="flex-1">
            <n-layout-sider
                :width="appStore.siderWidth"
                :collapsed-width="64"
                :collapsed="collapsed"
                collapse-mode="width"
                bordered
                show-trigger
                :native-scrollbar="false"
                @collapse="collapsed = true"
                @expand="collapsed = false"
                v-if="appStore.siderMode === 'vertical'"
            >
                <n-menu
                    :collapsed="collapsed"
                    :collapsed-width="64"
                    :collapsed-icon-size="20"
                    :options="menuArr"
                    :value="activePath"
                    :mode="appStore.siderMode"
                />
            </n-layout-sider>
            <n-layout content-style="display: flex;flex-direction: column;">
                <Tags />
                <n-layout class="flex-1">
                    <router-view v-slot="{ Component, route }">
                        <transition
                            :name="appStore.pageAnim + '-transform'"
                            mode="out-in"
                            appear
                        >
                            <KeepAlive :include="keepAliveRouteNames">
                                <component
                                    :is="Component"
                                    :key="route.fullPath"
                                />
                            </KeepAlive>
                        </transition>
                    </router-view>
                </n-layout>
                <n-layout-footer bordered>
                    <div class="footer_wrap">Footer</div>
                </n-layout-footer>
            </n-layout>
        </n-layout>
    </n-layout>
    <n-layout style="height: 100vh; width: 100vw" v-else>
        <router-view v-slot="{ Component, route }">
            <transition
                :name="appStore.pageAnim + '-transform'"
                mode="out-in"
                appear
            >
                <KeepAlive :include="keepAliveRouteNames">
                    <component :is="Component" :key="route.fullPath" />
                </KeepAlive>
            </transition>
        </router-view>
    </n-layout>
    <Setting ref="settingRef" />
</template>

<script setup>
import { routes } from "@/router/index.js";
import { mainStore } from "@/store";
import { RouterLink } from "vue-router";
import { NEllipsis } from "naive-ui";
import Icon from "@/components/icon.vue";
import Setting from "./setting.vue";
import Tags from "./tags/index.vue";
const appStore = mainStore();
const isProd = import.meta.env.DEV;
const router = useRouter();
const curRoute = useRoute();
const allRoutes = router.getRoutes();
const collapsed = ref(false);
const activePath = computed(() => curRoute.meta?.activeMenu || curRoute.name);
const keepAliveRouteNames = computed(() => {
    return allRoutes
        .filter((route) => route.meta?.keepAlive)
        .map((route) => route.name);
});
const menuArr = transfromMenu(routes);
const avatarOptions = ref([
    {
        label: "系统设置",
        key: "set",
        icon: () => h(Icon, { iconName: "setting" }),
    },
    {
        label: "退出登录",
        key: "out",
        icon: () => h(Icon, { iconName: "signout" }),
    },
]);
const logoWidth = computed(() => {
    return appStore.siderWidth + "px";
});
watch(collapsed, () => {
    if (collapsed.value) {
        logoWidth.value = "auto";
    } else {
        logoWidth.value = appStore.siderWidth + "px";
    }
});
const settingRef = ref();
function handleSelect(key) {
    switch (key) {
        case "set":
            settingRef.value.openDrawer();
            break;
        case "out":
            //   logout();
            location.reload();
            break;
    }
}
// 路由转换成菜单
function transfromMenu(originRoutes) {
    function getLabel(item) {
        if (/^(https?:|mailto:|tel:)/.test(item.path)) {
            return () =>
                h(
                    "a",
                    {
                        href: item.path,
                        target: "_blank",
                        rel: "noopenner noreferrer",
                    },
                    {
                        default: () =>
                            h(NEllipsis, null, {
                                default: () => item.meta.title,
                            }),
                    }
                );
        } else if (item.path) {
            return () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: item.name,
                        },
                    },
                    {
                        default: () =>
                            h(NEllipsis, null, {
                                default: () => item.meta.title,
                            }),
                    }
                );
        } else {
            return item.meta?.title || "";
        }
    }
    if (!originRoutes) {
        return [];
    }
    const tempMenus = [];
    originRoutes
        .filter((it) => {
            if (!it.meta) {
                return false;
            }
            return !it.meta.hidden;
        })
        .forEach((it) => {
            const tempMenu = {
                key: it.name,
                label: getLabel(it),
                icon: () =>
                    h(Icon, {
                        iconName: it.meta
                            ? it.meta.icon
                                ? it.meta.icon
                                : "menu"
                            : "menu",
                    }),
            };
            if (it.children && it.children.length) {
                tempMenu.children = transfromMenu(it.children);
            }
            tempMenus.push(tempMenu);
        });
    return tempMenus;
}
</script>
<style lang="scss">
.head_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    .logo_wrap {
        padding-left: 22px;
        display: flex;
        align-items: center;
        background: green;
    }
}
.flex-1 {
    flex-grow: 1;
}
.footer_wrap {
    font-weight: bold;
    text-align: center;
    padding: 10px;
}
</style>
