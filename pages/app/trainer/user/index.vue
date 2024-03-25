<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
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
    text: 'components.menu.user_list',
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
        :title-page="$t('components.menu.user_list')"
      >
        <PageUserList :theme="RoleEnum.TRAINER" />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
:deep(.page-section__title) {
  margin-bottom: 38px;
  margin-top: 20px;
}
</style>
