<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'

const route = useRoute()

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
    route: { name: 'app-trainer-user' },
  },
  {
    text: 'components.menu.user_detail',
    route: {
      name: 'app-trainer-user-id',
      params: { id: route.params.id },
    },
  },
  {
    text: 'components.menu.user_edit',
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
        :title-page="$t('pages.user_edit.title')"
      >
        <div class="desktop:w-3/4">
          <FormUserEdit />
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
<style lang="scss" scoped></style>
