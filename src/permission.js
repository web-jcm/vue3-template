import router from "./router";
import Cookies from "js-cookie";
import config from "@/utils/config";

router.beforeEach(async (to, from, next) => {
    //console.log('permission环境变量为：', process.env.NODE_ENV,);
    //当前vue项目内嵌于MP框架
    if (config.insideMP == true) {
        let configParamsData = JSON.parse(
            sessionStorage.getItem("configParamsData")
        );
        if (configParamsData != null && configParamsData != undefined) {
            sessionStorage.removeItem("configParamsData");
            router.push({
                path: to.path,
                query: configParamsData,
            });
            return false;
        }
    }
    let t = "7233c8892aa246408942054b398f62e2";

    if (Cookies.get("token") != "null" || Cookies.get("token") != "undefined") {
        if (t !== Cookies.get("token")) {
            if (process.env.NODE_ENV !== "development") {
                t = Cookies.get("token");
            }
        }
    }
    if (to.query && to.query.token) {
        t = to.query.token;
    }
    if (window.location.search) {
        t = window.location.search.slice(7, window.location.search.length);
    }
    if (window.parent.$context) {
        t = window.parent.$context.$api.auth.getToken();
    }
    Cookies.set("token", t);
    next();
});

router.afterEach(() => { });
