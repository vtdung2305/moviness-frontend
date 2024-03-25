<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'page',
})

const { listBreadcrumbs, plansData, videoList, isLoading } =
  usePlanDetail()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.plan_detail')"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-300px"
        />
        <PagePlanDetail
          v-if="!isLoading"
          :plan-detail="plansData"
          :video-list="videoList"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
