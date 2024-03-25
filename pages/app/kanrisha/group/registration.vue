<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
// composable
const {
  listBreadcrumbs,
  srcAvatar,
  form,
  errors,
  trainerList,
  permissionAddGroup,
  typeBtn,
  isLoading,
  submit,
} = useRegistration()

// compiler macro
definePageMeta({
  layout: 'page',
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.group_registration.title')"
      >
        <div class="group-registration w-full">
          <Loading
            v-if="isLoading"
            :theme="RoleEnum.ADMIN"
            class="absolute w-full h-screen top-0 left-0"
          />
          <div
            v-else
            class="group-registration__container laptop:w-3/4"
          >
            <div class="flex items-center mt-9 gap-8">
              <UploadAvatar
                v-model="srcAvatar"
                class="kanrisha"
                :is-disabled="!permissionAddGroup"
                is-group
              />
              <div
                v-if="!permissionAddGroup"
                class="text-xs tablet:text-base flex-1"
              >
                {{ $t('pages.group_registration.noti') }}
                <br />
                {{ $t('pages.group_registration.suggest') }}
              </div>
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
              class="mt-1.5"
              :placeholder="
                $t('components.input.placeholder_input')
              "
              :errors="errors.name"
              :is-disabled="!permissionAddGroup"
            />
            <FormTextInput
              v-model="form.content"
              type-input="textarea"
              :rows="3"
              :label="
                $t('pages.group_registration.group_content')
              "
              class="mt-6"
              :placeholder="
                $t('components.input.placeholder_input')
              "
              :errors="errors.content"
              :is-disabled="!permissionAddGroup"
            />
            <div
              class="group-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
            >
              {{
                $t(
                  'pages.group_registration.trainer_in_charge'
                )
              }}
              <span
                class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
              >
                {{
                  $t('pages.group_registration.required')
                }}
              </span>
            </div>
            <Dropdown
              v-model="form.trainer"
              class="mt-1.5 laptop:max-w-329px"
              :text-button="
                $t('pages.group_registration.please_choose')
              "
              :items="trainerList"
              :errors="errors.trainer"
              :is-disabled="!permissionAddGroup"
            />
            <Button
              :type="typeBtn"
              :theme="RoleEnum.ADMIN"
              class="mt-10"
              :class="{ disabled: !permissionAddGroup }"
              @click="
                submit({
                  name: 'app-kanrisha-group-registration-confirmation',
                })
              "
            >
              {{ $t('components.button.next') }}
            </Button>
          </div>
        </div>
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
</style>
