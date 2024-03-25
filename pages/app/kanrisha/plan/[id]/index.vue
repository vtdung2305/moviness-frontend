<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { usePlan } from '@/stores/plan'
import { PlanStatus, PlanIdEnum } from '@/constants/plan'
import { ImageDefaultEnum } from '@/constants/image'
import { comma } from '@/helper/number'
import { useFacility } from '@/stores/facility'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'
import { PlanUnlimitedEnum } from '@/constants/plan'

definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.plan_list',
    route: { name: 'app-kanrisha-plan' },
  },

  {
    text: 'components.menu.plan_detail',
    route: { name: '' },
  },
]

const { t } = useLang()
const route = useRoute()
const router = useRouter()
const userStore = useUser()
const planStore = usePlan()
const isLoading = ref<Boolean>(false)
const facilityStore = useFacility()

const plansData = computed(() => planStore?.planDetail)

const isPrivatePlan = computed(
  () => plansData.value?.status === PlanStatus.PRIVATE
)

const planContractId = computed(
  () => facilityStore?.facilityDetail?.plan?.id
)

const isPlanUsing = computed(
  () => plansData.value?.id === planContractId.value
)

const numberVideo = computed(
  () => plansData.value?.videos.length
)

const planFree = computed(
  () => plansData.value?.id === PlanIdEnum.FREE
)

const imageUrl = computed(() => {
  switch (plansData.value?.id) {
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

const planPrice = computed(() => {
  if (!plansData.value?.plan_price) return null
  if (plansData.value?.id === PlanIdEnum.FREE) {
    return t('pages.plan_list.free')
  }
  return `${comma(plansData.value?.plan_price)}${t(
    'others.money'
  )}`
})

const planVideo = computed(() => {
  if (!plansData.value?.max_video_count) return null
  if (
    plansData.value?.max_video_count === PlanUnlimitedEnum
  ) {
    return t('pages.plan_list.unlimited')
  }
  return `${comma(plansData.value?.max_video_count)}${t(
    'others.book'
  )}`
})

const getPlanDetail = async () => {
  const id = route.params.id
  await planStore.getPlanDetail(id as string)
}

const getFacilityById = async () => {
  const id = userStore.userData?.facility_id as number
  await facilityStore.getFacilityDetail(id)
}

onMounted(async () => {
  isLoading.value = true
  await getPlanDetail()
  await getFacilityById()

  if (plansData.value?.status === 0) {
    router.push('/404')
  }
  isLoading.value = false
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.plan_detail')"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMIN"
          class="h-300px"
        />
        <div class="common-info desktop:w-3/4" v-else>
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
                    {{ plansData?.name }}
                  </div>
                  <div
                    class="text-14px leading-22px tracking-1.12px desktop:mt-0 tablet:mt-13px"
                  >
                    {{ plansData?.content }}
                  </div>
                </div>
                <div
                  class="grid gap-x-24px gap-y-8px pt-15px desktop:pt-13px tablet:pt-15px pl-0 tablet:grid-cols-2 plan-action"
                >
                  <div
                    class="grid grid-cols-custom text-14px leading-24px"
                  >
                    <span class="flex items-center">
                      <i
                        class="text-16px icon-film pr-5px"
                      />
                      {{
                        $t('pages.plan_list.video_count')
                      }}
                    </span>
                    <span class="value font-bold">
                      {{ planVideo }}
                    </span>
                  </div>
                  <div
                    v-if="plansData?.time_plan_duration"
                    class="grid grid-cols-custom text-14px leading-24px"
                  >
                    <span class="flex items-center">
                      <i
                        class="text-16px icon-clock pr-5px"
                      />
                      {{
                        $t(
                          'pages.plan_list.time_plan_duration'
                        )
                      }}
                    </span>
                    <span class="value font-bold">
                      {{
                        comma(
                          plansData?.time_plan_duration
                        )
                      }}{{ $t('others.date') }}
                    </span>
                  </div>
                  <div
                    v-if="plansData?.max_trainer_count"
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
                      {{
                        comma(plansData?.max_trainer_count)
                      }}{{ $t('others.people') }}
                    </span>
                  </div>
                  <div
                    v-if="plansData?.max_member_count"
                    class="grid grid-cols-custom text-14px leading-24px"
                  >
                    <span class="flex items-center">
                      <i
                        class="text-16px icon-user pr-5px"
                      />
                      {{
                        $t('pages.plan_list.member_count')
                      }}
                    </span>
                    <span class="value font-bold">
                      {{ comma(plansData?.max_member_count)
                      }}{{ $t('others.people') }}
                    </span>
                  </div>
                  <div
                    v-if="plansData?.max_group_count"
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
                      {{ comma(plansData?.max_group_count)
                      }}{{ $t('others.pieces') }}
                    </span>
                  </div>
                  <div
                    v-if="plansData?.plan_price"
                    class="grid grid-cols-custom text-14px leading-24px"
                  >
                    <span class="flex items-center"
                      ><i
                        class="text-16px icon-money pr-5px"
                      />
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
                v-if="isPlanUsing"
                class="flex flex-1 flex-col gap-8px items-end absolute desktop:top-30px desktop:right-30px <desktop:top-39px <desktop:right-60px <tablet:top-20px <tablet:right-20px"
              >
                <div class="tag outline-red font-bold">
                  {{ $t('pages.plan_list.contract') }}
                </div>
              </div>
            </div>
          </div>

          <p
            class="note font-medium mt-34px"
            v-if="!planFree"
          >
            {{ $t('pages.plan_detail.note_1')
            }}<nuxt-link
              :to="`/app/${userStore.roleName}/plan/${route.params.id}/upgrade`"
              >{{
                $t('pages.plan_detail.note_2')
              }}</nuxt-link
            >{{ $t('pages.plan_detail.note_3') }}
          </p>

          <div
            class="flex justify-between mt-32px pr-24px mb-20px"
          >
            <div
              class="font-bold text-26px leading-24px font-bold"
            >
              {{ $t('components.menu.movie') }}
            </div>
            <div
              class="text-total text-16px leading-24px font-medium mt-6px"
            >
              {{ numberVideo }}
              {{
                $t('components.header_lists.unit_subject')
              }}
            </div>
          </div>

          <div class="plan-list">
            <PlanVideoItem
              v-for="(video, index) in plansData?.videos"
              :key="index"
              :plan-video="video"
              :number="index + 1"
            />
          </div>
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
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

.note {
  a {
    color: $color-kanrisha;
    text-decoration: underline;

    &:hover {
      opacity: 0.6;
      transition: 0.3s;
    }
  }
}
</style>
