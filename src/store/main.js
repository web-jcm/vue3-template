import { defineStore } from "pinia";
// defineStore 方法有两个参数，第一个参数是模块化名字，不能重复
// 第二个参数是选项，对象里面有三个属性，相比于vuex 少了一个 mutations.
export const mainStore = defineStore("main", {
    state() {
        // 存放的就是模块的变量
        return {
            tenancyId:
                window.parent.tenancyId || "39a67be9e7d845f0a9978daae247897c",
            themeMode: "light",
            siderMode: "vertical",
            siderWidth: 240,
            pageAnim: "opacity",
            themeColor: "#e60000",
            reloadFlag: true,
            /** keepAlive路由的key，重新赋值可重置keepAlive */
            aliveKeys: {},
        };
    },
    getters: {
        // 相当于vue里面的计算属性，可以缓存数据
    },
    actions: {
        changeThemeMode(themeMode) {
            this.themeMode = themeMode;
        },
        changeSiderMode(siderMode) {
            this.siderMode = siderMode;
        },
        changeSiderWidth(siderWidth) {
            this.siderWidth = siderWidth;
        },
        changePageAnim(pageAnim) {
            this.pageAnim = pageAnim;
        },
        changePrimaryColor(color) {
            this.themeColor = color;
        },
        async reloadPage() {
            // $loadingBar.start();
            this.reloadFlag = false;
            await nextTick();
            this.reloadFlag = true;

            setTimeout(() => {
                document.documentElement.scrollTo({ left: 0, top: 0 });
                // $loadingBar.finish();
            }, 100);
        },
        setAliveKeys(key, val) {
            this.aliveKeys[key] = val;
        },
    },
});
