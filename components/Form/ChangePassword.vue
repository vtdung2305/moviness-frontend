<script lang="ts" setup>
import { PropType } from 'vue'
import {
  required,
  minLength,
  maxLength,
  helpers,
  sameAs,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { useUser } from '@/stores/user'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { ModalNameEnum } from '@/constants/modal'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const form = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const userStore = useUser()
const isLoadingPage = ref(false)
const { t } = useLang()
const { $api, $showModal, $hiddenModal } = useNuxtApp()
const alert = ref<string>('')
const router = useRouter()

const content = computed(() => {
  if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
    return t('pages.change_password.content_shinseido')
  }
  if (userStore.roleName === RoleEnum.ADMIN) {
    return t('pages.change_password.content_kanrisha')
  }
  if (userStore.roleName === RoleEnum.TRAINER) {
    return t('pages.change_password.content_trainer')
  }
})

const routerPath = computed(() => {
  if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
    return '/app/shinseido/login'
  }
  if (userStore.roleName === RoleEnum.ADMIN) {
    return '/app/kanrisha/login'
  }
  if (userStore.roleName === RoleEnum.TRAINER) {
    return '/app/trainer/login'
  }
})

const rules = computed(() => {
  const validateRequired = (key: string) => ({
    required: helpers.withMessage(
      t(`pages.change_password.validate.${key}`),
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
    current_password: validateRequired('current_password'),
    password: {
      ...validateRequired('new_password'),
      ...validatePassword,
    },
    password_confirmation: {
      ...validateRequired('re_new_password'),
      ...validatePassword,
      ...passwordConfirmation,
    },
  }
})

const v$ = useValidate(rules, form as any)

const errors = computed(() => {
  return {
    current_password: v$.value.current_password.$errors,
    password: v$.value.password.$errors,
    password_confirmation:
      v$.value.password_confirmation.$errors,
  }
})

const onSubmit = async () => {
  const validate = await v$.value.$validate()

  if (validate) {
    $showModal(ModalNameEnum.CONFIRM_CHANGE_PASSWORD)
  }
}

const onChangePassword = async () => {
  $hiddenModal(ModalNameEnum.CONFIRM_CHANGE_PASSWORD)

  const params = {
    current_password: form.value.current_password,
    password: form.value.password,
    password_confirmation: form.value.password_confirmation,
  }
  $api.auth
    .changePassword(params)
    .then(async (e) => {
      await userStore.logout()
      router.push(`${routerPath}`)
    })
    .catch((e) => {
      if (e.response?._data?.errors) {
        const keyError = Object.keys(
          e.response?._data?.errors
        )[0]
        alert.value = e.response?._data?.errors[keyError][0]
      } else {
        alert.value = t('others.server_error')
      }
      $showModal(ModalNameEnum.ALERT_CHANGE_PASSWORD)
    })
}
</script>

<template>
  <div v-if="!isLoadingPage" class="mt-46px">
    <div
      class="row-form"
      :class="{
        'row-error': errors.current_password.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.change_password.current_password') }}
        <span>
          {{ $t('pages.change_password.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.current_password"
          :errors="errors.current_password"
          :type-input="'password'"
          :placeholder="
            $t('pages.change_password.placeholder')
          "
          class="flex-1"
        />
      </div>
    </div>
    <div
      class="row-form"
      :class="{
        'row-error': errors.password.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.change_password.new_password') }}
        <span>
          {{ $t('pages.change_password.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.password"
          :errors="errors.password"
          :type-input="'password'"
          :placeholder="
            $t('pages.change_password.placeholder')
          "
          class="flex-1"
        />
      </div>
    </div>
    <div
      class="row-form"
      :class="{
        'row-error': errors.password_confirmation.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.change_password.re_new_password') }}
        <span>
          {{ $t('pages.change_password.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.password_confirmation"
          :errors="errors.password_confirmation"
          :type-input="'password'"
          :placeholder="
            $t('pages.change_password.placeholder')
          "
          class="flex-1"
        />
      </div>
    </div>
    <Button
      :theme="props.theme"
      class="mt-38px"
      @click="onSubmit"
    >
      {{ $t('components.button.save') }}
    </Button>
  </div>
  <Loading
    v-if="isLoadingPage"
    :theme="userStore.roleName"
    class="absolute w-full h-screen top-0 left-0"
  />
  <ModalWrapper
    :id="ModalNameEnum.CONFIRM_CHANGE_PASSWORD"
    content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
  >
    <div class="text-22px leading-22px font-bold title">
      {{ $t('others.title_modal_confirm') }}
    </div>
    <div class="text-16px leading-24px sub-title">
      {{ content }}
    </div>
    <Button
      type="primary"
      class="w-280px h-52px"
      :theme="userStore.roleName"
      @click="onChangePassword"
    >
      {{ $t('pages.change_password.btn_change_password') }}
    </Button>
    <div
      class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
      @click="
        $hiddenModal(ModalNameEnum.CONFIRM_CHANGE_PASSWORD)
      "
    >
      {{ $t('pages.change_password.btn_cancel') }}
    </div>
  </ModalWrapper>
  <ModalWrapper
    :id="ModalNameEnum.ALERT_CHANGE_PASSWORD"
    content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
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
      :theme="userStore.roleName"
      @click="
        $hiddenModal(ModalNameEnum.ALERT_CHANGE_PASSWORD)
      "
    >
      {{ $t('components.button.close') }}
    </Button>
  </ModalWrapper>
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
.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
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
