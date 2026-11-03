<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import ToastStack from '@/components/ToastStack.vue'
</script>

<template>
  <SiteHeader />

  <main id="main">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <SiteFooter />
  <ToastStack />
</template>
