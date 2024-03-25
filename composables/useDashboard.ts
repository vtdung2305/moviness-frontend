import max from 'lodash/max'
import { ja } from 'date-fns/locale'
import moment from 'moment'
import isNil from 'lodash/isNil'
import { MenuItemBase } from '@/interfaces/menu'
import { ILineChart } from '@/interfaces/chart'
import { ColorEnum } from '@/constants/color'
import { useUser } from '@/stores/user'
import { useFacility } from '@/stores/facility'
import { CookieKeyEnum } from '@/constants/cookie'
import { PlanRemainingAvailableEnum } from '@/constants/plan'
import { usePlan } from '@/stores/plan'
import { useTrainer } from '@/stores/trainer'
import {
  FormatDateEnum,
  LimitDate,
} from '@/constants/common'

export const useDashboard = () => {
  const listBreadcrumbs: MenuItemBase[] = [
    {
      text: 'components.menu.home',
      route: { name: 'index' },
    },
  ]

  const options = {
    type: 'line',
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
      datalabels: {
        color: 'black',
        clamp: true,
        display: function (context: any) {
          return (
            context.dataset.data[context.dataIndex] >= 1
          )
        },
      },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: 'day',
          displayFormats: {
            quarter: 'MMM YYYY',
          },
          tooltipFormat: FormatDateEnum.FORMAT_NORMAL,
        },
        ticks: {
          source: 'data',
          callback: function (
            value: string,
            index: number,
            ticks: any
          ) {
            // console.log(ticks)
            return formatDate(
              value,
              ticks.length > LimitDate
                ? FormatDateEnum.FORMAT_YEAR_MONTH
                : FormatDateEnum.FORMAT_NORMAL
            )
          },
        },
      },
      y: {
        max: 11,
        min: 0,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
    adapters: {
      date: {
        locale: ja,
      },
    },
  }

  const isLoading = ref<Boolean>(true)
  const date = ref()
  const {
    themeTrainer,
    themeKanrisha,
    themeShinseido,
    formatDate,
  } = useHelper()
  const userStore = useUser()
  const facilityStore = useFacility()
  const planStore = usePlan()
  const trainerStore = useTrainer()
  const { t } = useLang()

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
        data: [1, 4, 10, 8, 10],
        borderWidth: 1,
        borderColor: '#757578',
        pointBorderWidth: 5,
        pointBorderColor: colorChart,
        pointHoverBorderWidth: 5,
        pointHoverBackgroundColor: colorChart,
        pointHoverBorderColor: colorChart,
        tension: 0,
      },
    ],
  })

  const optionChart = ref(options)

  // const facilityStatistic = computed(() => facilityStore.facilityStatistic)

  const remainingPlan = computed((): boolean => {
    const remainingAvailableDay = themeKanrisha.value
      ? facilityStore.facilityStatistic?.plan
          ?.remaining_available_day
      : trainerStore.trainerStatistic?.plan
          ?.remaining_available_day
    if (isNil(remainingAvailableDay)) return false
    if (remainingAvailableDay > PlanRemainingAvailableEnum)
      return false
    return true
  })

  const planInfo = computed(() =>
    themeKanrisha.value
      ? facilityStore.facilityStatistic?.plan
      : trainerStore.trainerStatistic?.plan
  )

  const statisticAdmin = computed(() =>
    themeKanrisha.value
      ? facilityStore.facilityStatistic?.statistic
      : trainerStore.trainerStatistic?.statistic
  )

  const groupAdmin = computed(
    () => facilityStore.facilityStatistic?.group
  )

  const memberAdmin = computed(() =>
    themeKanrisha.value
      ? facilityStore.facilityStatistic?.members
      : trainerStore.trainerStatistic?.members
  )

  const memberStatistic = computed(
    () => facilityStore.facilityStatisticMembers
  )

  const chartDate = computed(() => {
    if (!facilityStore?.facilityStatisticMembers?.length)
      return []
    const memberDate =
      facilityStore?.facilityStatisticMembers
        .map(
          (e) =>
            // formatDate(
            //   e.created_at_format,
            //   typeStatistic.value > LimitDate
            //     ? FormatDateEnum.FORMAT_YEAR_MONTH
            //     : FormatDateEnum.FORMAT_NORMAL
            // )
            new Date(e.created_at_format)
        )
        .reverse()
    // chartData.value.labels = evaluationDate
    return memberDate
  })

  const chartValue = computed(() => {
    if (!facilityStore?.facilityStatisticMembers?.length)
      return []
    return facilityStore?.facilityStatisticMembers
      .map((e, index) => {
        return {
          // x: formatDate(
          //   e.created_at_format,
          //   typeStatistic.value > LimitDate
          //     ? FormatDateEnum.FORMAT_YEAR_MONTH
          //     : FormatDateEnum.FORMAT_NORMAL
          // ),
          x: new Date(e.created_at_format),
          y: e.number_members,
        }
      })
      .reverse()
  })

  const maxMember = computed(() => {
    if (!facilityStore?.facilityStatisticMembers?.length)
      return 1
    return max(
      facilityStore?.facilityStatisticMembers.map(
        (e) => e.number_members
      )
    )
  })

  const statisticSuperAdmin = computed(
    () => planStore.statisticInfo?.statistic
  )

  const planHistoriesSuperAdmin = computed(
    () => planStore.statisticInfo?.history_plan_purchased
  )

  const planFacilities = computed(
    () => planStore.statisticInfo?.plan
  )

  const typeStatistic = computed(() => {
    if (!date.value) return 0
    const diff = moment(date.value[1]).diff(
      moment(date.value[0]),
      'days'
    )
    return diff + 1
  })

  const getFacilityStatistic = async () => {
    const userData: any = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    const facilityId = JSON.parse(userData).facility_id

    if (facilityId) {
      await facilityStore.getFacilityStatistic(facilityId)
    }
  }

  const getFacilityStatisticMembers = async () => {
    const userData: any = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    const facilityId =
      JSON.parse(userData).facility_id || null

    const params = {
      type: 'day',
      // typeStatistic.value > LimitDate ? 'month' : 'day',
      date_from: formatDate(date.value[0], 'YYYY-MM-DD'),
      date_to: formatDate(date.value[1], 'YYYY-MM-DD'),
    }

    if (facilityId) {
      await facilityStore.getFacilityStatisticMembers(
        facilityId,
        params
      )
    }
  }

  const getStatisticBySuperAdmin = async () => {
    await planStore.getStatisticBySuperAdmin()
  }

  const getTrainerStatistic = async () => {
    const userData: any = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    const trainerId = JSON.parse(userData).id

    if (trainerId) {
      await trainerStore.getStatisticByTrainer(trainerId)
    }
  }

  watch(
    [chartDate, chartValue, maxMember],
    ([newChartDate, newChartValue, newMaxMemberValue]) => {
      chartData.value.labels = newChartDate
      chartData.value.datasets[0].data = newChartValue
      optionChart.value.scales.y.max = newMaxMemberValue
        ? newMaxMemberValue + 1
        : 11
      optionChart.value.scales.x.time.unit =
        typeStatistic.value > LimitDate ? 'month' : 'day'
      optionChart.value.scales.x.ticks = {
        source: 'data',
        callback: function (
          value: string,
          index: number,
          ticks: any
        ) {
          return formatDate(
            value,
            typeStatistic.value > LimitDate
              ? FormatDateEnum.FORMAT_YEAR_MONTH
              : FormatDateEnum.FORMAT_NORMAL
          )
        },
      }
    },
    {
      immediate: true,
    }
  )

  onMounted(() => {
    const endDate = new Date()
    const startDate = new Date(
      new Date().setDate(endDate.getDate() - 7)
    )
    date.value = [startDate, endDate]
  })

  return {
    listBreadcrumbs,
    date,
    optionChart,
    chartData,
    isLoading,
    remainingPlan,
    planInfo,
    statisticAdmin,
    groupAdmin,
    memberAdmin,
    memberStatistic,
    statisticSuperAdmin,
    planHistoriesSuperAdmin,
    planFacilities,
    getFacilityStatistic,
    getFacilityStatisticMembers,
    getStatisticBySuperAdmin,
    getTrainerStatistic,
  }
}
