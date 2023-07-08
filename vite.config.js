import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/vue-dist/mesControl/",
    assetsDir: "static",
    plugins: [
        vue(),
        AutoImport({
            imports: [
                "vue",
                "pinia",
                "vue-router",
                {
                    "naive-ui": [
                        "useDialog",
                        "useMessage",
                        "useNotification",
                        "useLoadingBar",
                    ], // naive-ui的一些api
                },
            ],
            dts: true, //auto generation auto-imports.d.ts file
        }),
        Components({
            resolvers: [NaiveUiResolver()],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 9527, // 设置服务启动端口号
        open: true, // 设置服务启动时是否自动打开浏览器
        cors: true, // 允许跨域
        proxy: {
            "/ly": {
                target: `http://172.26.165.222:28507/`,
                changeOrigin: true,
                pathRewrite: {
                    "^/ly": "/ly",
                },
                rewrite: (path) => path.replace(/^\/ly/, "/ly"),
            },
        },
    },
    build: {
        rollupOptions: {
            // https://rollupjs.org/guide/en/#outputmanualchunks
            output: {},
        },
    },
});
