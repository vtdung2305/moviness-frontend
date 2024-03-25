import { ModalNameEnum } from '@/constants/modal'
import { useGroup } from '@/stores/group'

export const useGroupDelete = () => {
  const { t } = useLang()
  const { $showModal } = useNuxtApp()
  const groupStore = useGroup()

  const isAgree = ref(0)
  const isDelete = ref(false)
  const isLoadingDelete = ref(false)
  const messageRessultDeleteGroup = ref('')
  const classBtn = computed(() => {
    return isAgree.value && !isDelete.value
      ? 'danger'
      : 'secondary'
  })

  const handleShowModalConfirm = () => {
    $showModal(ModalNameEnum.CONFIRM_DELETE_GROUP)
  }

  const handleSubmitDelete = async (id: string) => {
    isDelete.value = true
    isLoadingDelete.value = true
    const res = await groupStore.delete(id)
    if (res && res.data) {
      messageRessultDeleteGroup.value = t(
        'pages.group_delete.deleted_the_group'
      )
    } else {
      messageRessultDeleteGroup.value =
        res.response?._data?.message || ''
    }
    isLoadingDelete.value = false
    $showModal(ModalNameEnum.MESSAGE_DELETE_GROUP)
  }

  return {
    isAgree,
    isDelete,
    classBtn,
    isLoadingDelete,
    messageRessultDeleteGroup,
    handleShowModalConfirm,
    handleSubmitDelete,
  }
}
