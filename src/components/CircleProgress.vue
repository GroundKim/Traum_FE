<template>
  <div class="circle-progress">
    <div class="circle">
      <div class="bar" v-for="n in 10" :key="n" :class="{'filled': n <= filledBars}" :style="getBarStyle(n)"></div>
    </div>
    <div class="center">{{ percentage }}%</div>
  </div>
  <div v-if="percentage == 100" style="font-size: 30px;
    color: lightgreen;
    display: flex;
    margin-top : 30px;
" > COMPLETE </div>
  <div v-else-if="!startState" style="font-size: 30px;
    color: lightcoral;
    display: flex;
    margin-top : 30px;

" > STOPPED </div>
  <div v-else style="font-size: 30px;
    color: lightsalmon;
    display: flex;
    margin-top : 30px;

" > RUNNING </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value1: {
    type: Number,
    required: true
  },
  value2: {
    type: Boolean,
    required: true
  }
});

const percentage = computed(() => (props.value1 / 5) * 100);
const filledBars = computed(() => Math.ceil(props.value1 * 2)); // 총 5값에 2배수로 칸 채움
const startState = computed(() => props.value2);
const getBarStyle = (n) => {
  return {
    transform: `rotate(${n * 36}deg) translate(0, -40px)`, // 막대를 더 멀리 이동
    '--i': n
  };
};
</script>

<style scoped>
.circle-progress {
  position: relative;
  width: 200px;
  height: 200px;
}

.circle {
  position: absolute;
  top: 30%;
  left : 50%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bar {
  position: absolute;
  width: 14px;
  height: 70px;
  background-color:#1b263b;
  transform-origin: bottom center;
  transition: background-color 0.3s;
  margin: 30px; /* 간격 조정 */
  border-radius : 5px;
}

.bar.filled {
  background-color: rgb(187, 212, 235);
}

.center {
  position: absolute;
  top: 48%;
  left : 51%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
  z-index: 2;
}
</style>
