import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../App.vue") },
        { path: "/signup", component: () => import("../components/SignUp.vue") }
    ]
});

export default router;