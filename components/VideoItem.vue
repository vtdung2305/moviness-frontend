<script lang="ts" setup>
import { converSencondToMinuteSecond } from '@/helper/time'
const router = useRouter()

// micro compiler
const props = defineProps({
  videoData: {
    type: Object,
    default: () => {},
  },
})

// lifecycle
onMounted(() => {})

const onPlay = (id: number | string) => {
  router.push('/app/shinseido/videos/' + id)
}
</script>

<template>
  <div
    class="video-item flex mt-4"
    @click="onPlay(videoData.id)"
  >
    <div class="video-item__info flex-1">
      <h1>{{ videoData.name }}</h1>
      <p class="mt-4">
        <span class="icon-checkmark-outline mr-2" />
        {{
          $t(
            'components.video.item_list.checkpoint_number'
          )
        }}:
        {{ videoData.number_check_point }}
        {{
          $t(
            'components.video.item_list.checkpoint_number_unit'
          )
        }}
      </p>
    </div>
    <div class="video-item__thumnail relative flex">
      <img
        alt=""
        class="w-273px h-154px !<tablet:h-auto <tablet:w-160px"
        :src="
          videoData.thumbnail_url ||
          '/images/img_default.png'
        "
      />
      <label class="absolute">
        {{
          videoData.time_length
            ? converSencondToMinuteSecond(
                videoData.time_length
              )
            : '00:00'
        }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.video-item {
  background: $color-white-2;
  padding: 16px;
  border-radius: 24px;
  filter: drop-shadow(0px 5px 5px rgba(51, 51, 51, 0.05));
  cursor: pointer;
  margin-top: 0px;
}

.video-item__info {
  margin-right: 36px;

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: $font-20;
    line-height: $font-24;
    color: $color-black-1;
    margin-top: 1.4375rem;
    margin-left: 1.4375rem;
    @media screen and (max-width: $screen-mobile) {
      font-size: $font-14;
      line-height: $font-14;
    }
  }

  p {
    font-style: normal;
    font-weight: 700;
    font-size: $font-14;
    line-height: $font-14;
    color: $color-gray-2;
    margin-left: 1.4375rem;
    @media screen and (max-width: $screen-mobile) {
      font-size: $font-10;
      line-height: $font-10;
    }
  }
}

.video-item__thumnail {
  img {
    object-fit: cover;
    border-radius: 16px;
    background: $color-white-2;
  }

  .absolute {
    font-size: $font-16;
    font-weight: 500;
    line-height: 24px;
    font-style: normal;
    letter-spacing: 0.08px;
    color: $color-white;
    bottom: 8px;
    right: 8px;
    width: 72px;
    height: 24px;
    border-radius: 4px;
    background: #757578;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: $screen-mobile) {
      font-size: $font-14;
      line-height: $font-10;
    }
  }
}

.time {
  font-style: normal;
  font-weight: 700;
  font-size: $font-14;
  line-height: $font-14;
  color: $color-gray-2;
  margin-left: 1.4375rem;
}
</style>
