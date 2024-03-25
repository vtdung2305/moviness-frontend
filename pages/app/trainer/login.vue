<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'

definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div
    class="w-full h-full login-page flex justify-center items-center"
  >
    <div class="flex flex-col max-w-328px mt-12px">
      <FormLogin
        :theme="RoleEnum.TRAINER"
        :role-login="RoleEnum.TRAINER_ID as number"
      />
    </div>
  </div>
</template>

<style lang="scss">
.login-page {
  background-color: $background;
}
</style>
