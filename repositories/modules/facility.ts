import HttpFactory from '../http-factory'
import {
  IFacilityFilter,
  IFacilitySignUp,
  IFacilityMemberParams,
  IFacilityEditData,
  IFacilityHistoriesParams,
} from '@/interfaces/facility'
class FacilityModule extends HttpFactory {
  private config = useRuntimeConfig()
  async getFacilityList(
    filter: IFacilityFilter
  ): Promise<Object | null | any> {
    for (const [key, value] of Object.entries(filter)) {
      if (!value || value === 'null') {
        delete filter[key]
      }
    }

    return await this.call<Object | null | any>(
      'GET',
      `/administrator${this.config.public.apiVer}/facilities`,
      undefined,
      {
        params: {
          ...filter,
        },
      }
    )
  }

  async trainers(): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/trainers`
    )
  }

  async checkPermission(): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/check-permission`
    )
  }

  async signup(
    credentials: IFacilitySignUp
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/facilities/register`,
      credentials
    )
  }

  async verify(credentials: {
    code: string
  }): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/facilities/verify`,
      credentials
    )
  }

  async getFacilityDetail(
    id: string | number | null | undefined
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}`
    )
  }

  async getFacilityStatistic(
    id: string | number | null | undefined
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}/statistic`
    )
  }

  async getFacilityStatisticMembers(
    id: string | number | null | undefined,
    params: IFacilityMemberParams
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}/statistic/members`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async update(
    credentials: IFacilityEditData | any,
    id: string | number | null | undefined
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/facilities/${id}`,
      credentials
    )
  }

  async getPlanHistoriesByFacility(
    id: string | number | null | undefined,
    params: IFacilityHistoriesParams
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}/plan-histories`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async upgradePlan(
    id: string | number | null | undefined,
    credentials: IFacilityEditData | any
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/facilities/${id}/upgrade-plan`,
      credentials
    )
  }

  async handleUpgradePlan(
    id: string | number | null | undefined,
    credentials: IFacilityEditData | any
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/facilities/${id}/handle-upgrade-plan`,
      credentials
    )
  }

  async inactiveFacility(
    id: string | number | null | undefined
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PATCH',
      `${this.config.public.apiVer}/facilities/${id}/inactive`
    )
  }

  async exportPdfReceipt(
    id: string,
    planPurchasedId: string
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}/plan-purchaseds/${planPurchasedId}/export-receipt`
    )
  }
}

export default FacilityModule
