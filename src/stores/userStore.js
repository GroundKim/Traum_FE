import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase/index.js'
import { signOut } from 'firebase/auth'
import { updatePassword } from 'firebase/auth'
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  const userStatus = ref({
    isLoggedIn: false,
    userId: '',
    userEmail: '',
    userName: '',
    userPhoneNumber: '',
    accessToken: ''
  })

  async function userLogin({ userId, userEmail, userName, userPhoneNumber }) {
    userStatus.value.isLoggedIn = true
    userStatus.value.userId = userId
    userStatus.value.userEmail = userEmail
    userStatus.value.userName = userName
    userStatus.value.userPhoneNumber = userPhoneNumber

    // Get the current user's token
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      userStatus.value.accessToken = token
      localStorage.setItem('refreshToken', user.refreshToken)
    }
  }

  async function refreshAccessToken() {
    const user = auth.currentUser
    if (user) {
      try {
        await user.getIdToken(true) // Force refresh the token
        const newToken = await user.getIdToken()
        userStatus.value.accessToken = newToken
        localStorage.setItem('refreshToken', user.refreshToken)
        return newToken
      } catch (error) {
        console.error('Error refreshing token:', error)
        return null
      }
    }
    return null
  }

  async function userLogout() {
    try {
      await signOut(auth)
      userStatus.value.isLoggedIn = false
      userStatus.value.userId = ''
      userStatus.value.userEmail = ''
      userStatus.value.userName = ''
      userStatus.value.userPhoneNumber = ''
      userStatus.value.accessToken = ''
      localStorage.removeItem('refreshToken')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  async function verifyCurrentPassword(currentPassword) {
    const user = auth.currentUser
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      try {
        await reauthenticateWithCredential(user, credential)
        return true
      } catch (error) {
        console.error('Error verifying password:', error)
        return false
      }
    }
    return false
  }

  async function changePassword(newPassword) {
    const user = auth.currentUser
    if (user) {
      try {
        // 비밀번호 유효성 검사
        if (typeof newPassword !== 'string' || newPassword.length < 6) {
          throw new Error(
            'Invalid password format. Password must be a string with at least 6 characters.'
          )
        }

        await updatePassword(user, newPassword)
        console.log('Password changed successfully')
        return true
      } catch (error) {
        console.error('Error changing password:', error)
        throw error // 에러를 상위로 전파하여 UI에서 처리할 수 있게 함
      }
    }
    return false
  }
  return {
    userStatus,
    userLogin,
    userLogout,
    refreshAccessToken,
    changePassword,
    verifyCurrentPassword
  }
})
