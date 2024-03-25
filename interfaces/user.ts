import { RoleId } from '@/interfaces/role'
import { ICheckPoint } from '@/interfaces/video'
export type RememberToken = 0 | 1
export interface IUser {
  id?: number | null
  address?: string
  address1?: string
  address2?: string
  address3?: string
  address4?: string
  avatar?: string
  email?: string
  facility_id?: number | null
  first_name?: string
  first_name_kana?: string
  last_name?: string
  last_name_kana?: string
  role?: RoleId | null
  status?: string | number
  tel?: string
  zip1?: string
  zip2?: string
  url_avatar?: string
  total_member?: number
}

export interface IUserLoginData {
  email: string
  password: string
  remember_token: RememberToken
  role: number
}

export interface IUserListVideo {
  id: string
  name: string
  url: string
  url_video: string
  content: string
  status: number
  order: number
  plan_version_id: number
  created_at: string
  updated_at: string
  number_check_point: number
  last_date_evaluation: string
  number_evaluation: number
  time_length: number
  thumbnail?: string
  thumbnail_url?: string
  check_points?: ICheckPoint[] | any
}

export interface IPurchaseReminder {
  plan: string
  email: string
}
