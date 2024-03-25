import {
  IMemberStatus,
  IMemberOrder,
  IMemberLevel,
} from '@/interfaces/member'

export const userStatusList: IMemberStatus[] = [
  {
    name: 'pages.user_list.all',
    value: null,
  },
  {
    name: 'pages.user_list.set',
    value: 1,
  },
  {
    name: 'pages.user_list.not_set',
    value: 2,
  },
  {
    name: 'pages.user_list.cancel',
    value: 3,
  },
]

export const userOrderList: IMemberOrder[] = [
  {
    name: 'components.search_filter.sort_list.desc',
    order_by: 'created_at',
    order_type: 'DESC',
  },
  {
    name: 'components.search_filter.sort_list.oldest_first',
    order_by: 'created_at',
    order_type: 'ASC',
  },
  {
    name: 'components.search_filter.sort_list.asc',
    order_by: 'first_name',
    order_type: 'ASC',
  },
  {
    name: 'components.search_filter.sort_list.alphabet',
    order_by: 'first_name',
    order_type: 'ASC',
  },
]

export const levels: IMemberLevel[] = [
  {
    value: '0',
    name: '評価なし',
  },
  {
    value: 1,
    name: '1',
  },
  {
    value: 2,
    name: '2',
  },
  {
    value: 3,
    name: '3',
  },
  {
    value: 4,
    name: '4',
  },
  {
    value: 5,
    name: '5',
  },
]

export enum MemberStatusEnum {
  JOINED = 1, // 設定済み：joined a group
  NOT_JOINED = 2, // 未設定: not join group
  LEAVED = 3, // 解約: leave facility
}
