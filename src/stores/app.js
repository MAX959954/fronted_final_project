import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const searchFilters = ref({
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: 0
  })

  const loading = ref(false)
  const notifications = ref([])

  function setSearchFilters(filters) {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  function setLoading(value) {
    loading.value = value
  }

  function addNotification(notification) {
    const id = Date.now()
    notifications.value.push({ ...notification, id })
    if (notification.autoHide !== false) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 3000)
    }
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    searchFilters,
    loading,
    notifications,
    setSearchFilters,
    setLoading,
    addNotification,
    removeNotification
  }
})
