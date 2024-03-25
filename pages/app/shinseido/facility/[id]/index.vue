<script setup lang="ts">
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'

// meta
definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.facitily',
    route: { name: 'app-shinseido-facility' },
  },

  {
    text: 'components.menu.facility_detail',
    route: { name: '' },
  },
]

onMounted(async () => {
  isLoading.value = true
  await getFacilityById()
  await getPlanHistoriesByFacility()
  isLoading.value = false
})

const {
  isLoading,
  getFacilityById,
  getPlanHistoriesByFacility,
} = useFacilityDetail()
</script>

<template>
  <PageWrapper class="">
    <PageBody>
      <PageSection
        class="w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.facility_detail')"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-300px"
        />
        <PageFacilityDetail v-if="!isLoading" />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss"></style>
