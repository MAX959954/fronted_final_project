<script setup>
import { useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import Main_page from "@/pages/Main_page.vue";
import Main_footer from "@/components/Main_footer.vue";

const route = useRoute();
</script>

<template>
  <div>
    <NavBar v-if="route.name !== 'FindCoHost' && route.name !== 'CoHost'" />

    <Main_page v-if="route.name === 'Apartment' || route.name === 'Home'" />

    <RouterView :key="$route.fullPath" />

    <Main_footer
        v-if="route.name !== 'CoHost'
      && route.name !== 'FindCoHost'"
    />
  </div>
</template>

