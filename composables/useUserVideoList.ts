import moment from 'moment'
import max from 'lodash/max'
import { useMember } from '@/stores/member'
import { GENDERS, LIMIT_ALL } from '@/constants/common'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'
import { ColorEnum } from '@/constants/color'
import { ILineChart } from '@/interfaces/chart'
import { IParamsPagination } from '@/interfaces/common'
import { ImageDefaultEnum } from '@/constants/image'

export const useUserVideoList = () => {
  const memberStore = useMember()
  const { getFullName } = useHelper()
  const currentPage = ref(1)
  const isLoadingPage = ref(false)
  const route = useRoute()
  const userStore = useUser()
  const router = useRouter()
  const tabQuery = Number(route.query?.tab_info) || 1
  const tab = ref(tabQuery)
  const { t } = useLang()

  const colorChart = computed((): string => {
    if (userStore.roleName === 'shinseido')
      return ColorEnum.COLOR_SHINSEIDO
    else if (userStore.roleName === 'kanrisha')
      return ColorEnum.COLOR_KANRISHA
    else return ColorEnum.COLOR_TRAINER
  })

  const data: ILineChart = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: colorChart.value,
        maxBarThickness: 64,
        info: [],
      },
    ],
  }

  const options: any = {
    type: 'bar',
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        drawBorder: false,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          color: colorChart.value,
          font: {
            weight: 'bold',
          },
          beginAtZero: true,
        },
        drawBorder: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (val: number) =>
          `${val}${t('pages.user_detail.times')}`,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            const label = toRaw(context.dataset.info) || []
            const index = context.dataIndex

            return `${label[index].name}`
          },
          title: function (tooltipItems: any) {
            return `${tooltipItems[0].formattedValue}${t(
              'pages.user_detail.times'
            )}`
          },
        },
      },
    },
  }

  const chartData = ref(data)
  const chartOptions = ref(options)

  const memberListVideo = computed(
    () => memberStore?.memberListVideo
  )

  const memberDetail = computed(
    () => memberStore?.memberDetail
  )

  const dateTime = computed(() => {
    const year = memberStore?.memberDetail?.birthday?.slice(
      0,
      4
    )
    const month =
      memberStore?.memberDetail?.birthday?.slice(5, 7)
    const day = memberStore?.memberDetail?.birthday?.slice(
      8,
      10
    )
    return t('pages.group_registration_confirmation.date', {
      year,
      month,
      day,
    })
  })

  const gender = computed(() => {
    if (memberStore.memberDetail?.sex) {
      return GENDERS[Number(memberStore.memberDetail?.sex)]
    }
    return ''
  })

  const groupName = computed(() => {
    return memberStore.memberDetail?.group
      ? memberStore.memberDetail?.group?.name
      : 'ー'
  })

  const trainerName = computed(() => {
    if (memberStore.memberDetail?.trainer) {
      return `${
        memberStore.memberDetail?.trainer?.last_name || ''
      } ${
        memberStore.memberDetail?.trainer?.first_name || ''
      }`
    }
    return ''
  })

  const memberInfo = computed(() => memberStore?.memberInfo)

  const meta = computed(() => memberStore?.meta)

  const avatarDisplay = computed(() => {
    return memberInfo.value?.url_avatar
      ? memberInfo.value.url_avatar
      : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
  })

  const age = computed(() => {
    return memberStore?.memberDetail?.birthday
      ? moment().diff(
          memberStore?.memberDetail?.birthday,
          'years',
          false
        ) + t('pages.user_detail.age')
      : ''
  })

  const fullName = computed(() => {
    return getFullName(
      memberInfo.value?.last_name,
      memberInfo.value?.first_name
    )
  })

  const level = computed(() => {
    if (memberInfo.value?.level === 0) {
      return t('others.no_value')
    } else {
      return memberInfo.value?.level
    }
  })

  const status = computed(() => {
    return memberStore.memberDetail?.status_label
  })

  const disableButton = computed(() => {
    if (userStore.roleName === RoleEnum.ADMIN) {
      return false
    } else if (
      memberStore.memberDetail?.trainer_id ===
      userStore?.userData?.id
    ) {
      return false
    }

    return true
  })

  const videoEvaluations = computed(
    () =>
      // memberListVideo.value.filter(
      //   (e) => e.number_evaluation > 0
      // )
      memberListVideo.value
  )

  const videosAllByMember = computed(
    () => memberStore.listAllVideoByMember
  )

  const handleChangeTab = async (tabActive: number) => {
    tab.value = tabActive
    if (tabActive === 3) {
      await getAllVideosByMember()
    }
    if (route.query?.tab_info) {
      router.push({
        path: `/app/${userStore.roleName}/user/${route.params.id}`,
        query: { tab_info: tabActive },
      })
    }
  }

  const handleEditMember = (
    id: number | string | undefined
  ) => {
    const role = userStore.roleName
    router.push(`/app/${role}/user/${id}/user-edit`)
  }

  const getMembersListVideo = async () => {
    isLoadingPage.value = true

    const id = route.params.id
    const params: IParamsPagination = {
      page: currentPage.value,
      limit: null,
    }
    await memberStore.getMembersListVideo(
      id as string,
      params as IParamsPagination
    )

    // const labels = memberListVideo.value
    //   // .filter((e) => e.number_evaluation > 0)
    //   .map((value: any, index: number) => {
    //     return index < 9 ? `0${index + 1}` : index + 1
    //   })

    // const datasetsData: number[] = memberListVideo.value
    //   // .filter((e) => e.number_evaluation > 0)
    //   .map((value) => value.number_evaluation)

    // if (datasetsData.length) {
    //   chartData.value.labels = labels
    //   chartData.value.datasets[0].data = datasetsData

    //   const maxValue = max(datasetsData)
    //   if (maxValue) {
    //     chartOptions.value.scales.y.max = scalesChartY(
    //       Number(maxValue)
    //     )
    //   }
    // }
    isLoadingPage.value = false
  }

  const getMembersDetail = async () => {
    isLoadingPage.value = true
    const id = route.params.id
    await memberStore.getMembersDetail(id as string)

    isLoadingPage.value = false
  }

  const scalesChartY = (num: number) => {
    const length = num.toString().length
    if (length === 1) {
      return num + 1
    } else {
      return num + Math.round(num / 5)
    }
  }

  const getAllVideosByMember = async () => {
    // isLoadingChart.value = true
    const id = route.params.id
    const params: IParamsPagination = {
      page: null,
      limit: LIMIT_ALL,
    }

    await memberStore.getAllVideosByMember(
      id as string,
      params as IParamsPagination
    )

    const labels = memberStore.listAllVideoByMember
      // .filter((e) => e.number_evaluation > 0)
      .map((value: any, index: number) => {
        return index < 9 ? `0${index + 1}` : index + 1
      })

    const datasetsData: number[] =
      memberStore.listAllVideoByMember
        // .filter((e) => e.number_evaluation > 0)
        .map((value) => value.number_evaluation)

    if (datasetsData.length) {
      chartData.value.labels = labels
      chartData.value.datasets[0].data = datasetsData
      chartData.value.datasets[0].info =
        memberStore.listAllVideoByMember

      const maxValue = max(datasetsData)
      if (maxValue) {
        chartOptions.value.scales.y.max = scalesChartY(
          Number(maxValue)
        )
      }
    }
    // isLoadingChart.value = false
  }

  onMounted(async () => {
    await getMembersListVideo()
    await getMembersDetail()

    if (
      route.query?.tab_info &&
      route.query?.tab_info === '3'
    ) {
      await getAllVideosByMember()
    }
  })

  watch(currentPage, () => {
    getMembersListVideo()
  })

  return {
    isLoadingPage,
    avatarDisplay,
    fullName,
    tab,
    memberListVideo,
    memberInfo,
    level,
    meta,
    currentPage,
    memberDetail,
    dateTime,
    gender,
    groupName,
    memberStore,
    trainerName,
    age,
    status,
    disableButton,
    chartData,
    chartOptions,
    videoEvaluations,
    videosAllByMember,
    handleChangeTab,
    handleEditMember,
  }
}
