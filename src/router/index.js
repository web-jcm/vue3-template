import * as VueRouter from "vue-router";
import mesRoutes from "./mes.js";
export const routes = [].concat([...mesRoutes]); // 其他模块作为concat参数传入即可
export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});
