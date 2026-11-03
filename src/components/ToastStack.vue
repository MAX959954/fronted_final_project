<script setup>
import { useAppStore } from '@/stores/app'

const app = useAppStore()
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <p v-for="n in app.notifications" :key="n.id" class="toast" @click="app.removeNotification(n.id)">
        <img v-if="n.image" :src="n.image" alt="" width="44" height="44" />
        <span>{{ n.message }}</span>
      </p>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  left: var(--gutter);
  bottom: var(--gutter);
  z-index: 60;
  display: grid;
  gap: 8px;
  max-width: min(420px, calc(100vw - 2 * var(--gutter)));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 10px 10px;
  background: var(--ink);
  color: var(--bg);
  font-size: var(--step-small);
  font-weight: 500;
  box-shadow: 0 16px 40px rgb(0 0 0 / 0.5); /* taste-skill-ignore: floating toast */
  pointer-events: auto;
  cursor: pointer;
}

.toast img {
  width: 44px;
  height: 44px;
  object-fit: cover;
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 420ms var(--ease-out), opacity 300ms ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}
</style>
