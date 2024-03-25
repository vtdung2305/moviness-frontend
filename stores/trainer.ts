import { useUser } from './user'
import {
  IParamsGetListTrainer,
  ITrainer,
  ITrainerCreateData,
  TrainerCreateParams,
  ITrainerDetail,
} from '@/interfaces/trainer'
import { IUser } from '@/interfaces/user'
import { IResWithPagination } from '~~/interfaces/common'
import { IFacilityStatistic } from '@/interfaces/facility'

export const useTrainer = defineStore('trainer', {
  state: (): {
    trainers: IUser[] | null
    isEdit: boolean
    trainerCreateData: ITrainerCreateData | null
    listTrainer: IResWithPagination<ITrainer[]>
    trainersAdministrator: ITrainer[]
    errors: any
    trainerDetail: ITrainerDetail | null
    trainerEditData: TrainerCreateParams | null
    trainerStatistic: IFacilityStatistic | null
  } => ({
    trainerCreateData: null,
    isEdit: false,
    trainers: null,
    listTrainer: {
      data: [],
      meta: {},
    },
    trainersAdministrator: [],
    errors: null,
    trainerDetail: null,
    trainerEditData: null,
    trainerStatistic: null,
  }),
  actions: {
    updateCreateTrainer(trainer: any) {
      this.trainerCreateData = trainer
    },
    setErrors(errors: any) {
      this.errors = errors
    },
    setEdit(isEdit: boolean) {
      this.isEdit = isEdit
    },
    resetCreateTrainer() {
      this.trainerCreateData = null
      this.errors = null
    },
    async getListTrainerOfFacility(facilityId: number) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.trainer.getAllTrainerByFacilityId(
            facilityId,
            {
              limit: 0,
              status: 1,
            }
          )
        if (res && res.data) {
          this.trainers = res.data
        }
      } catch (error) {}
    },

    async getAllTrainerByFacilityId(facilityId: number) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.trainer.getAllTrainerByFacilityId(
            facilityId,
            {
              limit: 0,
              status: 1,
            }
          )
        if (res && res.data) {
          this.trainers = res.data
        }
      } catch (error) {
        throw { message: 'error' }
      }
    },

    async getTrainerForSuperAdmin(
      params: IParamsGetListTrainer
    ) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.trainer.getTrainerForSuperAdmin(params)
        if (res && res.data) {
          if (params.limit !== '0') {
            this.trainers = res.data.data
          } else {
            this.trainers = res.data
          }
          return res
        }
      } catch (error) {
        throw { message: 'error' }
      }
    },

    async groupsForAdmin(id: string, page: number) {
      const { $api } = useNuxtApp()
      return await $api.trainer.groupsForAdmin(id, page)
    },
    async groupsForSuperAdmin(id: string, page: number) {
      const { $api } = useNuxtApp()
      return await $api.trainer.groupsForSuperAdmin(
        id,
        page
      )
    },
    async create(params: TrainerCreateParams) {
      const { $api } = useNuxtApp()
      return await $api.trainer.create(params)
    },
    async getListTrainer(
      params: IParamsGetListTrainer | any
    ) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.trainer.getListTrainer(
          params
        )
        if (res && res.data) {
          this.listTrainer = res.data
        }
      } catch (error) {}
    },
    async getListTrainerForAdmin(
      id: string | number,
      params: IParamsGetListTrainer | any
    ) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.trainer.getAllTrainerByFacilityId(
            id,
            params
          )
        if (res && res.data) {
          this.listTrainer = res.data
        }
      } catch (error) {}
    },

    async getTrainerDetail(id: string | number) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.trainer.getTrainerDetail(id)
        if (res && res.data) {
          this.trainerDetail = res.data
        }
      } catch (error) {}
    },

    async getUserDetail(id: string | number) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.trainer.getUserDetail(id)
        if (res && res.data) {
          this.trainerDetail = res.data
        }
      } catch (error) {}
    },

    async getStatisticByTrainer(id: string | number) {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.trainer.getStatisticByTrainer(id)
        if (res && res.data) {
          this.trainerStatistic = res.data
        }
      } catch (error) {}
    },
  },
})
