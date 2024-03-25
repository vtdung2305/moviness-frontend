<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'
import { useFacility } from '@/stores/facility'
import { ModalNameEnum } from '@/constants/modal'
import { IFacilitySignUp } from '@/interfaces/facility'
import { usePlan } from '@/stores/plan'

const { t } = useLang()
const router = useRouter()
const facilityStore = useFacility()
const { $api, $showModal } = useNuxtApp()
const planStore = usePlan()
const { getFullPostalCode } = useHelper()

const alert = ref<string>('')
const isSubmitError = ref<boolean>(false)

onBeforeMount(() => {
  if (!facilityStore.facilityFormSignup) {
    router.replace('/signup')
  }
})

const planName = computed<string>(() => {
  if (!facilityStore.facilityFormSignup) {
    return ''
  }
  const plan = planStore.planList.find(
    (item) =>
      item.id.toString() ===
      facilityStore.facilityFormSignup?.plan_id
  )
  return plan?.name || t('others.empty')
})

const onSubmit = () => {
  $api.facility
    .signup({
      ...(facilityStore.facilityFormSignup as IFacilitySignUp),
      facility_address1: ((facilityStore.facilityFormSignup
        ?.facility_address1 as string) +
        facilityStore.facilityFormSignup
          ?.facility_address2) as string,
      facility_address2: '',
      facility_zip1:
        facilityStore.facilityFormSignup?.facility_zip1
          ?.toString()
          .slice(0, 3),
      facility_zip2:
        facilityStore.facilityFormSignup?.facility_zip1
          ?.toString()
          .slice(3, 7),
    })
    .then(() => {
      alert.value = t(
        'components.modal.signup_alert.success'
      )
      isSubmitError.value = false
      $showModal(ModalNameEnum.FACILITY_SIGUP_ALERT)
    })
    .catch((e) => {
      if (e.response?._data?.errors) {
        const keyError = Object.keys(
          e.response?._data?.errors
        )[0]
        alert.value = e.response?._data?.errors[keyError][0]
      } else {
        alert.value = e.response?._data?.message || ''
      }
      isSubmitError.value = true
      $showModal(ModalNameEnum.FACILITY_SIGUP_ALERT)
    })
}

const onClickAlert = () => {
  if (isSubmitError.value) {
    router.back()
  } else {
    facilityStore.facilityFormSignup = null
    router.push(`/app/${RoleEnum.ADMIN}/login`)
  }
}
onBeforeRouteLeave((to) => {
  if (to.name !== 'signup') {
    facilityStore.facilityFormSignup = null
  }
})
</script>

<template>
  <div class="flex flex-col items-center sign-up-form">
    <div class="title mb-40px">
      {{ $t('components.signup.title_confirm') }}
    </div>
    <div class="sub-title mb-40px">
      {{ $t('components.signup.sub_title_confirm') }}
    </div>
    <div class="form-content">
      <div class="content-title mb-16px">
        {{ $t('components.signup.facility_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.facility_name') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.facility_name || $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{
            $t('components.signup.facility_name_furigana')
          }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.facility_name_kata || $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row postal-code">
        <div class="form-row-label">
          {{ $t('components.signup.address') }}
        </div>
        <div class="flex flex-col gap-8px flex-1">
          <div class="form-row-value">
            {{
              getFullPostalCode(
                facilityStore.facilityFormSignup
                  ?.facility_zip1 as string
              ) || $t('others.empty')
            }}
          </div>
          <div class="form-row-value">
            {{
              facilityStore.facilityFormSignup
                ?.facility_address1 || $t('others.empty')
            }}
          </div>
          <div class="form-row-value">
            {{
              facilityStore.facilityFormSignup
                ?.facility_address2 || $t('others.empty')
            }}
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.phone_number') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.facility_tel || $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.fax_number') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.facility_fax || $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.email') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.facility_email || $t('others.empty')
          }}
        </div>
      </div>
      <div class="content-title mb-16px space-top">
        {{ $t('components.signup.president_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.president_name') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.president_name || $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{
            $t('components.signup.president_name_furigana')
          }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.president_name_kata || $t('others.empty')
          }}
        </div>
      </div>
      <div class="content-title mb-16px space-top">
        {{ $t('components.signup.contact_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.manager_name') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup?.admin_name ||
            $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{
            $t('components.signup.manager_name_furigana')
          }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup
              ?.admin_name_kata || $t('others.empty')
          }}
        </div>
      </div>
      <div class="content-title mb-16px space-top">
        {{ $t('components.signup.account_information') }}
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.plan') }}
        </div>
        <div class="form-row-value">{{ planName }}</div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.login_id') }}
        </div>
        <div class="form-row-value">
          {{
            facilityStore.facilityFormSignup?.admin_email ||
            $t('others.empty')
          }}
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-label">
          {{ $t('components.signup.password') }}
        </div>
        <div class="form-row-value">
          ・・・・・・・・・・・・・・・・
        </div>
      </div>
      <div class="form-row mt-56px">
        <div class="form-row-label">
          {{ $t('components.signup.privacy_policy') }}
        </div>
        <div class="form-row-value">
          {{ $t('components.signup.agree') }}
        </div>
      </div>
    </div>
    <Button
      class="button"
      :theme="RoleEnum.ADMIN"
      @click="onSubmit"
    >
      {{ $t('components.signup.register') }}
    </Button>
    <ModalSignupAlert :text="alert" @click="onClickAlert" />
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

  .sub-title {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    color: $color-black;
    text-align: center;
  }

  .form-content {
    background: $color-white;
    border-radius: 20px;
    padding: 40px;
    padding-bottom: 16px;
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
      margin-bottom: 24px;
      padding-bottom: 24px;
      gap: 52px;
      border-bottom: 1px solid $color-gray-8;

      &.postal-code .form-row-label {
        margin-top: 12px;
      }
    }

    .form-row-label {
      font-weight: 500;
      font-size: 16px;
      line-height: 23px;
      color: $color-black;
      width: 160px;
    }

    .form-row-value {
      font-weight: 500;
      font-size: 16px;
      line-height: 23px;
      color: $color-black;
    }
  }

  .button {
    letter-spacing: 1px;
    font-family: 'Noto Sans JP';
    font-weight: 700;
    font-size: 18px;
    line-height: 150%;
    margin-top: 40px;
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
