<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

// composable
const {
  listBreadcrumbs,
  optionsValue,
  users,
  userEdit,
  showModal,
  previewImage,
  infors,
  registerFromFile,
  groupCreateData,
  subtitleModalMess,
  routeSubmit,
  isSubmit,
  typeBtn,
  isLoadingData,
  backEdit,
  changeFile,
  hideModal,
  deleteUser,
  editUser,
  handleSubmit,
  handleUpdateUser,
} = useRegistrationConfirmation()
const router = useRouter()

// compiler macro
definePageMeta({
  layout: 'page',
})

onMounted(() => {
  hideModal()
  if (!groupCreateData?.groupName) {
    router.push({ name: 'app-trainer-group-registration' })
  }
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="
          $t('pages.group_registration_confirmation.title')
        "
      >
        <div class="registration-confirmation w-full">
          <div class="registration-confirmation__container">
            <CommonInfo
              :title="
                $t(
                  'pages.group_registration_confirmation.sub_title'
                )
              "
              :src-img="previewImage"
              :infors="infors"
              class="mt-31px"
            />
            <div
              class="registration-confirmation__user font-bold mt-21px"
            >
              {{
                $t(
                  'pages.group_registration_confirmation.user_info'
                )
              }}
            </div>
            <div
              class="registration-confirmation__options flex items-center cursor-pointer mt-21px"
              @click="optionsValue = 0"
            >
              <div
                class="registration-confirmation__options-item rounded-full mr-4"
                :class="{ active: !registerFromFile }"
              ></div>
              {{
                $t(
                  'pages.group_registration_confirmation.register_later'
                )
              }}
            </div>
            <div
              class="registration-confirmation__options flex items-center cursor-pointer mt-6"
              @click="optionsValue = 1"
            >
              <div
                class="registration-confirmation__options-item rounded-full mr-4"
                :class="{ active: registerFromFile }"
              ></div>
              {{
                $t(
                  'pages.group_registration_confirmation.register_from_file'
                )
              }}
            </div>
            <template v-if="registerFromFile">
              <UploadFileCSV
                :theme="RoleEnum.TRAINER"
                class="registration-confirmation__btn-upload mt-4"
                @change-file="changeFile"
              />
              <div
                v-if="users.length"
                class="registration-confirmation__list-user mt-6"
              >
                <ItemUser
                  v-for="(user, index) in users"
                  :key="index"
                  :user="user"
                  hide-id
                  class="registration-confirmation__item-user rounded-3xl mt-4 relative"
                >
                  <div
                    class="registration-confirmation__edit-user absolute right-3 tablet:right-6 flex items-center"
                  >
                    <Button
                      type="outline"
                      :theme="RoleEnum.TRAINER"
                      class="user-edit cursor-pointer flex items-center justify-center"
                      @click="editUser(user)"
                    >
                      <span class="icon-edit" />
                      <span
                        class="user-edit__text ml-1 tablet:ml-2 font-bold"
                      >
                        {{
                          $t(
                            'pages.group_registration_confirmation.edit'
                          )
                        }}
                      </span>
                    </Button>
                    <span
                      class="icon-trash cursor-pointer ml-1.5 tablet:ml-3"
                      @click="deleteUser(user)"
                    />
                  </div>
                </ItemUser>
              </div>
            </template>
            <div
              class="registration-confirmation__action flex"
            >
              <Button
                type="outline"
                :theme="RoleEnum.TRAINER"
                class="mt-10"
                @click="
                  backEdit({
                    name: 'app-trainer-group-registration',
                  })
                "
              >
                {{ $t('components.button.edit') }}
              </Button>
              <Button
                :type="typeBtn"
                :theme="RoleEnum.TRAINER"
                :class="{ disabled: isSubmit }"
                class="mt-10"
                @click="handleSubmit(true)"
              >
                {{ $t('components.button.register') }}
              </Button>
            </div>
          </div>
        </div>
        <ModalUpdateUser
          v-if="showModal"
          :user="userEdit"
          :theme="RoleEnum.TRAINER"
          hide-id
          @hide-modal="hideModal()"
          @update-user="handleUpdateUser"
        />
        <ModalMessage
          :id="ModalNameEnum.MESSAGE_CREATE_GROUP"
          :message="$t('others.title_modal_common')"
          :sub-message="subtitleModalMess"
          :theme="RoleEnum.TRAINER"
          :route="routeSubmit"
        />
        <Loading
          v-if="isLoadingData"
          :theme="RoleEnum.TRAINER"
          class="fixed w-full h-500px top-0 left-0"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.registration-confirmation {
  &__title {
    font-size: $font-26;
    line-height: $font-26;
  }

  &__subtitle {
    font-size: $font-22;
    line-height: $font-22;
  }

  &__image {
    width: 116px;
    height: 116px;
  }

  &__user {
    font-size: $font-22;
    line-height: $font-22;
  }

  &__options-item {
    width: 20px;
    height: 20px;
    border: 2px solid $color-gray-1;

    &.active {
      border: 2px solid $color-trainer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: '';
        width: 10px;
        height: 10px;
        background-color: $color-trainer;
        border-radius: 50%;
      }
    }
  }

  &__btn-upload {
    @media screen and (min-width: $screen-tablet) {
      width: calc(50% - 16px);
    }
  }

  &__item-user {
    background: $color-white-2;
  }

  &__edit-user {
    top: 50%;
    transform: translateY(-50%);

    .icon-trash::before {
      color: $color-trainer;
    }
  }

  &__action {
    column-gap: 32px;
  }

  .user-edit {
    width: 108px;
    height: 30px;
    border-radius: 30px;

    .icon-edit::before {
      color: $color-trainer;
    }

    &__text {
      font-size: $font-14;
      line-height: $font-14;
    }

    @media screen and (max-width: $screen-mobile) {
      width: 70px;
      height: 24px;

      &__text {
        font-size: $font-10;
        line-height: $font-10;
      }
    }
  }
  .disabled {
    pointer-events: none;
    touch-action: none;
  }
}
</style>
