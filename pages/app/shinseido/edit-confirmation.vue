<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useTrainer } from '@/stores/trainer'
import { GENDERS } from '@/constants/common'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'
import { TrainerCreateParams } from '@/interfaces/trainer'
import { ImageDefaultEnum } from '@/constants/image'
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
    route: { name: '' },
  },
]

const isLoadingPage = ref(false)
const {
  getFullAddress,
  getFullName,
  copyClipboard,
  getFullPostalCode,
} = useHelper()
const trainerStore = useTrainer()
const userStore = useUser()
const alert = ref<string>('')
const { t } = useLang()
const { $api, $showModal, $hiddenModal } = useNuxtApp()
const config = useRuntimeConfig()
const { uploadFile } = useUpload()
const isSubmitError = ref<boolean>(false)
const router = useRouter()
const route = useRoute()

const gender = computed(() => {
  if (trainerStore.trainerEditData?.sex) {
    return GENDERS[Number(trainerStore.trainerEditData.sex)]
  }
  return ''
})

const avatarDisplay = computed(() => {
  if (!trainerStore.trainerEditData?.avatar)
    return ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
  if (
    typeof trainerStore.trainerEditData?.avatar === 'string'
  ) {
    return trainerStore.trainerEditData?.avatar
  } else {
    return URL.createObjectURL(
      trainerStore.trainerEditData?.avatar as File
    )
  }
})

// Methods
const confirm = async () => {
  $hiddenModal(ModalNameEnum.CONFIRM_REGISTER_MEMBER)
  let avatarUrl = ''

  if (
    typeof trainerStore.trainerEditData?.avatar === 'string'
  ) {
    avatarUrl =
      trainerStore.trainerEditData?.avatar.replace(
        `${config.public.apiCloud}/`,
        ''
      )
  } else if (trainerStore.trainerEditData?.avatar) {
    avatarUrl = await uploadFile(
      trainerStore.trainerEditData?.avatar as File
    )
    if (avatarUrl === 'ERROR') {
      avatarUrl = ''
      alert.value = t('others.upload_error')
      $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      return
    }
  }

  const id = userStore.userData?.id as string | number
  const year =
    trainerStore?.trainerEditData?.year.replace(
      t('components.datepicker.year'),
      ''
    ) || ''
  const month =
    trainerStore?.trainerEditData?.month?.replace(
      t('components.datepicker.month'),
      ''
    ) || ''
  const day =
    trainerStore?.trainerEditData?.day?.replace(
      t('components.datepicker.day'),
      ''
    ) || ''

  const params = {
    avatar: avatarUrl,
    last_name: trainerStore?.trainerEditData?.last_name,
    first_name: trainerStore?.trainerEditData?.first_name,
    last_name_kana:
      trainerStore?.trainerEditData?.last_name_kana,
    first_name_kana:
      trainerStore?.trainerEditData?.first_name_kana,
    zip1:
      trainerStore?.trainerEditData?.zip1
        ?.toString()
        .slice(0, 3) || '',
    zip2:
      trainerStore?.trainerEditData?.zip1
        ?.toString()
        .slice(3, 7) || '',
    address: trainerStore?.trainerEditData?.address,
    building_name:
      trainerStore?.trainerEditData?.building_name,
    birthday:
      year +
      '-' +
      ('0' + month).slice(-2) +
      '-' +
      ('0' + day).slice(-2),
    sex: trainerStore?.trainerEditData?.sex,
    tel: trainerStore?.trainerEditData?.tel,
    memo: trainerStore?.trainerEditData?.memo,
    email: trainerStore?.trainerEditData?.email,
  } as TrainerCreateParams

  $api.trainer
    .updateUser(params, id)
    .then((e) => {
      userStore.userData = e.data
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
    trainerStore.trainerEditData = null
    router.push(`/app/${userStore.roleName}/setting`)
  }
}

onBeforeMount(() => {
  if (!trainerStore.trainerEditData) {
    useRouter().replace(`/app/${userStore.roleName}/edit`)
  }
})

onBeforeRouteLeave((to) => {
  if (to.name !== `app-${userStore.roleName}-edit`) {
    trainerStore.trainerEditData = null
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
          <div
            v-if="!isLoadingPage"
            class="laptop:w-3/4 mt-37px"
          >
            <img
              class="mt-24px w-116px h-116px mb-8px rounded-full object-contain"
              :src="avatarDisplay"
            />
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.email') }}
              </div>
              <div class="value">
                {{ trainerStore.trainerEditData?.email }}
                <button
                  class="icon-copy-line pl-20px cursor-pointer"
                  :value="
                    trainerStore.trainerEditData?.email
                  "
                  @click="
                    copyClipboard($event.target.value)
                  "
                ></button>
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.name') }}
              </div>
              <div class="value">
                {{
                  getFullName(
                    trainerStore.trainerEditData?.last_name,
                    trainerStore.trainerEditData?.first_name
                  )
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t('pages.trainer_detail.name_furigana')
                }}
              </div>
              <div class="value">
                {{
                  getFullName(
                    trainerStore.trainerEditData
                      ?.last_name_kana,
                    trainerStore.trainerEditData
                      ?.first_name_kana
                  )
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.address') }}
              </div>
              <div class="value flex flex-col gap-8px">
                <template
                  v-if="
                    !trainerStore.trainerEditData?.zip1 &&
                    !trainerStore.trainerEditData
                      ?.address &&
                    !trainerStore.trainerEditData
                      ?.building_name
                  "
                >
                  {{ $t('others.empty') }}
                </template>
                <template v-else>
                  <span>
                    {{
                      getFullPostalCode(
                        trainerStore.trainerEditData?.zip1
                      ) || $t('others.empty')
                    }}
                  </span>
                  <span class="whitespace">
                    {{
                      getFullAddress(
                        trainerStore.trainerEditData
                          ?.address,
                        trainerStore.trainerEditData
                          ?.building_name
                      ) || $t('others.empty')
                    }}
                  </span>
                </template>
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.birth_day') }}
              </div>
              <div class="value">
                <span>
                  {{ trainerStore.trainerEditData?.year }}
                </span>
                <span>
                  {{
                    trainerStore.trainerEditData?.month
                      .length === 2
                      ? '0' +
                        trainerStore.trainerEditData?.month
                      : trainerStore.trainerEditData?.month
                  }}
                </span>
                <span>
                  {{
                    trainerStore.trainerEditData?.day
                      .length === 2
                      ? '0' +
                        trainerStore.trainerEditData?.day
                      : trainerStore.trainerEditData?.day
                  }}
                </span>
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.gender') }}
              </div>
              <div class="value">
                {{
                  $t(gender) || $t('others.gender_others')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.phone') }}
              </div>
              <div class="value">
                {{
                  trainerStore.trainerEditData?.tel ||
                  $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.remarks') }}
              </div>
              <div class="value whitespace">
                {{
                  trainerStore.trainerEditData?.memo
                    ? trainerStore.trainerEditData?.memo.trim()
                    : $t('others.empty')
                }}
              </div>
            </div>

            <div class="flex gap-31px mt-38px">
              <Button
                :theme="RoleEnum.ADMINISTRANTOR"
                type="outline"
                @click="$router.back()"
              >
                {{ $t('pages.user_registration.fix') }}
              </Button>
              <Button
                :theme="RoleEnum.ADMINISTRANTOR"
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
            :theme="RoleEnum.ADMINISTRANTOR"
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

.whitespace {
  line-height: 1.5 !important;
  white-space: pre-wrap;
}
</style>
