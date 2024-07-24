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
  SceneLoader,
  HighlightLayer
} from '@babylonjs/core'
import '@babylonjs/loaders'
import emitter from '@/components/eventBus.js'

export default {
  name: 'BabylonScene',
  setup() {
    const meshes = ref({})
    const bjsCanvas = ref(null)
    let engine, scene, camera, highlightLayer
    const createScene = (canvas) => {
      engine = new Engine(canvas, true, { stencil: true })
      scene = new Scene(engine)
      highlightLayer = new HighlightLayer('hl1', scene)

      camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene)
      camera.attachControl(canvas, true)
      new HemisphericLight('light', new Vector3(1, 1, 1), scene)

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
    // kit 중지 시 하이라이트 및 형광등 변경

    const changeMeshColorRed = async (item) => {
      if (meshes.value[item.meshId]) {
        const position = meshes.value[item.meshId].mesh.position

        let mesh
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${meshes.value[item.meshId].meshName}R.glb`,
            scene
          )
          result.meshes.forEach((submesh) => {
            if (submesh.getClassName() === 'Mesh') {
              highlightLayer.addMesh(submesh, Color3.Red())
            }
          })

          mesh = result.meshes[0]
          mesh.position = position
          meshes.value[item.meshId].mesh.dispose()
          meshes.value[item.meshId].mesh = mesh
          switch (meshes.value[item.meshId].meshName) {
            case 'eduKit':
              mesh.scaling = new Vector3(1, 1, -1)
              break
            case 'sensor':
              mesh.scaling = new Vector3(2, 2, -2)
              break
          }
          mesh.position = position
          // 모든 라벨에 대해 고정된 높이 설정
          const fixedLabelHeight = -1 // 이 값을 조정하여 원하는 고정 높이 설정

          const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
          plane.parent = mesh
          plane.position.y = fixedLabelHeight
          plane.position.z = 0
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
          labelMaterial.backFaceCulling = false
          labelMaterial.emissiveColor = new Color3(1, 1, 1)
          labelMaterial.useAlphaFromDiffuseTexture = true
          plane.material = labelMaterial

          dynamicTexture.drawText(
            item.name,
            null,
            null,
            'bold 48px Arial',
            'red',
            'transparent',
            true
          )

          meshes.value[item.meshId] = {
            meshName: meshes.value[item.meshId].meshName,
            mesh: mesh,
            label: plane
          }
        } catch (e) {
          console.error(`Failed to load mesh ${meshes.value[item.meshId].meshName}R.glb`, e)
        }
      }
    }
    // kit 작동 시 하이라이트 및 형광등 변경

    const changeMeshColorGreen = async (item) => {
      if (meshes.value[item.meshId]) {
        const position = meshes.value[item.meshId].mesh.position

        let mesh
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${meshes.value[item.meshId].meshName}G.glb`,
            scene
          )
          result.meshes.forEach((submesh) => {
            if (submesh.getClassName() === 'Mesh') {
              highlightLayer.addMesh(submesh, Color3.Green())
            }
          })

          mesh = result.meshes[0]
          mesh.position = position
          meshes.value[item.meshId].mesh.dispose()
          meshes.value[item.meshId].mesh = mesh
          switch (meshes.value[item.meshId].meshName) {
            case 'eduKit':
              mesh.scaling = new Vector3(1, 1, -1)
              break
            case 'sensor':
              mesh.scaling = new Vector3(2, 2, -2)
              break
          }
          mesh.position = position
          // 모든 라벨에 대해 고정된 높이 설정
          const fixedLabelHeight = -1 // 이 값을 조정하여 원하는 고정 높이 설정

          const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
          plane.parent = mesh
          plane.position.y = fixedLabelHeight
          plane.position.z = 0
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
          labelMaterial.backFaceCulling = false
          labelMaterial.emissiveColor = new Color3(1, 1, 1)
          labelMaterial.useAlphaFromDiffuseTexture = true
          plane.material = labelMaterial

          dynamicTexture.drawText(
            item.name,
            null,
            null,
            'bold 48px Arial',
            'green',
            'transparent',
            true
          )

          meshes.value[item.meshId] = {
            meshName: meshes.value[item.meshId].meshName,
            mesh: mesh,
            label: plane
          }
        } catch (e) {
          console.error(`Failed to load mesh ${meshes.value[item.meshId].meshName}G.glb`, e)
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
        let position = pickResult.hit ? pickResult.pickedPoint : new Vector3(0, 0, 0)

        let mesh
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${itemData.meshName}.glb`,
            scene
          )
          mesh = result.meshes[0]

          switch (itemData.meshName) {
            case 'eduKit':
              mesh.scaling = new Vector3(1, 1, -1)
              break
            case 'sensor':
              mesh.scaling = new Vector3(2, 2, -2)
              break
          }
          mesh.position = position

          // 모든 라벨에 대해 고정된 높이 설정
          const fixedLabelHeight = -1 // 이 값을 조정하여 원하는 고정 높이 설정

          const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
          plane.parent = mesh
          plane.position.y = fixedLabelHeight
          plane.position.z = 0
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
          labelMaterial.backFaceCulling = false
          labelMaterial.emissiveColor = new Color3(1, 1, 1)
          labelMaterial.useAlphaFromDiffuseTexture = true
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
    const handleStart = (item) => {
      console.log('알람 도착확인', item)
      changeMeshColorGreen(item)
    }

    const handleDelete = (item) => {
      console.log('도착확인', item)
      removeMesh(item)
    }
    const handleAlarm = (item) => {
      console.log('알람 도착확인', item)
      changeMeshColorRed(item)
    }

    const handleUpdateName = (item) => {
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
        console.log(`Mesh with meshId ${item.meshId} not found.`)
      }
    }

    // sensor 하이라이트, 글씨색상 변경 처리
    const handleUpdateNameColor = async (item, color) => {
      if (meshes.value[item.meshId]) {
        const position = meshes.value[item.meshId].mesh.position

        let mesh
        let filename = meshes.value[item.meshId].meshName
        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${filename}.glb`,
            scene
          )

          result.meshes.forEach((submesh) => {
            if (submesh.getClassName() === 'Mesh' && color === 'red') {
              highlightLayer.addMesh(submesh, Color3.Red())
            } else if (submesh.getClassName() === 'Mesh' && color === 'white') {
              highlightLayer.addMesh(submesh, Color3.Green())
            }
          })

          mesh = result.meshes[0]
          mesh.position = position
          meshes.value[item.meshId].mesh.dispose()
          meshes.value[item.meshId].mesh = mesh
          switch (meshes.value[item.meshId].meshName) {
            case 'eduKit':
              mesh.scaling = new Vector3(1, 1, -1)
              break
            case 'sensor':
              mesh.scaling = new Vector3(2, 2, -2)
              break
          }
          mesh.position = position
          // 모든 라벨에 대해 고정된 높이 설정
        } catch (e) {
          console.error(`Failed to load mesh ${meshes.value[item.meshId].meshName}.glb`, e)
        }
      }

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
          color,
          'transparent',
          true
        )

        // Update the meshes.value with the new label
        meshes.value[item.meshId].label = plane
      } else {
        console.log(`Mesh with meshId ${item.meshId} not found.`)
      }
    }

    onMounted(() => {
      if (bjsCanvas.value) {
        scene = createScene(bjsCanvas.value)
        SceneLoader.ImportMesh('', './models/', 'UVC_V02.glb', scene)
      }
      emitter.on('startItem', handleStart)
      emitter.on('removeItem', handleDelete)
      emitter.on('alarmItem', handleAlarm)
      emitter.on('updateItem', (item) => {
        handleUpdateName(item)
      })
      emitter.on('updateItemColor', ([item, color]) => {
        console.log(color)
        console.log(item)

        handleUpdateNameColor(item, color)
      })
    })

    onUnmounted(() => {
      if (engine) {
        engine.dispose()
      }
      emitter.off('startItem', handleStart)
      emitter.off('removeItem', handleDelete)
      emitter.off('alarmItem', handleAlarm)
      emitter.off('updateItem', handleUpdateName)
    })

    return {
      bjsCanvas,
      onDrop,
      removeMesh,
      removeAllMeshes,
      meshes,
      handleUpdateName,
      changeMeshColorRed,
      changeMeshColorGreen
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
