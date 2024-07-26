<template>
  <div>
    <div class="main-content">
      <div class="sidebar">
        <h2>Edukit Lists</h2>
        <ul>
          <li v-for="edukit in edukitList" :key="edukit">{{ edukit }}</li>
        </ul>
        <h2>Blackbox Lists</h2>
        <ul>
          <li v-for="blackbox in blackboxList" :key="blackbox" @click="selectBlackbox(blackbox)">
            {{ blackbox }}
          </li>
        </ul>
        <div class="controls">
          <button @click="startBlackbox">Start</button>
          <button @click="increaseSpeed">X2</button>
          <button @click="pauseBlackbox">Pause</button>
        </div>
      </div>
      <div class="dashboard">
        <h2>Blackbox Dashboard</h2>
        <div v-if="mqttData">
          <h3>Received Data</h3>
          <div>{{ mqttData }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import mqtt from 'mqtt';

const edukitList = ref(['Edukit1', 'Edukit2', 'Edukit3', 'Edukit4', 'Edukit5']); // 예시 Edukit 리스트
const blackboxList = ref([]);
const selectedBlackbox = ref(null);
const mqttData = ref('');

const fetchBlackboxList = async () => {
  try {
    const response = await axios.get('http://traum.groundkim.com:4000/influx/blackbox/list');
    blackboxList.value = response.data;
  } catch (error) {
    console.error('Failed to fetch blackbox list', error);
  }
};

const selectBlackbox = (blackbox) => {
  selectedBlackbox.value = blackbox;
};

const startBlackbox = async () => {
  if (!selectedBlackbox.value) return;

  const serialNumber = selectedBlackbox.value.split('-').pop();
  try {
    await axios.post(`http://traum.groundkim.com:4000/blackbox/start/${serialNumber}`);
    connectMQTT();
  } catch (error) {
    console.error('Failed to start blackbox', error);
  }
};

const connectMQTT = () => {
  const client = mqtt.connect('ws://traum.groundkim.com:1883');

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
  });

  client.on('error', (error) => {
    console.error('MQTT connection error', error);
  });
};

const increaseSpeed = () => {
  // 속도 증가 로직
  console.log('Increase speed');
};

const pauseBlackbox = () => {
  // 일시 정지 로직
  console.log('Pause');
};

onMounted(fetchBlackboxList);
</script>

<style scoped>
nav {
  height: 50px;
  background-color: #333;
  color: white;
  text-align: center;
  line-height: 50px;
}

.main-content {
  display: flex;
}

.sidebar {
  width: 300px;
  background-color: #f0f0f0;
  padding: 10px;
}

.dashboard {
  flex-grow: 1;
  padding: 10px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px;
  cursor: pointer;
}
</style>
