import moment from 'moment'
import { useUser } from '@/stores/user'
import { useTrainer } from '@/stores/trainer'
import { RoleEnum } from '@/constants/role'
import { GENDERS } from '@/constants/common'
import { TrainerStatusEnum } from '@/constants/trainer'
import { ImageDefaultEnum } from '@/constants/image'

export const useTrainerDetail = () => {
  const userStore = useUser()
  const trainerStore = useTrainer()
  const route = useRoute()
  const router = useRouter()
  const { getFullName } = useHelper()

  const currentPage = ref(1)
  const meta = ref()
  const tab = ref(1)
  const isLoadingPage = ref(false)

  // MOCK DATA
  const groupsData = ref([
    {
      id: 4,
      name: 'ハンケチで眼めの鉄。',
      image: null,
      content:
        'たの神かみさまざまのお菓子かしなかっき考えて来るような青白い十字きたじゅくしに沿そっちでもする。おまえのはてはね、おかしで立っていない。みんな蒸発じょうぶがついたのでした。ジョバンニも手をひらべていました。カムパネルラはもう夢ゆめの前のあるい環わになって出かけず、「おっかりまってそのひびきとおもいながめいにジョバンニは、つかアルビレオの観測所かんですか、魚じゃないわかになってしませんですか。だん。',
      status: 2,
      trainer_id: 7,
      facility_id: 2,
      trainer: {
        id: 7,
        email:
          'trainer1c384dc5-e430-4368-8f93-330b782e23e5@gmail.com',
        avatar: '',
        status: 1,
        address:
          '6126324  石川県江古田市中央区松本町工藤8-1-7',
        tel: '06-5846-6354',
        sex: 0,
        birthday: null,
        year: '',
        month: '',
        day: '',
        building_name: null,
        first_name: '陽子',
        last_name: '廣川',
        first_name_kana: '千代',
        last_name_kana: '江古田',
        zip1: '3346378',
        zip2: '8895406',
        address1:
          '5345479  大阪府村山市中央区伊藤町小林6-10-4',
        address2:
          '4023293  千葉県山本市東区小泉町山本1-5-9 コーポ佐藤102号',
        address3:
          '3293543  大分県野村市北区山田町加藤5-10-2',
        address4:
          '9187895  埼玉県田中市西区石田町江古田1-4-8',
        memo: null,
        role: 2,
        facility_id: 2,
        created_at: '2023-03-06T18:45:13.000000Z',
        updated_at: '2023-03-06T18:45:13.000000Z',
      },
      total_member: 0,
      total_member_unknow: 0,
      total_member_male: 0,
      total_member_female: 0,
      created_at: '1970-01-01T00:00:07.000000Z',
      updated_at: '1970-01-01T00:00:07.000000Z',
      created_by: null,
      url_image: '',
    },
    {
      id: 5,
      name: 'もどこまです」ジョ。',
      image: null,
      content:
        '事へんきりするのがぼんやりそっちが声もない。まったのしそう考えたような気もちがいます。みんなものの方は、車の中から、声もたいしょうめ、そのところ、細ほそながら、いろい時計とけい、ここまかにうな気がすぞ」と言いおりませんですか、ジョバンニは」と言いっぱり幅はばひとを一ぺんにもつれていた姉あねは前から暗くらいいました。「ではよろしまいました。カムパネルラの行って、その紙切れをかけて銀河ぎんがのいるか。',
      status: 2,
      trainer_id: 8,
      facility_id: 2,
      trainer: {
        id: 8,
        email:
          'trainera76e3ed8-2a36-4ba6-8a26-e8b18e51f8f1@gmail.com',
        avatar: '',
        status: 1,
        address:
          '4228413  岐阜県津田市西区山田町浜田6-10-3',
        tel: '090-5761-4601',
        sex: 0,
        birthday: null,
        year: '',
        month: '',
        day: '',
        building_name: null,
        first_name: '太郎',
        last_name: '工藤',
        first_name_kana: '裕美子',
        last_name_kana: '田辺',
        zip1: '1631835',
        zip2: '6467962',
        address1:
          '8311932  福岡県大垣市西区鈴木町加納4-5-1',
        address2:
          '8533941  兵庫県青田市北区松本町中津川8-2-3',
        address3:
          '7576155  群馬県原田市南区宇野町中村1-9-2 コーポ中島109号',
        address4:
          '1549910  東京都田中市北区伊藤町吉本9-3-1 コーポ青田107号',
        memo: null,
        role: 2,
        facility_id: 2,
        created_at: '2023-03-06T18:45:13.000000Z',
        updated_at: '2023-03-06T18:45:13.000000Z',
      },
      total_member: 0,
      total_member_unknow: 0,
      total_member_male: 0,
      total_member_female: 0,
      created_at: '1970-01-01T00:00:08.000000Z',
      updated_at: '1970-01-01T00:00:08.000000Z',
      created_by: null,
      url_image: '',
    },
    {
      id: 6,
      name: 'とりはおってしかた。',
      image: null,
      content:
        'おとともありませんでいるのだ。ザネリはカムパネルラの宿やどでした。ジョバンニは、チョコレール投げなら。こったわ」「ザネリはどんなことばかりはどうしはじめから。けれるのはらかなラッコの上に降おりません。いままやめました大きくなって、じきサウザンクロスです。「そうです、船に乗のったよ」「お母さんがの青年も立ちました。あの鳥捕とりとりも歴史れきっと河かわらは、にや笑わらはねあてにお母さんはもうど十二ば。',
      status: 2,
      trainer_id: 9,
      facility_id: 2,
      trainer: {
        id: 9,
        email:
          'trainer4df53dab-10ad-431f-9f90-da531759f3ee@gmail.com',
        avatar: '',
        status: 1,
        address:
          '9278773  山梨県山口市北区中津川町中島6-10-4 ハイツ大垣107号',
        tel: '094-123-9703',
        sex: 0,
        birthday: null,
        year: '',
        month: '',
        day: '',
        building_name: null,
        first_name: '香織',
        last_name: '山本',
        first_name_kana: '陽子',
        last_name_kana: '田中',
        zip1: '9553589',
        zip2: '4198044',
        address1:
          '1864945  宮崎県鈴木市西区廣川町加納6-6-3 ハイツ山田101号',
        address2:
          '3434327  滋賀県工藤市北区井上町斉藤9-6-1 コーポ原田110号',
        address3:
          '3465994  長崎県工藤市北区吉本町松本1-7-8 コーポ山口101号',
        address4:
          '7647254  山形県山岸市東区佐々木町笹田6-2-4',
        memo: null,
        role: 2,
        facility_id: 2,
        created_at: '2023-03-06T18:45:13.000000Z',
        updated_at: '2023-03-06T18:45:13.000000Z',
      },
      total_member: 0,
      total_member_unknow: 0,
      total_member_male: 0,
      total_member_female: 0,
      created_at: '1970-01-01T00:00:09.000000Z',
      updated_at: '1970-01-01T00:00:09.000000Z',
      created_by: null,
      url_image: '',
    },
  ])

  const trainerDetail = computed(
    () => trainerStore?.trainerDetail
  )

  const avatarDisplay = computed(() => {
    return trainerDetail.value?.url_avatar
      ? trainerDetail.value?.url_avatar
      : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
  })

  const fullName = computed(() => {
    return getFullName(
      trainerDetail.value?.last_name,
      trainerDetail.value?.first_name
    )
  })

  const gender = computed(() => {
    if (trainerDetail.value?.sex) {
      return GENDERS[Number(trainerDetail.value?.sex)]
    }
    return ''
  })

  const { t } = useLang()
  const dateTime = computed(() => {
    if (!trainerDetail?.value?.last_login) return ''
    const check = moment(
      trainerDetail?.value?.last_login,
      'YYYY/MM/DD HH:mm'
    )

    const month = check.format('MM')
    const day = check.format('DD')
    const year = check.format('YYYY')
    const hour = check.format('HH')
    const minute = check.format('mm')

    return t('pages.trainer_detail.date', {
      year,
      month,
      day,
      hour,
      minute,
    })
  })

  const dateTimeLock = computed(() => {
    if (!trainerDetail?.value?.time_lock_login) return ''
    const check = moment(
      trainerDetail?.value?.time_lock_login,
      'YYYY/MM/DD HH:mm'
    )

    const month = check.format('MM')
    const day = check.format('DD')
    const year = check.format('YYYY')
    const hour = check.format('HH')
    const minute = check.format('mm')

    return t('pages.trainer_detail.date', {
      year,
      month,
      day,
      hour,
      minute,
    })
  })

  const birthDay = computed(() => {
    const check = moment(
      trainerDetail?.value?.birthday,
      'YYYY/MM/DD'
    )

    const month = check.format('MM')
    const day = check.format('DD')
    const year = check.format('YYYY')

    return t('pages.group_registration_confirmation.date', {
      year,
      month,
      day,
    })
  })

  const statusAccount = computed(() => {
    switch (trainerDetail?.value?.status) {
      case TrainerStatusEnum.INVALID:
        return t('pages.trainer_detail.invalid')
      case TrainerStatusEnum.VALID:
        return t('pages.trainer_detail.valid')
      case TrainerStatusEnum.BLOCK:
        return t('pages.trainer_detail.block')
    }
  })

  const statusTrainer = computed(() => {
    switch (trainerDetail?.value?.status) {
      case TrainerStatusEnum.INVALID:
        return t(
          'pages.trainer_detail.title_button_non_responsible'
        )
      case TrainerStatusEnum.VALID:
        return t(
          'pages.trainer_detail.title_button_responsible'
        )
      case TrainerStatusEnum.BLOCK:
        return t(
          'pages.trainer_detail.title_button_responsible'
        )
    }
  })

  const labelButton = computed(() => {
    switch (trainerDetail?.value?.status) {
      case TrainerStatusEnum.INVALID:
        return t(
          'pages.trainer_detail.title_button_responsible'
        )
      case TrainerStatusEnum.VALID:
        return t(
          'pages.trainer_detail.title_button_non_responsible'
        )
      case TrainerStatusEnum.BLOCK:
        return t(
          'pages.trainer_detail.title_button_non_responsible'
        )
    }
  })

  const handleChangeTab = (tabActive: number) => {
    tab.value = tabActive
    if (tab.value === 2) {
      currentPage.value = 1
    }
  }

  const role = userStore.roleName

  const handleViewDetailGroup = (id: number) => {
    router.push({
      name: `app-${role}-group-id`,
      params: { id },
    })
  }

  const getGroupsData = async (page: number) => {
    let res = null
    if (role === RoleEnum.ADMIN) {
      res = await trainerStore.groupsForAdmin(
        trainerDetail.value?.id?.toString(),
        page
      )
    } else if (role === RoleEnum.ADMINISTRANTOR) {
      res = await trainerStore.groupsForSuperAdmin(
        trainerDetail.value?.id?.toString(),
        page
      )
    }
    if (res && res.data) {
      groupsData.value = res.data.data
      meta.value = res.data.meta
    }
  }

  const getTrainerDetail = async () => {
    isLoadingPage.value = true
    const id = route.params.id
    await trainerStore.getTrainerDetail(id as string)
    isLoadingPage.value = false
  }

  onMounted(async () => {
    await getTrainerDetail()
    await getGroupsData(1)
  })

  watch(currentPage, () => {
    getGroupsData(currentPage.value)
  })

  return {
    trainerDetail,
    fullName,
    currentPage,
    groupsData,
    meta,
    tab,
    isLoadingPage,
    avatarDisplay,
    gender,
    dateTime,
    birthDay,
    statusAccount,
    statusTrainer,
    labelButton,
    dateTimeLock,
    handleChangeTab,
    handleViewDetailGroup,
  }
}
