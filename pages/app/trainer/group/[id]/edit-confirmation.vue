<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

definePageMeta({
  layout: 'page',
})

// composable
const {
  listBreadcrumbs,
  isLoadingPage,
  avatarDisplay,
  groupEditData,
  author,
  dateCreate,
  previewImageTrainer,
  trainer,
  usersListItem,
  groupStore,
  currentPage,
  pageSize,
  pageNumber,
  subtitleModalMess,
  routeSubmit,
  userStore,
  alert,
  dateLast,
  infoList,
  confirm,
  onCloseAlert,
} = useGroupEditConfirmation()

const userList = computed(() => {
  return groupStore.userList.filter(
    (x) => x.is_delete === false
  )
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full relative"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="
          $t(
            'components.menu.group_edit_confirmation_kanrisha'
          )
        "
      >
        <Loading
          v-if="isLoadingPage"
          :theme="RoleEnum.TRAINER"
          class="absolute w-screen h-screen top-0 left-0"
        />
        <div v-else class="group-detail laptop:w-3/4">
          <div class="group-detail__container">
            <div class="common-info mt-31px">
              <div class="common-info__title font-bold">
                {{
                  $t(
                    'pages.group_edit_confirmation.sub_title'
                  )
                }}
              </div>
              <div
                class="common-info__image rounded-full overflow-hidden mt-21px"
              >
                <img
                  :src="avatarDisplay"
                  class="w-full h-full object-contain"
                  alt="写真"
                />
              </div>
              <div class="information mt-21px">
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.group_name'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{
                      groupEditData?.groupName
                        ? groupEditData?.groupName.trim()
                        : $t('others.empty')
                    }}
                  </div>
                </div>
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.group_content'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{
                      groupEditData?.groupContent
                        ? groupEditData?.groupContent.trim()
                        : $t('others.empty')
                    }}
                  </div>
                </div>
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.author'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{ author || $t('others.empty') }}
                  </div>
                </div>
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.created_date'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{ dateCreate || $t('others.empty') }}
                  </div>
                </div>
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.last_updated'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{ dateLast || $t('others.empty') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="common-info mt-59px">
              <div class="common-info__title font-bold">
                {{
                  $t(
                    'pages.group_edit_confirmation.trainer_info'
                  )
                }}
              </div>
              <div
                class="common-info__image rounded-full overflow-hidden bg-white mt-21px"
              >
                <img
                  :src="previewImageTrainer"
                  class="w-full h-full object-contain"
                  alt="写真"
                />
              </div>
              <div class="information mt-21px">
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.trainer_name'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{
                      groupEditData?.trainer ||
                      $t('others.empty')
                    }}
                  </div>
                </div>
                <div class="information__item flex py-14px">
                  <div
                    class="information__item-label text-base leading-21px font-medium"
                  >
                    {{
                      $t(
                        'pages.group_edit_confirmation.trainer_email'
                      )
                    }}
                  </div>
                  <div
                    class="information__item-value text-base leading-21px font-medium text-justify whitespace-pre-wrap"
                  >
                    {{
                      (trainer && trainer?.email) ||
                      $t('others.empty')
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="group-detail__title-list flex tablet:items-center tablet:flex-row justify-between mt-59px flex-col items-start"
            >
              <div
                class="group-detail__title-text text-22px leading-30px font-bold <mobile:text-18px"
              >
                {{ $t('pages.group_detail.user_list') }}
              </div>
              <div
                class="group-detail__title-info text-base leading-21px font-medium <mobile:text-14px"
              >
                {{ infoList }}
              </div>
            </div>
            <div class="group-detail__list-user mt-19px">
              <template v-if="userList.length > 0">
                <ItemUser
                  v-for="(user, index) in usersListItem"
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
              v-if="
                groupStore.userList.length / pageSize > 1
              "
              :current-page="currentPage"
              :total-items="
                groupStore.userList.length / pageSize
              "
              :per-page="pageNumber"
              class="mt-8"
              :theme="RoleEnum.TRAINER"
              @page-changed="currentPage = $event"
            />
            <div class="flex gap-31px mt-19px">
              <Button
                :theme="userStore.roleName"
                type="outline"
                @click="$router.back()"
              >
                {{ $t('pages.user_registration.fix') }}
              </Button>
              <Button
                :theme="RoleEnum.TRAINER"
                @click="
                  $showModal(
                    ModalNameEnum.CONFIRM_EDIT_GROUP
                  )
                "
              >
                {{
                  $t('pages.group_edit_confirmation.save')
                }}
              </Button>
            </div>
          </div>
        </div>
        <ModalMessage
          :id="ModalNameEnum.MESSAGE_EDIT_GROUP"
          :message="$t('others.title_modal_common')"
          :sub-message="subtitleModalMess"
          :theme="RoleEnum.TRAINER"
          :route="routeSubmit"
        />
        <ModalWrapper
          :id="ModalNameEnum.CONFIRM_EDIT_GROUP"
          content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
        >
          <div
            class="text-22px leading-22px font-bold title"
          >
            {{ $t('others.title_modal_confirm') }}
          </div>
          <div class="text-16px leading-16px sub-title">
            {{
              $t(
                'pages.group_edit.message_confirm_edit_groups'
              )
            }}
          </div>
          <Button
            type="primary"
            class="w-280px h-52px"
            :theme="userStore.roleName"
            @click="confirm"
          >
            {{ $t('components.button.save') }}
          </Button>
          <div
            class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
            @click="
              $hiddenModal(ModalNameEnum.CONFIRM_EDIT_GROUP)
            "
          >
            {{ $t('components.button.cancel') }}
          </div>
        </ModalWrapper>
        <ModalWrapper
          :id="ModalNameEnum.ALERT_EDIT_GROUP"
          content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
        >
          <div
            class="text-22px leading-22px font-bold title"
          >
            {{ $t('others.title_modal_common') }}
          </div>
          <div class="text-16px leading-16px sub-title">
            {{ alert }}
          </div>
          <Button
            type="primary"
            class="w-280px h-52px"
            :theme="userStore.roleName"
            @click="onCloseAlert"
          >
            {{ $t('components.button.close') }}
          </Button>
        </ModalWrapper>
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

.common-info {
  &__title {
    font-size: $font-22;
    line-height: $font-30;
  }

  &__image {
    width: 116px;
    height: 116px;
  }
}

.information {
  &__item {
    border-bottom: 1px solid $color-gray-3;
  }

  &__item-label {
    min-width: 180px;
  }

  &__item-link {
    color: $color-shinseido;
  }

  @media screen and (max-width: $screen-tablet) {
    &__item-label {
      min-width: 125px;
    }
  }
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
