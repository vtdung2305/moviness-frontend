<script lang="ts" setup>
import { useVideo } from '@/stores/video'
import { IParamsUploadVideo } from '@/interfaces/video'
import { ModalNameEnum } from '@/constants/modal'

const videoStore = useVideo()
const playerYoutube = ref<any>(null)
const playerFile = ref<any>(null)
const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()
const { uploadFile } = useUpload()
const { $showModal, $hiddenModal } = useNuxtApp()
const isSubmitError = ref<boolean>(false)

const {
  listBreadcrumbs,
  options,
  isLoading,
  userStore,
  checkPoints,
  srcURL,
  isSrcFromURL,
  RoleEnum,
} = useVideoEditConfirmation()

definePageMeta({
  layout: 'page',
})

onBeforeMount(() => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)

  if (!videoStore.videoEdit) {
    const id = route.params.id
    useRouter().replace(
      `/app/${userStore.roleName}/videos/${id}/edit`
    )
  }
})

const uploadVideo = async () => {
  const {
    name,
    isFromYoutube,
    urlYoutube,
    desciption,
    isFromFile,
  } = videoStore.videoEdit!

  const checkPoints = videoStore.checkPoints.map((el) => ({
    id: '',
    checkpoint_time: el.checkpoint_time,
    content: el.content,
  }))

  let urlUploadFile = ''

  if (videoStore.videoEdit?.file === null) {
    urlUploadFile = videoStore.videoDetail?.url as string
  } else if (isFromFile) {
    const urlFile = await uploadFile(
      videoStore.videoEdit?.file
    )
    if (urlFile === 'ERROR') return
    urlUploadFile = `${urlFile}`
  }

  let urlUploadThumbnail = ''

  if (
    typeof videoStore.videoEdit?.fileThumbnails === 'string'
  ) {
    urlUploadThumbnail = videoStore.videoEdit
      ?.fileThumbnails as string
  } else {
    const urlFile = await uploadFile(
      videoStore.videoEdit?.fileThumbnails
    )
    if (urlFile === 'ERROR') return
    urlUploadThumbnail = `${urlFile}`
  }

  const params: IParamsUploadVideo = {
    name,
    url: isFromYoutube
      ? (urlYoutube as string)
      : (urlUploadFile as string),
    type_video: isFromYoutube ? '2' : '1',
    content: desciption as string,
    time_length: Math.trunc(
      isFromYoutube
        ? playerYoutube.value.player.duration
        : playerFile.value.player.duration
    ),
    check_points: checkPoints,
    thumbnail: urlUploadThumbnail,
  }
  const id = route.params.id as string | number
  isLoading.value = true
  const result = await videoStore.editVideo(id, params)

  if (result) {
    isLoading.value = false
    isSubmitError.value = false
    $showModal(ModalNameEnum.ALERT_EDIT_VIDEO)
  } else {
    isSubmitError.value = true
  }
}

const onCloseAlert = () => {
  const id = route.params.id
  if (isSubmitError.value) {
    router.back()
  } else {
    videoStore.videoEdit = null
    videoStore.checkPoints = []
    $hiddenModal(ModalNameEnum.ALERT_EDIT_VIDEO)
    router.push(`/app/${userStore.roleName}/videos`)
  }
}

watch(videoStore, (newValue) => {
  if (newValue.timeCheckPoint) {
    if (videoStore.videoEdit?.isFromFile === 1) {
      const duration = playerFile.value.player.duration
      playerFile.value.player.play()
      const timeCheckPoin =
        Number(newValue.timeCheckPoint) > Number(duration)
          ? 0
          : newValue.timeCheckPoint
      playerFile.value.player.currentTime = timeCheckPoin
      videoStore.setTimeCheckPoint(0)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }

    if (videoStore.videoEdit?.isFromYoutube === 1) {
      const duration = playerYoutube.value.player.duration
      playerYoutube.value.player.play()
      const timeCheckPoin =
        Number(newValue.timeCheckPoint) > Number(duration)
          ? 0
          : newValue.timeCheckPoint
      playerYoutube.value.player.currentTime = timeCheckPoin
      videoStore.setTimeCheckPoint(0)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }
})
</script>

<template>
  <div>
    <PageWrapper class="flex-1 flex text-#333333">
      <PageBody class="flex-1 flex">
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-100%"
        />
        <template v-else>
          <PageSection
            class="flex-1 flex flex-col"
            :list-breadcrumbs="listBreadcrumbs"
            :title-page="
              $t(
                'pages.shinseido.video_edit_confirmation.title'
              )
            "
          >
            <div class="desktop:w-3/4">
              <div class="video-player">
                <p class="video-player__title mt-unset">
                  {{
                    $t('pages.shinseido.video_upload.name')
                  }}
                </p>
                <p class="video-player__desc">
                  {{ videoStore.videoEdit?.name }}
                </p>
                <p class="video-player__title mb-14px">
                  {{ $t('pages.user_detail.list_video') }}
                </p>
                <div>
                  <vue-plyr
                    v-if="!!srcURL && !isSrcFromURL"
                    ref="playerFile"
                    :key="videoStore.videoEdit?.name"
                    :options="options"
                  >
                    <video
                      controls
                      playsinline
                      :data-poster="
                        videoStore.videoEdit?.urlThumbnail
                      "
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
                    ref="playerYoutube"
                    :key="`${videoStore.videoEdit?.name}-youtube`"
                    :options="options"
                  >
                    <div class="plyr__video-embed">
                      <iframe
                        :src="srcURL!"
                        allowfullscreen
                        allowtransparency
                        :data-poster="
                          videoStore.videoEdit?.urlThumbnail
                        "
                      ></iframe>
                    </div>
                  </vue-plyr>
                </div>
                <p class="video-player__title pt-10px">
                  {{
                    $t(
                      'pages.shinseido.video_detail.status'
                    )
                  }}
                </p>
                <p class="video-player__desc">
                  {{ videoStore.videoEdit?.desciption }}
                </p>
              </div>

              <div class="checkpoint-list-basic">
                <p class="checkpoint-list-basic__title">
                  {{
                    $t(
                      'components.checkpoint_list_basic.title'
                    )
                  }}
                  ({{ videoStore.checkPoints?.length }}
                  {{
                    $t(
                      'components.checkpoint_list_basic.unit'
                    )
                  }})
                </p>
                <ul class="checkpoint-list-basic__list">
                  <li
                    v-for="(item, index) in checkPoints"
                    :key="index"
                  >
                    <p
                      class="checkpoint-item flex content-center items-center"
                    >
                      <label
                        class="checkpoint-item__position flex content-center items-center"
                        :class="userStore.roleName"
                      >
                        <span class="text-center">{{
                          item.index
                        }}</span>
                      </label>
                      <span
                        class="checkpoint-item__time text-left cursor-pointer"
                        :class="userStore.roleName"
                        @click="
                          videoStore.setTimeCheckPoint(
                            item.checkpoint_time || 0
                          )
                        "
                        >{{
                          item.checkpoint_time_conver
                        }}</span
                      >
                      <span
                        class="checkpoint-item__note text-left"
                        >{{ item.content }}</span
                      >
                      <slot></slot>
                    </p>
                  </li>
                </ul>
              </div>

              <div
                class="flex gap-41px mt-34px justify-center"
              >
                <Button
                  :theme="userStore.roleName"
                  type="outline"
                  @click="$router.back()"
                >
                  {{ $t('pages.user_registration.fix') }}
                </Button>
                <Button
                  :theme="userStore.roleName"
                  @click="uploadVideo()"
                >
                  {{ $t('components.button.save') }}
                </Button>
              </div>
            </div>
          </PageSection>
        </template>
      </PageBody>
    </PageWrapper>

    <ModalWrapper
      :id="ModalNameEnum.ALERT_EDIT_VIDEO"
      content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
    >
      <div class="text-22px leading-22px font-bold title">
        {{ $t('others.title_modal_common') }}
      </div>
      <div class="text-16px leading-16px sub-title">
        {{ videoStore?.videoEdit?.name }}
        {{
          $t('pages.shinseido.video_edit.success_message')
        }}
      </div>
      <Button
        type="primary"
        class="w-280px h-52px"
        :theme="userStore.roleName"
        @click="onCloseAlert"
      >
        {{ $t('components.button.close') }}
      </Button>
    </ModalWrapper>
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
  // text-decoration: underline;
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
  line-height: $font-16;
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
