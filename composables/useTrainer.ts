/* eslint-disable camelcase */
import { MenuItemBase } from '@/interfaces/menu'
import { useTrainer } from '@/stores/trainer'
import {
  OPTION_SORT_FILTER,
  SORT_FILTER,
  VALUE_SORT_FILTER,
} from '@/constants/filter'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { useFacility } from '@/stores/facility'

export const useTrainerList = () => {
  const { t } = useLang()

  const currentPage = ref(1)

  const trainerStore = useTrainer()
  const userStore = useUser()
  const facilityStore = useFacility()
  const route = useRoute()

  const statusList = [
    {
      label: t('pages.group_list.all'),
      value: '',
    },
    {
      label: t('pages.group_list.manager'),
      value: 1,
    },
    {
      label: t('pages.group_list.not_manager'),
      value: '0',
    },
  ]

  const sortList = OPTION_SORT_FILTER
  const inputRef = ref('')
  const isLoadingData = ref(true)

  const filter = reactive({
    facility_id: 0,
    sortBy: SORT_FILTER.NEWEST_FIRST,
    keyword: '',
    status: route.query?.status_group_user
      ? Number(route.query?.status_group_user)
      : '',
  })

  const filterSort = computed(() => filter.sortBy)

  const facilityFilter = computed(() => {
    const groups = facilityStore.facilityList.map((el) => ({
      label: el.name,
      value: el.id as number,
    }))
    return [
      ...[
        {
          label: t('pages.shinseido.filter.all'),
          value: 0,
        },
      ],
      ...(groups || []),
    ]
  })

  watch(currentPage, async () => {
    await getListTrainer()
  })

  watch(filterSort, async () => {
    await getListTrainer()
  })

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.trainer_list',
      route: { name: '' },
    },
  ]

  const getInput = async () => {
    currentPage.value = 1
    filter.keyword = inputRef.value
    await getListTrainer()
  }

  const sort = (item: string) => {
    filter.sortBy = item
  }

  const getListGroupFilter = async () => {
    if (RoleEnum.ADMIN === userStore.roleName) return
    await facilityStore.getFacilityList({ limit: '0' })
  }

  const getListTrainer = async () => {
    isLoadingData.value = true
    const { sortBy, facility_id, ...rest } = filter
    const params = {
      ...rest,
      ...VALUE_SORT_FILTER[sortBy],
      ...{ page: currentPage.value },
      ...(RoleEnum.ADMINISTRANTOR === userStore.roleName
        ? { facility_id }
        : {}),
    }
    if (
      RoleEnum.ADMIN === userStore.roleName &&
      userStore.userData?.facility_id
    ) {
      await trainerStore.getListTrainerForAdmin(
        userStore.userData?.facility_id,
        params
      )
    } else {
      await trainerStore.getListTrainer(params)
    }
    isLoadingData.value = false
  }

  onMounted(async () => {
    await getListGroupFilter()
    await getListTrainer()
  })

  const listTrainer = computed(
    () => trainerStore.listTrainer.data
  )

  const metaTrainer = computed(
    () => trainerStore.listTrainer.meta
  )

  return {
    statusList,
    sortList,
    listBreadcrumbs,
    listTrainer,
    metaTrainer,
    filter,
    facilityFilter,
    currentPage,
    inputRef,
    isLoadingData,
    sort,
    getInput,
  }
}
