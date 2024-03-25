import moment from 'moment'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import { ja } from 'date-fns/locale'
import { useUser } from '@/stores/user'
import { ColorEnum } from '@/constants/color'
import { MemberStatusEnum } from '@/constants/member'
import { useMember } from '@/stores/member'
import { useVideo } from '@/stores/video'
import { ModalNameEnum } from '@/constants/modal'
import { converSencondToMinuteSecond } from '@/helper/time'
import {
  IEvaluationDate,
  IEvaluationDateFromTo,
  IParamsEvaluation,
} from '@/interfaces/evaluation'
import { ILineChart } from '@/interfaces/chart'
import { IFacilityHistoriesParams } from '@/interfaces/facility'
import {
  FilterListEnum,
  LimitDate,
} from '@/constants/common'

export const useUserEvaluationOld = () => {
  const userStore = useUser()
  const memberStore = useMember()
  const videoStore = useVideo()
  const route = useRoute()
  const { formatDate, getFullName, savePDF } = useHelper()
  const router = useRouter()
  const { $showModal } = useNuxtApp()
  const { t } = useLang()

  const tab = ref(1)
  const date = ref()
  const loadCount = ref<number>(0)
  const isCreateMovement = ref(false)

  const isLoading = ref<Boolean>(false)

  const filter = ref<IFacilityHistoriesParams>({
    page: FilterListEnum.current_page,
    limit: FilterListEnum.limit_normal,
  })

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        // position: 'top',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || ''

            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y
            }
            return ` ${label}`
          },
          labelColor: function (context: any) {
            return {
              borderColor: colorChart.value,
              backgroundColor: colorChart.value,
              borderWidth: 1,
              borderRadius: 2,
            }
          },
        },
      },
    },
    scales: {
      y: {
        max: 10,
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    adapters: {
      date: {
        locale: ja,
      },
    },
  }

  const optionChart = ref(options)

  const colorChart = computed((): string => {
    if (userStore.roleName === 'shinseido')
      return ColorEnum.COLOR_SHINSEIDO
    else if (userStore.roleName === 'kanrisha')
      return ColorEnum.COLOR_KANRISHA
    else return ColorEnum.COLOR_TRAINER
  })

  const chartData = ref<ILineChart>({
    labels: [],
    datasets: [
      {
        label: '',
        backgroundColor: colorChart,
        data: [],
        borderWidth: 1,
        borderColor: '#757578',
        pointBorderWidth: 6,
        pointBorderColor: colorChart,
        pointHoverBorderWidth: 6,
        pointHoverBackgroundColor: colorChart,
        pointHoverBorderColor: colorChart,
      },
    ],
  })

  const comment = ref(
    memberStore?.evaluationByDate?.comment
  )

  const commentOrigin = cloneDeep(comment)

  const checkPointAction = ref(
    memberStore?.evaluationByDate?.check_points
  )

  const checkPointActionOrigin = cloneDeep(checkPointAction)

  const memberDetail = computed(
    () => memberStore?.memberDetail
  )

  const videoDetail = computed(
    () => videoStore?.videoDetail
  )

  const evaluationHistories = computed(
    () => memberStore?.evaluationHistories
  )

  const lastEvaluationHistories = computed(
    () => memberStore?.lastEvaluationHistories
  )

  const lastCheckPointHistories = computed(() => {
    if (!memberStore?.lastEvaluationHistories?.check_points)
      return []
    return memberStore?.lastEvaluationHistories?.check_points.map(
      (el, index) => ({
        ...el,
        index: index + 1,
        checkpoint_time_conver: converSencondToMinuteSecond(
          el.checkpoint_time
        ),
      })
    )
  })

  const totalCheckPoint = computed(() => {
    if (
      !memberStore?.lastEvaluationHistories
        ?.total_check_point
    )
      return 0
    return memberStore?.lastEvaluationHistories
      .total_check_point
  })

  const percentCompleted = computed(() => {
    if (
      !memberStore?.lastEvaluationHistories
        ?.total_check_point ||
      !memberStore?.lastEvaluationHistories
        ?.total_check_point_complete
    )
      return 0
    return (
      (memberStore?.lastEvaluationHistories
        ?.total_check_point_complete /
        memberStore?.lastEvaluationHistories
          ?.total_check_point) *
      100
    )
  })

  const chartValue = computed(() => {
    if (!memberStore?.evaluationHistories?.data?.length)
      return []
    return memberStore?.evaluationHistories.data
      .map((e) => e.total_check_point_complete)
      .reverse()
  })

  const chartDate = computed(() => {
    if (!memberStore?.evaluationHistories?.data?.length)
      return []
    const evaluationDate =
      memberStore?.evaluationHistories.data
        .map((e) =>
          formatDate(e.evaluation_date, 'MM月DD日')
        )
        .reverse()
    // chartData.value.labels = evaluationDate
    return evaluationDate
  })

  const evaluationDate = computed(
    () => memberStore.evaluationByDate
  )

  const hasDiffData = computed(
    () =>
      !isEqual(comment.value, commentOrigin.value) ||
      !isEqual(
        checkPointAction.value,
        checkPointActionOrigin.value
      )
  )

  const author = computed(() => {
    return userStore.userData
      ? getFullName(
          userStore.userData.last_name,
          userStore.userData.first_name
        )
      : t('others.empty')
  })

  const hasLeaveMember = computed(
    () =>
      memberDetail.value?.status === MemberStatusEnum.LEAVED
  )

  const hasEdit = computed(() => !!evaluationDate.value?.id)

  const limitDateSection = computed(() => {
    const diff = moment(date.value[1]).diff(
      moment(date.value[0]),
      'days'
    )
    return diff + 1 > LimitDate
  })

  const totalCheckpointComplete = computed(() => {
    const physicalPoint =
      memberStore?.lastEvaluationHistories?.check_points.reduce<number>(
        (previousValue: number, currentValue) => {
          return (
            previousValue +
            Number(currentValue.physical_point)
          )
        },
        0
      )

    const psychologicalPoint =
      memberStore?.lastEvaluationHistories?.check_points.reduce<number>(
        (previousValue: number, currentValue) => {
          return (
            previousValue +
            Number(currentValue.psychological_point)
          )
        },
        0
      )
    return (
      Number(physicalPoint) + Number(psychologicalPoint)
    )
  })

  const handleChangeTab = (tabActive: number) => {
    tab.value = tabActive
  }

  const getMembersDetail = async () => {
    const id = route.params.id
    await memberStore.getMembersDetail(id as string)
  }

  const getVideoDetail = async () => {
    const id = route.params.videoId
    await videoStore.getVideoDetail(id as string)
  }

  const getEvaluationHistories = async () => {
    const id = route.params.id
    const videoId = route.params.videoId
    loadCount.value++
    const params = {
      evaluation_date_from: formatDate(
        date.value[0],
        'YYYY-MM-DD'
      ),
      evaluation_date_to: formatDate(
        date.value[1],
        'YYYY-MM-DD'
      ),
      page: filter.value.page,
      limit: filter.value.limit,
    }

    await memberStore.getEvaluationHistoriesByVideo(
      id as string,
      videoId as string,
      params as IEvaluationDateFromTo
    )
  }

  const getLastEvaluationHistories = async () => {
    const id = route.params.id
    const videoId = route.params.videoId

    await memberStore.getLastEvaluationHistoriesByVideo(
      id as string,
      videoId as string
    )
  }

  const getEvaluationByDate = async () => {
    const id = route.params.id
    const videoId = route.params.videoId
    const params = {
      evaluation_date:
        route.query.evaluation_date ||
        moment().format('YYYY-MM-DD'),
    }

    await memberStore.getEvaluationByDate(
      id as string,
      videoId as string,
      params as IEvaluationDate
    )
  }

  const createEvaluation = async () => {
    try {
      const { $api } = useNuxtApp()
      const id = route.params.id
      const params = {
        evaluation_date:
          route.query.evaluation_date ||
          moment().format('YYYY-MM-DD'),
        video_id: route.params.videoId,
        comment: comment.value,
        check_points: checkPointAction.value,
      }
      isLoading.value = true
      const res = await $api.member.createEvaluation(
        id as string,
        params as IParamsEvaluation
      )
      if (res && res.data) {
        isCreateMovement.value = true
        $showModal(ModalNameEnum.ALERT_CREATE_EVALUATION)
      }
      isLoading.value = false
    } catch (error) {
      console.log(error)
      // router.push('/404')
    }

    isLoading.value = false
  }

  const gotoEvaluationMovenment = (date: string | null) => {
    const id = route.params.id
    const videoId = route.params.videoId
    if (!date) {
      router.push(
        `/app/${userStore.roleName}/user/${id}/video/${videoId}/evaluation-movement`
      )
    } else {
      router.push(
        `/app/${userStore.roleName}/user/${id}/video/${videoId}/evaluation-movement?evaluation_date=${date}`
      )
    }
  }

  const onPageChange = async (value: number) => {
    isLoading.value = true
    filter.value.page = value
    await getEvaluationHistories()
    isLoading.value = false
  }

  const confirmExportPdf = () => {
    if (limitDateSection.value) {
      $showModal(ModalNameEnum.LIMIT_DATE_SELECT)
      return
    }
    $showModal(ModalNameEnum.MESSAGE)
  }

  const exportPdfHistoriesEvaluation = async () => {
    try {
      const { $api } = useNuxtApp()
      const id = route.params.id
      const videoId = route.params.videoId
      const params = {
        evaluation_date_from: formatDate(
          date.value[0],
          'YYYY-MM-DD'
        ),
        evaluation_date_to: formatDate(
          date.value[1],
          'YYYY-MM-DD'
        ),
      }
      // isLoading.value = true
      const res =
        await $api.member.exportPdfHistoriesEvaluation(
          id as string,
          videoId as string,
          params as IEvaluationDateFromTo
        )
      if (res && res.data) {
        const fileName = res.data.url.split('/').pop()
        // window.location.href = res.data.url
        savePDF(res.data.url, fileName)
      }
      // isLoading.value = false
    } catch (error) {
      console.log(error)
      // router.push('/404')
    }
  }

  onMounted(() => {
    const endDate = new Date()
    const startDate = new Date(
      new Date().setDate(endDate.getDate() - 7)
    )
    date.value = [startDate, endDate]
    loadCount.value++
  })

  watch(
    [chartDate, chartValue, totalCheckPoint],
    ([newChartDate, newChartValue, newTotalValue]) => {
      chartData.value.labels = newChartDate
      chartData.value.datasets[0].data = newChartValue
      optionChart.value.scales.y.max = newTotalValue + 1
    },
    {
      immediate: true,
    }
  )

  return {
    tab,
    chartData,
    chartValue,
    chartDate,
    isLoading,
    colorChart,
    memberDetail,
    videoDetail,
    evaluationHistories,
    lastEvaluationHistories,
    totalCheckPoint,
    percentCompleted,
    date,
    loadCount,
    evaluationDate,
    comment,
    commentOrigin,
    checkPointAction,
    hasDiffData,
    isCreateMovement,
    author,
    optionChart,
    lastCheckPointHistories,
    hasLeaveMember,
    hasEdit,
    filter,
    totalCheckpointComplete,
    handleChangeTab,
    getMembersDetail,
    getVideoDetail,
    getEvaluationHistories,
    getLastEvaluationHistories,
    getEvaluationByDate,
    createEvaluation,
    gotoEvaluationMovenment,
    onPageChange,
    exportPdfHistoriesEvaluation,
    confirmExportPdf,
  }
}
