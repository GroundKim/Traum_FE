<!-- BabylonScene.vue -->
<template>
  <canvas ref="bjsCanvas" @dragover.prevent @drop="onDrop"></canvas>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { Engine, Scene, HemisphericLight, ArcRotateCamera, Vector3, MeshBuilder, Mesh, DynamicTexture, StandardMaterial, Color3, SceneLoader } from "@babylonjs/core"
import "@babylonjs/loaders";

export default {
  name: 'BabylonScene',
  setup() {
    const bjsCanvas = ref(null);
    let engine, scene, camera;

    const createScene = (canvas) => {
      engine = new Engine(canvas, true);
      scene = new Scene(engine);

      camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
      camera.attachControl(canvas, true);

      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });

      return scene;
    };

    const onDrop = (event) => {
      event.preventDefault();
      const itemData = JSON.parse(event.dataTransfer.getData('application/json'));
      if (itemData.type === '3d') {
        const canvasRect = bjsCanvas.value.getBoundingClientRect();
        const pickResult = scene.pick(event.clientX - canvasRect.left, event.clientY - canvasRect.top);

        let position;
        if (pickResult.hit) {
          position = pickResult.pickedPoint;
        } else {
          const vector = scene.pick(event.clientX - canvasRect.left, event.clientY - canvasRect.top,
            (mesh) => mesh === scene.getMeshByName("ground"))
            .pickedPoint;
          position = vector || new Vector3(0, 0, 0);
        }

        let mesh;
        switch (itemData.meshName) {
          case 'box':
            mesh = MeshBuilder.CreateBox(itemData.name, { size: 1 }, scene);
            break;
          case 'sphere':
            mesh = MeshBuilder.CreateSphere(itemData.name, { diameter: 1 }, scene);
            break;
          default:
            mesh = MeshBuilder.CreateBox(itemData.name, { size: 1 }, scene);
        }

        mesh.position = position;

        // Add label
        const plane = MeshBuilder.CreatePlane("labelPlane", { width: 1, height: 0.5 }, scene);
        plane.parent = mesh;
        plane.position.y = 1;
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const dynamicTexture = new DynamicTexture("labelTexture", { width: 256, height: 128 }, scene);
        const labelMaterial = new StandardMaterial("labelMaterial", scene);
        labelMaterial.diffuseTexture = dynamicTexture;
        labelMaterial.specularColor = new Color3(0, 0, 0);
        plane.material = labelMaterial;

        dynamicTexture.drawText(itemData.name, null, null, "bold 24px Arial", "white", "transparent", true);
      }
    };

    onMounted(() => {
      if (bjsCanvas.value) {
        const scene = createScene(bjsCanvas.value);

        // Create a ground
        const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
        ground.material = groundMaterial;

        // Create a UVC_classroom
        const UVC_classroom = SceneLoader.ImportMesh("", "./models/", "UVC_V02.glb", scene)
      }
    });

    onUnmounted(() => {
      if (engine) {
        engine.dispose();
      }
    });

    return {
      bjsCanvas,
      onDrop,
    };
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>