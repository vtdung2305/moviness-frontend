<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema'

export interface IMenuItem {
  type: 'link' | 'button'
  text: string
  href?: any
  route?: any
}

const { t } = useLang()
const app = useAppConfig() as AppConfigInput
const menus = computed((): IMenuItem[] => [
  {
    type: 'link',
    text: t('pages.getting-started.nav'),
    route: { name: 'getting-started' },
  },
])
</script>

<template>
  <BuilderNavbar>
    <template #menu>
      <div
        class="relative hidden lg:flex items-center ml-auto"
      >
        <nav
          class="text-sm leading-6 font-semibold text-gray-600 dark:text-gray-300"
          role="navigation"
        >
          <ul class="flex items-center space-x-8">
            <li v-for="(item, i) in menus" :key="i">
              <Anchor
                v-if="item.type === 'link'"
                :to="item.route ? item.route : undefined"
                :href="item.href ? item.href : undefined"
                class="hover:no-underline hover:text-slate-900 hover:dark:text-white capitalize"
                >{{ item.text }}</Anchor
              >
              <Button
                v-else-if="item.type === 'button'"
                :text="item.text"
                size="xs"
                class="font-extrabold capitalize"
                :to="item.route ? item.route : undefined"
                :href="item.href ? item.href : undefined"
              />
            </li>
          </ul>
        </nav>
        <div
          class="flex space-x-4 border-l ml-6 pl-6 border-gray-900/10 dark:border-gray-50/[0.2]"
        >
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </template>
  </BuilderNavbar>
</template>
