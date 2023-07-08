import Layout from "@/layout/index.vue";
const mesRoutes = [
    {
        name: "Test1",
        path: "/",
        redirect: { name: "Test1" },
        meta: {
            title: "首页",
        },
    },
    {
        path: "",
        component: Layout,
        children: [
            {
                path: "",
                name: "Test1",
                component: () => import("@/views/test/test1/index.vue"),
                meta: {
                    title: "首页",
                    keepAlive: true,
                },
            },
        ],
    },
    {
        name: "keysManage",
        path: "",
        component: Layout,
        meta: {
            title: "关键件管理",
        },
        children: [
            {
                name: "jobScheduleManagement",
                path: "jobScheduleManagement",
                component: () =>
                    import(
                        "@/views/mes/productionPlanManage/jobScheduleManagement/index.vue"
                    ),
                meta: {
                    title: "车型维护",
                },
            },
        ],
    },
];
export default mesRoutes;
