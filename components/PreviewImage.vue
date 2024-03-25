<script lang="ts" setup>
import { helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { sizeUploadVideo } from '~~/constants/video'

interface dataImage {
  image: string
  file: any
}

const props = defineProps({
  errors: {
    type: Array,
    default: () => [],
  },
  pathImage: {
    type: String,
    default: '',
  },
  isShow: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'file-changed', data: any): void
  (event: 'url-changed', data: string): void
}>()

const { t } = useLang()
const buttonUploadThumbnails = ref<any>(null)
const thumbnails = reactive<dataImage>({
  image: '',
  file: '',
})
const message = ref('')

const isClosed = ref<boolean>(false)

const rules = computed(() => {
  return {
    maxSizeImage: {
      maxSizeImage: helpers.withParams(
        {
          message: t(
            'pages.shinseido.video_upload.thumbnails_empty'
          ),
        },
        () => {
          if (!thumbnails.file && !props.pathImage)
            return false
          if (
            validSize(thumbnails.file) ||
            !!props.pathImage
          ) {
            return true
          }
          return false
        }
      ),
    },
  }
})

const v$ = useValidate(rules, thumbnails as any)

const errorsComputed = computed(() => {
  return {
    maxSizeImage: v$.value.maxSizeImage.$errors,
  }
})

watch(thumbnails, (newValue) => {
  if (
    (!newValue.file && !newValue.image) ||
    (errorsComputed.value.maxSizeImage &&
      errorsComputed.value.maxSizeImage.length > 0)
  )
    return
  emit('file-changed', newValue.file)
  emit('url-changed', newValue.image)
})

const typeButton = computed(() => {
  if (
    (errorsComputed &&
      errorsComputed.value.maxSizeImage.length > 0) ||
    (props.errors && props.errors.length > 0) ||
    message.value
  ) {
    return 'outline-error'
  }
  if (!!props.pathImage || !!thumbnails.image) {
    return 'outline'
  }
  return 'primary'
})

const validSize = (
  file: File,
  maxSize = sizeUploadVideo
) => {
  return file.size < maxSize
}

const handleSelectFileImage = () => {
  buttonUploadThumbnails.value.value = null
  buttonUploadThumbnails.value.click()
}

const handleFileImageChange = async (event: any) => {
  thumbnails.image = ''
  const file = event.target.files[0]

  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    message.value = t(
      'components.upload_avatar.invalid_type'
    )
    return
  }
  message.value = ''

  const reader = new FileReader()
  reader.onload = () => {
    if (validSize(file)) {
      thumbnails.image = reader.result as string
    }
  }
  thumbnails.file = file
  reader.readAsDataURL(file)
  await v$.value.$validate()
}

const clickRemoveFileImage = () => {
  thumbnails.image = ''
  thumbnails.file = null
  isClosed.value = true
}
</script>

<template>
  <div v-if="!isShow">
    <template
      v-if="
        !!thumbnails.image ||
        (!!props.pathImage && !isClosed)
      "
    >
      <span class="label font-bold">
        {{ t('pages.shinseido.video_upload.show_image') }}
      </span>
      <div class="relative my-15px">
        <img
          :src="
            thumbnails.image ||
            (isClosed ? '' : props.pathImage)
          "
          class="w-full"
        />
        <div class="absolute top-2 right-2 z-10">
          <span
            class="icon-close cursor-pointer"
            @click="clickRemoveFileImage"
          ></span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex">
        <span class="label font-bold">
          {{
            t('pages.shinseido.video_upload.upload_image')
          }}
        </span>
        <span
          class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
        >
          {{ t('common.required') }}
        </span>
      </div>
      <div class="text-xs sub-upload mb-16px">
        {{
          t('pages.shinseido.video_upload.sub_upload_image')
        }}
      </div>
      <div
        class="text-sm font-bold sub_title_upload mb-15px"
      >
        <div>
          {{
            t(
              'pages.shinseido.video_upload.text_size_upload_image'
            )
          }}
        </div>
        <div>
          {{
            t(
              'pages.shinseido.video_upload.text_file_upload_image'
            )
          }}
        </div>
      </div>
    </template>
    <div class="flex gap-16px items-center">
      <Button
        :type="typeButton"
        class="bg-white w-328px"
        @click="handleSelectFileImage"
      >
        {{
          t('pages.shinseido.video_upload.button_import')
        }}</Button
      >
      <div class="text-xs font-medium">
        {{ t('pages.shinseido.video_upload.size_file') }}
      </div>
    </div>
    <span
      v-if="
        errorsComputed &&
        errorsComputed.maxSizeImage.length > 0
      "
      class="error-text font-medium"
    >
      {{ errorsComputed.maxSizeImage[0].$params.message }}
    </span>
    <span v-if="message" class="error-text font-medium">
      {{ message }}
    </span>
    <input
      ref="buttonUploadThumbnails"
      class="hidden"
      type="file"
      accept="image/png, image/jpg"
      @change="handleFileImageChange"
    />
  </div>
  <div v-else>
    <span class="label font-bold">
      {{ t('pages.shinseido.video_upload.show_image') }}
    </span>
    <div class="relative my-15px">
      <img :src="pathImage" class="w-full" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.text-validate {
  color: $color-red-1;
}

.icon-edit::before {
  color: $color-shinseido;
}

.sub-upload {
  line-height: 24px;
  font-weight: 500;
  color: $color-gray-1;
}

.sub_title_upload {
  line-height: 22px;
  color: $color-gray-1;
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
</style>
