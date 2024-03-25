<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'

definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.change_password',
    route: { name: '' },
  },
]
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.change_password')"
      >
        <div class="desktop:w-3/4">
          <FormChangePassword :theme="RoleEnum.ADMIN" />
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
