import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "Notebook", component: () => import("../components/Notebook.vue") },
        { path: "/login", name: "Login", component: () => import("../components/Login.vue") },
        { path: "/signup", name: "Signup", component: () => import("../components/Signup.vue") }
    ]
});

export default router;
