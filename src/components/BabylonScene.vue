<template>
  <div class="babylon-scene-container w-full h-full relative flex">
    <div class="absolute top-2 right-2 z-10 my-auto">
      <font-awesome-icon
        @click="toggleFullScreen"
        size="lg"
        :icon="['fas', 'up-right-and-down-left-from-center']"
        class="cursor-pointer"
        style="color: #ffffff"
      />
    </div>
    <canvas ref="bjsCanvas" class="w-full h-full" @dragover.prevent @drop="onDrop"></canvas>
    <div
      v-if="isPending"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <FwbSpinner size="12" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import mqtt from 'mqtt'
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
import { FwbSpinner } from 'flowbite-vue'

export default {
  name: 'BabylonScene',
  components: {
    FwbSpinner
  },
  setup() {
    const meshes = ref({})
    const bjsCanvas = ref(null)
    let engine, scene, camera, highlightLayer
    const client = ref(null)
    const connectionStatus = ref('Disconnected')
    const isPending = ref(true)

    const createScene = (canvas) => {
      engine = new Engine(canvas, true, { stencil: true })
      scene = new Scene(engine)
      highlightLayer = new HighlightLayer('hl1', scene)

      // 카메라 설정 수정
      camera = new ArcRotateCamera(
        'camera',
        -Math.PI / 2, // alpha (회전 각도)
        Math.PI / 3, // beta (고도 각도, 약간 위에서 내려다보는 각도)
        20, // 반지름 (거리)
        new Vector3(0, 0, 0), // 타겟 위치
        scene
      )
      camera.attachControl(canvas, true)
      camera.lowerRadiusLimit = 5 // 최소 줌 거리 설정
      camera.upperRadiusLimit = 50 // 최대 줌 거리 설정
      new HemisphericLight('light', new Vector3(1, 1, 1), scene)

      scene.executeWhenReady(() => {
        engine.runRenderLoop(() => {
          if (scene.activeCamera) {
            scene.render()
          }
        })
      })

      window.addEventListener('resize', () => {
        engine.resize()
      })

      return scene
    }

    const createLabel = (text, color) => {
      const plane = MeshBuilder.CreatePlane('labelPlane', { width: 1, height: 0.5 }, scene)
      plane.position.y = -1
      plane.position.z = 0
      plane.rotation.x = Math.PI
      plane.billboardMode = Mesh.BILLBOARDMODE_ALL

      const dynamicTexture = new DynamicTexture('labelTexture', { width: 256, height: 128 }, scene)
      const labelMaterial = new StandardMaterial('labelMaterial', scene)
      labelMaterial.diffuseTexture = dynamicTexture
      labelMaterial.specularColor = new Color3(0, 0, 0)
      labelMaterial.backFaceCulling = false
      labelMaterial.emissiveColor = new Color3(1, 1, 1)
      labelMaterial.useAlphaFromDiffuseTexture = true
      plane.material = labelMaterial

      dynamicTexture.drawText(text, null, null, 'bold 48px Arial', color, 'transparent', true)

      return plane
    }

    const setupMQTTConnection = () => {
      if (client.value) {
        client.value.end()
      }
      client.value = mqtt.connect(`ws://${import.meta.env.VITE_SOCKET_URL}`, {
        keepalive: 60,
        reconnectPeriod: 5000,
        connectTimeout: 30 * 1000
      })

      client.value.on('connect', () => {
        console.log('Connected to MQTT broker')
        connectionStatus.value = 'Connected'
        subscribeToAllTopics()
      })

      client.value.on('error', (error) => {
        console.error('MQTT connection error:', error)
        connectionStatus.value = 'Error: ' + error.message
        setTimeout(setupMQTTConnection, 5000)
      })

      client.value.on('close', () => {
        connectionStatus.value = 'Disconnected'
        setTimeout(setupMQTTConnection, 5000)
      })

      client.value.on('message', handleMQTTMessage)
    }

    const subscribeToAllTopics = () => {
      Object.values(meshes.value).forEach((item) => {
        if (item.mqttTopic) {
          subscribeToTopic(item.mqttTopic)
        }
      })
    }
    const subscribeToTopic = (topic) => {
      client.value.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`)
        } else {
          console.error(`Failed to subscribe to ${topic}:`, err)
        }
      })
    }

    const handleMQTTMessage = (topic, message) => {
      const messageStr = message.toString()
      try {
        const messageObj = JSON.parse(messageStr)
        if (messageObj !== undefined) {
          const item = Object.values(meshes.value).find((item) => item.mqttTopic === topic)
          if (item) {
            if (item.meshName === 'sensor') {
              handleSensorMessage(item, messageObj)
            } else if (item.meshName === 'eduKit') {
              handleEduKitMessage(item, messageObj)
            }
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    const handleSensorMessage = (item, messageObj) => {
      const singleValue = Number(messageObj[0].value)
      let newColor = singleValue >= Number(item.threshold) ? 'red' : 'green'

      if (newColor !== item.color) {
        changeMeshColor(item, newColor)
        meshes.value[item.meshId].color = newColor
      }
    }

    const handleEduKitMessage = (item, messageObj) => {
      if (messageObj[19].value === true && meshes.value[item.meshId].color !== 'red') {
        changeMeshColor(item, 'red')
        meshes.value[item.meshId].color = 'red'
      } else if (messageObj[0].value === true && meshes.value[item.meshId].color !== 'green') {
        changeMeshColor(item, 'green')
        meshes.value[item.meshId].color = 'green'
      }
    }

    const changeMeshColor = async (item, color) => {
      if (meshes.value[item.meshId]) {
        try {
          const position = meshes.value[item.meshId].mesh.position
          let filename = `${meshes.value[item.meshId].meshName}`
          if (color !== 'white') {
            filename += color.charAt(0).toUpperCase()
          }
          filename += '.glb'

          const result = await SceneLoader.ImportMeshAsync('', './models/', filename, scene)

          const newMesh = result.meshes[0]
          newMesh.position = position
          newMesh.scaling = meshes.value[item.meshId].mesh.scaling.clone()

          meshes.value[item.meshId].mesh.dispose()
          meshes.value[item.meshId].label.dispose()

          meshes.value[item.meshId].mesh = newMesh

          result.meshes.forEach((submesh) => {
            if (submesh.getClassName() === 'Mesh') {
              let highlightColor
              switch (color) {
                case 'red':
                  highlightColor = Color3.Red()
                  break
                case 'green':
                  highlightColor = Color3.Green()
                  break
                case 'white':
                default:
                  highlightColor = Color3.White()
                  break
              }
              highlightLayer.addMesh(submesh, highlightColor)
            }
          })

          const newLabel = createLabel(item.name, color)
          newLabel.parent = newMesh
          meshes.value[item.meshId].label = newLabel

          meshes.value[item.meshId].color = color
        } catch (e) {
          console.error(`Failed to change mesh color to ${color}: ${e}`)
        }
      }
    }
    const handleUpdateName = (item) => {
      if (meshes.value[item.meshId]) {
        meshes.value[item.meshId].name = item.name
        meshes.value[item.meshId].mqttTopic = item.mqttTopic
        meshes.value[item.meshId].threshold = item.threshold

        if (meshes.value[item.meshId].label) {
          meshes.value[item.meshId].label.dispose()
        }

        const newLabel = createLabel(item.name, meshes.value[item.meshId].color || 'white')
        newLabel.parent = meshes.value[item.meshId].mesh
        meshes.value[item.meshId].label = newLabel

        setupMQTTConnection()
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

        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${itemData.meshName}.glb`,
            scene
          )
          const mesh = result.meshes[0]

          switch (itemData.meshName) {
            case 'eduKit':
              mesh.scaling = new Vector3(1, 1, -1)
              break
            case 'sensor':
              mesh.scaling = new Vector3(2, 2, -2)
              break
          }
          mesh.position = position

          const label = createLabel(itemData.name, 'white')
          label.parent = mesh

          meshes.value[itemData.meshId] = {
            meshName: itemData.meshName,
            name: itemData.name,
            meshId: itemData.meshId,
            mqttTopic: itemData.mqttTopic,
            threshold: itemData.threshold,
            mesh: mesh,
            label: label,
            color: 'white'
          }
          setupMQTTConnection()
        } catch (error) {
          console.error('Error creating mesh:', error)
        }
      }
    }

    const removeMesh = (item) => {
      if (meshes.value[item.meshId]) {
        meshes.value[item.meshId].mesh.dispose()
        meshes.value[item.meshId].label.dispose()
        delete meshes.value[item.meshId]
      }
    }

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        bjsCanvas.value.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }

    const createInitialSensors = () => {
      const initialSensors = [
        {
          meshId: 100005,
          name: 'eduKit1',
          type: '3d',
          meshName: 'eduKit',
          mqttTopic: 'edge/edukit/status',
          threshold: '10',
          location: '2.1,0.8,-1.25',
          color: null
        },
        {
          meshId: 1,
          name: 'sensor1',
          type: '3d',
          meshName: 'sensor',
          mqttTopic: 'edge/sensor/temperature-1',
          threshold: '-1',
          location: '3.5,0.8,-1.25',
          color: null
        }
      ]

      initialSensors.forEach(async (sensor) => {
        const [x, y, z] = sensor.location.split(',').map(Number)
        const position = new Vector3(x, y, z)

        try {
          const result = await SceneLoader.ImportMeshAsync(
            '',
            './models/',
            `${sensor.meshName}.glb`,
            scene
          )
          const mesh = result.meshes[0]
          switch (sensor.meshName) {
            case 'eduKit':
              mesh.scaling = new Vector3(1, 1, -1)
              break
            case 'sensor':
              mesh.scaling = new Vector3(2, 2, -2)
              break
          }
          mesh.position = position

          const label = createLabel(sensor.name, 'white')
          label.parent = mesh

          meshes.value[sensor.meshId] = {
            meshName: sensor.meshName,
            name: sensor.name,
            meshId: sensor.meshId,
            mqttTopic: sensor.mqttTopic,
            threshold: sensor.threshold,
            mesh: mesh,
            label: label,
            color: 'white'
          }

          // 센서 생성 후 즉시 해당 토픽 구독
          if (client.value && client.value.connected) {
            subscribeToTopic(sensor.mqttTopic)
          }
          isPending.value = false
        } catch (error) {
          console.error('Error creating initial sensor mesh:', error)
        }
      })
    }

    onMounted(() => {
      if (bjsCanvas.value) {
        scene = createScene(bjsCanvas.value)
        SceneLoader.ImportMesh('', './models/', 'UVC_V02.glb', scene, () => {
          setupMQTTConnection() // MQTT 연결 먼저 설정
          createInitialSensors() // 그 다음 초기 센서 생성
        })
      }
      emitter.on('startItem', handleStart)
      emitter.on('removeItem', handleDelete)
      emitter.on('alarmItem', handleAlarm)
      emitter.on('updateItem', handleUpdateName)
    })

    onUnmounted(() => {
      if (engine) {
        engine.dispose()
      }
      emitter.off('startItem', handleStart)
      emitter.off('removeItem', handleDelete)
      emitter.off('alarmItem', handleAlarm)
      emitter.off('updateItem', handleUpdateName)
      if (client.value) {
        client.value.end()
      }
    })

    const handleStart = (item) => {
      console.log('Start item:', item)
      changeMeshColor(item, 'green')
    }

    const handleDelete = (item) => {
      console.log('Delete item:', item)
      removeMesh(item)
    }

    const handleAlarm = (item) => {
      console.log('Alarm item:', item)
      changeMeshColor(item, 'red')
    }

    return {
      bjsCanvas,
      onDrop,
      removeMesh,
      meshes,
      handleUpdateName,
      connectionStatus,
      toggleFullScreen,
      isPending
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
