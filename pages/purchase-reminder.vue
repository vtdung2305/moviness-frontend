<script lang="ts" setup>
import { useUser } from '@/stores/user'

// meta
definePageMeta({
  layout: 'seo-page',
})

// composable
const userStore = useUser()

onBeforeMount(() => {
  if (!userStore.purchaseReminder) {
    useRouter().replace(`app/kanrisha/login`)
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center w-screen justify-center purchase-reminder"
  >
    <div class="w-328px <sm:max-w-11/12">
      <h2
        class="purchase-reminder__title font-bold mb-12px"
      >
        {{ $t('pages.purchase_reminder.title') }}
      </h2>
      <p class="mb-12px">
        {{
          $t('pages.purchase_reminder.note1', {
            plan: userStore.purchaseReminder?.plan,
          })
        }}
      </p>
      <p class="font-bold">
        {{ $t('pages.purchase_reminder.email') }}
      </p>
      <p class="mb-12px font-bold">
        {{ userStore.purchaseReminder?.email }}
      </p>
      <p>{{ $t('pages.purchase_reminder.note2') }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.purchase-reminder {
  min-height: 400px;
  height: calc(100vh - 425px);

  @media (max-width: 1024px) {
    min-height: unset;
    height: calc(100vh - 280px);
  }

  &__title {
    font-size: 26px;
    letter-spacing: 0.08em;
  }
}
</style>
