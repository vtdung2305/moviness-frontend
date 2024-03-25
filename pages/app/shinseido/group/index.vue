<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'
definePageMeta({
  layout: 'page',
})

const {
  statusList,
  trainerList,
  sortList,
  listBreadcrumbs,
  currentPage,
  filter,
  groupsData,
  meta,
  isLoadingData,
  getFilter,
  sort,
  handleViewDetailGroup,
  getTrainerSuperAdmin,
} = useGroupList()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.group_list.title')"
      >
        <div
          class="flex mobile:gap-8 gap-2 desktop:max-w-584px <mobile:flex-col"
        >
          <Dropdown
            v-model="filter.status"
            :label="$t('pages.group_list.status')"
            :text-button="
              $t('pages.group_list.empty_select')
            "
            :items="statusList"
            class="flex-1"
          />
          <Dropdown
            v-model="filter.trainer"
            :label="$t('pages.group_list.trainer_name')"
            :text-button="
              $t('pages.group_list.empty_select')
            "
            :object-item="trainerList"
            class="flex-1 filter-item"
            @loadmore="getTrainerSuperAdmin"
          />
        </div>
        <div
          class="flex mt-4 mobile:gap-8 gap-2 <mobile:flex-col"
        >
          <FormTextInput
            v-model="filter.groupName"
            class="flex-1 desktop:max-w-584px"
            icon="icon-search"
            class-input="pl-12"
            :placeholder="
              $t('pages.group_list.placeholder_search')
            "
          />
          <Button
            :theme="RoleEnum.ADMINISTRANTOR"
            type="primary"
            :is-disabled="isLoadingData"
            class="mobile:w-37 w-30 text-xl desktop:w-276px <mobile:w-full"
            @click="getFilter()"
          >
            {{ $t('components.button.search') }}
          </Button>
        </div>
        <div class="relative">
          <div
            class="flex mt-4 mb-11 gap-4 flex-wrap <mobile:mb-4"
          >
            <Button
              v-for="(item, index) in sortList"
              :key="index"
              :theme="RoleEnum.ADMINISTRANTOR"
              :type="
                item === filter.sortBy
                  ? 'primary'
                  : 'outline'
              "
              class="rounded-xl w-max h-30px px-4 text-14px"
              @click="sort(item)"
            >
              {{ $t('pages.group_list.' + item) }}
            </Button>
          </div>
          <HeaderLists
            :number-subject="meta?.total || 0"
            :total-subject="meta?.total || 0"
            :min-page="meta?.from || 0"
            :max-page="meta?.to || 0"
          />
          <Loading
            v-if="isLoadingData"
            :theme="RoleEnum.ADMINISTRANTOR"
            class="absolute w-full h-300px top-0 left-0"
          />
          <template
            v-else-if="groupsData && groupsData.length"
          >
            <div
              class="grid grid-cols-1 desktop:grid-cols-2 gap-8 <sm:gap-4"
            >
              <GroupCard
                v-for="(item, index) in groupsData"
                :key="index"
                class="cursor-pointer"
                :group="item"
                @click="handleViewDetailGroup(item.id)"
              />
            </div>
            <Pagination
              v-if="meta?.last_page && meta?.last_page > 1"
              :current-page="currentPage"
              :total-items="meta?.total || 0"
              :per-page="10"
              class="mt-55px"
              :theme="RoleEnum.ADMINISTRANTOR"
              @page-changed="currentPage = $event"
            />
          </template>
          <div
            v-else
            class="w-full h-300px flex items-center justify-center"
          >
            {{ $t('pages.group_detail.no_data') }}
          </div>
        </div>
        <ModalMessage
          :id="ModalNameEnum.ALERT_MANY_REQUEST"
          :theme="RoleEnum.ADMINISTRANTOR"
          :message="$t('others.many_request_title')"
          :sub-message="$t('others.many_request_message')"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.filter-item {
  width: calc((100% - 32px) / 2);

  @media (max-width: 425px) {
    width: 100%;
  }
}
</style>
