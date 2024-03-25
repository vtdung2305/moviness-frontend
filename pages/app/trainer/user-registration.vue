<script lang="ts" setup>
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
    text: 'components.menu.user_registration',
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
        :title-page="$t('pages.user_registration.title')"
      >
        <div class="laptop:w-3/4">
          <FormUserRegistration />
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
<style lang="scss" scoped>
:deep(.page-section__title) {
  margin-top: 20px;
}
</style>
