import { RoleEnum } from '@/constants/role'
import { useMember } from '@/stores/member'
import { GENDERS } from '@/constants/common'
import { useGroup } from '@/stores/group'
import { ModalNameEnum } from '@/constants/modal'
import { IMemberEdit } from '@/interfaces/member'
import { useUser } from '@/stores/user'
import { useTrainer } from '@/stores/trainer'
import { ImageDefaultEnum } from '@/constants/image'

export const useUserEditConfirmation = () => {
  // Variable
  const { t } = useLang()
  const router = useRouter()
  const route = useRoute()
  const { $api, $showModal, $hiddenModal } = useNuxtApp()
  const memberStore = useMember()
  const userStore = useUser()
  const groupStore = useGroup()
  const trainerStore = useTrainer()
  const { uploadFile } = useUpload()
  const config = useRuntimeConfig()
  const alert = ref<string>('')
  const isSubmitError = ref<boolean>(false)

  // Computed
  const group = computed(() => {
    if (
      groupStore.groups?.groupList &&
      memberStore.memberEdit?.group_id
    ) {
      return groupStore.groups?.groupList.find(
        (item) =>
          item.id === memberStore.memberEdit?.group_id
      )
    }
  })

  const groupOld = computed(() => {
    if (
      groupStore.groups?.groupList &&
      memberStore.memberDetail?.group?.id
    ) {
      return memberStore.memberDetail?.group?.name
    }
  })

  const trainer = computed(() => {
    if (
      trainerStore?.trainers &&
      memberStore.memberEdit?.trainer_id
    ) {
      return trainerStore.trainers?.find(
        (item) =>
          item.id === memberStore.memberEdit?.trainer_id
      )
    }
  })

  const trainerOld = computed(() => {
    if (
      trainerStore?.trainers &&
      memberStore.memberDetail?.trainer_id
    ) {
      return (
        memberStore.memberDetail?.trainer?.last_name +
        ' ' +
        memberStore.memberDetail?.trainer?.first_name
      )
    }
  })

  const gender = computed(() => {
    if (memberStore.memberEdit?.sex) {
      return GENDERS[Number(memberStore.memberEdit?.sex)]
    }
    return ''
  })

  const avatar = computed(() => {
    if (!memberStore.memberEdit?.avatar)
      return ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
    if (
      typeof memberStore.memberEdit?.avatar === 'string'
    ) {
      return memberStore.memberEdit?.avatar
    } else {
      return URL.createObjectURL(
        memberStore.memberEdit?.avatar as File
      )
    }
  })

  // Methods
  const confirm = async () => {
    $hiddenModal(ModalNameEnum.CONFIRM_REGISTER_MEMBER)
    let avatarUrl = ''

    if (
      typeof memberStore.memberEdit?.avatar === 'string'
    ) {
      avatarUrl = memberStore.memberEdit?.avatar.replace(
        `${config.public.apiCloud}/`,
        ''
      )
    } else if (memberStore.memberEdit?.avatar) {
      avatarUrl = await uploadFile(
        memberStore.memberEdit?.avatar as File
      )
      if (avatarUrl === 'ERROR') {
        avatarUrl = ''
        alert.value = t('others.upload_error')
        $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
        return
      }
    }

    const id = route.params.id as string | number
    const params = {
      avatar: avatarUrl,
      karute: memberStore?.memberEdit?.karute,
      level: memberStore?.memberEdit?.level,
      last_name: memberStore?.memberEdit?.last_name,
      first_name: memberStore?.memberEdit?.first_name,
      last_name_kana:
        memberStore?.memberEdit?.last_name_kana,
      first_name_kana:
        memberStore?.memberEdit?.first_name_kana,
      zip1:
        memberStore?.memberEdit?.zip1
          ?.toString()
          .slice(0, 3) || '',
      zip2:
        memberStore?.memberEdit?.zip1
          ?.toString()
          .slice(3, 7) || '',
      address: memberStore?.memberEdit?.address,
      building_name: memberStore?.memberEdit?.building_name,
      year:
        memberStore?.memberEdit?.year.replace(
          t('components.datepicker.year'),
          ''
        ) || '',
      month:
        memberStore?.memberEdit?.month?.replace(
          t('components.datepicker.month'),
          ''
        ) || '',
      day:
        memberStore?.memberEdit?.day?.replace(
          t('components.datepicker.day'),
          ''
        ) || '',
      age: memberStore?.memberEdit?.age,
      sex: memberStore?.memberEdit?.sex,
      tel: memberStore?.memberEdit?.tel,
      medical_history:
        memberStore?.memberEdit?.medical_history,
      memo: memberStore?.memberEdit?.memo,
      email: memberStore?.memberEdit?.email,
      group_id: memberStore?.memberEdit?.group_id,
      trainer_id: memberStore?.memberEdit?.trainer_id,
    } as IMemberEdit

    $api.member
      .update(params, id)
      .then(() => {
        alert.value = t('pages.user_edit.message_success')
        isSubmitError.value = false
        $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      })
      .catch((e) => {
        if (e.response?._data?.errors) {
          const keyError = Object.keys(
            e.response?._data?.errors
          )[0]
          alert.value =
            e.response?._data?.errors[keyError][0]
        } else {
          alert.value = 'error'
        }
        isSubmitError.value = true
        $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      })
  }

  const onCloseAlert = () => {
    const id = route.params.id
    if (isSubmitError.value) {
      router.back()
    } else {
      memberStore.memberEdit = null
      router.push(
        `/app/${userStore.roleName}/user/${id}?tab_info=2`
      )
    }
  }

  const handleBack = () => {
    router.push({
      name: `app-${userStore.roleName}-user-id-user-edit`,
    })
  }

  onBeforeMount(() => {
    const id = route.params.id
    if (!memberStore.memberEdit) {
      useRouter().replace(
        `/app/${userStore.roleName}/user/${id}/user-edit`
      )
    }
  })

  onBeforeRouteLeave((to) => {
    if (
      to.name !==
      `app-${userStore.roleName}-user-id-user-edit`
    ) {
      memberStore.memberEdit = null
    }
  })

  return {
    group,
    gender,
    avatar,
    memberStore,
    userStore,
    RoleEnum,
    ModalNameEnum,
    alert,
    groupOld,
    trainer,
    trainerOld,
    t,
    confirm,
    onCloseAlert,
    handleBack,
  }
}
