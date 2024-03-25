import { useFacility } from '@/stores/facility'
import { IFacilityHistoriesParams } from '@/interfaces/facility'
import { FilterListEnum } from '@/constants/common'
import { CookieKeyEnum } from '@/constants/cookie'
import { ModalNameEnum } from '@/constants/modal'
import { FacilityStatus } from '@/constants/facility'

export const useFacilityDetail = () => {
  const facilityStore = useFacility()
  const route = useRoute()
  const router = useRouter()
  const { $showModal, $hiddenModal } = useNuxtApp()
  const { t } = useLang()

  const isLoading = ref<Boolean>(false)

  const filter = ref<IFacilityHistoriesParams>({
    page: FilterListEnum.current_page,
    limit: FilterListEnum.limit_small,
  })

  const facilityDetail = computed(
    () => facilityStore?.facilityDetail
  )

  const statusFacility = computed(() => {
    if (
      facilityStore?.facilityDetail?.status ===
        FacilityStatus.CREATE ||
      (facilityStore?.facilityDetail?.status ===
        FacilityStatus.REFUSE &&
        facilityStore?.facilityDetail
          ?.is_request_upgrade_plan)
    ) {
      return t('pages.facility_detail.facility_valid')
    } else {
      return t('pages.facility_detail.facility_invalid')
    }
  })

  const facilityValid = computed(
    () =>
      facilityStore?.facilityDetail?.status ===
        FacilityStatus.CREATE ||
      (facilityStore?.facilityDetail?.status ===
        FacilityStatus.REFUSE &&
        facilityStore?.facilityDetail
          ?.is_request_upgrade_plan)
  )

  const getFacilityById = async () => {
    const userData: any = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    const facilityId = JSON.parse(userData).facility_id
    const fullPath = router.currentRoute.value.fullPath

    const id = fullPath.includes('upgrade')
      ? facilityId
      : route.params.id
      ? route.params.id
      : facilityId

    if (id) {
      await facilityStore.getFacilityDetail(id as string)
    }
  }

  const facilityPlanHistories = computed(
    () => facilityStore.facilityPlanHistories
  )

  const getPlanHistoriesByFacility = async () => {
    const id = Number(route?.params?.id)
    const params: IFacilityHistoriesParams = {
      page: filter.value.page,
      limit: filter.value.limit,
    }
    await facilityStore.getPlanHistoriesByFacility(
      id as number,
      params as IFacilityHistoriesParams
    )
  }

  const onPageChange = async (value: number) => {
    isLoading.value = true
    filter.value.page = value
    await getPlanHistoriesByFacility()
    isLoading.value = false
  }

  const inactiveFacility = async () => {
    try {
      const { $api } = useNuxtApp()
      const id = route.params.id
      isLoading.value = true
      const res = await $api.facility.inactiveFacility(
        id as string
      )
      if (res && res.data) {
        await getFacilityById()
        await $showModal(
          ModalNameEnum.ALERT_FACILITY_INACTIVE
        )
      }
      isLoading.value = false
    } catch (error) {
      console.log(error)
      // router.push('/404')
    }

    isLoading.value = false
  }

  return {
    isLoading,
    facilityDetail,
    facilityPlanHistories,
    filter,
    statusFacility,
    facilityValid,
    getFacilityById,
    getPlanHistoriesByFacility,
    onPageChange,
    inactiveFacility,
  }
}
