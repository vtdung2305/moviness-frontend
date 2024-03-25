<script lang="ts" setup>
defineEmits(['hide-modal'])
</script>
<template>
  <div
    class="modal-common fixed w-screen h-screen top-0 left-0"
  >
    <slot />
    <div
      class="modal-common__overlay w-full h-full absolute inset-0"
      @click="$emit('hide-modal')"
    ></div>
  </div>
</template>
<style scoped lang="scss">
.modal-common {
  z-index: 10;

  &__overlay {
    background: rgba(51, 51, 51, 0.1);
  }
}
</style>
