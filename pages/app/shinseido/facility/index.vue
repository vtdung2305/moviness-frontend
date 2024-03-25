<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useFacility } from '@/stores/facility'
import {
  facilityStatusList,
  facilityOrderList,
} from '@/constants/facility'
import { usePlan } from '@/stores/plan'
import { ModalNameEnum } from '@/constants/modal'
definePageMeta({
  layout: 'page',
})

const { t } = useLang()
const facilityStore = useFacility()
const planStore = usePlan()
const statusList = facilityStatusList.map(
  (item) => item.name
)
const route = useRoute()
const sortList = facilityOrderList.map((item) => item.name)

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.facitily',
    route: { name: '' },
  },
]

const isLoading = ref<Boolean>(true)
const filter = ref({
  status: statusList[0],
  plan: 'pages.user_list.all',
  keyword: '',
  orderName: facilityOrderList[0].name,
  order_by: facilityOrderList[0].order_by,
  order_type: facilityOrderList[0].order_type,
  page: 1,
})

const planList = computed(() =>
  planStore.planList.map((item) => item.name)
)

const statusId = computed(() => {
  const status = facilityStatusList.find(
    (item) => item.name === filter.value.status
  )
  if (status) {
    return status.value === null ? null : [status.value]
  }
  return null
})

const planId = computed<string | null>(
  (): string | null => {
    const plan = planStore.planList.find(
      (item) => item.name === filter.value.plan
    )
    if (plan && plan.id) {
      return (plan.id as number).toString()
    }
    return null
  }
)

onMounted(async () => {
  await planStore.getPlanList()
  planStore.planList = [
    { name: t('pages.user_list.all'), id: null },
    ...planStore.planList,
  ]
  if (route?.query?.status) {
    const status = statusName(
      route?.query?.status as string
    )
    filter.value.status = status || statusList[0]
  }

  if (route?.query?.planId) {
    const plan = planName(route?.query?.planId as string)
    filter.value.plan = plan || t('pages.user_list.all')
  }
  await getFacilityList()
})

const getFacilityList = async () => {
  isLoading.value = true
  await facilityStore.getFacilityList({
    keyword: filter.value.keyword,
    status: statusId.value,
    plan_id: planId.value,
    order_by: filter.value.order_by,
    order_type: filter.value.order_type,
    page: filter.value.page,
  })
  isLoading.value = false
}

const onPageChange = (value: number) => {
  filter.value.page = value
  getFacilityList()
}

const onFilter = () => {
  filter.value.page = 1
  getFacilityList()
}

const onOrder = (value: string) => {
  filter.value.orderName = value
  const order = facilityOrderList.find(
    (item) => item.name === filter.value.orderName
  )
  if (order) {
    filter.value.order_by = order.order_by
    filter.value.order_type = order.order_type
    getFacilityList()
  }
}

const statusName = (statusId: string) => {
  const status = facilityStatusList.find(
    (e) => e.value === Number(statusId)
  )
  if (!status) return null
  return status?.name
}

const planName = (planId: string) => {
  // const status = facilityStatusList.find(
  //   (e) => e.value === Number(statusId)
  // )
  const plan = planStore.planList.find(
    (item) => item.id === Number(planId)
  )
  if (!plan) return null
  return plan?.name
}
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.facility.title')"
      >
        <div
          class="flex mobile:gap-8 gap-2 desktop:max-w-584px <mobile:flex-col"
        >
          <Dropdown
            v-model="filter.status"
            :label="$t('pages.facility.status.label')"
            :text-button="$t('pages.facility.empty_select')"
            :items="statusList"
            class="flex-1"
          />
          <Dropdown
            v-model="filter.plan"
            :label="$t('pages.facility.plan')"
            :text-button="$t('pages.facility.empty_select')"
            :items="planList"
            class="flex-1"
          />
        </div>
        <div
          class="flex mt-4 mobile:gap-8 gap-2 <mobile:flex-col"
        >
          <FormTextInput
            v-model="filter.keyword"
            class="flex-1 desktop:max-w-584px"
            type-input="search"
            :placeholder="
              $t('pages.facility.placeholder_search')
            "
          />
          <Button
            :theme="RoleEnum.ADMINISTRANTOR"
            type="primary"
            class="mobile:w-37 w-30 text-xl desktop:w-276px <mobile:w-full"
            @click="onFilter"
          >
            {{ $t('pages.facility.search') }}
          </Button>
        </div>
        <div
          class="flex mt-18px mb-45px gap-8px flex-wrap desktop:gap-24px desktop:mb-42px"
        >
          <Button
            v-for="(item, index) in sortList"
            :key="index"
            :theme="RoleEnum.ADMINISTRANTOR"
            :type="
              item === filter.orderName
                ? 'primary'
                : 'outline'
            "
            class="rounded-xl w-max h-30px px-4 text-14px button-order"
            @click="onOrder(item)"
            >{{ $t('pages.facility.' + item) }}</Button
          >
        </div>
        <HeaderLists
          :number-subject="facilityStore.total || 0"
          :total-subject="
            facilityStore.facilityList.length || 0
          "
          class="header-list"
        />
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-202px"
        />
        <template
          v-else-if="facilityStore.facilityList.length > 0"
        >
          <div
            class="grid grid-cols-1 desktop:grid-cols-2 gap-29px"
          >
            <FacilityCard
              v-for="(
                item, index
              ) in facilityStore.facilityList"
              :key="index"
              :facility="item"
            />
          </div>
          <Pagination
            v-if="facilityStore.total > 10"
            :current-page="filter.page"
            :total-items="facilityStore.total"
            :per-page="10"
            class="mt-55px"
            @page-changed="onPageChange"
          />
        </template>
        <div v-else class="text-center m-100px">
          {{ $t('others.no_data') }}
        </div>
        <ModalMessage
          :id="ModalNameEnum.ALERT_MANY_REQUEST"
          :theme="RoleEnum.ADMINISTRANTOR"
          :message="$t('others.many_request_title')"
          :sub-message="$t('others.many_request_message')"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.button-order {
  &:nth-child(1) {
    padding-right: 3px;
  }

  &:nth-child(2) {
    padding-right: 0px;
  }

  &:nth-child(3) {
    padding-right: 12px;
  }
}

.header-list {
  margin-bottom: 19px;

  @media screen and (min-width: $screen-desktop) {
    margin-bottom: 24px;
  }
}

:deep(.page-section__title) {
  margin-bottom: 40px;
  margin-top: 20px;
}
</style>
