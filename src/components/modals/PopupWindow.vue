<!-- PopupWindow.vue -->
<template>
  <div class="popup-window" :style="{ left: `${left}px`, top: `${top}px` }" @mousedown="startDrag">
    <div class="popup-header">
      <h3>{{ title }}</h3>
      <button @click="$emit('close', id)">닫기</button>
    </div>
    <div class="popup-content">
      <p>Item ID: {{ item.meshId }}</p>
      <p>Name: {{ item.name }}</p>
      <p>Type: {{ item.type }}</p>
      <p>MQTT Topic: {{ item.mqttTopic }}</p>
      <p>Threshold: {{ item.threshold }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const left = ref(Math.random() * (window.innerWidth - 300))
    const top = ref(Math.random() * (window.innerHeight - 200))
    let isDragging = false
    let startX, startY

    const startDrag = (event) => {
      isDragging = true
      startX = event.clientX - left.value
      startY = event.clientY - top.value
      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', stopDrag)
    }

    const drag = (event) => {
      if (isDragging) {
        left.value = event.clientX - startX
        top.value = event.clientY - startY
      }
    }

    const stopDrag = () => {
      isDragging = false
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', stopDrag)
    }

    onMounted(() => {
      // 팝업 창이 마운트될 때 실행할 로직
      console.log(`Popup window ${props.id} mounted`)
      // 필요한 경우 여기에 추가 초기화 로직을 넣을 수 있습니다.
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', stopDrag)
    })

    return {
      left,
      top,
      startDrag
    }
  }
}
</script>

<style scoped>
.popup-window {
  position: fixed;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.popup-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f0f0f0;
  cursor: move;
}
.popup-content {
  padding: 10px;
}
</style>
