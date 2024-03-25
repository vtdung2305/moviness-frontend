<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'
import { TrainerStatusEnum } from '@/constants/trainer'

definePageMeta({
  layout: 'page',
})

const { getFullName, copyClipboard, getFullAddress } =
  useHelper()
const userStore = useUser()
const { $api, $showModal, $hiddenModal } = useNuxtApp()

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
    route: { name: '' },
  },
]

const {
  trainerDetail,
  fullName,
  currentPage,
  groupsData,
  meta,
  tab,
  isLoadingPage,
  avatarDisplay,
  gender,
  dateTime,
  birthDay,
  statusAccount,
  statusTrainer,
  labelButton,
  dateTimeLock,
  handleChangeTab,
  handleViewDetailGroup,
} = useTrainerDetail()

const unBlock = () => {
  $showModal(ModalNameEnum.UN_BLOCK)
}

const { t } = useLang()
const message = ref<string>('')
const isSubmitError = ref<boolean>(false)
const router = useRouter()
const route = useRoute()

const confirmUnBlock = () => {
  $hiddenModal(ModalNameEnum.UN_BLOCK)

  $api.trainer
    .unblock(trainerDetail?.value?.id as string | number)
    .then(() => {
      message.value = t(
        'pages.trainer_detail.message_unblocked_success'
      )
      isSubmitError.value = false
      $showModal(ModalNameEnum.ALERT_UN_BLOCK)
    })
    .catch((e) => {
      message.value = t('others.server_error')
      isSubmitError.value = true
      $showModal(ModalNameEnum.ALERT_UN_BLOCK)
    })
}

const onCloseAlert = () => {
  const id = route.params.id
  if (isSubmitError.value) {
    router.back()
  } else {
    router.go(0)
  }
}

const handleTrainerTransfer = (id: number | string) => {
  const role = userStore.roleName
  router.push(
    `/app/${role}/trainer/${id}/trainer-transfer-confirmation`
  )
}
</script>

<template>
  <div>
    <PageWrapper class="flex-1 flex">
      <PageBody class="flex-1 flex flex-col">
        <PageSection
          class="flex-1 w-full relative"
          :list-breadcrumbs="listBreadcrumbs"
          :title-page="$t('pages.trainer_detail.title')"
        >
          <div
            v-if="!isLoadingPage"
            class="group-detail w-full"
          >
            <div class="flex items-center gap-x-6">
              <div
                class="trainer-detail__image rounded-full overflow-hidden bg-white"
              >
                <img
                  alt="トレーナー"
                  :src="avatarDisplay"
                  class="w-full h-full object-contain"
                />
              </div>
              <div>
                <div class="text-xl leading-27px font-bold">
                  {{ fullName }}
                </div>
                <div class="text-base leading-21px mt-11px">
                  <span
                    class="icon-phone text-17px mr-3px"
                  />
                  {{
                    trainerDetail?.tel || $t('others.empty')
                  }}
                </div>
              </div>
            </div>
            <div
              class="trainer-detail__tabs flex mt-37px w-max overflow-hidden"
            >
              <div
                class="trainer-detail__tab-1"
                :class="{ active: tab === 1 }"
                @click="handleChangeTab(1)"
              >
                {{
                  $t(
                    'pages.trainer_detail.personal_information'
                  )
                }}
              </div>
              <div
                class="trainer-detail__tab-2"
                :class="{ active: tab === 2 }"
                @click="handleChangeTab(2)"
              >
                {{
                  $t(
                    'pages.trainer_detail.group_in_charge',
                    {
                      total: meta?.total || 0,
                    }
                  )
                }}
              </div>
            </div>
            <div v-if="tab === 1">
              <div class="desktop:w-3/4 mt-14px">
                <div class="row-info">
                  <div class="label">
                    {{ $t('pages.trainer_detail.email') }}
                  </div>
                  <div class="value">
                    {{ trainerDetail?.email }}
                    <button
                      class="icon-copy-line pl-20px cursor-pointer"
                      :value="trainerDetail?.email"
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
                    {{ fullName }}
                  </div>
                </div>
                <div class="row-info">
                  <div class="label">
                    {{
                      $t(
                        'pages.trainer_detail.name_furigana'
                      )
                    }}
                  </div>
                  <div class="value">
                    {{
                      getFullName(
                        trainerDetail?.last_name_kana,
                        trainerDetail?.first_name_kana
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
                        !trainerDetail?.zip1 &&
                        !trainerDetail?.address &&
                        !trainerDetail?.building_name
                      "
                    >
                      {{ $t('others.empty') }}
                    </template>
                    <template v-else>
                      <span>
                        {{
                          trainerDetail?.zip1
                            ? $t(
                                'pages.user_detail.address_symbol'
                              ) +
                              trainerDetail?.zip1 +
                              '-' +
                              trainerDetail?.zip2
                            : $t('others.empty')
                        }}
                      </span>
                      <span>
                        {{
                          getFullAddress(
                            trainerDetail?.address,
                            trainerDetail?.building_name
                          ) || $t('others.empty')
                        }}
                      </span>
                    </template>
                  </div>
                </div>
                <div class="row-info">
                  <div class="label">
                    {{
                      $t('pages.trainer_detail.birth_day')
                    }}
                  </div>
                  <div class="value">
                    {{ birthDay || $t('others.empty') }}
                  </div>
                </div>
                <div class="row-info">
                  <div class="label">
                    {{ $t('pages.trainer_detail.gender') }}
                  </div>
                  <div class="value">
                    {{
                      $t(gender) ||
                      $t('others.gender_others')
                    }}
                  </div>
                </div>
                <div class="row-info">
                  <div class="label">
                    {{
                      $t('pages.trainer_detail.situation')
                    }}
                  </div>
                  <div class="value">
                    {{
                      statusTrainer || $t('others.empty')
                    }}
                  </div>
                </div>
                <div class="row-info">
                  <div class="label">
                    {{ $t('pages.trainer_detail.remarks') }}
                  </div>
                  <div class="value whitespace">
                    {{
                      trainerDetail?.memo ||
                      $t('others.empty')
                    }}
                  </div>
                </div>
                <div class="title mt-64px mb-7px">
                  {{ $t('pages.trainer_detail.account') }}
                </div>
                <div class="row-info">
                  <div class="label">
                    {{
                      $t(
                        'pages.trainer_detail.account_status'
                      )
                    }}
                  </div>
                  <div class="value">
                    <span>
                      {{
                        statusAccount || $t('others.empty')
                      }}
                    </span>
                    <span
                      v-if="
                        trainerDetail?.status ===
                        TrainerStatusEnum.BLOCK
                      "
                      class="ml-22px unblock cursor-pointer"
                      @click="unBlock()"
                      >{{
                        $t('pages.trainer_detail.un_block')
                      }}</span
                    >
                  </div>
                </div>
                <div
                  v-if="
                    trainerDetail?.status ===
                    TrainerStatusEnum.BLOCK
                  "
                  class="row-info"
                >
                  <div class="label">
                    {{
                      $t('pages.trainer_detail.date_block')
                    }}
                  </div>
                  <div class="value">
                    {{ dateTimeLock || $t('others.empty') }}
                  </div>
                </div>
                <div class="row-info mb-32px">
                  <div class="label">
                    {{
                      $t('pages.trainer_detail.last_login')
                    }}
                  </div>
                  <div class="value">
                    {{ dateTime || $t('others.empty') }}
                  </div>
                </div>

                <div class="title mt-64px mb-7px">
                  {{
                    $t(
                      'pages.trainer_detail.title_number_group_user'
                    )
                  }}
                </div>
                <div class="row-info mt-6px">
                  <div class="label">
                    {{ $t('pages.plan_list.group_count') }}
                  </div>
                  <div class="value">
                    {{ trainerDetail?.total_group
                    }}{{ $t('pages.setting.group_unit') }}
                  </div>
                </div>
                <div class="row-info">
                  <div class="label">
                    {{ $t('pages.plan_list.member_count') }}
                  </div>
                  <div class="value">
                    {{ trainerDetail?.total_member
                    }}{{ $t('pages.trainer_list.people') }}
                  </div>
                </div>
                <!-- <Button
                  :theme="userStore.roleName"
                  class="mt-38px"
                  @click="handleEditTrainer()"
                >
                  {{ $t('pages.trainer_detail.update') }}
                </Button> -->
                <div class="flex justify-center">
                  <span
                    class="cancel mt-22px cursor-pointer"
                    :class="{
                      join:
                        trainerDetail?.status ===
                        TrainerStatusEnum.INVALID,
                    }"
                    @click="
                      handleTrainerTransfer(
                        trainerDetail?.id as number
                      )
                    "
                  >
                    {{ labelButton }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="tab === 2">
              <template
                v-if="groupsData && groupsData.length"
              >
                <HeaderLists
                  :show-total="false"
                  :number-subject="meta?.total || 0"
                  :total-subject="meta?.total || 0"
                  :min-page="meta?.from || 0"
                  :max-page="meta?.to || 0"
                  class="mb-22px"
                />
                <div
                  class="grid grid-cols-1 desktop:grid-cols-2 gap-8 <sm:gap-4"
                >
                  <GroupCard
                    v-for="(item, index) in groupsData"
                    :key="index"
                    class="cursor-pointer"
                    :group="item"
                    @click="handleViewDetailGroup(item.id)"
                  />
                </div>
                <Pagination
                  v-if="meta?.last_page > 1"
                  :current-page="currentPage"
                  :total-items="meta?.total"
                  :per-page="meta?.per_page"
                  class="mt-8"
                  :theme="RoleEnum.ADMIN"
                  @page-changed="currentPage = $event"
                />
              </template>
              <div
                v-else
                class="w-full h-300px flex items-center justify-center"
              >
                {{ $t('pages.group_detail.no_data') }}
              </div>
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
      :id="ModalNameEnum.UN_BLOCK"
      content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
    >
      <div class="text-22px leading-22px font-bold title">
        {{ $t('others.title_modal_confirm') }}
      </div>
      <div class="text-16px leading-16px sub-title">
        {{ $t('pages.trainer_detail.title_unblocked') }}
      </div>
      <Button
        type="primary"
        class="w-280px h-52px"
        :theme="userStore.roleName"
        @click="confirmUnBlock"
      >
        {{ $t('pages.trainer_detail.un_block') }}
      </Button>
      <div
        class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
        @click="$hiddenModal(ModalNameEnum.UN_BLOCK)"
      >
        {{ $t('components.button.cancel') }}
      </div>
    </ModalWrapper>
    <ModalWrapper
      :id="ModalNameEnum.ALERT_UN_BLOCK"
      content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
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
<style scoped lang="scss">
.trainer-detail {
  &__image {
    width: 72px;
    height: 72px;
  }
  &__tabs {
    background: $color-gray-3;
    color: $color-gray-2;
    border-radius: 20px;
    cursor: pointer;
    .active {
      font-weight: bold;
      color: $color-white-2;
      background: $color-kanrisha;
    }
  }
  &__tab-1 {
    padding: 9px 22px 10px 26px;
    &:hover {
      filter: brightness(1.1);
      opacity: 0.6;
      transition: 0.3s;
    }
  }
  &__tab-2 {
    padding: 9px 15px 10px 22px;
    &:hover {
      filter: brightness(1.1);
      opacity: 0.6;
      transition: 0.3s;
    }
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

.facility {
  display: inline-block;
  color: $color-shinseido;
  border-bottom: 1px solid $color-shinseido;
  margin-left: 25px;
}

.cancel {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 24px;
  font-size: 14px;
}

.join {
  color: #2cabdb;
  border-bottom: 1px solid #2cabdb;
}

.unblock {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 0.8;
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}

.whitespace {
  line-height: 1.5 !important;
  white-space: pre-wrap;
}
</style>
