<template>
  <div class="main-content">
    <div class="left">
      <div class="sidebar">
        <h2>EDUKIT LIST</h2>
        <select v-model="selectedEdukit">
          <option v-for="edukit in edukitList" :key="edukit">{{ edukit }}</option>
        </select>
        <h2>BLACKBOX LIST</h2>
        <select v-model="selectedBlackbox">
          <option v-for="blackbox in blackboxList" :key="blackbox">{{ blackbox }}</option>
        </select>
        <div class="controls">
          <button v-if="!blackboxRunning" :disabled="blackboxRunning" class="control-button" @click="startBlackbox">
            <img class="control-icon" src="/img/playButton.png">
          </button>
          <button v-else :disabled="!isPaused" class="control-button" @click="resumeBlackbox">
            <img class="control-icon" src="/img/playButton.png">
          </button>
          <button :disabled="!blackboxRunning || isPaused" class="control-button" @click="pauseBlackbox">
            <img class="control-icon" src="/img/pauseButton.png">
          </button>
          <button @click="increaseSpeed">X2</button>
        </div>
      </div>

      <div class="datalist">
        <h2> DATA BOARD </h2>
        <div class="mqttdata">{{ mqttData }}</div>
      </div>
    </div>
    <div class="right">
      <div>
      </div>
        <div class="container">
          <div :class="['process', 'no1', { inactive: !datalist.No1PowerState }]">
            <div class="topic">
              <div class="name">Unit No.1</div>
            </div>
            <div class="standby">
              <span class="standby run" v-if="datalist.No1Push">RUNNING</span>
              <span class="standby ready" v-else>READY</span>
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
          </div>
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
            <div class="standby">
              <span class="standby run" v-if="datalist.No1Push">RUNNING</span>
              <span class="standby ready" v-else>READY</span>
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

          </div>
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
            <div class="standby">
              <span class="standby run" v-if="datalist.No3Motor1Action || datalist.No3Motor2Action">RUNNING</span>
              <span class="standby ready" v-else>READY</span>
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

          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import mqtt from 'mqtt';
const blackboxRunning = ref(false);
const isPaused = ref(false);
const edukitList = ref(['Edukit1', 'Edukit2', 'Edukit3', 'Edukit4', 'Edukit5']);
const blackboxList = ref([]);
const selectedEdukit = ref(null);
const selectedBlackbox = ref(null);
const mqttData = ref('');
const datalist = ref({
  StartState: null,
  No1Push: null,
  No1PowerState: null,
  No1Count: null,
  No1ChipFull: null,
  No2Count: null,
  No2PowerState: null,
  No2CubeFull: null,
  No3Motor1Action: null,
  No3Motor2Action: null,
  No3PowerState: null,
  No3Count: null,
});

const fetchBlackboxList = async () => {
  try {
    const response = await axios.get('http://traum.groundkim.com:4000/influx/blackbox/list');
    blackboxList.value = response.data;
  } catch (error) {
    console.error('Failed to fetch blackbox list', error);
  }
};

const startBlackbox = async () => {
  if (!selectedBlackbox.value) return;
  blackboxRunning.value = true;

  try {
    await axios.post(`http://traum.groundkim.com:4000/blackbox/start/${selectedBlackbox.value}`);
    connectMQTT();
  } catch (error) {
    console.error('Failed to start blackbox', error);
  }
};

const connectMQTT = () => {
  const client = mqtt.connect('ws://traum.groundkim.com:9001');

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    const topic = `/blackbox/${selectedBlackbox.value}`;
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Failed to subscribe to topic', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    mqttData.value = message.toString();
    try {
      const parsedData = JSON.parse(mqttData.value);
      updateDatalist(parsedData);
    } catch (e) {
      console.error("Error parsing MQTT data", e);
    }
  });

  client.on('error', (error) => {
    console.error('MQTT connection error', error);
  });
};

const updateDatalist = (parsedData) => {
  const dataMap = {
    StartState: 'StartState',
    No1Push: 'No1Push',
    No1PowerState: 'No1PowerState',
    No1Count: 'No1Count',
    No1ChipFull: 'No1ChipFull',
    No2Count: 'No2Count',
    No2PowerState: 'No2PowerState',
    No2CubeFull: 'No2CubeFull',
    No3Motor1Action: 'No3Motor1Action',
    No3Motor2Action: 'No3Motor2Action',
    No3PowerState: 'No3PowerState',
    No3Count: 'No3Count',
  };

  parsedData.forEach(item => {
    if (dataMap[item.name] !== undefined) {
      datalist.value[dataMap[item.name]] = item.value;
    }
  });
};

const increaseSpeed = () => {
  // 속도 증가 로직

  console.log('Increase speed');
};

const pauseBlackbox = () => {
  // 일시 정지 로직
  isPaused.value = true;
  axios.post(`http://traum.groundkim.com:4000/blackbox/stop/${selectedBlackbox.value}`);
  console.log('Pause');
};
const resumeBlackbox = () => {
  // 재개 로직
  isPaused.value = false;
  axios.post(`http://traum.groundkim.com:4000/blackbox/resume/${selectedBlackbox.value}`);
  console.log('Resume');
};

onMounted(fetchBlackboxList);
</script>

<style scoped>
.main-content {
  display: flex;
}

.left {
  display: flex;
  flex-direction: column;
  width: 350px;
  align-items: center;
  margin: 10px;
}

.sidebar {
  width: 320px;
  background-color: #eee;
  padding: 10px;
  margin: 20px 0px 20px 0px;
  border: 2px solid black;
  border-radius: 20px;
}

.datalist {
  width: 320px;
  background-color: #eee;
  margin: 20px 0px 20px 0px;
  padding: 10px;
  border: 2px solid black;
  border-radius: 20px;
}

.mqttdata {
  height: 300px;
  overflow-y: scroll;
  font-size: 10px;
}
.container{
  margin : 20px;
  display : flex;
  background-color : lightgrey;
  border-radius : 20px;
  padding : 10px;
  align-items: center;
  justify-content: center;
  height : 400px;
  border : 2px solid black;

}
.controls {
  margin-top: 20px;
}
.control-icon{
  width : 35px;
  height : 35px;
}
button {
  padding: 10px;
  cursor: pointer;
  margin: 10px;
  border-radius: 10px;
  width: 80px;
  height: 50px;
}


.process {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: background-color 0.3s, box-shadow 0.3s;
}
.right {
  margin : 10px;
}
.process.inactive {
  background-color: #7c7c7c;
  box-shadow: none;
}

.standby {
  margin: 10px;
  padding: 8px;
  font-size: 30px;
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
  margin: 20px;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  width : 200px;
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

button:hover {
  background-color: #357ab7;
  transform: scale(1.05);
}

.circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 50px;
}

.circle,
.redCross {
  margin: 10px;
}

.circle {
  background-color: grey;
  width: 15px;
  height: 15px;
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
  0%,
  100% {
    background-color: grey;
  }
  50% {
    background-color: #4a90e2;
  }
}
.control-button:disabled {
  background-color: grey;
  cursor: not-allowed;
  color: white;
  opacity : 0.7;
}
</style>
