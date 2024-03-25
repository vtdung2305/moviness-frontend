<script lang="ts" setup>
import moment from 'moment'
import { ModalNameEnum } from '@/constants/modal'
import { useUser } from '@/stores/user'
import { IFacilityPlanHistories } from '@/interfaces/facility'
import { comma } from '@/helper/number'
import { useFacility } from '@/stores/facility'
import { FacilityStatus } from '@/constants/facility'

const userStore = useUser()
const facilityStore = useFacility()
const props = defineProps({
  planDetail: {
    type: Object as () => IFacilityPlanHistories,
    default: () => {},
  },
})
const { $hiddenModal } = useNuxtApp()
const { formatDate, savePDF } = useHelper()

const periodOfUse = computed(() => {
  if (
    !props.planDetail ||
    !props.planDetail.expiry_date_end ||
    !props.planDetail.expiry_date_start
  )
    return null
  return moment(props.planDetail.expiry_date_end).diff(
    moment(props.planDetail.expiry_date_start),
    'days'
  )
})

const { statusFacility } = useSetting()

const exportPdfReceipt = async () => {
  try {
    const { $api } = useNuxtApp()
    const id = facilityStore.facilityDetail?.id
    const planPurchasedId = props.planDetail?.id
    const res = await $api.facility.exportPdfReceipt(
      id as string,
      planPurchasedId as string
    )
    if (res && res.data) {
      const fileName = res.data.url.split('/').pop()
      savePDF(res.data.url, fileName)
      $hiddenModal(ModalNameEnum.PLAN_DETAIL)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.PLAN_DETAIL"
    content-class="p-32px flex flex-col gap pb-30px mt-10vh !max-w-none w-688px <tablet:w-90vw <tablet:w-max <tablet:!max-w-sm <tablet:mt-8vh"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="px-25px py-8px <tablet:p-0">
      <div class="text-22px leading-24px font-bold">
        {{ $t('components.modal.plan_detail.heading') }}
      </div>
      <div
        class="modal-body <mobile:h-336px <mobile:overflow-y-scroll"
      >
        <div v-if="planDetail" class="plan_tbl mt-8px">
          <table class="table-fixed border-collapse w-full">
            <tr>
              <td>
                {{
                  $t(
                    'components.modal.plan_detail.contract_date'
                  )
                }}
              </td>
              <td>
                {{
                  formatDate(
                    planDetail?.expiry_date_start
                  ) || $t('others.empty')
                }}
              </td>
            </tr>
            <tr>
              <td>
                {{
                  $t('components.modal.plan_detail.plan')
                }}
              </td>
              <td>{{ planDetail?.plan.name }}</td>
            </tr>
            <tr>
              <td>
                {{
                  $t(
                    'components.modal.plan_detail.period_of_use'
                  )
                }}
              </td>
              <td>
                <template v-if="periodOfUse">
                  {{ periodOfUse }}{{ $t('others.date') }}
                </template>
                <template v-else>
                  {{ $t('others.empty') }}
                </template>
              </td>
            </tr>
            <tr>
              <td>
                {{
                  $t(
                    'components.modal.plan_detail.use_period'
                  )
                }}
              </td>
              <td>
                {{
                  formatDate(planDetail?.expiry_date_end) ||
                  $t('others.empty')
                }}
              </td>
            </tr>
            <tr>
              <td>
                {{
                  $t(
                    'components.modal.plan_detail.request_amount'
                  )
                }}
              </td>
              <td>
                {{ comma(planDetail.plan.plan_price)
                }}{{
                  $t('components.modal.plan_detail.unit')
                }}
              </td>
            </tr>
            <tr>
              <td>
                {{
                  $t('components.modal.plan_detail.status')
                }}
              </td>
              <td>
                {{
                  $t(statusFacility(planDetail.status)) ||
                  $t('others.empty')
                }}
              </td>
            </tr>
            <tr>
              <td>
                {{
                  $t('components.modal.plan_detail.content')
                }}
              </td>
              <td>
                {{ planDetail?.note || $t('others.empty') }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="flex gap-32px mt-36px">
        <Button
          v-if="planDetail.status !== FacilityStatus.CREATE"
          type="outline text-18px btn"
          :theme="userStore.roleName"
          @click="exportPdfReceipt"
        >
          {{ $t('components.modal.plan_detail.receipt') }}
        </Button>
        <Button
          type="outline text-18px btn"
          :theme="userStore.roleName"
          @click="$hiddenModal(ModalNameEnum.PLAN_DETAIL)"
        >
          {{ $t('components.button.close') }}
        </Button>
      </div>
    </div>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
table {
  tr {
    border-bottom: 1px solid $color-gray-3;

    > td {
      padding: 12px 0 11px;

      &:first-child {
        width: 180px;
        vertical-align: top;

        @media screen and (max-width: $screen-mobile) {
          width: 100px;
          display: block;
        }
      }

      @media screen and (max-width: $screen-mobile) {
        display: block;

        &:first-child {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
