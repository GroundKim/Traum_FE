<template>
  <table class="">
    <thead class="justify-center">
      <tr>
        <th class="px-14">제목</th>
      </tr>
      <tr v-for="link in links" :key="link.id" class="flex justify-center">
        <button
          @click="() => (selectedValue = link.id)"
          class="text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
          :class="{
            'bg-blue-500 text-white active:bg-emerald-600': link.id === selectedValue,
            'bg-white border-blueGray-600 text-black active:bg-emerald-600': !(
              link.id === selectedValue
            )
          }"
        >
          {{ link.name }}
        </button>
      </tr>
    </thead>
  </table>
</template>

<script setup>
import { ref } from 'vue'
const links = [
  { id: '1', name: '선택지1' },
  { id: '2', name: '선택지2' },
  { id: '3', name: '선택지2' }
  // { id: '4', name: '선택지2' },
  // { id: '5', name: '선택지2' },
  // { id: '6', name: '선택지2' },
  // { id: '7', name: '선택지2' },
  // { id: '8', name: '선택지2' },
  // { id: '9', name: '선택지9' },
]
const selectedValue = ref(links[0].id)
</script>
