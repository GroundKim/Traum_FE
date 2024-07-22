<template>
  <div class="flex flex-col">
    <canvas ref="bjsCanvas" @dragover.prevent @drop="onDrop"></canvas>
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
      console.log(item.meshId)
      const meshId = item.meshId
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

    const changeMeshColor = async (meshId) => {
      if (meshes.value[meshId]) {
        const position = meshes.value[meshId].mesh.position

        let mesh
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${meshes.value[meshId].meshName}R.glb`,
            scene
          )
          mesh = result.meshes[0]
          mesh.position = position
          meshes.value[meshId].mesh.dispose()
          meshes.value[meshId].mesh = mesh

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
            meshes.value[meshId].meshName,
            null,
            null,
            'bold 24px Arial',
            'white',
            'transparent',
            true
          )
        } catch (e) {
          console.error(`Failed to load mesh ${meshes.value[meshId].meshName}R.glb`, e)
        }
      }
    }

    const onDrop = async (event) => {
      event.preventDefault()
      const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
      if (meshes.value[itemData.meshId]) {
        console.log(itemData.meshId)
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
          plane.position.y = -1 // 메시 위로 약간 올립니다.
          plane.position.z = 0.1 // 메시 앞으로 약간 이동시킵니다.
          plane.rotation.x = Math.PI
          plane.billboardMode = Mesh.BILLBOARDMODE_ALL

          const dynamicTexture = new DynamicTexture(
            'labelTexture',
            { width: 256, height: 128 },
            scene
          )
          const labelMaterial = new StandardMaterial('labelMaterial', scene)
          labelMaterial.diffuseTexture = dynamicTexture
          labelMaterial.specularColor = new Color3(0, 0, 0)
          labelMaterial.backFaceCulling = false // 양면에서 보이게 합니다.
          labelMaterial.emissiveColor = new Color3(1, 1, 1) // 발광 효과 추가
          labelMaterial.useAlphaFromDiffuseTexture = true // 알파 채널 사용

          plane.material = labelMaterial

          dynamicTexture.drawText(
            itemData.name,
            null,
            null,
            'bold 48px Arial',
            'white',
            'transparent',
            true
          )
          meshes.value[itemData.meshId] = {
            meshName: itemData.meshName,
            mesh: mesh,
            label: plane
          }
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
    const handleAlarm = (item) => {
      console.log('알람 도착확인', item)
      // 삭제 로직 구현
      changeMeshColor(item.meshId)
    }

    const handleUpdateName = (item) => {
      console.log(item)
      if (meshes.value[item.meshId]) {
        const mesh = meshes.value[item.meshId].mesh

        // Remove the existing label plane
        if (meshes.value[item.meshId].label) {
          meshes.value[item.meshId].label.dispose()
        }

        // Create a new plane
        const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
        plane.parent = mesh
        plane.position.y = -1
        plane.position.z = 0.1
        plane.rotation.x = Math.PI
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL

        // Create a new dynamic texture
        const dynamicTexture = new DynamicTexture(
          'labelTexture',
          { width: 256, height: 128 },
          scene
        )

        // Create a new material
        const labelMaterial = new StandardMaterial('labelMaterial', scene)
        labelMaterial.diffuseTexture = dynamicTexture
        labelMaterial.specularColor = new Color3(0, 0, 0)
        labelMaterial.backFaceCulling = false
        labelMaterial.emissiveColor = new Color3(1, 1, 1)
        labelMaterial.useAlphaFromDiffuseTexture = true

        plane.material = labelMaterial

        // Draw the new text
        dynamicTexture.drawText(
          item.name,
          null,
          null,
          'bold 48px Arial',
          'white',
          'transparent',
          true
        )

        // Update the meshes.value with the new label
        meshes.value[item.meshId].label = plane
      } else {
        console.error(`Mesh with meshId ${item.meshId} not found.`)
      }
    }

    onMounted(() => {
      if (bjsCanvas.value) {
        scene = createScene(bjsCanvas.value)
        SceneLoader.ImportMesh('', './models/', 'UVC_V02.glb', scene)
      }

      emitter.on('removeItem', handleDelete)
      emitter.on('alarmItem', handleAlarm)
      emitter.on('updateItem', handleUpdateName)
    })

    onUnmounted(() => {
      if (engine) {
        engine.dispose()
      }
      emitter.off('removeItem', handleDelete)
      emitter.off('alarmItem', handleAlarm)
      emitter.on('updateItem', handleUpdateName)
    })

    return {
      bjsCanvas,
      onDrop,
      removeMesh,
      removeAllMeshes,
      meshes,
      handleUpdateName,

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

<!-- <button @click="changeMeshColor()">RED</button> -->
