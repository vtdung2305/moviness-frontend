<script setup lang="ts">
import { PropType } from 'vue'
import { IVideo } from '@/interfaces/video'
import { timeDuration } from '@/helper/number'
import { useUser } from '@/stores/user'
import { ImageDefaultEnum } from '@/constants/image'

const { t } = useLang()
const props = defineProps({
  planVideo: {
    type: Object as PropType<IVideo>,
    default: () => {},
  },
})

const emit = defineEmits(['delete-video'])

const userStore = useUser()

const imageUrl = computed(() => {
  if (props.planVideo.thumbnail_url)
    return props.planVideo.thumbnail_url
  return ImageDefaultEnum.IMAGE_VIDEO_DEFAULT
})

const editVideo = () => {}

const deleteVideo = () => {
  emit('delete-video', props.planVideo.id)
}
</script>

<template>
  <div
    v-if="planVideo"
    class="video-item flex items-center mt-4 flex-col px-15px tablet:flex-row tablet:pl-22px tablet:pr-15px py-16px cursor-pointer mb-24px <tablet:items-start"
  >
    <div class="flex flex-1 order-2 tablet:order-1">
      <div
        class="flex items-center video-item__info pl-10px pr-0 tablet:pr-20px <tablet:mt-4 items-center"
      >
        <div
          class="video-item__drapper mr-38px cursor-none"
          :class="`${
            !planVideo.is_required ? 'handle' : ''
          }`"
        >
          <span
            class="icon-icon-drap text-36px <table:text-20px"
            :class="`${
              planVideo.is_required
                ? 'cursor-not-allowed'
                : ''
            }`"
          ></span>
        </div>
        <h3
          class="video-item__title text-22px leading-26px font-bold"
        >
          {{ planVideo.name }}
        </h3>
      </div>
    </div>
    <div class="order-1 tablet:order-2 color">
      <div
        class="video-item__thumnail relative flex w-full h-155px tablet:w-273px"
      >
        <img
          :src="imageUrl"
          alt=""
          class="w-full rounded-16px object-cover"
        />
        <span
          class="video-item__time text-16px leading-24px text-center px-8px h-24px absolute bottom-8px right-8px rounded-4px"
        >
          {{ timeDuration(planVideo.time_length) }}
        </span>
      </div>
    </div>
    <div class="order-2 ml-15px <tablet:order-12">
      <div
        class="video-item__action <tablet:flex <tablet:flex <tablet:mt-15px"
      >
        <nuxt-link
          v-if="planVideo.can_edit"
          :to="`/app/${userStore.roleName}/videos/${planVideo.id}/edit`"
          target="_blank"
        >
          <div
            class="block cursor-pointer p-5px mb-10px hover:opacity-60"
            @click="editVideo"
          >
            <span class="icon-edit text-18px"></span>
          </div>
        </nuxt-link>
        <div
          v-if="!planVideo.is_required"
          class="block cursor-pointer p-5px hover:opacity-60 <tablet:pl-30px"
          @click="deleteVideo"
        >
          <span class="icon-trash text-18px"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/sass/_variables.scss';

.video-item {
  background: $color-white-2;
  border-radius: 24px;
  filter: drop-shadow(0px 5px 5px rgba(51, 51, 51, 0.05));
  background: $color-white-2;
  cursor: pointer;
  margin-top: 0px;

  &__youtube {
    background-color: $color-red-1;
    color: $color-white-2;
  }

  &__order {
    background: $color-shinseido;
    line-height: unset;

    &.trainer {
      background: $color-trainer;
    }

    &.kanrisha {
      background: $color-kanrisha;
    }
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &__time {
    color: $color-white;
    background-color: $color-gray-2;
  }

  &__checkpoint {
    color: $color-gray-2;
  }

  &__action {
    span {
      &.icon-edit {
        color: $color-shinseido;
      }

      &.icon-trash {
        color: $color-red-1;
      }
    }
  }
}
</style>
