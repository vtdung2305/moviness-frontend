<script setup lang="ts">
import { PropType } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleDate = (modelData: string) => {
  emit('update:modelValue', modelData)
}

const date = ref(props.modelValue)
const timezones = ref(['Asia/Tokyo'])

// In case of a range picker, you'll receive [Date, Date]
const format = (date: Date[]) => {
  return date
    .map(
      (e) =>
        `${e.getFullYear()}年${
          e.getMonth() + 1
        }月${e.getDate()}日`
    )
    .join('ー')
}

// For demo purposes disables the next 2 days from the current date
const disabledDates = computed(() => {
  const today = new Date()

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const afterTomorrow = new Date(tomorrow)
  afterTomorrow.setDate(tomorrow.getDate() + 1)

  return [tomorrow, afterTomorrow]
})

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    date.value = newVal
  }
)
</script>

<template>
  <div class="date-picker">
    <VueDatePicker
      v-model="date"
      range
      multi-calendars
      multi-calendars-solo
      locale="ja"
      :cancel-text="$t('others.cancel_picker')"
      :select-text="$t('others.select_picker')"
      :format="format"
      :month-change-on-scroll="false"
      :partial-range="false"
      :disabled-dates="(date) => date >= new Date()"
      :enable-time-picker="false"
      @update:model-value="handleDate"
    >
      <template #input-icon>
        <span class="icon-calendar-event"></span>
      </template>
    </VueDatePicker>
  </div>
</template>

<style scoped lang="scss">
.date-picker {
  &:deep(.dp__input_wrap) {
    display: inline-block;
    width: 315px;

    @media screen and (max-width: $screen-mobile) {
      width: 100%;
    }

    .dp__input_icon {
      left: auto;
      right: 18px;
      top: 18px;
      font-size: 16px;
      color: $color-black;

      &_pad {
        padding-left: 10px;
      }
    }

    .dp__input {
      border: none;
      font-size: 14px;
      font-weight: bold;
      line-height: 24px;
      border: 1px solid $color-gray-1;
      border-radius: 12px;
      letter-spacing: 2px;
      padding: 3px 18px;

      @media screen and (max-width: $screen-mobile) {
        padding: 3px 10px;
      }

      @media screen and (max-width: 374px) {
        font-size: 12px;
      }
    }

    .dp__clear_icon {
      display: none;
    }
  }

  &:deep(.dp__calendar_header_item) {
    font-size: 14px;
    font-weight: 500;
    color: $color-gray-2;
  }

  &:deep(.dp__month_year_select) {
    font-size: 18px;
    font-weight: bold;
  }

  &:deep(.dp__range_between) {
    background-color: rgba(44, 171, 219, 0.37);
  }

  &:deep(.dp__cell_inner) {
    font-weight: bold;
    font-size: 16px;
  }

  // &:deep(.dp__range_start),
  // &:deep(.dp__range_end) {
  //   background-color: $color-kanrisha;
  //   border-radius: 50%;
  //   position: relative;
  //   z-index: 1;
  // }

  // &:deep(.dp__range_start) {
  //   &::before {
  //     content: '';
  //     background-color: rgba(44, 171, 219, 0.37);
  //     width: 100%;
  //     height: 100%;
  //     position: absolute;
  //     right: -1px;
  //     z-index: -1;
  //     border-top-left-radius: 50%;
  //     border-bottom-left-radius: 50%;
  //   }
  // }

  // &:deep(.dp__range_end) {
  //   &::after {
  //     content: '';
  //     background-color: rgba(44, 171, 219, 0.37);
  //     width: 100%;
  //     height: 100%;
  //     position: absolute;
  //     left: -1px;
  //     z-index: -1;
  //     border-top-right-radius: 50%;
  //     border-bottom-right-radius: 50%;
  //   }
  // }
}
</style>
