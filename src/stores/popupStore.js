// stores/popupStore.js
import { defineStore } from 'pinia'

export const usePopupStore = defineStore('popup', {
  state: () => ({
    item: null
  }),
  actions: {
    setItem(item) {
      this.item = item
    },
    clearItem() {
      this.item = null
    }
  }
})
