import omitBy from 'lodash/omitBy'
import isNull from 'lodash/isNull'
import HttpFactory from '../http-factory'
import {
  IMemberFilter,
  IMemberRegister,
  IMemberEdit,
} from '@/interfaces/member'
import {
  IEvaluationDate,
  IEvaluationDateFromTo,
  IParamsEvaluation,
} from '@/interfaces/evaluation'
import { IParamsPagination } from '@/interfaces/common'

class MemberModule extends HttpFactory {
  private config = useRuntimeConfig()

  async register(
    credentials: IMemberRegister
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/members`,
      credentials
    )
  }

  async update(
    credentials: IMemberEdit,
    id: string | number | null | undefined
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/members/${id}`,
      credentials
    )
  }

  async getMembersByFacility(
    id: string | number | null | undefined,
    filter: IMemberFilter | null
  ): Promise<Object | null | any> {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (!value || value === 'null') {
          delete filter[key]
        }
      }
    }

    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}/members`,
      undefined,
      {
        params: {
          ...filter,
        },
      }
    )
  }

  async exportMembersByFacility(
    id: string | number | null | undefined,
    filter: IMemberFilter | null
  ): Promise<Object | null | any> {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (!value || value === 'null') {
          delete filter[key]
        }
      }
    }

    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/facilities/${id}/members/export-csv`,
      undefined,
      {
        params: {
          ...filter,
        },
      }
    )
  }

  async getMembersForSuperAdmin(
    filter: IMemberFilter | null
  ): Promise<Object | null | any> {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (!value || value === 'null') {
          delete filter[key]
        }
      }
    }
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/members`,
      undefined,
      {
        params: {
          ...filter,
        },
      }
    )
  }

  async getMembersListVideo(
    id: string,
    filters: IParamsPagination | null
  ): Promise<Object[] | null | any> {
    const params = omitBy(filters, isNull)
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/${id}/videos`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async getMembersDetail(
    id: string
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/${id}`
    )
  }

  async getEvaluationHistoriesByVideo(
    id: string,
    videoId: string,
    params: IEvaluationDateFromTo
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/${id}/videos/${videoId}/evaluation-histories`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async getLastEvaluationHistoriesByVideo(
    id: string,
    videoId: string
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/${id}/videos/${videoId}/last-evaluation-histories`
    )
  }

  async getEvaluationByDate(
    id: string,
    videoId: string,
    params: IEvaluationDate
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/${id}/videos/${videoId}/evaluation-by-date`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async createEvaluation(
    id: string | number,
    credentials: IParamsEvaluation
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/members/${id}/evaluations`,
      credentials
    )
  }

  async getListAvailable(): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/list-available-by-auth`
    )
  }

  async leaveFacility(
    id: string | number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/members/${id}/leave-facility`
    )
  }

  async exportPdfHistoriesEvaluation(
    id: string,
    videoId: string,
    params: IEvaluationDateFromTo
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/members/${id}/videos/${videoId}/export-evaluation-histories`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }
}

export default MemberModule
