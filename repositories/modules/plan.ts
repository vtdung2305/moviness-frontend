import HttpFactory from '../http-factory'
import { IParamPlan } from '@/interfaces/plan'
class PlanModule extends HttpFactory {
  private config = useRuntimeConfig()
  async getPlanList(): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/plans`
    )
  }

  async getPlanListAvailable(): Promise<
    Object | null | any
  > {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/plans/list-available`
    )
  }

  async getPlanDetail(
    id: string
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/plans/${id}`
    )
  }

  async getVideoListByPlan(
    id: string,
    params: any
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/plans/${id}/videos`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async editPlan(
    id: string | number,
    params: IParamPlan
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'PUT',
      `${this.config.public.apiVer}/plans/${id}`,
      params
    )
  }

  async getStatisticBySuperAdmin(): Promise<
    Object | null | any
  > {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/statistic`
    )
  }
}

export default PlanModule
