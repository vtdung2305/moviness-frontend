import { IPlan, IPlanPurchaseds } from './plan'
import { IGroup } from './group'
import { IMemberItem } from './member'
import { ITrainerDetail } from './trainer'

export interface IFacilityFilter {
  keyword?: string
  status?: number[] | null
  plan_id?: string | null
  order_by?: string
  order_type?: string
  page?: number
  limit?: number | string
}

export interface IFacilityPresident {
  id: number
  created_at: string
  president_address1: string
  president_address2: string
  president_address3: string
  president_address4: string
  president_email: string
  president_first_name: string
  president_first_name_kata: string
  president_last_name: string
  president_last_name_kata: string
  president_tel: string
  president_zip1: string
  president_zip2: string
}

export interface IFacilityManager {
  id: number
  email: string | null
  avatar: string | null
  url_avatar: string | null
  status: number
  address: string | null
  tel: string | null
  sex: number
  birthday: string | null
  year: string | null
  month: string | null
  day: string | null
  building_name: string | null
  first_name: string | null
  last_name: string | null
  first_name_kana: string | null
  last_name_kana: string | null
  zip1: string | null
  zip2: string | null
  address1: string | null
  address2: string | null
  address3: string | null
  address4: string | null
  memo: string | null
  role: number
  facility_id: number
  created_at: string | null
  updated_at: string | null
  last_login: string | null
}

export interface IFacility {
  id: number | string | null
  name: string
  name_kata?: string
  zip1?: string
  zip2?: string
  address1?: string
  address2?: string
  address3?: string
  address4?: string
  tel?: string
  fax?: string
  email?: string
  avatar?: string
  images?: string | null
  status?: number | null
  manager_id?: number | null
  plan_version_id?: number | null
  created_at?: string
  info?: IFacilityPresident | null
  plan?: IPlan
  url_avatar?: string
  plan_purchased_need_upgrade_last?: IPlanPurchaseds | null
  plan_purchaseds?: IPlanPurchaseds[]
  plan_expire_at?: string | null
  remaining_available_day?: string | number
  manager?: IFacilityManager | null
  is_request_upgrade_plan?: boolean
}

export interface IFacilitySignUp {
  facility_name: string
  facility_name_kata: string
  facility_zip1?: number | string | null
  facility_zip2?: number | string | null
  facility_address1: string
  facility_address2: string
  facility_tel: number | null
  facility_fax: number | null
  facility_email: string
  president_name: string
  president_name_kata: string
  admin_name: string
  admin_name_kata: string
  plan_id: string | number
  admin_email: string
  password: string
  password_confirmation: string
  [key: string]: string | null | any
}

export interface IStatistic {
  total_group_available: number
  total_member_available: number
  total_trainer_available: number
  total_member_not_have_group_id?: number
  total_member_unknow?: number
  total_group?: number
  total_member?: number
  total_member_not_have_trainer_id?: number
  total_group_not_have_trainer_id?: number
  total_facility_request_upgrade?: number
}

export interface IFacilityStatistic {
  group?: IGroup[]
  plan: {
    facility_id: number
    image_plan_url: string
    plan_expire_at: string
    plan_name: string
    remaining_available_day: number
  }
  members: IMemberItem[]
  statistic: IStatistic
  trainer?: ITrainerDetail
}

export interface IFacilityStatisticMember {
  number_members: number
  created_at_format: string
}

export interface IFacilityStatus {
  name: string
  value: number | null
}

export interface IFacilityOrder {
  name: string
  order_type: string
  order_by: string
}

export interface IFacilityMemberParams {
  type: string
  date_from: string
  date_to: string
}

export interface IFacilityEditData {
  avatar: any
  name: string
  name_kata: string
  zip1: string
  address: string
  tel: string
  fax: string
  email: string
  president_first_name: string
  president_first_name_kata: string
  president_zip1: string
  president_address: string
  president_tel: string
  president_email: string
  manager_avatar: any
  manager_first_name: string
  manager_first_name_kata: string
  manager_zip1: string
  manager_address: string
  manager_tel: string
  manager_email: string
}
export interface IFacilityPlanHistories {
  id: number | string
  purchase_date: string | null
  purchase_method: null | number
  status: number
  plan_id: number | string
  plan_version_id: number | string
  facility_id: number | string
  plan_id_before: number | string | null
  plan_version_id_before: number | null
  expiry_date_start: string | null
  expiry_date_end: string | null
  created_by: string | null
  updated_by: string | null
  deleted_by: string | null
  plan: IPlan
  created_at: string | null
  updated_at: string | null
  deleted_at: null
}
export interface IFacilityState {
  facilityList: IFacility[]
  total: number
  facilityFormSignup: IFacilitySignUp | null
  facilityDetail: IFacility | null
  facilityStatistic: IFacilityStatistic | null
  facilityStatisticMembers: IFacilityStatisticMember[]
  facilityEditData: IFacilityEditData | null
  facilityPlanHistories: IFacilityPlanHistories[]
}

export interface IFacilityHistoriesParams {
  page: number
  limit: number
}
