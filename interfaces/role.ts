import { RoleEnum } from '@/constants/role'

export const roles = [
  RoleEnum.ADMIN,
  RoleEnum.ADMINISTRANTOR,
  RoleEnum.TRAINER,
] as const

export const roleId = [
  RoleEnum.ADMIN_ID,
  RoleEnum.ADMINISTRANTOR_ID,
  RoleEnum.TRAINER_ID,
] as const

export type Role = typeof roles[number]
export type RoleId = typeof roleId[number]
export type Theme = Role

export interface IRoleInterface {
  id: RoleId
  roleName: Role
}
