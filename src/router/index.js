import { createRouter, createWebHistory } from "vue-router";
import ExperiencePage from "@/pages/ExperiencePage.vue";
import Main_page from "@/pages/Main_page.vue";
import ApartmentPage from "@/pages/ApartmentPage.vue";
import ServicePage from "@/pages/ServicePage.vue";
import CoHost from "@/pages/Co-Host.vue";
import FindCoHost from "@/pages/FindCoHost.vue";
import BookingsPage from "@/pages/BookingsPage.vue";
import BlogPage from "@/pages/BlogPage.vue";
import CartPage from "@/pages/CartPage.vue";

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
    },
    {
        path: "/bookings",
        name: "Bookings",
        component: BookingsPage,
    },
    {
        path: "/blog",
        name: "Blog",
        component: BlogPage,
    },
    {
        path: "/cart",
        name: "Cart",
        component: CartPage,
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
