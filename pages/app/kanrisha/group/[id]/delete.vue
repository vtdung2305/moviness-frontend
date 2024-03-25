<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'
definePageMeta({
  layout: 'page',
})

const groupDetail = useGroupDetail()
const currentPage = groupDetail.currentPage
const groupData = groupDetail.groupData
const users = groupDetail.users
const meta = groupDetail.meta
const infors = groupDetail.infors
const inforsTrainer = groupDetail.inforsTrainer
const infoList = groupDetail.infoList
const isLoadingPage = groupDetail.isLoadingPage
const groupId = groupDetail.groupId
const {
  isAgree,
  isDelete,
  classBtn,
  isLoadingDelete,
  messageRessultDeleteGroup,
  handleShowModalConfirm,
  handleSubmitDelete,
} = useGroupDelete()

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.group_list',
    route: { name: 'app-kanrisha-group' },
  },
  {
    text: 'components.menu.group_detail',
    route: {
      name: 'app-kanrisha-group-id',
      params: { id: groupId.value },
    },
  },
  {
    text: 'components.menu.group_delete',
    route: { name: '' },
  },
]
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
          v-if="isLoadingPage || isLoadingDelete"
          :theme="RoleEnum.ADMIN"
          class="absolute w-screen h-screen top-0 left-0"
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
              class="mt-59px"
            />
            <div
              class="group-detail__title-list flex tablet:items-center tablet:flex-row justify-between mt-59px flex-col items-start"
            >
              <div
                class="group-detail__title-text text-22px leading-30px font-bold <mobile:text-18px"
              >
                {{ $t('pages.group_detail.user_list') }}
              </div>
              <div
                class="group-detail__title-info text-base leading-21px font-medium <mobile:text-14px <mobile:mt-8px"
              >
                {{ infoList }}
              </div>
            </div>
            <div class="group-detail__list-user mt-19px">
              <template v-if="meta?.total > 0">
                <ItemUser
                  v-for="(user, index) in users"
                  :key="index"
                  :user="user"
                  class="group-detail__item"
                  avatar-white
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
              :theme="RoleEnum.ADMIN"
              @page-changed="currentPage = $event"
            />
            <FormCheckbox
              v-model="isAgree"
              :theme="RoleEnum.ADMIN"
              class="mt-40px group-detail__checkbox"
            >
              {{ $t('pages.group_delete.warning') }}
            </FormCheckbox>
            <Button
              :type="classBtn"
              class="mt-19px"
              :class="{ disabled: !isAgree || isDelete }"
              @click="handleShowModalConfirm"
            >
              {{ $t('components.button.delete') }}
            </Button>
          </div>
        </div>

        <ModalMessage
          :id="ModalNameEnum.CONFIRM_DELETE_GROUP"
          :message="$t('others.title_modal_confirm')"
          :sub-message="
            $t('components.modal.delete_group.content')
          "
          button-cancel="components.button.cancel"
          button-submit="components.button.delete"
          :theme="RoleEnum.ADMIN"
          @click-submit="
            handleSubmitDelete(groupId.toString())
          "
        />
        <ModalMessage
          :id="ModalNameEnum.MESSAGE_DELETE_GROUP"
          :message="$t('others.title_modal_common')"
          :sub-message="messageRessultDeleteGroup"
          :theme="RoleEnum.ADMIN"
          :route="{ name: 'app-kanrisha-group' }"
        />
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

  &__item {
    border-top: 1px solid $color-gray-3;
    &:last-child {
      border-bottom: 1px solid $color-gray-3;
    }
  }

  &__checkbox {
    align-items: flex-start;
  }

  .disabled {
    pointer-events: none;
    touch-action: none;
  }
}

:deep(.form-checkbox__text) {
  line-height: $font-20;
  text-align: justify;
}
</style>
