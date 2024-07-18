<template>
  <div class="flex flex-col">
    <canvas ref="bjsCanvas" @dragover.prevent @drop="onDrop"></canvas>
    <button @click="changeMeshColor('eduKit')">RED</button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Engine,
  Scene,
  HemisphericLight,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  DynamicTexture,
  StandardMaterial,
  Color3,
  SceneLoader
} from '@babylonjs/core'
import '@babylonjs/loaders'
import emitter from '@/components/eventBus.js'

export default {
  name: 'BabylonScene',
  setup() {
    const meshes = ref({})
    const bjsCanvas = ref(null)
    let engine, scene, camera
    const createScene = (canvas) => {
      engine = new Engine(canvas, true, { stencil: true })
      scene = new Scene(engine)
      camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene)
      camera.attachControl(canvas, true)
      new HemisphericLight('light', new Vector3(0, 1, 0), scene)
      engine.runRenderLoop(() => {
        scene.render()
      })

      window.addEventListener('resize', () => {
        engine.resize()
      })

      return scene
    }
    const removeMesh = (item) => {
      console.log(item.id)
      const meshId = item.id
      if (meshes.value[meshId]) {
        meshes.value[meshId].mesh.dispose()
        meshes.value[meshId].label.dispose()
        delete meshes.value[meshId]
      }
    }
    const removeAllMeshes = () => {
      Object.keys(meshes.value).forEach((meshName) => {
        removeMesh(meshName)
      })
    }

    const changeMeshColor = async (meshName) => {
      if (meshes.value[meshName]) {
        const position = meshes.value[meshName].mesh.position

        let mesh
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${meshName}R.glb`,
            scene
          )
          mesh = result.meshes[0]
          mesh.position = position
          meshes.value[meshName].mesh.dispose()
          meshes.value[meshName].mesh = mesh

          const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
          plane.parent = mesh
          plane.position.y = -1
          plane.billboardMode = Mesh.BILLBOARDMODE_ALL

          const dynamicTexture = new DynamicTexture(
            'labelTexture',
            { width: 256, height: 128 },
            scene
          )
          const labelMaterial = new StandardMaterial('labelMaterial', scene)
          labelMaterial.diffuseTexture = dynamicTexture
          labelMaterial.specularColor = new Color3(0, 0, 0)
          plane.material = labelMaterial

          dynamicTexture.drawText(
            meshName,
            null,
            null,
            'bold 24px Arial',
            'white',
            'transparent',
            true
          )
        } catch (e) {
          console.error(`Failed to load mesh ${meshName}R.glb`, e)
        }
      }
    }

    const onDrop = async (event) => {
      event.preventDefault()
      const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
      console.log(itemData)
      console.log(meshes.value)
      if (meshes.value[itemData.Id]) {
        console.log(itemData.Id)
        removeMesh(itemData)
      }

      if (itemData.type === '3d') {
        const canvasRect = bjsCanvas.value.getBoundingClientRect()
        const pickResult = scene.pick(
          event.clientX - canvasRect.left,
          event.clientY - canvasRect.top
        )

        let position
        if (pickResult.hit) {
          position = pickResult.pickedPoint
        } else {
          const vector = scene.pick(
            event.clientX - canvasRect.left,
            event.clientY - canvasRect.top,
            (mesh) => mesh === scene.getMeshByName('ground')
          ).pickedPoint
          position = vector || new Vector3(0, 0, 0)
        }

        let mesh
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${itemData.meshName}.glb`,
            scene
          )
          mesh = result.meshes[0]
          mesh.position = position

          const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
          plane.parent = mesh
          plane.position.y = -1
          plane.billboardMode = Mesh.BILLBOARDMODE_ALL

          const dynamicTexture = new DynamicTexture(
            'labelTexture',
            { width: 256, height: 128 },
            scene
          )
          const labelMaterial = new StandardMaterial('labelMaterial', scene)
          labelMaterial.diffuseTexture = dynamicTexture
          labelMaterial.specularColor = new Color3(0, 0, 0)
          plane.material = labelMaterial

          dynamicTexture.drawText(
            itemData.name,
            null,
            null,
            'bold 24px Arial',
            'white',
            'transparent',
            true
          )
          meshes.value[itemData.id] = {
            mesh: mesh,
            label: plane
          }
          // console.log(itemData.id)
          // console.log(meshes.value)
        } catch (error) {
          console.error('Error creating mesh:', error)
        }
      }
    }

    const handleDelete = (item) => {
      console.log('도착확인', item)
      // 삭제 로직 구현
      removeMesh(item)
    }

    onMounted(() => {
      if (bjsCanvas.value) {
        scene = createScene(bjsCanvas.value)
        SceneLoader.ImportMesh('', './models/', 'UVC_V02.glb', scene)
      }

      emitter.on('removeItem', handleDelete)
    })

    onUnmounted(() => {
      if (engine) {
        engine.dispose()
      }
      emitter.on('removeItem', handleDelete)
    })

    return {
      bjsCanvas,
      onDrop,
      removeMesh,
      removeAllMeshes,
      meshes,

      changeMeshColor
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>

<!-- const changeMesh = (meshName) => {
  if (meshes.value[meshName] && meshes.value[meshName].mesh) {
    const mesh = meshes.value[meshName].mesh

    if (mesh.material) {
      const redMaterial = new StandardMaterial('redMaterial', scene)
      redMaterial.diffuseColor = new Color3(1, 0, 0)

      mesh.material = redMaterial
    } else {
      const redMaterial = new StandardMaterial('redMaterial', scene)
      redMaterial.diffuseColor = new Color3(1, 0, 0)
      mesh.material = redMaterial
    }

    mesh.computeWorldMatrix(true)
    scene.render()
  } else {
    console.error(`Mesh ${meshName} not found or invalid`)
  }
} -->
