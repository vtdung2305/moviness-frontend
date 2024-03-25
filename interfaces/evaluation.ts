import { ICheckPoint } from '@/interfaces/video'

export interface IMemberEvaluationHistories {
  comment: string
  status: number
  evaluation_date: string
  user_name_evaluation: string | null
  group_member_history_id: number
  video_id: number | string
  member_id: number | string
  group_id: number | string
  total_check_point: number | null
  total_check_point_complete: number | null
  check_points: ICheckPoint[]
  id: number | string | null
}

export interface IEvaluationDateFromTo {
  evaluation_date_from: string | null
  evaluation_date_to: string | null
  page?: number
  limit?: number
}

export interface IEvaluationDate {
  evaluation_date: string | null
}

export interface IParamsCheckPoint {
  id: number | string
  is_complete: boolean
}

export interface IParamsEvaluation {
  evaluation_date: string
  video_id: number | string
  comment: string | null
  check_points: IParamsCheckPoint[]
}
