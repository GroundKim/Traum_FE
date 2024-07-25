<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        <div class="flex gap-10">
          <BabylonScene />
          <List></List>
          <List></List>
        </div>
        <line-chart-detail></line-chart-detail>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, onUnmounted } from 'vue'
import BabylonScene from '../components/BabylonScene.vue'
import List from '@/components/lists/ButtonList.vue'
import LineChartDetail from '../components/charts/LineChart.vue'

export default {
  components: {
    BabylonScene,
    List,
    LineChartDetail
  },
  setup() {
    //socket//
    onMounted(() => {})

    onUnmounted(() => {})

    return {}
  }
}
</script>
