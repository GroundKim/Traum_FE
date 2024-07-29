<template>  
  <div class="main open-sans-main">
    <div class="container">
      <div class="fortime">
        <div class="time"> {{ currentTime }} </div>
        <div style="height:6px; width:450px;background:#40556b;margin-bottom:25px;"></div>
      </div>
      <div :class="['process', 'no1', { inactive: !datalist.No1PowerState }]">
        <div class="topic">
          <div class="name">Unit No.1</div>
        </div>
        <div class="standby">
          <span class="standby run" v-if="datalist.No1Push">RUNNING</span>
          <span class="standby ready" v-else>READY</span>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>
        <div class="data">
          <span>INPUT : {{ datalist.No1Count }}</span>
          <div class="chip-container">
            <div v-for="n in 5" :key="n" :class="['chip', { 'chip-active': n <= datalist.No1Count }]"></div>
          </div>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <div class="status">
          <span>STATUS :  </span>
          <span :class="{ 'status-normal': datalist.No1ChipFull, 'status-warning': !datalist.No1ChipFull }">
            {{ datalist.No1ChipFull ? '자재 정상' : '자재 부족' }}
          </span>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>
        <button @click="openModal('Unit No.1', '9', datalist.No1PowerState)">
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
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
      </div>
      <div class="circle-container" v-else>
        <div class="circle"></div>
        <div class="circle"></div>
        <img v-if="!datalist.No1PowerState" src="/img/redCross.png" class="redCross">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>

      <div :class="['process', 'no2', { inactive: !datalist.No2PowerState }]">
        <div class="topic">
          <div class="name">Unit No.2</div>
        </div>
        <div class="standby">
          <span class="standby run" v-if="datalist.No1Push">RUNNING</span>
          <span class="standby ready" v-else>READY</span>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <div class="data">
          <span>ASSEMBLY : {{ datalist.No2Count }}</span>
          <div class="chip-container">
            <div v-for="n in 5" :key="n" :class="['chip', { 'chip-active': n <= datalist.No2Count }]"></div>
          </div>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <div class="status">
          <span>STATUS :  </span>
          <span :class="{ 'status-normal': !datalist.No2CubeFull, 'status-warning': datalist.No2CubeFull }">
            {{ !datalist.No2CubeFull ? '부품 정상' : '부품 부족' }}
          </span>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <button @click="openModal('Unit No.2', '10', datalist.No2PowerState)">
          {{ datalist.No2PowerState ? 'Turn Off' : 'Turn On' }}
        </button>
      </div>
      <div class="circle-container" v-if="datalist.StartState">
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <img v-if="!datalist.No3PowerState" src="/img/redCross.png" class="redCross">
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
        <div :class="['circle', { 'animate-circle': datalist.StartState }]"></div>
      </div>
      <div class="circle-container" v-else>
        <div class="circle"></div>
        <div class="circle"></div>
        <img v-if="!datalist.No3PowerState" src="/img/redCross.png" class="redCross">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>

      <div :class="['process', 'no3', { inactive: !datalist.No3PowerState }]">
        <div class="topic">
          <div class="name">Unit No.3</div>
        </div>
        <div class="standby">
          <span class="standby run" v-if="datalist.No3Motor1Action || datalist.No3Motor2Action">RUNNING</span>
          <span class="standby ready" v-else>READY</span>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <div class="data">
          <span>STACK : {{ datalist.No3Count }}</span>
          <div class="chip-container">
            <div v-for="n in 5" :key="n" :class="['chip', { 'chip-active': n <= datalist.No3Count }]"></div>
          </div>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <div class="status">
          <span>STATUS :  </span>
          <span :class="{ 'status-normal': datalist.No3Count < 5, 'status-warning': datalist.No3Count >=5 }">
            {{ datalist.No3Count < 5 ? '적재 가능' : '적재량 최대' }}
          </span>
        </div>
        <div style="width: 6px; height:60px; background:lightgrey; opacity:0.5;"></div>

        <button @click="openModal('Unit No.3', '11', datalist.No3PowerState)">
          {{ datalist.No3PowerState ? 'Turn Off' : 'Turn On' }}
        </button>
      </div>
    </div>
    <div class="line"></div>
    <div class="top">
      <div style="height:20px;"></div>
      <div class="top-contents top-left">
        <div class="lamp-status">
          <div class="lamp green" :class="{ active: datalist.GreenLampState }"></div>
          <div class="lamp yellow" :class="{ active: datalist.YellowLampState }"></div>
          <div class="lamp red" :class="{ active: datalist.RedLampState }"></div>
        </div>
        <div v-if="datalist.RedLampState"> ERROR </div>
        <div v-else-if="!datalist.No1PowerState || !datalist.No2PowerState || !datalist.No3PowerState"> CHECK UNIT'S POWER</div>
        <div v-else> CLEAR </div>
      </div>
      <div class="top-contents top-mid">
        <div class = "pb"> SELECTED : </div>
        <select id="edukit-select" v-model="selectedEdukit" class="select">
          <option value="EDUKIT1">EDUKIT1</option>
          <option value="EDUKIT2" disabled>EDUKIT2</option>
          <option value="EDUKIT3" disabled>EDUKIT3</option>
          <option value="EDUKIT4" disabled>EDUKIT4</option>
          <option value="EDUKIT5" disabled>EDUKIT5</option>
        </select>
      </div>
      <div class="top-contents top-right">
        <div class= "pb"> PROGRESS</div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
          <img src="/img/turtle.png" alt="Turtle Icon" class="turtle-icon" :style="{ left: progress + '%' }"/>
        </div>
        <div>{{ progress }}%</div>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ modalTitle }}</h2>
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons" v-if="datalist.StartState === false">
          <button @click="confirmAction">YES</button>
          <button @click="closeModal">NO</button>
        </div>
        <div class="modal-buttons" v-else>
          <button @click="closeModal">CLOSE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mqtt from 'mqtt';
import io from 'socket.io-client';

const selectedEdukit = ref('EDUKIT1');
const currentTime = ref('');

// 시간을 업데이트하는 함수
const updateTime = () => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = (nowTime.getMonth() + 1).toString().padStart(2, '0');
  const date = nowTime.getDate().toString().padStart(2, '0');
  const hours = nowTime.getHours().toString().padStart(2, '0');
  const minutes = nowTime.getMinutes().toString().padStart(2, '0');
  const seconds = nowTime.getSeconds().toString().padStart(2, '0');
  currentTime.value = `${year} - ${month} - ${date}\u00A0\u00A0\u00A0\u00A0\u00A0${hours} : ${minutes} : ${seconds}`;
};


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

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const currentTagId = ref('');
const currentValue = ref('');

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

  updateProgressBar();
};
const progress = ref(datalist.value.No3Count);

const updateProgressBar = () => {
  // if (datalist.value.StartState) {
    // Calculate progress based on No3Count
    progress.value = ((datalist.value.No3Count / 5) * 100, 100);
  // }
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

const openModal = (unitName, tagId, currentState) => {
  modalTitle.value = unitName;
  currentTagId.value = tagId;
  currentValue.value = currentState ? '0' : '1';

  if (datalist.value.StartState) {
    modalMessage.value = "가동중에는 공정을 비활성화 할 수 없습니다.";
  } else {
    modalMessage.value = currentState
      ? `공정을 비활성화 하시겠습니까?`
      : `공정을 활성화 하시겠습니까?`;
  }

  showModal.value = true;
};

const confirmAction = () => {
  sendCommand(currentTagId.value, currentValue.value);
  closeModal();
};

const closeModal = () => {
  showModal.value = false;
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

const socket = io(`ws://${import.meta.env.VITE_SOCKET_IO_URL}`, {
  transports: ['websocket'],
});

let mqttClient;

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
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
  updateProgressBar();
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

.line{
  width: 10px;
    height: 100%;
    background-color: #3d5166;
    margin-left: 80px;
    border-radius: 5px;
}

.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  /* background-color: #212529; */
  background: linear-gradient(180deg, #33475e, #212529); /* 네이비색 그라데이션 */
  padding: 20px;
  color: #f8f9fa;
}

.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction : column;
  gap: 20px;
  align-items: center;
  
}

.top {
  display: flex;
  flex-direction : column;
  border-radius: 10px;
  margin-left : 20px;
}

.top-contents {
  background-color: #343a40;
  border-radius: 15px;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.5);
  transition: background-color 0.5s, box-shadow 0.3s;
  width: 375px;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f8f9fa;

}



.progress {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #677079;
  border-radius: 5px;
  transition: background-color 2s;
}

.process {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #576c84;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s, box-shadow 0.3s;
  color: #ffffff;
  width : 850px;
  left : 5%;
  height : 110px;
}

.process.inactive {
  background-color: #b86868;
}

.pb {
  padding: 10px;
  color: #ffffff;
}

.standby {
  margin: 10px;
  padding: 8px;
  font-size: 30px;
  color: #ffffff;
  width : 18%;
}

.topic {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.name {
  position: absolute;
  top: -25px;
  left: 3%;
  transform: translateX(-50%);
  display: flex;
  height: 50px;
  padding: 0 20px;
  font-size: 16px;
  background-color: #28588c;
  color: #ffffff;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.data {
  margin: 10px;
  font-size: 10px;
  color: #f8f9fa;
  display: flex;
  flex-direction: row;
  align-items: center;
  width : 34%;
  padding : 8px;
  text-align: center;
}

.bar-chart {
  width: 100%;
  background-color: #dee2e6;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 10px;
  border: 1px solid #ced4da;
}

.bar {
  height: 10px;
  background-color: #1b263b;
}

.chip-container {
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin : 10px;
}

.chip {
  width: 20px;
  height: 40px;
  background-color: #f8f9fa;
  border: 1px solid #adb5bd;
  border-radius: 5px;
}

.chip-active {
  background-color: #1b263b;
}

span {
  font-size: 17px;
  color : white; 
  width : 150px;
}

.status-normal {
  color: #5bf65e;
}

.status-warning {
  color: #f56342;
}

.status-unknown {
  color: gray;
}

button {
  margin: 10px 10px 10px 20px;  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  background-color: #1b263b;
  color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  width : 15%;
}

.status {
  margin: 10px;
  width : 30%;
  padding : 8px;
  text-align: center;
}

button:hover {
  background-color: #415a77;
  transform: scale(1.05);
}

.select {
  border-radius: 10px;
  background-color: #495057;
  color: #f8f9fa;
  border: 1px solid #1b263b;
}

.plcData {
  width: 1000px;
  margin: 10px;
  background-color: #f8f9fa;
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
  flex-direction : column;
  justify-content: center;
  align-items: center;
  position: relative;
  width : 50px;
}

.circle, .redCross {
  margin: 5px;
}

.circle {
  background-color: #778da9;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.redCross {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 40%;
  transform: translateX(-50%);
}

.animate-circle {
  animation: circle-loading 1.5s infinite;
}

@keyframes circle-loading {
  0%, 100% {
    background-color: #778da9;
  }
  50% {
    background-color: #1b263b;
  }
}

.lamp-status {
  display: flex;
  justify-content: space-around;
}

.lamp {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 10px;
  border: 3px solid #f8f9fa;
  background-color: lightgrey;
  opacity: 0.3;
  transition: background-color 0.3s, opacity 0.3s;
}

.lamp.green.active {
  background-color: #6beb7a;
  opacity: 1;
}

.lamp.yellow.active {
  background-color: #e6d769;
  opacity: 1;
}

.lamp.red.active {
  background-color: #ea785f;
  opacity: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #343a40;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  height: 200px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  color: #f8f9fa;
}

.modal-buttons {
  margin : 10px;
}

.modal-buttons button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #1b263b;
  color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-buttons button:hover {
  background-color: #415a77;
}

p {
  margin: 10px;
}

.top-contents .progress-bar {
  position: relative;
  width: 100%;
  height: 40px;
  background-color: transparent;
  border: 1px solid #1b263b;
  border-radius: 5px;
  overflow: hidden;
}

.top-contents .progress-bar .progress {
  height: 100%;
  background-color: #1b263b;
  transition: width 0.5s ease-in-out;
}

.turtle-icon {
  position: absolute;
  top: -5px;
  transform: translateX(-50%);
  height: 50px;
}

.progress-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #f8f9fa;
}

.top-mid{
  height : 90px;
}
.top-right {
  display: flex;
  flex-direction: column;
  height : 380px;
}
.top-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height : 120px;
}
.time {
  margin: 10px;
  font-size: 25px;
  height : 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
