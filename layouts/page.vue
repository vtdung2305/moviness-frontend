<script lang="ts" setup>
import { ModalNameEnum } from '@/constants/modal'
import { EnvironmentVariablesEnum } from '@/constants/common'
import { useUser } from '@/stores/user'

const { env } = useHelper()
const router = useRouter()
const userStore = useUser()

const logout = async () => {
  try {
    await userStore.logout()
    router.push(`/`)
  } catch (error) {}
}

const { role, menus, menusUser, userName, userAvatar } =
  useMenu()
</script>

<template>
  <div class="app">
    <slot name="app-before" />
    <div id="app-before"></div>
    <div class="flex flex-col min-h-screen max-w-screen">
      <slot name="header">
        <PageMenu
          :theme="role"
          :menus="menus"
          :username="userName"
          :useravatar="userAvatar"
          :menus-user="menusUser"
        />
      </slot>
      <div class="flex-1 w-full flex flex-col">
        <div class="flex-1 flex flex-col w-full h-full">
          <slot />
        </div>
      </div>
      <slot name="footer">
        <PageFooter />
      </slot>
      <ModalMessage
        :id="ModalNameEnum.ALERT_MANY_REQUEST"
        :theme="role"
        :message="$t('others.many_request_title')"
        :sub-message="$t('others.many_request_message')"
      />

      <ModalMessage
        :id="ModalNameEnum.FACILITY_EXPIRED"
        :theme="role"
        :sub-message="$t('others.msg_facility_expried')"
        @click="logout"
      />
      <!-- TODO: remove this label after deploy to production env -->
      <span
        v-if="env !== EnvironmentVariablesEnum.PRODUCTION"
        class="fixed bottom-0 right-0 pl-4 pr-4 pt-1 pb-1 text-lg bg-green-500 text-white font-bold"
      >
        開発中
      </span>
    </div>
    <slot name="app-after" />
    <div id="app-after"></div>
  </div>
</template>
<style scoped lang="scss">
.app {
  background: $background;
}
</style>
