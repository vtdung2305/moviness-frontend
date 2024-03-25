<script setup lang="ts">
import { RoleEnum } from '@/constants/role'
import { PlanRequest } from '@/constants/plan'
import { FormatDateEnum } from '@/constants/common'
import { ModalNameEnum } from '@/constants/modal'
import { FacilityStatus } from '@/constants/facility'

const { formatDate, copyClipboard } = useHelper()
const { $showModal, $hiddenModal } = useNuxtApp()
const { t } = useLang()
const route = useRoute()
const isConfirm = ref(0)
const statusName = ref(null)
const status = ref(0)
const msg = ref('')

const itemList = PlanRequest.map((item) => item.name)

const onSelectStatus = (value: string) => {
  const item = PlanRequest.find((e) => e.name === value)
  if (item) {
    status.value = Number(item.value)
  }
}

const suspendFacility = async () => {
  await $hiddenModal(ModalNameEnum.SUSPEND_FACILITY)
  await inactiveFacility()
}

const handleUpgrade = async () => {
  try {
    const { $api } = useNuxtApp()
    const id = route.params.id
    const params = {
      status: status.value,
    }
    isLoading.value = true
    const res = await $api.facility.handleUpgradePlan(
      id as string,
      params as any
    )
    if (res && res.data) {
      await getFacilityById()
      await getPlanHistoriesByFacility()
      await $showModal(ModalNameEnum.ALERT_SUCCESS)
    }
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

watch(status, (newVal) => {
  if (newVal === FacilityStatus.ACCEPT) {
    msg.value = t('pages.facility_detail.msg_approve')
  } else if (newVal === FacilityStatus.REFUSE) {
    msg.value = t('pages.facility_detail.msg_reject')
  } else {
    msg.value = ''
  }
})

const {
  isLoading,
  facilityDetail,
  facilityPlanHistories,
  filter,
  statusFacility,
  facilityValid,
  getFacilityById,
  getPlanHistoriesByFacility,
  onPageChange,
  inactiveFacility,
} = useFacilityDetail()
</script>

<template>
  <div
    v-if="facilityDetail"
    class="group-detail -mt-5px pb-70px desktop:w-3/4 relative"
  >
    <div class="group-detail__info">
      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.facility_detail.information') }}
        </div>
        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.facility_detail.name') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.name
                  ? facilityDetail?.name
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t('pages.facility_detail.name_furigana')
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.name_kata
                  ? facilityDetail?.name_kata
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t('pages.facility_detail.facility_address')
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              <!-- 〒980-1029<br />東京ソラマチ
              イーストヤード49階10番地 -->
              {{
                facilityDetail?.zip1
                  ? '〒 ' +
                    facilityDetail?.zip1 +
                    '-' +
                    facilityDetail?.zip2
                  : $t('others.empty')
              }}<br />{{ facilityDetail?.address1
              }}{{ facilityDetail?.address2 }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.phone') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.tel
                  ? facilityDetail?.tel
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.fax') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.fax
                  ? facilityDetail?.fax
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.mail_adrress') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              <span class="information__item-value__action"
                >{{
                  facilityDetail?.email
                    ? facilityDetail?.email
                    : $t('others.empty')
                }}<button
                  v-if="facilityDetail?.email"
                  :value="facilityDetail?.email"
                  class="icon-copy-line pl-20px cursor-pointer"
                  @click="
                    copyClipboard($event.target.value)
                  "
                ></button
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.facility_detail.representative') }}
        </div>
        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{
                $t(
                  'pages.facility_detail.representative_name'
                )
              }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.info?.president_first_name
                  ? facilityDetail?.info
                      ?.president_first_name
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t(
                  'pages.facility_detail.representative_name_furigana'
                )
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.info
                  ?.president_first_name_kata
                  ? facilityDetail?.info
                      ?.president_first_name_kata
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.address') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              <!-- 〒980-1029<br />東京ソラマチ
              イーストヤード49階10番地 -->
              {{
                facilityDetail?.info?.president_zip1
                  ? '〒 ' +
                    facilityDetail?.info?.president_zip1 +
                    '-' +
                    facilityDetail?.info?.president_zip2
                  : $t('others.empty')
              }}<br />{{
                facilityDetail?.info?.president_address1
              }}{{
                facilityDetail?.info?.president_address2
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t(
                  'pages.facility_detail.representative_phone'
                )
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.info?.president_tel
                  ? facilityDetail?.info?.president_tel
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.mail_adrress') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.info?.president_email
                  ? facilityDetail?.info?.president_email
                  : $t('others.empty')
              }}
              <button
                v-if="facilityDetail?.info?.president_email"
                :value="
                  facilityDetail?.info?.president_email
                "
                class="icon-copy-line pl-20px cursor-pointer"
                @click="copyClipboard($event.target.value)"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.facility_detail.manager') }}
        </div>
        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{
                $t('pages.facility_detail.person_in_charge')
              }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.manager?.first_name
                  ? facilityDetail?.manager?.first_name
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t(
                  'pages.facility_detail.person_in_charge_furigana'
                )
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.manager?.first_name_kana
                  ? facilityDetail?.manager?.first_name_kana
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.address') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              <!-- 〒980-1029<br />東京ソラマチ
              イーストヤード49階10番地 -->
              {{
                facilityDetail?.manager?.zip1
                  ? '〒 ' +
                    facilityDetail?.manager?.zip1 +
                    '-' +
                    facilityDetail?.manager?.zip2
                  : $t('others.empty')
              }}<br />{{ facilityDetail?.manager?.address }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t(
                  'pages.facility_detail.representative_phone'
                )
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.manager?.tel
                  ? facilityDetail?.manager?.tel
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.mail_adrress') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.info?.president_email
                  ? facilityDetail?.info?.president_email
                  : $t('others.empty')
              }}
              <button
                v-if="facilityDetail?.info?.president_email"
                :value="
                  facilityDetail?.info?.president_email
                "
                class="icon-copy-line pl-20px cursor-pointer"
                @click="copyClipboard($event.target.value)"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.facility_detail.account') }}
        </div>
        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.facility_detail.mail_adrress') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.manager?.email
                  ? facilityDetail?.manager?.email
                  : $t('others.empty')
              }}
              <button
                v-if="facilityDetail?.manager?.email"
                :value="facilityDetail?.manager?.email"
                class="icon-copy-line pl-20px cursor-pointer"
                @click="copyClipboard($event.target.value)"
              ></button>
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.facility_detail.situation') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{ statusFacility }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.last_login') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                formatDate(
                  facilityDetail?.manager?.last_login,
                  FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                ) || $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.facility_detail.create_date') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                formatDate(
                  facilityDetail.created_at,
                  FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                ) || $t('others.empty')
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.facility_detail.plan') }}
        </div>
        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.facility_detail.current_plan') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail?.plan?.name
                  ? facilityDetail?.plan?.name
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t('pages.facility_detail.expiration_date')
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                formatDate(
                  facilityDetail.plan_expire_at,
                  FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                ) || $t('others.empty')
              }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="
          facilityDetail.plan_purchased_need_upgrade_last &&
          facilityValid
        "
        class="common-info"
      >
        <div class="common-info__title font-bold">
          {{ $t('pages.facility_detail.plan_request') }}
        </div>
        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{
                $t('pages.facility_detail.update_request')
              }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail
                  .plan_purchased_need_upgrade_last.plan
                  .name
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{
                $t(
                  'pages.facility_detail.renewal_request_date'
                )
              }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                formatDate(
                  facilityDetail
                    .plan_purchased_need_upgrade_last
                    .created_at,
                  FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                ) || $t('others.empty')
              }}
            </div>
          </div>
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-25px font-medium"
            >
              {{ $t('pages.dashboard.request_content') }}
            </div>
            <div
              class="information__item-value text-16px leading-25px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                facilityDetail
                  .plan_purchased_need_upgrade_last.note ||
                $t(
                  'pages.facility_detail.facility_registrion_first'
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        facilityDetail.plan_purchased_need_upgrade_last &&
        facilityValid
      "
      class="mt-15px"
    >
      <FormCheckbox
        v-model="isConfirm"
        :text="$t('pages.facility_detail.confirm_payment')"
        :theme="RoleEnum.ADMINISTRANTOR"
      />
      <div
        class="flex <tablet:flex-wrap mt-10px pl-40px <tablet:pl-0"
      >
        <Dropdown
          v-model="statusName"
          :text-button="$t('others.please_choose')"
          :items="itemList"
          :is-disabled="!isConfirm"
          class="c-select w-180px <tablet:w-full <tablet:mt-20px"
          @on-selected="onSelectStatus"
        />
        <Button
          :theme="RoleEnum.ADMINISTRANTOR"
          type="outline"
          class="c-btn ml-18px w-148px text-16px h-53px <tablet:mt-20px <tablet:ml-0 <tablet:w-full"
          :is-disabled="!isConfirm || !statusName"
          @click="$showModal(ModalNameEnum.MESSAGE)"
        >
          {{ $t('others.btn_update') }}
        </Button>
      </div>
    </div>

    <div
      v-if="
        facilityPlanHistories &&
        facilityPlanHistories.data.length
      "
      class="plan-history mt-60px"
    >
      <div
        class="plan-history__title text-22px leading-30px font-bold mb-5px"
      >
        {{
          $t('pages.facility_detail.plan_change_history')
        }}
      </div>
      <div
        class="plan-history__tbl <desktop:overflow-x-scroll"
      >
        <table
          class="table-fixed border-collapse w-full <tablet:w-894px"
        >
          <thead>
            <tr>
              <th
                class="font-bold text-left w-300px <desktop:w-225px"
              >
                {{ $t('pages.facility_detail.date') }}
              </th>
              <th
                class="font-bold text-left w-285px <desktop:w-220px"
              >
                {{
                  $t('pages.facility_detail.plan_change')
                }}
              </th>
              <th
                class="font-bold text-left w-200px <desktop:w-160px"
              >
                {{ $t('pages.facility_detail.expired') }}
              </th>
              <th class="font-bold text-left">
                {{ $t('pages.dashboard.request_content') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(
                plan_purchased, index
              ) in facilityPlanHistories.data"
              :key="index"
            >
              <td>
                {{
                  formatDate(
                    plan_purchased.expiry_date_start,
                    FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                  ) || $t('others.empty')
                }}
              </td>
              <td>
                <template v-if="plan_purchased.plan_before">
                  {{ plan_purchased.plan_before.name }}→{{
                    plan_purchased.plan.name
                  }}
                </template>
                <template v-else>{{
                  plan_purchased.plan.name
                }}</template>
              </td>
              <td>
                {{
                  formatDate(
                    plan_purchased.expiry_date_end
                  ) || $t('others.empty')
                }}
              </td>
              <td>
                <div class="text-label">
                  {{
                    plan_purchased.note ||
                    $t('others.empty')
                  }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        v-if="facilityPlanHistories?.meta.total"
        :theme="RoleEnum.ADMINISTRANTOR"
        :current-page="
          facilityPlanHistories?.meta.current_page
        "
        :total-items="facilityPlanHistories?.meta.total"
        :per-page="filter.limit"
        class="mt-40px desktop:mt-56px"
        @page-changed="onPageChange"
      />
    </div>

    <div class="plan-action mt-40px text-center">
      <div
        v-if="facilityValid"
        class="text-14px leading-18px text-center mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
        @click="$showModal(ModalNameEnum.SUSPEND_FACILITY)"
      >
        {{ $t('pages.facility_detail.account_suspension') }}
      </div>
    </div>
    <!-- Modal alert show approve or reject upgrade plan -->
    <ModalMessage
      :id="ModalNameEnum.MESSAGE"
      :message="$t('others.title_modal_confirm')"
      :sub-message="msg"
      :button-cancel="$t('others.cancel_picker')"
      :button-submit="$t('components.button.confirmation')"
      :theme="RoleEnum.ADMINISTRANTOR"
      @click-submit="handleUpgrade"
    />
    <!-- End -->

    <!-- Modal alert after show approve or reject upgrade plan -->
    <ModalMessage
      :id="ModalNameEnum.ALERT_SUCCESS"
      :message="$t('others.title_modal_common')"
      :sub-message="$t('pages.facility_detail.msg_success')"
      :button-submit="$t('components.button.close')"
      :theme="RoleEnum.ADMINISTRANTOR"
      @click-submit="
        $hiddenModal(ModalNameEnum.ALERT_SUCCESS)
      "
    />
    <!-- End -->

    <!-- Modal suspension account -->
    <ModalSuspendFacility @click-submit="suspendFacility" />
    <!-- End -->

    <!-- Modal alert after facility inactive -->
    <ModalMessage
      :id="ModalNameEnum.ALERT_FACILITY_INACTIVE"
      :message="$t('others.title_modal_common')"
      :sub-message="
        $t('pages.facility_detail.msg_inactived')
      "
      :button-submit="$t('components.button.close')"
      :theme="RoleEnum.ADMINISTRANTOR"
      @click-submit="
        $hiddenModal(ModalNameEnum.ALERT_FACILITY_INACTIVE)
      "
    />
    <!-- End -->

    <Loading
      v-if="isLoading"
      :theme="RoleEnum.ADMINISTRANTOR"
      class="fixed w-full h-screen top-0 left-0 z-50"
    />
  </div>
</template>

<style scoped lang="scss">
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

  @media screen and (max-width: $screen-mobile) {
    &__item {
      display: block;

      &-label {
        padding-bottom: 5px;
        font-weight: bold;
      }
    }
  }
}

:deep(.form-checkbox__icon) {
  font-size: 24px;
}

:deep(.form-checkbox__text) {
  font-size: 16px;
  font-weight: 500;
}
.c-select {
  &.disabled {
    &:deep(button) {
      border: solid 1px $color-gray-2;
      background-color: $color-gray-3;
    }
  }
}

:deep(.button-disable.c-btn) {
  color: $color-gray-3;
  background-color: transparent !important;
  border-color: $color-gray-3;
}

table {
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

.cancel {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 24px;
  display: inline-block;
}

.text-label {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
