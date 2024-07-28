<template>
  <div class="navbar">
    <button class="button" @click="changeContents(0)" :disabled="nowContents == 0">
        <img src="/img/builder.png">
        <div>BUILDER</div>
    </button>
    <button class="button" @click="changeContents(1)" :disabled="nowContents == 1">
        <img src="/img/dashboard.png">
        <div>DASHBOARD</div>
    </button>
    <button class="button" @click="changeContents(2)" :disabled="nowContents == 2">
        <img src="/img/digitaltwin.png">
        <div>DIGITAL-TWIN</div>
    </button>
    <button class="button" @click="changeContents(3)" :disabled="nowContents == 3">
        <img src="/img/blackbox.png">
        <div>BLACK-BOX</div>
    </button>
    <button class="button" @click="changeContents(4)" :disabled="nowContents == 4">
        <img src="/img/logout.png">
        <div>LOGOUT</div>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // useRouter 가져오기

const router = useRouter(); // useRouter 호출
const links = [
  { path: '/builder', name: 'Builder' },
  { path: '/simulation', name: 'Simulation' },
  { path: '/digitaltwin/1', name : 'DigitalTwin'},
  { path: '/dashboard/1', name: 'Dashboard'},
  { path: '/blackbox', name: 'BlackBox'}
]
const nowContents = ref(0);

const changeContents = (contents) => {
  nowContents.value = contents;
  router.push(links[contents].path); // 라우터로 경로 이동
  console.log(nowContents.value);
};
</script>

<style scoped>
.button {
  width: 150px;
  height: 150px;
  border: 1px solid grey;
  background-color: rgb(21, 20, 20);
  color: white;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.3s, background-color 0.3s;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: grey;
}

img {
  filter: invert(1);
  width: 60px;
  height: 60px;
  margin: 10px;
}
</style>
