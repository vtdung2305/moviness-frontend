<script lang="ts" setup>
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const userStore = useUser()
const router = useRouter()
const { $hiddenModal } = useNuxtApp()

const logout = async () => {
  try {
    $hiddenModal(ModalNameEnum.LOGOUT)
    await userStore.logout()
    router.push(`/`)
  } catch (error) {}
}
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.LOGOUT"
    content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col gap modal-content"
  >
    <div
      class="text-22px leading-22px font-bold title text-center"
    >
      {{ $t('others.title_modal_confirm') }}
    </div>
    <div class="text-16px leading-16px sub-title">
      {{ $t('components.logout.subtitle') }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="theme"
      @click="logout"
      >{{ $t('components.logout.confirm') }}</Button
    >
    <div
      class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
      @click="$hiddenModal(ModalNameEnum.LOGOUT)"
    >
      {{ $t('components.logout.cancel') }}
    </div>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
:deep(.modal-content) {
  @media screen and (max-width: 450px) {
    padding: 32px;
  }
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
