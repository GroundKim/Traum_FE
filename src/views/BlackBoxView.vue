<template>
  <div class="main-content">
    <div class="top">
      <div class="sidebar">
        <div class = "space" style="margin : 0px 25px 0px 25px;">
          <h2 class="header">EDUKIT LIST</h2>
          <select class="edukitselection" v-model="selectedEdukit">
            <option disabled value="">Edukits ...</option> <!-- 기본값 -->
            <option value="EDUKIT1">EDUKIT1</option>
            <option value="EDUKIT2" disabled>EDUKIT2</option>
            <option value="EDUKIT3" disabled>EDUKIT3</option>
            <option value="EDUKIT4" disabled>EDUKIT4</option>
            <option value="EDUKIT5" disabled>EDUKIT5</option>
          </select>
          <h2 class="header">BLACKBOX LIST </h2>
          <select class="blackboxselection" v-model="selectedBlackbox"> 
            <option disabled value="">Blackboxes ...</option> <!-- 기본값 -->
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
            <button :disabled="!blackboxRunning" class="control-button" @click="stopBlackbox">
              <img class="control-icon" src="/img/stopButton.png">
            </button>
          </div>
        </div>
      </div>

      <div class="datalist">
        <h2 class="header mhead"> DATA BOARD </h2>
        <div class="mqttdata">
          <div class="data1">
              <div v-for="data in filteredData1" :key="data.index">
                {{ data.index }}. {{ data.name }}: {{ data.value }}
              </div>
            </div>
            <div class="data2">
              <div v-for="data in filteredData2" :key="data.index">
                {{ data.index }}. {{ data.name }}: {{ data.value }}
              </div>
            </div>
            <div class="data3">
              <div v-for="data in filteredData3" :key="data.index">
                {{ data.index }}. {{ data.name }}: {{ data.value }}
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="bottom">
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import mqtt from 'mqtt';
const blackboxRunning = ref(false);
const isPaused = ref(false);
const blackboxList = ref([]);
const selectedEdukit = ref('');
const selectedBlackbox = ref('');
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
const sortedData = ref([]);  // 정렬된 데이터를 저장할 배열
const filteredData1 = computed(() => sortedData.value.filter(data => data.index >= 0 && data.index <= 14));
const filteredData2 = computed(() => sortedData.value.filter(data => data.index >= 15 && data.index <= 29));
const filteredData3 = computed(() => sortedData.value.filter(data => data.index >= 30));

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

let client = null;

const connectMQTT = () => {
  client = mqtt.connect('ws://traum.groundkim.com:9001');

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

const unconnectMQTT = () => {
  if (client) {
    // 클라이언트 구독 취소
    const topic = `/blackbox/${selectedBlackbox.value}`;
    client.unsubscribe(topic, (err) => {
      if (err) {
        console.error('Failed to unsubscribe from topic', err);
      } else {
        console.log(`Unsubscribed from ${topic}`);
      }
    });

    // 이벤트 리스너 제거
    client.removeAllListeners('message');
    client.removeAllListeners('connect');
    client.removeAllListeners('error');

    // 클라이언트 종료
    client.end(() => {
      console.log('Disconnected from MQTT broker');
    });
  }
};

const updateDatalist = (parsedData) => {
  // 각 데이터 항목의 tagId를 사용하여 데이터를 정렬하고 저장합니다.
  sortedData.value = parsedData.map((item) => ({
    index: item.tagId,  // tagId를 index로 사용
    name: item.name,
    value: item.value
  }));

  // 정렬된 데이터를 tagId (index) 순으로 정렬합니다.
  sortedData.value.sort((a, b) => a.index - b.index);

  // datalist 갱신
  parsedData.forEach(item => {
    if (item.name in datalist.value) {
      datalist.value[item.name] = item.value;
    }
  });
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
const stopBlackbox = () => {
  sortedData.value = [];
  blackboxRunning.value = false;
  isPaused.value = false;
  unconnectMQTT();
  
}
onMounted(fetchBlackboxList);
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #33475e, #212529); /* 네이비색 그라데이션 */
  align-items : center;

}

.top {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px;
  margin-left : 50px;

}

.sidebar {
  width: 400px;
  padding: 10px;
  margin : 20px;
  border-radius: 20px;
  height : 350px;
  background-color: #7fb2ec5c;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.datalist {
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
  height : 350px;
  background-color: #7fb2ec5c;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.mqttdata {
  height: 280px;
  width : 790px;
  overflow-y: scroll;
  font-size: 12px;
  display : flex;
  border-radius : 20px;
  background: rgb(255 255 255 / 24%);
  justify-content: space-between;
}
.data1{
  width : 35%;
  padding: 5px 15px 5px 15px;
}
.data2{
  width : 29%;
}
.data3{
  width : 29%;
}
.header {
  color : white;
  font-size : 18px;
  margin : 10px;
  font-weight : bold;
}
.mhead{
  text-align : center;
}
.container{
  display : flex;
  border-radius : 20px;
  padding : 10px;
  align-items: center;
  justify-content: center;
  height : 350px;
  min-width : 1210px;
  margin : 10px 20px 10px 20px;
  background-color: #7fb2ec5c;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);

}
.controls {
  margin-top: 20px;
  display : flex;
  align-content: center; 
  justify-content: space-between;
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
.bottom {
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
  width : 150px;
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
.edukitselection{
  margin : 10px;
  border-radius : 10px;
  width : 310px;
}
.blackboxselection{
  margin : 10px;
  border-radius : 10px;
  width : 310px;

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
