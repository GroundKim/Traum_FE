<template>
  <div>
    <!-- ////////////////////// -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="bg-gray-600 rounded-lg shadow-xl w-96">
        <div class="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 class="text-2xl font-semibold text-white">MyPage</h3>
          <button @click="toggleModal()" class="text-white">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white">Email</label>
              <input
                :value="userEmail"
                disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-700 border rounded-md"
                style="background:grey;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Name</label>
              <input
                :value="userName"
                disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-700 border rounded-md"
                style="background:grey;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Current Password</label>
              <input
                v-model="currentPassword"
                type="password"
                class="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white">New Password</label>
              <input
                v-model="newPassword"
                type="password"
                class="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Phone Number</label>
              <input
                v-model="phoneNumber"
                type="tel"
                disabled
                class="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border rounded-md"
                style="background:grey;"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end p-6 border-t border-gray-200">
          <p>{{ resultMessage }}</p>
          <button
            @click="saveChanges"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            @click="toggleModal"
            class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import emitter from '../eventBus'

export default {
  props: {
    showModal: {
      type: Boolean
    }
  },
  setup(props) {
    const userStore = useUserStore()
    const currentPassword = ref('')
    const newPassword = ref('')
    const router = useRouter()
    const userEmail = computed(() => userStore.userStatus.userEmail)
    const userName = computed(() => userStore.userStatus.userName)
    const phoneNumber = computed(() => userStore.userStatus.userPhoneNumber)
    const resultMessage = ref('')

    const toggleModal = () => {
      emitter.emit('toggleMayPage', false)
    }

    const saveChanges = async () => {
      try {
        const condition1 = await userStore.verifyCurrentPassword(currentPassword.value)
        const condition2 = newPassword.value !== currentPassword.value
        const condition3 = newPassword.value < 6 || newPassword.value > 20

        if (condition1 && condition2 && condition3) {
          await userStore.changePassword(newPassword.value)
          // 성공 메시지 표시
          console.log('Password changed successfully')
        } else if (!condition1) {
          resultMessage.value == '현재 비밀번호를 다시 입력해주세요'
        } else if (!condition2) {
          resultMessage.value == '현재 비밀번화 변경할 비밀번호가 같습니다.'
        } else if (!condition3) {
          resultMessage.value == '비밀번호를 6자 이상 20자리 사이로 입력해주세요.'
        } else {
          resultMessage.value == '비밀번호를 변경하지 못했습니다. 다시 확인해주세요.'
        }
      } catch (error) {
        console.error('Error in saveChanges:', error)
        // 사용자에게 오류 메시지 표시
      }
      toggleModal()
      router.push('/login')

      userStore.userLogout()
    }
    return {
      props,
      toggleModal,
      saveChanges,
      currentPassword,
      newPassword,
      phoneNumber,
      userEmail,
      userName,
      resultMessage
    }
  }
}
</script>
