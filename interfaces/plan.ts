import { IVideo } from './video'
import { IGroup } from './group'
import { IStatistic } from './facility'

export interface IPlan {
  id: number | null
  created_at?: string
  content?: string
  max_group_count?: number | null
  max_member_count?: number | null
  max_trainer_count?: number | null
  max_video_count?: number | null
  time_plan_duration?: number | null
  name: string
  plan_price?: string
  status: number
  image?: string | null
  number_facility_register?: number | null
  videos: IVideo[]
}

export interface IParamPlanVideo {
  id: number | string | null
  order: number | null
  is_required: boolean | undefined
}

export interface IParamPlan {
  planDetail: IPlan
  videos: IParamPlanVideo[]
}

export interface IPlanState {
  planList: IPlan[]
  videoList: IVideo[]
  planDetail: IPlan
}

export interface IPlanInfo {
  id: number | string
  name: string
  image_url: string
  type: string
  max_group_count: number
  max_member_count: number
  max_trainer_count: number
}

export interface IHistoryPlanPurchasedLast {
  request_time_plan_purchased: string
  plan_id_before: number | null
  plan_id_current: number | null
  plan_name_before: string | null
  plan_name_current: string | null
}

export interface IHistoryPlanPurchased {
  id: number | string
  name: string
  name_kata: string
  zip1: string
  zip2: string
  address1: string
  address2: string
  address3: string
  address4: string
  tel: string
  fax: string
  email: string
  avatar: string
  url_avatar: string | null
  images: string | null
  status: number
  manager_id: number
  plan_version_id: number | string
  created_at: string
  updated_at: string
  history_plan_purchased_last: IHistoryPlanPurchasedLast
}

export interface IPlanStatisticInfo {
  statistic: IStatistic
  history_plan_purchased: IHistoryPlanPurchased[]
  plan: IPlan[]
}

export interface IPlanPurchaseds {
  created_at: string | null
  created_by: string | null
  deleted_at: string | null
  deleted_by: string | null
  expiry_date_end: string | null
  expiry_date_start: string | null
  facility_id: number | string
  id: number | string
  note: string
  plan: IPlan
  plan_id: number | string
  plan_id_before: number | string | null
  plan_version_id: number | string | null
  plan_version_id_before: number | string | null
  purchase_date: string | null
  purchase_method: number | null
  status: number | null
  updated_at: string | null
  updated_by: null
}
