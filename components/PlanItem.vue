<script lang="ts" setup>
import type { PropType } from 'vue'
import { IPlan } from '@/interfaces/plan'
import { comma } from '@/helper/number'
import {
  PlanStatus,
  PlanIdEnum,
  PlanUnlimitedEnum,
} from '@/constants/plan'
import { ImageDefaultEnum } from '@/constants/image'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'

const router = useRouter()

// micro compiler
const props = defineProps({
  planItem: {
    type: Object as PropType<IPlan>,
    default: () => {},
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const { t } = useLang()

const imageUrl = computed(() => {
  switch (props.planItem.id) {
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

const isPrivatePlan = computed(
  () => props.planItem.status === PlanStatus.PRIVATE
)

const planVideo = computed(() => {
  if (!props?.planItem?.max_video_count) return null
  if (
    props.planItem.max_video_count === PlanUnlimitedEnum
  ) {
    return t('pages.plan_list.unlimited')
  }
  return `${comma(props?.planItem?.max_video_count)}${t(
    'others.book'
  )}`
})

const planPrice = computed(() => {
  if (!props?.planItem?.plan_price) return null
  if (props?.planItem.id === PlanIdEnum.FREE) {
    return t('pages.plan_list.free')
  }
  return `${comma(props?.planItem?.plan_price)}${t(
    'others.money'
  )}`
})

const themeKanrisha = computed(() => {
  return props.theme === RoleEnum.ADMIN
})

const planFree = computed(
  () => props.planItem.id === PlanIdEnum.FREE
)

const isPlanUsing = computed(
  () => props.planItem.id === planContractId.value
)

const { planContractId } = usePlanList()

// lifecycle
onMounted(() => {})
</script>

<template>
  <NuxtLink
    :to="
      themeKanrisha
        ? `/app/kanrisha/plan/${planItem.id}`
        : `/app/shinseido/plan/${planItem.id}`
    "
  >
    <div
      class="relative flex <desktop:flex-col py-32px px-30px px-4 py-4 flex-1 card desktop:py-32px desktop:px-30px <desktop:px-55px <desktop:pt-30px <desktop:pb-20px <tablet:px-20px"
    >
      <div
        class="flex pb-4 items-start desktop:pb-8px <desktop:items-center <tablet:pb-0 <tablet:flex-wrap"
      >
        <div
          class="w-150px cursor-pointer desktop:w-80px tablet:w-114px <tablet:center <tablet:w-full <mobile:mb-20px"
        >
          <img
            class="avatar rounded-1/2 <tablet:mx-auto <tablet:w-130px"
            :src="imageUrl"
            alt=""
          />
        </div>
        <div
          class="w-full pl-38px desktop:w-[calc(100%-80px)] desktop:p-0 desktop:pl-38px tablet:w-[calc(100%-114px)] tablet:py-4px tablet:pl-60px tablet:pr-0 <tablet:pl-0"
        >
          <div
            class="relative flex flex-col justify-center gap-8px desktop:gap-0px"
          >
            <div
              class="text-26px leading-26px font-bold tracking-3px mt-4px cursor-pointer desktop:mt-0px desktop:mb-20px"
            >
              {{ planItem.name }}
            </div>
            <div
              class="text-14px leading-22px tracking-1.12px desktop:mt-0 tablet:mt-13px"
            >
              {{ planItem.content }}
            </div>
          </div>
          <div
            class="grid gap-x-24px gap-y-8px pt-15px desktop:pt-13px tablet:pt-15px pl-0 tablet:grid-cols-2 plan-action"
          >
            <div
              class="grid grid-cols-custom text-14px leading-24px"
            >
              <span class="flex items-center">
                <i class="text-16px icon-film pr-5px" />
                {{ $t('pages.plan_list.video_count') }}
              </span>
              <span class="value font-bold">
                {{ planVideo }}
              </span>
            </div>
            <div
              v-if="planItem.time_plan_duration"
              class="grid grid-cols-custom text-14px leading-24px"
            >
              <span class="flex items-center">
                <i class="text-16px icon-clock pr-5px" />
                {{
                  $t('pages.plan_list.time_plan_duration')
                }}
              </span>
              <span class="value font-bold">
                {{ comma(planItem.time_plan_duration)
                }}{{ $t('others.date') }}
              </span>
            </div>
            <div
              v-if="planItem.max_trainer_count"
              class="grid grid-cols-custom text-14px leading-24px"
            >
              <span class="flex items-center"
                ><i
                  class="text-16px icon-training pr-5px"
                />
                {{
                  $t('pages.plan_list.trainer_count')
                }}</span
              >
              <span class="value font-bold">
                {{ comma(planItem.max_trainer_count)
                }}{{ $t('others.people') }}
              </span>
            </div>
            <div
              v-if="planItem.max_member_count"
              class="grid grid-cols-custom text-14px leading-24px"
            >
              <span class="flex items-center">
                <i class="text-16px icon-user pr-5px" />
                {{ $t('pages.plan_list.member_count') }}
              </span>
              <span class="value font-bold">
                {{ comma(planItem.max_member_count)
                }}{{ $t('others.people') }}
              </span>
            </div>
            <div
              v-if="planItem.max_group_count"
              class="grid grid-cols-custom text-14px leading-24px"
            >
              <span class="flex items-center"
                ><i
                  class="text-16px icon-flag-star pr-5px"
                />
                {{
                  $t('pages.plan_list.group_count')
                }}</span
              >
              <span class="value font-bold">
                {{ comma(planItem.max_group_count)
                }}{{ $t('others.pieces') }}
              </span>
            </div>
            <div
              v-if="planItem.plan_price"
              class="grid grid-cols-custom text-14px leading-24px"
            >
              <span class="flex items-center"
                ><i class="text-16px icon-money pr-5px" />
                {{ $t('pages.plan_list.plan_price') }}
              </span>
              <span class="value font-bold">
                {{ planPrice }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="isPrivatePlan"
          class="flex flex-1 flex-col gap-8px items-end absolute desktop:top-30px desktop:right-30px <desktop:top-39px <desktop:right-60px <tablet:top-20px <tablet:right-20px"
        >
          <div class="tag outline-red font-bold">
            {{ $t('pages.plan_list.status') }}
          </div>
        </div>
        <div
          v-if="themeKanrisha && isPlanUsing"
          class="flex flex-1 flex-col gap-8px items-end absolute desktop:top-30px desktop:right-30px <desktop:top-39px <desktop:right-60px <tablet:top-20px <tablet:right-20px"
        >
          <div class="tag outline-red font-bold">
            {{ $t('pages.plan_list.contract') }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.card {
  @media screen and (min-width: $screen-desktop) {
    // padding: 18px 24px 24px 24px;
    padding-bottom: 23px;
  }

  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
  border-radius: 24px;
  background-color: $color-white-2;
}

.theme-shinseido .tag.primary {
  background-color: $color-shinseido;
}

.theme-trainer .tag.primary {
  background-color: $color-trainer;
}

.theme-kanrisha .tag.primary {
  background-color: $color-kanrisha;
}

.tag {
  padding: 8px 16px;
  font-size: $font-14;
  line-height: $font-14;
  letter-spacing: 1.12px;
  border-radius: 12px;
  width: fit-content;

  &.primary {
    color: $color-white;
  }

  &.outline-red {
    color: $color-red-1;
    border: 1px solid $color-red-1;
    padding: 7px 14px;
  }
}

.grid-cols-custom {
  grid-template-columns: repeat(2, minmax(120px, 1fr));
}

.plan-action {
  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
