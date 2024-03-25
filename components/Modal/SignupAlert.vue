<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})
const router = useRouter()
const { $hiddenModal } = useNuxtApp()
const emit = defineEmits(['click'])
const onClick = () => {
  $hiddenModal(ModalNameEnum.FACILITY_SIGUP_ALERT)
  emit('click')
}
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.FACILITY_SIGUP_ALERT"
    content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
  >
    <div class="text-22px leading-24px font-bold title">
      {{ $t('others.title_modal_common') }}
    </div>
    <div class="text-16px leading-24px sub-title">
      {{ text }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="RoleEnum.ADMIN"
      @click="onClick"
      >{{ $t('components.button.close') }}</Button
    >
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

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
