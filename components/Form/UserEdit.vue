<script lang="ts" setup>
import debounce from 'lodash/debounce'

const { convertFurigana } = useHelper()
const {
  form,
  userStore,
  GENDERS,
  gender,
  listGroupName,
  listTrainerName,
  errors,
  date,
  RoleEnum,
  trainerName,
  trainerId,
  groupName,
  levelNameList,
  levelName,
  isLoadingPage,
  onSelectLevel,
  onSubmit,
  onSelectGroup,
  onSelectTrainer,
  onSelectYearOld,
  onSelectGender,
  onViewDeleteMemberGroup,
} = useUserEdit()

const inputHandler = debounce(async (event) => {
  const furigana: string = await convertFurigana(
    event.value
  )
  form.value[event.key] = furigana
}, 500)
</script>

<template>
  <div v-if="!isLoadingPage" class="min-h-screen">
    <div class="title select-none">
      {{ $t('pages.user_edit.title_form') }}
    </div>
    <UploadAvatar
      v-model="form.avatar as File | string"
      class="mt-12px"
      :class="`${userStore.roleName}`"
    />
    <div class="record-number__title">
      {{ $t('pages.user_edit.record') }}
    </div>
    <div
      :class="{
        'mt-12': userStore.roleName === RoleEnum.TRAINER,
      }"
      class="record-number__value"
    >
      {{ form.karute }}
    </div>
    <div
      class="row-form"
      :class="{ 'row-error': errors.level.length }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_edit.level') }}
        <span>
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <Dropdown
        v-model="levelName"
        :items="levelNameList"
        :errors="errors.level"
        :text-button="$t('pages.user_edit.default_level')"
        class="w-full tablet:w-180px h-53px"
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
      <div class="row-form__label">
        {{ $t('pages.user_edit.name') }}
        <span>
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_edit.last_name') }}
          </span>
          <FormTextInput
            v-model="form.last_name"
            :errors="errors.last_name"
            :placeholder="
              $t('pages.user_edit.placeholder_last_name')
            "
            class="flex-1 h-53px"
            @input="
              inputHandler({
                value: $event.target.value,
                key: 'last_name_kana',
              })
            "
          />
        </div>
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_edit.first_name') }}
          </span>
          <FormTextInput
            v-model="form.first_name"
            :errors="errors.first_name"
            :placeholder="
              $t('pages.user_edit.placeholder_first_name')
            "
            class="flex-1 h-53px"
            @input="
              inputHandler({
                value: $event.target.value,
                key: 'first_name_kana',
              })
            "
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
      <div class="row-form__label">
        {{ $t('pages.user_edit.furigana_name') }}
        <span>
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_edit.last_name') }}
          </span>
          <FormTextInput
            v-model="form.last_name_kana"
            :errors="errors.last_name_kana"
            :placeholder="
              $t(
                'pages.user_edit.placeholder_last_furigana_name'
              )
            "
            class="flex-1 h-53px"
          />
        </div>
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_edit.first_name') }}
          </span>
          <FormTextInput
            v-model="form.first_name_kana"
            :errors="errors.first_name_kana"
            :placeholder="
              $t(
                'pages.user_edit.placeholder_first_furigana_name'
              )
            "
            class="flex-1 h-53px"
          />
        </div>
      </div>
    </div>
    <div
      class="row-form"
      :class="{
        'row-error': errors.zip1.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_edit.postal_code') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.zip1"
          :max-length="7"
          :errors="errors.zip1"
          placeholder="0000000"
          class="w-full tablet:w-180px h-53px"
        />
      </div>
    </div>
    <div class="row-form pb-2px">
      <div class="row-form__label">
        {{ $t('pages.user_edit.address') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.address"
          :placeholder="
            $t('pages.user_edit.placeholder_address')
          "
          class="flex-1"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_edit.building_name') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.building_name"
          :placeholder="
            $t('pages.user_edit.placeholder_building_name')
          "
          class="flex-1"
        />
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
        calculator-old
        :title="$t('pages.user_edit.birth_day')"
        :required="$t('pages.user_edit.required')"
        :errors-day="errors.day"
        :errors-year="errors.year"
        :errors-month="errors.month"
        class="custom-time"
        @update:model-value="onSelectYearOld"
      />
    </div>
    <div
      class="row-form"
      :class="{ 'row-error': errors.sex.length }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_edit.gender') }}
        <span>
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <Dropdown
          v-model="gender"
          :items="GENDERS"
          :errors="errors.sex"
          :text-button="
            $t('pages.user_edit.gender_default')
          "
          class="w-full tablet:w-180px"
          @on-selected="onSelectGender"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_edit.phone_number') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.tel"
          placeholder="00000000000"
          class="w-full tablet:w-329px"
        />
      </div>
    </div>
    <div
      class="row-form"
      :class="{
        'row-error': errors.medical_history.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_edit.medical_history') }}
        <span>
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.medical_history"
          :errors="errors.medical_history"
          :placeholder="
            $t(
              'pages.user_edit.placeholder_medical_history'
            )
          "
          type-input="textarea"
          class="flex-1 textarea"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_edit.memo') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.memo"
          :placeholder="
            $t('pages.user_edit.placeholder_memo')
          "
          type-input="textarea"
          class="flex-1 textarea"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_edit.email') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.email"
          :errors="errors.email"
          placeholder="sample@example.com"
          class="flex-1"
        />
      </div>
    </div>
    <div
      v-if="userStore.roleName === RoleEnum.ADMIN"
      class="title mb-24px mt-72px"
    >
      {{ $t('pages.user_edit.trainer_info') }}
    </div>
    <div v-else class="title mb-24px mt-68px">
      {{ $t('pages.user_edit.group_info') }}
    </div>
    <div
      v-if="userStore.roleName === RoleEnum.ADMIN"
      class="row-form"
      style="margin-bottom: 24px"
    >
      <div class="row-form__label">
        {{ $t('pages.user_list.trainer') }}
        <span>
          {{ $t('pages.user_edit.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <Dropdown
          v-model="trainerId"
          :object-item="listTrainerName"
          :errors="errors.trainer_id"
          :text-button="
            $t('pages.user_edit.group_name_default')
          "
          class="w-full tablet:w-330px"
          @on-selected="onSelectTrainer"
        />
      </div>
      <span
        v-if="
          errors.trainer_id && errors.trainer_id.length > 0
        "
        class="error-text font-medium mr-2"
      >
        {{ errors.trainer_id[0].$params.message }}
      </span>
    </div>
    <div class="row-form" style="margin-bottom: 14px">
      <div class="row-form__label">
        {{ $t('pages.user_edit.group_name') }}
      </div>
      <div class="row-form__content">
        <Dropdown
          v-model="groupName"
          :object-item="listGroupName"
          :text-button="
            listGroupName.length > 0
              ? $t('pages.user_edit.group_name_default')
              : $t('pages.group_list.not_set')
          "
          class="w-full tablet:w-330px"
          @on-selected="onSelectGroup"
        />
      </div>
    </div>
    <div
      class="note"
      v-if="userStore.roleName === RoleEnum.ADMIN"
    >
      {{ $t('pages.user_edit.note') }}
    </div>
    <div class="note" v-else>
      {{ $t('pages.user_edit.note_trainer') }}
    </div>
    <Button
      :theme="userStore.roleName"
      class="mt-38px"
      @click="onSubmit()"
    >
      {{ $t('pages.user_edit.confirmation') }}
    </Button>
    <div
      class="flex justify-center"
      @click="onViewDeleteMemberGroup()"
    >
      <span class="cancel mt-22px cursor-pointer">
        {{ $t('pages.user_edit.cancel') }}
      </span>
    </div>
  </div>
  <Loading
    v-if="isLoadingPage"
    :theme="userStore.roleName"
    class="absolute w-full h-screen top-0 left-0"
  />
</template>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 24px;
  color: $color-black-1;
}

.record-number {
  &__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    color: $color-black-1;
    margin-top: 42px;
  }
}

.record-number {
  &__value {
    margin-top: 8px;
    margin-bottom: 24px;
    line-height: 16px;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    color: $color-black-1;
    letter-spacing: 0;

    &.mt-12 {
      margin-top: 12px;
    }
  }
}

.row-form {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 24px;

  &.row-error {
    margin-bottom: 32px;
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

.note {
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  color: $color-black-1;
  letter-spacing: 0.05em;
}

:deep(.list-item__content) {
  max-height: 250px;
}

:deep(.list-item__wrapper) {
  max-width: 100%;
}

:deep(.dropdown-button) {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.custom-time {
  &:deep(.trainer-registration__group-date) {
    gap: 31px;
    flex: unset;
    margin-right: 31px;
  }

  &:deep(.trainer-registration__group-date > div) {
    width: 149px;
    flex: unset;
  }

  &:deep(.trainer-registration__old) {
    font-size: 30px;
    font-weight: 500;
  }

  &:deep(.date-picker__title) {
    margin-bottom: 0px;
  }

  :deep(.dropdown-button) {
    width: 167px;
  }
}

.cancel {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 24px;
  font-size: 14px;
}

.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
}
</style>
