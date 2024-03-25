<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema'
const app = useAppConfig() as AppConfigInput
</script>

<template>
  <footer
    class="border-t lg:border-gray-900/10 dark:border-gray-50/[0.2]"
  >
    <section
      class="max-w-8xl mx-auto px-4 lg:px-8 flex-1 flex w-full space-x-20"
    >
      <div class="w-full py-35px text-center md:text-left">
        <div
          class="flex gap-31px flex-wrap justify-center mb-33px list-action"
        >
          <NuxtLink
            :to="`/terms`"
            target="_blank"
            class="text-12px leading-12px text-gray-2 cursor-pointer"
          >
            {{ $t('components.footer.rule') }}
          </NuxtLink>
          <NuxtLink
            :to="`/specified`"
            target="_blank"
            class="text-12px leading-12px text-gray-2 cursor-pointer"
          >
            {{ $t('components.footer.rule_desc') }}
          </NuxtLink>
          <NuxtLink
            :to="`/policy`"
            target="_blank"
            class="text-12px leading-12px text-gray-2 cursor-pointer"
          >
            {{ $t('components.footer.privacy_policy') }}
          </NuxtLink>
          <a
            href="https://ugoki-clinic.com/"
            target="_blank"
            class="text-12px leading-12px text-gray-2 cursor-pointer"
          >
            {{ $t('components.footer.video_copyright') }}
          </a>
        </div>
        <div class="text-10px text-gray-2 text-center">
          Copyright © 2023 SHINSEIDO CO.,LTD. All Rights
          Reserved.
          <a :href="app.author.link">
            {{ app.author.name }}
          </a>
        </div>
      </div>
    </section>
  </footer>
</template>
<style scoped lang="scss">
.text-gray-2 {
  letter-spacing: 0;
  color: $color-gray-2;

  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }
}

.list-action {
  @media screen and (max-width: 450px) {
    row-gap: 8px;
    column-gap: 16px;
  }
}
</style>
