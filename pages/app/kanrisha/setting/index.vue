<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
// composable
// const { t } = useLang()

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.setting',
    route: { name: '' },
  },
]

// meta
definePageMeta({
  layout: 'page',
})

onMounted(async () => {
  isLoading.value = true
  await getFacilityById()
  await getPlanHistoriesByFacility()
  await getFacilityStatistic()
  isLoading.value = false
})

const {
  isLoading,
  getFacilityById,
  getPlanHistoriesByFacility,
} = useSetting()

const { getFacilityStatistic } = useDashboard()
</script>

<template>
  <PageWrapper class="">
    <PageBody class="">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.setting')"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMIN"
          class="h-300px"
        />
        <PageSetting v-if="!isLoading" />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
