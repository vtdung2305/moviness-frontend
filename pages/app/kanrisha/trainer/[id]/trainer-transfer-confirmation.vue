<script lang="ts" setup>
import moment from 'moment'
import { MenuItemBase } from '@/interfaces/menu'
import { useUser } from '@/stores/user'
import { useTrainer } from '@/stores/trainer'
import { RoleEnum } from '@/constants/role'
import { GENDERS } from '@/constants/common'
import { ModalNameEnum } from '@/constants/modal'
import { TrainerStatusEnum } from '@/constants/trainer'
import { useCommon } from '@/stores'
import { ImageDefaultEnum } from '@/constants/image'

definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_list',
    route: { name: 'app-kanrisha-trainer' },
  },
  {
    text: 'components.menu.trainer_detail',
    route: { name: 'app-kanrisha-trainer-id' },
  },
  {
    text: 'components.menu.trainer_transfer_confirmation_2',
    route: { name: '' },
  },
]

const userStore = useUser()
const check = ref<boolean>(false)
const isLoadingPage = ref(false)
const trainerStore = useTrainer()
const route = useRoute()
const { getFullName, copyClipboard, getFullAddress } =
  useHelper()
const { t } = useLang()
const message = ref<string>('')
const isSubmitError = ref<boolean>(false)
const router = useRouter()
const { $api, $showModal, $hiddenModal } = useNuxtApp()
const commonStore = useCommon()

const getTrainerDetail = async () => {
  isLoadingPage.value = true
  const id = route.params.id
  await trainerStore.getTrainerDetail(id as string)
  isLoadingPage.value = false
}

const avatarDisplay = computed(() => {
  return trainerStore.trainerDetail?.url_avatar
    ? trainerStore.trainerDetail?.url_avatar
    : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
})

const gender = computed(() => {
  if (trainerStore.trainerDetail?.sex) {
    return GENDERS[Number(trainerStore.trainerDetail.sex)]
  }
  return ''
})

const birthDay = computed(() => {
  const check = moment(
    trainerStore.trainerDetail?.birthday,
    'YYYY/MM/DD'
  )

  const month = check.format('MM')
  const day = check.format('DD')
  const year = check.format('YYYY')
  return t('pages.group_registration_confirmation.date', {
    year,
    month,
    day,
  })
})

const dateTime = computed(() => {
  if (!trainerStore.trainerDetail?.last_login) return ''
  const check = moment(
    trainerStore.trainerDetail?.last_login,
    'YYYY/MM/DD HH:mm'
  )

  const month = check.format('MM')
  const day = check.format('DD')
  const year = check.format('YYYY')
  const hour = check.format('HH')
  const minute = check.format('mm')
  return t('pages.trainer_detail.date', {
    year,
    month,
    day,
    hour,
    minute,
  })
})

const statusAccount = computed(() => {
  switch (trainerStore.trainerDetail?.status) {
    case TrainerStatusEnum.INVALID:
      return t('pages.trainer_detail.invalid')
    case TrainerStatusEnum.VALID:
      return t('pages.trainer_detail.valid')
    case TrainerStatusEnum.BLOCK:
      return t('pages.trainer_detail.block')
  }
})

const labelTrainer = computed(() => {
  switch (trainerStore.trainerDetail?.status) {
    case TrainerStatusEnum.INVALID:
      return t(
        'components.menu.trainer_transfer_confirmation_2'
      )
    case TrainerStatusEnum.VALID:
      return t(
        'components.menu.trainer_transfer_confirmation'
      )
    case TrainerStatusEnum.BLOCK:
      return t(
        'components.menu.trainer_transfer_confirmation'
      )
  }
})

const labelButton = computed(() => {
  switch (trainerStore.trainerDetail?.status) {
    case TrainerStatusEnum.INVALID:
      return t(
        'pages.trainer_detail.title_button_responsible'
      )
    case TrainerStatusEnum.VALID:
      return t(
        'pages.trainer_detail.title_button_non_responsible'
      )
    case TrainerStatusEnum.BLOCK:
      return t(
        'pages.trainer_detail.title_button_non_responsible'
      )
  }
})

const handleTrainerTransfer = () => {
  if (
    trainerStore.trainerDetail?.status ===
    TrainerStatusEnum.INVALID
  ) {
    $showModal(ModalNameEnum.UPDATE_TRAINER_STATUS)
  } else {
    $api.trainer
      .updateTrainerStatus(
        trainerStore.trainerDetail?.id as string | number,
        TrainerStatusEnum.INVALID
      )
      .then(() => {
        message.value = t(
          'pages.trainer_detail.message_trainer_leaving_success'
        )
        commonStore.setStatusModal(true)
        isSubmitError.value = false
        $showModal(
          ModalNameEnum.ALERT_UPDATE_TRAINER_STATUS
        )
      })
      .catch((e) => {
        commonStore.setStatusModal(true)
        message.value = t('others.server_error')
        isSubmitError.value = true
        $showModal(
          ModalNameEnum.ALERT_UPDATE_TRAINER_STATUS
        )
      })
  }
}

const confirmUpdateTrainerStatus = () => {
  $hiddenModal(ModalNameEnum.UPDATE_TRAINER_STATUS)

  $api.trainer
    .updateTrainerStatus(
      trainerStore.trainerDetail?.id as string | number,
      TrainerStatusEnum.VALID
    )
    .then(() => {
      message.value = t(
        'pages.trainer_detail.message_success_change_status'
      )
      commonStore.setStatusModal(true)
      isSubmitError.value = false
      $showModal(ModalNameEnum.ALERT_UPDATE_TRAINER_STATUS)
    })
    .catch((e) => {
      commonStore.setStatusModal(true)
      message.value =
        e.response?._data?.message ||
        t('others.server_error')
      isSubmitError.value = true
      $showModal(ModalNameEnum.ALERT_UPDATE_TRAINER_STATUS)
    })
}

const onCloseAlert = () => {
  const id = route.params.id
  if (isSubmitError.value) {
    router.back()
  } else {
    router.push(`/app/${userStore.roleName}/trainer/${id}`)
  }
}

const isOpenModal = computed(() => commonStore.showModal)

watch(isOpenModal, () => {
  if (!isOpenModal.value) {
    return router.back()
  }
})

onMounted(() => {
  getTrainerDetail()
})
</script>

<template>
  <div>
    <PageWrapper class="flex-1 flex">
      <PageBody class="flex-1 flex flex-col">
        <PageSection
          class="flex-1 w-full"
          :list-breadcrumbs="listBreadcrumbs"
          :title-page="labelTrainer"
        >
          <div v-if="!isLoadingPage" class="laptop:w-3/4">
            <img
              class="mt-24px w-116px h-116px mb-8px rounded-full"
              :src="avatarDisplay"
            />
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.email') }}
              </div>
              <div class="value">
                {{ trainerStore.trainerDetail?.email }}
                <button
                  class="icon-copy-line pl-20px cursor-pointer"
                  :value="trainerStore.trainerDetail?.email"
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
                    trainerStore.trainerDetail?.last_name,
                    trainerStore.trainerDetail?.first_name
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
                    trainerStore.trainerDetail
                      ?.last_name_kana,
                    trainerStore.trainerDetail
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
                    !trainerStore.trainerDetail?.zip1 &&
                    !trainerStore.trainerDetail?.address &&
                    !trainerStore.trainerDetail
                      ?.building_name
                  "
                >
                  {{ $t('others.empty') }}
                </template>
                <template v-else>
                  <span>
                    {{
                      trainerStore.trainerDetail?.zip1
                        ? $t(
                            'pages.user_detail.address_symbol'
                          ) +
                          trainerStore.trainerDetail?.zip1 +
                          '-' +
                          trainerStore.trainerDetail?.zip2
                        : $t('others.empty')
                    }}
                  </span>
                  <span>
                    {{
                      getFullAddress(
                        trainerStore.trainerDetail?.address,
                        trainerStore.trainerDetail
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
                <span>{{
                  birthDay || $t('others.empty')
                }}</span>
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
                  trainerStore.trainerDetail?.tel ||
                  $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.remarks') }}
              </div>
              <div class="value">
                {{
                  trainerStore.trainerDetail?.memo ||
                  $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{
                  $t('pages.trainer_detail.account_status')
                }}
              </div>
              <div class="value whitespace-pre-line">
                {{ statusAccount || $t('others.empty') }}
              </div>
            </div>
            <div class="row-info mb-28px">
              <div class="label">
                {{ $t('pages.trainer_detail.last_login') }}
              </div>
              <div class="value whitespace-pre-line">
                {{ dateTime || $t('others.empty') }}
              </div>
            </div>
            <div
              v-if="
                trainerStore.trainerDetail?.status !==
                TrainerStatusEnum.INVALID
              "
              class="note flex items-start"
            >
              <FormCheckbox
                v-model="check"
                :theme="userStore.roleName"
                class="checkbox pt-4px"
              >
              </FormCheckbox>
              <span>
                {{ $t('pages.trainer_detail.note') }}
              </span>
            </div>
            <div
              v-if="
                trainerStore.trainerDetail?.status ===
                TrainerStatusEnum.INVALID
              "
              class="flex gap-31px mt-16px"
            >
              <Button @click="handleTrainerTransfer()">
                {{ labelButton }}
              </Button>
            </div>
            <div v-else class="flex gap-31px mt-16px">
              <Button
                :class="{
                  disabled: !check,
                  'color-red': check,
                }"
                @click="handleTrainerTransfer()"
              >
                {{ labelButton }}
              </Button>
            </div>
          </div>
          <Loading
            v-if="isLoadingPage"
            :theme="RoleEnum.ADMIN"
            class="absolute w-full h-screen top-0 left-0"
          />
        </PageSection>
      </PageBody>
    </PageWrapper>
    <ModalWrapper
      :id="ModalNameEnum.UPDATE_TRAINER_STATUS"
      content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
    >
      <div class="text-22px leading-22px font-bold title">
        {{ $t('others.title_modal_confirm') }}
      </div>
      <div class="text-16px leading-16px sub-title">
        {{
          $t(
            'pages.trainer_detail.message_confirm_change_status'
          )
        }}
      </div>
      <Button
        type="primary"
        class="w-280px h-52px"
        :theme="userStore.roleName"
        @click="confirmUpdateTrainerStatus"
      >
        {{
          $t(
            'pages.trainer_detail.title_button_change_status'
          )
        }}
      </Button>
      <div
        class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
        @click="
          $hiddenModal(ModalNameEnum.UPDATE_TRAINER_STATUS)
        "
      >
        {{ $t('components.button.cancel') }}
      </div>
    </ModalWrapper>
    <ModalWrapper
      :id="ModalNameEnum.ALERT_UPDATE_TRAINER_STATUS"
      content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
    >
      <div class="text-22px leading-22px font-bold title">
        {{ $t('others.title_modal_common') }}
      </div>
      <div class="text-16px leading-16px sub-title">
        {{ message }}
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.button-shinseido.primary) {
  background-image: $gradient-90-kanrisha;
  color: $color-white;
}

:deep(.page-section__title) {
  margin-bottom: 42px;
  margin-top: 26px;
}

:deep(.form-checkbox__icon) {
  font-size: 22px;
  position: relative;
  // top: -10px;
}

:deep(.button-shinseido.color-red) {
  background-image: unset;
  background: $color-red-1;
}

:deep(.button-shinseido.disabled) {
  background-image: unset;
  background: $color-gray-2;
  pointer-events: none;

  &:hover {
    opacity: unset;
    transition: unset;
  }
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
