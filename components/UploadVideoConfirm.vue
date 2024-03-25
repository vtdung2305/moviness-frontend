<script lang="ts" setup>
import { ModalNameEnum } from '@/constants/modal'
import { RoleEnum } from '@/constants/role'
import { ICheckPoint } from '@/interfaces/video'
import { converSencondToMinuteSecond } from '@/helper/time'

interface IDataVideoProps {
  name: string
  urlVideo: string
  desciption: string
  checkPoints: ICheckPoint[]
  pathImage: string
}

const props = defineProps({
  dataVideo: {
    type: Object as () => IDataVideoProps,
    default: undefined,
  },
  actionClose: {
    type: Function,
    default: () => {},
  },
  actionSubmit: {
    type: Function,
    default: () => {},
  },
  isUrlYoutube: {
    type: Boolean,
    default: false,
  },
})

const player = ref<any>(null)
const isLoading = ref<boolean>(false)
const { $showModal, $hiddenModal } = useNuxtApp()
const router = useRouter()

onBeforeMount(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
})

const actionClose = () => {
  props.actionClose()
}

const actionSubmit = async () => {
  isLoading.value = true
  document
    .getElementsByClassName('breadcrumb')[0]
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  await props.actionSubmit()
  isLoading.value = false
  $showModal(ModalNameEnum.ALERT_EDIT_VIDEO)
}

const onCloseAlert = () => {
  $hiddenModal(ModalNameEnum.ALERT_EDIT_VIDEO)
  router.push(`/app/${RoleEnum.ADMINISTRANTOR}/videos`)
}

const playVideo = (checkPointTime: number) => {
  const duration = player.value.player.duration
  player.value.player.play()
  const timeCheckPoin =
    Number(checkPointTime) > Number(duration)
      ? 0
      : checkPointTime
  player.value.player.currentTime = timeCheckPoin
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}

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
  ],
})
</script>

<template>
  <div
    class="desktop:w-3/4"
    :class="isLoading ? 'opacity-80' : 'opacity-100'"
  >
    <div class="video-player">
      <p class="video-player__title mt-unset">
        {{ $t('pages.shinseido.video_confirm.name') }}
      </p>
      <p class="video-player__desc">
        {{ dataVideo?.name }}
      </p>
      <p class="video-player__title mb-14px">
        {{ $t('pages.user_detail.list_video') }}
      </p>
      <div>
        <vue-plyr
          v-if="!!isUrlYoutube"
          ref="player"
          :options="options"
        >
          <div class="plyr__video-embed">
            <iframe
              :src="dataVideo?.urlVideo"
              allowfullscreen
              allowtransparency
              :data-poster="dataVideo?.pathImage"
            ></iframe>
          </div>
        </vue-plyr>
        <vue-plyr v-else ref="player" :options="options">
          <video
            controls
            playsinline
            :data-poster="dataVideo?.pathImage"
          >
            <source
              :src="dataVideo?.urlVideo"
              size="720"
              type="video/mp4"
            />
          </video>
        </vue-plyr>
      </div>
      <p class="video-player__title pt-10px">
        {{ $t('pages.shinseido.video_detail.status') }}
      </p>
      <p class="video-player__desc">
        {{ dataVideo?.desciption }}
      </p>
    </div>

    <div class="mb-23px mt-25px">
      <PreviewImage
        is-show
        :path-image="dataVideo?.pathImage"
      />
    </div>

    <div class="checkpoint-list-basic">
      <p class="checkpoint-list-basic__title">
        {{ $t('components.checkpoint_list_basic.title') }}
        ({{ dataVideo?.checkPoints.length }}
        {{ $t('components.checkpoint_list_basic.unit') }})
      </p>
      <ul class="checkpoint-list-basic__list">
        <li
          v-for="(item, index) in dataVideo?.checkPoints"
          :key="index"
        >
          <p
            class="checkpoint-item flex content-center items-center"
          >
            <label
              class="checkpoint-item__position flex content-center items-center"
              :class="RoleEnum.ADMINISTRANTOR"
            >
              <span class="text-center">{{
                index + 1
              }}</span>
            </label>
            <span
              class="checkpoint-item__time text-left cursor-pointer"
              :class="RoleEnum.ADMINISTRANTOR"
              @click="playVideo(item.checkpoint_time)"
              >{{
                converSencondToMinuteSecond(
                  item.checkpoint_time
                )
              }}</span
            >
            <span class="checkpoint-item__note text-left">{{
              item.content
            }}</span>
            <slot></slot>
          </p>
        </li>
      </ul>
    </div>

    <div class="flex gap-41px mt-34px justify-center">
      <Button
        :theme="RoleEnum.ADMINISTRANTOR"
        type="outline"
        @click="actionClose()"
      >
        {{ $t('pages.user_registration.fix') }}
      </Button>
      <Button
        :theme="RoleEnum.ADMINISTRANTOR"
        @click="actionSubmit()"
      >
        {{ $t('components.button.addition') }}
      </Button>
    </div>
  </div>
  <ModalWrapper
    :id="ModalNameEnum.ALERT_EDIT_VIDEO"
    content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
  >
    <div class="text-22px leading-22px font-bold title">
      {{ $t('others.title_modal_common') }}
    </div>
    <div class="text-16px leading-16px sub-title">
      {{ dataVideo?.name }}
      {{ $t('pages.shinseido.video_edit.success_message') }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="RoleEnum.ADMINISTRANTOR"
      @click="onCloseAlert"
    >
      {{ $t('components.button.close') }}
    </Button>
  </ModalWrapper>
  <Loading
    v-if="isLoading"
    class="absolute w-full h-screen top-0 left-0"
  />
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

  &.mt-unset {
    margin-top: unset;
  }
}

.video-player__desc {
  font-size: $font-16;
  font-weight: normal;
  line-height: $font-24;
  font-style: normal;
  text-align: left;
  color: $color-gray-1;
  margin-top: 16px;
  white-space: pre-wrap;
}

.checkpoint-list-basic__title {
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  text-align: left;
  color: $color-gray-1;
  margin-top: 40px;
}

.checkpoint-list-basic__list {
  margin-top: 4px;
}
.checkpoint-item {
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  text-align: left;
  color: $color-white-2;
  border-bottom: 1px solid $color-gray-3;
  padding: 8px 0;
}

.checkpoint-item__position {
  min-width: 32px;
  height: 32px;
  border-radius: 100%;
  margin-right: 16px;
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  color: $color-white-2;

  &.shinseido {
    background: $color-shinseido;
  }

  &.kanrisha {
    background: $color-kanrisha;
  }

  &.trainer {
    background: $color-trainer;
  }

  span {
    width: 32px;
  }
}

.checkpoint-item__time {
  font-size: $font-14;
  font-weight: 500;
  line-height: $font-14;
  font-style: normal;
  //text-decoration: underline;
  margin-right: 15px;
  min-width: 45px;
  letter-spacing: 0.08em;

  &.shinseido {
    color: $color-shinseido;
    border-bottom: 1px solid $color-shinseido;
  }

  &.kanrisha {
    color: $color-kanrisha;
    border-bottom: 1px solid $color-kanrisha;
  }

  &.trainer {
    color: $color-trainer;
    border-bottom: 1px solid $color-trainer;
  }
}

.checkpoint-item__note {
  font-size: $font-16;
  font-weight: 500;
  line-height: $font-24;
  font-style: normal;
  color: $color-gray-1;
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}
.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}
</style>
