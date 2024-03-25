<script lang="ts" setup>
import {
  required,
  helpers,
  email,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import debounce from 'lodash/debounce'
import { RoleEnum } from '@/constants/role'
import { MenuItemBase } from '@/interfaces/menu'
import { useTrainer } from '@/stores/trainer'
import { useFacility } from '@/stores/facility'
import { useCommon } from '@/stores'

// compiler macro
definePageMeta({
  layout: 'page',
})

const { convertFurigana } = useHelper()
const { t } = useLang()
const trainerStore = useTrainer()
const facilityStore = useFacility()
const router = useRouter()
const { getAddressList } = useAssets()
const commonStore = useCommon()

const addressList = computed(() => {
  return commonStore?.addressList
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_registration',
    route: { name: '' },
  },
]

const genderList = [
  t('pages.trainer_registration.gender_others'),
  t('pages.trainer_registration.female'),
  t('pages.trainer_registration.male'),
]

const srcAvatar = ref()
const date = ref({
  year: '',
  month: '',
  day: '',
})
const form = ref({
  email: '',
  lastname: '',
  firstname: '',
  lastnameKana: '',
  firstnameKana: '',
  postCode: '',
  address: '',
  buildingName: '',
  gender: '',
  mobilePhone: '',
  remarks: '',
})
const permissionAddTrainer = ref(true)
const isLoading = ref(false)
const errorsRes = ref(null)

const inputHandler = debounce(async (event) => {
  const furigana: string = await convertFurigana(
    event.value
  )
  form.value[event.key] = furigana
}, 500)

const rules = computed(() => {
  const validatePostalCode = {
    sameAs: helpers.withMessage(
      t('pages.trainer_registration.validate.postal_code'),
      helpers.regex(/^[0-9]{7}$/)
    ),
  }

  const validatePhone = {
    sameAs: helpers.withMessage(
      t('pages.trainer_registration.validate.phone'),
      helpers.regex(/^[0-9]{11}$/)
    ),
  }
  return {
    email: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.email.required'
        ),
        required
      ),
      email: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.email.invalid'
        ),
        email
      ),
    },
    lastname: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.lastname.required'
        ),
        required
      ),
    },
    firstname: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.firstname.required'
        ),
        required
      ),
    },
    lastnameKana: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.lastname_kana.required'
        ),
        required
      ),
    },
    firstnameKana: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.firstname_kana.required'
        ),
        required
      ),
    },
    gender: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.gender.required'
        ),
        required
      ),
    },
    postCode: validatePostalCode,
  }
})

const rulesDate = computed(() => {
  return {
    year: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.year.required'
        ),
        required
      ),
    },
    month: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.month.required'
        ),
        required
      ),
    },
    day: {
      required: helpers.withMessage(
        t(
          'pages.trainer_registration.validate.day.required'
        ),
        required
      ),
    },
  }
})

const errors = computed(() => {
  return {
    email: v$.value.email.$errors.length
      ? v$.value.email.$errors
      : errorsApi.value.email,
    lastname: v$.value.lastname.$errors,
    firstname: v$.value.firstname.$errors,
    lastnameKana: v$.value.lastnameKana.$errors,
    firstnameKana: v$.value.firstnameKana.$errors,
    gender: v$.value.gender.$errors,
    year: vDate$.value.year.$errors,
    month: vDate$.value.month.$errors,
    day: vDate$.value.day.$errors,
    postCode: v$.value.postCode.$errors,
  }
})

const errorsApi = computed(() => {
  return {
    email: errorsRes.value?.email
      ? [
          {
            $message: errorsRes.value?.email[0],
          },
        ]
      : [],
  }
})

const trainerCreateData = computed(
  () => trainerStore.trainerCreateData
)

const typeBtn = computed(() => {
  return permissionAddTrainer.value
    ? 'primary'
    : 'secondary'
})

const v$ = useValidate(rules, form as any)
const vDate$ = useValidate(rulesDate, date as any)

onMounted(async () => {
  isLoading.value = true
  getAddressList()
  if (trainerStore.isEdit) {
    srcAvatar.value = trainerCreateData.value?.fileAvatar
    form.value.email = trainerCreateData.value?.email || ''
    form.value.lastname =
      trainerCreateData.value?.lastname || ''
    form.value.firstname =
      trainerCreateData.value?.firstname || ''
    form.value.lastnameKana =
      trainerCreateData.value?.lastnameKana || ''
    form.value.firstnameKana =
      trainerCreateData.value?.firstnameKana || ''
    form.value.postCode =
      trainerCreateData.value?.postCode || ''
    form.value.address =
      trainerCreateData.value?.address || ''
    form.value.buildingName =
      trainerCreateData.value?.buildingName || ''
    form.value.gender =
      trainerCreateData.value?.gender || ''
    form.value.mobilePhone =
      trainerCreateData.value?.mobilePhone || ''
    form.value.remarks =
      trainerCreateData.value?.remarks || ''
    date.value.year = trainerCreateData.value?.year || ''
    date.value.month = trainerCreateData.value?.month || ''
    date.value.day = trainerCreateData.value?.day || ''
    errorsRes.value = trainerStore.errors
    trainerStore.setEdit(false)
    trainerStore.setErrors(null)
    v$.value.$validate()
  } else {
    trainerStore.resetCreateTrainer()
  }
  await checkPermission()
  isLoading.value = false
})

const handleSubmit = async () => {
  const validate = await v$.value.$validate()
  const validateDate = await vDate$.value.$validate()
  if (validate && validateDate) {
    form.value.lastname = form.value.lastname.trim()
    form.value.firstname = form.value.firstname.trim()
    form.value.lastnameKana = form.value.lastnameKana.trim()
    form.value.firstnameKana =
      form.value.firstnameKana.trim()
    form.value.address = form.value.address.trim()
    form.value.buildingName = form.value.buildingName.trim()
    form.value.remarks = form.value.remarks.trim()
    trainerStore.updateCreateTrainer({
      ...form.value,
      ...date.value,
      fileAvatar: srcAvatar,
    })
    router.push({
      name: 'app-kanrisha-trainer-registration-confirmation',
    })
  } else {
    document
      .getElementsByClassName('error-text')[0]
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }
}
const checkPermission = async () => {
  try {
    const res = await facilityStore.checkPermission()
    if (res && res.data) {
      permissionAddTrainer.value =
        res.data.permission_add_trainer || false
    }
  } catch (e) {}
}

watch(
  () => form.value.email,
  () => {
    if (errorsRes.value?.email && !isLoading.value) {
      errorsRes.value.email = null
    }
  }
)

watch(
  () => form.value.postCode,
  () => {
    if (form.value.postCode.length === 7 && addressList) {
      const address = addressList.value?.find(
        (item) => item.postcode === form.value.postCode
      )
      if (address) {
        form.value.address =
          address.city + address.address1 + address.address2
      }
    }
  }
)
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex">
      <PageSection
        class="flex-1"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.trainer_registration.title')"
      >
        <div class="trainer-registration laptop:w-3/4">
          <!-- Avatar -->
          <div class="flex items-center mt-9 gap-8">
            <UploadAvatar
              v-model="srcAvatar"
              class="kanrisha"
              :is-disabled="!permissionAddTrainer"
            />
            <div
              v-if="!permissionAddTrainer"
              class="text-xs tablet:text-base flex-1"
            >
              {{ $t('pages.trainer_registration.noti') }}
              <br />
              {{ $t('pages.trainer_registration.suggest') }}
            </div>
          </div>

          <!-- Email -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-33px"
          >
            {{ $t('pages.trainer_registration.email') }}
            <span
              class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
            >
              {{
                $t('pages.trainer_registration.required')
              }}
            </span>
          </div>
          <FormTextInput
            v-model="form.email"
            :errors="errors.email"
            type-input="text"
            class="mt-1.5"
            placeholder="sample@example.com"
            :is-disabled="!permissionAddTrainer"
          />

          <!-- Name -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-3 tablet:mt-21px"
          >
            {{ $t('pages.trainer_registration.name') }}
            <span
              class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
            >
              {{
                $t('pages.trainer_registration.required')
              }}
            </span>
          </div>
          <div
            class="trainer-registration__group-name flex justify-between gap-x-8 mt-1.5"
          >
            <div
              class="trainer-registration__group-left flex-1 flex"
            >
              <span
                class="trainer-registration__sublabel text-base leading-21px font-medium pt-4"
              >
                {{
                  $t('pages.trainer_registration.surname')
                }}
              </span>
              <FormTextInput
                v-model="form.lastname"
                :errors="errors.lastname"
                type-input="text"
                class="trainer-registration__input-name ml-2 w-full"
                :placeholder="
                  $t(
                    'pages.trainer_registration.placeholder_surname'
                  )
                "
                :is-disabled="!permissionAddTrainer"
                @input="
                  inputHandler({
                    value: $event.target.value,
                    key: 'lastnameKana',
                  })
                "
              />
            </div>
            <div
              class="trainer-registration__group-right flex-1 flex"
            >
              <span
                class="trainer-registration__sublabel text-base leading-21px font-medium pt-4"
              >
                {{
                  $t(
                    'pages.trainer_registration.given_name'
                  )
                }}
              </span>
              <FormTextInput
                v-model="form.firstname"
                :errors="errors.firstname"
                type-input="text"
                class="trainer-registration__input-name ml-2 w-full"
                :placeholder="
                  $t(
                    'pages.trainer_registration.placeholder_given_name'
                  )
                "
                :is-disabled="!permissionAddTrainer"
                @input="
                  inputHandler({
                    value: $event.target.value,
                    key: 'firstnameKana',
                  })
                "
              />
            </div>
          </div>

          <!-- Name Kana -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-3 tablet:mt-21px"
          >
            {{
              $t('pages.trainer_registration.name_furigana')
            }}
            <span
              class="text-xs tablet:text-sm tablet:leading-19px text-validate font-medium"
            >
              {{
                $t('pages.trainer_registration.required')
              }}
            </span>
          </div>
          <div
            class="trainer-registration__group-name flex justify-between gap-x-8 mt-1.5"
          >
            <div
              class="trainer-registration__group-left flex-1 flex"
            >
              <span
                class="trainer-registration__sublabel text-base leading-21px font-medium pt-4"
              >
                {{
                  $t('pages.trainer_registration.surname')
                }}
              </span>
              <FormTextInput
                v-model="form.lastnameKana"
                :errors="errors.lastnameKana"
                type-input="text"
                class="trainer-registration__input-name ml-2 w-full"
                :placeholder="
                  $t(
                    'pages.trainer_registration.placeholder_surname_kana'
                  )
                "
                :is-disabled="!permissionAddTrainer"
              />
            </div>
            <div
              class="trainer-registration__group-right flex-1 flex"
            >
              <span
                class="trainer-registration__sublabel text-base leading-21px font-medium pt-4"
              >
                {{
                  $t(
                    'pages.trainer_registration.given_name'
                  )
                }}
              </span>
              <FormTextInput
                v-model="form.firstnameKana"
                :errors="errors.firstnameKana"
                type-input="text"
                class="trainer-registration__input-name ml-2 w-full"
                :placeholder="
                  $t(
                    'pages.trainer_registration.placeholder_given_name_kana'
                  )
                "
                :is-disabled="!permissionAddTrainer"
              />
            </div>
          </div>

          <!-- Post code -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
          >
            {{ $t('pages.trainer_registration.post_code') }}
          </div>
          <FormTextInput
            v-model="form.postCode"
            type-input="text"
            class="mt-1.5 max-w-180px <mobile:w-full <mobile:max-w-100"
            :placeholder="
              $t(
                'pages.trainer_registration.placeholder_post_code'
              )
            "
            :errors="errors.postCode"
            :is-disabled="!permissionAddTrainer"
          />

          <!-- Address -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
          >
            {{ $t('pages.trainer_registration.address') }}
          </div>
          <FormTextInput
            v-model="form.address"
            type-input="text"
            class="mt-1.5"
            :placeholder="
              $t(
                'pages.trainer_registration.placeholder_address'
              )
            "
            :is-disabled="!permissionAddTrainer"
          />

          <!-- Building Name -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
          >
            {{
              $t('pages.trainer_registration.building_name')
            }}
          </div>
          <FormTextInput
            v-model="form.buildingName"
            type-input="text"
            class="mt-1.5"
            :placeholder="
              $t(
                'pages.trainer_registration.placeholder_building_name'
              )
            "
            :is-disabled="!permissionAddTrainer"
          />

          <!-- Birthday -->
          <DatePickerCustom
            v-model="date"
            :title="
              $t('pages.trainer_registration.birthday')
            "
            :required="
              $t('pages.trainer_registration.required')
            "
            :errors-year="errors.year"
            :errors-month="errors.month"
            :errors-day="errors.day"
            class="mt-21px tablet:max-w-508px w-full custom-time"
            :is-disabled="!permissionAddTrainer"
          />

          <!-- Gender -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
          >
            {{ $t('pages.trainer_registration.gender') }}
            <span
              class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
            >
              {{
                $t('pages.trainer_registration.required')
              }}
            </span>
          </div>
          <Dropdown
            v-model="form.gender"
            :text-button="
              $t('pages.trainer_registration.please_choose')
            "
            :items="genderList"
            :errors="errors.gender"
            class="w-180px overflow-visible mt-1.5 <mobile:w-full"
            :is-disabled="!permissionAddTrainer"
          />

          <!-- Mobile phone -->
          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
          >
            {{
              $t('pages.trainer_registration.mobile_phone')
            }}
          </div>
          <FormTextInput
            v-model="form.mobilePhone"
            type-input="text"
            class="mt-1.5 max-w-328px <mobile:w-full <mobile:max-w-100"
            :placeholder="
              $t(
                'pages.trainer_registration.placeholder_mobile_phone'
              )
            "
            :is-disabled="!permissionAddTrainer"
          />

          <div
            class="trainer-registration__label text-xs tablet:text-base tablet:leading-21px font-bold mt-21px"
          >
            {{ $t('pages.trainer_registration.remarks') }}
          </div>
          <FormTextInput
            v-model="form.remarks"
            type-input="textarea"
            :rows="3"
            class="mt-1.5"
            :placeholder="
              $t(
                'pages.trainer_registration.placeholder_remarks'
              )
            "
            :is-disabled="!permissionAddTrainer"
          />

          <div class="trainer-registration__action flex">
            <Button
              :type="typeBtn"
              :theme="RoleEnum.ADMIN"
              class="mt-6 tablet:mt-10"
              :class="{ disabled: !permissionAddTrainer }"
              @click="handleSubmit"
            >
              {{ $t('components.button.confirmation') }}
            </Button>
          </div>
          <Loading
            v-if="isLoading"
            :theme="RoleEnum.ADMIN"
            class="absolute w-full h-screen top-0 left-0"
          />
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.trainer-registration {
  &__label {
    color: $color-gray-1;
    .text-validate {
      color: $color-red-1;
    }
  }
  &__sublabel {
    color: $color-gray-1;
  }
  .disabled {
    pointer-events: none;
    touch-action: none;
  }
}

.custom-time {
  :deep(.dropdown-button) {
    width: 167px;
  }
}
</style>
