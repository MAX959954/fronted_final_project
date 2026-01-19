import { createRouter, createWebHistory } from "vue-router";
import ExperiencePage from "@/pages/ExperiencePage.vue";
import Main_page from "@/pages/Main_page.vue";
import ApartmentPage from "@/pages/ApartmentPage.vue";
import ServicePage from "@/pages/ServicePage.vue";
import CoHost from "@/pages/Co-Host.vue";
import FindCoHost from "@/pages/FindCoHost.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Main_page,
    },
    {
        path: "/experience",
        name: "Experience",
        component: ExperiencePage,
    },
    {
        path: "/apartment",
        name: "Apartment",
        component: ApartmentPage,
    },
    {
        path: "/services",
        name: "Services",
        component: ServicePage,
    },
    {
        path: "/co-host",
        name: "CoHost",
        component: CoHost,
        meta: { hideFooter: true }
    },
    {
        path: "/find-co-host" ,
        name : 'FindCoHost',
        component: FindCoHost ,
        meta: { hideNav: true}
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
