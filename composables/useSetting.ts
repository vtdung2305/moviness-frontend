import { useUser } from '@/stores/user'
import { useFacility } from '@/stores/facility'
import { IFacilityHistoriesParams } from '@/interfaces/facility'
import { facilityStatusPlan } from '@/constants/facility'
import { FilterListEnum } from '@/constants/common'

export const useSetting = () => {
  const route = useRoute()
  const router = useRouter()
  const tabQuery = Number(route.query?.tab_info) || 1
  const tab = ref(tabQuery)
  const isLoading = ref(false)
  const userStore = useUser()
  const facilityStore = useFacility()

  const filter = ref<IFacilityHistoriesParams>({
    page: FilterListEnum.current_page,
    limit: FilterListEnum.limit_small,
  })

  const planHistories = computed(
    () => facilityStore?.facilityPlanHistories
  )

  const facilityDetail = computed(
    () => facilityStore?.facilityDetail
  )

  const hasPlanNeedUpgrade = computed(
    () =>
      !!facilityStore?.facilityDetail
        ?.plan_purchased_need_upgrade_last
  )

  const facilityStatistic = computed(
    () => facilityStore.facilityStatistic?.statistic
  )

  const handleChangeTab = (tabActive: number) => {
    tab.value = tabActive
    if (route.query?.tab_info) {
      router.push({
        path: `/app/kanrisha/setting`,
        query: { tab_info: tabActive },
      })
    }
  }

  const getFacilityById = async () => {
    const id = userStore.userData?.facility_id
    await facilityStore.getFacilityDetail(id as number)
  }

  const getPlanHistoriesByFacility = async () => {
    const id = userStore.userData?.facility_id
    const params: IFacilityHistoriesParams = {
      page: filter.value.page,
      limit: filter.value.limit,
    }
    await facilityStore.getPlanHistoriesByFacility(
      id as number,
      params as IFacilityHistoriesParams
    )
  }

  const onPageChange = async (value: number) => {
    isLoading.value = true
    filter.value.page = value
    await getPlanHistoriesByFacility()
    isLoading.value = false
  }

  const statusFacility = (status: number) => {
    const statusPlan = facilityStatusPlan.find(
      (e) => e.value === status
    )
    if (!statusPlan) return null
    return statusPlan.name
  }

  return {
    isLoading,
    tab,
    facilityStore,
    facilityDetail,
    planHistories,
    hasPlanNeedUpgrade,
    filter,
    facilityStatistic,
    handleChangeTab,
    getFacilityById,
    getPlanHistoriesByFacility,
    onPageChange,
    statusFacility,
  }
}
