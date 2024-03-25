<script lang="ts" setup>
const {
  group,
  gender,
  avatar,
  memberStore,
  userStore,
  RoleEnum,
  ModalNameEnum,
  alert,
  groupOld,
  trainer,
  trainerOld,
  t,
  confirm,
  onCloseAlert,
  handleBack,
} = useUserEditConfirmation()

const { getFullName, getFullAddress, getFullPostalCode } =
  useHelper()
</script>

<template>
  <div class="title select-none">
    {{ $t('pages.user_registration.title_form') }}
  </div>
  <img
    class="mt-24px w-116px h-116px mb-8px rounded-full object-contain"
    :src="avatar"
  />
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.record') }}
    </div>
    <div class="value">
      {{
        memberStore.memberEdit?.karute || $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.level') }}
    </div>
    <div class="value">
      {{
        Number(memberStore.memberEdit?.level) ||
        $t('others.no_value')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.name') }}
    </div>
    <div class="value">
      {{
        getFullName(
          memberStore.memberEdit?.last_name,
          memberStore.memberEdit?.first_name
        )
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.name_furigana') }}
    </div>
    <div class="value">
      {{
        getFullName(
          memberStore.memberEdit?.last_name_kana,
          memberStore.memberEdit?.first_name_kana
        )
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.address') }}
    </div>
    <div class="value flex flex-col gap-8px">
      <template
        v-if="
          !memberStore.memberEdit?.zip1 &&
          !memberStore.memberEdit?.address &&
          !memberStore.memberEdit?.building_name
        "
      >
        {{ $t('others.empty') }}
      </template>
      <template v-else>
        <span>
          {{
            getFullPostalCode(
              memberStore.memberEdit?.zip1
            ) || $t('others.empty')
          }}
        </span>
        <span>
          {{
            getFullAddress(
              memberStore.memberEdit?.address,
              memberStore.memberEdit?.building_name
            ) || $t('others.empty')
          }}
        </span>
      </template>
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.birth_day') }}
    </div>
    <div class="value">
      <span>{{ memberStore.memberEdit?.year }}</span>
      <span>
        {{
          memberStore.memberEdit?.month.length === 2
            ? '0' + memberStore.memberEdit?.month
            : memberStore.memberEdit?.month
        }}
      </span>
      <span>
        {{
          memberStore.memberEdit?.day.length === 2
            ? '0' + memberStore.memberEdit?.day
            : memberStore.memberEdit?.day
        }}
      </span>
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.age') }}
    </div>
    <div class="value">
      <span>
        {{
          memberStore.memberEdit?.age || $t('others.empty')
        }}
      </span>
      <span>
        {{ $t('pages.user_edit.age_value') }}
      </span>
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.gender') }}
    </div>
    <div class="value">
      {{ $t(gender) || $t('others.gender_others') }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.phone_number') }}
    </div>
    <div class="value">
      {{
        memberStore.memberEdit?.tel || $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.medical_history') }}
    </div>
    <div class="value whitespace">
      {{
        memberStore.memberEdit?.medical_history
          ? memberStore.memberEdit?.medical_history.trim()
          : $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.memo') }}
    </div>
    <div class="value whitespace">
      {{
        memberStore.memberEdit?.memo
          ? memberStore.memberEdit?.memo.trim()
          : $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.email') }}
    </div>
    <div class="value">
      {{
        memberStore.memberEdit?.email || $t('others.empty')
      }}
    </div>
  </div>
  <div
    v-if="userStore.roleName === RoleEnum.ADMIN"
    class="title mt-64px mb-7px"
  >
    {{ $t('pages.user_registration.trainer_info') }}
  </div>
  <div v-else class="title mt-64px mb-7px">
    {{ $t('pages.user_edit.group_info') }}
  </div>
  <div
    v-if="userStore.roleName === RoleEnum.ADMIN"
    class="row-info -mt-7px"
  >
    <div class="label">
      {{ $t('pages.user_list.trainer') }}
    </div>
    <div class="value">
      <span>{{ trainerOld || $t('others.empty') }}</span>
      <i class="icon-arrow-right text-10px mx-8px"></i>
      <span class="font-bold">
        {{
          getFullName(
            trainer?.last_name,
            trainer?.first_name
          )
        }}
      </span>
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.group_name') }}
    </div>
    <div class="value">
      <span>{{ groupOld || $t('others.no_set') }}</span>
      <i class="icon-arrow-right text-10px mx-8px"></i>
      <span class="font-bold">{{
        group?.name || $t('others.no_set')
      }}</span>
    </div>
  </div>
  <div class="flex gap-31px mt-39px">
    <Button
      :theme="userStore.roleName"
      type="outline"
      @click="handleBack"
    >
      {{ $t('pages.user_registration.fix') }}
    </Button>
    <Button
      :theme="userStore.roleName"
      @click="
        $showModal(ModalNameEnum.CONFIRM_REGISTER_MEMBER)
      "
    >
      {{ $t('components.button.save') }}
    </Button>
  </div>
  <ModalWrapper
    :id="ModalNameEnum.CONFIRM_REGISTER_MEMBER"
    content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
  >
    <div class="text-22px leading-22px font-bold title">
      {{ $t('others.title_modal_confirm') }}
    </div>
    <div class="text-16px leading-16px sub-title">
      {{ $t('pages.user_edit.message_confirm') }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="userStore.roleName"
      @click="confirm"
    >
      {{ $t('components.button.save') }}
    </Button>
    <div
      class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
      @click="
        $hiddenModal(ModalNameEnum.CONFIRM_REGISTER_MEMBER)
      "
    >
      {{ $t('components.button.cancel') }}
    </div>
  </ModalWrapper>
  <ModalWrapper
    :id="ModalNameEnum.ALERT_REGISTER_MEMBER"
    content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
  >
    <div class="text-22px leading-22px font-bold title">
      {{ $t('others.title_modal_common') }}
    </div>
    <div class="text-16px leading-16px sub-title">
      {{ alert }}
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
</template>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  color: $color-black-1;
}

.row-info {
  display: flex;
  // gap: 59px;
  padding-bottom: 15px;
  border-bottom: 1px solid $color-gray-3;
  padding-top: 16px;

  @media screen and (max-width: $screen-tablet) {
    flex-direction: column;
  }

  .value,
  .label {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    color: $color-gray-1;
    width: 121px;
  }

  .label {
    width: 121px;

    @media screen and (max-width: $screen-tablet) {
      width: 100%;
      font-weight: bold;
    }
  }

  .value {
    flex: 1;

    @media screen and (max-width: $screen-tablet) {
      width: 100%;
      margin-top: 10px;
    }
  }
}

:deep(.modal-content) {
  @media screen and (max-width: 450px) {
    padding: 32px;
  }
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}

:deep(.page-section__title) {
  margin-bottom: 44px;
  margin-top: 16px;
}

.whitespace {
  line-height: 1.5 !important;
  white-space: pre-wrap;
}
</style>
