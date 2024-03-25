import {
  required,
  helpers,
  email,
} from '@vuelidate/validators'
import { computed } from 'vue'
import useValidate from '@vuelidate/core'
import moment from 'moment'
import { RoleEnum } from '@/constants/role'
import { levels } from '@/constants/member'
import { useGroup } from '@/stores/group'
import { useTrainer } from '@/stores/trainer'
import { useUser } from '@/stores/user'
import {
  IMemberEdit,
  IMemberLevel,
} from '@/interfaces/member'
import { useMember } from '@/stores/member'
import { GENDERS } from '@/constants/common'
import { phone } from '@/helper/number'
import { IGroupListOption } from '@/interfaces/group'
import { useCommon } from '@/stores'

export const useUserEdit = () => {
  // Variable
  const groupStore = useGroup()
  const memberStore = useMember()
  const userStore = useUser()
  const trainerStore = useTrainer()
  const route = useRoute()

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
  const form = ref<IMemberEdit>({
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
    url_avatar: '',
  })

  const groupName = ref()
  const trainerName = ref('')
  const trainerId = ref()
  const isLoadingPage = ref(false)
  const listGroupName = ref<IGroupListOption[]>([])
  const listTrainerName = ref<IGroupListOption[]>([])
  const commonStore = useCommon()
  const { getAddressList } = useAssets()
  const addressList = computed(() => {
    return commonStore?.addressList
  })

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
      level: validateRequired('level'),
      last_name: validateRequired('last_name'),
      first_name: validateRequired('first_name'),
      last_name_kana: validateRequired(
        'last_furigana_name'
      ),
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
            message: t(
              'pages.user_edit.validate.trainer_id'
            ),
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

  const v$ = useValidate(rules, form as any)

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
            address.city +
            address.address1 +
            address.address2
        }
      }
    }
  )

  // Methods
  const onSubmit = async () => {
    const validate = await v$.value.$validate()
    if (validate) {
      memberStore.memberEdit = form.value
      memberStore.memberEdit.zip1 = memberStore.memberEdit
        .zip1
        ? memberStore.memberEdit.zip1.toString()
        : ''
      memberStore.memberEdit.tel = memberStore.memberEdit
        .tel
        ? memberStore.memberEdit.tel.toString()
        : ''
      router.push('user-edit-confirmation')
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
    if (groupName.value === t('pages.user_edit.not_set'))
      form.value.group_id = ''
    const group = groupStore.groups?.groupList.find(
      (item) => item.id === groupName.value
    )
    group && (form.value.group_id = group?.id)
  }

  const onSelectTrainer = async () => {
    const trainer = trainerStore.trainers?.find(
      (item) => item.id === trainerId.value
    )
    trainer && (form.value.trainer_id = trainer?.id)
    groupName.value = ''
    form.value.group_id = ''
    await groupStore.getList({
      trainer_id: trainer?.id as number,
    })

    // listGroupName
    listGroupName.value =
      groupStore.groups?.groupList.map((item) => ({
        label: `${item.name || ''} (${t(
          'pages.user_edit.number_of_users'
        )}${item.total_member}${t('pages.user_edit.man')})`,
        value: item.id,
      })) || []

    listGroupName.value = [
      {
        label: t('pages.user_edit.not_set'),
        value: t('pages.user_edit.not_set'),
      },
      ...listGroupName.value,
    ]
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

  const onSelectLevel = (value: string) => {
    const level = levelList.value.find(
      (item) => item.name === value
    )
    if (level) {
      form.value.level = level.value
    }
  }

  const getMembersDetail = async () => {
    isLoadingPage.value = true
    const id = route.params.id
    await memberStore.getMembersDetail(id as string)
    isLoadingPage.value = false
  }

  onMounted(async () => {
    getAddressList()
    if (!memberStore.memberEdit) {
      await getMembersDetail()

      if (!memberStore?.memberDetail?.trainer) {
        await groupStore.getList({
          trainer_id: userStore.userData?.id as number,
        })
      } else {
        await groupStore.getList({
          trainer_id: memberStore?.memberDetail
            ?.trainer_id! as number,
        })
      }

      await trainerStore.getListTrainerOfFacility(
        userStore.userData?.facility_id as number
      )
    }

    if (memberStore.memberEdit) {
      form.value = memberStore.memberEdit
      date.value.year = form.value.year
      date.value.month = form.value.month
      date.value.day = form.value.day
      const level = levelList.value.find(
        (item) => item.value === form.value.level
      )
      gender.value =
        GENDERS[memberStore.memberEdit?.sex as number]

      // GroupName
      const group = groupStore.groups?.groupList.find(
        (item) => item.id === form.value.group_id
      )
      group && (groupName.value = group?.id)

      if (!group) {
        groupName.value = t('pages.user_edit.not_set')
      }

      // listGroupName
      listGroupName.value =
        groupStore.groups?.groupList.map((item) => ({
          label: `${item.name || ''} (${t(
            'pages.user_edit.number_of_users'
          )}${item.total_member}${t(
            'pages.user_edit.man'
          )})`,
          value: item.id,
        })) || []

      listGroupName.value = [
        {
          label: t('pages.user_edit.not_set'),
          value: t('pages.user_edit.not_set'),
        },
        ...listGroupName.value,
      ]

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

      // TrainerName
      const trainer = trainerStore.trainers?.find(
        (item) => item.id === form.value.trainer_id
      )
      trainer &&
        (trainerName.value =
          trainer.last_name + ' ' + trainer.first_name)
      trainer && (trainerId.value = trainer.id)

      if (level) {
        levelName.value = level.name
      }
    } else {
      form.value.avatar =
        memberStore?.memberDetail?.url_avatar!
      form.value.karute = memberStore?.memberDetail?.karute!
      form.value.level = memberStore?.memberDetail?.level!
      form.value.last_name =
        memberStore?.memberDetail?.last_name!
      form.value.first_name =
        memberStore?.memberDetail?.first_name!
      form.value.last_name_kana =
        memberStore?.memberDetail?.last_name_kana!
      form.value.first_name_kana =
        memberStore?.memberDetail?.first_name_kana!
      form.value.zip1 = memberStore?.memberDetail?.zip1!
        ? memberStore?.memberDetail?.zip1! +
          memberStore?.memberDetail?.zip2!
        : ''
      form.value.address =
        memberStore?.memberDetail?.address!
      form.value.building_name =
        memberStore?.memberDetail?.building_name!
      form.value.sex = memberStore?.memberDetail?.sex!
      form.value.tel = phone(
        memberStore?.memberDetail?.tel!
      )!
      form.value.medical_history =
        memberStore?.memberDetail?.medical_history!
      form.value.memo = memberStore?.memberDetail?.memo!
      form.value.email = memberStore?.memberDetail?.email!
      form.value.group_id =
        memberStore?.memberDetail?.group?.id!
      form.value.trainer_id =
        memberStore?.memberDetail?.trainer_id!
      const level = levelList.value.find(
        (item) => item.value === form.value.level
      )
      gender.value =
        GENDERS[memberStore?.memberDetail?.sex as number]

      const group = groupStore.groups?.groupList.find(
        (item) => item.id === form.value.group_id
      )
      group && (groupName.value = group?.id)

      if (!group) {
        groupName.value = t('pages.user_edit.not_set')
      }

      // listGroupName
      listGroupName.value =
        groupStore.groups?.groupList.map((item) => ({
          label: `${item.name || ''} (${t(
            'pages.user_edit.number_of_users'
          )}${item.total_member}${t(
            'pages.user_edit.man'
          )})`,
          value: item.id,
        })) || []

      listGroupName.value = [
        {
          label: t('pages.user_edit.not_set'),
          value: t('pages.user_edit.not_set'),
        },
        ...listGroupName.value,
      ]

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

      // trainerName
      const trainer = trainerStore.trainers?.find(
        (item) =>
          item.id === memberStore?.memberDetail?.trainer_id!
      )
      trainer &&
        (trainerName.value =
          trainer.last_name + ' ' + trainer.first_name)
      trainer && (trainerId.value = trainer.id)

      if (level) {
        levelName.value = level.name
      }
      // get day month yea
      if (memberStore?.memberDetail?.birthday) {
        const getDate = moment(
          memberStore?.memberDetail?.birthday!,
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

  const onViewDeleteMemberGroup = () => {
    const id = route.params.id
    router.push(
      `/app/${userStore.roleName}/user/${id}/leave-facility`
    )
  }

  return {
    form,
    userStore,
    GENDERS,
    gender,
    listGroupName,
    listTrainerName,
    errors,
    date,
    RoleEnum,
    trainerName,
    trainerId,
    groupName,
    levelNameList,
    levelName,
    isLoadingPage,
    onSelectLevel,
    onSubmit,
    onSelectGroup,
    onSelectTrainer,
    onSelectYearOld,
    onSelectGender,
    onViewDeleteMemberGroup,
  }
}
