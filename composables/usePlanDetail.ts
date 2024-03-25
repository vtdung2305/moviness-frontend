import { MenuItemBase } from '@/interfaces/menu'
import { usePlan } from '@/stores/plan'
import { LIMIT_ALL } from '@/constants/common'

export const usePlanDetail = () => {
  const route = useRoute()
  const planStore = usePlan()

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.plan_list',
      route: { name: 'app-shinseido-plan' },
    },

    {
      text: 'components.menu.plan_detail',
      route: { name: '' },
    },
  ]

  const isLoading = ref<Boolean>(true)

  const plansData = computed(() => planStore?.planDetail)

  const videoList = computed(
    () => planStore?.planDetail?.videos
  )

  const getPlanDetail = async () => {
    // isLoading.value = true
    const id = route.params.id
    await planStore.getPlanDetail(id as string)
    // setTimeout(() => {
    // isLoading.value = false
    // }, 2000)
  }

  const getVideoListByPlan = async (): Promise<void> => {
    // isLoading.value = true
    const id = route.params.id
    const params = {
      limit: LIMIT_ALL,
    }
    await planStore.getVideoByPlan(
      id as string,
      params as any
    )
    // setTimeout(() => {
    // isLoading.value = false
  }

  onMounted(async () => {
    isLoading.value = true
    await getPlanDetail()
    // await getVideoListByPlan()
    isLoading.value = false
  })

  return {
    listBreadcrumbs,
    plansData,
    videoList,
    isLoading,
  }
}
