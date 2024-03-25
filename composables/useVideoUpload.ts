import {
  required,
  helpers,
  url,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { useVideo } from '@/stores/video'
import { useCommon } from '@/stores'
import { MenuItemBase } from '@/interfaces/menu'
import { IVideoEdit } from '@/interfaces/video'
import { ModalNameEnum } from '@/constants/modal'
import { IParamsUploadVideo } from '@/interfaces/video'
import { sizeUploadVideo } from '@/constants/video'

export const useVideoUpload = () => {
  const { t } = useLang()
  const videoStore = useVideo()
  const { $showModal } = useNuxtApp()
  const commonStore = useCommon()
  const { uploadFile } = useUpload()

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.video_upload',
      route: { name: '' },
    },
  ]

  const listBreadcrumbsConfirm: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.video_upload',
      route: { name: '' },
      action: () => {
        isConfirm.value = false
      },
    },
    {
      text: 'components.menu.video_confirm',
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
    ],
  })

  const formInput = reactive<IVideoEdit>({
    name: '',
    isFromFile: 1,
    isFromYoutube: 0,
    urlYoutube: '',
  })

  const isEditCheckPoint = ref(false)
  const contentCheckPointEdit = ref('')
  const buttonUploadFile = ref<any>(null)
  const linkYoutube = ref('')
  const currentTime = ref(0)
  const playerFile = ref<any>(null)
  const playerYoutube = ref<any>(null)
  const isConfirm = ref<boolean>(false)

  const rules = computed(() => {
    return {
      name: {
        required: helpers.withMessage(
          t('common.filed_no_required', {
            field: t('pages.shinseido.video_upload.name'),
          }),
          required
        ),
      },
      urlYoutube: {
        required: helpers.withMessage(
          t('common.filed_no_required', {
            field: t(
              'pages.shinseido.video_upload.from_youtube'
            ),
          }),
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
          t('common.filed_no_required', {
            field: t(
              'pages.shinseido.video_upload.sub_task'
            ),
          }),
          required
        ),
      },
      maxSize: {
        maxSize: helpers.withParams(
          {
            message: t(
              'pages.shinseido.video_upload.error_maxsize'
            ),
          },
          () => {
            if (!formInput.isFromFile) return true
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
      urlYoutube: v$.value.urlYoutube.$errors,
      urlFile: v$.value.urlFile.$errors,
      maxSize: v$.value.maxSize.$errors,
      fileThumbnails: v$.value.fileThumbnails.$errors,
    }
  })

  const timeCheckPoin = computed(
    () => videoStore.timeCheckPoint
  )

  watch(timeCheckPoin, (newValue) => {
    const duration = formInput.isFromYoutube
      ? playerYoutube.value.player.duration
      : playerFile.value.player.duration
    if (newValue) {
      if (formInput.isFromYoutube) {
        playerYoutube.value.player.play()
      } else {
        playerFile.value.player.play()
      }
      const timeCheckPoin =
        Number(newValue) > Number(duration) ? 0 : newValue
      if (formInput.isFromYoutube) {
        playerYoutube.value.player.currentTime =
          timeCheckPoin
      } else {
        playerFile.value.player.currentTime = timeCheckPoin
      }
      videoStore.setTimeCheckPoint(0)
      document
        .getElementsByClassName('plyr__poster')[0]
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    }
  })

  const v$ = useValidate(rules, formInput as any)

  const showModal = () => {
    $showModal(ModalNameEnum.UPLOAD_VIDEO)
    commonStore.setStatusModal(true)
  }

  const changeFromYoutube = () => {
    videoStore.resetCheckPoints()
    if (formInput.isFromYoutube === 1) {
      formInput.isFromFile = 0
      formInput.urlFile = ''
      formInput.file = null
    }
  }

  const changeFromFile = () => {
    videoStore.resetCheckPoints()
    if (formInput.isFromFile === 1) {
      formInput.isFromYoutube = 0
      formInput.urlYoutube = ''
      linkYoutube.value = ''
    }
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
      const { name, isFromYoutube, desciption } = formInput
      const checkPoints = videoStore.checkPoints.map(
        (el) => ({
          id: '',
          checkpoint_time: el.checkpoint_time,
          content: el.content,
        })
      )
      const params: IParamsUploadVideo = {
        name,
        type_video: isFromYoutube ? '2' : '1',
        url: '',
        content: desciption as string,
        time_length: Math.trunc(
          isFromYoutube
            ? playerYoutube.value.player.duration
            : playerFile.value.player.duration
        ),
        check_points: checkPoints,
        thumbnail: '',
      }
      videoStore.setDataUpload(params)
      isConfirm.value = true
    } else {
      document
        .getElementsByClassName('error-text')[0]
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    }
  }

  const actionCloseConfirm = () => {
    isConfirm.value = false
  }

  const uploadVideoConfirm = async () => {
    try {
      const {
        isFromYoutube,
        isFromFile,
        fileThumbnails,
        urlYoutube,
      } = formInput
      let urlUploadFile = ''
      let urlUploadImage = ''
      if (isFromFile && fileThumbnails) {
        await Promise.all([
          uploadFile(formInput.file),
          uploadFile(fileThumbnails),
        ]).then((res: any) => {
          if (res[0] !== 'ERROR')
            urlUploadFile = `${res[0]}`
          if (res[1] !== 'ERROR')
            urlUploadImage = `${res[1]}`
        })
      }
      if (isFromYoutube && fileThumbnails) {
        const urlImage = await uploadFile(fileThumbnails)
        if (urlImage !== 'ERROR') urlUploadImage = urlImage
      }
      await videoStore.uploadVideo({
        ...videoStore.dataUpload!,
        url: isFromYoutube
          ? (urlYoutube as string)
          : urlUploadFile,
        thumbnail: urlUploadImage,
      })
    } catch (error) {}
  }

  return {
    listBreadcrumbs,
    listBreadcrumbsConfirm,
    options,
    formInput,
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
    isConfirm,
    actionCloseConfirm,
    uploadVideoConfirm,
  }
}
