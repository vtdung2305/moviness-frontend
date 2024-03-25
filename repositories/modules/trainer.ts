import HttpFactory from '../http-factory'
import {
  IParamsGetListTrainer,
  TrainerCreateParams,
} from '@/interfaces/trainer'
class TrainerModule extends HttpFactory {
  private config = useRuntimeConfig()

  async create(
    params: TrainerCreateParams
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/trainers`,
      params
    )
  }

  async update(
    credentials: TrainerCreateParams,
    id: string | number | null | undefined
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/trainers/${id}`,
      credentials
    )
  }

  async groupsForAdmin(
    id: string,
    page: number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/trainers/${id}/groups?page=${page}`
    )
  }

  async groupsForSuperAdmin(
    id: string,
    page: number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `/administrator${this.config.public.apiVer}/trainers/${id}/groups?page=${page}`
    )
  }

  async getListTrainer(
    params: IParamsGetListTrainer
  ): Promise<Object[] | null | any> {
    const { serialize } = useHelper()
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/trainers?${serialize(
        params
      )}`
    )
  }

  async getAllTrainerByFacilityId(
    id: string | number,
    params?: IParamsGetListTrainer
  ): Promise<Object[] | null | any> {
    const { serialize } = useHelper()
    return await this.call<Object[] | null | any>(
      'GET',
      `${
        this.config.public.apiVer
      }/facilities/${id}/trainers?${serialize(params)}`
    )
  }

  async getTrainerForSuperAdmin(
    params?: IParamsGetListTrainer
  ): Promise<Object[] | null | any> {
    const { serialize } = useHelper()
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/trainers?${serialize(
        params
      )}`
    )
  }

  async getTrainerDetail(
    id: string | number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/trainers/${id}`
    )
  }

  async getUserDetail(
    id: string | number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/users/${id}`
    )
  }

  async updateUser(
    credentials: TrainerCreateParams,
    id: string | number | null | undefined
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/users/${id}`,
      credentials
    )
  }

  async unblock(
    id: string | number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/trainers/${id}/unblock`
    )
  }

  async updateTrainerStatus(
    id: string | number,
    status: string | number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/trainers/${id}/status`,
      {
        status,
      }
    )
  }

  async getStatisticByTrainer(
    id: string | number | null | undefined
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/trainers/${id}/statistic`
    )
  }
}

export default TrainerModule
