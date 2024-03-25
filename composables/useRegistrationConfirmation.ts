import { MenuItemBase } from '@/interfaces/menu'
import { useGroup } from '@/stores/group'
import { useTrainer } from '@/stores/trainer'
import { useUser } from '@/stores/user'
import { useCommon } from '@/stores/index'
import { ModalNameEnum } from '@/constants/modal'
import { levels } from '@/constants/member'
import { ImageDefaultEnum } from '@/constants/image'

export const useRegistrationConfirmation = () => {
  const { t } = useLang()
  const { $showModal } = useNuxtApp()
  const { getFullName, formatDate } = useHelper()
  const router = useRouter()
  const groupStore = useGroup()
  const trainerStore = useTrainer()
  const userStore = useUser()
  const commonStore = useCommon()
  const { uploadFile } = useUpload()

  const groupCreateData = groupStore.groupCreateData

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.group_registration',
      route: { name: '' },
    },
  ]

  const optionsValue = ref(0)
  const users = ref([] as Object[])
  const userEdit = ref()
  const showModal = ref(false)
  const subtitleModalMess = ref('')
  const isSubmit = ref(false)
  const isLoadingData = ref(false)
  const routeSubmit = ref({
    name: `app-${userStore.roleName}-group`,
  })

  const author = computed(() => {
    return userStore.userData
      ? getFullName(
          userStore.userData.last_name,
          userStore.userData.first_name
        )
      : t('others.empty')
  })
  const trainers = computed(() => trainerStore.trainers)
  const trainer = computed(() => {
    return (
      trainers &&
      trainers.value?.find(
        (item: any) =>
          getFullName(item.last_name, item.first_name) ===
          groupCreateData?.trainer
      )
    )
  })
  const previewImage = computed(() => {
    if (groupCreateData?.fileAvatar) {
      return URL.createObjectURL(groupCreateData.fileAvatar)
    }
    return ImageDefaultEnum.IMAGE_GROUP_DEFAULT
  })
  const infors = computed(() => {
    const date = new Date()
    return [
      {
        label: t('pages.group_registration.group_name'),
        value: groupCreateData?.groupName || '',
      },
      {
        label: t('pages.group_registration.group_content'),
        value:
          groupCreateData?.groupContent ||
          t('others.empty'),
      },
      {
        label: t(
          'pages.group_registration_confirmation.author'
        ),
        value: author.value,
      },
      {
        label: t(
          'pages.group_registration_confirmation.created_date'
        ),
        value: formatDate(date),
      },
    ]
  })
  const registerFromFile = computed(() => {
    return optionsValue.value === 1
  })

  const typeBtn = computed(() => {
    return isSubmit.value ? 'secondary' : 'primary'
  })

  const backEdit = (route: Object) => {
    groupStore.setEdit(true)
    router.push(route)
  }

  const changeFile = (file: any) => {
    const r = new FileReader()
    r.onload = function (e) {
      const contents = e.target?.result || ''
      if (contents) {
        const time = new Date().getTime()
        const lines = contents.toString().split('\n')
        for (let i = 0; i < lines.length; i++) {
          const data = lines[i].split(/、|,/)
          users.value.push({
            id: time + i + 1,
            level: data[0] || t('others.no_value'),
            last_name: data[1],
            first_name: data[2],
            last_name_kana: data[3],
            first_name_kana: data[4],
            year: data[5]?.substring(0, 5) || '',
            month: data[5]?.substring(5, 8) || '',
            day: data[5]?.substring(8, 11) || '',
            medical_history: '',
            memo: '',
          })
        }
      }
    }
    r.readAsText(file)
  }

  const hideModal = () => {
    showModal.value = false
    commonStore.setStatusModal(false)
  }

  const deleteUser = (user: any) => {
    users.value = users.value.filter(
      (item) => (item as any).id !== user.id
    )
  }

  const editUser = (user: any) => {
    userEdit.value = user
    showModal.value = true
    commonStore.setStatusModal(true)
  }

  const handleUpdateUser = (user: any) => {
    const index = users.value.findIndex(
      (item) => (item as any).id === user.id
    )
    if (users.value[index]) {
      users.value[index] = user
    }
    showModal.value = false
    commonStore.setStatusModal(false)
  }

  const handleSubmit = async (createByTrainer = false) => {
    try {
      isSubmit.value = true
      isLoadingData.value = true
      let imageUrl = ''
      if (groupCreateData?.fileAvatar) {
        imageUrl = await uploadFile(
          groupCreateData?.fileAvatar
        )
        if (imageUrl === 'ERROR') {
          imageUrl = ''
          subtitleModalMess.value = t(
            'pages.group_registration_confirmation.back_group_list'
          )
          $showModal(ModalNameEnum.MESSAGE_CREATE_GROUP)
          return
        }
      }
      let trainerId = null
      if (createByTrainer) {
        trainerId = userStore.userData?.id || null
      } else {
        trainerId = trainer.value?.id || null
      }
      const userParam = users.value.map((item) => {
        const i = item as any
        const y = i.year.replace(
          t('components.datepicker.year'),
          ''
        )
        const m = i.month.replace(
          t('components.datepicker.month'),
          ''
        )
        const d = i.day.replace(
          t('components.datepicker.day'),
          ''
        )
        const birthday = `${y}-${m < 10 ? '0' + m : m}-${
          d < 10 ? '0' + d : d
        }`
        return {
          level:
            levels
              .find(
                (item) => item.name === i.level.toString()
              )
              ?.value?.toString() || '0',
          last_name: i.last_name.trim(),
          first_name: i.first_name.trim(),
          last_name_kana: i.last_name_kana.trim(),
          first_name_kana: i.first_name_kana.trim(),
          birthday,
          sex: '0',
          medical_history: i.medical_history.trim(),
          memo: i.memo.trim(),
        }
      })
      const params = {
        name: groupCreateData?.groupName || '',
        image: imageUrl,
        content: groupCreateData?.groupContent || '',
        trainer_id: trainerId,
        members: userParam,
      }
      const res = await groupStore.create(params)
      if (res && res.data) {
        subtitleModalMess.value = t(
          'pages.group_registration_confirmation.created_a_group'
        )
      } else {
        subtitleModalMess.value = res.message
      }
      $showModal(ModalNameEnum.MESSAGE_CREATE_GROUP)
      isLoadingData.value = false
    } catch (e: any) {
      subtitleModalMess.value =
        e.response?._data?.message || ''
      $showModal(ModalNameEnum.MESSAGE_CREATE_GROUP)
      routeSubmit.value = {
        name: `app-${userStore.roleName}-group-registration-confirmation`,
      }
      isLoadingData.value = false
    }
    isSubmit.value = false
  }

  return {
    listBreadcrumbs,
    optionsValue,
    users,
    userEdit,
    showModal,
    previewImage,
    infors,
    registerFromFile,
    groupCreateData,
    trainer,
    subtitleModalMess,
    routeSubmit,
    isSubmit,
    typeBtn,
    isLoadingData,
    backEdit,
    changeFile,
    hideModal,
    deleteUser,
    editUser,
    handleSubmit,
    handleUpdateUser,
  }
}
