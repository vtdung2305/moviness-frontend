import {
  required,
  maxLength,
  helpers,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { MenuItemBase } from '@/interfaces/menu'
import { useGroup } from '@/stores/group'
import { useTrainer } from '@/stores/trainer'
import { useFacility } from '@/stores/facility'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'

export const useRegistration = () => {
  const { t } = useLang()
  const groupStore = useGroup()
  const trainerStore = useTrainer()
  const facilityStore = useFacility()
  const router = useRouter()
  const { getFullName } = useHelper()
  const userStore = useUser()

  const groupCreateData = groupStore.groupCreateData
  const permissionAddGroup = ref(true)
  const isLoading = ref(false)

  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
    {
      text: 'components.menu.group_registration',
      route: { name: '' },
    },
  ]

  const srcAvatar = ref()
  const form = ref({
    name: '',
    content: '',
    trainer: '',
  })

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
      groupStore.updateGroup({
        groupName: form.value.name.trim(),
        groupContent: form.value.content.trim(),
        fileAvatar: srcAvatar.value,
        trainer: form.value.trainer,
      })
      router.push(route)
    }
  }

  const getListTrainers = async () => {
    await trainerStore.getListTrainerOfFacility(
      userStore.userData?.facility_id as number
    )
  }

  const checkPermission = async () => {
    try {
      const res = await facilityStore.checkPermission()
      if (res && res.data) {
        permissionAddGroup.value =
          res.data.permission_add_group || false
      }
    } catch (e) {}
  }

  const typeBtn = computed(() => {
    return permissionAddGroup.value
      ? 'primary'
      : 'secondary'
  })

  onMounted(async () => {
    isLoading.value = true
    if (groupStore.isEdit) {
      srcAvatar.value = groupCreateData?.fileAvatar
      form.value.name = groupCreateData?.groupName || ''
      form.value.content =
        groupCreateData?.groupContent || ''
      form.value.trainer = groupCreateData?.trainer || ''
      groupStore.setEdit(false)
    } else {
      groupStore.resetGroup()
    }
    await getListTrainers()
    if (!isAdmin.value) {
      form.value.trainer = getFullName(
        userStore.userData?.last_name,
        userStore.userData?.first_name
      )
    }
    await checkPermission()
    isLoading.value = false
  })

  return {
    listBreadcrumbs,
    srcAvatar,
    form,
    errors,
    trainerList,
    permissionAddGroup,
    typeBtn,
    isLoading,
    submit,
  }
}
