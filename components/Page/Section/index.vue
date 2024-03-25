<script lang="ts" setup>
import { PropType } from 'vue'
import { MenuItemBase } from '@/interfaces/menu'

defineProps({
  listBreadcrumbs: {
    type: Array as PropType<MenuItemBase[]>,
    default: () => [],
  },
  titlePage: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <section
    class="mx-auto desktop:max-w-8/12 desktop:py-10 desktop:min-w-1280px tablet:p-10 p-4"
  >
    <PageBreadcrumb
      v-if="listBreadcrumbs.length"
      :list-breadcrumbs="listBreadcrumbs"
    />
    <div
      v-if="titlePage"
      class="page-section__title font-bold tracking-[.08em]"
    >
      {{ titlePage }}
    </div>
    <slot />
  </section>
</template>
<style scoped lang="scss">
.page-section {
  &__title {
    font-size: $font-26;
    margin-bottom: 40px;
    margin-top: 19px;
    line-height: 1;
    color: $color-gray-1;

    @media (max-width: 768px) {
      margin-bottom: 24px;
      font-size: $font-22;
    }
  }
}
</style>
