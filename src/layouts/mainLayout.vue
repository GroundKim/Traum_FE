<script setup>
import BlackboxNav from '@/components/NavBars/BlackboxNav.vue'
</script>
<template>
  <div style="background: linear-gradient(180deg, #33475e, #212529)">
    <div class="app-main">
      <BlackboxNav></BlackboxNav>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-main {
  display: flex;
  flex-direction: row;
}
</style>
