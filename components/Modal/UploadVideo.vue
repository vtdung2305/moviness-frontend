<script lang="ts" setup>
import { ModalNameEnum } from '@/constants/modal'
import { converSencondToMinuteSecond } from '@/helper/time'
import { useCommon } from '@/stores'
import { useVideo } from '@/stores/video'
const props = defineProps({
  checkPointTime: {
    type: Number,
    default: 0,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  contentProps: {
    type: String,
    default: '',
  },
})

const formInput = reactive({
  content: '',
})

const videoStore = useVideo()
const commonStore = useCommon()
const { $hiddenModal } = useNuxtApp()

const contentComputed = computed(() => props.contentProps)
const checkPointTimeComputed = computed(
  () => props.checkPointTime
)

watch(contentComputed, (newValue) => {
  formInput.content = newValue
})

const addCheckPoint = () => {
  if (props.isEdit) {
    videoStore.replaceCheckPoint({
      checkpoint_time: props.checkPointTime,
      content: formInput.content,
    })
  } else {
    videoStore.addCheckPoint({
      checkpoint_time: props.checkPointTime,
      content: formInput.content,
    })
  }
  $hiddenModal(ModalNameEnum.UPLOAD_VIDEO)
  commonStore.setStatusModal(false)
}

const removeCheckPoint = () => {
  videoStore.removeCheckPoint({
    checkpoint_time: props.checkPointTime,
    content: formInput.content,
  })
  $hiddenModal(ModalNameEnum.UPLOAD_VIDEO)
  commonStore.setStatusModal(false)
}

const isOpenModal = computed(() => commonStore.showModal)

watch(isOpenModal, () => {
  if (props.isEdit) {
    formInput.content = props.contentProps
    return
  }
  formInput.content = ''
})

defineEmits(['hide-modal'])
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.UPLOAD_VIDEO"
    content-class="p-32px w-max flex flex-col gap pb-40px mt-25vh"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="text-16px leading-24px font-bold">
      {{ converSencondToMinuteSecond(checkPointTime) }}
    </div>
    <FormTextInput
      v-model="formInput.content"
      type-input="textarea"
      class-input="h-253px w-329px rounded-16px border-#d8d8db bg-#fcfbfa my-4"
      :placeholder="
        $t(
          'pages.shinseido.video_upload.placeholder_add_checkpoint'
        )
      "
    ></FormTextInput>
    <div class="flex gap-32px">
      <Button
        class-button="flex-1"
        :is-disabled="!formInput.content"
        @click="addCheckPoint"
      >
        {{
          $t(
            'pages.shinseido.video_upload.submit_add_checkpoint'
          )
        }}
      </Button>
      <Button
        v-if="isEdit"
        type="outline"
        class-button="!border-red-1000 !text-red-1000 flex-1"
        @click="removeCheckPoint"
      >
        {{
          $t(
            'pages.shinseido.video_upload.submit_remove_checkpoint'
          )
        }}
      </Button>
    </div>
    <div
      v-if="!isEdit"
      class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
      @click="$hiddenModal(ModalNameEnum.UPLOAD_VIDEO)"
    >
      {{ $t('components.button.cancel') }}
    </div>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
