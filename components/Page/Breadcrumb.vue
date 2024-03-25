<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'

defineProps<{
  listBreadcrumbs: MenuItemBase[]
}>()

const router = useRouter()

const hasLink = (item: MenuItemBase) => {
  return item?.route?.name || item?.route?.length
}
</script>
<template>
  <div class="breadcrumb flex">
    <div
      v-for="(item, index) in listBreadcrumbs"
      :key="index"
      class="breadcrumb__item text-xs font-medium flex items-center"
    >
      <NuxtLink
        v-if="hasLink(item)"
        :to="item.route"
        class="cursor-pointer breadcrumb-txt has-link"
      >
        <div @click="item.action && item.action()">
          {{ $t(item.text) }}
        </div>
      </NuxtLink>
      <template v-else>
        <NuxtLink
          v-if="item?.route?.path"
          :to="item?.route?.path"
          class="cursor-pointer breadcrumb-txt has-link"
        >
          <div @click="item.action && item.action()">
            {{ $t(item.text) }}
          </div>
        </NuxtLink>
        <span v-else class="cursor-pointer breadcrumb-txt">
          <div @click="item.action && item.action()">
            {{ $t(item.text) }}
          </div>
        </span>
      </template>
      <span
        v-if="index !== listBreadcrumbs.length - 1"
        class="icon-next text-2xl"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.breadcrumb-txt {
  color: $color-gray-1;
  font-size: 12px;
  line-height: 24px;

  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }
}

.has-link {
  &:hover {
    text-decoration: underline;
  }
}

.icon-next {
  margin-left: -4px;
}
</style>
