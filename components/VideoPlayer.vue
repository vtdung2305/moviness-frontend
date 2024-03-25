<script lang="ts" setup>
import { useMq } from 'vue3-mq'
import { isVideoFromYoutube } from '@/helper/video'
import { IVideo } from '@/interfaces/video'
import { useVideo } from '@/stores/video'
import { MobileDeviceList } from '@/constants/mediascreen'

const props = defineProps({
  videoData: {
    type: Object as () => IVideo,
    default: null,
  },
  className: {
    type: String,
    default: 'w-[75vw] <desktop:max-w-full',
  },
  scroll: {
    type: Boolean,
    default: true,
  },
})

const videoStore = useVideo()

const offsetTopElement = ref()
const offsetWidthElement = ref()
const elTop = ref()
const mq = useMq()
const heightDocument = ref()

watch(videoStore, (newValue) => {
  const duration = player.value.player.duration
  if (newValue.timeCheckPoint) {
    player.value.player.play()
    const timeCheckPoin =
      Number(newValue.timeCheckPoint) > Number(duration)
        ? 0
        : newValue.timeCheckPoint
    player.value.player.currentTime = timeCheckPoin
    videoStore.setTimeCheckPoint(0)
    if (props.scroll) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }
})

watch(heightDocument, (newValue) => {
  const elePlayer = document.getElementById('videoPlayer')
  if (elePlayer) {
    elTop.value =
      elePlayer.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top
  }
})

const options = ref({
  autoplay: false,
  muted: false,
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen',
  ],
})

const player = ref<any>(null)

const srcURL = computed(() => {
  return props.videoData?.url_video
})

const isSrcFromURL = computed(() => {
  return isVideoFromYoutube(props.videoData?.url_video)
})

const scrollTo = () => {
  heightDocument.value = document.body.scrollHeight

  const elPalyer = document.getElementById('videoPlayer')
  const elInfo = document.getElementById('videoInfo')
  if (!offsetWidthElement.value) {
    offsetWidthElement.value = elPalyer?.offsetWidth
  }

  if (MobileDeviceList.includes(mq.current)) {
    if (elPalyer && elInfo && !props.scroll) {
      if (
        document.documentElement.scrollTop > elTop.value
      ) {
        elPalyer.classList.add('videoFixed')
        if (mq.current === 'md') {
          elPalyer.classList.add('hasRight')
          elPalyer.style.width = `${screen.width / 2}px`
        } else {
          elPalyer.style.width = `${offsetWidthElement.value}px`
        }
      } else {
        elPalyer.classList.remove('videoFixed')
        elPalyer.classList.remove('hasRight')
        elPalyer.removeAttribute('style')
        elInfo.removeAttribute('style')
      }
    }
  }
}

onMounted(() => {
  const html = document.querySelector('html')
  const elePlayer = document.getElementById('videoPlayer')
  const elInfo = document.getElementById('videoInfo')
  const hasVideoHeightVariable = !!getComputedStyle(
    document.documentElement
  ).getPropertyValue('--top-video-height')

  if (elePlayer) {
    if (!hasVideoHeightVariable && html) {
      setTimeout(() => {
        html.style.setProperty(
          `--top-video-height`,
          mq.current === 'md'
            ? `${elePlayer.offsetHeight / 2}px`
            : `${elePlayer.offsetHeight}px`
        )
      }, 1100)
    }

    elTop.value =
      elePlayer.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top
  }
  window.addEventListener('scroll', scrollTo)

  window.addEventListener('resize', (event) => {
    if (!MobileDeviceList.includes(mq.current))
      if (elePlayer && elInfo) {
        elePlayer.classList.remove('videoFixed')
        elePlayer.removeAttribute('style')
        elInfo.removeAttribute('style')
      }
  })
})
</script>

<template>
  <div class="video-player">
    <div id="videoPlayer" class="video-player__container">
      <div class="flex justify-center items-center">
        <div :class="` ${className}`">
          <vue-plyr
            v-if="!!srcURL && !isSrcFromURL"
            ref="player"
            :key="props.videoData?.id"
            :options="options"
          >
            <video
              controls
              playsinline
              :data-poster="props.videoData?.thumbnail_url"
            >
              <source
                size="720"
                :src="srcURL"
                type="video/mp4"
              />
            </video>
          </vue-plyr>
          <vue-plyr
            v-else
            ref="player"
            :key="`${props.videoData?.id}-youtube`"
            :options="options"
          >
            <div class="plyr__video-embed">
              <iframe
                title=""
                :src="srcURL"
                allowfullscreen
                allowtransparency
                :data-poster="
                  props.videoData?.thumbnail_url
                "
              ></iframe>
            </div>
          </vue-plyr>
        </div>
      </div>
    </div>
    <div
      id="videoInfo"
      class="video-player__info transition"
    >
      <p class="video-player__title">
        {{ $t('pages.shinseido.video_detail.status') }}
      </p>
      <p class="video-player__desc">
        {{ videoData?.content }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.video-player__title {
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  text-align: left;
  color: $color-gray-1;
  margin-top: 25px;
}

.video-player__desc {
  font-size: $font-16;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: $color-gray-1;
  margin-top: 16px;
  line-height: 24px;
  white-space: pre-wrap;
}

.videoFixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  margin: auto;
  overflow-y: scroll;

  &.hasRight {
    left: auto;
  }

  + .video-player__info {
    padding-top: var(--top-video-height);
  }
}
</style>
