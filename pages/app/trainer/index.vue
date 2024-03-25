<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'

// composable
// const { t } = useLang()

// meta
definePageMeta({
  layout: 'page',
})

const { listBreadcrumbs, isLoading, getTrainerStatistic } =
  useDashboard()

onMounted(async () => {
  isLoading.value = true
  await getTrainerStatistic()
  isLoading.value = false
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
      >
        <!-- <div>
          <h3 class="mb-4 text-xl text-center font-medium">
            ダッシュボードページ
          </h3>
          <p class="mb-4">
            申し訳ございません。このページを開発しています。
          </p>
        </div> -->
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.TRAINER"
          class="h-300px"
        />
        <PageDashboard
          v-if="!isLoading"
          :theme="RoleEnum.TRAINER"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
