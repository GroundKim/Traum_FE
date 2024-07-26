import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

import 'flowbite'
import * as Flowbite from 'flowbite-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// axios
import axiosPlugin from '@/plugins/axios.js';
// import axiosPlugin from './plugins/axios.js';

library.add(fas)

const app = createApp(App)
// FontAwesomeIcon 컴포넌트를 글로벌로 등록
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
// Flowbite 컴포넌트를 전역으로 등록합니다.
Object.keys(Flowbite).forEach((key) => {
  app.component(key, Flowbite[key])
})
app.use(axiosPlugin);
app.mount('#app')
