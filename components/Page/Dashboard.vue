<script setup lang="ts">
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import {
  ImageDefaultEnum,
  ImageTypeEnum,
} from '@/constants/image'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const userStore = useUser()
const { formatDate, planImageUrl, imageUrl, getFullName } =
  useHelper()
const isLoadingPage = ref(false)
const router = useRouter()
const { t } = useLang()

const themeShinseido = computed(() => {
  return props.theme === RoleEnum.ADMINISTRANTOR
})

const themeKanrisha = computed(() => {
  return props.theme === RoleEnum.ADMIN
})

const themeTrainer = computed(() => {
  return props.theme === RoleEnum.TRAINER
})

const titleGroup = computed(() => {
  if (statisticAdmin.value?.total_group_not_have_trainer_id)
    return t('pages.dashboard.title_group_has_number', {
      number:
        statisticAdmin.value
          ?.total_group_not_have_trainer_id,
    })
  return t('pages.dashboard.title_group')
})

const titlePlan = computed(() => {
  if (
    statisticSuperAdmin.value
      ?.total_facility_request_upgrade
  )
    return t('pages.dashboard.title_plan_has_number', {
      number:
        statisticSuperAdmin.value
          ?.total_facility_request_upgrade,
    })
  return t('pages.dashboard.title_plan')
})

const titleMember = computed(() => {
  if (
    statisticAdmin.value
      ?.total_member_not_have_trainer_id ||
    statisticAdmin.value?.total_member_not_have_group_id
  )
    return t('pages.dashboard.title_member_has_number', {
      number: themeKanrisha.value
        ? statisticAdmin.value
            ?.total_member_not_have_trainer_id
        : statisticAdmin.value
            ?.total_member_not_have_group_id,
    })
  return t('pages.dashboard.title_member')
})

const gotoTrainerList = (query: string) => {
  if (query) {
    router.push(
      `/app/${userStore.roleName}/trainer?status_group_user=${query}`
    )
  } else {
    router.push(`/app/${userStore.roleName}/trainer`)
  }
}

const gotoGroupList = (query: string) => {
  if (query) {
    router.push(
      `/app/${userStore.roleName}/group?status=${query}`
    )
  } else {
    router.push(`/app/${userStore.roleName}/group`)
  }
}

const gotoMemberList = (query: string) => {
  if (query) {
    router.push(
      `/app/${userStore.roleName}/user?status=${query}`
    )
  } else {
    router.push(`/app/${userStore.roleName}/user`)
  }
}

const gotoFacilityList = (
  query: string,
  planId: number | string
) => {
  if (planId) {
    router.push(
      `/app/${userStore.roleName}/facility?planId=${planId}`
    )
  } else if (query) {
    router.push(
      `/app/${userStore.roleName}/facility?status=${query}`
    )
  } else {
    router.push(`/app/${userStore.roleName}/facility`)
  }
}

const gotoFacilityDetail = (
  falicityId: number | string
) => {
  router.push(
    `/app/${userStore.roleName}/facility/${falicityId}`
  )
}

const gotoGroupDetail = (groupId: number | string) => {
  router.push(`/app/${userStore.roleName}/group/${groupId}`)
}

const gotoMemberDetail = (memberId: number | string) => {
  router.push(
    `/app/${userStore.roleName}/user/${memberId}?tab_info=2`
  )
}

const {
  date,
  optionChart,
  chartData,
  remainingPlan,
  planInfo,
  statisticAdmin,
  groupAdmin,
  memberAdmin,
  memberStatistic,
  statisticSuperAdmin,
  planHistoriesSuperAdmin,
  planFacilities,
  getFacilityStatisticMembers,
} = useDashboard()

const planExpireAt = computed(() => {
  return t('pages.dashboard.expiration_plan_2', {
    plan_expire_at: formatDate(
      planInfo?.value?.plan_expire_at as string
    ),
  })
})

watch(date, async (newVal, oldVal) => {
  if (oldVal) {
    isLoadingPage.value = true
    await getFacilityStatisticMembers()
    isLoadingPage.value = false
  }
})
</script>

<template>
  <div :class="`theme`">
    <div class="desktop:w-3/4">
      <div
        class="grid grid-cols-1 gap-8 list-user__content mt-15px"
      >
        <div class="dashboard">
          <div v-if="!themeShinseido" class="dashboad-top">
            <div
              v-if="remainingPlan"
              class="notify flex items-center gap-x-15px px-22px py-23px shadow rounded-24px mt-6px mb-25px"
            >
              <div class="notify-icon">
                <span
                  class="icon-exclamation-circle"
                  :class="userStore.roleName"
                ></span>
              </div>
              <div class="flex flex-col">
                <div
                  class="notify-text text-20px leading-24px font-bold <mobile:text-16px <mobile:leading-24px"
                >
                  {{
                    $t('pages.dashboard.expiration_plan_1')
                  }}
                </div>
                <div
                  class="notify-text text-20px leading-24px font-bold <mobile:text-16px <mobile:leading-24px"
                >
                  {{ planExpireAt }}
                </div>
                <div
                  class="notify-text text-20px leading-24px font-bold <mobile:text-16px <mobile:leading-24px"
                  v-if="themeKanrisha"
                >
                  {{
                    $t('pages.dashboard.expiration_plan_3')
                  }}<nuxt-link
                    :to="`/app/${userStore.roleName}/plan`"
                  >
                    {{
                      $t(
                        'pages.dashboard.expiration_plan_4'
                      )
                    }} </nuxt-link
                  >{{
                    $t('pages.dashboard.expiration_plan_5')
                  }}
                </div>
                <div
                  class="notify-text text-20px leading-24px font-bold <mobile:text-16px <mobile:leading-24px"
                  v-if="themeTrainer"
                >
                  {{
                    $t('pages.dashboard.expiration_plan_6')
                  }}
                </div>
              </div>
            </div>
            <h2 class="title font-bold !tracking-1.5px">
              {{ $t('pages.dashboard.contract_plan') }}
            </h2>
            <div
              v-if="planInfo"
              class="flex gap-x-14px mt-13px"
            >
              <div class="img">
                <img
                  :src="planImageUrl(planInfo?.plan_name)"
                  alt=""
                  class="w-56px h-56px rounded-1/2"
                />
              </div>
              <div class="info pt-3px">
                <p class="text-24px font-bold pb-4px">
                  {{ planInfo?.plan_name }}
                </p>
                <span
                  >{{ $t('pages.dashboard.remaining_day')
                  }}{{ planInfo?.remaining_available_day
                  }}{{ $t('others.date') }}</span
                >
              </div>
            </div>
          </div>
          <div
            v-if="!themeShinseido"
            class="guide mt-6 flex"
          >
            <img
              class="inline-block"
              src="../../assets/images/guide.svg"
              alt=""
            />
            <span class="text-base font-bold">
              {{ $t('pages.dashboard.guide.content') }}
            </span>
            <a
              :class="[
                themeKanrisha ? 'kanrisya' : 'trainer',
                'text-base underline cursor-pointer transition',
              ]"
              href="/guide"
              target="_blank"
            >
              {{ $t('pages.dashboard.guide.button') }}
            </a>
          </div>
          <div
            class="flex gap-x-32px <tablet:flex-wrap"
            :class="`${
              !themeShinseido ? 'mt-32px' : 'mt-7px'
            }`"
          >
            <!-- Only super admin -->
            <template v-if="themeShinseido">
              <div
                class="item text-center rounded-24px py-30px shadow <tablet:mb-24px"
              >
                <div
                  class="flex justify-center items-center menu-container rounded-1/2"
                  :class="userStore.roleName"
                >
                  <span
                    class="icon-office menu__icon"
                  ></span>
                </div>
                <div class="number-group mt-18px mb-14px">
                  <div class="text-16px font-bold mb-10px">
                    {{
                      $t(
                        'pages.dashboard.number_of_facilities'
                      )
                    }}
                    <span
                      v-tooltip="{
                        content: `${$t(
                          'pages.dashboard.tooltip_facility_content'
                        )}`,
                        container: '.dashboard',
                      }"
                      class="icon-exclamation-circle tooltip"
                    ></span>
                  </div>
                  <span
                    class="text-56px font-bold <mobile:text-40"
                  >
                    {{
                      statisticSuperAdmin?.total_number_facility
                    }}
                  </span>
                </div>

                <span
                  class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                  :class="userStore.roleName"
                  @click="gotoFacilityList()"
                >
                  {{ $t('pages.dashboard.view_more') }}
                </span>
              </div>

              <div
                class="item text-center rounded-24px py-30px shadow <tablet:mb-24px"
              >
                <div
                  class="flex justify-center items-center menu-container rounded-1/2"
                  :class="userStore.roleName"
                >
                  <span
                    class="icon-training menu__icon"
                  ></span>
                </div>
                <div class="number-group mt-18px mb-14px">
                  <div class="text-16px font-bold mb-10px">
                    {{
                      $t(
                        'pages.dashboard.number_of_trainers'
                      )
                    }}
                    <span
                      v-tooltip="{
                        content: `${$t(
                          'pages.dashboard.tooltip_trainer_content'
                        )}`,
                        container: '.dashboard',
                      }"
                      class="icon-exclamation-circle tooltip"
                    ></span>
                  </div>
                  <span
                    class="text-56px font-bold <mobile:text-40"
                  >
                    {{
                      statisticSuperAdmin?.total_number_trainer
                    }}
                  </span>
                </div>

                <span
                  class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                  :class="userStore.roleName"
                  @click="gotoTrainerList()"
                >
                  {{ $t('pages.dashboard.view_more') }}
                </span>
              </div>

              <div
                class="item text-center rounded-24px py-30px shadow"
              >
                <div
                  class="flex justify-center items-center menu-container rounded-1/2"
                  :class="userStore.roleName"
                >
                  <span class="icon-user menu__icon"></span>
                </div>
                <div class="number-group mt-18px mb-14px">
                  <div class="text-16px font-bold mb-10px">
                    {{
                      $t(
                        'pages.dashboard.number_of_members'
                      )
                    }}
                    <span
                      v-tooltip="{
                        content: `${$t(
                          'pages.dashboard.tooltip_member_content'
                        )}`,
                        container: '.dashboard',
                      }"
                      class="icon-exclamation-circle tooltip"
                    ></span>
                  </div>
                  <span
                    class="text-56px font-bold <mobile:text-40px"
                    >{{
                      statisticSuperAdmin?.total_number_member
                    }}</span
                  >
                </div>

                <span
                  class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                  :class="userStore.roleName"
                  @click="gotoMemberList()"
                >
                  {{ $t('pages.dashboard.view_more') }}
                </span>
              </div>
            </template>
            <!-- end -->

            <!-- Only admin -->
            <div
              v-if="themeKanrisha"
              class="item text-center rounded-24px py-30px shadow <tablet:mb-24px"
            >
              <div
                class="flex justify-center items-center menu-container rounded-1/2"
                :class="userStore.roleName"
              >
                <span
                  class="icon-training menu__icon"
                ></span>
              </div>
              <div class="number-group mt-18px mb-14px">
                <div class="text-16px font-bold mb-10px">
                  {{
                    $t('pages.dashboard.number_of_trainers')
                  }}
                </div>
                <span
                  class="text-56px font-bold <mobile:text-40"
                  >{{
                    statisticAdmin?.total_trainer_available
                  }}</span
                >
              </div>

              <span
                class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                :class="userStore.roleName"
                @click="gotoTrainerList(1)"
              >
                {{ $t('pages.dashboard.view_more') }}
              </span>
            </div>
            <!-- end -->

            <div
              v-if="themeKanrisha || themeTrainer"
              class="item text-center rounded-24px py-30px shadow <tablet:mb-24px"
            >
              <div
                class="flex justify-center items-center menu-container rounded-1/2"
                :class="userStore.roleName"
              >
                <span
                  class="icon-flag-star menu__icon"
                ></span>
              </div>
              <div class="number-group mt-18px mb-14px">
                <div class="text-16px font-bold mb-10px">
                  {{
                    $t('pages.dashboard.number_of_groups')
                  }}
                </div>
                <span
                  class="text-56px font-bold <mobile:text-40"
                  >{{
                    themeKanrisha
                      ? statisticAdmin?.total_group_available
                      : statisticAdmin?.total_group
                  }}</span
                >
              </div>

              <span
                class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                :class="userStore.roleName"
                @click="gotoGroupList()"
              >
                {{ $t('pages.dashboard.view_more') }}
              </span>
            </div>

            <div
              v-if="themeKanrisha || themeTrainer"
              class="item text-center rounded-24px py-30px shadow"
            >
              <div
                class="flex justify-center items-center menu-container rounded-1/2"
                :class="userStore.roleName"
              >
                <span class="icon-user menu__icon"></span>
              </div>
              <div class="number-group mt-18px mb-14px">
                <div class="text-16px font-bold mb-10px">
                  {{
                    $t('pages.dashboard.number_of_members')
                  }}
                </div>
                <span
                  class="text-56px font-bold <mobile:text-40px"
                  >{{
                    themeKanrisha
                      ? statisticAdmin?.total_member_available
                      : statisticAdmin?.total_member
                  }}</span
                >
              </div>

              <span
                class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                :class="userStore.roleName"
                @click="gotoMemberList()"
              >
                {{ $t('pages.dashboard.view_more') }}
              </span>
            </div>
          </div>

          <div
            v-if="!themeShinseido"
            class="grid mt-24px"
            :class="`${
              themeKanrisha
                ? 'grid-cols-2 gap-x-32px <tablet:grid-cols-1'
                : ''
            }`"
          >
            <!-- Only admin -->
            <div
              v-if="themeKanrisha"
              class="user-info shadow px-32px pt-27px rounded-24px <tablet:mb-24px pt-27px <tablet:pb-27px relative"
              :class="
                groupAdmin?.length ? 'pb-80px' : 'pb-27px'
              "
            >
              <p
                class="user-info__title font-bold flex items-center"
              >
                {{ titleGroup
                }}<span
                  v-tooltip="{
                    content: `${$t(
                      'pages.dashboard.tooltip_group'
                    )}`,
                    container: '.dashboard',
                  }"
                  class="ml-6px icon-exclamation-circle tooltip"
                ></span>
              </p>
              <template v-if="groupAdmin?.length">
                <div class="user-info__list mt-4px">
                  <div
                    v-for="(group, index) in groupAdmin"
                    :key="index"
                    class="user-info__list__item flex items-center gap-x-10px pt-7px pb-8px cursor-pointer transition hover:opacity-60"
                    @click="gotoGroupDetail(group.id)"
                  >
                    <div class="img w-32px">
                      <ImageBox
                        class="w-32px h-32px rounded-1/2"
                        :src="
                          imageUrl(
                            group.url_image,
                            ImageTypeEnum.TYPE_GROUP
                          )
                        "
                        :classes="`rounded-1/2`"
                      />
                    </div>
                    <div
                      class="info text-18px leading-24px font-medium"
                    >
                      {{ group.name }}
                    </div>
                  </div>
                </div>

                <div
                  class="user-info__action text-center pt-19px pb-10px action-button"
                >
                  <span
                    class="view-more rounded-30px py-8px px-28px cursor-pointer transition"
                    :class="userStore.roleName"
                    @click="gotoGroupList(2)"
                  >
                    {{ $t('pages.dashboard.view_more') }}
                  </span>
                </div>
              </template>

              <div
                v-else
                class="flex items-center justify-center no-data"
              >
                {{ $t('others.no_data') }}
              </div>
            </div>
            <!-- End -->

            <div
              class="user-info shadow px-32px pt-27px rounded-24px relative <tablet:pb-27px"
              :class="
                memberAdmin?.length ? 'pb-80px' : 'pb-27px'
              "
            >
              <p
                class="user-info__title font-bold flex items-center"
              >
                {{ titleMember }}
                <span
                  v-tooltip="{
                    content: `${$t(
                      'pages.dashboard.tooltip_member'
                    )}`,
                    container: '.dashboard',
                  }"
                  class="ml-6px icon-exclamation-circle tooltip"
                ></span>
              </p>
              <template v-if="memberAdmin?.length">
                <div class="user-info__list mt-4px">
                  <div
                    v-for="(user, index) in memberAdmin"
                    :key="index"
                    class="user-info__list__item flex items-center gap-x-10px pt-7px pb-8px cursor-pointer transition hover:opacity-60"
                    @click="gotoMemberDetail(user.id)"
                  >
                    <div class="img w-32px">
                      <ImageBox
                        class="w-32px h-32px rounded-1/2"
                        :src="
                          imageUrl(
                            user.url_avatar,
                            ImageTypeEnum.TYPE_MEMBER
                          )
                        "
                        :classes="`rounded-1/2`"
                      />
                    </div>
                    <div
                      class="info text-18px leading-24px font-medium"
                    >
                      {{
                        getFullName(
                          user?.last_name,
                          user?.first_name
                        )
                      }}
                    </div>
                  </div>
                </div>

                <div
                  class="user-info__action text-center pt-19px pb-10px action-button"
                >
                  <span
                    class="view-more rounded-30px py-8px px-28px cursor-pointer transition"
                    :class="userStore.roleName"
                    @click="gotoMemberList(2)"
                  >
                    {{ $t('pages.dashboard.view_more') }}
                  </span>
                </div>
              </template>
              <div
                v-else
                class="flex items-center justify-center no-data"
              >
                {{ $t('others.no_data') }}
              </div>
            </div>
          </div>

          <div v-if="themeKanrisha" class="chart mt-23px">
            <div
              class="chart-dashboard shadow rounded-24px px-30px py-36px <tablet:p-20px"
            >
              <div
                class="flex justify-between pr-20px <tablet:flex-wrap <tablet:flex-col pr-0"
              >
                <span
                  class="chart-dashboard__title text-14px font-bold"
                  >{{
                    $t(
                      'pages.dashboard.title_number_of_user'
                    )
                  }}</span
                >
                <!-- <FormDatePickerRanger
                  v-model="date"
                  class="-mt-2px <tablet:mt-16px"
                ></FormDatePickerRanger> -->
                <FormDatePicker
                  v-model:value="date"
                  :disabled="(date) => date >= new Date()"
                  :range="true"
                />
              </div>
              <div class="mt-14px">
                <template v-if="memberStatistic?.length">
                  <LineChart
                    v-if="!isLoadingPage"
                    :chart-data="chartData"
                    :option-chart="optionChart"
                  />
                </template>
                <template v-else>
                  <div
                    class="flex items-center justify-center no-data"
                  >
                    {{ $t('others.no_data') }}
                  </div>
                </template>
                <Loading
                  v-if="isLoadingPage"
                  :theme="userStore.roleName"
                  class="h-300px"
                />
              </div>
            </div>
          </div>

          <div
            v-if="themeShinseido"
            class="dashboard-plan mt-30px"
          >
            <div
              class="dashboard-plan__history shadow rounded-24px px-32px py-30px <mobile:p-20px"
            >
              <span
                class="title font-bold flex items-center"
                >{{ titlePlan }}
                <span
                  v-if="planHistoriesSuperAdmin?.length"
                  v-tooltip="{
                    content: `${$t(
                      'pages.dashboard.tooltip_plan'
                    )}`,
                    container: '.dashboard',
                  }"
                  class="ml-6px icon-exclamation-circle tooltip"
                ></span
              ></span>
              <template
                v-if="planHistoriesSuperAdmin?.length"
              >
                <div class="dashboard-plan__history__tbl">
                  <table class="table-fixed w-full mt-3px">
                    <thead>
                      <tr>
                        <th class="w-192px">
                          {{
                            $t(
                              'pages.dashboard.name_of_facility'
                            )
                          }}
                        </th>
                        <th class="w-283px">
                          {{
                            $t(
                              'pages.dashboard.request_content'
                            )
                          }}
                        </th>
                        <th>
                          {{
                            $t(
                              'pages.dashboard.request_date'
                            )
                          }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(
                          facility, index
                        ) in planHistoriesSuperAdmin"
                        :key="index"
                        class="cursor-pointer transition hover:opacity-60"
                        @click="
                          gotoFacilityDetail(facility.id)
                        "
                      >
                        <td>
                          <div
                            class="flex items-center gap-x-10px"
                          >
                            <div class="img w-32px">
                              <ImageBox
                                class="w-32px h-32px rounded-1/2"
                                :src="
                                  imageUrl(
                                    facility.thumbnail,
                                    ImageTypeEnum.TYPE_FACILITY
                                  )
                                "
                                :classes="`rounded-1/2`"
                              />
                            </div>
                            <div
                              class="info text-16px leading-24px font-medium w-[calc(100%-42px)] line-clamp"
                            >
                              {{ facility.name }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="line-clamp">
                            <span class="plan-old">{{
                              facility
                                ?.history_plan_purchased_last
                                ?.plan_name_before
                            }}</span>
                            <span class="plan-new font-bold"
                              ><i
                                v-if="
                                  facility
                                    ?.history_plan_purchased_last
                                    ?.plan_name_before
                                "
                                class="icon-arrow-right text-9px inline-block align-middle mx-5px"
                              ></i
                              >{{
                                facility
                                  ?.history_plan_purchased_last
                                  ?.plan_name_current
                              }}</span
                            >
                          </div>
                        </td>
                        <td>
                          {{
                            formatDate(
                              facility
                                ?.history_plan_purchased_last
                                .request_time_plan_purchased
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  class="dashboard-plan__action text-center mt-24px mb-8px"
                >
                  <span
                    class="view-more rounded-30px py-8px px-28px <mobile:px-18px cursor-pointer transition"
                    :class="userStore.roleName"
                    @click="gotoFacilityList(3)"
                  >
                    {{ $t('pages.dashboard.view_more') }}
                  </span>
                </div>
              </template>
              <div
                v-else
                class="flex items-center justify-center no-data"
              >
                {{ $t('others.no_data') }}
              </div>
            </div>
          </div>

          <div
            v-if="themeShinseido"
            class="dashboard-plan mt-30px"
          >
            <div
              class="dashboard-plan__number shadow rounded-24px px-32px py-30px <mobile:p-20px"
            >
              <span class="title font-bold">{{
                $t(
                  'pages.dashboard.number_plan_subscriptions'
                )
              }}</span>
              <div
                class="dashboard-plan__number__list flex gap-x-20px justify-between mt-10px"
              >
                <div
                  v-for="(
                    facility, index
                  ) in planFacilities"
                  :key="index"
                  class="dashboard-plan__item flex items-start gap-x-16px <mobile:gap-x-10px cursor-pointer"
                  @click="
                    gotoFacilityList(null, facility.id)
                  "
                >
                  <div
                    class="w-48px h-48px rounded-1/2 overflow-hidden"
                  >
                    <img
                      :src="planImageUrl(facility.name)"
                      alt=""
                      class="w-48px h-48px"
                    />
                  </div>
                  <div class="info font-bold">
                    <p
                      class="text-14px leading-22px font-bold"
                    >
                      {{ facility.name }}
                    </p>
                    <span
                      class="text-24px -tracking-0.5px flex gap-14px"
                      >{{
                        facility.number_facility_register
                      }}
                      <i
                        class="icon-down transform -rotate-90 text-8px"
                      ></i
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: $color-gray-2;
  letter-spacing: -1px;
  font-size: 14px;
}

.menu__icon {
  &::before {
    color: $color-white;
    font-size: 16px;
  }
}

.menu-container {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  margin: auto;

  &.shinseido {
    background: $gradient-90-shinseido;
  }

  &.kanrisha {
    background: $gradient-90-kanrisha;
  }

  &.trainer {
    background: $gradient-90-trainer;
  }
}

.shadow {
  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
}

.item {
  background: $color_white;
  width: 328px;
  height: 245px;

  @media screen and (max-width: $screen-tablet) {
    width: 100%;
    height: auto;
  }
}

.view-more {
  border: 1px solid;
  font-size: 14px;
  font-weight: bold;

  &.shinseido {
    color: $color-shinseido;
  }

  &.kanrisha {
    color: $color-kanrisha;
  }

  &.trainer {
    color: $color-trainer;
  }

  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }
}

.user-info {
  background: $color-white;

  &__title {
    color: $color-gray-2;
    font-size: 14px;
  }

  &__list {
    &__item {
      border-bottom: 1px solid $color-gray-3;

      .info {
        width: calc(100% - 42px);
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.notify {
  background: $color-white;

  &-icon {
    .icon-exclamation-circle {
      &::before {
        font-size: 40px;
        color: $color-red-1;
      }
    }
  }
}

.chart-dashboard {
  background: $color-white;

  &__title {
    color: $color-gray-2;
  }
}

.dashboard-plan {
  &__history {
    background: $color-white;

    &__tbl {
      @media screen and (max-width: 767px) {
        overflow-x: scroll;
      }
    }
  }

  &__number {
    background: $color-white;

    @media screen and (max-width: 767px) {
      &__list {
        flex-wrap: wrap;
        column-gap: 0;
        // flex-direction: ;
      }
    }
  }

  &__item {
    @media screen and (max-width: 767px) {
      width: 50%;
      margin-bottom: 24px;
    }
  }
}

table {
  @media screen and (max-width: 767px) {
    width: 624px;
  }

  tr {
    border-bottom: 1px solid $color-gray-3;

    > th {
      color: $color-gray-2;
      text-align: left;
      padding: 11px 0 11px;
    }

    > td {
      padding: 8px 15px 8px 0;
    }
  }
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-data {
  padding: calc(2.5rem + 14px) 0;
  height: calc(100% - 30px);
}

.action-button {
  @media screen and (min-width: $screen-tablet) {
    @apply absolute left-0 right-0 bottom-27px;
  }
}

.dashboard {
  .v-popper__inner {
    width: 200px;
    font-size: 14px;
  }
}

.notify-text {
  a {
    color: $color-kanrisha;
    text-decoration: underline;

    &:hover {
      opacity: 0.6;
      transition: 0.3s;
    }
  }
}

.guide {
  .kanrisya {
    color: $color-kanrisha;
  }

  .trainer {
    color: $color-trainer;
  }
}
</style>
