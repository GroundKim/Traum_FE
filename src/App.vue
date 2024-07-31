<script setup>
// NavBar와 Footer를 숨길 라우트 이름들을 정의합니다.

// 현재 라우트에 따라 NavBar 표시 여부를 결정합니다.

// 현재 라우트에 따라 Footer 표시 여부를 결정합니다.
</script>
<template>
  <div style="background: linear-gradient(180deg, #33475e, #212529)">
    <div class="app-main">
      <RouterView />
    </div>
    <!-- <Footer class="bg-[#212529]" v-if="showFooter"></Footer> -->
  </div>
</template>

<style scoped>
.app-main {
  display: flex;
  flex-direction: row;
}
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
