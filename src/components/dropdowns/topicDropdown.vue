<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropdown-toggle">
      {{ selectedOption ? selectedOption.label : placeholder }}
    </button>
    <ul v-if="isOpen" class="dropdown-menu">
      <li v-for="option in options" :key="option.value" @click="selectOption(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'topicDropdown',
  props: {
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    }
  },
  setup(props, { emit }) {
    const isOpen = ref(false)
    const selectedOption = ref(null)

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const selectOption = (option) => {
      selectedOption.value = option
      isOpen.value = false
      emit('option-selected', option)
    }

    return {
      isOpen,
      selectedOption,
      toggleDropdown,
      selectOption
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: block;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
}

.dropdown-menu li {
  padding: 5px 15px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f5f5f5;
}
</style>