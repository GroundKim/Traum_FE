<template>
  <div>
    <label for="mqtt-topic"></label>
    <select
      id="mqtt-topic"
      v-model="selected"
      @change="$emit('update:selected', selected)"
      class="form-select block w-full rounded-md"
    >
      <option value="" disabled>Please select a topic</option>
      <option v-for="topic in topicList" :key="topic" :value="'edge/sensor/' + topic">
        {{ topic }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    topicList: {
      type: Array,
      default: () => []
    },
    initialSelected: {
      type: String,
      default: ''
    }
  },
  emits: ['update:selected'],
  setup(props, { emit }) {
    const selected = ref(props.initialSelected)

    return {
      selected,
      props,
      emit
    }
  }
}
</script>
