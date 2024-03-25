<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'

// composable
// const { t } = useLang()

// meta
definePageMeta({
  layout: 'page',
})

const {
  listBreadcrumbs,
  isLoading,
  getStatisticBySuperAdmin,
} = useDashboard()

onMounted(async () => {
  isLoading.value = true
  await getStatisticBySuperAdmin()
  isLoading.value = false
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 flex flex-col"
        :list-breadcrumbs="listBreadcrumbs"
      >
        <!-- <h3 class="mb-4 text-xl text-center font-medium">
          ダッシュボードページ
        </h3>
        <p class="mb-4">
          申し訳ございません。このページを開発しています。
        </p> -->
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-300px"
        />
        <PageDashboard
          v-if="!isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
