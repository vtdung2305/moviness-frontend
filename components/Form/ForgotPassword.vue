<script lang="ts" setup>
import {
  required,
  minLength,
  maxLength,
  helpers,
  sameAs,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

const { t } = useLang()
const route = useRoute()
const router = useRouter()
const { $api, $showModal, $hiddenModal } = useNuxtApp()
const isLoading = ref<boolean>(true)
const success = ref<boolean>(false)
const isSubmit = ref<boolean>(false)
const errorMessage = ref<string>('')
const alert = ref<string>('')
const form = ref({
  password: '',
  password_confirmation: '',
})
const email = ref<string>('')

const rules = computed(() => {
  const validateRequired = (key: string) => ({
    required: helpers.withMessage(
      t(`pages.forgot-password.validate.${key}`),
      required
    ),
  })
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
  const passwordConfirmation = {
    sameAsPassword: helpers.withMessage(
      t('components.signup.validate.password_confirmation'),
      sameAs(form.value.password)
    ),
  }
  return {
    password: {
      ...validateRequired('password'),
      ...validatePassword,
    },
    password_confirmation: {
      ...validateRequired('password_confirmation'),
      ...validatePassword,
      ...passwordConfirmation,
    },
  }
})

const errors = computed(() => {
  return {
    password: v$.value.password.$errors,
    password_confirmation:
      v$.value.password_confirmation.$errors,
  }
})

const v$ = useValidate(rules, form as any)

const onSubmit = async () => {
  const validate = await v$.value.$validate()
  if (validate) {
    const token = route.params.id as string
    const params = {
      check_token: 0,
      password: form.value.password,
      password_confirmation:
        form.value.password_confirmation,
    }
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    $api.auth
      .resetPassword(token, params)
      .then((e) => {
        isLoading.value = false
        success.value = true
      })
      .catch(() => {
        isLoading.value = false
        success.value = false
        alert.value = t('others.server_error')
        $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      })
    isSubmit.value = false
  }
}

onMounted(() => {
  const token = route.params.id as string
  const params = {
    check_token: 1,
  }
  if (token && token !== 'login') {
    $api.auth
      .resetPassword(token, params)
      .then((e) => {
        isLoading.value = false
        errorMessage.value = ''
        email.value = e.data.email
      })
      .catch(() => {
        isLoading.value = false
        errorMessage.value = t('others.server_error')
      })
  } else {
    router.replace('/signup')
  }
})
</script>

<template>
  <PageWrapper
    class="flex flex-col items-center justify-center"
  >
    <div
      v-if="!success"
      class="w-full flex justify-content items-center"
      :class="{ 'h-60vh': errorMessage.length }"
    >
      <Loading v-if="isLoading" class="w-full h-full" />
      <div
        v-else-if="errorMessage.length"
        class="text-center mt-10 w-100vw <sm:p-4"
      >
        {{ errorMessage }}
      </div>
      <div
        v-else
        class="flex flex-col items-center sign-up-form"
      >
        <div class="title mb-40px select-none">
          {{ $t('pages.forgot-password.title') }}
        </div>
        <div class="form-content">
          <div class="content-title mb-16px">
            {{ $t('pages.forgot-password.sub-title') }}
          </div>

          <div class="form-row">
            <div class="form-row-label">
              {{ $t('pages.forgot-password.email') }}
            </div>
            <div class="form-row-label email">
              {{ email }}
            </div>
          </div>

          <div class="form-row">
            <div class="form-row-label">
              {{ $t('pages.forgot-password.password') }}
              <span>
                {{ $t('components.signup.required') }}
              </span>
            </div>
            <FormTextInput
              v-model="form.password"
              :errors="errors.password"
              :type-input="'password'"
              :placeholder="
                t(
                  'pages.forgot-password.placeholder_password'
                )
              "
              class="form-row-input"
            />
          </div>
          <div class="form-row">
            <div class="form-row-label">
              {{
                $t(
                  'pages.forgot-password.password_confirmation'
                )
              }}
              <span>
                {{ $t('components.signup.required') }}
              </span>
            </div>
            <FormTextInput
              v-model="form.password_confirmation"
              :errors="errors.password_confirmation"
              :type-input="'password'"
              :placeholder="
                t(
                  'pages.forgot-password.placeholder_password_confirmation'
                )
              "
              class="form-row-input"
            />
          </div>
        </div>
        <Button
          class="button mt-97px"
          :theme="RoleEnum.ADMIN"
          @click="onSubmit"
        >
          {{ $t('pages.forgot-password.button') }}
        </Button>
      </div>
    </div>
    <div
      v-else
      class="w-full h-46vh flex justify-center flex-col"
    >
      <div class="title text-center mb-65px select-none">
        {{ $t('pages.forgot-password.title_success') }}
      </div>
      <div class="tablet:ml-20px mb-10px <sm:p-4">
        {{ $t('pages.forgot-password.note1') }}
      </div>
      <div class="tablet:ml-20px <sm:p-4">
        {{ $t('pages.forgot-password.note2') }}
      </div>
    </div>
    <ModalWrapper
      :id="ModalNameEnum.ALERT_REGISTER_MEMBER"
      content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
    >
      <div class="text-22px leading-22px font-bold title">
        {{ $t('others.title_modal_common') }}
      </div>
      <div class="text-16px leading-16px sub-title">
        {{ alert }}
      </div>
      <Button
        type="primary"
        class="w-280px h-52px"
        :theme="RoleEnum.ADMIN"
        @click="
          $hiddenModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
        "
      >
        {{ $t('components.button.close') }}
      </Button>
    </ModalWrapper>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.title {
  font-weight: 700;
  font-size: 28px;
  line-height: 41px;
  color: $color-black;
}
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
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 38px;
      display: flex;
      align-items: center;

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

      &.email {
        width: calc(100% - 236px);

        @media screen and (max-width: $screen-tablet) {
          width: 100%;
        }
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
