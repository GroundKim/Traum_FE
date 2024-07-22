import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'flowbite'
import * as Flowbite from 'flowbite-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// Flowbite 컴포넌트를 전역으로 등록합니다.
Object.keys(Flowbite).forEach((key) => {
  app.component(key, Flowbite[key])
})

app.mount('#app')
