import {
  IFacilityOrder,
  IFacilityStatus,
} from '@/interfaces/facility'

export const facilityStatusList: IFacilityStatus[] = [
  {
    name: 'pages.facility.status.show_all',
    value: null,
  },
  // {
  //   name: 'pages.facility.status.no_deadline',
  //   value: 0,
  // },
  {
    name: 'pages.facility.status.has_deadline',
    value: 1,
  },
  {
    name: 'pages.facility.status.expired',
    value: 2,
  },
  {
    name: 'pages.facility.status.requesting_renew',
    value: 3,
  },
]

export const facilityOrderList: IFacilityOrder[] = [
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

export const facilityStatusPlan: IFacilityStatus[] = [
  {
    value: 1,
    name: 'pages.setting.request', // approval
  },
  {
    value: 2,
    name: 'pages.setting.approve', // update request
  },
  {
    value: 3,
    name: 'pages.setting.reject', // rejection
  },
  {
    value: 4,
    name: 'pages.setting.stop', // Stop
  },
]

export enum FacilityStatus {
  CREATE = 1,
  ACCEPT = 2,
  REFUSE = 3,
}
