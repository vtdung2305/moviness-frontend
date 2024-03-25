import moment from 'moment'
import { MenuItemBase } from '@/interfaces/menu'
import { useGroup } from '@/stores/group'
import { useUser } from '@/stores/user'
import { useTrainer } from '@/stores/trainer'
import { ModalNameEnum } from '@/constants/modal'
import { RoleEnum } from '@/constants/role'
import { ImageDefaultEnum } from '@/constants/image'

export const useGroupEditConfirmation = () => {
  const userStore = useUser()

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.group_list',
      route: { name: `app-${userStore.roleName}-group` },
    },
    {
      text: 'components.menu.group_detail',
      route: {
        name: `app-${userStore.roleName}-group-id`,
      },
    },
    {
      text: 'components.menu.group_edit',
      route: {
        name: `app-${userStore.roleName}-group-id-edit`,
      },
    },
    {
      text: 'components.menu.group_edit_confirmation_kanrisha',
      route: { name: '' },
    },
  ]

  const usersListItem = ref([])
  const { t } = useLang()
  const isLoadingPage = ref(false)
  const currentPage = ref(1)
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const groupStore = useGroup()
  const { getFullName } = useHelper()
  const trainerStore = useTrainer()
  const route = useRoute()
  const { uploadFile } = useUpload()
  const subtitleModalMess = ref('')
  const routeSubmit = ref({
    name: `app-${userStore.roleName}-group`,
  })
  const config = useRuntimeConfig()
  const { $api, $showModal, $hiddenModal } = useNuxtApp()
  const alert = ref<string>('')
  const isSubmitError = ref<boolean>(false)
  const router = useRouter()
  const groupEditData = groupStore.groupEditData

  const avatarDisplay = computed(() => {
    if (!groupEditData?.fileAvatar)
      return ImageDefaultEnum.IMAGE_GROUP_DEFAULT
    if (typeof groupEditData?.fileAvatar === 'string') {
      return groupEditData?.fileAvatar
    } else {
      return URL.createObjectURL(groupEditData?.fileAvatar)
    }
  })

  const author = computed(() => {
    return userStore.userData
      ? getFullName(
          userStore.userData.last_name,
          userStore.userData.first_name
        )
      : t('others.empty')
  })

  const dateCreate = computed(() => {
    const date = moment(new Date(), 'YYYY/MM/DD')
    const month = date.format('MM')
    const day = date.format('DD')
    const year = date.format('YYYY')
    return t('pages.group_registration_confirmation.date', {
      year,
      month,
      day,
    })
  })

  const dateLast = computed(() => {
    const date = moment(
      groupStore.groupDetail?.updated_at,
      'YYYY/MM/DD'
    )
    const month = date.format('MM')
    const day = date.format('DD')
    const year = date.format('YYYY')

    return t('pages.group_registration_confirmation.date', {
      year,
      month,
      day,
    })
  })

  const trainers = computed(() => trainerStore.trainers)
  const trainer = computed(() => {
    return (
      trainers &&
      trainers.value?.find(
        (item: any) =>
          getFullName(item.last_name, item.first_name) ===
          groupEditData?.trainer
      )
    )
  })

  const previewImageTrainer = computed(() => {
    if (trainer.value?.avatar) {
      return trainer.value?.url_avatar
    }
    return ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
  })

  const isAdmin = computed(() => {
    return userStore.roleName === RoleEnum.ADMIN
  })

  const confirm = async () => {
    $hiddenModal(ModalNameEnum.CONFIRM_EDIT_GROUP)
    let imageUrl = ''

    if (typeof groupEditData?.fileAvatar === 'string') {
      imageUrl = groupEditData?.fileAvatar.replace(
        `${config.public.apiCloud}/`,
        ''
      )
    } else if (groupEditData?.fileAvatar) {
      imageUrl = await uploadFile(groupEditData?.fileAvatar)
      if (imageUrl === 'ERROR') {
        imageUrl = ''
        subtitleModalMess.value = t(
          'pages.group_registration_confirmation.back_group_list'
        )
        $showModal(ModalNameEnum.MESSAGE_EDIT_GROUP)
        return
      }
    }

    const id = route.params.id
    const Arr = groupStore.userList.filter(
      (x) =>
        x.group_id === Number(id) ||
        (x.group_id !== Number(id) && x.is_delete === false)
    )

    const newArr = Arr.map((v) => ({
      id: v.id,
      is_delete: v.is_delete,
    }))

    let trainerId = null
    if (!isAdmin) {
      trainerId = userStore.userData?.id || null
    } else {
      trainerId = trainer.value?.id || null
    }

    const params = {
      name: groupEditData?.groupName || '',
      image: imageUrl,
      content: groupEditData?.groupContent || '',
      trainer_id: trainerId,
      status: groupEditData?.status,
      members: newArr,
    }

    $api.group
      .update(params, id as number | string)
      .then(() => {
        alert.value = t(
          'pages.group_edit.message_confirm_success'
        )
        isSubmitError.value = false
        $showModal(ModalNameEnum.ALERT_EDIT_GROUP)
      })
      .catch((e) => {
        alert.value = 'error'
        isSubmitError.value = true
        $showModal(ModalNameEnum.ALERT_EDIT_GROUP)
      })
  }

  const onCloseAlert = () => {
    const id = route.params.id
    if (isSubmitError.value) {
      router.back()
    } else {
      groupStore.groupEditData = null
      groupStore.setEditGroup(false)
      router.push(`/app/${userStore.roleName}/group/${id}`)
    }
  }

  const paginate = (
    array: any,
    pageSize: any,
    pageNumber: any
  ) => {
    return array.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    )
  }

  onMounted(() => {
    usersListItem.value = paginate(
      toRaw(
        groupStore.userList.filter(
          (x) => x.is_delete === false
        )
      ),
      pageSize.value,
      currentPage.value
    )
  })

  watch(currentPage, () => {
    usersListItem.value = paginate(
      toRaw(
        groupStore.userList.filter(
          (x) => x.is_delete === false
        )
      ),
      pageSize.value,
      currentPage.value
    )
  })

  const infoList = computed(() => {
    const people = t('pages.group_detail.people')
    const male = t('pages.group_detail.male')
    const woman = t('pages.group_detail.woman')
    const noSet = t('pages.group_detail.no_set')

    const total =
      groupStore.userList.filter(
        (x) => x.is_delete === false
      ).length || 0
    const numMale =
      groupStore.userList.filter(
        (x) => x.is_delete === false && x.sex === 1
      ).length || 0
    const numFemale =
      groupStore.userList.filter(
        (x) => x.is_delete === false && x.sex === 2
      ).length || 0
    const numOther =
      groupStore.userList.filter(
        (x) => x.is_delete === false && x.sex === 0
      ).length || 0
    const currentShow = usersListItem.value.length || 0
    return `${currentShow}${people}/${total}${people}（${male}:${numMale}${people} ${woman}:${numFemale}${people} ${noSet}:${numOther}${people}）`
  })

  onBeforeMount(() => {
    const id = route.params.id
    if (!groupStore.isEditGroup) {
      useRouter().replace(
        `/app/${userStore.roleName}/group/${id}/edit`
      )
    }
  })

  return {
    listBreadcrumbs,
    isLoadingPage,
    avatarDisplay,
    groupEditData,
    author,
    dateCreate,
    previewImageTrainer,
    trainer,
    usersListItem,
    groupStore,
    currentPage,
    pageSize,
    pageNumber,
    subtitleModalMess,
    routeSubmit,
    userStore,
    alert,
    dateLast,
    infoList,
    confirm,
    onCloseAlert,
  }
}
