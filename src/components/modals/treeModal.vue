<template>
  <div>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    />
    <button
      class="text-xl bg-color3 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      v-on:click="toggleModal()"
    >
      <i class="fas fa-cog mr-2"></i>
    </button>
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="top: 0; left: 0; right: 0; bottom: 0"
    >
      <div>
        <!--content 모달창의 크기조절 위치-->
        <div class="bg-white" style="width: 1000px">
          <!--header-->
          <div class="flex items-center justify-between p-5">
            <h3 class="text-3xl font-semibold">설비명 {{ name }}</h3>
            <button
              class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              v-on:click="toggleModal()"
            >
              <span
                class="text-5xl bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
              >
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div>
            <p class="my-4 text-blueGray-500 text-lg leading-relaxed"></p>

            <div class="flex flex-col">
              <canvas ref="bjsCanvas" style="width: 100%; height: 400px"></canvas>
              <div class="flex" v-for="key in settings" :key="key">
                <label>{{ key }}</label>
                <input v-model="props.item[key]" />
              </div>
            </div>
          </div>
          <!--footer-->
          <div
            class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
          >
            <button
              class="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              v-on:click="handleModal()"
            >
              Apply
            </button>
            <button
              class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              v-on:click="toggleModal()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import {
  Engine,
  Scene,
  HemisphericLight,
  ArcRotateCamera,
  Vector3,
  SceneLoader
} from '@babylonjs/core'
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const bjsCanvas = ref(null)
    let engine, scene, camera
    const createScene = (canvas) => {
      engine = new Engine(canvas, true, { stencil: true })
      scene = new Scene(engine)
      camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene)
      camera.attachControl(canvas, true)
      new HemisphericLight('light', new Vector3(0, 1, 0), scene)
      engine.runRenderLoop(() => {
        scene.render()
      })

      window.addEventListener('resize', () => {
        engine.resize()
      })

      return scene
    }

    // console.log('Modal에서 받은 props.data: ', props.data)
    const showModal = ref(false)
    const toggleModal = () => {
      showModal.value = !showModal.value
    }
    const handleModal = () => {
      emit('setCondition', props.item)
      toggleModal()
    }

    const { name, mqttTopic, threshold } = props.item
    console.log(props.item)

    watch(showModal, (newValue) => {
      if (newValue) {
        nextTick(() => {
          scene = createScene(bjsCanvas.value)
          SceneLoader.ImportMesh('', './models/', `${name}R.glb`, scene, function (meshes) {
            meshes.forEach((mesh) => {
              mesh.scaling = new Vector3(0.3, 0.3, 0.3) // x, y, z 축으로 2배 확대
            })
          })
        })
      } else {
        if (engine) {
          engine.dispose()
        }
      }
    })
    const settings = ref(['mqttTopic', 'threshold'])

    return {
      showModal,
      toggleModal,
      handleModal,
      mqttTopic,
      threshold,
      props,
      name,
      bjsCanvas,
      settings
    }
  }
}
</script>
