<script setup lang="ts">
import { PropType } from 'vue'
import { IVideo } from '@/interfaces/video'
import { timeDuration } from '@/helper/number'
import { ImageDefaultEnum } from '@/constants/image'
import { VideoTypeEnum } from '@/constants/video'

const { t } = useLang()
const props = defineProps({
  planVideo: {
    type: Object as PropType<IVideo>,
    default: () => {},
  },

  number: {
    type: Number,
    default: 0,
  },
})

const { themeKanrisha } = useHelper()
const route = useRoute()

const imageUrl = computed(() => {
  if (props.planVideo.thumbnail_url)
    return props.planVideo?.thumbnail_url
  return ImageDefaultEnum.IMAGE_VIDEO_DEFAULT
})

const hasTypeYoutube = computed(
  () => props.planVideo.type_video === VideoTypeEnum.YOUTUBE
)

const numberVideo = computed(() => {
  if (props.number <= 9) return `0${props.number}`
  return props.number
})
</script>

<template>
  <NuxtLink
    :to="
      themeKanrisha
        ? `/app/kanrisha/plan/${route.params.id}/video/${planVideo.id}`
        : `/app/shinseido/videos/${planVideo.id}`
    "
  >
    <div
      class="video-item flex mt-4 flex-col tablet:flex-row px-18px py-17px cursor-pointer mb-24px"
    >
      <div class="flex-1 order-2 tablet:order-1">
        <div
          class="video-item__info pl-10px pr-0 tablet:pr-68px"
        >
          <div
            class="video-item__order w-35px h-35px text-14px rounded-full inline-flex justify-center items-center text-white font-bold mb-10px mt-10px"
          >
            {{ numberVideo }}
          </div>
          <span
            v-if="hasTypeYoutube"
            class="video-item__youtube inline-block text-14px leading-24px font-bold rounded-12px ml-17px px-13px py-3px"
          >
            {{ $t('pages.plan_detail.youtube') }}
          </span>
          <h3
            class="video-item__title text-20px leading-26px font-bold"
          >
            {{ planVideo.name }}
          </h3>
          <p
            class="video-item__checkpoint text-14px leading-24px font-bold mt-11px"
          >
            <span class="mr-2">
              <i class="icon-checkmark-outline"></i>
            </span>
            {{ $t('pages.plan_detail.check_point') }}
            {{ planVideo.number_check_point }}
            {{ $t('others.unit') }}
          </p>
        </div>
      </div>
      <div class="order-1 tablet:order-2 color">
        <div
          class="video-item__thumnail relative flex w-full h-155px tablet:w-275px"
        >
          <img
            class="w-full rounded-16px object-cover"
            :src="imageUrl"
            alt=""
          />
          <span
            class="video-item__time text-16px leading-24px text-center px-8px h-24px absolute top-4px right-4px rounded-16px"
          >
            {{ timeDuration(planVideo.time_length) }}
          </span>
          <span class="video-item__copyright">
            {{ $t('components.footer.video_copyright') }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
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

  &__copyright {
    position: absolute;
    font-size: $font-10;
    color: $color-white;
    bottom: 4px;
    right: 4px;
  }

  &__checkpoint {
    color: $color-gray-2;
  }
}

.disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
