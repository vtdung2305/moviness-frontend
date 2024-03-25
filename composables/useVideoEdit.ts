import { required, helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { useVideo } from '@/stores/video'
import { useCommon } from '@/stores'
import { MenuItemBase } from '@/interfaces/menu'
import { IVideoEdit } from '@/interfaces/video'
import { ModalNameEnum } from '@/constants/modal'
import { sizeUploadVideo } from '@/constants/video'

export const useVideoEdit = () => {
  const videoStore = useVideo()
  const { $showModal } = useNuxtApp()
  const commonStore = useCommon()
  const router = useRouter()
  const { t } = useLang()
  const route = useRoute()
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
      text: 'components.menu.video_edit',
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

  const formInput = reactive<IVideoEdit>({
    file: null,
    name: '',
    isFromFile: 1,
    isFromYoutube: 0,
    urlYoutube: '',
    urlFile: null,
    desciption: '',
  })

  const isEditCheckPoint = ref(false)
  const contentCheckPointEdit = ref('')
  const buttonUploadFile = ref<any>(null)
  const linkYoutube = ref('')
  const currentTime = ref(0)
  const playerFile = ref<any>(null)
  const playerYoutube = ref<any>(null)
  const key = ref(0)

  const rules = computed(() => {
    return {
      name: {
        required: helpers.withMessage(
          t('pages.shinseido.video_upload.error_message'),
          required
        ),
      },
      urlYoutube: {
        required: helpers.withParams(
          {
            message: t(
              'pages.shinseido.video_upload.error_message'
            ),
          },
          (value: string) => {
            if (formInput.isFromYoutube) {
              return helpers.req(value)
            }
            return true
          }
        ),
      },
      urlFile: {
        required: helpers.withParams(
          {
            message: t(
              'pages.shinseido.video_upload.error_message'
            ),
          },
          (value: string) => {
            if (formInput.isFromFile) {
              return helpers.req(value)
            }
            return true
          }
        ),
      },
      desciption: {
        required: helpers.withMessage(
          t('pages.shinseido.video_upload.error_message'),
          required
        ),
      },
      checkpoints: {
        hasCheckPoints: helpers.withParams(
          {
            message: t(
              'pages.shinseido.video_upload.error_message'
            ),
          },
          () => {
            return (
              videoStore.checkPoints &&
              videoStore.checkPoints.length > 0
            )
          }
        ),
      },
      maxSize: {
        maxSize: helpers.withParams(
          {
            message: t(
              'pages.shinseido.video_edit.error_maxsize'
            ),
          },
          () => {
            if (formInput.isFromFile && !formInput.file)
              return true
            if (formInput.isFromYoutube) return true
            if (
              formInput.file.size < sizeUploadVideo &&
              !!formInput.urlFile
            ) {
              return true
            }
            return false
          }
        ),
      },
      fileThumbnails: {
        required: helpers.withMessage(
          t('pages.shinseido.video_upload.error_message'),
          required
        ),
      },
    }
  })

  const errors = computed(() => {
    return {
      name: v$.value.name.$errors,
      desciption: v$.value.desciption.$errors,
      urlYoutube: v$.value.desciption.$errors,
      urlFile: v$.value.urlFile.$errors,
      checkPoints: v$.value.checkpoints.$errors,
      maxSize: v$.value.maxSize.$errors,
      fileThumbnails: v$.value.fileThumbnails.$errors,
    }
  })

  const v$ = useValidate(rules, formInput as any)

  const showModal = () => {
    $showModal(ModalNameEnum.UPLOAD_VIDEO)
    commonStore.setStatusModal(true)
  }

  const changeFromYoutube = () => {
    videoStore.resetCheckPoints()
    formInput.isFromFile = 0
    formInput.isFromYoutube = 1
    formInput.urlYoutube = ''
    formInput.urlFile = ''
    linkYoutube.value = ''
  }

  const changeFromFile = () => {
    videoStore.resetCheckPoints()
    formInput.isFromFile = 1
    formInput.isFromYoutube = 0
    formInput.urlYoutube = ''
    formInput.urlFile = ''
    linkYoutube.value = ''
  }

  const addCheckPoint = () => {
    if (playerFile?.value && formInput.isFromFile) {
      playerFile?.value.player.pause()
      currentTime.value =
        playerFile?.value.player.currentTime | 1
    }
    if (playerYoutube?.value && formInput.isFromYoutube) {
      playerYoutube?.value.player.pause()
      currentTime.value =
        playerYoutube?.value.player.currentTime | 1
    }
    contentCheckPointEdit.value = ''
    isEditCheckPoint.value = false
    showModal()
  }

  const editCheckPoint = (
    time: number,
    content: string
  ) => {
    currentTime.value = time
    contentCheckPointEdit.value = content
    isEditCheckPoint.value = true
    showModal()
  }

  const handleFileChange = async (event: any) => {
    formInput.urlFile = ''
    const file = event.target.files[0]
    await v$.value.maxSize.$validate()
    const reader = new FileReader()
    reader.onload = () => {
      formInput.urlFile = reader.result as string
    }
    videoStore.resetCheckPoints()
    formInput.file = file
    reader.readAsDataURL(file)
  }

  const handleSelectFile = () => {
    if (!formInput.isFromFile) return
    buttonUploadFile.value.value = null
    buttonUploadFile.value.click()
  }

  const clickRemoveFileVideo = () => {
    formInput.urlYoutube = ''
    formInput.urlFile = ''
    formInput.file = ''
    linkYoutube.value = ''
    videoStore.resetCheckPoints()
  }

  const uploadVideo = async () => {
    const validate = await v$.value.$validate()
    if (validate) {
      videoStore.videoEdit = formInput
      router.push('edit-confirmation')
    } else {
      document
        .getElementsByClassName('error-text')[0]
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    }
  }

  // detail videos
  const getValueVideoDetail = async () => {
    isLoading.value = true
    await videoStore.getVideoDetail(
      route.params.id as string
    )
    isLoading.value = false
  }

  onMounted(async () => {
    if (!videoStore.videoEdit) {
      await getValueVideoDetail()

      formInput.urlFile = videoStore?.videoDetail?.url_video
      formInput.desciption =
        videoStore?.videoDetail?.content
      formInput.name = videoStore?.videoDetail?.name!
      formInput.urlThumbnail =
        videoStore?.videoDetail?.thumbnail_url!
      formInput.fileThumbnails =
        videoStore?.videoDetail?.thumbnail!

      videoStore?.videoDetail?.check_points.map((el) =>
        videoStore.addCheckPoint({
          checkpoint_time: el.checkpoint_time,
          content: el.content,
        })
      )

      if (videoStore?.videoDetail?.type_video === 2) {
        formInput.isFromFile = 0
        formInput.isFromYoutube = 1
        linkYoutube.value =
          videoStore?.videoDetail?.url_video!
      } else {
        formInput.isFromFile = 1
        formInput.isFromYoutube = 0
        linkYoutube.value = ''
      }
    } else {
      isLoading.value = true
      setTimeout(() => {
        formInput.name = videoStore.videoEdit?.name!
        formInput.isFromFile =
          videoStore.videoEdit?.isFromFile!
        formInput.file = videoStore.videoEdit?.file
        formInput.urlFile = videoStore.videoEdit?.urlFile
        formInput.isFromYoutube =
          videoStore.videoEdit?.isFromYoutube!
        formInput.urlYoutube =
          videoStore.videoEdit?.urlYoutube
        formInput.desciption =
          videoStore.videoEdit?.desciption
        formInput.urlThumbnail =
          videoStore.videoEdit?.urlThumbnail
        formInput.fileThumbnails =
          videoStore.videoEdit?.fileThumbnails
        linkYoutube.value =
          videoStore.videoEdit?.urlYoutube!
        isLoading.value = false
      }, 500)
    }
  })

  return {
    listBreadcrumbs,
    options,
    formInput,
    key,
    changeFromYoutube,
    addCheckPoint,
    editCheckPoint,
    handleFileChange,
    handleSelectFile,
    clickRemoveFileVideo,
    uploadVideo,
    changeFromFile,
    linkYoutube,
    isEditCheckPoint,
    currentTime,
    contentCheckPointEdit,
    playerYoutube,
    playerFile,
    buttonUploadFile,
    errors,
    isLoading,
  }
}
