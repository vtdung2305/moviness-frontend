<script lang="ts" setup>
import { required, helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import moment from 'moment'
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { TrainerCreateParams } from '@/interfaces/trainer'
import { GENDERS } from '@/constants/common'
import { useTrainer } from '@/stores/trainer'
import { phone } from '@/helper/number'
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
    route: { name: '' },
  },
]

const { t } = useLang()
const isLoadingPage = ref(false)
const userStore = useUser()
const router = useRouter()
const trainerStore = useTrainer()

const gender = ref('')
const date = ref({
  year: '',
  month: '',
  day: '',
})

const form = ref<TrainerCreateParams>({
  avatar: null,
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  zip1: '',
  address: '',
  building_name: '',
  year: '',
  month: '',
  day: '',
  age: '',
  sex: '',
  tel: '',
  memo: '',
  email: '',
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
      t(`pages.user_edit.validate.${key}`),
      required
    ),
  })
  const validatePostalCode = {
    sameAs: helpers.withMessage(
      t('components.signup.validate.postal_code'),
      helpers.regex(/^[0-9]{7}$/)
    ),
  }
  const rule = {
    last_name: validateRequired('last_name'),
    first_name: validateRequired('first_name'),
    last_name_kana: validateRequired('last_furigana_name'),
    first_name_kana: validateRequired(
      'first_furigana_name'
    ),
    year: validateRequired('year'),
    month: validateRequired('month'),
    day: validateRequired('day'),
    sex: validateRequired('gender'),
    zip1: validatePostalCode,
  }
  return rule
})

const v$ = useValidate(rules, form as any)

const errors = computed(() => {
  return {
    last_name: v$.value.last_name.$errors,
    first_name: v$.value.first_name.$errors,
    last_name_kana: v$.value.last_name_kana.$errors,
    first_name_kana: v$.value.first_name_kana.$errors,
    year: v$.value.year.$errors,
    month: v$.value.month.$errors,
    day: v$.value.day.$errors,
    sex: v$.value.sex.$errors,
    zip1: v$.value.zip1.$errors,
  }
})

const onSelectYearOld = (value: {
  year: string
  month: string
  day: string
  age: string
}) => {
  value.year && (form.value.year = value.year)
  value.month && (form.value.month = value.month)
  value.day && (form.value.day = value.day)
  value.age && (form.value.age = value.age)
}

const onSelectGender = (value: string) => {
  form.value.sex = GENDERS.findIndex(
    (item) => item === value
  ).toString()
}

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

const onSubmit = async () => {
  const validate = await v$.value.$validate()
  if (validate) {
    trainerStore.trainerEditData = form.value

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

const getTrainerDetail = async () => {
  isLoadingPage.value = true
  const id = userStore.userData?.id
  await trainerStore.getTrainerDetail(id as number)
  isLoadingPage.value = false
}

onMounted(async () => {
  getAddressList()
  await getTrainerDetail()

  if (trainerStore.trainerEditData) {
    form.value = trainerStore.trainerEditData

    date.value.year = form.value.year
    date.value.month = form.value.month
    date.value.day = form.value.day

    gender.value =
      GENDERS[trainerStore.trainerEditData?.sex as number]
  } else {
    form.value.avatar =
      trainerStore?.trainerDetail?.url_avatar!
    form.value.email = trainerStore?.trainerDetail?.email!

    form.value.last_name =
      trainerStore?.trainerDetail?.last_name!
    form.value.first_name =
      trainerStore?.trainerDetail?.first_name!
    form.value.last_name_kana =
      trainerStore?.trainerDetail?.last_name_kana!
    form.value.first_name_kana =
      trainerStore?.trainerDetail?.first_name_kana!
    form.value.zip1 = trainerStore?.trainerDetail?.zip1!
      ? trainerStore?.trainerDetail?.zip1! +
        trainerStore?.trainerDetail?.zip2!
      : ''
    form.value.address =
      trainerStore?.trainerDetail?.address!
    form.value.building_name =
      trainerStore?.trainerDetail?.building_name!

    form.value.sex = trainerStore?.trainerDetail?.sex!
    form.value.tel = phone(
      trainerStore?.trainerDetail?.tel!
    )!
    form.value.memo = trainerStore?.trainerDetail?.memo!

    gender.value =
      GENDERS[trainerStore?.trainerDetail?.sex as number]

    if (trainerStore?.trainerDetail?.birthday) {
      const getDate = moment(
        trainerStore?.trainerDetail?.birthday!,
        'YYYY/MM/DD'
      )
      date.value.month =
        getDate.format('M') + t('pages.user_edit.month')
      date.value.day =
        getDate.format('D') + t('pages.user_edit.day')
      date.value.year =
        getDate.format('YYYY') + t('pages.user_edit.year')
    }
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
          <div
            v-if="!isLoadingPage"
            class="laptop:w-3/4 mt-40px"
          >
            <div class="min-h-screen">
              <UploadAvatar
                v-model="form.avatar as File | string"
                class="mt-12px"
                :class="`${userStore.roleName}`"
              />
              <div class="row-form mt-32px">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.email') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.email"
                    placeholder="sample@example.com"
                    class="flex-1"
                    is-disabled
                  />
                </div>
              </div>
              <div
                class="row-form"
                :class="{
                  'row-error':
                    errors.last_name.length ||
                    errors.first_name.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.name') }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <div class="flex items-center flex-1">
                    <span
                      class="text-16px leading-16px mr-8px font-500 mt-4px"
                    >
                      {{ $t('pages.user_edit.last_name') }}
                    </span>
                    <FormTextInput
                      v-model="form.last_name"
                      :errors="errors.last_name"
                      :placeholder="
                        $t(
                          'pages.user_edit.placeholder_last_name'
                        )
                      "
                      class="flex-1 h-53px"
                      @input="
                        inputHandler({
                          value: $event.target.value,
                          key: 'last_name_kana',
                        })
                      "
                    />
                  </div>
                  <div class="flex items-center flex-1">
                    <span
                      class="text-16px leading-16px mr-8px font-500 mt-4px"
                    >
                      {{ $t('pages.user_edit.first_name') }}
                    </span>
                    <FormTextInput
                      v-model="form.first_name"
                      :errors="errors.first_name"
                      :placeholder="
                        $t(
                          'pages.user_edit.placeholder_first_name'
                        )
                      "
                      class="flex-1 h-53px"
                      @input="
                        inputHandler({
                          value: $event.target.value,
                          key: 'first_name_kana',
                        })
                      "
                    />
                  </div>
                </div>
              </div>
              <div
                class="row-form"
                :class="{
                  'row-error':
                    errors.last_name_kana.length ||
                    errors.first_name_kana.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.furigana_name') }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <div class="flex items-center flex-1">
                    <span
                      class="text-16px leading-16px mr-8px font-500 mt-4px"
                    >
                      {{ $t('pages.user_edit.last_name') }}
                    </span>
                    <FormTextInput
                      v-model="form.last_name_kana"
                      :errors="errors.last_name_kana"
                      :placeholder="
                        $t(
                          'pages.user_edit.placeholder_last_furigana_name'
                        )
                      "
                      class="flex-1 h-53px"
                    />
                  </div>
                  <div class="flex items-center flex-1">
                    <span
                      class="text-16px leading-16px mr-8px font-500 mt-4px"
                    >
                      {{ $t('pages.user_edit.first_name') }}
                    </span>
                    <FormTextInput
                      v-model="form.first_name_kana"
                      :errors="errors.first_name_kana"
                      :placeholder="
                        $t(
                          'pages.user_edit.placeholder_first_furigana_name'
                        )
                      "
                      class="flex-1 h-53px"
                    />
                  </div>
                </div>
              </div>
              <div
                class="row-form"
                :class="{
                  'row-error-zip': errors.zip1.length,
                }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.postal_code') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.zip1"
                    :max-length="7"
                    :errors="errors.zip1"
                    placeholder="0000000"
                    class="w-180px h-53px"
                  />
                </div>
              </div>
              <div class="row-form pb-2px">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.address') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.address"
                    :placeholder="
                      $t(
                        'pages.user_edit.placeholder_address'
                      )
                    "
                    class="flex-1"
                  />
                </div>
              </div>
              <div class="row-form">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.building_name') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.building_name"
                    :placeholder="
                      $t(
                        'pages.user_edit.placeholder_building_name'
                      )
                    "
                    class="flex-1"
                  />
                </div>
              </div>
              <div
                class="row-form mt-2px"
                :class="{
                  'row-error':
                    errors.year.length ||
                    errors.month.length ||
                    errors.day.length,
                }"
              >
                <DatePickerCustom
                  :model-value="date"
                  :title="$t('pages.user_edit.birth_day')"
                  :required="$t('pages.user_edit.required')"
                  :errors-day="errors.day"
                  :errors-year="errors.year"
                  :errors-month="errors.month"
                  class="custom-time"
                  @update:model-value="onSelectYearOld"
                />
              </div>
              <div
                class="row-form"
                :class="{ 'row-error': errors.sex.length }"
              >
                <div class="row-form__label">
                  {{ $t('pages.user_edit.gender') }}
                  <span>
                    {{ $t('pages.user_edit.required') }}
                  </span>
                </div>
                <div class="row-form__content">
                  <Dropdown
                    v-model="gender"
                    :items="GENDERS"
                    :errors="errors.sex"
                    :text-button="
                      $t('pages.user_edit.gender_default')
                    "
                    class="w-180px"
                    @on-selected="onSelectGender"
                  />
                </div>
              </div>
              <div class="row-form mt-28px">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.phone_number') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.tel"
                    placeholder="00000000000"
                    class="w-329px"
                  />
                </div>
              </div>
              <div class="row-form">
                <div class="row-form__label">
                  {{ $t('pages.user_edit.memo') }}
                </div>
                <div class="row-form__content">
                  <FormTextInput
                    v-model="form.memo"
                    :placeholder="
                      $t('pages.user_edit.placeholder_memo')
                    "
                    type-input="textarea"
                    class="flex-1 textarea"
                  />
                </div>
              </div>
              <Button
                :theme="userStore.roleName"
                class="mt-38px"
                @click="onSubmit()"
              >
                {{ $t('pages.user_detail.update') }}
              </Button>
            </div>
          </div>
          <Loading
            v-if="isLoadingPage"
            :theme="RoleEnum.TRAINER"
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
    color: $color-gray-1;

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

.text-input-container {
  @media screen and (max-width: $screen-tablet) {
    width: 100%;
    margin-bottom: 10px;
  }
}

.row-form__content {
  @media screen and (max-width: $screen-tablet) {
    flex-direction: column;
  }
}
</style>
