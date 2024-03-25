<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { MenuItemBase } from '@/interfaces/menu'
import { useTrainer } from '@/stores/trainer'
import { ModalNameEnum } from '@/constants/modal'

// composable
const { t } = useLang()
const { $showModal } = useNuxtApp()
const router = useRouter()
const trainerStore = useTrainer()
const { getFullName } = useHelper()
const { uploadFile } = useUpload()

// compiler macro
definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_registration',
    route: { name: '' },
  },
]

const messageRessultCreateTrainer = ref('')
const isSubmit = ref(false)
const isLoadingData = ref(false)

const typeBtn = computed(() => {
  return isSubmit.value ? 'secondary' : 'primary'
})

const trainerCreateData = computed(
  () => trainerStore.trainerCreateData
)
const previewImage = computed(() => {
  if (trainerCreateData.value?.fileAvatar) {
    return URL.createObjectURL(
      trainerCreateData.value.fileAvatar
    )
  }
  return ''
})
const birthday = computed(
  () =>
    `${trainerCreateData.value?.year}${trainerCreateData.value?.month}${trainerCreateData.value?.day}`
)
const address = computed(() => {
  if (trainerCreateData.value?.postCode) {
    return `${t(
      'pages.trainer_registration_confirmation.address_symbol'
    )}${trainerCreateData.value?.postCode
      ?.toString()
      .slice(0, 3)}-${trainerCreateData.value?.postCode
      ?.toString()
      .slice(3, 7)}\n${trainerCreateData.value?.address} ${
      trainerCreateData.value?.buildingName
    }`
  }
  return t('others.empty')
})
const infors = computed(() => {
  return [
    {
      label: t(
        'pages.trainer_registration_confirmation.email'
      ),
      value:
        trainerCreateData.value?.email || t('others.empty'),
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.name'
      ),
      value: getFullName(
        trainerCreateData.value?.lastname,
        trainerCreateData.value?.firstname
      ),
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.name_kana'
      ),
      value: getFullName(
        trainerCreateData.value?.lastnameKana,
        trainerCreateData.value?.firstnameKana
      ),
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.address'
      ),
      value: address.value,
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.birthday'
      ),
      value: birthday.value,
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.gender'
      ),
      value:
        trainerCreateData.value?.gender ||
        t('others.gender_others'),
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.mobile_phone'
      ),
      value:
        trainerCreateData.value?.mobilePhone ||
        t('others.empty'),
    },
    {
      label: t(
        'pages.trainer_registration_confirmation.remarks'
      ),
      value:
        trainerCreateData.value?.remarks ||
        t('others.empty'),
    },
  ]
})

const contentDialogConfirm = computed(() => {
  return t(
    'pages.trainer_registration_confirmation.content_dialog_confirm',
    { email: trainerCreateData.value?.email }
  )
})

const handleBackEdit = () => {
  trainerStore.setEdit(true)
  router.push({ name: 'app-kanrisha-trainer-registration' })
}

const handleSubmit = () => {
  $showModal(ModalNameEnum.CONFIRM_CREATE_TRAINER)
}

const handleSubmitCreate = async () => {
  isSubmit.value = true
  isLoadingData.value = true
  try {
    let imageUrl = ''
    if (trainerCreateData.value?.fileAvatar) {
      imageUrl = await uploadFile(
        trainerCreateData.value?.fileAvatar
      )
      if (imageUrl === 'ERROR') {
        imageUrl = ''
        messageRessultCreateTrainer.value = t(
          'others.upload_error'
        )
        $showModal(ModalNameEnum.MESSAGE_CREATE_TRAINER)
        isLoadingData.value = false
        return
      }
    }
    const year =
      trainerCreateData.value?.year?.replace(
        t('components.datepicker.year'),
        ''
      ) || ''
    const month =
      trainerCreateData.value?.month?.replace(
        t('components.datepicker.month'),
        ''
      ) || ''
    const day =
      trainerCreateData.value?.day?.replace(
        t('components.datepicker.day'),
        ''
      ) || ''
    let sex = 0
    switch (trainerCreateData.value?.gender) {
      case t('pages.trainer_registration.male'):
        sex = 1
        break
      case t('pages.trainer_registration.female'):
        sex = 2
        break
      default:
        sex = 0
    }
    const params = {
      avatar: imageUrl,
      email: trainerCreateData.value?.email || '',
      first_name: trainerCreateData.value?.firstname || '',
      last_name: trainerCreateData.value?.lastname || '',
      first_name_kana:
        trainerCreateData.value?.firstnameKana || '',
      last_name_kana:
        trainerCreateData.value?.lastnameKana || '',
      zip1:
        trainerCreateData.value?.postCode
          ?.toString()
          .slice(0, 3) || '',
      zip2:
        trainerCreateData.value?.postCode
          ?.toString()
          .slice(3, 7) || '',
      address: trainerCreateData.value?.address || '',
      building_name:
        trainerCreateData.value?.buildingName || '',
      year,
      month,
      day,
      sex,
      tel: trainerCreateData.value?.mobilePhone || '',
      memo: trainerCreateData.value?.remarks || '',
    }
    const res = await trainerStore.create(params)
    if (res && res.data) {
      messageRessultCreateTrainer.value = t(
        'pages.trainer_registration_confirmation.created_account'
      )
    }
    isLoadingData.value = false
    $showModal(ModalNameEnum.MESSAGE_CREATE_TRAINER)
  } catch (e: any) {
    if (e.response?._data?.errors) {
      trainerStore.setErrors(e.response?._data?.errors)
      handleBackEdit()
    } else {
      messageRessultCreateTrainer.value =
        e.response?._data?.message || ''
      $showModal(ModalNameEnum.MESSAGE_CREATE_TRAINER)
    }
    isLoadingData.value = false
  }
}

onMounted(() => {
  if (!trainerCreateData.value?.email) {
    router.push({
      name: 'app-kanrisha-trainer-registration',
    })
  }
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="
          $t(
            'pages.trainer_registration_confirmation.title'
          )
        "
      >
        <div class="trainer-confirmation laptop:w-3/4">
          <CommonInfo
            :src-img="previewImage"
            :infors="infors"
            class="mt-9"
          />
          <div
            class="text-base leading-21px font-medium mt-37px"
          >
            {{
              $t(
                'pages.trainer_registration_confirmation.note'
              )
            }}
          </div>
          <div
            class="registration-confirmation__action flex gap-x-8"
          >
            <Button
              type="outline"
              :theme="RoleEnum.ADMIN"
              class="mt-3.5"
              @click="handleBackEdit"
            >
              {{ $t('components.button.edit') }}
            </Button>
            <Button
              :type="typeBtn"
              :theme="RoleEnum.ADMIN"
              class="mt-3.5"
              :class="{ disabled: isSubmit }"
              @click="handleSubmit"
            >
              {{ $t('components.button.register') }}
            </Button>
          </div>
        </div>
        <ModalMessage
          :id="ModalNameEnum.CONFIRM_CREATE_TRAINER"
          :message="$t('others.title_modal_confirm')"
          :sub-message="contentDialogConfirm"
          :theme="RoleEnum.ADMIN"
          button-cancel="components.button.cancel"
          button-submit="components.button.create"
          @click-submit="handleSubmitCreate"
        />
        <ModalMessage
          :id="ModalNameEnum.MESSAGE_CREATE_TRAINER"
          :message="$t('others.title_modal_common')"
          :sub-message="messageRessultCreateTrainer"
          :theme="RoleEnum.ADMIN"
          :route="{ name: 'app-kanrisha-trainer' }"
        />
        <Loading
          v-if="isLoadingData"
          :theme="RoleEnum.ADMIN"
          class="fixed w-full h-500px top-0 left-0"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
<style scoped lang="scss">
.disabled {
  pointer-events: none;
  touch-action: none;
}
</style>
