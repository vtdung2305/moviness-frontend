import {
  IFacilityFilter,
  IFacilityState,
  IFacilityMemberParams,
  IFacilityHistoriesParams,
} from '@/interfaces/facility'
import { ModalNameEnum } from '@/constants/modal'

export const useFacility = defineStore('facility', {
  state: (): IFacilityState => ({
    facilityList: [],
    total: 0,
    facilityFormSignup: null,
    facilityDetail: null,
    facilityStatistic: null,
    facilityStatisticMembers: [],
    facilityEditData: null,
    facilityPlanHistories: [],
  }),

  actions: {
    async getFacilityList(filter: IFacilityFilter) {
      const { $api, $showModal } = useNuxtApp()
      try {
        const res = await $api.facility.getFacilityList(
          filter
        )
        if (res && res.data) {
          if (filter.limit !== '0') {
            this.facilityList = res.data.data
            this.total = res.data.meta.total
          } else {
            this.facilityList = res.data
          }
        }
      } catch (error) {
        this.facilityList = []
        this.total = 0
        if ((error as any).response.status === 429) {
          $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
        }
      }
    },
    async checkPermission() {
      try {
        const { $api } = useNuxtApp()
        return await $api.facility.checkPermission()
      } catch (error) {}
    },

    async getFacilityDetail(id: string | number) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.facility.getFacilityDetail(
          id
        )
        if (res && res.data) {
          this.facilityDetail = res.data
        }
      } catch (error) {}
    },

    async getFacilityStatistic(facilityId: string) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.facility.getFacilityStatistic(
            facilityId
          )
        if (res && res.data) {
          this.facilityStatistic = res.data
        }
      } catch (error) {}
    },

    async getFacilityStatisticMembers(
      facilityId: string,
      params: IFacilityMemberParams
    ) {
      try {
        const { $api } = useNuxtApp()

        const res =
          await $api.facility.getFacilityStatisticMembers(
            facilityId,
            params
          )
        if (res && res.data) {
          this.facilityStatisticMembers = res.data
        }
      } catch (error) {}
    },

    async getPlanHistoriesByFacility(
      facilityId: string | number,
      params: IFacilityHistoriesParams
    ) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.facility.getPlanHistoriesByFacility(
            facilityId,
            params
          )
        if (res && res.data) {
          this.facilityPlanHistories = res.data
        }
      } catch (error) {}
    },
  },
  getters: {},
})
