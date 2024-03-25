<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.group_list',
    route: { name: 'app-trainer-group' },
  },
  {
    text: 'components.menu.group_detail',
    route: { name: '' },
  },
]

const groupDetail = useGroupDetail()
const currentPage = groupDetail.currentPage
const groupData = groupDetail.groupData
const users = groupDetail.users
const meta = groupDetail.meta
const infors = groupDetail.infors
const inforsTrainer = groupDetail.inforsTrainer
const infoList = groupDetail.infoList
const textInfoTrainer = groupDetail.textInfoTrainer
const isLoadingPage = groupDetail.isLoadingPage
const router = useRouter()
const userStore = useUser()

const showAlert = () => {
  alert('開発しています。')
}

const handleViewDetailMember = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/user/${id}`)
}

const handleViewEditGroup = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/group/${id}/edit`)
}
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full relative"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.group_detail.title')"
      >
        <Loading
          v-if="isLoadingPage"
          :theme="RoleEnum.TRAINER"
          class="fixed w-full h-screen top-0 left-0"
        />
        <div v-else class="group-detail laptop:w-3/4">
          <div class="group-detail__container">
            <CommonInfo
              :title="$t('pages.group_detail.group_info')"
              :src-img="groupDetail.groupImage.value"
              :infors="infors"
              class="mt-31px"
            />
            <CommonInfo
              :title="
                $t('pages.group_detail.trainer_information')
              "
              :src-img="groupDetail.trainerImage.value"
              :infors="inforsTrainer"
              :text-info="textInfoTrainer"
              class="mt-59px"
            />
            <div
              class="group-detail__title-list flex tablet:items-center tablet:flex-row justify-between mt-59px flex-col items-start <mobile:gap-y-8px"
            >
              <div
                class="group-detail__title-text text-22px leading-30px font-bold <mobile:text-18px"
              >
                {{ $t('pages.group_detail.user_list') }}
              </div>
              <div
                class="group-detail__title-info text-base leading-21px <mobile:text-14px"
              >
                {{ infoList }}
              </div>
            </div>
            <div class="group-detail__list-user mt-19px">
              <template v-if="groupData?.total_member > 0">
                <ItemUser
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  class="registration-confirmation__item-user rounded-3xl mt-4 relative bg-white cursor-pointer"
                  @click="handleViewDetailMember(user.id)"
                />
              </template>
              <div
                v-else
                class="w-full h-100px flex items-center justify-center"
              >
                {{ $t('pages.group_detail.no_data') }}
              </div>
            </div>
            <Pagination
              v-if="meta?.last_page > 1"
              :current-page="currentPage"
              :total-items="meta?.total"
              :per-page="meta?.per_page"
              class="mt-8"
              :theme="RoleEnum.TRAINER"
              @page-changed="currentPage = $event"
            />
            <Button
              v-if="textInfoTrainer"
              type="primary"
              :theme="RoleEnum.TRAINER"
              class="mt-10"
              @click="($event) => handleViewEditGroup(groupData.id as number)"
            >
              {{ $t('components.button.update') }}
            </Button>
            <div
              v-if="textInfoTrainer"
              class="flex justify-center"
            >
              <span
                class="cancel mt-22px cursor-pointer"
                @click="groupDetail.handleDelete"
              >
                {{ $t('components.button.delete') }}
              </span>
            </div>
          </div>
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.group-detail {
  &__subtitle {
    font-size: $font-22;
    line-height: $font-22;
  }

  &__image {
    width: 116px;
    height: 116px;
  }

  &__delete {
    color: $color-red-1;
    &:hover {
      filter: brightness(1.1);
    }
  }
}

.cancel {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 24px;
  font-size: 14px;
}
</style>
