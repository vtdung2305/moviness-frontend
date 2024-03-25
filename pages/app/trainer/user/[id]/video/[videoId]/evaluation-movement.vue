<script setup lang="ts">
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'

// composable
const { t } = useLang()

const listBreadcrumbs = ref<MenuItemBase[]>([
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
    text: 'components.menu.user_evaluation_movement',
    route: { name: '' },
  },
])

// meta
definePageMeta({
  layout: 'page',
})

const {
  isLoading,
  videoDetail,
  hasEdit,
  getMembersDetail,
  getVideoDetail,
  getEvaluationByDate,
} = useUserEvaluation()

onMounted(async () => {
  isLoading.value = true
  await getMembersDetail()
  await getVideoDetail()
  await getEvaluationByDate()
  if (hasEdit.value) {
    listBreadcrumbs.value[3].text =
      'pages.evaluation_movement.rating_input_edit'
  }
  isLoading.value = false
})
</script>
<template>
  <PageWrapper class="">
    <PageBody class="">
      <PageSection
        v-if="!isLoading"
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="isLoading ? '' : videoDetail?.name"
      >
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.TRAINER"
          class="h-300px"
        />
        <PageUserEvaluationMovement
          v-if="!isLoading"
          :theme="RoleEnum.TRAINER"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss"></style>
