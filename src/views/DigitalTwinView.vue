<template>
  <div id="unity-container" class="unity-desktop main">
    <canvas id="unity-canvas"></canvas>
    <div v-if="isPending" class="absolute inset-0 flex items-center justify-center bg-[#33334c] bg-opacity-50">
      <FwbSpinner size="12" />
    </div>
    <div id="unity-loading-bar">
      <div id="unity-logo"></div>
      <div id="unity-progress-bar-empty">
        <div id="unity-progress-bar-full"></div>
      </div>
    </div>
    <div class="controls">
      <button class="control-button" :disabled="isRunning == 1" @click="sendStartCommand()">
        <img class="control-icon" src="/img/playButton.png">
      </button>
      <button class="control-button" :disabled="isRunning == 0" @click="sendStopCommand()">
        <img class="control-icon" src="/img/pauseButton.png">
      </button>
      <button  class="control-button" :disabled="!isResetable" @click="sendResetCommand()">
        <img class="control-icon" src="/img/resetButton.png">
      </button>
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt'
import { ref, onMounted, reactive } from 'vue'
import io from 'socket.io-client'
import { FwbSpinner } from 'flowbite-vue'

export default {
  name: 'EdukitView',
  components: { FwbSpinner },
  props: { meshId: Number },
  setup() {
    const isPending = ref(true)
    const socket = ref(null)
    const unityInstance = ref(null)
    const isRunning = ref(0);
    const isResetable = ref(0);
    const connectSocket = () => {
      socket.value = io(`ws://${import.meta.env.VITE_SOCKET_IO_URL}`, {
        transports: ['websocket'],
        reconnectionAttempts: 1,
        reconnectionDelay: 1000
      })

      socket.value.on('connect', () => {
        // console.log('Connected to Socket.IO server.')
        socket.value.emit('joinRoom', 'UVC-EDU-01')
      })

      socket.value.on('disconnect', () => {
        // console.log('Disconnected from Socket.IO server.')
      })

      socket.value.on('connect_error', (error) => {
        // console.log('Socket.IO Error:', error)
      })
    }

    const sendSocketMessage = (command) => {
      if (socket.value && socket.value.connected) {
        socket.value.emit(`SENDUVC-EDU-01`, JSON.stringify(command))
        // console.log(`Command sent:`, command)
      } else {
        // console.log('Socket.IO is not connected. Cannot send command.')
      }
    }
    const sendStartCommand = () => {
      isRunning.value = 1;
      isResetable.value = 0;
      sendSocketMessage({ tagId: '1', value: '1' });
    };

    const sendStopCommand = () => {
      isRunning.value = 0;
      isResetable.value = 1;
      sendSocketMessage({ tagId: '1', value: '0' });
    };

    const sendResetCommand = () => {
      isRunning.value= 0;
      isResetable.value = 0;
      sendSocketMessage({ tagId: '8', value: '1' });
    };


    const loadUnity = () => {
      const buildUrl = '/unity/Build'
      const loaderUrl = buildUrl + '/0719last.loader.js'
      const config = {
        dataUrl: buildUrl + '/0719last.data.unityweb',
        frameworkUrl: buildUrl + '/0719last.framework.js.unityweb',
        codeUrl: buildUrl + '/0719last.wasm.unityweb',
        streamingAssetsUrl: 'StreamingAssets',
        companyName: 'DefaultCompany',
        productName: '0719last',
        productVersion: '0.1'
      }

      const canvas = document.querySelector('#unity-canvas')
      const loadingBar = document.querySelector('#unity-loading-bar')
      const progressBarFull = document.querySelector('#unity-progress-bar-full')

      canvas.style.width = '960px'
      canvas.style.height = '600px'

      const script = document.createElement('script')
      script.src = loaderUrl
      script.onload = () => {
        if (typeof createUnityInstance === 'undefined') {
          console.error(
            'createUnityInstance is not defined. Please ensure the Unity loader script is loaded correctly.'
          )
          return
        }
        createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + '%'
        })
          .then((instance) => {
            loadingBar.style.display = 'none'
            unityInstance.value = instance
            setupMQTT()
            isPending.value = false
          })
          .catch((message) => {
            alert(message)
          })
      }
      document.body.appendChild(script)
    }

    const setupMQTT = () => {
      const client = mqtt.connect('ws://192.168.0.32:9001')

      client.on('connect', () => {
        console.log('Connected to MQTT broker')
        client.subscribe('edge/topic', (err) => {
          if (!err) {
            console.log('Subscribed to topic')
          }
        })
      })

      client.on('message', (topic, message) => {
        const payload = message.toString()
        // console.log('Message received: ', payload)
        if (unityInstance.value) {
          try {
            unityInstance.value.SendMessage('GameObjectName', 'MethodName', payload)
          } catch (error) {
            // console.error('Error sending message to Unity:', error)
          }
        }
      })
    }

    onMounted(() => {
      connectSocket()
      loadUnity()
    })

    return {
      isPending,
      isResetable,
      isRunning,
      sendStartCommand,
      sendStopCommand,
      sendResetCommand
    }
  }
  
}
</script>

<style scoped>

button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #206fcbeb;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
    justify-content: center;
    align-items: center;
}
button {
  padding: 10px;
  cursor: pointer;
  margin: 10px 50px 10px 50px;
  border-radius: 10px;
  width: 100px;
  height: 65px;
}
button:hover {
  background-color: #357ab7;
  transform: scale(1.05);
}
.controls {
  display : flex;
  align-content: center; 
  justify-content: space-between;
}
.control-icon{
  width : 35px;
  height : 35px;
}
.control-button:disabled {
  background-color: grey;
  cursor: not-allowed;
  color: white;
  opacity : 0.4;
}
#unity-container {
  width: 960px;
  margin: auto;
  display : flex;
  justify-content : flex-start;
}
#unity-canvas {
  width: 100%;
  height: auto;
  margin : 50px 0px 10px 0px;
}
/* 0%로 숨김처리 */
#unity-loading-bar {
  width: 0%;
  text-align: center;
  position: absolute;
  top: 50%;
}
#unity-logo {
  display: none;
}
#unity-progress-bar-empty {
  width: 100%;
  height: 20px;
  background: rgb(255, 255, 255);
}
#unity-progress-bar-full {
  width: 0;
  height: 100%;
  background: green;
}
.unity-desktop {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
</style>
