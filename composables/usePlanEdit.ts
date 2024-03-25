import cloneDeep from 'lodash/cloneDeep'
import sortBy from 'lodash/sortBy'
import { MenuItemBase } from '@/interfaces/menu'
import { usePlan } from '@/stores/plan'
import { useVideo } from '@/stores/video'
import { videoOrderList } from '@/constants/video'
import { ModalNameEnum } from '@/constants/modal'
import {
  IParamPlan,
  IParamPlanVideo,
} from '@/interfaces/plan'
import { LIMIT_ALL } from '@/constants/common'

export const usePlanEdit = () => {
  const route = useRoute()
  const planStore = usePlan()
  const videoStore = useVideo()
  const filter = ref({
    keyword: '',
    orderName: videoOrderList[0].name,
    order_by: videoOrderList[0].order_by,
    order_type: videoOrderList[0].order_type,
    page: 1,
  })
  const router = useRouter()
  const { $showModal, $hiddenModal } = useNuxtApp()

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
      route: { name: 'app-shinseido-plan-id' },
    },

    {
      text: 'components.menu.plan_edit',
      route: { name: '' },
    },
  ]

  const isLoading = ref<Boolean>(false)

  const plansData = computed(() => planStore?.planDetail)

  const videoList = computed(
    () => planStore.videoList
    // sortBy(planStore.videoList, (e) => {
    //   return e.order
    // })
  )

  const videoListIds = computed(() => {
    if (!planStore.videoList.length) return []
    return planStore.videoList.map((e) => toRaw(e.id))
  })

  const videosData = computed(() => {
    const videos = videoStore?.videos

    if (Array.isArray(videos) && videos.length) {
      return videos
        .filter((e) => !videoListIds.value.includes(e.id))
        .map((e) => {
          return {
            ...e,
            is_required: false,
            can_edit: true,
          }
        })
    } else {
      return []
    }
  })

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

  const getVideoList = async () => {
    await videoStore.getVideos({
      keyword: filter.value.keyword,
      order_by: filter.value.order_by,
      order_type: filter.value.order_type,
      limit: 0,
    })
  }

  const gotoPlanDetail = () => {
    const id = route.params.id
    router.push(`/app/shinseido/plan/${id}`)
  }

  const createParams = (status: number) => {
    const videoParams: IParamPlanVideo[] =
      planStore.videoList.map((e) => {
        return {
          id: e.id,
          order: e.order,
          is_required: e.is_required,
        }
      })
    const planDetail = cloneDeep(plansData.value)
    if (planDetail) {
      planDetail.status = status
    }
    const params = {
      ...planDetail,
      videos: videoParams,
    }
    return params
  }

  const editPlan = async (status: number) => {
    try {
      const { $api } = useNuxtApp()
      const id = route.params.id
      const params = createParams(status)
      // console.log(params)

      isLoading.value = true
      const res = await $api.plan.editPlan(
        id as string,
        params as IParamPlan
      )
      if (res && res.data) {
        $showModal(ModalNameEnum.ALERT_SUCCESS)
      }
      isLoading.value = false
    } catch (error) {
      console.log(error)
      router.push('/404')
    }
  }

  return {
    listBreadcrumbs,
    plansData,
    videoList,
    videosData,
    isLoading,
    videoListIds,
    getPlanDetail,
    getVideoListByPlan,
    getVideoList,
    gotoPlanDetail,
    editPlan,
  }
}
