export const GENDERS = [
  'pages.group_detail.gender_others',
  'pages.group_detail.male',
  'pages.group_detail.woman',
]

export const API_KEY =
  'afd2b8efe7914c0b0812c2ec22489433bf7d3b8f5a200c031ad030bf04025dbf'

export const GOO_NE_END_POINT =
  'https://labs.goo.ne.jp/api/hiragana'

export enum FilterListEnum {
  current_page = 1,
  limit_small = 5,
  limit_normal = 10,
}

export enum FormatDateEnum {
  FORMAT_NORMAL = 'YYYY年MM月DD日',
  FORMAT_YEAR_MONTH = 'YYYY年MM月',
  FORMAT_MONTH_DAY = 'MM月DD日',
  FORMAT_YEAR_MONTH_DAY_TIME = 'YYYY年MM月DD日HH時MM分',
}

export const LimitDate = 31

export const LIMIT_ALL = 0

export enum EnvironmentVariablesEnum {
  DEVELOPMENT = 1,
  STAGING = 2,
  PRODUCTION = 3,
}
