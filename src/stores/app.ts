import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '@/types'

export const useAppStore = defineStore('app', () => {
  const notifications = ref<Notification[]>([])
  let nextId = 1

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = nextId++
    notifications.value.push({ ...notification, id })
    setTimeout(() => removeNotification(id), notification.duration ?? 2800)
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, addNotification, removeNotification }
})
