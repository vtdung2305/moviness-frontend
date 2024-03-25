<script lang="ts" setup>
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  subMessage: {
    type: String,
    default: '',
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  route: {
    type: [String, Object],
    default: '',
  },
  buttonCancel: {
    type: String,
    default: '',
  },
  buttonSubmit: {
    type: String,
    default: 'components.button.close',
  },
})

const router = useRouter()
const { $hiddenModal } = useNuxtApp()
const emit = defineEmits(['click-submit'])

const handleClick = () => {
  try {
    $hiddenModal(props.id)
    if (props.route) {
      router.push(props.route)
    } else {
      emit('click-submit')
    }
  } catch (error) {}
}
const handleClickClose = () => {
  try {
    $hiddenModal(props.id)
  } catch (error) {}
}
</script>
<template>
  <ModalWrapper
    :id="id"
    content-class="px-56px py-40px w-11/12 tablet:max-w-392px mt-176px flex flex-col gap justify-center"
  >
    <div
      class="text-22px leading-22px font-bold title text-center"
    >
      {{ message }}
    </div>
    <div class="text-16px leading-24px sub-title">
      {{ subMessage }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="theme"
      @click="handleClick"
      >{{ $t(buttonSubmit) }}</Button
    >
    <div
      v-if="buttonCancel"
      class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
      @click="handleClickClose"
    >
      {{ $t(buttonCancel) }}
    </div>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
  white-space: break-spaces;
  text-align: justify;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
