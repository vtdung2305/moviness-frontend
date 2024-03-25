<script setup lang="ts">
import { PropType } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js'
import { ILineChart } from '@/interfaces/chart'
import 'chartjs-adapter-moment'

ChartJS.register(
  CategoryScale,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
  TimeSeriesScale
)

const props = defineProps({
  chartData: {
    type: Object as PropType<ILineChart>,
    default: () => {},
  },
  optionChart: {
    type: Object,
    default: () => {},
  },
})

const chartValue = ref(props.chartData)
</script>
<template>
  <div>
    <Line :data="chartValue" :options="optionChart" />
  </div>
</template>

<style scoped lang="scss"></style>
