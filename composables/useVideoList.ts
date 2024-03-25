import { MenuItemBase } from '@/interfaces/menu'
import { useVideo } from '@/stores/video'
import { videoOrderList } from '@/constants/video'

export const useVideoList = () => {
  const videoStore = useVideo()
  const sortList = videoOrderList.map((item) => item.name)

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.video_list',
      route: { name: '' },
    },
  ]

  const isLoading = ref<Boolean>(true)
  const filter = ref({
    keyword: '',
    orderName: videoOrderList[0].name,
    order_by: videoOrderList[0].order_by,
    order_type: videoOrderList[0].order_type,
    page: 1,
  })

  const videos = computed(() => videoStore.videos)
  const videosData = computed(() => videos.value?.videoList)
  const meta = computed(() => videos.value?.meta)

  const getVideoList = async () => {
    isLoading.value = true
    await videoStore.getVideos({
      keyword: filter.value.keyword,
      order_by: filter.value.order_by,
      order_type: filter.value.order_type,
      page: filter.value.page,
    })
    // setTimeout(async () => {
    isLoading.value = false
    // }, 1000)
  }

  const onPageChange = (value: number) => {
    filter.value.page = value
    getVideoList()
  }

  const onFilter = () => {
    getVideoList()
  }

  const onOrder = (value: string) => {
    filter.value.orderName = value
    const order = videoOrderList.find(
      (item) => item.name === filter.value.orderName
    )
    if (order) {
      filter.value.order_by = order.order_by
      filter.value.order_type = order.order_type
      getVideoList()
    }
  }

  onMounted(() => {
    getVideoList()
  })

  return {
    sortList,
    listBreadcrumbs,
    filter,
    videosData,
    meta,
    isLoading,
    onPageChange,
    onFilter,
    onOrder,
  }
}
