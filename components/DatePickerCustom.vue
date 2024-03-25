<script setup lang="ts">
import moment from 'moment'
const { t } = useLang()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  calculatorOld: {
    type: Boolean,
    default: false,
  },
  required: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Object,
    default: null,
  },
  errorsYear: {
    type: Array,
    default: () => [],
  },
  errorsMonth: {
    type: Array,
    default: () => [],
  },
  errorsDay: {
    type: Array,
    default: () => [],
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const dayStr = t('components.datepicker.day')
const monthStr = t('components.datepicker.month')
const yearStr = t('components.datepicker.year')
const year = ref()
const month = ref()
const day = ref('')
const yearList = ref()
const monthList = ref()
const dayList = ref()

const age = computed(() => {
  if (!year.value) {
    return t('others.empty')
  }
  const currentYear = year.value.replace(yearStr, '')
  const currentMonth = month.value
    ? month.value.replace(monthStr, '')
    : '1'
  const currentDay = day.value
    ? day.value.replace(dayStr, '')
    : '1'
  const currentDate = `${currentYear}-${currentMonth}-${currentDay}`
  return moment().diff(
    moment(currentDate, 'YYYY-MM-DD'),
    'years',
    false
  )
})

const emit = defineEmits(['update:modelValue'])

const initYearList = () => {
  const date = new Date()
  const currentYear = date.getFullYear()
  const years = []
  for (let i = currentYear; i >= 1900; i--) {
    years.push(i + yearStr)
  }
  return years
}

const initMonthList = () => {
  const months = []
  for (let i = 1; i < 13; i++) {
    months.push(i + monthStr)
  }
  return months
}

const initDayList = (month = '', year = '') => {
  const days = []
  if (month) {
    const monthValue = Number(month.replace(monthStr, ''))
    if (monthValue === 2) {
      if (year) {
        const yearValue = Number(year.replace(yearStr, ''))
        if (
          (yearValue % 4 === 0 && yearValue % 100 !== 0) ||
          (yearValue % 100 === 0 && yearValue % 400 === 0)
        ) {
          for (let i = 1; i <= 29; i++) {
            days.push(i + dayStr)
          }
          return days
        }
      }
      for (let i = 1; i <= 28; i++) {
        days.push(i + dayStr)
      }
      return days
    } else if ([4, 6, 9, 11].includes(monthValue)) {
      for (let i = 1; i <= 30; i++) {
        days.push(i + dayStr)
      }
      return days
    }
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i + dayStr)
  }
  return days
}

const updateDayList = () => {
  dayList.value = initDayList(month.value, year.value)
  if (
    day.value?.length &&
    !dayList.value.includes(day.value)
  ) {
    day.value = dayList.value[dayList.value.length - 1]
  }
}

const emitValue = () => {
  const data = {
    year: year.value,
    month: month.value,
    day: day.value,
    age: age.value,
  }
  emit('update:modelValue', data)
}

watch(year, () => {
  updateDayList()
  emitValue()
})

watch(month, () => {
  updateDayList()
  emitValue()
})

watch(day, () => {
  emitValue()
})

watch(props.modelValue, () => {
  if (props.modelValue) {
    year.value = props.modelValue.year
    month.value = props.modelValue.month
    day.value = props.modelValue.day
  }
})

onMounted(() => {
  yearList.value = initYearList()
  monthList.value = initMonthList()
  dayList.value = initDayList()
})
</script>

<template>
  <div class="date-picker">
    <div
      v-if="title"
      class="date-picker__title text-base leading-4 tablet:text-base tablet:leading-21px font-bold mb-1.5"
    >
      {{ title }}
      <span
        v-if="required"
        class="text-xs tablet:text-sm tablet:leading-19px text-validate font-medium"
      >
        {{ required }}
      </span>
    </div>
    <div
      class="flex date-picker__container tablet:items-center items-end gap-4"
    >
      <div
        class="date-picker__group-date flex-1 flex flex-wrap tablet:gap-8 gap-4 tablet:flex-nowrap flex-wrap"
      >
        <Dropdown
          v-model="year"
          :items="yearList"
          :text-button="yearStr"
          :errors="errorsYear"
          :is-disabled="isDisabled"
        />
        <Dropdown
          v-model="month"
          :items="monthList"
          :text-button="monthStr"
          :errors="errorsMonth"
          :is-disabled="isDisabled"
        />
        <Dropdown
          v-model="day"
          :items="dayList"
          :text-button="dayStr"
          :errors="errorsDay"
          :is-disabled="isDisabled"
        />
        <span
          v-if="calculatorOld"
          class="date-picker__age font-medium pt-3.5"
        >
          {{ age }}
          <span class="text-base date-picker__old-unit">
            {{ $t('components.modal.update_user.age') }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.date-picker {
  &__title {
    color: $color-black-1;

    .text-validate {
      color: $color-red-1;
    }
  }

  &_age {
    font-size: 34px;
    margin-top: 5px;
  }
}
</style>
