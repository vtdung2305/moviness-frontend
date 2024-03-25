<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
// composable
// const { t } = useLang()

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
    text: 'components.menu.plan_list',
    route: { name: 'app-shinseido-plan' },
  },

  {
    text: 'components.menu.plan_detail',
    route: { name: 'app-shinseido-plan-id' },
  },

  {
    text: 'components.menu.plan_edit',
    route: { name: 'app-shinseido-plan-id-edit' },
  },

  {
    text: 'components.menu.plan_confirm',
    route: { name: '' },
  },
]

const { plansData, videoList } = usePlanEdit()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.plan_confirm')"
      >
        <!-- <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-300px"
        /> -->
        <PagePlanEditConfirmation
          v-if="!isLoading"
          :plan-detail="plansData"
          :video-list="videoList"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
