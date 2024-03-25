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

const router = useRouter()
const { $hiddenModal, $showModal } = useNuxtApp()

const gotoSetting = () => {
  router.push('/app/kanrisha/setting/?tab_info=2')
}

onMounted(async () => {
  isLoading.value = true
  await getPlanList()
  await getFacilityById()
  isLoading.value = false
  // if (hasPlanNeedUpgrade.value) {
  //   $showModal(ModalNameEnum.MESSAGE)
  // }
})

const {
  listBreadcrumbs,
  plansData,
  isLoading,
  getPlanList,
} = usePlanList()

const { hasPlanNeedUpgrade } = useSetting()

const { getFacilityById } = useFacilityDetail()
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
          :theme="RoleEnum.ADMIN"
          class="h-300px"
        />
        <div v-if="!isLoading" class="desc -mt-4px pb-10px">
          <p class="font-medium leading-24px">
            {{ $t('pages.plan_list.desc1') }}<br />{{
              $t('pages.plan_list.desc2')
            }}
          </p>
        </div>
        <PagePlanList
          v-if="!isLoading"
          :plan-lists="plansData"
          :theme="RoleEnum.ADMIN"
        />

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
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
