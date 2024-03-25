import { MenuItemBase } from '@/interfaces/menu'
import { usePlan } from '@/stores/plan'
import { PlanStatus } from '@/constants/plan'
import { useFacility } from '@/stores/facility'

export const usePlanList = () => {
  const planStore = usePlan()
  const facilityStore = useFacility()

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.plan_list',
      route: { name: '' },
    },
  ]

  const isLoading = ref<Boolean>(true)

  const { themeKanrisha } = useHelper()

  const plansData = computed(() => {
    if (themeKanrisha.value) {
      return planStore?.planList.filter(
        (e) => e.status === PlanStatus.PUBLIC
      )
    }
    return planStore?.planList
  })

  const planContractId = computed(
    () => facilityStore?.facilityDetail?.plan?.id
  )

  const getPlanList = async () => {
    await planStore.getPlanList()
  }

  return {
    listBreadcrumbs,
    plansData,
    isLoading,
    planContractId,
    getPlanList,
  }
}
