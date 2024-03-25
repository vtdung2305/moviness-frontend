<script lang="ts" setup>
import moment from 'moment'
import { ModalNameEnum } from '@/constants/modal'
import { useUser } from '@/stores/user'
import { IPlan } from '@/interfaces/plan'
import { comma } from '@/helper/number'
import { RoleEnum } from '@/constants/role'
import { PlanUnlimitedEnum } from '@/constants/plan'

const userStore = useUser()
const props = defineProps({
  planDetail: {
    type: Object as () => IPlan,
    default: () => {},
  },
  note: {
    type: String,
    default: null,
  },
  usePeriod: {
    type: String,
    default: null,
  },
})
const { $hiddenModal } = useNuxtApp()
const { formatDate } = useHelper()
const { t } = useLang()
const emit = defineEmits(['click-submit'])
const isAgree = ref(0)

// const periodOfUse = computed(() => {
//   if (!props.planDetail) return null
//   return moment(props.planDetail.expiry_date_end).diff(
//     moment(props.planDetail.expiry_date_start),
//     'days'
//   )
// })

const planVideo = computed(() => {
  if (!props?.planDetail?.max_video_count) return null
  if (
    props.planDetail.max_video_count === PlanUnlimitedEnum
  ) {
    return t('pages.plan_list.unlimited')
  }
  return `${comma(props?.planDetail?.max_video_count)}${t(
    'others.book'
  )}`
})

const handleClick = () => {
  try {
    $hiddenModal(ModalNameEnum.PLAN_UPGRADE)
    emit('click-submit')
  } catch (error) {}
}

const { statusFacility } = useSetting()
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.PLAN_UPGRADE"
    content-class="p-32px flex flex-col gap pb-30px mt-10vh !max-w-none w-688px <tablet:w-90vw <tablet:w-max <tablet:!max-w-sm <tablet:mt-8vh"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="px-25px py-8px <tablet:p-0">
      <div class="text-22px leading-24px font-bold">
        {{ $t('components.modal.plan_upgrade.heading') }}
      </div>
      <div
        class="modal-body <mobile:h-336px <mobile:overflow-y-scroll"
      >
        <div v-if="planDetail" class="plan_tbl mt-8px">
          <table class="table-fixed border-collapse w-full">
            <tr>
              <td>
                {{ $t('pages.setting.plan_name') }}
              </td>
              <td>
                {{ planDetail?.name || $t('others.empty') }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t('pages.plan_list.video_count') }}
              </td>
              <td>
                {{ planVideo }}
              </td>
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
                {{ planDetail?.time_plan_duration
                }}{{ $t('others.date') }}
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
                {{ usePeriod || $t('others.empty') }}
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
                {{ comma(planDetail.plan_price)
                }}{{
                  $t('components.modal.plan_detail.unit')
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
                <div class="whitespace-pre-line">
                  {{ note || $t('others.empty') }}
                </div>
              </td>
            </tr>
          </table>
          <div class="action">
            <FormCheckbox
              v-model="isAgree"
              :theme="userStore.roleName"
              class="mt-27px group-detail__checkbox"
            >
              {{
                $t('components.modal.plan_upgrade.policy')
              }}
            </FormCheckbox>
          </div>
        </div>
      </div>
      <div class="flex gap-31px mt-36px">
        <Button
          :theme="RoleEnum.ADMIN"
          type="outline"
          :class-button="`text-18px`"
          @click="$hiddenModal(ModalNameEnum.PLAN_UPGRADE)"
        >
          {{ $t('components.button.cancel') }}
        </Button>
        <Button
          :theme="RoleEnum.ADMIN"
          :is-disabled="!isAgree"
          :class-button="`text-18px`"
          @click="handleClick"
        >
          {{
            $t('components.modal.delete_user.btn_delete')
          }}
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

.action {
  :deep(.form-checkbox__text) {
    font-size: 16px;
    font-weight: normal;
  }
}
</style>
