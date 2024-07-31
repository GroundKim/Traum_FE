<template>
  <div>
    <button
      class="text-xl active:bg-emerald-600 font-bold uppercase px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      v-on:click="toggleModal()"
    >
      <i class="fas fa-cog mr-2"></i>
    </button>
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
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white">Name</label>
              <input
                :value="userName"
                disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-700 border rounded-md"
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
                class="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border rounded-md"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end p-6 border-t border-gray-200">
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

export default {
  setup() {
    const userStore = useUserStore()
    const showModal = ref(false)
    const currentPassword = ref('')
    const newPassword = ref('')
    const phoneNumber = ref('')

    const userEmail = computed(() => userStore.userStatus.userEmail)
    const userName = computed(() => userStore.userStatus.userName)

    const toggleModal = () => {
      showModal.value = !showModal.value
      if (showModal.value) {
        phoneNumber.value = userStore.userStatus.userPhoneNumber
      }
    }

    const saveChanges = async () => {
      // Implement the logic to save changes
      // This should include password change and phone number update
      // You'll need to add these functions to your userStore
      toggleModal()
    }

    return {
      showModal,
      toggleModal,
      saveChanges,
      currentPassword,
      newPassword,
      phoneNumber,
      userEmail,
      userName
    }
  }
}
</script>
