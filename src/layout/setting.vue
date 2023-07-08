<template>
    <n-drawer v-model:show="opened" placement="right" :auto-focus="false">
        <n-drawer-content
            title="系统设置"
            closable
            body-content-style="display:flex;flex-direction: column;align-items: center;"
            :native-scrollbar="false"
        >
            <n-divider dashed>主题设置</n-divider>
            <n-button-group>
                <n-button
                    round
                    @click="changeTheme('light')"
                    :class="{ 'circle-tip': appStore.themeMode === 'light' }"
                >
                    <template #icon>
                        <Icon iconName="sun" />
                    </template>
                    光明
                </n-button>
                <n-button
                    color="black"
                    round
                    @click="changeTheme('dark')"
                    :class="{ 'circle-tip': appStore.themeMode === 'dark' }"
                >
                    <template #icon>
                        <Icon iconName="moonFill" />
                    </template>
                    暗黑
                </n-button>
            </n-button-group>
            <n-divider dashed>布局模式</n-divider>
            <n-button-group>
                <n-button
                    round
                    @click="changeMode('vertical')"
                    :class="{ 'circle-tip': appStore.siderMode === 'vertical' }"
                >
                    <template #icon>
                        <Icon iconName="threeArea" />
                    </template>
                    左右
                </n-button>
                <n-button
                    round
                    @click="changeMode('horizontal')"
                    :class="{
                        'circle-tip': appStore.siderMode === 'horizontal',
                    }"
                >
                    <template #icon>
                        <Icon iconName="twoArea" />
                    </template>
                    上下
                </n-button>
            </n-button-group>
            <n-divider dashed>主题颜色</n-divider>
            <n-grid class="colors-wrapper">
                <n-grid-item
                    v-for="(item, index) of primartyColorList"
                    :key="index"
                    :span="4"
                    class="color-wrapper"
                    :class="{ circle: item.checked }"
                    :style="{ backgroundColor: item.value }"
                    @click="colorClick(item)"
                />
            </n-grid>
            <n-divider dashed>菜单设置</n-divider>
            <div class="setting-item-wrapper">
                <span style="width: 150px">菜单宽度</span>
                <n-input-number
                    v-model:value="menuWidth"
                    size="small"
                    :min="200"
                    :max="400"
                    :step="10"
                >
                    <template #suffix>px</template>
                </n-input-number>
            </div>
            <n-divider dashed>页面切换动画</n-divider>
            <div class="setting-item-wrapper">
                <span style="width: 100px">动画效果</span>
                <n-select
                    v-model:value="appStore.pageAnim"
                    :options="animOptions"
                    @update:value="onAnimUpdate"
                />
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script>
import { mainStore } from "@/store";
export default defineComponent({
    name: "Setting",
    setup() {
        const opened = ref(false);
        const appStore = mainStore();
        let menuWidth = ref(appStore.siderWidth);
        const primartyColorList = ref([
            {
                name: "green",
                value: "#88b04b",
                checked: false,
            },
            {
                name: "blue",
                value: "#002fa7",
                checked: true,
            },
            {
                name: "red",
                value: "#e60000",
                checked: false,
            },
            {
                name: "yellow",
                value: "#ffc40c",
                checked: false,
            },
            {
                name: "white",
                value: "white",
                checked: false,
            },
            {
                name: "black",
                value: "black",
                checked: false,
            },
        ]);
        const animOptions = [
            {
                label: "渐隐渐现",
                value: "opacity",
            },
            {
                label: "左右滑动",
                value: "fade",
            },
            {
                label: "上下滑动",
                value: "down",
            },
            {
                label: "缩放效果",
                value: "scale",
            },
        ];
        function openDrawer() {
            opened.value = true;
        }
        function colorClick(item) {
            primartyColorList.value.forEach((it) => {
                it.checked = it === item;
            });
            appStore.changePrimaryColor(item.value);
        }
        function onAnimUpdate(val) {
            appStore.changePageAnim(val);
        }
        function changeTheme(val) {
            appStore.changeThemeMode(val);
        }
        function changeMode(val) {
            appStore.changeSiderMode(val);
        }
        watch(
            () => menuWidth.value,
            (newVal) => {
                appStore.changeSiderWidth(newVal);
            }
        );
        return {
            appStore,
            opened,
            primartyColorList,
            animOptions,
            menuWidth,
            openDrawer,
            onAnimUpdate,
            colorClick,
            changeTheme,
            changeMode,
        };
    },
});
</script>

<style lang="scss" scoped>
.colors-wrapper {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .color-wrapper {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        border: 1px solid #c1c1c1;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }
    .circle::after {
        content: "";
        display: block;
        margin: 0 auto;
        margin-top: 25px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgb(3, 190, 50);
        text-align: center;
    }
}
.setting-item-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-size: 14px;
}
.circle-tip::after {
    content: "";
    display: block;
    margin: 0 auto;
    width: 20px;
    height: 4px;
    border-radius: 20%;
    background-color: rgb(3, 190, 50);
    text-align: center;
    position: absolute;
    bottom: -10px;
}
</style>
