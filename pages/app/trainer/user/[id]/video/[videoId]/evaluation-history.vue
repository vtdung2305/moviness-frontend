<script setup lang="ts">
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'

// composable
const { t } = useLang()

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.user_list',
    route: { name: 'app-trainer-user' },
  },
  {
    text: 'components.menu.user_detail',
    route: { name: 'app-trainer-user-id' },
  },
  {
    text: 'components.menu.user_evaluation_history',
    route: { name: '' },
  },
]

// meta
definePageMeta({
  layout: 'page',
})

const {
  isLoading,
  videoDetail,
  getMembersDetail,
  getVideoDetail,
  getEvaluationHistories,
  getLastEvaluationHistories,
} = useUserEvaluation()

onMounted(async () => {
  isLoading.value = true
  await getMembersDetail()
  await getVideoDetail()
  await getEvaluationHistories()
  await getLastEvaluationHistories()
  isLoading.value = false
})
</script>
<template>
  <PageWrapper class="">
    <PageBody class="">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="isLoading ? '' : videoDetail?.name"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.TRAINER"
          class="h-300px"
        />
        <PageUserEvaluationHistory
          v-if="!isLoading"
          :theme="RoleEnum.TRAINER"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss"></style>
