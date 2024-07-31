import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      redirect: '/login',
      children: [
        {
          path: '/builder',
          component: () => import('../views/BuilderView.vue'),
          name: 'builder'
        },
        {
          path: '/digitaltwin/:meshId',
          component: () => import('../views/DigitalTwinView.vue'),
          name: 'DigitalTwin',
          props: true
        },
        {
          path: '/dashboard/:meshId',
          component: () => import('../views/DashboardView.vue'),
          name: 'Dashboard',
          props: true
        },
        {
          path: '/blackbox',
          component: () => import('../views/BlackBoxView.vue'),
          name: 'BlackBox'
        }
      ]
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      name: 'login'
    },
    {
      path: '/register',
      component: () => import('../views/RegisterView.vue'),
      name: 'register'
    },

    {
      path: '/popup/:name/:threshold/:mqttTopic(.*)',
      component: () => import('../components/modals/PopUpContent.vue'),
      name: 'PopupContent',
      props: true
    }
  ]
})

export default router
