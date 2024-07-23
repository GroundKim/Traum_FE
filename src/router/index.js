import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      name: 'Dashboard'
    },
    {
      path: '/dashboard2',
      component: () => import('../views/Dashboard2View.vue'),
      name: 'Dashboard2'
    },
    {
      path: '/simulation',
      component: () => import('../views/SimulationView.vue'),
      name: 'Simulation'
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
      path: '/digitaltwin',
      component: () => import('../views/DigitalTwinView.vue'),
      name: 'DigitalTwin'
    }
  ]
})

export default router
