<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useFacility } from '@/stores/facility'
import { useUser } from '@/stores/user'
import { ImageDefaultEnum } from '@/constants/image'
import { ModalNameEnum } from '@/constants/modal'
import { CookieKeyEnum } from '@/constants/cookie'

definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_settings',
    route: { name: 'app-kanrisha-setting' },
  },
  {
    text: 'components.menu.kanrisha_edit',
    route: { name: 'app-kanrisha-edit' },
  },
  {
    text: 'components.menu.kanrisha_edit_confirmation',
    route: { name: '' },
  },
]

const isLoadingPage = ref(false)
const { copyClipboard, getFullPostalCode } = useHelper()
const facilityStore = useFacility()
const userStore = useUser()
const alert = ref<string>('')
const isSubmitError = ref<boolean>(false)
const router = useRouter()
const { $api, $showModal, $hiddenModal } = useNuxtApp()
const { t } = useLang()
const config = useRuntimeConfig()
const { uploadFile } = useUpload()

const avatarDisplay = computed(() => {
  if (!facilityStore.facilityEditData?.avatar)
    return ImageDefaultEnum.IMAGE_FACILITY_DEFAULT
  if (
    typeof facilityStore.facilityEditData?.avatar ===
    'string'
  ) {
    return facilityStore.facilityEditData?.avatar
  } else {
    return URL.createObjectURL(
      facilityStore.facilityEditData?.avatar as File
    )
  }
})

const avatarManagerDisplay = computed(() => {
  if (!facilityStore.facilityEditData?.manager_avatar)
    return ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
  if (
    typeof facilityStore.facilityEditData
      ?.manager_avatar === 'string'
  ) {
    return facilityStore.facilityEditData?.manager_avatar
  } else {
    return URL.createObjectURL(
      facilityStore.facilityEditData?.manager_avatar as File
    )
  }
})

const confirm = async () => {
  $hiddenModal(ModalNameEnum.CONFIRM_REGISTER_MEMBER)

  let avatarUrl = ''
  let avatarManagerUrl = ''

  if (
    typeof facilityStore.facilityEditData?.avatar ===
    'string'
  ) {
    avatarUrl =
      facilityStore.facilityEditData?.avatar.replace(
        `${config.public.apiCloud}/`,
        ''
      )
  } else if (facilityStore.facilityEditData?.avatar) {
    avatarUrl = await uploadFile(
      facilityStore.facilityEditData?.avatar as File
    )
    if (avatarUrl === 'ERROR') {
      avatarUrl = ''
      alert.value = t('others.upload_error')
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      return
    }
  }

  if (
    typeof facilityStore.facilityEditData
      ?.manager_avatar === 'string'
  ) {
    avatarManagerUrl =
      facilityStore.facilityEditData?.manager_avatar.replace(
        `${config.public.apiCloud}/`,
        ''
      )
  } else if (
    facilityStore.facilityEditData?.manager_avatar
  ) {
    avatarManagerUrl = await uploadFile(
      facilityStore.facilityEditData?.manager_avatar as File
    )
    if (avatarManagerUrl === 'ERROR') {
      avatarManagerUrl = ''
      alert.value = t('others.upload_error')
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      return
    }
  }

  const id = userStore.userData?.facility_id as
    | string
    | number

  const params = {
    avatar: avatarUrl,
    name: facilityStore?.facilityEditData?.name,
    name_kata: facilityStore?.facilityEditData?.name_kata,
    zip1:
      facilityStore?.facilityEditData?.zip1
        ?.toString()
        .slice(0, 3) || '',
    zip2:
      facilityStore?.facilityEditData?.zip1
        ?.toString()
        .slice(3, 7) || '',
    address1: facilityStore?.facilityEditData?.address,
    tel: facilityStore?.facilityEditData?.tel,
    fax: facilityStore?.facilityEditData?.fax,
    email: facilityStore?.facilityEditData?.email,

    president_first_name:
      facilityStore?.facilityEditData?.president_first_name,
    president_first_name_kata:
      facilityStore?.facilityEditData
        ?.president_first_name_kata,
    president_zip1:
      facilityStore?.facilityEditData?.president_zip1
        ?.toString()
        .slice(0, 3) || '',
    president_zip2:
      facilityStore?.facilityEditData?.president_zip1
        ?.toString()
        .slice(3, 7) || '',
    president_address1:
      facilityStore?.facilityEditData?.president_address,
    president_tel:
      facilityStore?.facilityEditData?.president_tel,
    president_email:
      facilityStore?.facilityEditData?.president_email,

    manager: {
      avatar: avatarManagerUrl,
      email: facilityStore?.facilityEditData?.manager_email,
      first_name:
        facilityStore?.facilityEditData?.manager_first_name,
      first_name_kana:
        facilityStore?.facilityEditData
          ?.manager_first_name_kata,
      zip1:
        facilityStore?.facilityEditData?.manager_zip1
          ?.toString()
          .slice(0, 3) || '',
      zip2:
        facilityStore?.facilityEditData?.manager_zip1
          ?.toString()
          .slice(3, 7) || '',
      address:
        facilityStore?.facilityEditData?.manager_address,
      tel: facilityStore?.facilityEditData?.manager_tel,
    },
  }

  $api.facility
    .update(params, id)
    .then((e) => {
      const newUserData = {
        ...userStore.userData,
        first_name: e.data.manager.first_name,
        first_name_kana: e.data.manager.first_name_kana,
        url_avatar: e.data.manager.url_avatar,
        avatar: e.data.manager.avatar,
      }
      userStore.userData = newUserData
      localStorage.setItem(
        CookieKeyEnum.USER_DATA,
        JSON.stringify(userStore.userData)
      )
      alert.value = t(
        'pages.trainer_settings.message_success'
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
        alert.value = 'error'
      }
      isSubmitError.value = true
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
    })
}

const onCloseAlert = () => {
  if (isSubmitError.value) {
    router.back()
  } else {
    facilityStore.facilityEditData = null
    router.push(`/app/${userStore.roleName}/setting`)
  }
}

onBeforeMount(() => {
  if (!facilityStore.facilityEditData) {
    useRouter().replace(`/app/${userStore.roleName}/edit`)
  }
})
</script>

<template>
  <div>
    <PageWrapper class="flex-1 flex">
      <PageBody class="flex-1 flex flex-col">
        <PageSection
          class="flex-1 w-full"
          :list-breadcrumbs="listBreadcrumbs"
          :title-page="
            $t('pages.user_edit_info_confirmation.title')
          "
        >
          <div v-if="!isLoadingPage" class="laptop:w-3/4">
            <div
              class="mt-29px text-22px font-bold custom-line-height"
            >
              {{ $t('pages.facility_detail.information') }}
            </div>
            <img
              class="mt-24px w-116px h-116px mb-8px rounded-full object-contain"
              :src="avatarDisplay"
            />
            <div class="row-info mt-5px">
              <div class="label">
                {{ $t('pages.facility_detail.name') }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData?.name
                    ? facilityStore.facilityEditData?.name
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t('pages.facility_detail.name_furigana')
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData?.name_kata
                    ? facilityStore.facilityEditData
                        ?.name_kata
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t(
                    'pages.facility_detail.facility_address'
                  )
                }}
              </div>
              <div class="value flex flex-col gap-8px">
                <template
                  v-if="
                    !facilityStore.facilityEditData?.zip1 &&
                    !facilityStore.facilityEditData?.address
                  "
                >
                  {{ $t('others.empty') }}
                </template>
                <template v-else>
                  <span>
                    {{
                      getFullPostalCode(
                        facilityStore.facilityEditData?.zip1
                      ) || $t('others.empty')
                    }}
                  </span>
                  <span>
                    {{
                      facilityStore.facilityEditData
                        ?.address
                        ? facilityStore.facilityEditData
                            ?.address
                        : $t('others.empty')
                    }}
                  </span>
                </template>
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.facility_detail.phone') }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData?.tel
                    ? facilityStore.facilityEditData?.tel
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.facility_detail.fax') }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData?.fax
                    ? facilityStore.facilityEditData?.fax
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.email') }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData?.email
                    ? facilityStore.facilityEditData?.email
                    : $t('others.empty')
                }}
                <button
                  v-if="
                    facilityStore.facilityEditData?.email
                  "
                  class="icon-copy-line pl-20px cursor-pointer"
                  :value="
                    facilityStore.facilityEditData?.email
                  "
                  @click="
                    copyClipboard($event.target.value)
                  "
                ></button>
              </div>
            </div>

            <div class="mt-65px text-22px font-bold">
              {{
                $t('pages.facility_detail.representative')
              }}
            </div>
            <div class="row-info mt-6px">
              <div class="label">
                {{
                  $t(
                    'pages.facility_detail.representative_name'
                  )
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.president_first_name
                    ? facilityStore.facilityEditData
                        ?.president_first_name
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t(
                    'pages.facility_detail.person_in_charge_furigana'
                  )
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.president_first_name_kata
                    ? facilityStore.facilityEditData
                        ?.president_first_name_kata
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.user_edit.address') }}
              </div>
              <div class="value flex flex-col gap-8px">
                <template
                  v-if="
                    !facilityStore.facilityEditData
                      ?.president_zip1 &&
                    !facilityStore.facilityEditData
                      ?.president_address
                  "
                >
                  {{ $t('others.empty') }}
                </template>
                <template v-else>
                  <span>
                    {{
                      getFullPostalCode(
                        facilityStore.facilityEditData
                          ?.president_zip1
                      ) || $t('others.empty')
                    }}
                  </span>
                  <span>
                    {{
                      facilityStore.facilityEditData
                        ?.president_address
                        ? facilityStore.facilityEditData
                            ?.president_address
                        : $t('others.empty')
                    }}
                  </span>
                </template>
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t('pages.user_registration.phone_number')
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.president_tel
                    ? facilityStore.facilityEditData
                        ?.president_tel
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.user_edit.email') }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.president_email
                    ? facilityStore.facilityEditData
                        ?.president_email
                    : $t('others.empty')
                }}
                <button
                  v-if="
                    facilityStore.facilityEditData
                      ?.president_email
                  "
                  class="icon-copy-line pl-20px cursor-pointer"
                  :value="
                    facilityStore.facilityEditData
                      ?.president_email
                  "
                  @click="
                    copyClipboard($event.target.value)
                  "
                ></button>
              </div>
            </div>

            <div class="mt-65px text-22px font-bold">
              {{ $t('pages.facility_detail.manager') }}
            </div>
            <img
              class="mt-24px w-116px h-116px mb-8px rounded-full object-contain"
              :src="avatarManagerDisplay"
            />
            <div class="row-info mt-6px">
              <div class="label">
                {{
                  $t(
                    'pages.facility_detail.person_in_charge'
                  )
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.manager_first_name
                    ? facilityStore.facilityEditData
                        ?.manager_first_name
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t(
                    'pages.facility_detail.person_in_charge_furigana'
                  )
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.manager_first_name_kata
                    ? facilityStore.facilityEditData
                        ?.manager_first_name_kata
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.user_edit.address') }}
              </div>
              <div class="value flex flex-col gap-8px">
                <template
                  v-if="
                    !facilityStore.facilityEditData
                      ?.manager_zip1 &&
                    !facilityStore.facilityEditData
                      ?.manager_address
                  "
                >
                  {{ $t('others.empty') }}
                </template>
                <template v-else>
                  <span>
                    {{
                      getFullPostalCode(
                        facilityStore.facilityEditData
                          ?.manager_zip1
                      ) || $t('others.empty')
                    }}
                  </span>
                  <span>
                    {{
                      facilityStore.facilityEditData
                        ?.manager_address
                        ? facilityStore.facilityEditData
                            ?.manager_address
                        : $t('others.empty')
                    }}
                  </span>
                </template>
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t('pages.user_registration.phone_number')
                }}
              </div>
              <div class="value">
                {{
                  facilityStore.facilityEditData
                    ?.manager_tel
                    ? facilityStore.facilityEditData
                        ?.manager_tel
                    : $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.user_edit.user_id') }}
              </div>
              <div class="value flex">
                {{
                  facilityStore.facilityEditData
                    ?.manager_email
                    ? facilityStore.facilityEditData
                        ?.manager_email
                    : $t('others.empty')
                }}
                <span
                  v-if="
                    facilityStore.facilityDetail?.manager
                      ?.email
                  "
                  v-tooltip="{
                    content: `${$t(
                      'pages.facility_edit.tooltip_email_content'
                    )}`,
                  }"
                  class="ml-10px icon-exclamation-circle tooltip"
                ></span>
              </div>
            </div>

            <div class="flex gap-31px mt-38px">
              <Button
                :theme="RoleEnum.ADMIN"
                type="outline"
                @click="$router.back()"
              >
                {{ $t('pages.user_registration.fix') }}
              </Button>
              <Button
                :theme="RoleEnum.ADMIN"
                @click="
                  $showModal(
                    ModalNameEnum.CONFIRM_REGISTER_MEMBER
                  )
                "
              >
                {{ $t('components.button.save') }}
              </Button>
            </div>
          </div>
          <Loading
            v-if="isLoadingPage"
            :theme="RoleEnum.ADMIN"
            class="absolute w-full h-screen top-0 left-0"
          />

          <ModalWrapper
            :id="ModalNameEnum.CONFIRM_REGISTER_MEMBER"
            content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
          >
            <div
              class="text-22px leading-22px font-bold title"
            >
              {{ $t('others.title_modal_confirm') }}
            </div>
            <div class="text-16px leading-16px sub-title">
              {{
                $t('pages.trainer_settings.message_confirm')
              }}
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
                $hiddenModal(
                  ModalNameEnum.CONFIRM_REGISTER_MEMBER
                )
              "
            >
              {{ $t('components.button.cancel') }}
            </div>
          </ModalWrapper>
          <ModalWrapper
            :id="ModalNameEnum.ALERT_REGISTER_MEMBER"
            content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
          >
            <div
              class="text-22px leading-22px font-bold title"
            >
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
        </PageSection>
      </PageBody>
    </PageWrapper>
  </div>
</template>

<style lang="scss" scoped>
:deep(.form-checkbox__icon) {
  font-size: 22px;
  position: relative;
  // top: -10px;
}
.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  color: $color-black-1;
}

.row-info {
  display: flex;
  //gap: 59px;
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
    width: 180px;

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
</style>
