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
    route: { name: 'app-kanrisha-user' },
  },
  {
    text: 'components.menu.user_detail',
    route: { name: 'app-kanrisha-user-id' },
  },
  {
    text: 'components.menu.user_evaluation_movement',
    route: { name: '' },
  },
]

// meta
definePageMeta({
  layout: 'page',
})

const {
  isLoading,
  getMembersDetail,
  getVideoDetail,
  getEvaluationByDate,
} = useUserEvaluation()

onMounted(async () => {
  isLoading.value = true
  await getMembersDetail()
  await getVideoDetail()
  await getEvaluationByDate()
  isLoading.value = false
})
</script>
<template>
  <PageWrapper class="">
    <PageBody class="">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="
          $t('components.menu.user_evaluation_movement')
        "
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.ADMIN"
          class="h-300px"
        />
        <PageUserEvaluationMovement
          v-if="!isLoading"
          :theme="RoleEnum.ADMIN"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss"></style>
