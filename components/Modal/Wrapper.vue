<script lang="ts" setup>
import { useCommon } from '@/stores'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  contentClass: {
    type: String,
    default: '',
  },
})

const { $hiddenModal } = useNuxtApp()
const commonStore = useCommon()

// const hideModal = () => {
//   $hiddenModal(props.id)
//   commonStore.setStatusModal(false)
// }
</script>
<template>
  <div
    v-show="isOpen"
    :id="id"
    class="trainsition modal-wrapper"
    :class="`${isOpen ? 'show' : 'hide'}`"
  >
    <div class="absolute background"></div>
    <div
      class="w-full max-w-lg p-3 relative mx-auto rounded-3xl shadow-lg bg-white"
      :class="contentClass"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trainsition {
  transition: 0.2s;
}

.show {
  display: block;
  opacity: 1;
}

.hide {
  display: none;
  opacity: 0;
}

.modal-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
}

.background {
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.1);
}
</style>
