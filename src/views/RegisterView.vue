<template>
  <div class="flex flex-col lg:flex-row h-screen overflow-y-hidden">
    <!-- 캐러셀 섹션 (좌측) -->
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

    <!-- 회원가입 폼 섹션 (우측) -->
    <div class="w-full lg:w-1/2 flex bg-[#33334c] text-white items-center justify-center">
      <div class="w-full max-w-md">
        <div class="flex flex-col text-center items-center">
          <img :src="teamLogoImage" alt="teamLogoImage" class="mt-20 w-auto h-auto" />
          <h1 class="text-2xl font-bold">회원 가입</h1>
        </div>

        <form @submit.prevent="register">
          <div class="mb-1">
            <label for="email" class="block text-sm font-medium text-white">이메일</label>
            <input
              id="email"
              type="email"
              v-model="email"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="mb-1">
            <label for="password" class="block text-sm font-medium text-white">비밀번호</label>
            <input
              id="password"
              type="password"
              v-model="password"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="mb-1">
            <label for="confirmPassword" class="block text-sm font-medium text-white"
              >비밀번호 확인</label
            >
            <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="mb-1">
            <label for="name" class="block text-sm font-medium text-white">이름</label>
            <input
              id="name"
              type="text"
              v-model="name"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div class="mb-1">
            <label for="phone" class="block text-sm font-medium text-white">전화번호</label>
            <input
              id="phone"
              type="tel"
              v-model="phone"
              class="mt-1 block w-full px-3 py-2 bg-white border border-blueGray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <p v-if="message" class="text-red-600 text-sm mb-2">{{ message }}</p>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              계정 생성
            </button>
            <div class="mt-1 text-white text-center">
              <p class="text-sm">
                이미 계정이 있으신가요?
                <a
                  @click="$router.push('/login')"
                  class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  로그인
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { auth, db } from '@/firebase/index.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'

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
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const name = ref('')
    const phone = ref('')
    const message = ref('')

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

    const validation = () => {
      if (!email.value || !password.value) {
        message.value = 'Email, Password를 입력해주세요'
        return false
      } else if (password.value.length < 6) {
        message.value = '비밀번호는 최소 6자 이상이어야 합니다.'
        return false
      } else if (password.value != confirmPassword.value) {
        message.value = 'Password가 일치하지 않습니다.'
        return false
      } else if (phone.value.length < 10) {
        message.value = '전화번호가 올바르지 않습니다.'
        return false
      } else {
        return true
      }
    }

    const register = async () => {
      if (validation()) {
        try {
          // Firebase Authentication을 사용하여 사용자 생성
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
          )

          // 사용자 추가 정보를 Firestore에 저장
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: name.value,
            phone: phone.value,
            email: email.value
          })

          console.log('회원가입 성공')
          router.push({ name: 'login' })

          router.push({ name: 'login' })
        } catch (error) {
          console.error(error.message)
          switch (error.code) {
            case 'auth/weak-password':
              message.value = '비밀번호는 최소 6자 이상이어야 합니다.'
              break
            case 'auth/email-already-in-use':
              message.value = '이미 사용 중인 이메일 주소입니다.'
              break
            case 'auth/invalid-email':
              message.value = '유효하지 않은 이메일 주소입니다.'
              break
            default:
              message.value = '가입에 실패하였습니다. 확인 후 다시 가입바랍니다.'
          }
        }
      }
    }

    return {
      email,
      password,
      confirmPassword,
      name,
      phone,
      message,
      register,
      slides,
      teamLogoImage
    }
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
