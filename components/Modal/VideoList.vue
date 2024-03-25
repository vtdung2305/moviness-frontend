<script lang="ts" setup>
import { PropType } from 'vue'
import { ModalNameEnum } from '@/constants/modal'
import { useUser } from '@/stores/user'
import { IVideoItem } from '@/interfaces/video'
import { ImageDefaultEnum } from '@/constants/image'

const userStore = useUser()
const props = defineProps({
  videoList: {
    type: Array as PropType<IVideoItem[]>,
    default: () => [],
  },
  maxVideo: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['click-submit'])

const confirm = () => {
  $hiddenModal(ModalNameEnum.VIDEO_LIST)
  emit('click-submit', videoSelected.value)
  videoIds.value = []
}

const { $hiddenModal } = useNuxtApp()
const videoIds = ref<number[]>([])

const imageUrl = (video: IVideoItem) => {
  return video?.thumbnail_url
    ? video?.thumbnail_url
    : ImageDefaultEnum.IMAGE_VIDEO_DEFAULT
}

const videoSelected = computed(() => {
  return props.videoList.filter((e) =>
    videoIds.value.includes(e.id as number)
  )
})

const check = (videoId: number) => {
  const updatedValue: number[] = videoIds.value
  if (!updatedValue.includes(videoId)) {
    updatedValue.push(videoId)
  } else {
    updatedValue.splice(updatedValue.indexOf(videoId), 1)
  }
  videoIds.value = [...updatedValue]
}
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.VIDEO_LIST"
    content-class="p-32px flex flex-col gap pb-30px mt-10vh !max-w-none w-688px <tablet:w-90vw <tablet:w-max <tablet:!max-w-sm"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="px-25px py-8px <tablet:p-0">
      <div class="text-22px leading-24px font-bold">
        {{ $t('components.modal.video_list.heading') }}
      </div>
      <div class="modal-body">
        <div
          class="video-list mt-22px h-336px overflow-y-scroll"
        >
          <div
            v-for="(video, index) in videoList"
            :key="index"
            class="video-list__item flex items-center gap-x-12px py-16px px-14px"
          >
            <FormCheckbox
              :key="index"
              v-model="video.id"
              :list-checked="videoIds"
              :multiple-checkbox="true"
              :number-allow="maxVideo"
              @update-checked="check"
            />
            <div
              class="video-list__item__thumbnail w-100px mr-20px"
            >
              <img
                :src="imageUrl(video)"
                alt=""
                class="w-full rounded-5px"
              />
            </div>
            <div
              class="video-list__item__info w-[calc(100%-100px)]"
            >
              <div
                class="video-list__item__title text-16px leading-24px font-bold line-clamp-1"
              >
                {{ video.name }}
              </div>
              <div class="video-list__item__checkpoint">
                {{
                  $t(
                    'components.video.item_list.checkpoint_number'
                  )
                }}
                {{ video.number_check_point }}
                {{
                  $t(
                    'components.video.item_list.checkpoint_number_unit'
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-32px mt-36px">
        <Button
          type="outline"
          :theme="userStore.roleName"
          @click="$hiddenModal(ModalNameEnum.VIDEO_LIST)"
        >
          {{ $t('components.button.close') }}
        </Button>
        <Button
          type="primary"
          :theme="userStore.roleName"
          @click="confirm"
        >
          {{ $t('components.button.addition') }}
        </Button>
      </div>
    </div>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
.video-list {
  &__item {
    border-top: 1px solid $color-gray-3;

    &__title {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    &:last-child {
      border-bottom: 1px solid $color-gray-3;
    }
  }
}

:deep(.form-checkbox__icon) {
  font-size: 24px;
  width: 24px;
}

:deep(.form-checkbox__text) {
  margin-left: 0;
}
</style>
