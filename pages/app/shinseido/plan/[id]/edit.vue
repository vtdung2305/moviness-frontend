<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
// composable
// const { t } = useLang()

// meta
definePageMeta({
  layout: 'page',
})

const router = useRouter()

onMounted(async () => {
  isLoading.value = true

  const forwardUrl: string | null | any =
    router.options.history.state.forward
  const backUrl: string | null | any =
    router.options.history.state.back
  if (
    plansData.value &&
    ((forwardUrl &&
      forwardUrl.includes('edit-confirmation' as string)) ||
      (backUrl &&
        backUrl.includes('edit-confirmation' as string)))
  ) {
    setTimeout(() => {
      isLoading.value = false
    }, 200)
  } else {
    await getPlanDetail()
    await getVideoListByPlan()
    await getVideoList()
    isLoading.value = false
  }
})

const {
  listBreadcrumbs,
  plansData,
  videoList,
  isLoading,
  getPlanDetail,
  getVideoListByPlan,
  getVideoList,
} = usePlanEdit()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('components.menu.plan_edit')"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="h-300px"
        />
        <PagePlanEdit
          v-if="!isLoading && plansData"
          :plan-detail="plansData"
          :video-list="videoList"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
