import HttpFactory from '../http-factory'
import {
  GroupCreateParams,
  GroupParams,
} from '@/interfaces/group'
class GroupModule extends HttpFactory {
  private config = useRuntimeConfig()
  async list(
    params: GroupParams
  ): Promise<Object[] | null | any> {
    const { serialize } = useHelper()
    return await this.call<Object[] | null | any>(
      'GET',
      `${
        this.config.public.apiVer
      }/users/groups?${serialize(params)}`
    )
  }

  async listForSuperAdmin(
    params: GroupParams
  ): Promise<Object[] | null | any> {
    const { serialize } = useHelper()
    return await this.call<Object[] | null | any>(
      'GET',
      `administrator${
        this.config.public.apiVer
      }/groups?${serialize(params)}`
    )
  }

  async detail(id: string): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/groups/${id}`
    )
  }

  async members(
    id: string,
    page: number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/groups/${id}/members?limit=10&page=${page}`
    )
  }

  async membersAll(
    id: string
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/groups/${id}/members`
    )
  }

  async create(
    params: GroupCreateParams
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/groups`,
      params
    )
  }

  async delete(id: string): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'DELETE',
      `${this.config.public.apiVer}/groups/${id}`
    )
  }

  async update(
    credentials: GroupCreateParams,
    id: string | number | null | undefined
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/groups/${id}`,
      credentials
    )
  }
}

export default GroupModule
