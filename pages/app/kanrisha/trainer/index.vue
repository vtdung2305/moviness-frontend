<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'

definePageMeta({
  layout: 'page',
})

const {
  statusList,
  sortList,
  listBreadcrumbs,
  listTrainer,
  filter,
  currentPage,
  inputRef,
  metaTrainer,
  isLoadingData,
  sort,
  getInput,
} = useTrainerList()

const userStore = useUser()
const router = useRouter()

const handleViewDetailTrainer = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/trainer/${id}`)
}
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1 w-full"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.trainer_list.title')"
      >
        <div
          class="flex mobile:gap-8 gap-2 desktop:max-w-584px <mobile:flex-col"
        >
          <Dropdown
            v-model="filter.status as any"
            :label="$t('pages.group_list.status')"
            :text-button="$t('pages.shinseido.filter.all')"
            :object-item="statusList"
            class="flex-1"
          />
        </div>
        <div
          class="flex mt-4 mobile:gap-8 gap-2 <mobile:flex-col"
        >
          <FormTextInput
            v-model="inputRef"
            class="flex-1 desktop:max-w-584px"
            icon="icon-search"
            class-input="pl-12"
            :placeholder="
              $t('pages.group_list.placeholder_search')
            "
          />
          <Button
            :theme="RoleEnum.ADMIN"
            type="primary"
            class="mobile:w-37 w-30 text-xl desktop:w-276px <mobile:w-full"
            @click="getInput"
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
              :theme="RoleEnum.ADMIN"
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
          <div>
            <HeaderLists
              :number-subject="metaTrainer?.total || 0"
              :total-subject="metaTrainer?.total || 0"
              :min-page="metaTrainer?.from || 0"
              :max-page="metaTrainer?.to || 0"
            />
            <template v-if="!isLoadingData">
              <template
                v-if="listTrainer && listTrainer.length > 0"
              >
                <div
                  class="grid grid-cols-1 desktop:grid-cols-2 gap-8"
                >
                  <TrainerCard
                    v-for="(item, index) in listTrainer"
                    :key="index"
                    class="cursor-pointer"
                    :trainer="item"
                    @click="
                      handleViewDetailTrainer(item.id)
                    "
                  />
                </div>
                <Pagination
                  v-if="
                    metaTrainer?.total &&
                    metaTrainer?.total > 10 &&
                    metaTrainer?.last_page &&
                    metaTrainer?.last_page > 0
                  "
                  :current-page="currentPage"
                  :total-items="metaTrainer?.total || 0"
                  :per-page="10"
                  class="mt-55px"
                  :theme="RoleEnum.ADMIN"
                  @page-changed="currentPage = $event"
                />
              </template>
              <div
                v-else
                class="w-full h-300px flex items-center justify-center"
              >
                {{ $t('pages.trainer_list.no_data') }}
              </div>
            </template>
            <Loading
              v-if="isLoadingData"
              :theme="RoleEnum.ADMIN"
              class="absolute w-full h-300px top-0 left-0"
            />
          </div>
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
