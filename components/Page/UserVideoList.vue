<script lang="ts" setup>
import { PropType } from 'vue'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { userStatusList } from '@/constants/member'
import { useUser } from '@/stores/user'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const { getFullName, getFullAddress } = useHelper()
const userStore = useUser()
const router = useRouter()

const {
  isLoadingPage,
  avatarDisplay,
  fullName,
  tab,
  memberListVideo,
  level,
  meta,
  memberDetail,
  currentPage,
  dateTime,
  gender,
  groupName,
  memberStore,
  trainerName,
  age,
  status,
  disableButton,
  chartData,
  chartOptions,
  videoEvaluations,
  videosAllByMember,
  handleChangeTab,
  handleEditMember,
} = useUserVideoList()

const themeTrainer = computed(() => {
  return props.theme === RoleEnum.TRAINER
})

const themeKanrisha = computed(() => {
  return props.theme === RoleEnum.ADMIN
})

const themeShinseido = computed(() => {
  return props.theme === RoleEnum.ADMINISTRANTOR
})

const numericalOrder = (index: number) => {
  return (index < 10 ? '0' : '') + index
}

const handleViewDetailTrainer = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/trainer/${id}`)
}

const handleViewDetailGroup = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/group/${id}`)
}
</script>

<template>
  <div>
    <div
      v-if="!isLoadingPage"
      class="group-detail w-full min-h-screen"
    >
      <div class="flex items-center gap-x-6 desktop:w-3/4">
        <div
          class="user-detail__image min-w-72px rounded-full overflow-hidden bg-white"
        >
          <img
            alt=""
            :src="avatarDisplay"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <div
            class="text-xl leading-27px font-bold tracking-[.08em]"
          >
            {{ fullName || $t('others.empty') }}
          </div>
          <div
            class="text-base leading-21px mt-11px tracking-[.08em]"
          >
            {{ $t('pages.user_detail.function_level') }}:
            <span class="font-medium tracking-[.08em]">
              {{ level || $t('others.empty') }}
            </span>
          </div>
          <div
            class="noti flex justify-center items-center mt-6px"
            v-if="
              userStore.roleName === RoleEnum.TRAINER &&
              memberStore?.memberDetail?.trainer?.id !==
                userStore.userData?.id
            "
          >
            <img
              src="/images/exclamation-circle.svg"
              alt=""
            />
            <span class="tracking-[.08em] ml-3px mt-1px">
              {{
                getFullName(
                  memberStore?.memberDetail?.trainer
                    ?.last_name,
                  memberStore?.memberDetail?.trainer
                    ?.first_name
                )
              }}{{ $t('pages.user_detail.noti') }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="user-detail__tabs flex mt-10 w-max overflow-hidden"
        :class="{
          trainer: themeTrainer,
          kanrisha: themeKanrisha,
        }"
      >
        <div
          class="user-detail__tab tracking-[.08em]"
          :class="{
            active: tab === 1,
            disable:
              memberDetail?.status ===
              userStatusList[3].value,
          }"
          @click="handleChangeTab(1)"
        >
          {{ $t('pages.user_detail.list_video') }}
        </div>
        <div
          class="user-detail__tab tracking-[.08em]"
          :class="{
            active: tab === 3,
            disable:
              memberDetail?.status ===
              userStatusList[3].value,
          }"
          @click="handleChangeTab(3)"
        >
          {{ $t('pages.user_detail.grap_video') }}
        </div>
        <div
          class="user-detail__tab tracking-[.08em]"
          :class="{
            active: tab === 2,
            disable:
              memberDetail?.status ===
              userStatusList[3].value,
          }"
          @click="handleChangeTab(2)"
        >
          {{ $t('pages.user_detail.info_user') }}
        </div>
      </div>
      <div v-if="tab === 1">
        <template
          v-if="memberListVideo && memberListVideo.length"
        >
          <HeaderLists
            :show-total="false"
            :number-subject="meta?.total || 0"
            :total-subject="meta?.total || 0"
            :min-page="meta?.from || 0"
            :max-page="meta?.to || 0"
            class="mb-22px mt-10px tablet:-mt-10px desktop:w-3/4"
          />
          <div
            class="wrap grid grid-cols-1 desktop:grid-cols-1 gap-24px desktop:w-3/4"
          >
            <UserVideoCard
              v-for="(item, index) in memberListVideo"
              :key="index"
              :user="item"
              :index="
                (currentPage - 1) * meta?.per_page! +
                (index + 1)
              "
              :status="memberDetail?.status"
              :theme="theme"
            />
          </div>
          <Pagination
            v-if="meta?.last_page && meta?.last_page > 1"
            :current-page="currentPage"
            :total-items="meta?.total || 0"
            :per-page="10"
            class="mt-55px"
            :theme="theme"
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
      <div v-if="tab === 2">
        <div class="desktop:w-3/4 mt-20px">
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.record') }}
            </div>
            <div class="value">
              {{
                memberDetail?.karute || $t('others.empty')
              }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.name') }}
            </div>
            <div class="value">
              {{
                getFullName(
                  memberDetail?.last_name,
                  memberDetail?.first_name
                )
              }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.name_furigana') }}
            </div>
            <div class="value">
              {{
                getFullName(
                  memberDetail?.last_name_kana,
                  memberDetail?.first_name_kana
                )
              }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.group') }}
            </div>
            <div class="value">
              {{ groupName || $t('others.empty') }}
              <span
                v-if="
                  userStore.roleName === RoleEnum.ADMIN &&
                  memberStore.memberDetail?.group
                "
                class="c-action kanrisha ml-7x"
                @click="
                  handleViewDetailGroup(
                    memberStore.memberDetail?.group
                      ?.id as number
                  )
                "
              >
                {{ $t('pages.setting.see_more') }}
              </span>
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.trainer_count') }}
            </div>
            <div class="value">
              {{ trainerName || $t('others.empty') }}
              <span
                v-if="
                  userStore.roleName === RoleEnum.ADMIN &&
                  memberStore.memberDetail?.trainer
                "
                class="c-action kanrisha ml-7x"
                @click="
                  handleViewDetailTrainer(
                    memberStore.memberDetail?.trainer
                      ?.id as number
                  )
                "
              >
                {{ $t('pages.setting.see_more') }}
              </span>
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.status') }}
            </div>
            <div class="value">
              {{ status || $t('others.empty') }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.address') }}
            </div>
            <div class="value flex flex-col gap-8px">
              <template
                v-if="
                  !memberDetail?.zip1 &&
                  !memberDetail?.address &&
                  !memberDetail?.building_name
                "
              >
                {{ $t('others.empty') }}
              </template>
              <template v-else>
                <span>
                  {{
                    memberDetail?.zip1
                      ? $t(
                          'pages.user_detail.address_symbol'
                        ) +
                        memberDetail?.zip1 +
                        '-' +
                        memberDetail?.zip2
                      : $t('others.empty')
                  }}
                </span>
                <span>
                  {{
                    getFullAddress(
                      memberDetail?.address,
                      memberDetail?.building_name
                    ) || $t('others.empty')
                  }}
                </span>
              </template>
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.mobile_phone') }}
            </div>
            <div class="value">
              {{ memberDetail?.tel || $t('others.empty') }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.gender') }}
            </div>
            <div class="value">
              {{ $t(gender) || $t('others.gender_others') }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.birth_day') }}
            </div>
            <div class="value">
              {{ dateTime || $t('others.empty') }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.age_label') }}
            </div>
            <div class="value">
              {{ age || $t('others.empty') }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.medical_history') }}
            </div>
            <div class="value whitespace">
              {{
                memberDetail?.medical_history ||
                $t('others.empty')
              }}
            </div>
          </div>
          <div class="row-info">
            <div class="label">
              {{ $t('pages.user_detail.remarks') }}
            </div>
            <div class="value whitespace">
              {{ memberDetail?.memo || $t('others.empty') }}
            </div>
          </div>
          <div
            class="row-info"
            :class="{
              'mb-50px': theme === RoleEnum.ADMINISTRANTOR,
            }"
          >
            <div class="label">
              {{ $t('pages.user_detail.email') }}
            </div>
            <div class="value">
              {{
                memberDetail?.email || $t('others.empty')
              }}
            </div>
          </div>
        </div>
        <Button
          v-if="
            theme !== RoleEnum.ADMINISTRANTOR &&
            !disableButton
          "
          :theme="theme"
          class="mt-38px desktop:w-3/4"
          @click="handleEditMember(memberDetail?.id)"
        >
          {{ $t('pages.user_detail.update') }}
        </Button>
        <Button
          v-if="
            theme !== RoleEnum.ADMINISTRANTOR &&
            disableButton
          "
          :theme="theme"
          class="mt-38px desktop:w-3/4"
          :is-disabled="disableButton"
          @click="handleEditMember(memberDetail?.id)"
          v-tooltip="{
            content: `${$t(
              'pages.user_detail.message_tooltip'
            )}`,
          }"
        >
          {{ $t('pages.user_detail.update') }}
        </Button>
      </div>
      <div v-if="tab === 3">
        <div class="wrap grid mt-50px desktop:w-3/4">
          <div class="grap mt-4 relative">
            <span class="title text-14px font-bold">{{
              $t('pages.user_detail.title_grap')
            }}</span>
            <div
              v-if="chartData.datasets[0].data.length"
              id="barChart"
              class="grap-inner mt-20px"
            >
              <div class="overflow-x-auto">
                <BarChart
                  :chart-data="chartData"
                  :chart-options="chartOptions"
                />
              </div>
              <div class="video mt-60px">
                <p class="font-bold">
                  {{ $t('pages.user_detail.title_video') }}
                </p>
                <div
                  class="video-list grid grid-cols-2 <mobile:grid-cols-1 gap-15px mt-15px"
                >
                  <div
                    v-for="(
                      video, index
                    ) in videosAllByMember"
                    :key="index + 1"
                    class="video-list__item flex items-center gap-15px"
                  >
                    <div
                      class="w-32px h-32px rounded-full video-list__order flex items-center justify-center text-16px font-bold"
                      :class="{
                        shinseido: themeShinseido,
                        trainer: themeTrainer,
                        kanrisha: themeKanrisha,
                      }"
                    >
                      {{ numericalOrder(index + 1) }}
                    </div>
                    <p
                      class="text-16px leading-20px font-bold video-list__title"
                    >
                      {{ video.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading
      v-if="isLoadingPage"
      :theme="theme"
      class="absolute w-full h-screen top-0 left-0"
    />
  </div>
</template>

<style scoped lang="scss">
.user-detail {
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
      background: $color-shinseido;

      &.disable {
        font-weight: bold;
        color: $color-white-2;
        background: #aaaaac;
      }
    }

    &.trainer {
      .active {
        font-weight: bold;
        color: $color-white-2;
        background: $color-trainer;

        &.disable {
          font-weight: bold;
          color: $color-white-2;
          background: #aaaaac;
        }
      }
    }

    &.kanrisha {
      .active {
        font-weight: bold;
        color: $color-white-2;
        background: $color-kanrisha;

        &.disable {
          font-weight: bold;
          color: $color-white-2;
          background: #aaaaac;
        }
      }
    }
  }

  &__tab {
    padding: 9px 22px 10px;

    @media (hover: hover) {
      &:hover {
        filter: brightness(1.1);
        opacity: 0.6;
        transition: 0.3s;
      }
    }

    &:last-child {
      padding: 9px 20px 10px 22px;
    }
  }
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

.whitespace {
  line-height: 1.5 !important;
  white-space: pre-wrap;
}

.grap {
  background: #fcfbfa;
  padding: 24px 25px 55px;
  border-radius: 24px;
  filter: drop-shadow(0px 5px 5px rgba(51, 51, 51, 0.05));
  margin-top: 0px;

  @media screen and (max-width: 340px) {
    padding: 24px 15px 55px;
  }
}

.title {
  color: $color-gray-2;
}

.grap-inner {
  &::-webkit-scrollbar {
    display: block;
  }
}

.no-data {
  padding: calc(2.5rem + 14px) 0;
  height: calc(100% - 20px);
}

.video-list__order {
  line-height: unset;
  color: $color-white;
  flex-basis: 32px;
  flex-grow: 0;
  flex-shrink: 0;

  &.shinseido {
    background: $color-shinseido;
  }

  &.trainer {
    background: $color-trainer;
  }

  &.kanrisha {
    background: $color-kanrisha;
  }
}

.video-list__title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.c-action {
  @apply font-bold cursor-pointer hover: opacity-80;
  letter-spacing: 0.08em;

  &.kanrisha {
    color: $color-kanrisha;
    border-bottom: 1px solid $color-kanrisha;
  }
}

.noti {
  border-radius: 8px;
  border: 1px solid #f6b38e;
  padding: 4px 8px;

  span {
    font-size: 12px;
    color: #f6b38e;
  }
}

.icon-exclamation-noti {
  &::before {
    background-color: #f6b38e;
  }
}
</style>
