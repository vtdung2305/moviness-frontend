import { IVideoOrder } from '@/interfaces/video'

export const videoOrderList: IVideoOrder[] = [
  {
    name: 'newest_first',
    order_by: 'created_at',
    order_type: 'DESC',
  },
  {
    name: 'oldest_first',
    order_by: 'created_at',
    order_type: 'ASC',
  },
  {
    name: 'syllabary_order',
    order_by: 'name',
    order_type: 'ASC',
  },
]

export const sizeUploadVideo = 100000000

export enum VideoTypeEnum {
  NORMAL = 1,
  YOUTUBE = 2,
}
