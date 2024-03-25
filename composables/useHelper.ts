import moment from 'moment'
import { $fetch } from 'ohmyfetch'
import { saveAs } from 'file-saver'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'
import { userStatusList } from '@/constants/member'
import { IMemberStatus } from '@/interfaces/member'
import { PlanInfoEnum } from '@/constants/plan'
import {
  EnvironmentVariablesEnum,
  FormatDateEnum,
  API_KEY,
  GOO_NE_END_POINT,
} from '@/constants/common'
import {
  ImageDefaultEnum,
  ImageTypeEnum,
  ImageScale,
} from '@/constants/image'

export const useHelper = () => {
  const useStore = useUser()
  // const { t } = useLang()

  const config = useRuntimeConfig()

  const physicalList = [
    {
      label:
        'pages.evaluation_movement.physical_list.label_1',
      value: 1,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_2',
      value: 2,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_3',
      value: 3,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_4',
      value: 4,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_5',
      value: 5,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_6',
      value: 6,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_7',
      value: 7,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_8',
      value: 8,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_9',
      value: 9,
    },
    {
      label:
        'pages.evaluation_movement.physical_list.label_10',
      value: 10,
    },
  ]

  const psychologicalList = [
    {
      label:
        'pages.evaluation_movement.psychological_list.label_1',
      value: 1,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_2',
      value: 2,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_3',
      value: 3,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_4',
      value: 4,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_5',
      value: 5,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_6',
      value: 6,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_7',
      value: 7,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_8',
      value: 8,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_9',
      value: 9,
    },
    {
      label:
        'pages.evaluation_movement.psychological_list.label_10',
      value: 10,
    },
  ]

  const serialize = (
    params: any,
    prefix?: string
  ): string => {
    const query = Object.keys(params).map((key) => {
      const value = params[key]

      if (params.constructor === Array) key = `${prefix}[]`
      else if (params.constructor === Object)
        key = prefix ? `${prefix}[${key}]` : key

      if (typeof value === 'object')
        return serialize(value, key)
      else return `${key}=${encodeURIComponent(value)}`
    })

    return query.join('&')
  }

  const getFullName = (
    lastName: string | null | undefined,
    firstName: string | null | undefined
  ): string => {
    if (lastName || firstName) {
      return `${lastName || ''} ${firstName || ''}`
    }
    return ''
  }

  const getFullAddress = (
    address: string | null | undefined,
    buildingName: string | null | undefined
  ): string => {
    if (address || buildingName) {
      return `${address ? address.trim() : ''}${
        buildingName ? buildingName.trim() : ''
      }`
    }
    return ''
  }

  const getFullPostalCode = (
    postalCode: string | null | undefined
  ): string => {
    if (postalCode) {
      return `〒${postalCode
        ?.toString()
        .slice(0, 3)}-${postalCode?.toString().slice(3, 7)}`
    }
    return ''
  }

  const formatDate = (
    date: string | Date | null,
    format: string | null = null
  ): string => {
    if (!date) return ''
    if (!format)
      return moment(date).format(
        FormatDateEnum.FORMAT_NORMAL
      )
    return moment(date).format(format)
  }

  const getStatusMember = (
    groupId: string | number,
    trainerId: string | number,
    status: number
  ): IMemberStatus => {
    if (status === 3) {
      return userStatusList[3]
    }
    const userStore = useUser()
    switch (userStore.roleName) {
      case RoleEnum.ADMINISTRANTOR:
        return userStatusList[1]
      case RoleEnum.ADMIN:
        if (trainerId) return userStatusList[1]
        else return userStatusList[2]
      default:
        if (trainerId && groupId) return userStatusList[1]
        else return userStatusList[2]
    }
  }

  const copyClipboard = async (value: string) => {
    // Navigator clipboard api needs a secure context (https)
    if (!value) return false
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value)
    } else {
      // Use the 'out of viewport hidden text area' trick
      const input = document.createElement('input')
      input.value = value

      // Move textarea out of the viewport so it's not visible
      input.style.position = 'absolute'
      input.style.left = '-999999px'

      document.body.prepend(input)
      input.select()

      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
      } finally {
        input.remove()
      }
    }
  }

  const truncateJapaneseString = (
    value: string,
    maxLength: number
  ) => {
    if (
      typeof value !== 'string' ||
      typeof maxLength !== 'number'
    ) {
      return ''
    }

    const JAPANESE_CHARACTER_REGEX =
      /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g
    // https://gist.github.com/ryanmcgrath/982242#file-japaneseregex-js

    const text = value.replace(/\n+/g, ' ')
    let tempLength = 0
    let tempText = ''

    for (let i = 0; i < text.length; i += 1) {
      const current = text.charAt(i)
      tempLength += JAPANESE_CHARACTER_REGEX.test(current)
        ? 2
        : 1

      if (tempLength > maxLength) return `${tempText}...`

      tempText += current
    }

    return value
  }

  const planImageUrl = (planName: string) => {
    if (!planName) return null
    const plan = PlanInfoEnum.find(
      (e) => e.name === planName
    )
    if (!plan) return null
    if (plan) return plan.image_url
  }

  const imageUrl = (url: string, type: string) => {
    if (!url) {
      if (!type) {
        return ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
      } else {
        switch (type) {
          case ImageTypeEnum.TYPE_FACILITY:
            return ImageDefaultEnum.IMAGE_FACILITY_DEFAULT
          case ImageTypeEnum.TYPE_GROUP:
            return ImageDefaultEnum.IMAGE_GROUP_DEFAULT
          case ImageTypeEnum.TYPE_TRAINER:
            return ImageDefaultEnum.IMAGE_TRAINER_DEFAULT
          case ImageTypeEnum.TYPE_MEMBER:
            return ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
          default: //
        }
      }
    }
    return url
  }

  const convertFurigana = async (str: string) => {
    if (!str) return
    const params = {
      app_id: API_KEY,
      sentence: str,
      output_type: 'hiragana',
    }

    const { converted } = await $fetch(GOO_NE_END_POINT, {
      method: 'POST',
      body: { ...params },
      headers: {
        'Content-Type': `application/json`,
      },
    })
    return converted
  }

  const themeTrainer = computed(() => {
    return useStore.roleName === RoleEnum.TRAINER
  })

  const themeKanrisha = computed(() => {
    return useStore.roleName === RoleEnum.ADMIN
  })

  const themeShinseido = computed(() => {
    return useStore.roleName === RoleEnum.ADMINISTRANTOR
  })

  const isSafari = computed(() => {
    const appleExpression = /Apple/i
    const safariExpression = /Safari/i
    return (
      appleExpression.test(navigator.vendor) &&
      safariExpression.test(navigator.userAgent)
    )
  })

  const env = computed(() => {
    const apiUrl = config.public.apiUrl
    if (apiUrl.includes('dev'))
      return EnvironmentVariablesEnum.DEVELOPMENT
    else if (apiUrl.includes('stg'))
      return EnvironmentVariablesEnum.STAGING
    else return EnvironmentVariablesEnum.PRODUCTION
  })

  const savePDF = async (
    path: string,
    fileName: string
  ) => {
    const response = await $fetch(path, {
      method: 'GET',
      headers: {
        // 'Content-Type': `application/pdf`,
      },
    })
    saveAs(response, fileName)
  }

  const handelCheckImageScale = (index: number) => {
    switch (index) {
      case 1:
        return ImageScale.SCALE_01
      case 2:
      case 3:
      case 4:
        return ImageScale.SCALE_02
      case 5:
        return ImageScale.SCALE_03
      case 6:
      case 7:
      case 8:
      case 9:
        return ImageScale.SCALE_04
      case 10:
        return ImageScale.SCALE_05
      default:
        return ImageScale.SCALE_00
    }
  }

  const getContentPhysical = (num: number) => {
    return physicalList.find((e) => e.value === num)?.label
  }

  const getContentPsychological = (num: number) => {
    return psychologicalList.find((e) => e.value === num)
      ?.label
  }

  return {
    themeTrainer,
    themeKanrisha,
    themeShinseido,
    isSafari,
    env,
    serialize,
    getFullName,
    formatDate,
    getStatusMember,
    copyClipboard,
    truncateJapaneseString,
    planImageUrl,
    imageUrl,
    convertFurigana,
    getFullAddress,
    getFullPostalCode,
    savePDF,
    handelCheckImageScale,
    getContentPhysical,
    getContentPsychological,
  }
}
