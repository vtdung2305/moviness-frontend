<script lang="ts" setup>
import {
  required,
  helpers,
  email,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

// meta
definePageMeta({
  layout: 'seo-page',
})

// composable
const { t } = useLang()
const { $api, $showModal, $hiddenModal } = useNuxtApp()

const form = ref({
  email: '',
})
const alert = ref<string>('')
const messageError = ref<string>('')
const router = useRouter()
const isSubmit = ref<boolean>(false)

const rules = computed(() => {
  const rule = {
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
  }
  return rule
})

const v$ = useValidate(rules, form as any)

const errors = computed(() => {
  return {
    email: v$.value.email.$errors,
  }
})

const onSubmit = async () => {
  const validate = await v$.value.$validate()
  if (validate) {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    $api.auth
      .forgotPassword(form.value.email)
      .then(() => {
        alert.value = t(
          'pages.forgot_password.message_success'
        )
        messageError.value = ''
        $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
      })
      .catch((e) => {
        if (e.response?._data?.errors) {
          const keyError = Object.keys(
            e.response?._data?.errors
          )[0]

          if (keyError === 'email') {
            messageError.value = t(
              'pages.forgot_password.message_error'
            )
          } else {
            alert.value = t('others.server_error')
            $showModal(ModalNameEnum.ALERT_REGISTER_MEMBER)
          }
        } else {
          messageError.value = ''
        }
      })
    isSubmit.value = false
  }
}

watch(errors, () => {
  messageError.value = ''
})

const onCloseAlert = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="flex flex-col items-center w-screen justify-center forgot-password"
  >
    <div class="w-600px @md:w-328px <sm:max-w-11/12">
      <h2
        class="forgot-password__title font-bold mb-4 text-center"
      >
        {{ $t('components.forgot_password.title') }}
      </h2>
      <p class="mb-8">
        {{ $t('components.forgot_password.content') }}
      </p>
      <FormTextInput
        v-model="form.email"
        :errors="errors.email"
        :class="{ 'mb-4': !messageError }"
        :label="
          $t('components.forgot_password.mail_address')
        "
        placeholder="sample@example.com"
      />
      <span
        v-if="messageError"
        class="error-text font-medium mr-2 block pb-4 mt-8px"
      >
        {{ messageError }}
      </span>
      <Button
        type="primary"
        :theme="RoleEnum.ADMIN"
        :is-disabled="!form.email"
        @click="onSubmit()"
      >
        <span class="text-18px font-bold">
          {{ $t('components.forgot_password.button') }}
        </span>
      </Button>
      <ModalWrapper
        :id="ModalNameEnum.ALERT_REGISTER_MEMBER"
        content-class="px-56px w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
      >
        <div class="text-22px leading-22px font-bold title">
          {{ $t('others.title_modal_common') }}
        </div>
        <div class="text-16px leading-24px sub-title">
          {{ alert }}
        </div>
        <Button
          type="primary"
          class="w-280px h-52px"
          :theme="RoleEnum.ADMIN"
          @click="onCloseAlert"
        >
          {{ $t('components.button.close') }}
        </Button>
      </ModalWrapper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.forgot-password {
  height: calc(100vh - 425px);

  @media (max-width: 1024px) {
    height: calc(100vh - 280px);
  }

  &__title {
    font-size: 1.625em;
    letter-spacing: 0.08em;
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

.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
}
</style>
