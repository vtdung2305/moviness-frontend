export interface ITrainerCreateData {
  email: string
  lastname: string
  firstname: string
  lastnameKana: string
  firstnameKana: string
  postCode: string
  address: string
  buildingName: string
  gender: string
  mobilePhone: string
  remarks: string
  fileAvatar: any
  year: string
  month: string
  day: string
}

export interface TrainerCreateParams {
  avatar: string | null
  email: string
  first_name: string
  last_name: string
  first_name_kana: string
  last_name_kana: string
  zip1: string
  zip2?: string
  address: string
  building_name: string
  year: string
  month: string
  day: string
  sex: number | string
  tel: string | number
  memo: string
  age?: string
  birthday?: string
}

export interface ITrainer {
  id: number
  email: string
  avatar: string
  url_avatar?: string
  status: number
  status_label: string
  address: string
  tel: string
  first_name: string
  last_name: string
  first_name_kana: string
  last_name_kana: string
  zip1: string
  zip2: string
  address1: string
  address2: string
  address3: string
  address4: string
  role: number
  total_group: number
  facility_id: number
  total_member: number
  total_member_male: number
  total_member_female: number
  total_member_unknow: number
}

export interface IParamsGetListTrainer {
  status_group_user?: number
  keyword?: string
  order_by?: string
  order_type?: string
  page?: number
  limit?: number | string
  status?: number
}

export interface ITrainerFacility {
  name: string
}

export interface ITrainerDetail {
  id: number | string
  email: string
  avatar: string
  status: number
  address: string
  tel: string
  first_name: string
  last_name: string
  first_name_kana: string
  last_name_kana: string
  zip1: string
  zip2: string
  address1: string
  address2: string
  address3: string
  address4: string
  role: number
  trainer_status: number
  facility_id: number
  facility: ITrainerFacility
  created_at: string
  updated_at: string
  total_group: number
  total_member: number
  total_member_male: number
  total_member_female: number
  total_member_unknow: number
  sex: string | number
  building_name: string
  birthday: string
  last_login: string
  memo: string
  status_label: string
  facility_name: string
  url_avatar: string
  time_lock_login: string
}
