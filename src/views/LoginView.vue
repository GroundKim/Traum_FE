<template>
  <div class="flex flex-col lg:flex-row h-screen bg-white">
    <!-- 캐러셀 섹션 -->
    <div class="w-full h-screen lg:w-1/2 bg-white flex items-center justify-center">
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
    <div class="w-full lg:w-1/2 flex bg-[#33334c] text-white items-center justify-center p-8">
      <div class="w-full max-w-md">
        <div class="flex flex-col text-center mb-8 items-center">
          <img :src="teamLogoImage" alt="teamLogoImage" class="mb-4 w-auto h-auto" />
          <h1 class="text-2xl font-bold">DT 플랫폼</h1>
          <p class="text-white">계정에 로그인하세요</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-white">이메일</label>
            <input
              id="email"
              type="email"
              v-model="email"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-white">비밀번호</label>
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
              <label for="remember_me" class="ml-2 block text-sm text-white"
                >로그인 정보 기억하기</label
              >
            </div>
          </div>

          <div>
            <label v-if="isLoginFailed" for="alarm" class="ml-2 text-sm text-red-700">
              유효하지 않은 계정입니다. 다시 입력해주세요
            </label>
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
import { useUserStore } from '@/stores/userStore.js'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { auth, db } from '@/firebase/index.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import 'vue3-carousel/dist/carousel.css'
import builderImage from '@/assets/builder.png'
import DigitalTwinImage from '@/assets/digitalTwin.png'
import dashboardImage from '@/assets/dashboard.png'
import blackBoxImage from '@/assets/blackBox.png'
import teamLogoImage from '@/assets/teamLogo.png'

export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const isLoginFailed = ref(false)
    const slides = ref([
      {
        id: 1,
        image: builderImage,
        alt: 'Builder',
        title: 'Builder',
        description: '당신의 아이디어로 설계한 공간을 바로 확인해보세요'
      },
      {
        id: 2,
        image: DigitalTwinImage,
        alt: 'DigitalTwin',
        title: 'DigitalTwin',
        description: 'DigitalTwin으로 재구성된 당신의 시설을 확인해보세요'
      },
      {
        id: 3,
        image: dashboardImage,
        alt: 'Dashboard',
        title: 'Dashboard',
        description: '대시보드에서 실시간 작업 변동 현황을 확인해보세요'
      },
      {
        id: 4,
        image: blackBoxImage,
        alt: 'BlackBox',
        title: 'BlackBox',
        description: '이상이 감지된 데이터를 언제라도 다시 확인해보세요'
      }
    ])

    const handleSubmit = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // userStore의 userLogin 함수를 호출하여 사용자 정보와 토큰을 저장합니다.
          await userStore.userLogin({
            userId: user.uid,
            userEmail: user.email,
            userName: userData.name,
            userPhoneNumber: userData.phone
          })

          console.log('User logged in:', userStore.userStatus)

          // 로그인 성공 후 이동할 페이지로 라우팅합니다.
          router.push({ name: 'builder' })
        } else {
          console.error('User document does not exist in Firestore')
          isLoginFailed.value = true
        }
      } catch (error) {
        console.error('Login error:', error)
        isLoginFailed.value = true
      }
    }

    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      email.value = rememberedEmail
    }

    return { email, password, handleSubmit, rememberMe, slides, isLoginFailed, teamLogoImage }
  }
}
</script>
<style scoped>
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

/* 화살표 색상을 흰색으로 변경 */
:deep(.carousel__prev),
:deep(.carousel__next) {
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 화살표 아이콘 색상 변경 */
:deep(.carousel__prev-icon),
:deep(.carousel__next-icon) {
  fill: white;
}

/* 페이지네이션 버튼 색상 변경 (선택사항) */
:deep(.carousel__pagination-button::after) {
  background-color: white;
}

:deep(.carousel__pagination-button:hover::after),
:deep(.carousel__pagination-button--active::after) {
  background-color: #fff;
}
</style>
