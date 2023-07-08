import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import "@/styles/reset.css"; // 页面重置初始样式
import "@/styles/transition.css"; // 页面动画样式
import "@/assets/iconfont.js"; // svg格式图标

createApp(App)
    .use(createPinia())
    .use(router)
    .component(
        "Icon", // svg图标组件
        defineAsyncComponent(() => import("@/components/icon.vue"))
    )
    .mount("#app");
