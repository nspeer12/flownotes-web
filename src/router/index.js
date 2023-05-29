import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../components/Notebook.vue") },
        { path: "/login", component: () => import("../components/Login.vue") },
        { path: "/signup", component: () => import("../components/SignUp.vue") }
    ]
});

export default router;