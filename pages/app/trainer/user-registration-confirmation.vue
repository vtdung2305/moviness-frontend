<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { MenuItemBase } from '@/interfaces/menu'

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
    route: { name: 'app-trainer-user' },
  },
  {
    text: 'components.menu.user_registration',
    route: {
      name: 'app-trainer-user-registration-confirmation',
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
        <FormUserRegistrationConfirmation />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss" scoped></style>
