import { CookieKeyEnum } from '@/constants/cookie'
import { useUser } from '@/stores/user'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.server) {
    const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)
    const userData = localStorage.getItem(
      CookieKeyEnum.USER_DATA
    )
    const userStore = useUser()
    if (userData && token.value) {
      userStore.setUser(JSON.parse(userData))
    } else {
      localStorage.removeItem(CookieKeyEnum.USER_DATA)
      userStore.setUser(null)
    }
  }
})
