import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const preferences = ref({
    language: 'en',
    currency: 'EUR',
    theme: 'light'
  })

  function login(userData) {
    user.value = userData
    isAuthenticated.value = true
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  function updatePreferences(newPreferences) {
    preferences.value = { ...preferences.value, ...newPreferences }
  }

  return {
    user,
    isAuthenticated,
    preferences,
    login,
    logout,
    updatePreferences
  }
})
