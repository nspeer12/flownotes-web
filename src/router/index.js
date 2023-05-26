import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../App.vue") },
        { path: "/login", component: () => import("../components/Login.vue") }
    ]
});

export default router;