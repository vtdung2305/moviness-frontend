import {
  required,
  maxLength,
  helpers,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { MenuItemBase } from '@/interfaces/menu'
import { useGroup } from '@/stores/group'
import { useTrainer } from '@/stores/trainer'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'
import { useCommon } from '@/stores/index'
import { useMember } from '@/stores/member'

export const useGroupEdit = () => {
  const { t } = useLang()
  const groupStore = useGroup()
  const trainerStore = useTrainer()
  const router = useRouter()
  const { getFullName } = useHelper()
  const userStore = useUser()
  const showModal = ref(false)
  const { $showModal } = useNuxtApp()
  const route = useRoute()
  const groupEditData = groupStore.groupEditData
  const isLoading = ref(false)
  const userEdit = ref()
  const commonStore = useCommon()
  const memberStore = useMember()
  const srcAvatar = ref()
  const form = ref({
    name: '',
    content: '',
    trainer: '',
  })

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.group_list',
      route: { name: `app-${userStore.roleName}-group` },
    },
    {
      text: 'components.menu.group_detail',
      route: { name: `app-${userStore.roleName}-group-id` },
    },
    {
      text: 'components.menu.group_edit',
      route: { name: '' },
    },
  ]

  const rules = computed(() => {
    return {
      name: {
        required: helpers.withMessage(
          t(
            'pages.group_registration.validate.name.required'
          ),
          required
        ),
        maxLength: helpers.withMessage(
          t('pages.group_registration.validate.maxlength', {
            length: 256,
          }),
          maxLength(256)
        ),
      },
      content: {
        maxLength: helpers.withMessage(
          t('pages.group_registration.validate.maxlength', {
            length: 1000,
          }),
          maxLength(1000)
        ),
      },
      trainer: {
        required: helpers.withMessage(
          t(
            'pages.group_registration.validate.trainer.required'
          ),
          required
        ),
      },
    }
  })

  const errors = computed(() => {
    return {
      name: v$.value.name.$errors,
      content: v$.value.content.$errors,
      trainer: v$.value.trainer.$errors,
    }
  })

  const trainers = computed(() => trainerStore.trainers)

  const trainerList = computed(() => {
    if (trainers.value?.length) {
      return trainers.value?.map((item: any) =>
        getFullName(item.last_name, item.first_name)
      )
    }
  })

  const isAdmin = computed(() => {
    return userStore.roleName === RoleEnum.ADMIN
  })

  const v$ = useValidate(rules, form as any)

  const submit = async (route: Object) => {
    const res = await v$.value.$validate()
    if (res) {
      groupStore.editGroup({
        groupName: form.value.name,
        groupContent: form.value.content,
        fileAvatar: srcAvatar.value,
        trainer: form.value.trainer,
        status: groupStore.groupDetail?.status,
      })
      groupStore.setEditGroup(true)
      router.push(route)
    }
  }

  const getListTrainers = () => {
    trainerStore.getListTrainerOfFacility(
      userStore.userData?.facility_id as number
    )
  }

  const addUser = () => {
    alert('開発しています。')
  }

  const addUserList = () => {
    commonStore.setStatusModal(true)
    $showModal(ModalNameEnum.USER_LIST)
  }

  const deleteUser = (user: any) => {
    groupStore.removeItemUser(user)
  }

  const editUser = (user: any) => {
    alert('開発しています。')
  }

  const hideModal = () => {
    showModal.value = false
    commonStore.setStatusModal(false)
  }

  const getDataDetail = async () => {
    try {
      const id = route.params.id
      const res = await groupStore.getDetail(id as string)
      if (res && res.data) {
        groupStore.groupDetail = res.data
      }
    } catch (e) {}
  }

  const getListAvailable = async () => {
    await memberStore.getListAvailable()
  }

  onMounted(async () => {
    isLoading.value = true
    if (groupStore.isEditGroup) {
      srcAvatar.value = groupEditData?.fileAvatar
      form.value.name = groupEditData?.groupName || ''
      form.value.content = groupEditData?.groupContent || ''
      form.value.trainer = groupEditData?.trainer || ''
      groupStore.setEditGroup(false)
    } else {
      groupStore.resetEditGroup()
      await getDataDetail()
      await getListTrainers()
      await getListAvailable()
      form.value.name = groupStore.groupDetail?.name!
      form.value.content = groupStore.groupDetail?.content!
      form.value.trainer = groupStore.groupDetail?.trainer
        ? groupStore.groupDetail?.trainer?.last_name! +
          ' ' +
          groupStore.groupDetail?.trainer?.first_name!
        : ''

      setTimeout(() => {
        srcAvatar.value = groupStore.groupDetail?.url_image!
      }, 100)

      groupStore.userListNotSet =
        memberStore.listMemberAvailable.filter(
          (x) => x.group_id !== groupStore.groupDetail?.id
        )

      const newArr =
        groupStore.groupDetail?.members?.map((v: any) => ({
          ...v,
          is_delete: false,
        })) || []

      groupStore.userList = newArr
    }

    if (!isAdmin.value) {
      form.value.trainer = getFullName(
        userStore.userData?.last_name,
        userStore.userData?.first_name
      )
    }
    isLoading.value = false
  })

  return {
    listBreadcrumbs,
    srcAvatar,
    form,
    errors,
    trainerList,
    isLoading,
    showModal,
    userEdit,
    submit,
    addUser,
    addUserList,
    deleteUser,
    editUser,
    hideModal,
  }
}
