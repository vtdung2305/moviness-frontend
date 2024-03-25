<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

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
    route: { name: 'app-kanrisha-plan' },
  },

  {
    text: 'components.menu.plan_detail',
    route: { name: '' },
  },
]

const router = useRouter()
const { $hiddenModal, $showModal } = useNuxtApp()

const gotoSetting = () => {
  router.push('/app/kanrisha/setting/?tab_info=2')
}

onMounted(async () => {
  isLoading.value = true
  await getPlanDetail()
  await getFacilityById()
  await getFacilityStatistic()
  isLoading.value = false
  if (hasPlanNeedUpgrade.value) {
    $showModal(ModalNameEnum.MESSAGE)
  }

  if (msgDownGrade.value) {
    await $showModal(ModalNameEnum.DOWNGRADE_ALERT)
  }
})

const { plansData, videoList, isLoading, getPlanDetail } =
  usePlanEdit()

const { getFacilityById } = useFacilityDetail()

const { getFacilityStatistic } = useDashboard()

const { hasPlanNeedUpgrade } = useSetting()

const { msgDownGrade } = usePlanUpgrade()
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
          :theme="RoleEnum.ADMIN"
          class="h-300px"
        />
        <PagePlanUpgrade
          v-if="!isLoading"
          :plan-detail="plansData"
          :video-list="plansData?.videos"
        />
      </PageSection>

      <!-- Show modal alert when facility has plan upgrade processing -->
      <ModalMessage
        :id="ModalNameEnum.MESSAGE"
        :message="$t('others.title_modal_common')"
        :sub-message="
          $t('pages.setting.msg_processing_plan')
        "
        :button-submit="$t('components.button.close')"
        :theme="RoleEnum.ADMIN"
        @click-submit="gotoSetting"
      />
      <!--End-->

      <!-- Show modal alert when plan not downgrade -->
      <ModalMessage
        :id="ModalNameEnum.DOWNGRADE_ALERT"
        :message="$t('others.title_modal_common')"
        :sub-message="msgDownGrade"
        :button-submit="$t('components.button.close')"
        :theme="RoleEnum.ADMIN"
      />
      <!--End-->
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
