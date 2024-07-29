<template>
      <div id="unity-container" class="unity-desktop main">
        <canvas id="unity-canvas"></canvas>
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div id="unity-progress-bar-full"></div>
          </div>
        </div>
        <div class = "buttons">
          <button>A</button>
          <button>B</button>
          <button>C</button>
        </div>
      </div>

    
</template>

<script>
import mqtt from "mqtt";
export default {
  name: 'EdukitView',
  props:{meshId:Number},

  mounted() {
    this.loadUnity();
  },
  methods: {
    loadUnity() {
      const buildUrl = "/unity/Build";
      const loaderUrl = buildUrl + "/0719last.loader.js";
      const config = {
        dataUrl: buildUrl + "/0719last.data.unityweb",
        frameworkUrl: buildUrl + "/0719last.framework.js.unityweb",
        codeUrl: buildUrl + "/0719last.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "0719last",
        productVersion: "0.1",
      };

      const canvas = document.querySelector("#unity-canvas");
      const loadingBar = document.querySelector("#unity-loading-bar");
      const progressBarFull = document.querySelector("#unity-progress-bar-full");

      canvas.style.width = "960px";
      canvas.style.height = "600px";

      const script = document.createElement("script");
      script.src = loaderUrl;
      script.onload = () => {
        if (typeof createUnityInstance === 'undefined') {
          console.error('createUnityInstance is not defined. Please ensure the Unity loader script is loaded correctly.');
          return;
        }
        createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance) => {
          loadingBar.style.display = "none";
          this.unityInstance = unityInstance;
          this.setupMQTT();
        }).catch((message) => {
          alert(message);
        });
      };
      document.body.appendChild(script);
    },
    setupMQTT() {
      const client = mqtt.connect('ws://192.168.0.32:9001'); // MQTT 브로커 주소와 포트

      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('edge/topic', (err) => {
          if (!err) {
            console.log('Subscribed to topic');
          }
        });
      });

      client.on('message', (topic, message) => {
        const payload = message.toString();
        console.log('Message received: ', payload);
        // Unity로 데이터 전송
        if (this.unityInstance) {
          try {
            this.unityInstance.SendMessage('GameObjectName', 'MethodName', payload);
          } catch (error) {
            console.error('Error sending message to Unity:', error);
          }
        }
      });
    }
  }
}
</script>

<style scoped>

.buttons {
  background-color : white;
}
#unity-container {
  width: 960px;
  margin: auto;
}
#unity-canvas {
  width: 100%;
  height: auto;
}
#unity-loading-bar {
  width: 100%;
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
