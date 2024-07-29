import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userId = ref(null)
  const isLoggedIn = ref(false)

  const setUserId = (id) => {
    userId.value = id
  }

  const setLoggedIn = (status) => {
    isLoggedIn.value = status
  }

  const login = (id) => {
    setUserId(id)
    setLoggedIn(true)
  }

  const logout = () => {
    setUserId(null)
    setLoggedIn(false)
  }

  return {
    userId,
    isLoggedIn,
    setUserId,
    setLoggedIn,
    login,
    logout
  }
})
