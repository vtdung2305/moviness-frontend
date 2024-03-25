import { IMemberStatus } from '@/interfaces/member'
import { IPlanInfo } from '@/interfaces/plan'

export enum PlanStatus {
  PUBLIC = 1, // plan is public
  PRIVATE = 2, // plan is private
}

export enum PlanIdEnum {
  FREE = 1, // plan free
  LITE = 2, // plan lite
  STANDARD = 3, // plan standard
  ADVANCE = 4, // plan advance
}

// export enum PlanNameEnum: {
//   FREE = 'フリー', // plan free
//   LITE = 'ライト', // plan lite
//   STANDARD = 'スタンドル', // plan standard
//   ADVANCE = 'アドバンス', // plan advance
// }

export const PlanInfoEnum: IPlanInfo[] = [
  {
    id: 1,
    name: 'フリー',
    image_url: '/images/plan_free.png',
    type: 'FREE',
    max_group_count: 10,
    max_member_count: 50,
    max_trainer_count: 3,
  },
  {
    id: 2,
    name: 'ライト',
    image_url: '/images/plan_lite.png',
    type: 'LITE',
    max_group_count: 4,
    max_member_count: 20,
    max_trainer_count: 1,
  },
  {
    id: 3,
    name: 'スタンダード',
    image_url: '/images/plan_standard.png',
    type: 'STANDARD',
    max_group_count: 5,
    max_member_count: 50,
    max_trainer_count: 10,
  },
  {
    id: 4,
    name: 'アドバンス',
    image_url: '/images/plan_advance.png',
    type: 'ADVANCE',
    max_group_count: 10,
    max_member_count: 100,
    max_trainer_count: 20,
  },
]

export const PlanUnlimitedEnum = 99999

export const PlanRemainingAvailableEnum = 30 // remaining_available_day plan

export const PlanRequest: IMemberStatus[] = [
  {
    value: 2,
    name: '承認',
  },
  {
    value: 3,
    name: '拒否',
  },
]

export enum PlanUpgradeEnum {
  EXTEND = 1, // extend plan
  UPGRADE = 2, // upgrade plan
  DOWNGRAGE = 3, // downgrade plan
}
