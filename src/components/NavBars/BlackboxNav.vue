<template>
  <div class="navbar">
    <button class="button" @click="changeContents(0)" :disabled="currentPage === 0">
      <img src="/img/builder.png" />
      <div>BUILDER</div>
    </button>
    <button class="button" @click="changeContents(1)" :disabled="currentPage === 1">
      <img src="/img/dashboard.png" />
      <div>DASHBOARD</div>
    </button>
    <button class="button" @click="changeContents(2)" :disabled="currentPage === 2">
      <img src="/img/digitaltwin.png" />
      <div>DIGITAL-TWIN</div>
    </button>
    <button class="button" @click="changeContents(3)" :disabled="currentPage === 3">
      <img src="/img/blackbox.png" />
      <div>BLACK-BOX</div>
    </button>
    <div class="spacer"></div>
    <!-- 빈 공간을 채워줄 div -->
    <button class="button no4" @click="changeContents(4)" :disabled="currentPage === 4">
      <img src="/img/logout.png" />
      <div>LOGOUT</div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const links = [
  { path: '/builder', name: 'Builder' },
  { path: '/dashboard/1', name: 'Dashboard' },
  { path: '/digitaltwin/1', name: 'DigitalTwin' },
  { path: '/blackbox', name: 'BlackBox' },
  { path: '/login', name: 'login' }
]

const currentPage = ref(null)

const changeContents = (contents) => {
  currentPage.value = contents
  router.push(links[contents].path)
  if (contents === 4) {
    userStore.logout()
  }
}

const updateCurrentPage = () => {
  const path = route.path
  if (path.includes('dashboard')) {
    currentPage.value = 1
  } else if (path.includes('digitaltwin')) {
    currentPage.value = 2
  } else if (path.includes('builder')) {
    currentPage.value = 0
  } else if (path.includes('blackbox')) {
    currentPage.value = 3
  } else if (path.includes('simulation')) {
    currentPage.value = 4
  } else {
    currentPage.value = null
  }
}

onMounted(updateCurrentPage)

watch(() => route.path, updateCurrentPage)
</script>

<style scoped>
.button {
  width: 90px;
  height: 90px;
  border: none;
  background: #1b263b;
  /* background : #0d1b2a; */


  color: white;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 -3px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition:
    box-shadow 0.3s,
    transform 0.3s;
  position: relative;
  overflow: hidden;
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #415a77;
  /* background : #0d1b2a; */
  opacity: 0;
  transition: opacity 0.3s;
}

.button:hover {
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.1),
    inset 0 -3px 0 rgba(0, 0, 0, 0.4);
}

.button:hover::before {
  opacity: 0.6;
}

.button:disabled {
  cursor: not-allowed;
  background: #415a77;
  box-shadow: none;
}

img {
  filter: invert();
  width: 30px;
  height: 30px;
  margin: 10px;
}

.navbar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  background: #1b263b;
  /* background : #0d1b2a; */
}

.spacer {
  flex-grow: 1; /* 빈 공간을 채우기 위해 사용 */
}
.no4 {
  bottom: 4%;
}
</style>
