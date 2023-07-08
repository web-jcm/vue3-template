# 项目依赖
JS环境：Node > 14.0(推荐16.0以上)
前端框架：VUE > 3.0
UI组件库：Naive UI > 2.0
路由组件：VUE Router > 4.0
状态管理：Pinia > 2.0
网络请求：Axios > 1.0
# 安装依赖
npm install 或 pnpm i(推荐)

# 启动服务
npm run dev 或 pnpm dev(推荐)

# 项目发布
npm run build 或 pnpm build(推荐)

# 项目事项
1、浏览器标签icon和标签标题在index.ntml文件中修改；
2、兼容vue2 options api与vue3 Composition api写法（以及ts和js），其他细节请使用vue3写法，详见https://v3-migration.vuejs.org/；
3、自动按需全局引入naive ui组件及其api；
4、已注册svg全局Icon组件，可直接使用，也可嵌套nicon组件使用，开发时只需新增aseets里的iconfont.js文件（从阿里iconfont官网下载symbol引用文件）；
5、如果使用element-UI可(在main.js里)放开注册在全局的MyTable组件，包含表格和分页，所有属性与方法已抛出父级；
6、本地开发联调在vite.config.js可配置地址，线上发布可在api/index.js配置baseurl，为空则默认与发布服务器相同地址；
7、使用了auto-import插件，各个第三方库的api可以自动导入，在vite.config.js可配置；
8、路由新增模块参考router/test.js，然后在router/index.js传入routes的数组拼接参数即可；
9、状态管理使用pina但未集成持久化，文档详见https://pinia.vuejs.org/introduction.html；
10、layout布局默认本地开发才展示，build发布自动隐藏适应联友微前端mp框架，可在layout/idnex.vue自行修改；
11、编译构建后地址将添加/vue-dist/mesControl/前缀适应联友微前端mp框架，可在vite.config.js中修改base地址；
12、建议在vscode中安装并启用eslint插件，安装并启用prettier插件，安装并启用volar插件；
