<script lang="ts" setup>
import { required, helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { Theme } from '@/interfaces/role'
import { useGroup } from '@/stores/group'
import { useCommon } from '@/stores'
import { ModalNameEnum } from '@/constants/modal'
import { levels } from '@/constants/member'
import { IMemberLevel } from '@/interfaces/member'
import { IUserList } from '@/interfaces/group'

const groupStore = useGroup()
const commonStore = useCommon()
const { $hiddenModal } = useNuxtApp()

defineProps({
  user: {
    type: Object,
    default: null,
  },
  theme: {
    type: String as PropType<Theme>,
    default: 'shinseido',
  },
})

const date = reactive({
  year: '',
  month: '',
  day: '',
})

const listYear = () => {
  const years = []
  for (let i = 2020; i > 1900; i--) {
    years.push(i.toString())
  }
  return years
}

const listMonth = () => {
  const months = []
  for (let i = 1; i < 13; i++) {
    months.push(i + '月')
  }
  return months
}

const listDay = () => {
  const days = []
  for (let i = 1; i < 31; i++) {
    days.push(i + '日')
  }
  return days
}

const form = reactive<IUserList>({
  id: '',
  level: 1,
  first_name: '',
  first_name_kana: '',
  last_name: '',
  last_name_kana: '',
  medical_history: '',
  memo: '',
  year: '',
  month: '',
  day: '',
  age: '',
})

const levelList = ref<IMemberLevel[]>(levels)
const levelNameList = computed(() =>
  levelList.value.map((item) => item.name)
)
const levelName = ref<string>(levelNameList.value[0])
const onSelectLevel = (value: string) => {
  const level = levelList.value.find(
    (item) => item.name === value
  )
  if (level) {
    form.level = level.value as number
  }
}

// validate
const { t } = useLang()
const rules = computed(() => {
  const validateRequired = (key: string) => ({
    required: helpers.withMessage(
      t(`pages.user_edit.validate.${key}`),
      required
    ),
  })
  const rule = {
    level: validateRequired('level'),
    last_name: validateRequired('last_name'),
    first_name: validateRequired('first_name'),
    last_name_kana: validateRequired('last_furigana_name'),
    first_name_kana: validateRequired(
      'first_furigana_name'
    ),
    year: validateRequired('year'),
    month: validateRequired('month'),
    day: validateRequired('day'),
    medical_history: validateRequired('medical_history'),
  }
  return rule
})

const v$ = useValidate(rules, form as any)

const errors = computed(() => {
  return {
    level: v$.value.level.$errors,
    last_name: v$.value.last_name.$errors,
    first_name: v$.value.first_name.$errors,
    last_name_kana: v$.value.last_name_kana.$errors,
    first_name_kana: v$.value.first_name_kana.$errors,
    year: v$.value.year.$errors,
    month: v$.value.month.$errors,
    day: v$.value.day.$errors,
    medical_history: v$.value.medical_history.$errors,
  }
})

const addItemUser = async () => {
  const validate = await v$.value.$validate()
  if (validate) {
    form.id = 'id' + Math.random().toString(16).slice(2)
    const formTemp = cloneDeep(form)

    groupStore.addItemUser(formTemp as IUserList)
    v$.value.$reset()
    form.id = ''
    form.level = 1
    form.last_name = ''
    form.first_name = ''
    form.last_name_kana = ''
    form.first_name_kana = ''
    form.medical_history = ''
    form.memo = ''
    form.year = ''
    form.month = ''
    form.day = ''
    form.age = ''
    date.year = ''
    date.month = ''
    date.day = ''

    $hiddenModal(ModalNameEnum.ADD_USER)
  }

  commonStore.setStatusModal(false)
}

const closeModal = () => {
  $hiddenModal(ModalNameEnum.ADD_USER)
}

const onSelectYearOld = (value: {
  year: string
  month: string
  day: string
  age: string
}) => {
  value.year && (form.year = value.year)
  value.month && (form.month = value.month)
  value.day && (form.day = value.day)
  value.age && (form.age = value.age)
}

const isOpenModal = computed(() => commonStore.showModal)

watch(isOpenModal, () => {})

defineEmits(['hide-modal'])
</script>
<template>
  <ModalCommon
    :id="ModalNameEnum.ADD_USER"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="update-user absolute">
      <div
        class="row-form"
        :class="{
          'row-error': errors.level.length,
        }"
      >
        <div
          class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-4"
        >
          {{ $t('components.modal.update_user.level') }}
          <span class="ml-2">
            {{ $t('pages.user_edit.required') }}
          </span>
        </div>
        <Dropdown
          v-model="levelName"
          :items="levelNameList"
          :errors="errors.level"
          :text-button="$t('pages.user_edit.default_level')"
          class="w-180px h-53px"
          @on-selected="onSelectLevel"
        />
      </div>
      <div
        class="row-form"
        :class="{
          'row-error':
            errors.last_name.length ||
            errors.first_name.length,
        }"
      >
        <div
          class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-4"
        >
          {{ $t('components.modal.update_user.name') }}
          <span class="ml-2">
            {{ $t('pages.user_edit.required') }}
          </span>
        </div>

        <div
          class="update-user__group-name flex items-center justify-between"
        >
          <div
            class="update-user__group-left items-center flex"
          >
            <span
              class="update-user__sublabel text-base font-medium"
              >{{
                $t('components.modal.update_user.surname')
              }}</span
            >
            <FormTextInput
              v-model="form.last_name"
              :errors="errors.last_name"
              type-input="text"
              class="update-user__input-name ml-2 flex-1 h-53px"
            />
          </div>
          <div
            class="update-user__group-right flex items-center ml-8"
          >
            <span
              class="update-user__sublabel text-base font-medium"
              >{{
                $t(
                  'components.modal.update_user.given_name'
                )
              }}</span
            >
            <FormTextInput
              v-model="form.first_name"
              :errors="errors.first_name"
              type-input="text"
              class="update-user__input-name ml-2 flex-1 h-53px"
            />
          </div>
        </div>
      </div>

      <div
        class="row-form"
        :class="{
          'row-error':
            errors.last_name_kana.length ||
            errors.first_name_kana.length,
        }"
      >
        <div
          class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-4"
        >
          {{
            $t('components.modal.update_user.name_furigana')
          }}
          <span class="ml-2">
            {{ $t('pages.user_edit.required') }}
          </span>
        </div>
        <div
          class="update-user__group-name flex items-center justify-between"
        >
          <div
            class="update-user__group-left flex items-center"
          >
            <span
              class="update-user__sublabel text-base font-medium"
              >{{
                $t('components.modal.update_user.surname')
              }}</span
            >
            <FormTextInput
              v-model="form.last_name_kana"
              :errors="errors.last_name_kana"
              type-input="text"
              class="update-user__input-name ml-2 flex-1 h-53px"
            />
          </div>
          <div
            class="update-user__group-right flex items-center ml-8"
          >
            <span
              class="update-user__sublabel text-base font-medium"
              >{{
                $t(
                  'components.modal.update_user.given_name'
                )
              }}</span
            >
            <FormTextInput
              v-model="form.first_name_kana"
              :errors="errors.first_name_kana"
              type-input="text"
              class="update-user__input-name ml-2 flex-1 h-53px"
            />
          </div>
        </div>
      </div>

      <div
        class="row-form"
        :class="{
          'row-error':
            errors.year.length ||
            errors.month.length ||
            errors.day.length,
        }"
      >
        <DatePickerCustom
          :model-value="date"
          :title="$t('pages.trainer_registration.birthday')"
          :required="$t('pages.user_edit.required')"
          class="mt-2 w-full custom-time tablet:mt-4"
          calculator-old
          :errors-day="errors.day"
          :errors-year="errors.year"
          :errors-month="errors.month"
          @update:model-value="onSelectYearOld"
        />
      </div>
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-4"
      >
        {{
          $t('components.modal.update_user.medical_history')
        }}
        <span class="ml-2">
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <div
        class="row-form"
        :class="{
          'row-error': errors.last_name.medical_history,
        }"
      >
        <FormTextInput
          v-model="form.medical_history"
          :errors="errors.medical_history"
          type-input="textarea"
          :rows="2"
        />
      </div>
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-4"
      >
        {{ $t('components.modal.update_user.remarks') }}
      </div>
      <FormTextInput
        v-model="form.memo"
        type-input="textarea"
        :rows="2"
      />
      <div class="update-user__action flex">
        <Button
          type="outline"
          :theme="theme"
          class="mt-6 tablet:mt-10"
          @click="closeModal"
        >
          {{ $t('components.button.close') }}
        </Button>
        <Button
          type="primary"
          :theme="theme"
          class="mt-6 tablet:mt-10"
          @click="addItemUser"
        >
          {{ $t('components.button.save') }}
        </Button>
      </div>
    </div>
  </ModalCommon>
</template>
<style scoped lang="scss">
.update-user {
  background: #fff;
  width: calc(100% - 80px);
  max-height: calc(100vh - 40px);
  overflow: auto;
  //bottom: 40px;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 688px;
  padding: 40px 56px;
  border-radius: 24px;
  filter: drop-shadow(5px 10px 10px rgba(51, 51, 51, 0.1));
  z-index: 2;
  top: 50%;

  &__label {
    color: $color-gray-1;

    span {
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      color: $color-red-1;
    }
  }

  &__group-date {
    column-gap: 14px;
  }

  &__old {
    font-size: $font-30;
    line-height: $font-30;
    color: $color-gray-1;

    span {
      color: $color-black-1;
    }
  }

  &__action {
    column-gap: 32px;
  }

  @media screen and (max-width: $screen-mobile) {
    width: calc(100% - 32px);
    max-height: calc(100vh - 48px);
    bottom: 16px;
    padding: 16px;
  }
}

.custom-time {
  :deep(.dropdown-button) {
    width: 140px;
  }
}

.row-form {
  display: flex;
  flex-direction: column;
  gap: 7px;
  //  margin-bottom: 24px;

  &.row-error {
    margin-bottom: 30px;
  }

  &__label {
    display: flex;
    gap: 8px;
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    color: $color-black-1;

    span {
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      color: $color-red-1;
    }
  }

  &__content {
    display: flex;
    gap: 32px;
    flex-direction: row;

    .textarea {
      &:deep(textarea) {
        height: 105px;
      }
    }

    &:deep(input) {
      padding-left: 13px;
    }

    @media screen and (max-width: 685px) {
      gap: 16px;

      &.select-calendar .calendar-item {
        flex: 1;
        width: fit-content;
      }
    }
  }
}
</style>
