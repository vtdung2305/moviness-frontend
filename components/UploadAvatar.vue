<script lang="ts" setup>
import { ImageDefaultEnum } from '@/constants/image'

const props = defineProps({
  modelValue: {
    type: [File, String],
    default: null,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  isFacility: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const { t } = useLang()

const fileInput = ref()
const message = ref('')

const handleUpdateValue = () => {
  fileInput.value.click()
}

const handleClickIcon = () => {
  if (!previewImage.value) {
    handleUpdateValue()
  } else {
    previewImage.value = ''
    emit('update:modelValue', null)
  }
}

const previewImage = ref('')

const avatarDisplay = computed(() => {
  if (props.isGroup) {
    return (
      previewImage.value ||
      ImageDefaultEnum.IMAGE_GROUP_DEFAULT
    )
  }
  if (props.isFacility) {
    return (
      previewImage.value ||
      ImageDefaultEnum.IMAGE_FACILITY_DEFAULT
    )
  }
  return (
    previewImage.value || '/images/avatar-default-2.png'
  )
})

const handleChangeImage = ($event: any) => {
  if ($event.target.files[0]) {
    const image = $event.target.files[0]
    if (!image.type.includes('image/')) {
      message.value = t(
        'components.upload_avatar.invalid_type'
      )
      return
    }
    if (image.size > 1024 * 1024 * 10) {
      message.value = t('components.upload_avatar.max_size')
      return
    }
    message.value = ''
    emit('update:modelValue', image)
  }
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      if (typeof props.modelValue === 'string') {
        previewImage.value = props.modelValue
      } else {
        previewImage.value = URL.createObjectURL(
          props.modelValue
        )
      }
    }
  }
)

onMounted(async () => {
  if (props.modelValue) {
    if (typeof props.modelValue === 'string') {
      previewImage.value = props.modelValue
    } else {
      previewImage.value = URL.createObjectURL(
        props.modelValue
      )
    }
  }
})
</script>
<template>
  <div class="flex flex-col">
    <div
      class="upload-avatar cursor-pointer relative"
      :class="{
        'pointer-events-none touch-none': isDisabled,
      }"
    >
      <div
        class="upload-avatar__image w-full h-full rounded-full overflow-hidden"
        @click="handleUpdateValue()"
      >
        <img
          alt="画像"
          :src="avatarDisplay"
          class="w-full h-full object-contain"
        />
      </div>
      <span
        class="upload-avatar__icon absolute bottom-0 right-0"
        :class="{
          'icon-plus-circled ': !previewImage,
          'icon-close-circle-outline': previewImage,
          disabled: isDisabled,
        }"
        @click="handleClickIcon"
      ></span>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleChangeImage($event)"
      />
    </div>
    <div v-if="message" class="error-text">
      {{ message }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.upload-avatar {
  width: 148px;
  height: 148px;

  @media screen and (max-width: $screen-tablet) {
    width: 96px;
    height: 96px;
  }

  &__image {
    background: $color-gray-3;
  }

  &__icon {
    font-size: 32px;
    background: -moz-linear-gradient(
      180deg,
      #ef8a94 0%,
      #f6b38e 100%
    );
    background: -webkit-linear-gradient(
      180deg,
      #ef8a94 0%,
      #f6b38e 100%
    );
    background: linear-gradient(
      180deg,
      #ef8a94 0%,
      #f6b38e 100%
    );
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.161));

    &.disabled {
      background: $color-gray-3 !important;
      -webkit-background-clip: text !important;
      -moz-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }
  }
}

.kanrisha {
  .upload-avatar {
    &__icon {
      font-size: 32px;
      background: -moz-linear-gradient(
        180deg,
        #2cabdb 0%,
        #8b9bce 100%
      );
      background: -webkit-linear-gradient(
        180deg,
        #2cabdb 0%,
        #8b9bce 100%
      );
      background: linear-gradient(
        180deg,
        #2cabdb 0%,
        #8b9bce 100%
      );
      -webkit-background-clip: text;
      -moz-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(
        0px 5px 10px rgba(0, 0, 0, 0.161)
      );
    }
  }
}

.shinseido {
  .upload-avatar {
    &__icon {
      font-size: 32px;
      background: -moz-linear-gradient(
        180deg,
        #56bdb0 0%,
        #5bc2da 100%
      );
      background: -webkit-linear-gradient(
        180deg,
        #56bdb0 0%,
        #5bc2da 100%
      );
      background: linear-gradient(
        180deg,
        #56bdb0 0%,
        #5bc2da 100%
      );
      -webkit-background-clip: text;
      -moz-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(
        0px 5px 10px rgba(0, 0, 0, 0.161)
      );
    }
  }
}

.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
  margin-top: 8px;
}
</style>
