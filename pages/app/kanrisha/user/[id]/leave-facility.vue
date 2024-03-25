<script setup lang="ts">
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

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
    route: { name: 'app-kanrisha-user' },
  },
  {
    text: 'components.menu.user_detail',
    route: { name: 'app-kanrisha-user-id' },
  },
  {
    text: 'components.menu.user_delete',
    route: { name: '' },
  },
])

onMounted(async () => {
  isLoading.value = true
  await getMembersDetail()
  isLoading.value = false
})

const { isLoading, getMembersDetail } = useMemberDetail()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full relative"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.user_delete.heading')"
      >
        <Loading
          v-if="isLoadingPage"
          :theme="RoleEnum.ADMIN"
          class="absolute w-screen h-screen top-0 left-0"
        />
        <PageLeaveFacility
          v-else
          :theme="RoleEnum.ADMIN"
        ></PageLeaveFacility>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
