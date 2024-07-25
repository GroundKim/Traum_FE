<template>
  <div class="main open-sans-main">
    <div> 이거 뭔지 </div>
    <div class="container">
      <div :class="['process', 'no1', { inactive: !datalist.No1PowerState }]">
        <div class="topic">
          <div class="name">Unit No.1</div>
        </div>
        <div class="data">
          <span>INPUT : {{ datalist.No1Count }}</span>
          <div class="chip-container">
            <div v-for="n in 5" :key="n" :class="['chip', { 'chip-active': n <= datalist.No1Count }]"></div>
          </div>
        </div>
        <div class="status">
          <span>STATUS: </span>
          <span :class="{ 'status-normal': datalist.No1ChipFull, 'status-warning': !datalist.No1ChipFull }">
            {{ datalist.No1ChipFull ? '자재 정상' : '자재 부족' }}
          </span>
        </div>
        <button @click="sendCommand('9', datalist.No1PowerState ? '0' : '1')">
          {{ datalist.No1PowerState ? 'Turn Off' : 'Turn On' }}
        </button>
      </div>
      
      <!-- 원형 및 이미지 컨테이너 -->
      <div class="circle-container" v-if="datalist.StartState">
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <img v-if="!datalist.No1PowerState" src="/img/redCross.png" class="redCross">
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
      </div>
      <div class="circle-container" v-else>
        <div class="circle"></div>
        <div class="circle"></div>
        <img v-if="!datalist.No1PowerState" src="/img/redCross.png" class="redCross">
        <div class="circle"></div>
        <div class="circle"></div>
      </div>

      <div :class="['process', 'no2', { inactive: !datalist.No2PowerState }]">
        <div class="topic">
          <div class="name">Unit No.2</div>
        </div>
        <div class="data">
          <span>ASSEMBLY : {{ datalist.No2Count }}</span>
          <div class="chip-container">
            <div v-for="n in 5" :key="n" :class="['chip', { 'chip-active': n <= datalist.No2Count }]"></div>
          </div>
        </div>
        <div class="status">
          <span>STATUS: </span>
          <span :class="{ 'status-normal': !datalist.No2CubeFull, 'status-warning': datalist.No2CubeFull }">
            {{ !datalist.No2CubeFull ? '부품 정상' : '부품 부족' }}
          </span>
        </div>
        <button @click="sendCommand('10', datalist.No2PowerState ? '0' : '1')">
          {{ datalist.No2PowerState ? 'Turn Off' : 'Turn On' }}
        </button>
      </div>
      
      <!-- 또 다른 원형 및 이미지 컨테이너 -->
      <div class="circle-container">
        <div class="circle"></div>
        <div class="circle"></div>
        <img v-if="!datalist.No3PowerState" src="/img/redCross.png" class="redCross">
        <div class="circle"></div>
        <div class="circle"></div>
      </div>

      <div :class="['process', 'no3', { inactive: !datalist.No3PowerState }]">
        <div class="topic">
          <div class="name">Unit No.3</div>
        </div>
        <div class="data">
          <span>STACK : {{ datalist.No3Count }}</span>
          <div class="chip-container">
            <div v-for="n in 5" :key="n" :class="['chip', { 'chip-active': n <= datalist.No3Count }]"></div>
          </div>
        </div>
        <div class="status">
          <span>STATUS: </span>
          <span class="status-unknown">데이터 없음</span>
        </div>
        <button @click="sendCommand('11', datalist.No3PowerState ? '0' : '1')">
          {{ datalist.No3PowerState ? 'Turn Off' : 'Turn On' }}
        </button>
      </div>
    </div>

    <div class="plcData">
      <div class="data">GreenLampState: {{ datalist.GreenLampState }}</div>
      <div class="data">YellowLampState: {{ datalist.YellowLampState }}</div>
      <div class="data">RedLampState: {{ datalist.RedLampState }}</div>
      <div class="data">DataTime: {{ datalist.DataTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mqtt from 'mqtt';
import io from 'socket.io-client';

const plcData = ref('');
const datalist = ref({
  StartState: null,
  No1ChipEmpty: null,
  No1Push: null,
  No2InPoint: null,
  No2OutPoint: null,
  No3Motor1Action: null,
  No3Motor2Action: null,
  ResetState: null,
  No1PowerState: null,
  No2PowerState: null,
  No3PowerState: null,
  No1DelayTime: null,
  No1Count: null,
  No2Count: null,
  No3Count: null,
  GreenLampState: null,
  YellowLampState: null,
  RedLampState: null,
  No1ChipFull: null,
  No2CubeFull: null,
  DataTime: null,
});

const updateDatalist = (parsedData) => {
  const dataMap = {
    StartState: 'StartState',
    No1ChipEmpty: 'No1ChipEmpty',
    No1Push: 'No1Push',
    No2InPoint: 'No2InPoint',
    No2OutPoint: 'No2OutPoint',
    No3Motor1Action: 'No3Motor1Action',
    No3Motor2Action: 'No3Motor2Action',
    ResetState: 'ResetState',
    No1PowerState: 'No1PowerState',
    No2PowerState: 'No2PowerState',
    No3PowerState: 'No3PowerState',
    No1DelayTime: 'No1DelayTime',
    No1Count: 'No1Count',
    No2Count: 'No2Count',
    No3Count: 'No3Count',
    GreenLampState: 'GreenLampState',
    YellowLampState: 'YellowLampState',
    RedLampState: 'RedLampState',
    No1ChipFull: 'No1ChipFull',
    No2CubeFull: 'No2CubeFull',
    DataTime: 'DataTime',
  };

  parsedData.forEach(item => {
    if (dataMap[item.name] !== undefined) {
      datalist.value[dataMap[item.name]] = item.value;
    }
  });
};

const connectMQTT = () => {
  const client = mqtt.connect('ws://traum.groundkim.com:9001'); 

  client.on('connect', () => {
    console.log('MQTT 연결 성공');
    client.subscribe('edge/edukit/status', (err) => {
      if (err) {
        console.error('구독 오류:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    if (topic === 'edge/edukit/status') {
      plcData.value = message.toString();
      updateDatalist(JSON.parse(message.toString()));
    }
  });

  client.on('error', (error) => {
    console.error('MQTT 연결 오류:', error);
  });

  return client;
};

const sendCommand = (tagId, value) => {
  if (socket && socket.connected) {
    const message = { tagId, value };
    socket.emit('SENDUVC-EDU-01', JSON.stringify(message));
    console.log(`명령 전송: tagId ${tagId}, value ${value}`);
  } else {
    console.log("WebSocket이 연결되지 않았습니다.");
  }
  };

const socket =io(`ws://${import.meta.env.VITE_SOCKET_IO_URL}`, {
  transports: ['websocket'],
});

let mqttClient;

onMounted(() => {
  mqttClient = connectMQTT();
  socket.on('connect', () => {
    console.log('WebSocket 연결 성공');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket 연결 끊김');
  });

  socket.on('connect_error', (error) => {
    console.log(`WebSocket 연결 오류: ${error}`);
  });
});

onUnmounted(() => {
  if (mqttClient) {
    mqttClient.end();
  }
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@200;400;600;800&display=swap');

.open-sans-main {
  font-family: "Open Sans", sans-serif;
  font-weight: 800;
  font-style: normal;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
}

.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  align-items : center;
}

.process {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.process.inactive {
  background-color: #7c7c7c;
  box-shadow: none;
}

.topic {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.name {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  height: 50px;
  padding: 0 20px;
  font-size: 20px;
  background-color: #4a90e2;
  color: white;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.data {
  margin : 20px;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-chart {
  width: 100%;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 10px;
  border: 1px solid #ddd;
}

.bar {
  height: 10px;
  background-color: #4a90e2;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
}

.chip {
  width: 20px;
  height: 40px;
  background-color: white;
  border: 1px solid #bbb;
  border-radius: 5px;
}

.chip-active {
  background-color: #4a90e2;
}

span {
  margin-top: 10px;
  font-size: 20px;
}

.status-normal {
  color: green;
}

.status-warning {
  color: red;
}

.status-unknown {
  color: gray;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
.status {
  margin : 20px;
}
button:hover {
  background-color: #357ab7;
  transform: scale(1.05);
}

.plcData {
  width: 1000px;
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}

.circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 50px; /* 원하는 높이로 조정 */
}

.circle, .redCross {
  margin: 10px;
}

.circle {
  background-color: grey;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.redCross {
  width: 80px;
  height: 80px;
  position: absolute;
  left: 40%;
  transform: translateX(-50%);
}

.animate-circle {
  animation: circle-loading 1.5s infinite;
}

@keyframes circle-loading {
  0%, 100% {
    background-color: grey;
  }
  50% {
    background-color: #4a90e2; /* 파란색 포인트 */
  }
}
</style>
