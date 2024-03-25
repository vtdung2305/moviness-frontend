<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { useGroup } from '@/stores/group'
import { useUser } from '@/stores/user'

// compiler macro
definePageMeta({
  layout: 'page',
})

// composable
const {
  listBreadcrumbs,
  srcAvatar,
  form,
  errors,
  isLoading,
  showModal,
  userEdit,
  submit,
  addUser,
  addUserList,
  deleteUser,
  editUser,
  hideModal,
} = useGroupEdit()

const groupStore = useGroup()
const userStore = useUser()
const router = useRouter()

const userList = computed(() => {
  return groupStore.userList.filter(
    (x) => x.is_delete === false
  )
})

const handleViewDeleteGroup = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/group/${id}/delete`)
}
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.group_edit.title')"
      >
        <div
          v-if="!isLoading"
          class="group-registration w-full"
        >
          <div
            class="group-registration__container laptop:w-3/4"
          >
            <div class="title select-none">
              {{ $t('pages.group_edit.title_form') }}
            </div>
            <div class="flex items-center mt-22px gap-8">
              <UploadAvatar
                v-model="srcAvatar"
                class="trainer"
                is-group
              />
            </div>
            <div
              class="group-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
            >
              {{
                $t('pages.group_registration.group_name')
              }}
              <span
                class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
              >
                {{
                  $t('pages.group_registration.required')
                }}
              </span>
            </div>
            <FormTextInput
              v-model="form.name"
              type-input="text"
              class="mt-6px"
              :placeholder="
                $t('components.input.placeholder_input')
              "
              :errors="errors.name"
            />
            <FormTextInput
              v-model="form.content"
              type-input="textarea"
              :rows="3"
              :label="
                $t('pages.group_registration.group_content')
              "
              class="mt-15px"
              :placeholder="
                $t('components.input.placeholder_input')
              "
              :errors="errors.content"
            />

            <div class="mt-60px">
              <span class="title select-none">
                {{ $t('pages.group_edit.user_list') }}
              </span>

              <div class="flex gap-32px mt-24px">
                <!-- <Button
                  type="outline"
                  :theme="RoleEnum.TRAINER"
                  class="bg-white text-10px tablet:text-base"
                  @click="addUser()"
                >
                  <span
                    class="icon-plus-circle text-2xl mr-2"
                  ></span>
                  {{ $t('pages.group_edit.addition') }}
                </Button> -->

                <Button
                  :is-disabled="
                    groupStore.userListNotSet.length === 0
                  "
                  type="outline"
                  :theme="RoleEnum.TRAINER"
                  class="bg-white custom text-10px tablet:text-base w-full tablet:w-386px"
                  @click="addUserList()"
                >
                  <span class="count">{{
                    groupStore.userListNotSet.length
                  }}</span>
                  <span
                    class="icon-plus-circle text-2xl mr-2"
                  ></span>
                  {{ $t('pages.group_edit.addition_user') }}
                </Button>
              </div>

              <div>
                <div
                  class="registration-confirmation registration-confirmation__list-user"
                >
                  <template v-if="userList.length > 0">
                    <ItemUser
                      v-for="(user, index) in userList"
                      :key="index"
                      :user="user"
                      class="registration-confirmation__item-user rounded-3xl mt-4 relative"
                    >
                      <div
                        class="registration-confirmation__edit-user absolute right-3 tablet:right-6 flex items-center"
                      >
                        <!-- <Button
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
                        </Button> -->
                        <span
                          class="icon-trash cursor-pointer ml-1.5 tablet:ml-3 text-15px"
                          @click="deleteUser(user)"
                        />
                      </div>
                    </ItemUser>
                  </template>
                  <div
                    v-else
                    class="w-full h-100px flex items-center justify-center"
                  >
                    {{ $t('pages.group_detail.no_data') }}
                  </div>
                </div>
              </div>
            </div>

            <ModalUpdateUser
              v-if="showModal"
              :user="userEdit"
              :theme="RoleEnum.TRAINER"
              @hide-modal="hideModal()"
            />

            <ModalUserList
              :theme="RoleEnum.TRAINER"
              :user-list-not-set="groupStore.userListNotSet"
            />

            <Button
              :theme="RoleEnum.TRAINER"
              :class="{
                'mt-10': userList.length > 0,
              }"
              @click="
                submit({
                  name: 'app-trainer-group-id-edit-confirmation',
                })
              "
            >
              {{ $t('components.button.confirmation') }}
            </Button>

            <div
              class="flex justify-center cursor-pointer"
              @click="
                handleViewDeleteGroup(
                  groupStore.groupDetail?.id as number
                )
              "
            >
              <span class="cancel mt-22px">
                {{ $t('pages.group_edit.cancel') }}
              </span>
            </div>
          </div>
        </div>
        <Loading
          v-if="isLoading"
          :theme="RoleEnum.TRAINER"
          class="absolute w-full h-screen top-0 left-0"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.group-registration {
  &__title {
    font-size: $font-26;
    line-height: $font-26;
  }
  &__label {
    color: $color-gray-1;
    .text-validate {
      color: $color-red-1;
    }
  }
  .disabled {
    pointer-events: none;
    touch-action: none;
  }
}

.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 24px;
  color: $color-black-1;
}

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
      border: 2px solid $color-kanrisha;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: '';
        width: 10px;
        height: 10px;
        background-color: $color-kanrisha;
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
      color: $color-red-1;
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

.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 24px;
  color: $color-black-1;
}

.cancel {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 24px;
  font-size: 14px;
}
.custom {
  position: relative;
}

.count {
  position: absolute;
  top: -15px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50% 50%;
  background-color: $color-red-1;
  color: $color-white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
