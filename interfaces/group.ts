import { IUser } from './user'
import { GroupEnum } from '@/constants/group'

export interface IGroupCreateData {
  groupName: string
  groupContent: string
  fileAvatar: any
  trainer: string
}

export interface GroupCreateMembers {
  id: string | number
  is_delete: boolean
}

export interface IGroupEditData {
  groupName: string
  groupContent: string
  fileAvatar: any
  trainer: string
  status?: string | number
  members?: GroupCreateMembers
}

export interface ITrainer {
  last_name: string
  first_name: string
}

export interface IGroupDetail {
  id?: number | string
  name: string
  content: string
  trainer: ITrainer
  status?: string | number
  url_image?: string | number | any
  updated_at?: string
  members?: IUser[]
}

export interface GroupCreateParams {
  name: string
  image: string | null
  content: string
  trainer_id: number | null
  members?: Object[] | null
}
export interface GroupParams {
  keyword?: string
  status?: number[] | string
  trainer_id?: string | number | null
  order_by?: string
  order_type?: string
  page?: number
  limit?: number
}

export interface Meta {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}

export interface IGroup {
  id: number
  name: string
  content: string
  trainer?: any
  image?: any
  status: GroupEnum
  trainer_id: number
  facility_id: number
  total_member: number
  total_member_male: number
  total_member_female: number
  total_member_unknow: number
  url_image: string
}

export interface IGroupList {
  groupList: IGroup[]
  meta: Meta
}

export interface IUserList {
  address: string
  address1: string
  address2: string
  address3: string
  address4: string
  age: number
  avatar: string
  birthday: string
  building_name: string
  created_at: string
  email: string
  facility_id: number | string
  first_name: string
  first_name_kana: string
  id: number | string
  karute: string
  last_name: string
  last_name_kana: string
  level: number
  medical_history: string
  memo: string
  sex: number
  status: number
  status_label: string
  tel: string | number
  updated_at: string
  url_avatar: string
  zip1: string
  zip2: string
  is_delete?: boolean | undefined
  group_id?: string | number
}

export interface IGroupListOption {
  label: string
  value: string | number
}

export interface ItemValue {
  label: string
  value: string
  isCopy?: boolean
  link?: string
  linkText?: string
}
