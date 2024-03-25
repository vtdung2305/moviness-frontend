import moment from 'moment'
import { useMember } from '@/stores/member'
import { GENDERS } from '@/constants/common'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'

export const useMemberDetail = () => {
  const memberStore = useMember()
  const route = useRoute()
  const { t } = useLang()
  const router = useRouter()
  const useStore = useUser()

  const isLoading = ref(true)
  const isAgree = ref(0)
  const isDelete = ref(false)

  const memberDetail = computed(
    () => memberStore?.memberDetail
  )

  const gender = computed(() => {
    if (memberStore.memberDetail?.sex) {
      return GENDERS[Number(memberStore.memberDetail?.sex)]
    }
    return ''
  })

  const age = computed(() => {
    return memberStore?.memberDetail?.birthday
      ? moment().diff(
          memberStore?.memberDetail?.birthday,
          'years',
          false
        ) + t('pages.user_detail.age')
      : ''
  })

  const level = computed(() => {
    if (memberStore?.memberDetail?.level === 0) {
      return t('others.no_value')
    } else {
      return memberStore?.memberDetail?.level
    }
  })

  const classBtn = computed(() => {
    return isAgree.value && !isDelete.value
      ? 'danger'
      : 'secondary'
  })

  const getMembersDetail = async () => {
    const id = route.params.id
    await memberStore.getMembersDetail(id as string)
  }

  const gotoMemberDetail = () => {
    const id = route.params.id
    router.push(
      `/app/${useStore.roleName}/user/${id}?tab_info=2`
    )
  }
  return {
    isLoading,
    memberDetail,
    gender,
    age,
    level,
    isAgree,
    isDelete,
    classBtn,
    getMembersDetail,
    gotoMemberDetail,
  }
}
