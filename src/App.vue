<script setup>
import NavBar from "@/components/NavBar.vue";
import Main_page from "@/pages/Main_page.vue";
import Main_footer from "@/components/Main_footer.vue";
</script>

<template>
  <div>
    <NavBar />
    <RouterView />
  </div>
  <Main_page />
  <Main_footer />
</template>

<style>

</style>

