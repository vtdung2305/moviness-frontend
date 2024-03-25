import HttpFactory from '../http-factory'
import { IUserLoginData } from '@/interfaces/user'
import { CookieKeyEnum } from '@/constants/cookie'
class AuthModule extends HttpFactory {
  private config = useRuntimeConfig()
  async login(
    credentials: IUserLoginData
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/login`,
      credentials
    )
  }

  async logout(): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/logout`
    )
  }

  async forgotPassword(
    email: string
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/forgot-password`,
      {
        email,
      }
    )
  }

  async resetPassword(
    token: string,
    credentials: {
      check_token: number
      password?: string
      password_confirmation?: string
    }
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/reset-password/${token}`,
      credentials
    )
  }

  async changePassword(credentials: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/users/change-password`,
      credentials
    )
  }

  async refreshToken(): Promise<Object | null | any> {
    // const refreshToken = useCookie(
    //   CookieKeyEnum.REFRESH_TOKEN
    // )
    const rememberToken = useCookie(
      CookieKeyEnum.REFRESH_TOKEN
    )
    const res = await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/refresh-token`
    )
    if (res && res.data) {
      const token = useCookie(CookieKeyEnum.ACCESS_TOKEN, {
        maxAge:
          rememberToken.value === '1' ? 1296000 : undefined,
      })
      const refreshToken = useCookie(
        CookieKeyEnum.REFRESH_TOKEN,
        {
          maxAge:
            rememberToken.value === '1'
              ? 1296000
              : undefined,
        }
      )
      refreshToken.value = res.data.refresh_token
      token.value =
        res.data.token_type + ' ' + res.data.access_token
    }
    return res
  }

  async resendVerifyAccount(
    email: string
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/users/verify/resend`,
      {
        email,
      }
    )
  }
}

export default AuthModule
