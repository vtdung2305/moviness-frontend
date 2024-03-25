<script lang="ts" setup>
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
} from '@vuelidate/validators'
import { computed, PropType } from 'vue'
import useValidate from '@vuelidate/core'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'
import { IUserLoginData } from '@/interfaces/user'
import { Theme } from '@/interfaces/role'
import { CookieKeyEnum } from '@/constants/cookie'
import { ModalNameEnum } from '@/constants/modal'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  roleLogin: {
    type: Number,
    default: RoleEnum.ADMINISTRANTOR_ID,
  },
})

const { t } = useLang()
const router = useRouter()
const userStore = useUser()
const isLoading = ref<Boolean>(false)
const { $api, $showModal, $hiddenModal } = useNuxtApp()

const form = ref<IUserLoginData>({
  email: '',
  password: '',
  remember_token: 0,
  role: props.roleLogin,
})

const refInputEmail = ref(null)
const messageLogin = ref('')

const msgVerifyResend = `${t(
  'components.login.msg_verify1'
)}<br>${t('components.login.msg_verify2')}`

const msgVerifySuccess = `${t(
  'components.login.msg_verify_success1'
)}<br>${t('components.login.msg_verify_success2')}`

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(
        t('components.login.validate.email.required'),
        required
      ),
      email: helpers.withMessage(
        t('components.login.validate.email.invalid'),
        email
      ),
    },
    password: {
      required: helpers.withMessage(
        t('components.login.validate.password.required'),
        required
      ),
      minLength: helpers.withMessage(
        t('components.login.validate.errors'),
        minLength(8)
      ),
      maxLength: helpers.withMessage(
        t('components.login.validate.errors'),
        maxLength(32)
      ),
    },
  }
})

const errors = computed(() => {
  let errorPassword = v$.value.password.$errors
  if (messageLogin.value) {
    errorPassword = [
      ...errorPassword,
      { $message: messageLogin.value },
    ]
  }
  return {
    email: v$.value.email.$errors,
    password: errorPassword,
  }
})

const v$ = useValidate(rules, form as any)

const handleInput = (field: 'email' | 'password') => {
  messageLogin.value = ''
}

const login = async () => {
  checkAlreadyExist()
  const validate = await v$.value.$validate()
  if (validate && !messageLogin.value) {
    isLoading.value = true
    await userStore
      .login(form.value as IUserLoginData)
      .then(() => {
        userStore.isAuthenticated &&
          router.replace(`/app/${userStore.roleName}`)
      })
      .catch((error) => {
        // console.log(error.response)

        if (
          error.response?._data?.error_code ===
            'facility_expired' ||
          error.response?._data?.error_code ===
            'facility_inactived'
        ) {
          userStore.setPurchaseReminder({
            plan: error.response?._data?.data?.plan?.name,
            email:
              error.response?._data?.data
                ?.address_email_support,
          })
          router.push('/purchase-reminder')
          return
        }

        if (
          error.response?._data?.error_code ===
          'user_is_not_verify'
        ) {
          $showModal(ModalNameEnum.VERIFY_ACCOUNT)
        }
        messageLogin.value = error.response?._data?.message
      })
  }
  isLoading.value = false
}
const checkAlreadyExist = () => {
  if (!document.hidden) {
    const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)
    const userData = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    if (token.value && userData) {
      location.reload()
    }
  }
}

const resendVerifyAccount = async () => {
  try {
    $hiddenModal(ModalNameEnum.VERIFY_ACCOUNT)
    isLoading.value = true
    const res = await $api.auth.resendVerifyAccount(
      form.value.email as string
    )
    if (res && res.data) {
      $showModal(ModalNameEnum.VERIFY_ACCOUNT_SUCCESS)
    }
  } catch (error) {
    console.log(error)
  }
  isLoading.value = false
}

onMounted(() => {
  document.addEventListener(
    'visibilitychange',
    checkAlreadyExist
  )
})

onBeforeUnmount(() => {
  document.removeEventListener(
    'visibilitychange',
    checkAlreadyExist
  )
})

const getImageUrlLogo = () => {
  return new URL(
    `../../assets/images/logos/logo-login-${props.theme}.png`,
    import.meta.url
  ).href
}
</script>

<template>
  <div :class="`pt-7px login-form login-form--${theme}`">
    <NuxtLink to="/">
      <img
        class="logo mb-32px cursor-pointer"
        :src="getImageUrlLogo()"
        :alt="`${theme}`"
      />
    </NuxtLink>
    <FormTextInput
      v-model="form.email as string"
      type-input="email"
      :label="$t('components.login.label.email')"
      class="mb-24px"
      placeholder="sample@example.com"
      :errors="errors.email"
      :is-valid-data="!messageLogin"
      @update:model-value="handleInput('email')"
      @on-enter=";(refInputEmail as any).focus()"
    />
    <FormTextInput
      ref="refInputEmail"
      v-model="form.password as string"
      type-input="password"
      :label="$t('components.login.label.password')"
      class="mb-20px"
      :placeholder="
        $t('components.login.placeholder.password')
      "
      :errors="errors.password"
      @update:model-value="handleInput('password')"
      @on-enter="login"
    />
    <FormCheckbox
      v-model="form.remember_token"
      :text="$t('components.login.remember')"
      :theme="theme"
    />
    <Button
      type="primary"
      :theme="theme"
      class="mt-20px"
      @click="login"
    >
      <span class="text-18px font-bold">
        {{ $t('components.login.button_login') }}
      </span>
    </Button>
    <div class="forgot-password text-center mt-16px">
      <NuxtLink
        to="/forgot-password"
        class="text-sm font-medium underline cursor-pointer transition-opacity ease-in duration-200 hover:opacity-60"
      >
        {{ $t('components.login.forgot_password') }}
      </NuxtLink>
    </div>
    <Loading
      v-if="isLoading"
      :theme="theme"
      :message="$t('common.loading_login')"
      class="absolute w-full h-screen top-0 left-0"
    />

    <ModalWrapper
      :id="ModalNameEnum.VERIFY_ACCOUNT"
      content-class="px-56px py-40px w-11/12 tablet:max-w-392px mt-176px flex flex-col gap justify-center <mobile:px-25px"
    >
      <div
        class="text-22px leading-22px font-bold title text-center"
      >
        {{ $t('others.title_modal_confirm') }}
      </div>
      <div
        class="text-16px leading-24px sub-title mb-20px"
        v-html="msgVerifyResend"
      ></div>
      <Button
        type="primary"
        class="w-280px h-52px mx-auto"
        :theme="RoleEnum.ADMIN"
        @click="resendVerifyAccount"
        >{{ $t('components.login.btn_resend') }}</Button
      >
      <div
        class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
        @click="$hiddenModal(ModalNameEnum.VERIFY_ACCOUNT)"
      >
        {{ $t('others.cancel_picker') }}
      </div>
    </ModalWrapper>

    <ModalWrapper
      :id="ModalNameEnum.VERIFY_ACCOUNT_SUCCESS"
      content-class="px-56px py-40px w-11/12 tablet:max-w-392px mt-176px flex flex-col gap justify-center <mobile:px-25px"
    >
      <div
        class="text-22px leading-22px font-bold title text-center"
      >
        {{ $t('components.login.title_resend_success') }}
      </div>
      <div
        class="text-16px leading-24px sub-title"
        v-html="msgVerifySuccess"
      ></div>
      <Button
        type="primary"
        class="w-280px h-52px mx-auto"
        :theme="RoleEnum.ADMIN"
        @click="
          $hiddenModal(ModalNameEnum.VERIFY_ACCOUNT_SUCCESS)
        "
        >{{ $t('components.button.close') }}</Button
      >
    </ModalWrapper>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  @media (max-width: 425px) {
    padding: 0px 16px;
  }

  &--shinseido {
    .forgot-password {
      color: $color-shinseido;
    }
  }

  &--trainer {
    .forgot-password {
      color: $color-trainer;
    }
  }

  &--kanrisha {
    .forgot-password {
      color: $color-kanrisha;
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
  white-space: break-spaces;
  text-align: justify;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}
</style>
