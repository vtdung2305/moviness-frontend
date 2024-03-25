<script lang="ts" setup>
import { capitalize } from '~/utils/str'

const props = defineProps({
  error: {
    type: Object,
    default: () => {},
  },
})
// composable
const { t } = useLang()

// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: capitalize(t('pages.404.title')),
}))

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <Html :lang="locale">
    <Body
      class="antialiased duration-300 transition-colors dark:text-gray-200 bg-white dark:bg-gray-900"
    >
      <NuxtLayout>
        <NuxtLoadingIndicator
          :height="5"
          :duration="3000"
          :throttle="400"
        />
        <PageWrapper
          class="flex flex-col items-center justify-center"
        >
          <Error :code="error.statusCode" />
        </PageWrapper>
      </NuxtLayout>
    </Body>
  </Html>
</template>
