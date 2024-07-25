<script setup>
import NavBar from '@/components/NavBars/NavBar.vue'
import Footer from '@/components/footers/MainFooter.vue'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// NavBar와 Footer를 숨길 라우트 이름들을 정의합니다.
const hideNavBarRoutes = ['login', 'register', 'PopupContent'];
const hideFooterRoutes = ['login', 'register', 'PopupContent'];

// 현재 라우트에 따라 NavBar 표시 여부를 결정합니다.
const showNavBar = computed(() => !hideNavBarRoutes.includes(route.name));

// 현재 라우트에 따라 Footer 표시 여부를 결정합니다.
const showFooter = computed(() => !hideFooterRoutes.includes(route.name));
</script>
<template>
  <div>
    <NavBar v-if="showNavBar"></NavBar>
    <RouterView />
    <Footer v-if="showFooter" />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
