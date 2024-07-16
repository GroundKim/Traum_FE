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
      path: '/simulation',
      component: () => import('../views/SimulationView.vue'),
      name: 'Simulation'
    }
  ]
})

export default router
