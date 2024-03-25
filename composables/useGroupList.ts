import { MenuItemBase } from '@/interfaces/menu'
import { useGroup } from '@/stores/group'
import { useUser } from '@/stores/user'
import { useTrainer } from '@/stores/trainer'
import { GroupParams } from '@/interfaces/group'
import { RoleEnum } from '@/constants/role'

export const useGroupList = () => {
  const groupStore = useGroup()
  const trainerStore = useTrainer()
  const userStore = useUser()
  const router = useRouter()
  const route = useRoute()
  const { t } = useLang()
  const { getFullName } = useHelper()

  const statusList = [
    t('pages.group_list.all'),
    t('pages.group_list.setting'),
    t('pages.group_list.not_set'),
  ]

  const sortList = [
    'newest_first',
    'oldest_first',
    'syllabary_order',
  ]

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.group_list',
      route: { name: '' },
    },
  ]

  const isLoadingData = ref(false)
  const currentPage = ref(1)
  const filter = ref({
    status: route.query?.status
      ? t('pages.group_list.not_set')
      : t('pages.group_list.all'),
    trainer: t('pages.group_list.all'),
    groupName: '',
    sortBy: 'newest_first',
  })
  const trainersSuperAdmin = ref([] as any[])
  const pageTrainerSuperAdmin = ref(0)
  const isGetDataTrainer = ref(false)

  const groups = computed(() => groupStore.groups)
  const groupsData = computed(() => groups.value?.groupList)
  const meta = computed(() => groups.value?.meta)
  const trainers = computed(() => {
    if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
      return trainersSuperAdmin.value
    } else {
      return trainerStore.trainers
    }
  })

  const trainerList = computed(() => {
    if (trainers.value?.length) {
      const list = trainers.value?.map((item: any) => ({
        label: getFullName(item.last_name, item.first_name),
        value: getFullName(item.last_name, item.first_name),
        checked: userStore.userData?.id === item.id!,
      }))
      return [
        {
          label: t('pages.group_list.all'),
          value: t('pages.group_list.all'),
          checked: false,
        },
        ...list,
      ]
    } else {
      return [t('pages.group_list.no_data')]
    }
  })

  const getTrainerSuperAdmin = async () => {
    try {
      if (isGetDataTrainer.value) {
        return
      }
      isGetDataTrainer.value = true
      pageTrainerSuperAdmin.value =
        pageTrainerSuperAdmin.value + 1
      const res =
        await trainerStore.getTrainerForSuperAdmin({
          page: pageTrainerSuperAdmin.value,
        })
      if (
        res &&
        res.data &&
        res.data.data &&
        res.data.data.length
      ) {
        if (pageTrainerSuperAdmin.value === 1) {
          trainersSuperAdmin.value = res.data.data
        } else {
          trainersSuperAdmin.value = [
            ...trainersSuperAdmin.value,
            ...res.data.data,
          ]
        }
        if (res.data.data.length === 10) {
          isGetDataTrainer.value = false
        }
      }
    } catch (e) {}
  }

  const getFilter = async (resetPage = true) => {
    if (resetPage) {
      currentPage.value = 1
    }
    isLoadingData.value = true
    const trainer =
      trainers &&
      trainers.value?.find(
        (item: any) =>
          getFullName(item.last_name, item.first_name) ===
          filter.value.trainer
      )
    const trainerId = trainer ? trainer.id : null
    let status: number[] | string = ''
    switch (filter.value.status) {
      case t('pages.group_list.setting'):
        status = [1]
        break
      case t('pages.group_list.not_set'):
        status = [2]
        break
      default:
        status = ''
    }
    let orderBy = 'created_at'
    let orderType = 'DESC'
    switch (filter.value.sortBy) {
      case 'oldest_first':
        orderBy = 'created_at'
        orderType = 'ASC'
        break
      case 'syllabary_order':
        orderBy = 'name'
        orderType = 'ASC'
        break
      default:
        orderBy = 'created_at'
        orderType = 'DESC'
    }

    await getListGroup({
      keyword: filter.value.groupName,
      status,
      trainer_id: trainerId?.toString() || '',
      order_by: orderBy,
      order_type: orderType,
      page: currentPage.value,
    })
    isLoadingData.value = false
  }

  const sort = (item: string) => {
    filter.value.sortBy = item
    getFilter()
  }

  const handleViewDetailGroup = (id: number) => {
    const role = userStore.roleName
    router.push(`/app/${role}/group/${id}`)
  }

  const getListGroup = async (params: GroupParams) => {
    if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
      await groupStore.getListForSuperAdmin(params)
    } else {
      await groupStore.getList(params)
    }
  }

  const getListTrainers = async () => {
    await trainerStore.getListTrainerOfFacility(
      userStore.userData?.facility_id as number
    )
  }

  onMounted(async () => {
    try {
      isLoadingData.value = true
      let trainerId = ''
      if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
        await getTrainerSuperAdmin()
      } else {
        await getListTrainers()
      }
      if (userStore.roleName === RoleEnum.TRAINER) {
        filter.value.trainer = getFullName(
          userStore.userData?.last_name,
          userStore.userData?.first_name
        )
        trainerId = userStore.userData?.id
          ? userStore.userData.id.toString()
          : ''
      }
      await getListGroup({
        keyword: '',
        status: route.query?.status
          ? [Number(route.query?.status)]
          : '',
        trainer_id: trainerId,
        order_by: 'created_at',
        order_type: 'DESC',
        page: 1,
      })
      isLoadingData.value = false
    } catch (e) {
      isLoadingData.value = false
    }
  })

  watch(currentPage, () => {
    getFilter(false)
  })

  return {
    statusList,
    trainerList,
    sortList,
    listBreadcrumbs,
    currentPage,
    filter,
    groupsData,
    meta,
    isLoadingData,
    getFilter,
    sort,
    handleViewDetailGroup,
    getTrainerSuperAdmin,
  }
}
