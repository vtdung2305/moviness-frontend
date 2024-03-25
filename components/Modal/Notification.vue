<script lang="ts" setup>
import { ModalNameEnum } from '@/constants/modal'
const props = defineProps({
  message: {
    type: String,
    default: '',
  },
})

defineEmits(['hide-modal'])
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.NOTIFICATION"
    content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col gap modal-content"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="text-22px leading-22px font-bold title">
      {{ message }}
    </div>
    <slot></slot>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
:deep(.modal-content) {
  @media screen and (max-width: 450px) {
    padding: 32px;
  }
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
