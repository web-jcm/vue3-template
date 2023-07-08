import axios from "axios";
import { mainStore } from "@/store";
import Cookies from "js-cookie";
const service = axios.create({
    baseURL: "",
    timeout: 10 * 1000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});
// 请求拦截器
service.interceptors.request.use(
    (config) => {
        try {
            if (config.method && config.method === "post") {
                if (!config.params) {
                    config.params = {};
                }
            }
            //使用token的时候需要引入cookie方法或者用本地localStorage等方法
            if (
                Cookies.get("token") &&
                (Cookies.get("token") !== "null" ||
                    Cookies.get("token") !== "undefined")
            ) {
                config.params["token"] = Cookies.get("token");
                config.headers["Authorization"] = Cookies.get("token");
            } else {
                config.params["token"] = "7233c8892aa246408942054b398f62e2";
                config.headers["Authorization"] =
                    "7233c8892aa246408942054b398f62e2";
            }
            config.params["tenancyId"] = mainStore().tenancyId;
            config.headers["tenancyId"] = mainStore().tenancyId;
        } catch (err) {
            console.log(err);
        }
        $loadingBar.start();
        return config;
    },
    (error) => {
        $loadingBar.error();
        console.log("error", error);
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        //接收到响应数据并成功后的一些共有的处理，关闭loading等
        $loadingBar.finish();
        // 	const userStore = useUserStore()
        // 	userStore.resetState().then(() => {
        // 		router.push({ path: '/login' })
        // 	})
        return Promise.resolve(response.data);
    },
    (error) => {
        $loadingBar.error();
        if (error && error.response) {
            // 1.公共错误处理
            // 2.根据响应码具体处理
            switch (error.response.status) {
                case 400:
                    error.message = "错误请求";
                    break;
                case 401:
                    error.message = "未授权，请重新登录";
                    break;
                case 403:
                    error.message = "拒绝访问";
                    break;
                case 404:
                    error.message = "请求错误,未找到该资源";
                    break;
                case 405:
                    error.message = "请求方法未允许";
                    break;
                case 408:
                    error.message = "请求超时";
                    break;
                case 500:
                    error.message = "服务器端出错";
                    break;
                case 501:
                    error.message = "网络未实现";
                    break;
                case 502:
                    error.message = "网络错误";
                    break;
                case 503:
                    error.message = "服务不可用";
                    break;
                case 504:
                    error.message = "网络超时";
                    break;
                case 505:
                    error.message = "http版本不支持该请求";
                    break;
                default:
                    error.message = `连接错误${error.response.status}`;
            }
        } else {
            error.message = "连接服务器失败，请刷新当前页";
        }
        $message.error(error.message);
        return Promise.reject(error);
    }
);
// 4.封装基本请求
const get = function (data) {
    const config = {
        method: "get",
        url: data.url,
        headers: data.headers,
    };
    if (data.params) {
        config.params = data.params;
    } else {
        config.params = {};
    }
    return service(config);
};
const post = function (data) {
    const config = {
        method: "post",
        url: data.url,
        headers: data.headers,
    };
    if (data.params) {
        config.data = data.params;
    } else {
        config.data = {};
    }
    return service(config);
};
const put = function (data) {
    const config = {
        method: "put",
        url: data.url,
        headers: data.headers,
    };
    if (data.params) {
        config.params = data.params;
    } else {
        config.params = {};
    }
    return service(config);
};
const deleted = function (data) {
    const config = {
        method: "delete",
        url: data.url,
        headers: data.headers,
    };
    if (data.params) {
        config.params = data.params;
    } else {
        config.params = {};
    }
    return service(config);
};
export { get, post, put, deleted };
