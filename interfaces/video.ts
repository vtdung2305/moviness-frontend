export interface VideoParams {
  keyword: string
  order_by: string
  order_type: string
  page?: number | null
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

export interface ICheckPoint {
  id?: number
  name?: string
  content: string
  checkpoint_time: number
  status?: number
  video_id?: number
  checkpoint_time_conver?: string
  index?: number
  is_complete?: boolean
  physical_point?: number
  psychological_point?: number
}
export interface IVideo {
  id: number
  content: string
  name: string
  number_check_point: number
  order: number
  plan_version_id: number
  status: number
  thumbnail: string
  thumbnail_url: string
  url_video: string
  time_length: number
  url: string
  check_points: ICheckPoint[]
  type_video: number
  can_edit: boolean
  is_delete?: boolean
  is_required?: boolean
}

export interface IVideoList {
  videoList: IVideo[]
  meta: Meta
}

export interface IVideoOrder {
  name: string
  order_type: string
  order_by: string
}

export interface IParamsUploadVideo {
  name: string
  url: string
  type_video: string
  content: string
  time_length: number
  check_points: {
    id: string
    checkpoint_time: number
    content: string
  }[]
  thumbnail: string
}

export interface IVideoEdit {
  name: string
  isFromFile: 0 | 1
  file?: any
  urlFile?: string | null
  isFromYoutube: 0 | 1
  urlYoutube?: string
  desciption?: string
  checkpoints?: {
    time: number
    content: string
  }[]
  fileThumbnails?: any
  urlThumbnail?: string
}

export interface IVideoItem {
  content: string
  created_at: string
  id: number | string
  name: string
  number_check_point: number
  order: number
  plan_version_id: number | null
  status: number
  thumbnail: string | null
  thumbnail_url: string | null
  time_length: number
  type_video: number
  updated_at: string
  url: string
  url_video: string
}
