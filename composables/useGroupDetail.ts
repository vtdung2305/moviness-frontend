import { useGroup } from '@/stores/group'
import { useUser } from '@/stores/user'
import { ImageDefaultEnum } from '@/constants/image'

export const useGroupDetail = () => {
  const userStore = useUser()
  const groupStore = useGroup()
  const route = useRoute()
  const router = useRouter()
  const { t } = useLang()
  const { getFullName, formatDate } = useHelper()

  const currentPage = ref(1)
  const groupData = ref()
  const users = ref()
  const meta = ref()
  const isLoadingPage = ref(false)

  const infors = computed(() => {
    let createdAt = ''
    let updatedAt = ''
    const yearStr = t('pages.group_detail.year')
    const monthStr = t('pages.group_detail.month')
    const dayStr = t('pages.group_detail.day')
    const created: string = groupData.value?.created_at
    if (created) {
      createdAt = formatDate(created)
    } else {
      createdAt = t('others.empty')
    }
    const updated = groupData.value?.updated_at
    if (updated) {
      updatedAt = formatDate(updated)
    } else {
      updatedAt = t('others.empty')
    }
    return [
      {
        label: t('pages.group_detail.group_name'),
        value: groupData.value?.name || t('others.empty'),
      },
      {
        label: t('pages.group_detail.group_content'),
        value:
          groupData.value?.content || t('others.empty'),
      },
      {
        label: t('pages.group_detail.author'),
        value:
          getFullName(
            groupData.value?.created_by?.last_name,
            groupData.value?.created_by?.first_name
          ) || t('others.empty'),
      },
      {
        label: t('pages.group_detail.created_date'),
        value: createdAt,
      },
      {
        label: t('pages.group_detail.last_updated'),
        value: updatedAt,
      },
    ]
  })

  const groupImage = computed(() => {
    const imageDefault =
      ImageDefaultEnum.IMAGE_GROUP_DEFAULT
    return groupData.value?.image
      ? groupData.value?.url_image
      : imageDefault
  })

  const trainerImage = computed(() => {
    const imageDefault =
      ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
    return groupData.value?.trainer?.avatar
      ? groupData.value?.trainer?.url_avatar
      : imageDefault
  })

  const inforsTrainer = computed(() => {
    return [
      {
        label: t('pages.group_detail.trainer_name'),
        value:
          getFullName(
            groupData.value?.trainer?.last_name,
            groupData.value?.trainer?.first_name
          ) || t('others.empty'),
      },
      {
        label: t('pages.group_detail.mail_address'),
        value:
          groupData.value?.trainer?.email ||
          t('others.empty'),
      },
    ]
  })

  const infoList = computed(() => {
    const people = t('pages.group_detail.people')
    const male = t('pages.group_detail.male')
    const woman = t('pages.group_detail.woman')
    const noSet = t('pages.group_detail.no_set')
    const total = groupData.value?.total_member || 0
    const numMale = groupData.value?.total_member_male || 0
    const numFemale =
      groupData.value?.total_member_female || 0
    const numOther =
      groupData.value?.total_member_unknow || 0
    const currentShow =
      meta.value?.from && meta.value?.to
        ? meta.value?.to - meta.value?.from + 1
        : 0
    return `${currentShow}${people}/${total}${people}（${male}:${numMale}${people} ${woman}:${numFemale}${people} ${noSet}:${numOther}${people}）`
  })

  const idUser = computed(() => userStore.userData?.id)

  const textInfoTrainer = computed(() => {
    return idUser.value === groupData.value?.trainer_id
      ? t('pages.group_detail.self_charge')
      : ''
  })

  const groupId = computed(() => {
    return route.params?.id || ''
  })

  const getDataDetail = async () => {
    try {
      isLoadingPage.value = true
      const id = route.params.id
      const res = await groupStore.getDetail(id as string)
      if (res && res.data) {
        groupData.value = res.data
        getListMembers()
      } else {
        router.push('/404')
      }
      isLoadingPage.value = false
    } catch (e) {
      router.push('/404')
    }
  }

  const getListMembers = async () => {
    try {
      const id = route.params.id
      const res = await groupStore.getListMembers(
        id as string,
        currentPage.value
      )
      if (res && res.data && res.data.data) {
        users.value = res.data.data
        meta.value = res.data.meta
      }
    } catch (e) {}
  }

  const handleDelete = () => {
    router.push({
      name: `app-${userStore.roleName}-group-id-delete`,
      params: { id: groupId.value },
    })
  }

  onMounted(() => {
    getDataDetail()
  })

  watch(currentPage, async () => {
    isLoadingPage.value = true
    await getListMembers()
    isLoadingPage.value = false
  })

  return {
    currentPage,
    groupData,
    users,
    meta,
    infors,
    inforsTrainer,
    textInfoTrainer,
    infoList,
    isLoadingPage,
    groupId,
    groupImage,
    trainerImage,
    handleDelete,
  }
}
