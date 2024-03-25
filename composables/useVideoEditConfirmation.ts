import { MenuItemBase } from '@/interfaces/menu'
import { useVideo } from '@/stores/video'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { converSencondToMinuteSecond } from '@/helper/time'
import { isVideoFromYoutube } from '@/helper/video'

export const useVideoEditConfirmation = () => {
  const userStore = useUser()
  const videoStore = useVideo()
  const isLoading = ref<Boolean>(false)

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.video_list',
      route: { name: 'app-shinseido-videos' },
    },
    {
      text: 'components.menu.video_detail',
      route: { name: 'app-shinseido-videos-id' },
    },
    {
      text: 'components.menu.video_edit_confirmation',
      route: { name: '' },
    },
  ]

  const options = ref({
    autoplay: false,
    muted: false,
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'captions',
      'settings',
      'pip',
      'airplay',
      'fullscreen',
    ],
  })

  const checkPoints = computed(() => {
    return videoStore.checkPoints.map((el, index) => ({
      ...el,
      index: index + 1,
      checkpoint_time_conver: converSencondToMinuteSecond(
        el.checkpoint_time
      ),
    }))
  })

  const srcURL = computed(() => {
    if (videoStore.videoEdit?.isFromFile === 1) {
      return videoStore.videoEdit?.urlFile
    }
    if (videoStore.videoEdit?.isFromYoutube === 1) {
      return videoStore.videoEdit?.urlYoutube
    }
  })

  const isSrcFromURL = computed(() => {
    if (videoStore.videoEdit?.isFromFile === 1) {
      return isVideoFromYoutube(
        videoStore.videoEdit?.urlFile!
      )
    }
    if (videoStore.videoEdit?.isFromYoutube === 1) {
      return isVideoFromYoutube(
        videoStore.videoEdit?.urlYoutube!
      )
    }
  })

  onBeforeRouteLeave((to) => {
    if (to.name !== `app-shinseido-videos-id-edit`) {
      videoStore.videoEdit = null
      videoStore.checkPoints = []
    }
  })

  return {
    listBreadcrumbs,
    options,
    isLoading,
    userStore,
    checkPoints,
    srcURL,
    isSrcFromURL,
    RoleEnum,
  }
}
