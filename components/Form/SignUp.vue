<script lang="ts" setup>
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
  sameAs,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { debounce } from 'lodash'
import { RoleEnum } from '@/constants/role'
import { usePlan } from '@/stores/plan'
import { useFacility } from '@/stores/facility'
import { IFacilitySignUp } from '@/interfaces/facility'
import { useCommon } from '@/stores'

const commonStore = useCommon()
const { getAddressList } = useAssets()
const addressList = computed(() => {
  return commonStore?.addressList
})
const { t } = useLang()
const router = useRouter()
const planStore = usePlan()
const facilityStore = useFacility()
const isAgree = ref<number>(0)
const planName = ref<string>('')
const isLoading = ref<boolean>(true)
const form = ref<IFacilitySignUp>({
  facility_name: '',
  facility_name_kata: '',
  facility_zip1: null,
  facility_address1: '',
  facility_address2: '',
  facility_tel: null,
  facility_fax: null,
  facility_email: '',
  president_name: '',
  president_name_kata: '',
  admin_name: '',
  admin_name_kata: '',
  plan_id: '',
  admin_email: '',
  password: '',
  password_confirmation: '',
})
const { convertFurigana } = useHelper()
const rules = computed(() => {
  const validateRequired = {
    required: helpers.withMessage(
      t('components.signup.required_message'),
      required
    ),
  }
  const validatePassword = {
    minLength: helpers.withMessage(
      t('components.login.validate.password.invalid'),
      minLength(8)
    ),
    maxLength: helpers.withMessage(
      t('components.login.validate.password.invalid'),
      maxLength(32)
    ),
  }
  const validateEmail = {
    email: helpers.withMessage(
      t('components.login.validate.email.invalid'),
      email
    ),
  }
  const passwordConfirmation = {
    sameAsPassword: helpers.withMessage(
      t('components.signup.validate.password_confirmation'),
      sameAs(form.value.password)
    ),
  }

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
  return {
    facility_name: validateRequired,
    facility_name_kata: validateRequired,
    facility_zip1: {
      ...validateRequired,
      ...validatePostalCode,
    },
    facility_address1: validateRequired,
    facility_address2: validateRequired,
    facility_email: validateEmail,
    president_name: validateRequired,
    president_name_kata: validateRequired,
    admin_name: validateRequired,
    admin_name_kata: validateRequired,
    plan_id: validateRequired,
    admin_email: { ...validateEmail, ...validateRequired },
    password: { ...validateRequired, ...validatePassword },
    password_confirmation: {
      ...validateRequired,
      ...validatePassword,
      ...passwordConfirmation,
    },
  }
})

const errors = computed(() => {
  return {
    facility_name: v$.value.facility_name.$errors,
    facility_name_kata: v$.value.facility_name_kata.$errors,
    facility_zip1: v$.value.facility_zip1.$errors,
    facility_address1: v$.value.facility_address1.$errors,
    facility_address2: v$.value.facility_address2.$errors,
    facility_email: v$.value.facility_email.$errors,
    president_name: v$.value.president_name.$errors,
    president_name_kata:
      v$.value.president_name_kata.$errors,
    admin_name: v$.value.admin_name.$errors,
    admin_name_kata: v$.value.admin_name_kata.$errors,
    plan_id: v$.value.plan_id.$errors,
    admin_email: v$.value.admin_email.$errors,
    password: v$.value.password.$errors,
    password_confirmation:
      v$.value.password_confirmation.$errors,
  }
})

const planList = computed(() =>
  planStore.planList.map((item) => item.name)
)

const v$ = useValidate(rules, form as any)

watch(
  () => form.value.facility_zip1,
  () => {
    if (
      form.value.facility_zip1?.toString().length === 7 &&
      addressList
    ) {
      const address = addressList.value?.find(
        (item) =>
          item.postcode ===
          form.value.facility_zip1?.toString()
      )
      if (address) {
        form.value.facility_address1 = address.city
        form.value.facility_address2 =
          address.address1 + address.address2
      }
    }
  }
)

const onSubmit = async () => {
  const validate = await v$.value.$validate()
  if (validate) {
    facilityStore.facilityFormSignup = form.value
    router.push('/signup-confirmation')
  } else {
    document
      .getElementsByClassName('error-text')[0]
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }
}

const onSelectPlan = () => {
  const plan = planStore.planList.find(
    (item) => item.name === planName.value
  )
  if (plan) {
    form.value.plan_id = (plan.id as number).toString()
  }
}

const inputHandler = debounce(async (event) => {
  const furigana: string = await convertFurigana(
    event.value
  )
  form.value[event.key] = furigana
}, 500)

onMounted(async () => {
  getAddressList()
  if (facilityStore.facilityFormSignup) {
    form.value = facilityStore.facilityFormSignup
    const plan = planStore.planList.find(
      (item) =>
        (item.id as number).toString() ===
        form.value.plan_id
    )
    planName.value = plan?.name || 'ー'
  }
  await planStore.getPlanListAvailable()
  isLoading.value = false
})

onBeforeRouteLeave((to) => {
  if (to.name !== 'signup-confirmation') {
    facilityStore.facilityFormSignup = null
  }
})
</script>

<template>
  <Loading v-if="isLoading" :theme="RoleEnum.ADMIN" />
  <div
    v-else
    class="flex flex-col items-center sign-up-form"
  >
    <div class="title mb-40px select-none">
      {{ $t('components.signup.title_form') }}
    </div>
    <div class="form-content">
      <div class="content-title mb-16px">
        {{ $t('components.signup.facility_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.facility_name') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.facility_name"
          :errors="errors.facility_name"
          :placeholder="
            $t(
              'components.signup.placeholder.facility_name'
            )
          "
          class="form-row-input"
          @input="
            inputHandler({
              value: $event.target.value,
              key: 'facility_name_kata',
            })
          "
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{
            $t('components.signup.facility_name_furigana')
          }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.facility_name_kata"
          :errors="errors.facility_name_kata"
          :placeholder="
            $t(
              'components.signup.placeholder.facility_name_furigana'
            )
          "
          class="form-row-input"
        />
      </div>
      <div class="form-row postal-code">
        <div class="form-row-label">
          {{ $t('components.signup.address') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <div class="flex flex-col gap-16px flex-1">
          <FormTextInput
            v-model="form.facility_zip1 as number"
            :max-length="7"
            :errors="errors.facility_zip1"
            placeholder="0000000"
            class="form-row-input max-w-228px"
            :label="
              $t('components.signup.label.postal_code')
            "
          />
          <FormTextInput
            v-model="form.facility_address1"
            :errors="errors.facility_address1"
            :placeholder="
              $t(
                'components.signup.placeholder.prefectures'
              )
            "
            class="form-row-input max-w-228px"
            :label="$t('components.signup.label.district')"
          />
          <!-- <Dropdown v-model="form.facility_address1" :items="FAKE_DISTRICTS" :errors="errors.facility_address1" :label="$t('components.signup.label.district')"
                                                                                                                                                            class="form-row-input max-w-228px min-h-54px" text-button="" /> -->
          <FormTextInput
            v-model="form.facility_address2"
            :errors="errors.facility_address2"
            :placeholder="
              $t('components.signup.placeholder.address')
            "
            class="form-row-input w-full"
            :label="$t('components.signup.label.address')"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.phone_number') }}
        </div>
        <FormTextInput
          v-model="form.facility_tel as number"
          placeholder="00000000000"
          class="form-row-input"
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.fax_number') }}
        </div>
        <FormTextInput
          v-model="form.facility_fax as number"
          placeholder="00000000000"
          class="form-row-input"
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.email') }}
        </div>
        <FormTextInput
          v-model="form.facility_email"
          :errors="errors.facility_email"
          placeholder="sample@example.com"
          class="form-row-input"
        />
      </div>
      <div class="content-title mb-16px space-top">
        {{ $t('components.signup.president_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.president_name') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.president_name"
          :errors="errors.president_name"
          :placeholder="
            $t(
              'components.signup.placeholder.president_name'
            )
          "
          class="form-row-input"
          @input="
            inputHandler({
              value: $event.target.value,
              key: 'president_name_kata',
            })
          "
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{
            $t('components.signup.president_name_furigana')
          }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.president_name_kata"
          :errors="errors.president_name_kata"
          :placeholder="
            $t(
              'components.signup.placeholder.president_name_furigana'
            )
          "
          class="form-row-input"
        />
      </div>
      <div class="content-title mb-16px space-top">
        {{ $t('components.signup.contact_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.manager_name') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.admin_name"
          :errors="errors.admin_name"
          :placeholder="
            $t(
              'components.signup.placeholder.president_name'
            )
          "
          class="form-row-input"
          @input="
            inputHandler({
              value: $event.target.value,
              key: 'admin_name_kata',
            })
          "
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{
            $t('components.signup.manager_name_furigana')
          }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.admin_name_kata"
          :errors="errors.admin_name_kata"
          :placeholder="
            $t(
              'components.signup.placeholder.president_name_furigana'
            )
          "
          class="form-row-input"
        />
      </div>
      <div class="content-title mb-16px space-top">
        {{ $t('components.signup.account_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.plan') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <Dropdown
          v-model="planName"
          :items="planList"
          :errors="errors.plan_id"
          class="form-row-input min-h-54px"
          text-button=""
          @on-selected="onSelectPlan"
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.login_id') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <FormTextInput
          v-model="form.admin_email"
          :errors="errors.admin_email"
          :placeholder="
            $t('components.signup.placeholder.login_id')
          "
          class="form-row-input"
        />
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.password') }}
          <span>
            {{ $t('components.signup.required') }}
          </span>
        </div>
        <div class="flex flex-col gap-8px flex-1">
          <FormTextInput
            v-model="form.password"
            :errors="errors.password"
            :type-input="'password'"
            :placeholder="
              $t('components.signup.placeholder.password')
            "
            class="form-row-input w-full"
          />
          <FormTextInput
            v-model="form.password_confirmation"
            :errors="errors.password_confirmation"
            :type-input="'password'"
            :placeholder="
              $t(
                'components.signup.placeholder.confirm_password'
              )
            "
            class="form-row-input w-full"
          />
        </div>
      </div>
    </div>
    <div
      class="flex justify-center items-center mt-47px mb-45px"
    >
      <FormCheckbox
        v-model="isAgree"
        :theme="RoleEnum.ADMIN"
        class="checkbox w-20px"
      >
      </FormCheckbox>
      <a href="/policy" target="_blank" class="policy-link">
        <span>
          {{ $t('components.signup.privacy_policy') }}
        </span>
      </a>
      {{ $t('components.signup.agree_to') }}
    </div>
    <Button
      class="button"
      :theme="RoleEnum.ADMIN"
      :is-disabled="!isAgree"
      @click="onSubmit"
    >
      {{ $t('components.signup.to_confirmation') }}
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.sign-up-form {
  margin: auto;
  margin-top: 56px;
  margin-bottom: 40px;
  width: 1000px;
  letter-spacing: 0;
  font-family: 'Noto Sans JP';

  .title {
    font-weight: 700;
    font-size: 28px;
    line-height: 41px;
    color: $color-black;
  }

  .form-content {
    background: $color-white;
    border-radius: 20px;
    padding: 40px;
    padding-bottom: 8px;
    width: 100%;

    .content-title {
      font-family: 'Noto Sans JP';
      font-weight: 700;
      font-size: 26px;
      line-height: 38px;
      color: $color-black;

      &.space-top {
        margin-top: 56px;
      }
    }

    .form-row {
      display: flex;
      margin-bottom: 32px;
      gap: 16px;

      &.postal-code .form-row-label {
        margin-top: 40px;
      }
    }

    .form-row-label {
      display: flex;
      align-items: center;
      width: 196px;
      font-weight: 500;
      font-size: 16px;
      line-height: 23px;
      height: 23px;
      margin-top: 16px;
      color: $color-black;

      span {
        margin-left: 8px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: $color-red-3;
      }
    }

    .form-row-input {
      flex: 1;
      letter-spacing: 0;

      &:deep(.input),
      &:deep(.dropdown-button) {
        background-color: $color-white;
        border-radius: 10px;
        max-height: 54px;
        height: 54px;

        &::-webkit-input-placeholder {
          color: $color-gray-7;
        }

        &:-ms-input-placeholder {
          color: $color-gray-7;
        }

        &::placeholder {
          color: $color-gray-7;
        }
      }

      &:deep(.label) {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: $color-black;
        margin-bottom: 4px;
        letter-spacing: 0;
      }

      &:deep(.dropdown-button) {
        .icon-down {
          right: 8px;
        }
      }
    }
  }

  .checkbox {
    font-family: 'Noto Sans JP';
    // height: 32px;
    font-weight: 400;
    font-size: 16px;
    line-height: 200%;
    letter-spacing: 3px;

    &:deep(.form-checkbox__text) {
      margin-left: 6px;

      .icon-uncheck {
        color: $color-gray-7;
      }
    }

    &:deep(.icon-uncheck::before) {
      color: $color-gray-7;
    }
  }

  .policy-link {
    span {
      text-decoration-line: underline;
      text-underline-offset: 2px;
      margin-left: 8px;
      font-family: 'Noto Sans JP';
      font-size: 16px;
      line-height: 200%;
      font-weight: 400;
      color: $color-kanrisha;
      letter-spacing: 0px;
      cursor: pointer;
    }
  }

  .button {
    letter-spacing: 1px;
    font-family: 'Noto Sans JP';
    font-weight: 700;
    font-size: 18px;
    line-height: 150%;
  }

  @media screen and (max-width: calc($screen-desktop - 100px)) {
    margin-top: 32px;
    width: 95%;
  }

  @media screen and (max-width: $screen-tablet) {
    .title {
      font-size: 20px;
      line-height: unset;
      margin-bottom: 32px;
    }

    .form-content {
      padding: 16px;

      .content-title {
        font-size: 20px;
        line-height: unset;

        &.space-top {
          margin-top: 32px;
        }
      }

      .form-row {
        margin-bottom: 16px;
        gap: 8px;
        flex-direction: column;

        .form-row-label {
          margin-top: 0px !important;
        }
      }
    }
  }
}
</style>
