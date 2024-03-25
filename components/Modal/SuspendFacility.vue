<script lang="ts" setup>
import moment from 'moment'
import { ModalNameEnum } from '@/constants/modal'
import { IPlan } from '@/interfaces/plan'
import { comma } from '@/helper/number'
import { RoleEnum } from '@/constants/role'

const props = defineProps({
  planDetail: {
    type: Object as () => IPlan,
    default: () => {},
  },
})
const { $hiddenModal } = useNuxtApp()
const { formatDate } = useHelper()
const emit = defineEmits(['click-submit'])
const isAgree = ref(0)

const classBtn = computed(() => {
  return isAgree.value ? 'danger' : 'secondary'
})

const handleClick = () => {
  try {
    $hiddenModal(ModalNameEnum.SUSPEND_FACILITY)
    emit('click-submit')
  } catch (error) {}
}

const { statusFacility } = useSetting()
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.SUSPEND_FACILITY"
    content-class="p-32px flex flex-col gap pb-30px mt-10vh !max-w-none w-688px <tablet:w-90vw <tablet:w-max <tablet:!max-w-sm <tablet:mt-8vh"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="px-25px py-8px <tablet:p-0">
      <div class="text-22px leading-24px font-bold">
        {{
          $t('components.modal.suspend_facility.heading')
        }}
      </div>
      <div
        class="modal-body <mobile:h-336px <mobile:overflow-y-scroll"
      >
        <div class="plan_tbl mt-8px">
          <!-- <table class="table-fixed border-collapse w-full">
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
                {{ planDetail?.max_video_count
                }}{{ $t('others.book') }}
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
                {{
                  formatDate(planDetail?.updated_at) ||
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
                  {{
                    planDetail?.content ||
                    $t('others.empty')
                  }}
                </div>
              </td>
            </tr>
          </table> -->
          <div class="action">
            <FormCheckbox
              v-model="isAgree"
              :theme="RoleEnum.ADMINISTRANTOR"
              class="mt-27px group-detail__checkbox"
            >
              {{
                $t(
                  'components.modal.suspend_facility.policy'
                )
              }}
            </FormCheckbox>
          </div>
        </div>
      </div>
      <div class="flex gap-31px mt-36px">
        <Button
          :theme="RoleEnum.ADMINISTRANTOR"
          type="outline"
          :class-button="`text-18px`"
          @click="
            $hiddenModal(ModalNameEnum.SUSPEND_FACILITY)
          "
        >
          {{ $t('components.button.cancel') }}
        </Button>
        <Button
          :type="classBtn"
          :theme="RoleEnum.ADMINISTRANTOR"
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
