import { IGroup } from './group'
import { IMemberEvaluationHistories } from './evaluation'
import { ITrainer } from './trainer'
import { IResWithPagination } from './common'

export interface IMemberStatus {
  name: string
  value: number | null
}
export interface IMemberOrder {
  name: string
  order_type: string
  order_by: string
}
export interface IMemberLevel {
  name: string
  value: number | null | string
}

export interface IMemberRegister {
  avatar: null | File | string
  karute?: string
  level: string | null | number
  last_name: string
  first_name: string
  last_name_kana: string
  first_name_kana: string
  zip1: string
  zip2: string
  address: string
  building_name: string
  year: string
  month: string
  day: string
  age: string
  sex: string | number
  tel: string
  medical_history: string
  memo: string
  email: string
  group_id: string | number
  trainer_id: string | number
  [key: string]: string | null | any
}

export interface IMemberEdit {
  avatar: null | File | string
  karute?: string
  level: string | null | number
  last_name: string
  first_name: string
  last_name_kana: string
  first_name_kana: string
  zip1: string
  zip2: string
  address: string
  building_name: string
  year: string
  month: string
  day: string
  age: string
  sex: string | number
  tel: string | number
  medical_history: string
  memo: string
  email: string
  group_id: string | number
  trainer_id: string | number | null
  url_avatar: string
  [key: string]: string | null | any
}

export interface IMemberFilter {
  keyword: string
  status: number | null
  order_by: string
  order_type: string
  page: number
  level: string | number | null
  trainer_id: string | number | null
  group_id: string | number | null
}

export interface IMemberItem {
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
  group: IGroup
  trainer: ITrainer
  group_id?: string | number
}

export interface IMemberListVideo {
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
}

export interface IMemberInfo {
  avatar: string
  url_avatar: string
  last_name: string
  first_name: string
  level: number
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

export interface IMemberGroup {
  name: string
  id: string | number
  trainer_id: string | number
  trainer: IMemberTrainer
}

export interface IMemberTrainer {
  id?: number | string
  last_name: string
  first_name: string
}

export interface IMemberDetail {
  address: string
  address1: string
  address2: string
  address3: string
  address4: string
  age: number
  avatar: null | File | string
  birthday: string
  building_name: string
  created_at: string
  email: string
  facility_id: number | string
  first_name: string
  first_name_kana: string
  id: number | string
  karute?: string
  last_name: string
  last_name_kana: string
  level: string | null | number
  medical_history: string
  memo: string
  sex: number | string
  status: number
  tel: string | number | null
  updated_at: string
  url_avatar: string
  zip1: string
  zip2: string
  group: IMemberGroup
  trainer: IMemberTrainer
  trainer_id: number | string
  status_label: string
}

export interface IMemberEditInfo {
  address: string
  age: number | string
  avatar: null | File | string
  building_name: string
  email: string
  first_name: string
  first_name_kana: string
  last_name: string
  last_name_kana: string
  memo: string
  sex: number | string
  tel: string | number
  zip1: string
  year: string
  month: string
  day: string
}

export interface IMemberState {
  memberRegister: IMemberRegister | null
  memberEdit: IMemberEdit | null
  listMember: IMemberItem[]
  total: number
  page: number
  memberListVideo: IMemberListVideo[]
  meta: Meta | null
  memberInfo: IMemberInfo | null
  memberDetail: IMemberDetail | null
  evaluationHistories?: IResWithPagination<
    IMemberEvaluationHistories[]
  > | null
  lastEvaluationHistories?: IMemberEvaluationHistories | null
  evaluationByDate?: IMemberEvaluationHistories | null
  listMemberAvailable: IMemberItem[]
  memberEditInfo: IMemberEditInfo | null
  urlExportCsv: string | null
  listAllVideoByMember: IMemberListVideo[]
  errorCheckPoint: any
}
