<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'page',
})

onMounted(async () => {
  isLoading.value = true
  await getPlanList()
  isLoading.value = false
})

const {
  listBreadcrumbs,
  plansData,
  isLoading,
  getPlanList,
} = usePlanList()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.plan_list')"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-300px"
        />
        <PagePlanList
          v-if="!isLoading"
          :plan-lists="plansData"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
