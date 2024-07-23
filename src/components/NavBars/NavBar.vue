<template>
  <!-- Navbar -->
  <nav
    class="bg-color2 top-0 left-0 w-full z-10 md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
  >
    <div
      class="top-0 w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
    >
      <!-- Brand -->
      <div class="flex-col md:flex-row list-none items-center hidden md:flex py-2">
        <!-- 각 페이지로 이동하는 링크 -->
        <div>
          <router-link
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="text-xl get-started text-white font-bold px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1"
            :class="{
              'bg-blue-500 active:bg-emerald-600': this.$route.path.includes(link.path),
              'bg-color1 active:bg-emerald-600': !this.$route.path.includes(link.path)
            }"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<script>
//   import { computed, inject } from 'vue';
//   import { useStore } from 'vuex';
import { ref } from 'vue'
export default {
  setup() {
    const userRole = ref('')
    const links = [
      { path: '/dashboard', name: 'Builder' },
      { path: '/simulation', name: 'Simulation' },
      { path: '/digitaltwin', name : 'DigitalTwin'}
    ]

    const isActive = (path) => {
      const route = this?.$route
      return route ? route.path === path : false
    }

    const newDate = ref()
    setInterval(() => {
      newDate.value = new Date().toLocaleTimeString()
    }, 1000)

    const handleLogout = () => {}

    return {
      links,
      newDate,
      isActive,
      handleLogout,
      userRole
    }
  }
}
</script>

<!-- <template>
    <nav>
        <div>
            <router-link>
                예시1
            </router-link>
        </div>
    </nav>
    
</template>




<script setup>

</script> -->
