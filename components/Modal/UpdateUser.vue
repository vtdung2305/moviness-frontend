<script lang="ts" setup>
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { levels } from '@/constants/member'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  theme: {
    type: String as PropType<Theme>,
    default: 'shinseido',
  },
  hideId: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['hide-modal', 'update-user'])

const date = ref({
  year: '',
  month: '',
  day: '',
})

const form = ref({
  id: '',
  level: '0',
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  medical_history: '',
  memo: '',
  year: '',
  month: '',
  day: '',
})

const levelList = computed(() => {
  return levels.map((item) => {
    return item.name?.toString() || ''
  })
})

onMounted(() => {
  form.value.id = props.user.id || ''
  form.value.level = props.user.level || ''
  form.value.last_name = props.user.last_name || ''
  form.value.first_name = props.user.first_name || ''
  form.value.last_name_kana =
    props.user.last_name_kana || ''
  form.value.first_name_kana =
    props.user.first_name_kana || ''
  form.value.medical_history =
    props.user.medical_history || ''
  form.value.memo = props.user.memo || ''
  form.value.year = props.user.year || ''
  form.value.month = props.user.month || ''
  form.value.day = props.user.day || ''
  date.value.year = props.user.year || ''
  date.value.month =
    props.user.month.charAt(0) === '0'
      ? props.user.month.substring(1)
      : props.user.month || ''
  date.value.day =
    props.user.day.charAt(0) === '0'
      ? props.user.day.substring(1)
      : props.user.day || ''
})

const handleSave = () => {
  form.value.year = date.value.year
  form.value.month = date.value.month
  form.value.day = date.value.day
  emit('update-user', form.value)
}
</script>
<template>
  <ModalCommon @hide-modal="$emit('hide-modal')">
    <div class="update-user absolute">
      <template v-if="!hideId">
        <div
          class="update-user__label text-xs tablet:text-base font-bold mt-0"
        >
          {{
            $t(
              'components.modal.update_user.medical_record_number'
            )
          }}
        </div>
        <FormTextInput
          v-model="form.id"
          type-input="text"
        />
      </template>
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-22px"
      >
        {{ $t('components.modal.update_user.level') }}
      </div>
      <Dropdown
        v-model="form.level"
        :label="''"
        :text-button="''"
        :items="levelList"
        class="w-180px"
      />
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-22px"
      >
        {{ $t('components.modal.update_user.name') }}
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
            v-model="form.last_name"
            type-input="text"
            class="update-user__input-name ml-2"
          />
        </div>
        <div
          class="update-user__group-right flex items-center ml-8"
        >
          <span
            class="update-user__sublabel text-base font-medium"
            >{{
              $t('components.modal.update_user.given_name')
            }}</span
          >
          <FormTextInput
            v-model="form.first_name"
            type-input="text"
            class="update-user__input-name ml-2"
          />
        </div>
      </div>
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-22px"
      >
        {{
          $t('components.modal.update_user.name_furigana')
        }}
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
            type-input="text"
            class="update-user__input-name ml-2"
          />
        </div>
        <div
          class="update-user__group-right flex items-center ml-8"
        >
          <span
            class="update-user__sublabel text-base font-medium"
            >{{
              $t('components.modal.update_user.given_name')
            }}</span
          >
          <FormTextInput
            v-model="form.first_name_kana"
            type-input="text"
            class="update-user__input-name ml-2"
          />
        </div>
      </div>
      <DatePickerCustom
        v-model="date"
        :title="$t('pages.trainer_registration.birthday')"
        class="mt-3 tablet:mt-22px w-full custom-time"
        calculator-old
      />
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-22px"
      >
        {{
          $t('components.modal.update_user.medical_history')
        }}
      </div>
      <FormTextInput
        v-model="form.medical_history"
        type-input="textarea"
        :rows="3"
      />
      <div
        class="update-user__label text-xs tablet:text-base font-bold mt-3 tablet:mt-22px"
      >
        {{ $t('components.modal.update_user.remarks') }}
      </div>
      <FormTextInput
        v-model="form.memo"
        type-input="textarea"
        :rows="3"
      />
      <div class="update-user__action flex">
        <Button
          type="outline"
          :theme="theme"
          class="mt-6 tablet:mt-10"
          @click="$emit('hide-modal')"
        >
          {{ $t('components.button.close') }}
        </Button>
        <Button
          type="primary"
          :theme="theme"
          class="mt-6 tablet:mt-10"
          @click="handleSave"
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
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 688px;
  padding: 40px 56px;
  border-radius: 24px;
  filter: drop-shadow(5px 10px 10px rgba(51, 51, 51, 0.1));
  z-index: 2;

  &__label {
    color: $color-gray-1;
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
    width: 148px;
  }

  :deep(.date-picker__group-date) {
    position: relative;
  }

  :deep(.date-picker__age) {
    white-space: nowrap;
    font-size: 30px;
    padding-top: 6px;
    right: 0;
    position: absolute;

    @media screen and (max-width: $screen-tablet) {
      position: unset;
    }
  }

  :deep(.date-picker__old-unit) {
    margin-left: -10px;
  }
}
</style>
