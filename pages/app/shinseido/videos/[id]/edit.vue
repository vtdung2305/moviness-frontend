<script lang="ts" setup>
import { useVideo } from '@/stores/video'
import { converSencondToMinuteSecond } from '@/helper/time'
import { checkYouTubeUrl } from '@/helper/video'
import { RoleEnum } from '@/constants/role'

definePageMeta({
  layout: 'page',
})

const videoStore = useVideo()

const {
  listBreadcrumbs,
  options,
  formInput,
  isEditCheckPoint,
  contentCheckPointEdit,
  buttonUploadFile,
  linkYoutube,
  currentTime,
  playerYoutube,
  playerFile,
  errors,
  key,
  isLoading,
  changeFromYoutube,
  changeFromFile,
  editCheckPoint,
  addCheckPoint,
  clickRemoveFileVideo,
  handleFileChange,
  handleSelectFile,
  uploadVideo,
} = useVideoEdit()

watch(linkYoutube, (newValue) => {
  if (checkYouTubeUrl(newValue)) {
    key.value++
    formInput.isFromYoutube = 0
    setTimeout(() => {
      formInput.isFromYoutube = 1
      if (!newValue || !checkYouTubeUrl(newValue)) {
        formInput.urlYoutube = ''
        return
      }
      if (key.value > 1) {
        videoStore.resetCheckPoints()
      }
      formInput.urlYoutube = newValue
    }, 0)
  }
})

watch(videoStore, (newValue) => {
  setTimeout(() => {
    if (newValue.timeCheckPoint) {
      if (formInput?.isFromFile === 1) {
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

      if (formInput?.isFromYoutube === 1) {
        const duration = playerYoutube.value.player.duration
        playerYoutube.value.player.play()
        const timeCheckPoin =
          Number(newValue.timeCheckPoint) > Number(duration)
            ? 0
            : newValue.timeCheckPoint
        playerYoutube.value.player.currentTime =
          timeCheckPoin
        videoStore.setTimeCheckPoint(0)
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      }
    }
  }, 0)
})

const checkPoints = computed(() => {
  return videoStore.checkPoints.map((el, index) => ({
    ...el,
    index: index + 1,
    checkpoint_time_conver: converSencondToMinuteSecond(
      el.checkpoint_time
    ),
  }))
})
</script>

<template>
  <div>
    <div v-if="!isLoading">
      <PageWrapper class="flex-1 flex">
        <PageBody class="flex-1 flex">
          <PageSection
            class="flex-1 flex flex-col"
            :list-breadcrumbs="listBreadcrumbs"
            :title-page="
              $t('pages.shinseido.video_edit.title')
            "
          >
            <div class="desktop:w-3/4">
              <FormTextInput
                v-model="formInput.name"
                :errors="errors.name"
                :is-required="true"
                :label="
                  $t('pages.shinseido.video_upload.name')
                "
                :placeholder="
                  $t(
                    'pages.shinseido.video_upload.placeholder_name'
                  )
                "
              ></FormTextInput>
              <div
                class="flex flex-col my-40px form_upload"
              >
                <span class="label mb-23px font-bold">
                  {{
                    $t('pages.shinseido.video_edit.upload')
                  }}
                </span>
                <div
                  v-if="
                    (formInput.isFromFile &&
                      !!formInput.urlFile &&
                      [...errors.maxSize].length === 0) ||
                    (formInput.isFromYoutube &&
                      !!formInput.urlYoutube)
                  "
                  class="relative"
                >
                  <div class="absolute top-2 right-2 z-10">
                    <span
                      class="icon-close cursor-pointer"
                      @click="clickRemoveFileVideo"
                    ></span>
                  </div>
                  <vue-plyr
                    v-if="
                      formInput.isFromFile &&
                      !!formInput.urlFile
                    "
                    ref="playerFile"
                    :options="options"
                  >
                    <video
                      controls
                      playsinline
                      data-poster="poster.jpg"
                    >
                      <source
                        :src="formInput.urlFile"
                        size="720"
                        type="video/mp4"
                      />
                    </video>
                  </vue-plyr>
                  <vue-plyr
                    v-if="
                      formInput.isFromYoutube &&
                      !!formInput.urlYoutube
                    "
                    ref="playerYoutube"
                    :options="options"
                  >
                    <div class="plyr__video-embed">
                      <iframe
                        :src="formInput.urlYoutube"
                        allowfullscreen
                        allowtransparency
                      ></iframe>
                    </div>
                  </vue-plyr>
                </div>
                <div class="flex gap-2 w-max">
                  <span
                    v-if="
                      errors.maxSize &&
                      errors.maxSize.length > 0 &&
                      !!formInput.urlFile
                    "
                    class="error-text font-medium"
                  >
                    {{ errors.maxSize[0].$params.message }}
                  </span>
                  <FormCheckbox
                    v-if="
                      !formInput.urlFile && !linkYoutube
                    "
                    v-model="formInput.isFromFile"
                    :is-radio="true"
                    :text="
                      $t(
                        'pages.shinseido.video_upload.from_file'
                      )
                    "
                    @click="changeFromFile"
                  ></FormCheckbox>
                </div>
                <div class="flex gap-16px items-center">
                  <Button
                    :is-disabled="!formInput.isFromFile"
                    :type="
                      formInput.isFromFile &&
                      formInput.urlFile
                        ? 'outline'
                        : formInput.isFromFile &&
                          errors.urlFile.length > 0
                        ? 'outline-error'
                        : 'primary'
                    "
                    class="bg-white w-328px"
                    @click="handleSelectFile"
                  >
                    {{
                      $t(
                        'pages.shinseido.video_edit.button_import'
                      )
                    }}</Button
                  >
                  <div
                    v-if="
                      !!formInput.isFromFile &&
                      !formInput.urlFile
                    "
                    class="text-xs font-medium"
                  >
                    {{
                      $t(
                        'pages.shinseido.video_upload.size_file'
                      )
                    }}
                  </div>
                </div>
                <div class="w-max">
                  <FormCheckbox
                    v-model="formInput.isFromYoutube"
                    :is-radio="true"
                    :text="
                      $t(
                        'pages.shinseido.video_upload.from_youtube'
                      )
                    "
                    @click="changeFromYoutube"
                  ></FormCheckbox>
                </div>
                <FormTextInput
                  v-model="linkYoutube"
                  :errors="
                    formInput.isFromYoutube &&
                    errors.urlYoutube
                  "
                  :is-disabled="!formInput.isFromYoutube"
                  class="ml-35px"
                  :placeholder="
                    $t(
                      'pages.shinseido.video_upload.placeholder_import_yotube'
                    )
                  "
                ></FormTextInput>
              </div>
              <div class="mb-40px">
                <FormTextInput
                  v-model="formInput.desciption"
                  :is-required="true"
                  :errors="errors.desciption"
                  :label="
                    $t(
                      'pages.shinseido.video_upload.sub_task'
                    )
                  "
                  type-input="textarea"
                  class-input="h-105px"
                  :placeholder="
                    $t(
                      'pages.shinseido.video_upload.placeholder_subtak'
                    )
                  "
                ></FormTextInput>
              </div>
              <div class="mb-23px">
                <PreviewImage
                  :path-image="formInput.urlThumbnail"
                  :errors="errors.fileThumbnails"
                  @file-changed="
                    formInput.fileThumbnails = $event
                  "
                  @url-changed="
                    formInput.urlThumbnail = $event
                  "
                />
              </div>
              <div class="flex flex-col">
                <span class="label mb-10px font-bold">
                  {{
                    $t(
                      'pages.shinseido.video_upload.checkpoint'
                    )
                  }}
                </span>
                <div class="flex items-center">
                  <span class="text-xs font-medium">
                    {{
                      $t(
                        'pages.shinseido.video_upload.sub_task_checkpoint'
                      )
                    }}
                  </span>
                  <span
                    v-if="
                      errors.checkPoints &&
                      errors.checkPoints.length > 0
                    "
                    class="error-text font-medium mr-2"
                  >
                    {{
                      errors.checkPoints[0].$params.message
                    }}
                  </span>
                </div>
                <ul class="mx-20px">
                  <li
                    v-for="(item, index) in checkPoints"
                    :key="index"
                  >
                    <CheckpointItem :checkpoint="item">
                      <span
                        class="icon-edit ml-5px mt-8px cursor-pointer"
                        @click="
                          editCheckPoint(
                            item.checkpoint_time,
                            item.content
                          )
                        "
                      ></span>
                    </CheckpointItem>
                  </li>
                </ul>
                <Button
                  :is-disabled="
                    !formInput.urlFile &&
                    !formInput.urlYoutube
                  "
                  type="outline"
                  class="mt-13px mb-23px"
                  @click="addCheckPoint"
                >
                  <span
                    class="icon-plus-circle mr-8px"
                  ></span>
                  {{
                    $t(
                      'pages.shinseido.video_upload.add_checkpoint'
                    )
                  }}</Button
                >
                <Button @click="uploadVideo">
                  {{
                    $t(
                      'pages.shinseido.video_upload.submit'
                    )
                  }}
                </Button>
              </div>
              <ModalUploadVideo
                :is-edit="isEditCheckPoint"
                :check-point-time="currentTime"
                :content-props="contentCheckPointEdit"
              />
              <input
                ref="buttonUploadFile"
                class="hidden"
                type="file"
                accept="video/*"
                @change="handleFileChange"
              />
            </div>
          </PageSection>
        </PageBody>
      </PageWrapper>
    </div>
    <Loading
      v-if="isLoading"
      :theme="RoleEnum.ADMINISTRANTOR"
      class="h-100%"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../../assets/sass/_variables.scss';

.label {
  font-style: normal;
  font-weight: 700;
  font-size: $font-16;
  line-height: $font-16;
  color: $color-gray-1;
}
.form_upload > *:not(:first-child):not(:last-child) {
  margin-bottom: 15px;
}

.relative {
  position: relative;
}
.absolute {
  position: absolute;
}

.icon-close::before {
  background: $color-shinseido;
  color: white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3.5px 2.5px 3.5px 3.5px;
}

.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
}

.icon-edit::before {
  color: $color-shinseido;
}

:deep(.form-checkbox__icon) {
  border-radius: 50% 50%;
}
</style>
