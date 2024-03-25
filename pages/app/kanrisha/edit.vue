<script lang="ts" setup>
import {
  required,
  helpers,
  email,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { IFacilityEditData } from '@/interfaces/facility'
import { useFacility } from '@/stores/facility'
import { useCommon } from '@/stores'
import debounce from 'lodash/debounce'

const { convertFurigana } = useHelper()
const commonStore = useCommon()
const { getAddressList } = useAssets()
const addressList = computed(() => {
  return commonStore?.addressList
})
definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_settings',
    route: { name: 'app-kanrisha-setting' },
  },
  {
    text: 'components.menu.kanrisha_edit',
    route: { name: '' },
  },
]

const { t } = useLang()
const userStore = useUser()
const router = useRouter()
const isLoading = ref<Boolean>(true)
const facilityStore = useFacility()

const form = ref<IFacilityEditData>({
  avatar: null,
  name: '',
  name_kata: '',
  zip1: '',
  address: '',
  tel: '',
  fax: '',
  email: '',
  president_first_name: '',
  president_first_name_kata: '',
  president_zip1: '',
  president_address: '',
  president_tel: '',
  president_email: '',
  manager_avatar: null,
  manager_first_name: '',
  manager_first_name_kata: '',
  manager_zip1: '',
  manager_address: '',
  manager_tel: '',
  manager_email: '',
})

const inputHandler = debounce(async (event) => {
  const furigana: string = await convertFurigana(
    event.value
  )
  form.value[event.key] = furigana
}, 500)

const rules = computed(() => {
  const validateRequired = (key: string) => ({
    required: helpers.withMessage(
      t(`pages.facility_edit.validate.${key}`),
      required
    ),
  })
  const validatePostalCode = {
    sameAs: helpers.withMessage(
      t('components.signup.validate.postal_code'),
      helpers.regex(/^[0-9]{7}$/)
    ),
  }
  const validatePhone = {
    sameAs: helpers.withMessage(
      t('components.signup.validate.phone'),
      helpers.regex(/^[0-9]{11}$/)
    ),
  }
  const rule = {
    name: validateRequired('name'),
    name_kata: validateRequired('name_kata'),
    zip1: {
      ...validatePostalCode,
      ...validateRequired('zip1'),
    },
    address: validateRequired('address'),
    email: {
      email: helpers.withMessage(
        t('components.login.validate.email.invalid'),
        email
      ),
    },
    president_first_name: validateRequired(
      'president_first_name'
    ),
    president_first_name_kata: validateRequired(
      'president_first_name_kata'
    ),
    president_zip1: validatePostalCode,
    president_email: {
      president_email: helpers.withMessage(
        t('components.login.validate.email.invalid'),
        email
      ),
    },
    manager_first_name: validateRequired(
      'manager_first_name'
    ),
    manager_first_name_kata: validateRequired(
      'manager_first_name_kata'
    ),
    manager_zip1: validatePostalCode,
    manager_email: {
      president_email: helpers.withMessage(
        t('components.login.validate.email.invalid'),
        email
      ),
    },
  }
  return rule
})

const v$ = useValidate(rules, form as any)

const errors = computed(() => {
  return {
    name: v$.value.name.$errors,
    name_kata: v$.value.name_kata.$errors,
    zip1: v$.value.zip1.$errors,
    address: v$.value.address.$errors,
    email: v$.value.email.$errors,
    president_first_name:
      v$.value.president_first_name.$errors,
    president_first_name_kata:
      v$.value.president_first_name_kata.$errors,
    president_zip1: v$.value.president_zip1.$errors,
    president_email: v$.value.president_email.$errors,
    manager_first_name: v$.value.manager_first_name.$errors,
    manager_first_name_kata:
      v$.value.manager_first_name_kata.$errors,
    manager_zip1: v$.value.manager_zip1.$errors,
    manager_email: v$.value.manager_email.$errors,
  }
})

watch(
  () => form.value.zip1,
  () => {
    if (
      form.value.zip1?.toString().length === 7 &&
      addressList
    ) {
      const address = addressList.value?.find(
        (item) =>
          item.postcode === form.value.zip1?.toString()
      )
      if (address) {
        form.value.address =
          address.city + address.address1 + address.address2
      }
    }
  }
)

watch(
  () => form.value.president_zip1,
  () => {
    if (
      form.value.president_zip1?.toString().length === 7 &&
      addressList
    ) {
      const address = addressList.value?.find(
        (item) =>
          item.postcode ===
          form.value.president_zip1?.toString()
      )
      if (address) {
        form.value.president_address =
          address.city + address.address1 + address.address2
      }
    }
  }
)

watch(
  () => form.value.manager_zip1,
  () => {
    if (
      form.value.manager_zip1?.toString().length === 7 &&
      addressList
    ) {
      const address = addressList.value?.find(
        (item) =>
          item.postcode ===
          form.value.manager_zip1?.toString()
      )
      if (address) {
        form.value.manager_address =
          address.city + address.address1 + address.address2
      }
    }
  }
)

const onSubmit = async () => {
  const validate = await v$.value.$validate()
  if (validate) {
    facilityStore.facilityEditData = form.value

    router.push('edit-confirmation')
  } else {
    document
      .getElementsByClassName('error-text')[0]
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }
}

const getFacilityById = async () => {
  isLoading.value = true
  const id = userStore.userData?.facility_id
  await facilityStore.getFacilityDetail(id as number)
  isLoading.value = false
}

onMounted(async () => {
  getAddressList()
  await getFacilityById()

  if (facilityStore.facilityEditData) {
    form.value = facilityStore.facilityEditData
  } else {
    form.value.avatar =
      facilityStore?.facilityDetail?.url_avatar!
    form.value.name = facilityStore?.facilityDetail?.name!
    form.value.name_kata =
      facilityStore?.facilityDetail?.name_kata!
    form.value.zip1 = facilityStore?.facilityDetail?.zip1!
      ? facilityStore?.facilityDetail?.zip1! +
        facilityStore?.facilityDetail?.zip2!
      : ''
    form.value.address =
      facilityStore?.facilityDetail?.address1!
    form.value.tel = facilityStore?.facilityDetail?.tel!
    form.value.fax = facilityStore?.facilityDetail?.fax!
    form.value.email = facilityStore?.facilityDetail?.email!

    form.value.president_first_name =
      facilityStore?.facilityDetail?.info?.president_first_name!
    form.value.president_first_name_kata =
      facilityStore?.facilityDetail?.info?.president_first_name_kata!
    form.value.president_zip1 = facilityStore
      ?.facilityDetail?.info?.president_zip1!
      ? facilityStore?.facilityDetail?.info
          ?.president_zip1! +
        facilityStore?.facilityDetail?.info?.president_zip2!
      : ''
    form.value.president_address =
      facilityStore?.facilityDetail?.info?.president_address1!
    form.value.president_tel =
      facilityStore?.facilityDetail?.info?.president_tel!
    form.value.president_email =
      facilityStore?.facilityDetail?.info?.president_email!

    form.value.manager_avatar =
      facilityStore?.facilityDetail?.manager?.url_avatar!
    form.value.manager_first_name =
      facilityStore?.facilityDetail?.manager?.first_name!
    form.value.manager_first_name_kata =
      facilityStore?.facilityDetail?.manager?.first_name_kana!
    form.value.manager_zip1 = facilityStore?.facilityDetail
      ?.manager?.zip1!
      ? facilityStore?.facilityDetail?.manager?.zip1! +
        facilityStore?.facilityDetail?.manager?.zip2!
      : ''
    form.value.manager_address =
      facilityStore?.facilityDetail?.manager?.address!
    form.value.manager_tel =
      facilityStore?.facilityDetail?.manager?.tel!
    form.value.manager_email =
      facilityStore?.facilityDetail?.manager?.email!
  }
})
</script>

<template>
  <div>
    <PageWrapper class="flex-1 flex">
      <PageBody class="flex-1 flex flex-col">
        <PageSection
          class="flex-1 w-full"
          :list-breadcrumbs="listBreadcrumbs"
          :title-page="$t('pages.user_edit_info.title')"
        >
          <div v-if="!isLoading" class="laptop:w-3/4">
            <div class="min-h-screen">
              <div
                class="mt-39px text-22px font-bold custom-line-height"
              >
                {{
                  $t('pages.facility_detail.information')
                }}
              </div>
              <UploadAvatar
                v-model="form.avatar as File | string"
                class="mt-12px"
                :class="`${userStore.roleName}`"
                is-facility
              />
              <div
                class="row-form mt-46px"
                :class="{
                  'row-error':
                    errors.name.length ||
                    errors.name.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.facility_detail.name') }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.name"
                    :errors="errors.name"
                    :placeholder="
                      $t(
                        'pages.plan_edit.placeholder_content'
                      )
                    "
                    class="flex-1"
                    @input="
                      inputHandler({
                        value: $event.target.value,
                        key: 'name_kata',
                      })
                    "
                  />
                </div>
              </div>
              <div
                class="row-form mt-24px"
                :class="{
                  'row-error':
                    errors.name_kata.length ||
                    errors.name_kata.length,
                }"
              >
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.facility_detail.name_furigana'
                    )
                  }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.name_kata"
                    :errors="errors.name_kata"
                    :placeholder="
                      $t(
                        'pages.plan_edit.placeholder_content'
                      )
                    "
                    class="flex-1"
                  />
                </div>
              </div>
              <div
                class="row-form"
                :class="{
                  'row-error-zip':
                    errors.zip1.length ||
                    errors.zip1.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.postal_code') }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.zip1"
                    :errors="errors.zip1"
                    :max-length="7"
                    placeholder="0000000"
                    class="w-180px h-53px"
                  />
                </div>
              </div>
              <div
                class="row-form mt-20px"
                :class="{
                  'row-error':
                    errors.address.length ||
                    errors.address.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.facility_detail.address') }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.address"
                    :errors="errors.address"
                    :placeholder="
                      $t(
                        'pages.plan_edit.placeholder_content'
                      )
                    "
                    class="flex-1"
                  />
                </div>
              </div>
              <div class="row-form mt-28px">
                <div class="row-form__label">
                  {{ $t('pages.facility_detail.phone') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.tel"
                    placeholder="00000000000"
                    class="w-329px"
                  />
                </div>
              </div>
              <div class="row-form mt-26px">
                <div class="row-form__label">
                  {{ $t('pages.facility_detail.fax') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.fax"
                    placeholder="00000000000"
                    class="w-329px"
                  />
                </div>
              </div>
              <div
                class="row-form mt-20px"
                :class="{
                  'row-error': errors.email.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.trainer_detail.email') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.email"
                    :errors="errors.email"
                    placeholder="sample@example.com"
                    class="flex-1"
                  />
                </div>
              </div>

              <div class="mt-65px text-22px font-bold">
                {{
                  $t('pages.facility_detail.representative')
                }}
              </div>
              <div
                class="row-form mt-22px"
                :class="{
                  'row-error':
                    errors.president_first_name.length ||
                    errors.president_first_name.length,
                }"
              >
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.facility_detail.representative_name'
                    )
                  }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.president_first_name"
                    :errors="errors.president_first_name"
                    placeholder="山田 太郎"
                    class="w-329px h-53px"
                    @input="
                      inputHandler({
                        value: $event.target.value,
                        key: 'president_first_name_kata',
                      })
                    "
                  />
                </div>
              </div>
              <div
                class="row-form mt-24px"
                :class="{
                  'row-error':
                    errors.president_first_name_kata
                      .length ||
                    errors.president_first_name_kata.length,
                }"
              >
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.facility_detail.person_in_charge_furigana'
                    )
                  }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.president_first_name_kata"
                    :errors="
                      errors.president_first_name_kata
                    "
                    placeholder="やまだ たろう"
                    class="w-329px h-53px"
                  />
                </div>
              </div>
              <div
                class="row-form"
                :class="{
                  'row-error':
                    errors.president_zip1.length ||
                    errors.president_zip1.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.postal_code') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.president_zip1"
                    :errors="errors.president_zip1"
                    :max-length="7"
                    placeholder="0000000"
                    class="w-180px h-53px"
                  />
                </div>
              </div>
              <div class="row-form mt-22px">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.address') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.president_address"
                    :placeholder="
                      $t(
                        'pages.plan_edit.placeholder_content'
                      )
                    "
                    class="flex-1"
                  />
                </div>
              </div>
              <div class="row-form mt-26px">
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.user_registration.phone_number'
                    )
                  }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.president_tel"
                    placeholder="00000000000"
                    class="w-329px"
                  />
                </div>
              </div>
              <div
                class="row-form mt-28px"
                :class="{
                  'row-error':
                    errors.president_email.length ||
                    errors.president_email.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.email') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.president_email"
                    :errors="errors.president_email"
                    placeholder="sample@example.com"
                    class="flex-1"
                  />
                </div>
              </div>

              <div class="mt-65px text-22px font-bold">
                {{ $t('pages.facility_detail.manager') }}
              </div>
              <UploadAvatar
                v-model="form.manager_avatar as File | string"
                class="mt-22px"
                :class="`${userStore.roleName}`"
              />
              <div
                class="row-form mt-22px"
                :class="{
                  'row-error':
                    errors.manager_first_name.length ||
                    errors.manager_first_name.length,
                }"
              >
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.facility_detail.person_in_charge'
                    )
                  }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.manager_first_name"
                    :errors="errors.manager_first_name"
                    placeholder="山田 太郎"
                    class="w-329px h-53px"
                    @input="
                      inputHandler({
                        value: $event.target.value,
                        key: 'manager_first_name_kata',
                      })
                    "
                  />
                </div>
              </div>
              <div
                class="row-form mt-24px"
                :class="{
                  'row-error':
                    errors.manager_first_name_kata.length ||
                    errors.manager_first_name_kata.length,
                }"
              >
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.facility_detail.person_in_charge_furigana'
                    )
                  }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.manager_first_name_kata"
                    :errors="errors.manager_first_name_kata"
                    placeholder="やまだ たろう"
                    class="w-329px h-53px"
                  />
                </div>
              </div>
              <div
                class="row-form"
                :class="{
                  'row-error':
                    errors.manager_zip1.length ||
                    errors.manager_zip1.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.postal_code') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.manager_zip1"
                    :errors="errors.manager_zip1"
                    :max-length="7"
                    placeholder="0000000"
                    class="w-180px h-53px"
                  />
                </div>
              </div>
              <div class="row-form mt-22px">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.address') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.manager_address"
                    :placeholder="
                      $t(
                        'pages.plan_edit.placeholder_content'
                      )
                    "
                    class="flex-1"
                  />
                </div>
              </div>
              <div class="row-form mt-26px">
                <div class="row-form__label">
                  {{
                    $t(
                      'pages.user_registration.phone_number'
                    )
                  }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.manager_tel"
                    placeholder="00000000000"
                    class="w-329px"
                  />
                </div>
              </div>
              <div
                class="row-form mt-26px"
                :class="{
                  'row-error':
                    errors.manager_email.length ||
                    errors.manager_email.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.user_id') }}
                </div>
                <div class="mt-14px flex email">
                  {{ form.manager_email }}
                  <span
                    v-if="form.manager_email"
                    v-tooltip="{
                      content: `${$t(
                        'pages.facility_edit.tooltip_email_content'
                      )}`,
                    }"
                    class="ml-10px icon-exclamation-circle tooltip"
                  ></span>
                </div>
              </div>

              <Button
                :theme="userStore.roleName"
                class="mt-38px"
                @click="onSubmit()"
              >
                {{
                  $t('pages.user_edit_info.title_button')
                }}
              </Button>
            </div>
          </div>
          <Loading
            v-if="isLoading"
            :theme="RoleEnum.ADMIN"
            class="absolute w-full h-screen top-0 left-0"
          />
        </PageSection>
      </PageBody>
    </PageWrapper>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 24px;
  color: $color-black-1;
}

.record-number {
  &__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    color: $color-black-1;
    margin-top: 42px;
  }
}

.record-number {
  &__value {
    margin-top: 8px;
    margin-bottom: 24px;
    line-height: 16px;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    color: $color-black-1;
    letter-spacing: 0;

    &.mt-12 {
      margin-top: 12px;
    }
  }
}

.row-form {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 24px;

  &.row-error {
    margin-bottom: 32px;
  }

  &.row-error-zip {
    margin-bottom: 42px;
  }

  &__label {
    display: flex;
    gap: 8px;
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    color: $color-black-1;

    span {
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      color: $color-red-1;
    }
  }

  &__content {
    display: flex;
    gap: 32px;
    flex-direction: row;

    .textarea {
      &:deep(textarea) {
        height: 105px;
      }
    }

    &:deep(input) {
      padding-left: 13px;

      @media screen and (max-width: $screen-tablet) {
        width: 100%;
      }
    }

    @media screen and (max-width: 685px) {
      gap: 16px;

      &.select-calendar .calendar-item {
        flex: 1;
        width: fit-content;
      }
    }
  }
}

.note {
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  color: $color-black-1;
  letter-spacing: 0.05em;
}

:deep(.list-item__content) {
  max-height: 250px;
}

:deep(.list-item__wrapper) {
  max-width: 100%;
}

:deep(.dropdown-button) {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.custom-time {
  &:deep(.trainer-registration__group-date) {
    gap: 31px;
    flex: unset;
    margin-right: 31px;
  }

  &:deep(.trainer-registration__group-date > div) {
    width: 149px;
    flex: unset;
  }

  &:deep(.trainer-registration__old) {
    font-size: 30px;
    font-weight: 500;
  }

  &:deep(.date-picker__title) {
    margin-bottom: 0px;
  }

  :deep(.dropdown-button) {
    width: 167px;
  }
}

.cancel {
  color: $color-red-1;
  border-bottom: 1px solid $color-red-1;
  line-height: 0.8;
}

.custom-line-height {
  line-height: inherit;
}

.text-input-container {
  @media screen and (max-width: $screen-tablet) {
    width: 100%;
  }
}

:deep(.upload-avatar) {
  width: 116px;
  height: 116px;
}

.email {
  line-height: 16px;
  color: $color-gray-2;
}
</style>
