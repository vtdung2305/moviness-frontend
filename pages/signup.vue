<script lang="ts" setup>
// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="flex flex-col items-center sign-up">
    <FormSignUp />
  </div>
</template>

<style lang="scss" scoped>
.sign-up {
  letter-spacing: 0;
}
</style>
