<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
definePageMeta({
  layout: 'page',
})

const listBreadcrumbs = ref<MenuItemBase[]>([
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.user_list',
    route: { name: 'app-shinseido-user' },
  },
  {
    text: 'components.menu.user_detail',
    route: { name: '' },
  },
])

const router = useRouter()

onMounted(() => {
  const fromLink: string | any =
    router.options?.history?.state?.back || null
  const groupId = fromLink
    ? fromLink.split('/').pop()
    : null
  if (fromLink && fromLink.includes('/group')) {
    listBreadcrumbs.value = []
    listBreadcrumbs.value = [
      {
        text: 'components.menu.home',
        route: { name: 'index' },
      },
      {
        text: 'components.menu.group_list',
        route: { name: 'app-shinseido-group' },
      },
      {
        text: 'components.menu.group_detail',
        route: { path: `/app/shinseido/group/${groupId}` },
      },
      {
        text: 'components.menu.user_detail',
        route: { name: '' },
      },
    ]
  }
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.user_detail')"
      >
        <PageUserVideoList
          :theme="RoleEnum.ADMINISTRANTOR"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<!-- <style scoped lang="scss">
:deep(.page-section__title) {
  margin-bottom: 31px;
}
</style> -->
