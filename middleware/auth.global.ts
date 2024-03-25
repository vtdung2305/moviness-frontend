import { useUser } from '@/stores/user'
const PAGE_IGNORE_AUTH = [
  'index',
  'signup',
  'signup-confirmation',
  'facilities-verify',
  'forgot-password',
  'purchase-reminder',
  'policy',
  'specified',
  'flow-to-registration',
  'flow-to-procedure',
  'terms',
  'app-forgot-password-id',
  'guide',
]

const PAGE_IGNORE_MIDDLEWARE = [
  '404',
  'terms',
  'specified',
  'policy',
  'guide',
]

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUser()
  const role = userStore.roleName
  const pathRole = to.path.split('/')[2]
  if (PAGE_IGNORE_MIDDLEWARE.includes(to.name as string)) {
    return
  }

  if (!userStore.isAuthenticated) {
    if (PAGE_IGNORE_AUTH.includes(to.name as string)) {
      return
    }
    if (!to.path.includes('/login')) {
      return `/app/${pathRole}/login`
    }
  } else if (
    PAGE_IGNORE_AUTH.includes(to.name as string) ||
    role !== pathRole ||
    to.path.includes('/login')
  ) {
    return `/app/${role}`
  }
})
