export const SORT_FILTER = {
  NEWEST_FIRST: 'newest_first',
  OLDEST_FIRST: 'oldest_first',
  SYLLABARY_ORDER: 'syllabary_order',
}

export const OPTION_SORT_FILTER = Object.values(SORT_FILTER)

export const VALUE_SORT_FILTER = {
  [SORT_FILTER.NEWEST_FIRST]: {
    order_by: 'created_at',
    order_type: 'DESC',
  },
  [SORT_FILTER.OLDEST_FIRST]: {
    order_by: 'created_at',
    order_type: 'ASC',
  },
  [SORT_FILTER.SYLLABARY_ORDER]: {
    order_by: 'first_name',
    order_type: 'ASC',
  },
}
