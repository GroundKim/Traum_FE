<template>
  <canvas ref="bjsCanvas" width="1000" height="500" 
  class="px-10"/>

</template>

<script>
import { ref, onMounted } from "vue";
import { createScene } from "../scenes/MainScene.js";


export default {
  name: "BabylonScene",
  setup() {
    const bjsCanvas = ref(null);

    onMounted(() => {
      if (bjsCanvas.value) {
        createScene(bjsCanvas.value);
      }
    });

    return {
      bjsCanvas,
    };
  },
};
</script>