import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const notifications = ref([])
  let nextId = 1

  function addNotification(notification) {
    const id = nextId++
    notifications.value.push({ ...notification, id })
    setTimeout(() => removeNotification(id), notification.duration || 2800)
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, addNotification, removeNotification }
})
