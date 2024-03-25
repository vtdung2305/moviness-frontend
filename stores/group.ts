import {
  IGroupCreateData,
  IGroupList,
  GroupParams,
  GroupCreateParams,
  IGroup,
  IUserList,
  IGroupDetail,
  IGroupEditData,
} from '@/interfaces/group'
import { ModalNameEnum } from '@/constants/modal'

export const useGroup = defineStore('group', {
  state: (): {
    groupCreateData: IGroupCreateData | null
    isEdit: boolean
    groups: IGroupList | null
    allGroup: IGroup[]
    userList: IUserList[]
    userListNotSet: IUserList[]
    groupEditData: IGroupEditData | null
    isEditGroup: boolean
    groupDetail: IGroupDetail | null
  } => ({
    groupCreateData: null,
    isEdit: false,
    groups: null,
    allGroup: [],
    userList: [],
    userListNotSet: [],
    groupEditData: null,
    isEditGroup: false,
    groupDetail: null,
  }),
  actions: {
    updateGroup(group: any) {
      this.groupCreateData = group
    },
    setEdit(isEdit: boolean) {
      this.isEdit = isEdit
    },
    resetGroup() {
      this.groupCreateData = null
    },

    editGroup(group: any) {
      this.groupEditData = group
    },
    setEditGroup(isEditGroup: boolean) {
      this.isEditGroup = isEditGroup
    },
    resetEditGroup() {
      this.groupEditData = null
    },
    async getList(params: GroupParams) {
      const { $api, $showModal } = useNuxtApp()
      try {
        const res = await $api.group.list(params)
        if (res && res.data && res.data.data) {
          const groups = {
            groupList: res.data.data,
            meta: res.data.meta,
          }
          this.groups = groups
        }
      } catch (error) {
        this.groups = null
        if ((error as any).response.status === 429) {
          $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
        }
      }
    },
    async getListForSuperAdmin(params: GroupParams) {
      const { $api, $showModal } = useNuxtApp()
      try {
        const res = await $api.group.listForSuperAdmin(
          params
        )
        if (res && res.data && res.data.data) {
          const groups = {
            groupList: res.data.data,
            meta: res.data.meta,
          }
          this.groups = groups
        }
      } catch (error) {
        this.groups = null
        if ((error as any).response.status === 429) {
          $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
        }
      }
    },
    async getAllListGroup() {
      const { $api } = useNuxtApp()
      const res = await $api.group.listForSuperAdmin({
        limit: 0,
      })
      if (res.data) {
        this.allGroup = res.data
      }
    },
    async getDetail(id: string) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.group.detail(id)
        if (res && res.data) {
          return res
        }
      } catch (error) {}
    },
    async getListMembers(id: string, page: number) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.group.members(id, page)
        if (res && res.data) {
          return res
        }
      } catch (error) {}
    },
    async getListMembersAll(id: string) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.group.membersAll(id)
        if (res && res.data) {
          return res
        }
      } catch (error) {}
    },
    async create(params: GroupCreateParams) {
      const { $api } = useNuxtApp()
      return await $api.group.create(params)
    },
    async delete(id: string) {
      const { $api } = useNuxtApp()
      return await $api.group.delete(id)
    },

    removeItemUser(value: IUserList) {
      const indexValue = this.userList.findIndex(
        (el) => el.id === value.id
      )
      if (indexValue > -1 && typeof value.id === 'number') {
        const item = this.userList.find(
          (x) => x.id === value.id
        )
        this.userListNotSet.push(item as IUserList)
        this.userList[indexValue].is_delete = true
      }
    },

    addItemUser(value: IUserList) {
      this.userList.push(value)
    },

    removeItemUserListNotSet(value: any) {
      const arrIdRemove = toRaw(value)

      const arrPush = toRaw(
        this.userListNotSet.filter(function (item) {
          return arrIdRemove.includes(item.id)
        })
      )

      for (let i = 0; i < arrPush.length; i++) {
        if (
          arrPush[i].group_id !== this.groupDetail?.id &&
          this.userList.filter(
            (e) => e.id === arrPush[i].id
          ).length == 0
        ) {
          const itemPush = {
            ...arrPush[i],
            is_delete: false,
          }

          this.userList.push(itemPush)
        } else {
          const objIndex = this.userList.findIndex(
            (obj) => obj.id === arrPush[i].id
          )

          this.userList[objIndex].is_delete = false
        }
      }

      const toDelete = new Set(arrIdRemove)
      this.userListNotSet = this.userListNotSet.filter(
        (obj) => !toDelete.has(obj.id)
      )
    },
  },
})
