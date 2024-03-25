<script lang="ts" setup>
import {
  required,
  helpers,
  email,
} from '@vuelidate/validators'
import { computed } from 'vue'
import useValidate from '@vuelidate/core'
import debounce from 'lodash/debounce'
import { RoleEnum } from '@/constants/role'
import { levels } from '@/constants/member'
import { useGroup } from '@/stores/group'
import { useTrainer } from '@/stores/trainer'
import { useUser } from '@/stores/user'
import { useFacility } from '@/stores/facility'
import {
  IMemberLevel,
  IMemberRegister,
} from '@/interfaces/member'
import { useMember } from '@/stores/member'
import { GENDERS } from '@/constants/common'
import { useCommon } from '@/stores'
import { IGroupListOption } from '@/interfaces/group'

const { convertFurigana } = useHelper()
const groupStore = useGroup()
const memberStore = useMember()
const userStore = useUser()
const trainerStore = useTrainer()
const facilityStore = useFacility()
const commonStore = useCommon()

const { getAddressList } = useAssets()
const { t } = useLang()
const router = useRouter()
const gender = ref('')
const date = ref({
  year: '',
  month: '',
  day: '',
})
const levelList = ref<IMemberLevel[]>(levels)
const levelNameList = computed(() =>
  levelList.value.map((item) => item.name)
)
const levelName = ref<string>(levelNameList.value[0])
const trainerId = ref()
const listTrainerName = ref<IGroupListOption[]>([])
const groupId = ref()
const listGroupName = ref<IGroupListOption[]>([])
const form = ref<IMemberRegister>({
  avatar: null,
  karute: '001',
  level: levelList.value[0].value,
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  zip1: '',
  zip2: '',
  address: '',
  building_name: '',
  year: '',
  month: '',
  day: '',
  age: '',
  sex: '',
  tel: '',
  medical_history: '',
  memo: '',
  email: '',
  group_id: '',
  trainer_id: '',
})
const permissionAddMember = ref(true)
const isLoading = ref(false)

const inputHandler = debounce(async (event) => {
  const furigana: string = await convertFurigana(
    event.value
  )
  form.value[event.key] = furigana
}, 500)

const typeBtn = computed(() => {
  return permissionAddMember.value ? 'primary' : 'secondary'
})
const addressList = computed(() => {
  return commonStore?.addressList
})
const groupName = ref('')
const trainerName = ref('')
const rules = computed(() => {
  const validateRequired = (key: string) => ({
    required: helpers.withMessage(
      t(`pages.user_registration.validate.${key}`),
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
    level: validateRequired('level'),
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
    medical_history: validateRequired('medical_history'),
    email: {
      email: helpers.withMessage(
        t('components.login.validate.email.invalid'),
        email
      ),
    },
    trainer_id: {
      required: helpers.withParams(
        {
          message: t('pages.user_edit.validate.trainer_id'),
        },
        (value: string) => {
          if (userStore.roleName === RoleEnum.ADMIN) {
            return helpers.req(value)
          }
          return true
        }
      ),
    },
  }
  return rule
})

const errors = computed(() => {
  return {
    level: v$.value.level.$errors,
    last_name: v$.value.last_name.$errors,
    first_name: v$.value.first_name.$errors,
    last_name_kana: v$.value.last_name_kana.$errors,
    first_name_kana: v$.value.first_name_kana.$errors,
    year: v$.value.year.$errors,
    month: v$.value.month.$errors,
    day: v$.value.day.$errors,
    sex: v$.value.sex.$errors,
    zip1: v$.value.zip1.$errors,
    email: v$.value.email.$errors,
    medical_history: v$.value.medical_history.$errors,
    trainer_id: v$.value.trainer_id.$errors,
  }
})

const v$ = useValidate(rules, form as any)

watch(
  () => form.value.zip1,
  () => {
    if (form.value.zip1.length === 7 && addressList) {
      const address = addressList.value?.find(
        (item) => item.postcode === form.value.zip1
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
    memberStore.memberRegister = form.value
    memberStore.memberRegister.zip1 =
      memberStore.memberRegister.zip1.toString().trim()
    memberStore.memberRegister.tel =
      memberStore.memberRegister.tel.toString().trim()
    memberStore.memberRegister.address =
      memberStore.memberRegister.address.trim()
    memberStore.memberRegister.first_name =
      memberStore.memberRegister.first_name.trim()
    memberStore.memberRegister.first_name_kana =
      memberStore.memberRegister.first_name_kana.trim()
    memberStore.memberRegister.last_name =
      memberStore.memberRegister.last_name.trim()
    memberStore.memberRegister.last_name_kana =
      memberStore.memberRegister.last_name_kana.trim()
    memberStore.memberRegister.building_name =
      memberStore.memberRegister.building_name.trim()
    memberStore.memberRegister.medical_history =
      memberStore.memberRegister.medical_history.trim()
    memberStore.memberRegister.memo =
      memberStore.memberRegister.memo.trim()
    memberStore.memberRegister.email =
      memberStore.memberRegister.email.trim()
    router.push('user-registration-confirmation')
  } else {
    document
      .getElementsByClassName('error-text')[0]
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }
}

const onSelectGroup = () => {
  const group = groupStore.groups?.groupList.find(
    (item) => item.id === groupId.value
  )
  group && (form.value.group_id = group?.id)
}

const onSelectTrainer = async () => {
  const trainer = trainerStore.trainers?.find(
    (item) => item.id === trainerId.value
  )
  groupId.value = ''
  form.value.trainer_id = trainer?.id as number
  await groupStore.getList({
    trainer_id: trainer?.id as number,
  })

  // listGroupName
  listGroupName.value =
    groupStore.groups?.groupList.map((item) => ({
      label: `${item.name || ''} (${t(
        'pages.user_edit.number_of_users'
      )}${item.total_member}${t('pages.user_edit.man')})`,
      value: item.id!,
    })) || []
}

const onSelectLevel = (value: string) => {
  const level = levelList.value.find(
    (item) => item.name === value
  )
  if (level) {
    form.value.level = level.value
  }
}

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

const checkPermission = async () => {
  try {
    const res = await facilityStore.checkPermission()
    if (res && res.data) {
      permissionAddMember.value =
        res.data.permission_add_member || false
    }
  } catch (e) {}
}

onMounted(async () => {
  getAddressList()
  if (!memberStore.memberRegister) {
    isLoading.value = true

    listGroupName.value = [
      {
        label: t('pages.user_edit.not_set'),
        value: t('pages.user_edit.not_set'),
      },
    ]

    if (userStore.roleName === RoleEnum.TRAINER) {
      await groupStore.getList({
        trainer_id: userStore.userData?.id as number,
      })

      // listGroupName
      listGroupName.value =
        groupStore.groups?.groupList.map((item) => ({
          label: `${item.name || ''} (${t(
            'pages.user_edit.number_of_users'
          )}${item.total_member}${t(
            'pages.user_edit.man'
          )})`,
          value: item.id!,
        })) || []
    } else {
      await trainerStore.getListTrainerOfFacility(
        userStore.userData?.facility_id as number
      )
    }
    // listTrainerName
    listTrainerName.value =
      trainerStore.trainers?.map((item) => ({
        label: `${item.last_name || ''} ${
          item.first_name || ''
        }  (${t('pages.user_edit.number_of_users')}${
          item.total_member
        }${t('pages.user_edit.man')})`,
        value: item.id!,
      })) || []
    await checkPermission()
    isLoading.value = false
  }

  if (memberStore.memberRegister) {
    form.value = memberStore.memberRegister
    date.value.year = form.value.year
    date.value.month = form.value.month
    date.value.day = form.value.day
    const level = levelList.value.find(
      (item) => item.value === form.value.level
    )
    gender.value =
      GENDERS[memberStore.memberRegister?.sex as number]
    const group = groupStore.groups?.groupList.find(
      (item) => item.id === form.value.group_id
    )
    group && (groupId.value = group?.id)
    const trainer = trainerStore.trainers?.find(
      (item) => item.id === form.value.trainer_id
    )

    // listTrainerName
    listTrainerName.value =
      trainerStore.trainers?.map((item) => ({
        label: `${item.last_name || ''} ${
          item.first_name || ''
        }  (${t('pages.user_edit.number_of_users')}${
          item.total_member
        }${t('pages.user_edit.man')})`,
        value: item.id!,
      })) || []

    // listGroupName
    listGroupName.value =
      groupStore.groups?.groupList.map((item) => ({
        label: `${item.name || ''} (${t(
          'pages.user_edit.number_of_users'
        )}${item.total_member}${t('pages.user_edit.man')})`,
        value: item.id!,
      })) || []

    trainer &&
      (trainerName.value =
        trainer.last_name + ' ' + trainer.first_name)
    trainer && (trainerId.value = trainer.id)
    if (level) {
      levelName.value = level.name
    }
  }
})
onBeforeRouteLeave((to) => {
  if (
    to.name !==
    `app-${userStore.roleName}-user-registration-confirmation`
  ) {
    memberStore.memberRegister = null
  }
})
</script>

<template>
  <Loading
    v-if="isLoading"
    :theme="userStore.roleName"
    class="w-full h-500px top-0 left-0"
  />
  <template v-else>
    <div class="title select-none">
      {{ $t('pages.user_registration.title_form') }}
    </div>
    <div class="flex gap-16px items-center">
      <UploadAvatar
        v-model="form.avatar as File"
        class="mt-12px"
        :class="`${userStore.roleName}`"
        :is-disabled="!permissionAddMember"
      />
      <div
        v-if="!permissionAddMember"
        class="text-xs tablet:text-base flex-1"
      >
        {{ $t('pages.user_registration.max_member') }}
      </div>
    </div>
    <div class="record-number__title">
      {{ $t('pages.user_registration.record') }}
    </div>
    <div class="record-number__value">
      {{ $t('others.empty') }}
    </div>
    <div
      class="row-form"
      :class="{ 'row-error': errors.level.length }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_registration.level') }}
        <span>
          {{ $t('pages.user_registration.required') }}
        </span>
      </div>
      <Dropdown
        v-model="levelName"
        :items="levelNameList"
        :errors="errors.level"
        :text-button="
          $t('pages.user_registration.default_level')
        "
        class="w-full tablet:w-180px h-53px"
        :is-disabled="!permissionAddMember"
        @on-selected="onSelectLevel"
      />
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
        {{ $t('pages.user_registration.name') }}
        <span>
          {{ $t('pages.user_registration.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_registration.last_name') }}
          </span>
          <FormTextInput
            v-model="form.last_name"
            :errors="errors.last_name"
            :placeholder="
              $t(
                'pages.user_registration.placeholder_last_name'
              )
            "
            class="flex-1 h-53px"
            :is-disabled="!permissionAddMember"
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
            {{ $t('pages.user_registration.first_name') }}
          </span>
          <FormTextInput
            v-model="form.first_name"
            :errors="errors.first_name"
            :placeholder="
              $t(
                'pages.user_registration.placeholder_first_name'
              )
            "
            class="flex-1 h-53px"
            :is-disabled="!permissionAddMember"
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
        {{ $t('pages.user_registration.furigana_name') }}
        <span>
          {{ $t('pages.user_registration.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_registration.last_name') }}
          </span>
          <FormTextInput
            v-model="form.last_name_kana"
            :errors="errors.last_name_kana"
            :placeholder="
              $t(
                'pages.user_registration.placeholder_last_furigana_name'
              )
            "
            class="flex-1 h-53px"
            :is-disabled="!permissionAddMember"
          />
        </div>
        <div class="flex items-center flex-1">
          <span
            class="text-16px leading-16px mr-8px font-500 mt-4px"
          >
            {{ $t('pages.user_registration.first_name') }}
          </span>
          <FormTextInput
            v-model="form.first_name_kana"
            :errors="errors.first_name_kana"
            :placeholder="
              $t(
                'pages.user_registration.placeholder_first_furigana_name'
              )
            "
            class="flex-1 h-53px"
            :is-disabled="!permissionAddMember"
          />
        </div>
      </div>
    </div>
    <div
      class="row-form"
      :class="{
        'row-error': errors.zip1.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_registration.postal_code') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.zip1"
          :max-length="7"
          :errors="errors.zip1"
          placeholder="0000000"
          class="w-full tablet:w-180px h-53px"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div class="row-form pb-2px">
      <div class="row-form__label">
        {{ $t('pages.user_registration.address') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.address"
          :placeholder="
            $t(
              'pages.user_registration.placeholder_address'
            )
          "
          class="flex-1"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_registration.building_name') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.building_name"
          :placeholder="
            $t(
              'pages.user_registration.placeholder_building_name'
            )
          "
          class="flex-1"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div class="row-form">
      <DatePickerCustom
        :model-value="date"
        calculator-old
        :title="$t('pages.user_registration.birth_day')"
        :required="$t('pages.user_registration.required')"
        :errors-day="errors.day"
        :errors-year="errors.year"
        :errors-month="errors.month"
        :is-disabled="!permissionAddMember"
        class="custom-time"
        @update:model-value="onSelectYearOld"
      />
    </div>
    <div
      class="row-form"
      :class="{ 'row-error': errors.sex.length }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_registration.gender') }}
        <span>
          {{ $t('pages.user_registration.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <Dropdown
          v-model="gender"
          :items="GENDERS"
          :errors="errors.sex"
          :text-button="
            $t('pages.user_registration.gender_default')
          "
          class="w-full tablet:w-180px"
          :is-disabled="!permissionAddMember"
          @on-selected="onSelectGender"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_registration.phone_number') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.tel"
          placeholder="00000000000"
          class="w-full tablet:w-329px"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div
      class="row-form"
      :class="{
        'row-error': errors.medical_history.length,
      }"
    >
      <div class="row-form__label">
        {{ $t('pages.user_registration.medical_history') }}
        <span>
          {{ $t('pages.user_registration.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.medical_history"
          :errors="errors.medical_history"
          :placeholder="
            $t(
              'pages.user_registration.placeholder_medical_history'
            )
          "
          type-input="textarea"
          class="flex-1 textarea"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_registration.memo') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.memo"
          :placeholder="
            $t('pages.user_registration.placeholder_memo')
          "
          type-input="textarea"
          class="flex-1 textarea"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div class="row-form">
      <div class="row-form__label">
        {{ $t('pages.user_registration.email') }}
      </div>
      <div class="row-form__content">
        <FormTextInput
          v-model="form.email"
          :errors="errors.email"
          placeholder="sample@example.com"
          class="flex-1"
          :is-disabled="!permissionAddMember"
        />
      </div>
    </div>
    <div
      class="title mt-64px mb-24px"
      v-if="userStore.roleName === RoleEnum.ADMIN"
    >
      {{ $t('pages.user_registration.trainer_info') }}
    </div>
    <div v-else class="title mt-64px mb-24px">
      {{ $t('pages.user_edit.group_info') }}
    </div>
    <div
      v-if="userStore.roleName === RoleEnum.ADMIN"
      class="row-form"
      style="margin-bottom: 24px"
    >
      <div class="row-form__label">
        {{ $t('pages.user_list.trainer') }}
        <span>
          {{ $t('pages.user_registration.required') }}
        </span>
      </div>
      <div class="row-form__content">
        <Dropdown
          v-model="trainerId"
          :object-item="listTrainerName"
          :errors="errors.trainer_id"
          :text-button="
            $t('pages.user_registration.group_name_default')
          "
          class="w-full tablet:w-330px"
          :is-disabled="!permissionAddMember"
          @on-selected="onSelectTrainer"
        />
      </div>
      <span
        v-if="
          errors.trainer_id && errors.trainer_id.length > 0
        "
        class="error-text font-medium mr-2"
      >
        {{ errors.trainer_id[0].$params.message }}
      </span>
    </div>
    <div class="row-form" style="margin-bottom: 14px">
      <div class="row-form__label">
        {{ $t('pages.user_registration.group_name') }}
      </div>
      <div class="row-form__content">
        <Dropdown
          v-model="groupId"
          :object-item="listGroupName"
          :text-button="
            listGroupName.length > 0
              ? $t(
                  'pages.user_registration.group_name_default'
                )
              : $t('pages.group_list.not_set')
          "
          class="w-full tablet:w-330px"
          :is-disabled="!permissionAddMember"
          @on-selected="onSelectGroup"
        />
      </div>
    </div>
    <div class="note">
      {{ $t('pages.user_registration.note') }}
    </div>
    <Button
      :type="typeBtn"
      :theme="userStore.roleName"
      class="mt-38px"
      :class="{ disabled: !permissionAddMember }"
      @click="onSubmit()"
    >
      {{ $t('pages.user_registration.confirmation') }}
    </Button>
  </template>
</template>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 24px;
  color: $color-black-1;
}

.record-number__title {
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  color: $color-black-1;
  margin-top: 42px;
}

.record-number__value {
  margin-top: 8px;
  margin-bottom: 24px;
  line-height: 16px;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  color: $color-black-1;
  letter-spacing: 0;
}

.row-form {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 24px;

  &.row-error {
    margin-bottom: 32px;

    @media screen and (max-width: 685px) {
      margin-bottom: 48px;
    }
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

.disabled {
  pointer-events: none;
  touch-action: none;
}

.note {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
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

  :deep(.dropdown-button) {
    width: 167px;
  }
}
.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
}
</style>
