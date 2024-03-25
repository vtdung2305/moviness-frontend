<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { PropType } from 'vue'
import { useMq } from 'vue3-mq'
import { ColorEnum } from '@/constants/color'
import { useUser } from '@/stores/user'
import { ILineChart } from '@/interfaces/chart'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const userStore = useUser()
const { isMobile, isTablet } = useDevice()
const mq = useMq()

const colorChart = computed((): string => {
  if (userStore.roleName === 'shinseido')
    return ColorEnum.COLOR_SHINSEIDO
  else if (userStore.roleName === 'kanrisha')
    return ColorEnum.COLOR_KANRISHA
  else return ColorEnum.COLOR_TRAINER
})

const props = defineProps({
  chartData: {
    type: Object as PropType<ILineChart>,
    default: () => {},
  },
  chartOptions: {
    type: Object,
    default: () => {},
  },
})

onMounted(() => {
  const barContainerBody: any = document.querySelector(
    '.bar-container__body'
  )
  const barContainer: any = document.querySelector(
    '.bar-container'
  )

  const barChart: any = document.getElementById('barChart')

  const totalLabels = props.chartData.labels.length

  barContainer.style.width = `${barChart.offsetWidth}px`

  if (totalLabels > 4 && barContainerBody) {
    const newWidth = 606 + (totalLabels - 4) * 64
    if (newWidth > 850) {
      barContainerBody.style.width = `${newWidth}px`
    }
  }
})
</script>

<template>
  <div class="bar-container desktop:w-850px">
    <div class="bar-container__body">
      <Bar
        ref="bar"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bar-container {
  overflow-x: auto;
  // @media screen and (max-width: $screen-desktop) {
  //   width: 606px;
  // }

  @media screen and (max-width: $screen-tablet) {
    width: 100%;
  }

  @media screen and (max-width: 340px) {
    width: 250px;
  }

  &__body {
    height: 400px;
  }

  &::-webkit-scrollbar {
    display: block;
  }
}
</style>
