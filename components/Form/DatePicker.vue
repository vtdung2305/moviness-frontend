<script setup lang="ts">
import DatePicker from 'vue-datepicker-next'
import { PropType } from 'vue'
import 'vue-datepicker-next/index.css'
import { FormatDateEnum } from '@/constants/common'
import lang from '@/constants/lang'

const props = defineProps({
  value: {
    type: [String, Array],
    default: '',
  },
  range: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: FormatDateEnum.FORMAT_NORMAL,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
})

const { formatDate } = useHelper()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const handleDate = (modelData: string) => {
  emit('update:value', modelData)
}

const { isSafari } = useHelper()

const date = ref(props.value)

watch(
  () => props.value,
  (newVal: any, oldVal: any) => {
    date.value = newVal
    if (newVal?.length) {
      const value = `${formatDate(
        newVal[0],
        FormatDateEnum.FORMAT_NORMAL
      )} - ${formatDate(
        newVal[1],
        FormatDateEnum.FORMAT_NORMAL
      )}`
      const inputDate = document.querySelector('.mx-input')
      inputDate?.setAttribute('value', value)
    }
  }
)

onMounted(() => {
  const inputDate = document.querySelector('.mx-input')
  inputDate?.setAttribute('inputmode', 'none')
})
</script>

<template>
  <div>
    <date-picker
      :default-value="date"
      :value="date"
      type="date"
      :format="format"
      :range="range"
      separator=" - "
      :disabled-date="disabled"
      :clearable="clearable"
      :lang="lang"
      :class="{ safari: isSafari }"
      @update:value="handleDate"
    >
      <template #icon-calendar>
        <span class="icon-calendar-event"></span>
      </template>
    </date-picker>
  </div>
</template>

<style lang="scss" scoped>
:deep(.mx-input) {
  border-color: $color-gray-1;
  border-radius: 12px;
  color: $color-gray-1;
  font-weight: bold;
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 24px;
  padding: 3px 18px;
  height: 32px;
  cursor: pointer;
  color: transparent;
  text-shadow: 0 0 0 #333;

  &:focus {
    outline: none;
    pointer-events: none;
    caret-color: transparent;
  }

  @media screen and (max-width: $screen-mobile) {
    letter-spacing: 0.5px;
    font-size: 16px;
  }

  // @media screen and (min-color-index: 0) and(-webkit-min-device-pixel-ratio:0) {
  //   font-size: 12.5px;
  //   letter-spacing: 0.8px;
  // }

  &-range {
    width: auto;
  }
}

:deep(.mx-icon-calendar) {
  color: $color-gray-1;
  right: 11px;
}

:deep(.mx-datepicker-range) {
  width: 315px;

  @media screen and (max-width: $screen-tablet) {
    margin-top: 15px;
  }

  @media screen and (max-width: $screen-mobile) {
    width: 100%;
  }
}

:deep(.mx-datepicker-range.safari .mx-input) {
  font-size: 13px;
  letter-spacing: 0.6px;

  @media screen and (max-width: $screen-mobile) {
    font-size: 16px;
    letter-spacing: 0;
    padding: 3px 10px;
    line-height: 32px;
    font-family: 'Noto Sans JP';
  }
}

:deep(.mx-datepicker-range.safari .mx-icon-calendar) {
  right: 8px;

  @media screen and (max-width: $screen-mobile) {
    margin-top: 1.5px;
  }
}
</style>
