import { useUser } from './user'
import {
  IResWithPagination,
  IParamsPagination,
} from '@/interfaces/common'
import {
  IMemberState,
  IMemberRegister,
  IMemberFilter,
} from '@/interfaces/member'
import {
  IEvaluationDate,
  IEvaluationDateFromTo,
  IParamsEvaluation,
  IMemberEvaluationHistories,
} from '@/interfaces/evaluation'
import { ModalNameEnum } from '@/constants/modal'

export const useMember = defineStore('member', {
  state: (): IMemberState => ({
    memberRegister: null,
    memberEdit: null,
    listMember: [],
    total: 0,
    page: 1,
    memberListVideo: [],
    memberInfo: null,
    meta: null,
    memberDetail: null,
    evaluationHistories: {
      data: [],
      meta: {},
    },
    lastEvaluationHistories: null,
    evaluationByDate: null,
    listMemberAvailable: [],
    memberEditInfo: null,
    urlExportCsv: null,
    listAllVideoByMember: [],
    errorCheckPoint: null,
  }),

  actions: {
    async getListMemberByFacility(
      filter: IMemberFilter | null
    ) {
      const { $api, $showModal } = useNuxtApp()
      try {
        const userStore = useUser()
        const res = await $api.member.getMembersByFacility(
          userStore.userData?.facility_id,
          filter
        )
        if (res && res.data && res.data.data) {
          this.listMember = res.data.data
          this.total = res.data.meta.total
        }
      } catch (error) {
        this.listMember = []
        this.total = 0
        if ((error as any).response.status === 429) {
          $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
        }
      }
    },

    async exportMembersByFacility(
      filter: IMemberFilter | null
    ) {
      const { $api, $showModal } = useNuxtApp()
      try {
        const userStore = useUser()
        const res =
          await $api.member.exportMembersByFacility(
            userStore.userData?.facility_id,
            filter
          )
        if (res && res.data && res.data.url) {
          this.urlExportCsv = res.data.url
        }
      } catch (error) {
        this.listMember = []
        this.total = 0
        if ((error as any).response.status === 429) {
          $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
        }
      }
    },

    async getMembersForSuperAdmin(
      filter: IMemberFilter | null
    ) {
      const { $api, $showModal } = useNuxtApp()
      try {
        const res =
          await $api.member.getMembersForSuperAdmin(filter)
        if (res && res.data && res.data.data) {
          this.listMember = res.data.data
          this.total = res.data.meta.total
        }
      } catch (error) {
        this.listMember = []
        this.total = 0
        if ((error as any).response.status === 429) {
          $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
        }
      }
    },

    async getMembersListVideo(
      id: string,
      params: IParamsPagination
    ) {
      try {
        const { $api } = useNuxtApp()
        this.memberListVideo = []
        this.meta = null
        this.memberInfo = null
        const res = await $api.member.getMembersListVideo(
          id as string,
          params as IParamsPagination
        )
        if (res && res.data && res.data.data) {
          this.memberListVideo = res.data.data
          this.meta = res.data.meta
          this.memberInfo = res.includes.member
          return res
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getAllVideosByMember(
      id: string,
      params: IParamsPagination
    ) {
      try {
        const { $api } = useNuxtApp()
        this.listAllVideoByMember = []
        // this.memberInfo = null
        const res = await $api.member.getMembersListVideo(
          id as string,
          params as IParamsPagination
        )
        // console.log(res)

        if (res && res.data) {
          this.listAllVideoByMember = res.data
          this.memberInfo = res.includes.member
          return res
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getMembersDetail(id: string) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.member.getMembersDetail(id)
        if (res && res.data) {
          this.memberDetail = res.data
          return res
        }
      } catch (error: any) {
        showError({
          statusCode: error?.response?.status,
          statusMessage: error?.response?.statusText,
        })
      }
    },

    async getEvaluationHistoriesByVideo(
      id: string,
      videoId: string,
      params: IEvaluationDateFromTo
    ) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.member.getEvaluationHistoriesByVideo(
            id,
            videoId,
            params
          )
        this.evaluationHistories = {
          data: [],
          meta: {},
        }
        if (res && res.data) {
          this.evaluationHistories = res.data
          return res
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getLastEvaluationHistoriesByVideo(
      id: string,
      videoId: string
    ) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.member.getLastEvaluationHistoriesByVideo(
            id,
            videoId
          )
        this.lastEvaluationHistories = null
        if (res && res.data) {
          this.lastEvaluationHistories = res.data
          return res
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getEvaluationByDate(
      id: string,
      videoId: string,
      params: IEvaluationDate
    ) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.member.getEvaluationByDate(
          id,
          videoId,
          params
        )
        this.evaluationByDate = null
        if (res && res.data) {
          this.evaluationByDate = res.data
          return res
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getListAvailable() {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.member.getListAvailable()
        if (res && res.data) {
          this.listMemberAvailable = res.data
          return res
        }
      } catch (error) {
        console.log(error)
      }
    },

    setErrorCheckPoint(errorCheckPoint: any) {
      this.errorCheckPoint = errorCheckPoint
    },
  },
  getters: {},
})
