export type IResWithPagination<T> = {
  data: T
  meta?: {
    current_page?: number
    from?: number
    last_page?: number
    per_page?: number
    to?: number
    total?: number
  }
}

export interface IParamsPagination {
  page?: string | number | null
  limit?: number | null
}
