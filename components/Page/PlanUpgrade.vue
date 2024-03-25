<script setup lang="ts">
import { PropType } from 'vue'
import { required, helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { IPlan } from '@/interfaces/plan'
import { IVideo } from '@/interfaces/video'
import { comma } from '@/helper/number'
import { CookieKeyEnum } from '@/constants/cookie'
import {
  PlanStatus,
  PlanIdEnum,
  PlanUnlimitedEnum,
} from '@/constants/plan'
import { ImageDefaultEnum } from '@/constants/image'
import { ModalNameEnum } from '@/constants/modal'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  planDetail: {
    type: Object as PropType<IPlan>,
    default: () => {},
  },
  videoList: {
    type: Array as PropType<IVideo[]>,
    default: () => [],
  },
})

const router = useRouter()
const route = useRoute()
const { formatDate } = useHelper()
const { t } = useLang()
const { $showModal, $hiddenModal } = useNuxtApp()
const form = ref({
  content: null,
})
const isLoading = ref(false)

const rules = computed(() => {
  return {
    content: {
      required: helpers.withMessage(
        t('common.filed_no_required', {
          field: t('components.modal.plan_detail.content'),
        }),
        required
      ),
    },
  }
})

const v$ = useValidate(rules, form as any)

const numberVideo = computed(() => props.videoList.length)

const planStatus = computed(() => {
  if (props.planDetail.status === PlanStatus.PUBLIC) {
    return t('pages.plan_detail.plan_public')
  }
  return t('pages.plan_detail.plan_private')
})

const imageUrl = computed(() => {
  switch (props.planDetail.id) {
    case PlanIdEnum.FREE:
      return ImageDefaultEnum.IMAGE_PLAN_FREE
    case PlanIdEnum.LITE:
      return ImageDefaultEnum.IMAGE_PLAN_LITE
    case PlanIdEnum.STANDARD:
      return ImageDefaultEnum.IMAGE_PLAN_STANDARD
    case PlanIdEnum.ADVANCE:
      return ImageDefaultEnum.IMAGE_PLAN_ADVANCE
    default: //
  }
})

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

const errors = computed(() => {
  return {
    content: v$.value.content.$errors,
  }
})

const confirmUpgragePlan = async () => {
  const validate = await v$.value.$validate()
  if (!validate) {
    const ele = document.querySelector('.error-text')
    if (ele) {
      ele.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
    }
  } else {
    $showModal(ModalNameEnum.PLAN_UPGRADE)
    // planStore.updatePlanById(form.value as IPlan)
    // router.push('edit-confirmation')
  }
}

const handleUpgrade = async () => {
  try {
    const planId = route.params.id
    const { $api } = useNuxtApp()
    const userData: any = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    const id = JSON.parse(userData).facility_id
    const params = {
      plan_id: planId,
      note: form.value.content,
    }
    isLoading.value = true
    const res = await $api.facility.upgradePlan(
      id as string,
      params as any
    )
    if (res && res.data) {
      $showModal(ModalNameEnum.ALERT_SUCCESS)
    }
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

const gotoSetting = () => {
  router.push('/app/kanrisha/setting/?tab_info=2')
}

const { usePeriod, isAllowUpgrade } = usePlanUpgrade()
</script>

<template>
  <div :class="`theme-${theme}`">
    <div class="desktop:w-3/4">
      <div
        v-if="planDetail"
        class="grid grid-cols-1 gap-4 list-user__content relative"
      >
        <div class="common-info">
          <div class="information -mt-14px">
            <div class="information__item flex py-11px">
              <div
                class="information__item-label text-16px leading-24px font-medium"
              >
                {{ $t('pages.setting.plan_name') }}
              </div>
              <div
                class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
              >
                {{ planDetail.name }}
              </div>
            </div>
            <div class="information__item flex py-11px">
              <div
                class="information__item-label text-16px leading-24px font-medium"
              >
                {{ $t('pages.plan_list.video_count') }}
              </div>
              <div
                class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
              >
                {{ planVideo }}
              </div>
            </div>
            <div class="information__item flex py-11px">
              <div
                class="information__item-label text-16px leading-24px font-medium"
              >
                {{
                  $t(
                    'components.modal.plan_detail.period_of_use'
                  )
                }}
              </div>
              <div
                class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
              >
                {{ planDetail.time_plan_duration
                }}{{ $t('others.date') }}
              </div>
            </div>
            <div class="information__item flex py-11px">
              <div
                class="information__item-label text-16px leading-24px font-medium"
              >
                {{
                  $t(
                    'components.modal.plan_detail.use_period'
                  )
                }}
              </div>
              <div
                class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
              >
                {{ usePeriod || $t('others.empty') }}
              </div>
            </div>
            <div class="information__item flex py-11px">
              <div
                class="information__item-label text-16px leading-24px font-medium"
              >
                {{ $t('pages.plan_list.plan_price') }}
              </div>
              <div
                class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
              >
                {{ comma(planDetail?.plan_price)
                }}{{ $t('pages.plan_upgrade.price') }}
              </div>
            </div>
            <div class="information__item flex py-13px">
              <div
                class="information__item-label text-16px leading-24px font-medium"
              >
                {{
                  $t('components.modal.plan_detail.content')
                }}
                <span class="required">
                  {{
                    $t('pages.user_registration.required')
                  }}
                </span>
              </div>
              <div
                class="information__item-value w-full text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
              >
                <FormTextInput
                  v-model="form.content"
                  type-input="textarea"
                  class="textarea plan-content w-full"
                  :placeholder="
                    $t(
                      'pages.plan_edit.placeholder_content'
                    )
                  "
                  :rows="3"
                  :errors="errors.content"
                ></FormTextInput>
              </div>
            </div>
          </div>

          <div class="flex gap-31px mt-40px">
            <Button
              :theme="RoleEnum.ADMIN"
              type="outline"
              @click="router.go(-1)"
            >
              {{ $t('components.button.back') }}
            </Button>
            <Button
              :theme="RoleEnum.ADMIN"
              :is-disabled="!isAllowUpgrade"
              @click="confirmUpgragePlan"
            >
              {{ $t('pages.plan_upgrade.btn_submit') }}
            </Button>
          </div>

          <p class="note font-medium mt-40px">
            {{ $t('pages.plan_upgrade.note') }}
          </p>
        </div>

        <div class="flex justify-between mt-15px pr-24px">
          <div
            class="font-bold text-26px leading-24px font-bold"
          >
            {{ $t('components.menu.movie') }}
          </div>
          <div
            class="text-total text-16px leading-24px font-medium mt-6px"
          >
            {{ numberVideo }}
            {{ $t('components.header_lists.unit_subject') }}
          </div>
        </div>

        <div class="plan-list">
          <PlanVideoItem
            v-for="(video, index) in videoList"
            :key="index"
            :plan-video="video"
            :number="index + 1"
          />
        </div>

        <!-- Modal alert show infomation upgrade plan -->
        <ModalPlanUpgrade
          :plan-detail="planDetail"
          :note="form.content"
          :use-period="usePeriod"
          @click-submit="handleUpgrade"
        ></ModalPlanUpgrade>
        <!-- End -->

        <!-- Modal alert after show request upgrade plan -->
        <ModalMessage
          :id="ModalNameEnum.ALERT_SUCCESS"
          :message="$t('others.title_modal_common')"
          :sub-message="
            $t('pages.plan_upgrade.msg_upgrade_success')
          "
          :theme="RoleEnum.ADMIN"
          @click-submit="gotoSetting"
        />
        <!-- End -->

        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMIN"
          class="fixed w-full h-screen top-0 left-0 z-50"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.plan-detail,
.plan-list_item {
  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
  border-radius: 24px;
  background-color: $color-white-2;
}

:deep(.button-disable) {
  background-color: $color-gray-2 !important;
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

  .required {
    font-size: 14px;
    font-weight: 500;
    line-height: 14px;
    color: $color-red-1;
  }

  @media screen and (max-width: $screen-tablet) {
    &__item-label {
      min-width: 125px;
    }
  }
}
</style>
