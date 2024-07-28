<template>
  <div class="flex flex-col lg:flex-row h-screen">
    <!-- 캐러셀 섹션 -->
    <div class="w-full lg:w-1/2 bg-blueGray-200">
      <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000">
        <Slide v-for="slide in slides" :key="slide.id">
          <div class="carousel__item relative">
            <img :src="slide.image" :alt="slide.alt" class="w-full h-full object-cover" />
            <div
              class="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-60 p-4"
            >
              <h2 class="text-3xl font-bold mb-2">{{ slide.title }}</h2>
              <p class="text-xl">{{ slide.description }}</p>
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <!-- 로그인 폼 섹션 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-blueGray-800">DT 플랫폼</h1>
          <p class="text-blueGray-600">계정에 로그인하세요</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-blueGray-700">이메일</label>
            <input
              id="email"
              type="email"
              v-model="email"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-blueGray-700"
              >비밀번호</label
            >
            <input
              id="password"
              type="password"
              v-model="password"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-blueGray-300 rounded"
              />
              <label for="remember_me" class="ml-2 block text-sm text-blueGray-700">
                로그인 정보 기억하기
              </label>
            </div>
            <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">
              비밀번호를 잊으셨나요?
            </a>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          </div>
        </form>

        <div class="mt-6">
          <button
            @click="$router.push('/register')"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import turtleImage from '@/assets/turtle.png' // 이미지 import
import builderImage from '@/assets/builder.png' // 이미지 import

export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)

    const slides = ref([
      {
        id: 1,
        image: builderImage,
        alt: 'Builder',
        title: 'Builder',
        description: '당신의 아이디어로 바로 당신만의 공간을 설계하고 확인하실 수 있습니다'
      },
      {
        id: 1,
        image: turtleImage,
        alt: 'DigitalTwin',
        title: 'DigitalTwin',
        description: 'DigitalTwin으로 재구성된 당신의 시설을 확인해보세요'
      },
      {
        id: 1,
        image: turtleImage,
        alt: 'Dashboard',
        title: 'Dashboard',
        description: '실시간으로 업데이트되는 데이터를 대시보드에서 확인해보세요'
      },
      {
        id: 1,
        image: turtleImage,
        alt: 'BlackBox',
        title: 'BlackBox',
        description: '이상이 감지된 데이터를 언제라도 다시 확인해보세요'
      }
      // 더 많은 슬라이드를 여기에 추가할 수 있습니다.
    ])
    const handleSubmit = async () => {
      try {
        // 여기에 실제 로그인 로직을 구현하세요
        router.push({ name: 'Dashboard' })
      } catch (error) {
        console.error(error.message)
        // 로그인 실패 처리
      }
    }

    // 이메일 기억하기 기능
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      email.value = rememberedEmail
    }

    return { email, password, handleSubmit, rememberMe, slides }
  }
}
</script>

<style>
.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}
</style>
