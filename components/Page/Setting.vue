<script setup lang="ts">
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'
import { useFacility } from '@/stores/facility'
import { ImageDefaultEnum } from '@/constants/image'
import { IFacilityPlanHistories } from '@/interfaces/facility'

const userStore = useUser()
const { $hiddenModal, $showModal } = useNuxtApp()
// const isLoading = ref<Boolean>(true)
const facilityStore = useFacility()
const planSelect = ref<IFacilityPlanHistories>()

const { getFullAddress, copyClipboard, formatDate } =
  useHelper()

const avatarDisplay = computed(() => {
  return facilityStore.facilityDetail?.url_avatar
    ? facilityStore.facilityDetail?.url_avatar
    : ImageDefaultEnum.IMAGE_FACILITY_DEFAULT
})

const avatarManager = computed(() => {
  return facilityStore.facilityDetail?.manager?.url_avatar
    ? facilityStore.facilityDetail?.manager?.url_avatar
    : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
})

const router = useRouter()

const handleViewEditInfo = () => {
  router.push(`edit`)
}

const showModalPlanDetail = (
  plan: IFacilityPlanHistories
) => {
  planSelect.value = plan
  $showModal(ModalNameEnum.PLAN_DETAIL)
}

const confirm = () => {
  if (hasPlanNeedUpgrade.value) {
    $hiddenModal(ModalNameEnum.MESSAGE)
  } else {
    router.push('/app/kanrisha/plan')
  }
}
const {
  isLoading,
  tab,
  facilityDetail,
  planHistories,
  hasPlanNeedUpgrade,
  filter,
  facilityStatistic,
  handleChangeTab,
  onPageChange,
  statusFacility,
} = useSetting()
</script>

<template>
  <div class="desktop:w-3/4 setting-page">
    <div class="group-detail relative">
      <div
        class="user-detail__tabs flex mt-10 w-max overflow-hidden"
        :class="RoleEnum.ADMIN"
      >
        <div
          class="user-detail__tab"
          :class="{ active: tab === 1 }"
          @click="handleChangeTab(1)"
        >
          {{ $t('pages.setting.tab_info') }}
        </div>
        <div
          class="user-detail__tab"
          :class="{ active: tab === 2 }"
          @click="handleChangeTab(2)"
        >
          {{ $t('pages.setting.tab_plan') }}
        </div>
      </div>
      <template v-if="tab === 1">
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
              facilityStore.facilityDetail?.name
                ? facilityStore.facilityDetail?.name
                : $t('others.empty')
            }}
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{ $t('pages.facility_detail.name_furigana') }}
          </div>
          <div class="value">
            {{
              facilityStore.facilityDetail?.name_kata
                ? facilityStore.facilityDetail?.name_kata
                : $t('others.empty')
            }}
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{
              $t('pages.facility_detail.facility_address')
            }}
          </div>
          <div class="value flex flex-col gap-8px">
            <span>{{
              facilityStore.facilityDetail?.zip1
                ? '〒' +
                  facilityStore.facilityDetail?.zip1 +
                  '-' +
                  facilityStore.facilityDetail?.zip2
                : $t('others.empty')
            }}</span>
            <span>
              {{
                getFullAddress(
                  facilityStore.facilityDetail?.address1,
                  facilityStore.facilityDetail?.address2
                ) || $t('others.empty')
              }}
            </span>
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{ $t('pages.facility_detail.phone') }}
          </div>
          <div class="value">
            {{
              facilityStore.facilityDetail?.tel
                ? facilityStore.facilityDetail?.tel
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
              facilityStore.facilityDetail?.fax
                ? facilityStore.facilityDetail?.fax
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
              facilityStore.facilityDetail?.email
                ? facilityStore.facilityDetail?.email
                : $t('others.empty')
            }}
            <button
              v-if="facilityStore.facilityDetail?.email"
              class="icon-copy-line pl-20px cursor-pointer"
              :value="facilityStore.facilityDetail?.email"
              @click="copyClipboard($event.target.value)"
            ></button>
          </div>
        </div>

        <div class="mt-65px text-22px font-bold">
          {{ $t('pages.facility_detail.representative') }}
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
              facilityStore.facilityDetail?.info
                ?.president_first_name
                ? facilityStore.facilityDetail?.info
                    ?.president_first_name
                : $t('others.empty')
            }}
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{
              $t(
                'pages.facility_detail.representative_name_furigana'
              )
            }}
          </div>
          <div class="value">
            {{
              facilityStore.facilityDetail?.info
                ?.president_first_name_kata
                ? facilityStore.facilityDetail?.info
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
                !facilityStore.facilityDetail?.info
                  ?.president_zip1 &&
                !facilityStore.facilityDetail?.info
                  ?.president_address1 &&
                !facilityStore.facilityDetail?.info
                  ?.president_address2
              "
            >
              {{ $t('others.empty') }}
            </template>
            <template v-else>
              <span>
                {{
                  facilityStore.facilityDetail?.info
                    ?.president_zip1
                    ? '〒' +
                      facilityStore.facilityDetail?.info
                        ?.president_zip1 +
                      '-' +
                      facilityStore.facilityDetail?.info
                        ?.president_zip2
                    : $t('others.empty')
                }}
              </span>
              <span>
                {{
                  getFullAddress(
                    facilityStore.facilityDetail?.info
                      ?.president_address1,
                    facilityStore.facilityDetail?.info
                      ?.president_address2
                  ) || $t('others.empty')
                }}
              </span>
            </template>
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{ $t('pages.user_edit.phone_number') }}
          </div>
          <div class="value">
            {{
              facilityStore.facilityDetail?.info
                ?.president_tel
                ? facilityStore.facilityDetail?.info
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
              facilityStore.facilityDetail?.info
                ?.president_email
                ? facilityStore.facilityDetail?.info
                    ?.president_email
                : $t('others.empty')
            }}
            <button
              v-if="
                facilityStore.facilityDetail?.info
                  ?.president_email
              "
              class="icon-copy-line pl-20px cursor-pointer"
              :value="
                facilityStore.facilityDetail?.info
                  ?.president_email
              "
              @click="copyClipboard($event.target.value)"
            ></button>
          </div>
        </div>

        <div class="mt-65px text-22px font-bold">
          {{ $t('pages.facility_detail.manager') }}
        </div>
        <img
          class="mt-24px w-116px h-116px mb-8px rounded-full object-contain"
          :src="avatarManager"
        />
        <div class="row-info mt-6px">
          <div class="label">
            {{
              $t('pages.facility_detail.person_in_charge')
            }}
          </div>
          <div class="value">
            {{
              facilityStore.facilityDetail?.manager
                ?.first_name
                ? facilityStore.facilityDetail?.manager
                    ?.first_name
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
              facilityStore.facilityDetail?.manager
                ?.first_name_kana
                ? facilityStore.facilityDetail?.manager
                    ?.first_name_kana
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
                !facilityStore.facilityDetail?.manager
                  ?.zip1 &&
                !facilityStore.facilityDetail?.manager
                  ?.address &&
                !facilityStore.facilityDetail?.manager
                  ?.building_name
              "
            >
              {{ $t('others.empty') }}
            </template>
            <template v-else>
              <span>
                {{
                  facilityStore.facilityDetail?.manager
                    ?.zip1
                    ? '〒' +
                      facilityStore.facilityDetail?.manager
                        ?.zip1 +
                      '-' +
                      facilityStore.facilityDetail?.manager
                        ?.zip2
                    : $t('others.empty')
                }}
              </span>
              <span>
                {{
                  getFullAddress(
                    facilityStore.facilityDetail?.manager
                      ?.address,
                    facilityStore.facilityDetail?.manager
                      ?.building_name
                  ) || $t('others.empty')
                }}
              </span>
            </template>
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{ $t('pages.user_edit.phone_number') }}
          </div>
          <div class="value">
            {{
              facilityStore.facilityDetail?.manager?.tel
                ? facilityStore.facilityDetail?.manager?.tel
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
              facilityStore.facilityDetail?.manager?.email
                ? facilityStore.facilityDetail?.manager
                    ?.email
                : $t('others.empty')
            }}
            <span
              v-if="
                facilityStore.facilityDetail?.manager?.email
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
            @click="handleViewEditInfo"
          >
            {{ $t('components.button.update') }}
          </Button>
        </div>
      </template>
      <template v-else>
        <div class="group-info mt-35px">
          <div class="common-info">
            <div class="common-info__title font-bold">
              {{ $t('pages.setting.current_plan') }}
            </div>
            <div class="information mt-5px">
              <div class="information__item flex py-11px">
                <div
                  class="information__item-label text-16px leading-24px font-medium"
                >
                  {{ $t('pages.setting.plan_name') }}
                </div>
                <div
                  class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
                >
                  {{ facilityDetail?.plan.name }}
                </div>
              </div>
              <div class="information__item flex py-11px">
                <div
                  class="information__item-label text-16px leading-25px font-medium"
                >
                  {{ $t('pages.setting.expiration_date') }}
                </div>
                <div
                  class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
                >
                  {{
                    formatDate(
                      facilityDetail?.plan_expire_at
                    ) || $t('others.empty')
                  }}
                </div>
              </div>
              <div class="information__item flex py-11px">
                <div
                  class="information__item-label text-16px leading-25px font-medium"
                >
                  {{ $t('pages.setting.remaining_day') }}
                </div>
                <div
                  class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
                >
                  {{
                    facilityDetail?.remaining_available_day
                  }}{{ $t('others.day') }}
                  <!-- <span
                    class="c-action ml-7px"
                    :class="userStore.roleName"
                    @click="
                      $showModal(ModalNameEnum.MESSAGE)
                    "
                    >{{
                      $t('pages.setting.update_request')
                    }}</span
                  > -->
                </div>
              </div>

              <div class="information__item flex py-11px">
                <div
                  class="information__item-label text-16px leading-25px font-medium"
                >
                  {{
                    $t('pages.dashboard.number_of_trainers')
                  }}
                </div>
                <div
                  class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap flex items-center"
                >
                  {{
                    facilityStatistic?.total_trainer_available
                  }}{{ $t('pages.trainer_list.people') }}
                  <span
                    v-tooltip="{
                      content: `${$t(
                        'pages.setting.tooltip_trainer',
                        {
                          number:
                            facilityDetail?.plan
                              ?.max_trainer_count,
                        }
                      )}`,
                      container: '.setting-page',
                    }"
                    class="icon-exclamation-circle tooltip"
                  ></span>
                </div>
              </div>

              <div class="information__item flex py-11px">
                <div
                  class="information__item-label text-16px leading-25px font-medium"
                >
                  {{
                    $t('pages.dashboard.number_of_groups')
                  }}
                </div>
                <div
                  class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap flex items-center"
                >
                  {{
                    facilityStatistic?.total_group_available
                  }}{{ $t('pages.setting.group_unit') }}
                  <span
                    v-tooltip="{
                      content: `${$t(
                        'pages.setting.tooltip_group',
                        {
                          number:
                            facilityDetail?.plan
                              ?.max_group_count,
                        }
                      )}`,
                      container: '.setting-page',
                    }"
                    class="icon-exclamation-circle tooltip"
                  ></span>
                </div>
              </div>

              <div class="information__item flex py-11px">
                <div
                  class="information__item-label text-16px leading-25px font-medium"
                >
                  {{ $t('pages.plan_list.member_count') }}
                </div>
                <div
                  class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap flex items-center"
                >
                  {{
                    facilityStatistic?.total_member_available
                  }}{{ $t('pages.trainer_list.people') }}
                  <span
                    v-tooltip="{
                      content: `${$t(
                        'pages.setting.tooltip_member',
                        {
                          number:
                            facilityDetail?.plan
                              ?.max_member_count,
                        }
                      )}`,
                      container: '.setting-page',
                    }"
                    class="icon-exclamation-circle tooltip"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="plan-history__tbl mt-60px">
          <div class="common-info">
            <div class="common-info__title font-bold">
              {{ $t('pages.setting.plan_history') }}
            </div>
          </div>
          <div class="overflow-x-auto">
            <table
              class="table-fixed border-collapse w-full mt-11px <tablet:w-700px"
            >
              <thead>
                <tr>
                  <th
                    class="font-bold text-left w-170px desktop:w-200px"
                  >
                    {{ $t('pages.setting.contract_date') }}
                  </th>
                  <th
                    class="font-bold text-left w-115px desktop:w-148px"
                  >
                    {{ $t('pages.setting.plan') }}
                  </th>
                  <th
                    class="font-bold text-left w-170px desktop:w-200px"
                  >
                    {{ $t('pages.setting.use_period') }}
                  </th>
                  <th class="font-bold text-left w-138px">
                    {{ $t('pages.setting.status') }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(
                    plan, index
                  ) in planHistories.data"
                  :key="index"
                >
                  <td>
                    {{
                      formatDate(plan.expiry_date_start) ||
                      $t('others.empty')
                    }}
                  </td>
                  <td>{{ plan.plan.name }}</td>
                  <td>
                    {{
                      formatDate(plan.expiry_date_end) ||
                      $t('others.empty')
                    }}
                  </td>
                  <td>
                    {{ $t(statusFacility(plan.status)) }}
                  </td>
                  <td>
                    <span
                      class="c-action"
                      :class="userStore.roleName"
                      @click="showModalPlanDetail(plan)"
                      >{{
                        $t('pages.setting.see_more')
                      }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Pagination
            v-if="planHistories?.meta?.total"
            :theme="userStore.roleName"
            :current-page="planHistories?.meta.current_page"
            :total-items="planHistories?.meta.total"
            :per-page="filter.limit"
            class="mt-40px desktop:mt-56px"
            @page-changed="onPageChange"
          />
        </div>
      </template>
      <ModalPlanDetail
        :plan-detail="planSelect"
      ></ModalPlanDetail>
      <ModalMessage
        :id="ModalNameEnum.MESSAGE"
        :message="$t('others.title_modal_confirm')"
        :sub-message="
          hasPlanNeedUpgrade
            ? $t('pages.setting.msg_processing_plan')
            : $t('pages.setting.msg_upgrage_plan', {
                planName: facilityDetail?.plan.name,
                number:
                  facilityDetail?.remaining_available_day,
              })
        "
        :button-cancel="
          hasPlanNeedUpgrade
            ? ''
            : $t('components.button.cancel')
        "
        :button-submit="
          hasPlanNeedUpgrade
            ? $t('components.button.close')
            : $t('pages.setting.btn_update')
        "
        :theme="userStore.roleName"
        @click-submit="confirm"
      />
      <Loading
        v-if="isLoading"
        :theme="RoleEnum.ADMIN"
        class="fixed w-full h-screen top-0 left-0 z-50"
      />
    </div>
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
    }

    &.trainer {
      .active {
        font-weight: bold;
        color: $color-white-2;
        background: $color-trainer;
      }
    }

    &.kanrisha {
      .active {
        font-weight: bold;
        color: $color-white-2;
        background: $color-kanrisha;
      }
    }
  }

  &__tab {
    line-height: 24px;
    padding: 8px 18px 8px 18px;

    @media (hover: hover) {
      &:hover {
        filter: brightness(1.1);
        opacity: 0.6;
        transition: 0.3s;
      }
    }
  }
}

.common-info {
  &__title {
    font-size: $font-22;
    line-height: $font-30;
  }

  &__image {
    width: 116px;
    height: 116px;
  }

  &:not(:first-child) {
    margin-top: 60px;
  }
}

.information {
  &__item {
    border-bottom: 1px solid $color-gray-3;
  }

  &__item-label {
    min-width: 176px;
  }

  &__item-link {
    color: $color-shinseido;
  }

  @media screen and (max-width: $screen-tablet) {
    &__item-label {
      min-width: 125px;
    }
  }
}

.c-action {
  @apply font-bold cursor-pointer hover: opacity-80;
  letter-spacing: 0.08em;

  &.shinseido {
    color: $color-shinseido;
    border-bottom: 1px solid $color-shinseido;
  }

  &.kanrisha {
    color: $color-kanrisha;
    border-bottom: 1px solid $color-kanrisha;
  }

  &.trainer {
    color: $color-trainer;
    border-bottom: 1px solid $color-trainer;
  }
}

table {
  @media screen and (max-width: 767px) {
    width: 700px;
  }

  tr {
    border-bottom: 1px solid $color-gray-3;

    > th {
      color: $color-gray-2;
    }

    > th,
    > td {
      padding: 12px 0;
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
