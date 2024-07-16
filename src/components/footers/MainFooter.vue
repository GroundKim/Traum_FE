<template>
  <footer
    class="text-black block flex justify-center"
    style="bottom: 0px; width: 100%; display: flex; justify-content: center"
  >
    <div class="container px-4">
      <!-- 푸터 상단의 가로줄 -->
      <hr class="mb-4 border-b-1 border-blueGray-200" />
      <div class="flex flex-wrap justify-center">
        <!-- 저작권 정보 섹션 -->
        <div class="w-full md:w-4/12 px-4">
          <div
            class="text-sm font-semibold py-1 md:text-left text-center mx-auto"
            style="display: flex; align-items: center"
          >
            <p style="margin-right: 10px">Copyright © {{ date }}</p>
            <a
              href="https://camp.flexing.ai/"
              class="hover:text-blueGray-700 text-sm font-semibold py-1 flex items-center"
              style="display: flex; align-items: center; text-decoration: none"
            >
              <p style="margin-right: 10px">DJ-Twin</p>
              <img
                alt="..."
                class="rounded-full align-middle border-none shadow-lg"
                :src="logoSrc"
                style="height: 48px; width: 48px"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue' // Vue 3의 ref를 가져옵니다.
import logo from '@/assets/logo.svg'

export default {
  setup() {
    const date = ref(new Date().getFullYear())
    const logoSrc = logo
    return {
      date,
      logoSrc
    }
  }
}
</script>
