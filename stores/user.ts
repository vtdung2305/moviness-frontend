import { CookieKeyEnum } from '@/constants/cookie'
import {
  IUser,
  IUserLoginData,
  IPurchaseReminder,
} from '@/interfaces/user'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'

export const useUser = defineStore('user', {
  state: (): {
    userData: IUser | null
    purchaseReminder: IPurchaseReminder | null
  } => ({
    userData: null,
    purchaseReminder: null,
  }),

  actions: {
    async login(params: IUserLoginData) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.auth.login(params)
        if (
          res &&
          res.data &&
          res.includes &&
          res.includes.user
        ) {
          const token = useCookie(
            CookieKeyEnum.ACCESS_TOKEN,
            {
              maxAge: params.remember_token
                ? 1296000
                : undefined,
            }
          )

          const rememberToken = useCookie(
            CookieKeyEnum.REMEMBER_TOKEN,
            {
              maxAge: params.remember_token
                ? 1296000
                : undefined,
            }
          )
          const refreshToken = useCookie(
            CookieKeyEnum.REFRESH_TOKEN,
            {
              maxAge: params.remember_token
                ? 1296000
                : undefined,
            }
          )

          this.userData = res.includes.user
          refreshToken.value = res.data.refresh_token
          rememberToken.value = params.remember_token
            ? '1'
            : '0'
          token.value =
            res.data.token_type +
            ' ' +
            res.data.access_token

          localStorage.setItem(
            CookieKeyEnum.USER_DATA,
            JSON.stringify(this.userData)
          )
        }
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        const { $api } = useNuxtApp()
        await $api.auth.logout().finally(() => {
          const token = useCookie(
            CookieKeyEnum.ACCESS_TOKEN
          )
          const refreshToken = useCookie(
            CookieKeyEnum.REFRESH_TOKEN
          )
          const rememberToken = useCookie(
            CookieKeyEnum.REMEMBER_TOKEN
          )
          rememberToken.value = null
          token.value = null
          refreshToken.value = null
          this.userData = null
          localStorage.removeItem(CookieKeyEnum.USER_DATA)
        })
      } catch (error) {}
    },

    setUser(user: IUser | null) {
      this.userData = user
    },

    setPurchaseReminder(
      purchaseReminder: IPurchaseReminder
    ) {
      this.purchaseReminder = purchaseReminder
    },
  },
  getters: {
    isAuthenticated: (state): Boolean =>
      !!state.userData && !!state.userData.id,

    roleName: (state): Theme | undefined => {
      switch (state.userData?.role) {
        case RoleEnum.ADMINISTRANTOR_ID:
          return RoleEnum.ADMINISTRANTOR
        case RoleEnum.ADMIN_ID:
          return RoleEnum.ADMIN
        case RoleEnum.TRAINER_ID:
          return RoleEnum.TRAINER
        default:
          break
      }
    },
    // state.userData?.role === RoleEnum.ADMINISTRANTOR_ID
    //   ? RoleEnum.ADMINISTRANTOR
    //   : state.userData?.role === RoleEnum.ADMIN_ID
    //   ? RoleEnum.ADMIN
    //   : RoleEnum.TRAINER,
  },
})
