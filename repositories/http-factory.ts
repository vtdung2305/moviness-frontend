import { $Fetch } from 'ohmyfetch'
import { CookieKeyEnum } from '@/constants/cookie'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'

type MethodType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
class HttpFactory {
  private $fetch: $Fetch
  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher
  }

  async call<T>(
    method: MethodType,
    url: string,
    data?: object,
    extras = {}
  ): Promise<T> {
    const config = useRuntimeConfig()
    const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)
    const router = useRouter()
    const route = useRoute()
    const { $api, $showModal } = useNuxtApp()
    const headersOption = new Headers()
    headersOption.set('Accept', 'application/json')
    if (token.value && !route.path.includes('/login')) {
      headersOption.set(
        'Authorization',
        token.value as string
      )
    }
    const navigateToLogin = () => {
      const pathRole = route.path.split('/')[2]
      const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)
      const refreshToken = useCookie(
        CookieKeyEnum.REFRESH_TOKEN
      )
      token.value = null
      refreshToken.value = null
      localStorage.removeItem(CookieKeyEnum.USER_DATA)
      const userStore = useUser()
      userStore.setUser(null)
      router.push(`/app/${pathRole}/login`)
    }
    const $res: T | undefined = await this.$fetch(url, {
      method,
      body: data,
      ...extras,
      baseURL: config.public.apiUrl,
      headers: headersOption,
    }).catch(async (e) => {
      if (e?.response?.status === 401) {
        try {
          const { $api } = useNuxtApp()
          const resRefresh = await $api.auth.refreshToken()
          if (resRefresh && resRefresh.data) {
            return await this.call(
              method,
              url,
              data,
              extras
            )
          } else {
            navigateToLogin()
          }
        } catch (error) {
          navigateToLogin()
        }
      } else if (e?.response?.status === 429) {
        $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
      } else {
        if (
          e?.response?.status === 400 &&
          e?.response?._data?.error_code ===
            'facility_expired'
        ) {
          $showModal(ModalNameEnum.FACILITY_EXPIRED)
        }
        throw e
      }
    })
    return $res as T
  }
}

export default HttpFactory
