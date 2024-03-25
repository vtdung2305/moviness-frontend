export interface Datasets {
  label?: string
  backgroundColor?: string | null
  data?: number[]
  maxBarThickness?: number
}

export interface ILineChart {
  labels?: string[] | any
  datasets?: Datasets[] | any
}
