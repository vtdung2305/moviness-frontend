<script lang="ts" setup>
import { useMember } from '@/stores/member'
import { GENDERS } from '@/constants/common'
import { useGroup } from '@/stores/group'
import { ModalNameEnum } from '@/constants/modal'
import { IMemberRegister } from '@/interfaces/member'
import { useUser } from '@/stores/user'
import { useTrainer } from '@/stores/trainer'
import { RoleEnum } from '@/constants/role'
import { levels } from '@/constants/member'
import { ImageDefaultEnum } from '@/constants/image'

const { t } = useLang()
const router = useRouter()
const { $api, $showModal, $hiddenModal } = useNuxtApp()
const memberStore = useMember()
const trainerStore = useTrainer()
const userStore = useUser()
const groupStore = useGroup()
const { uploadFile } = useUpload()
const alert = ref<string>('')
const isSubmitError = ref<boolean>(false)
const { getFullName, getFullPostalCode } = useHelper()

const group = computed(() => {
  if (
    groupStore.groups?.groupList &&
    memberStore.memberRegister?.group_id
  ) {
    return groupStore.groups?.groupList.find(
      (item) =>
        item.id === memberStore.memberRegister?.group_id
    )
  }
})

const trainer = computed(() => {
  if (
    trainerStore.trainers &&
    memberStore.memberRegister?.trainer_id
  ) {
    return trainerStore.trainers.find(
      (item) =>
        item.id === memberStore.memberRegister?.trainer_id
    )
  }
})

const gender = computed(() => {
  if (memberStore.memberRegister?.sex) {
    return GENDERS[Number(memberStore.memberRegister?.sex)]
  }
  return ''
})

const level = computed(() => {
  return (
    levels.find(
      (item) =>
        item.value === memberStore.memberRegister?.level
    )?.name || useLang().t('others.no_value')
  )
})

const avatar = computed(() => {
  return memberStore.memberRegister?.avatar
    ? URL.createObjectURL(
        memberStore.memberRegister?.avatar as File
      )
    : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
})

const confirm = async () => {
  $hiddenModal(ModalNameEnum.CONFIRM_REGISTER_MEMBER)
  let avatarUrl = ''
  if (memberStore.memberRegister?.avatar) {
    avatarUrl = await uploadFile(
      memberStore.memberRegister?.avatar as File
    )
    if (avatarUrl === 'ERROR') {
      avatarUrl = ''
      alert.value = t('others.upload_error')
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      return
    }
  }

  $api.member
    .register({
      ...(memberStore.memberRegister as IMemberRegister),
      zip1:
        memberStore.memberRegister?.zip1
          ?.toString()
          .slice(0, 3) || '',
      zip2:
        memberStore.memberRegister?.zip1
          ?.toString()
          .slice(3, 7) || '',
      avatar: avatarUrl,
      year:
        memberStore.memberRegister?.year.replace(
          t('components.datepicker.year'),
          ''
        ) || '',
      month:
        memberStore.memberRegister?.month?.replace(
          t('components.datepicker.month'),
          ''
        ) || '',
      day:
        memberStore.memberRegister?.day?.replace(
          t('components.datepicker.day'),
          ''
        ) || '',
    })
    .then(() => {
      alert.value = t(
        'pages.user_registration.message_success'
      )
      isSubmitError.value = false
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
    })
    .catch((e) => {
      if (e.response?._data?.errors) {
        const keyError = Object.keys(
          e.response?._data?.errors
        )[0]
        alert.value = e.response?._data?.errors[keyError][0]
      } else {
        alert.value = e.response?._data?.message || ''
      }
      isSubmitError.value = true
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
    })
}
const onCloseAlert = () => {
  if (isSubmitError.value) {
    router.back()
  } else {
    memberStore.memberRegister = null

    router.push(`/app/${userStore.roleName}/user`)
  }
}

const handleBack = () => {
  router.push({
    name: `app-${userStore.roleName}-user-registration`,
  })
}

onBeforeMount(() => {
  if (!memberStore.memberRegister) {
    useRouter().replace(
      `/app/${userStore.roleName}/user-registration`
    )
  }
})
onBeforeRouteLeave((to) => {
  if (
    to.name !==
    `app-${userStore.roleName}-user-registration`
  ) {
    memberStore.memberRegister = null
  }
})
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
      {{ $t('others.empty') }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.level') }}
    </div>
    <div class="value">
      {{ level || $t('others.no_value') }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.name') }}
    </div>
    <div class="value">
      {{ memberStore.memberRegister?.last_name }}
      {{ memberStore.memberRegister?.first_name }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.name_furigana') }}
    </div>
    <div class="value">
      {{ memberStore.memberRegister?.last_name_kana }}
      {{ memberStore.memberRegister?.first_name_kana }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.address') }}
    </div>
    <div class="value flex flex-col gap-8px">
      <span>
        {{
          getFullPostalCode(
            memberStore.memberRegister?.zip1
          ) || $t('others.empty')
        }}
      </span>
      <span>
        {{ memberStore.memberRegister?.address }}
        {{ memberStore.memberRegister?.building_name }}
      </span>
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.birth_day') }}
    </div>
    <div class="value">
      {{ memberStore.memberRegister?.year }}
      {{
        memberStore.memberRegister?.month.length === 2
          ? '0' + memberStore.memberRegister?.month
          : memberStore.memberRegister?.month
      }}
      {{
        memberStore.memberRegister?.day.length === 2
          ? '0' + memberStore.memberRegister?.day
          : memberStore.memberRegister?.day
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.age') }}
    </div>
    <div class="value">
      {{ memberStore.memberRegister?.age }}歳
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
        memberStore.memberRegister?.tel ||
        $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.medical_history') }}
    </div>
    <div class="value whitespace-pre-line">
      {{
        memberStore.memberRegister?.medical_history ||
        $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.memo') }}
    </div>
    <div class="value whitespace-pre-line">
      {{
        memberStore.memberRegister?.memo ||
        $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.email') }}
    </div>
    <div class="value">
      {{
        memberStore.memberRegister?.email ||
        $t('others.empty')
      }}
    </div>
  </div>
  <div class="title mt-64px mb-7px">
    {{ $t('pages.user_registration.trainer_info') }}
  </div>
  <div
    v-if="userStore.roleName === RoleEnum.ADMIN"
    class="row-info"
  >
    <div class="label">
      {{ $t('pages.user_list.trainer') }}
    </div>
    <div class="value">
      {{
        trainer?.id
          ? getFullName(
              trainer.last_name,
              trainer.first_name
            )
          : $t('others.empty')
      }}
    </div>
  </div>
  <div class="row-info">
    <div class="label">
      {{ $t('pages.user_registration.group_name') }}
    </div>
    <div class="value">
      {{ group?.name || $t('others.empty') }}
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
      {{ $t('pages.user_registration.register') }}
    </Button>
  </div>
  <ModalWrapper
    :id="ModalNameEnum.CONFIRM_REGISTER_MEMBER"
    content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
  >
    <div class="text-22px leading-22px font-bold title">
      {{ $t('others.title_modal_confirm') }}
    </div>
    <div class="text-16px leading-16px sub-title">
      {{ $t('pages.user_registration.message_confirm') }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="userStore.roleName"
      @click="confirm"
    >
      {{ $t('components.button.register') }}
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
  gap: 59px;
  padding-bottom: 15px;
  border-bottom: 1px solid $color-gray-3;
  padding-top: 16px;

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
  }

  .value {
    flex: 1;
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
</style>
