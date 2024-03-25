<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'

// meta
definePageMeta({
  layout: 'page',
})

const {
  sortList,
  listBreadcrumbs,
  filter,
  videosData,
  isLoading,
  meta,
  onPageChange,
  onFilter,
  onOrder,
} = useVideoList()
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 flex flex-col"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.shinseido.video.title')"
      >
        <div class="section-search flex mobile:gap-8 gap-2">
          <FormTextInput
            v-model="filter.keyword"
            icon="icon-search"
            class-input="pl-12"
            class="flex-1 desktop:max-w-584px"
            :placeholder="
              $t(
                'components.search_filter.placeholder_keyword'
              )
            "
          />
          <Button
            :theme="RoleEnum.ADMINISTRANTOR"
            type="primary"
            class="mobile:w-37 w-30 text-xl desktop:w-276px"
            @click="onFilter()"
            >{{ $t('components.button.search') }}</Button
          >
        </div>
        <div
          class="section-order flex mt-4 mb-9 gap-4 flex-wrap"
        >
          <Button
            v-for="(item, index) in sortList"
            :key="index"
            :theme="RoleEnum.ADMINISTRANTOR"
            :type="
              item === filter.orderName
                ? 'primary'
                : 'outline'
            "
            class="button-order rounded-xl w-max h-30px px-4 text-14px border-2 border-transparent"
            @click="onOrder(item)"
            >{{ $t('pages.group_list.' + item) }}</Button
          >
        </div>
        <div class="relative">
          <HeaderLists
            :number-subject="meta?.total || 0"
            :total-subject="meta?.total || 0"
            :min-page="meta?.from || 0"
            :max-page="meta?.to || 0"
          />
          <template v-if="!isLoading">
            <template
              v-if="videosData && videosData.length"
            >
              <div
                class="wrap grid grid-cols-1 desktop:grid-cols-1 gap-8"
              >
                <VideoItem
                  v-for="(item, index) in videosData"
                  :key="index"
                  :video-data="item"
                />
              </div>
              <Pagination
                v-if="meta && meta?.total > 10"
                :current-page="filter.page"
                :total-items="meta?.total"
                :per-page="10"
                class="mt-55px"
                :theme="RoleEnum.ADMINISTRANTOR"
                @page-changed="onPageChange"
              />
            </template>
            <div
              v-else
              class="w-full h-300px flex items-center justify-center"
            >
              {{ $t('pages.group_detail.no_data') }}
            </div>
          </template>
          <Loading
            v-if="isLoading"
            :theme="RoleEnum.ADMINISTRANTOR"
            class="absolute w-full h-300px top-0 left-0"
          />
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scope lang="scss">
.wrap {
  gap: 25px;
}

.section-order {
  gap: 7px;

  a {
    padding: 0 9px;

    &:last-child {
      padding: 0 13px;
    }
  }
}

.section-search {
  input {
    max-height: 56px !important;
  }

  a {
    height: 56px !important;
  }
}
</style>
