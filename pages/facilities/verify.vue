<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'

const { t } = useLang()
definePageMeta({
  layout: 'seo-page',
})
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const errorMessage = ref<string>('')
const loading = ref<boolean>(true)

onMounted(() => {
  const { code } = route.query
  if (code) {
    $api.facility
      .verify({ code: code as string })
      .then(() => {
        loading.value = false
        errorMessage.value = ''
      })
      .catch((error) => {
        loading.value = false
        errorMessage.value = error.response?._data?.message
      })
  } else {
    router.replace('/signup')
  }
})

const handleDirectToLogin = () => {
  router.replace(`/app/kanrisha/login`)
}
</script>

<template>
  <PageWrapper
    class="flex flex-col items-center justify-center"
  >
    <div
      class="w-full h-60vh flex justify-content items-center"
    >
      <Loading v-if="loading" class="w-full h-full" />
      <div
        v-else-if="errorMessage.length"
        class="text-center mt-10 w-100vw <sm:p-4"
      >
        {{ errorMessage }}
      </div>

      <div
        v-else
        class="flex flex-col items-center text-center mt-10 w-100vw <sm:p-4"
      >
        <h3 class="text-xl font-bold mb-2">
          {{ $t('pages.verify.message_success') }}
        </h3>
        <p class="text-base mb-60px">
          {{ $t('pages.verify.message_suggest_login') }}
        </p>
        <Button
          type="primary"
          :theme="RoleEnum.ADMIN"
          class="w-328px <sm:w-full"
          @click="handleDirectToLogin"
        >
          <span class="text-16px font-bold">
            {{ $t('pages.verify.open') }}
          </span>
        </Button>
      </div>
    </div>
  </PageWrapper>
</template>
<style lang="scss" scoped>
.color-kanrisha {
  color: $color-kanrisha;
}
</style>
