import { createRouter , createWebHistory } from "vue-router";

import Main_page from "@/pages/Main_page.vue";
import NavBar from "@/components/NavBar.vue";
import ExperiencePage from "@/pages/ExperiencePage.vue";
import ApartmentPage from "@/pages/ApartmentPage.vue";
import ServicePage from "@/pages/ServicePage.vue";

const routes = [
    {path : '/components' , name : 'Home' , component: Main_page} ,
    {path : '/components' , name : 'Home_navbar' ,  component: NavBar} ,
    {path : '/pages/experience' , name : 'Experience' , component: ExperiencePage} ,
    {path : '/pages/apartment' , name : 'ApartmentApartment' ,  component: ApartmentPage} ,
    {
        path: '/services',
        name: 'Services',
        component: (ServicePage)
    }
];

const router = createRouter ({
    history: createWebHistory() ,
    routes,
});

export default router;