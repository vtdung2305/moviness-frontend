<script setup lang="ts">
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { IPlan } from '@/interfaces/plan'
import { IVideo } from '@/interfaces/video'
import { comma } from '@/helper/number'
import {
  PlanStatus,
  PlanIdEnum,
  PlanUnlimitedEnum,
} from '@/constants/plan'
import { ImageDefaultEnum } from '@/constants/image'

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

const planEdit = () => {
  router.push(`/app/shinseido/plan/${route.params.id}/edit`)
}

const { t } = useLang()

const isDisabledButton = computed(() => {
  if (props.planDetail.status === 1) return true
  return false
})

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
</script>

<template>
  <div :class="`theme-${theme}`">
    <div class="desktop:w-3/4">
      <div
        class="grid grid-cols-1 gap-4 list-user__content"
      >
        <div
          class="plan-detail grid grid-cols-[80px,1fr] gap-25px p-15px desktop:px-32px tablet:py-32px tablet:px-40px tablet:py-40px tablet:items-center"
        >
          <div class="plan-detail_img w-80px">
            <img
              class="rounded-1/2"
              :src="imageUrl"
              alt=""
            />
          </div>
          <div class="plan-detail_info">
            <h2
              class="plan-title text-20px leading-24px font-bold mb-10px"
            >
              {{ planDetail.name }}
            </h2>
            <p
              class="plan-desc text-14px leading-20px mb-15px"
            >
              {{ planDetail.content }}
            </p>
            <div
              class="plan-action grid grid-cols-[max-content,max-content,max-content] gap-20px"
            >
              <span
                class="flex items-center text-14px font-bold"
                ><i class="icon-film pr-5px"></i>
                {{ planVideo }}
              </span>
              <span
                class="flex items-center text-14px font-bold"
                ><i class="icon-clock pr-5px"></i>
                {{ comma(planDetail.time_plan_duration)
                }}{{ $t('others.date') }}</span
              >
              <span
                class="flex items-center text-14px font-bold"
              >
                {{ planStatus }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-26px pr-24px">
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
        <div class="plan-action">
          <Button
            :is-disabled="isDisabledButton"
            @click="planEdit"
          >
            {{ $t('pages.plan_detail.btn_edit_plan') }}
          </Button>
        </div>
        <div v-if="isDisabledButton" class="text-center">
          <p class="text-14px">
            {{ $t('pages.plan_detail.txt_public') }}
          </p>
        </div>
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
</style>
