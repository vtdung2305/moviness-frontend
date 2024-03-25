<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { MenuItemBase } from '@/interfaces/menu'
import { useMember } from '@/stores/member'
import { GENDERS } from '@/constants/common'
import { useGroup } from '@/stores/group'
import { ModalNameEnum } from '@/constants/modal'
import { IMemberRegister } from '@/interfaces/member'

definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.user',
    route: { name: 'app-kanrisha-user' },
  },
  {
    text: 'components.menu.user_registration',
    route: {
      name: 'app-kanrisha-user-registration-confirmation',
    },
  },
]
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="
          $t('pages.user_registration.confirm_title')
        "
      >
        <div class="laptop:w-3/4">
          <FormUserRegistrationConfirmation />
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss" scoped></style>
