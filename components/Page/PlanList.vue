<script setup lang="ts">
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { IPlan } from '@/interfaces/plan'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  planLists: {
    type: Array as PropType<IPlan[]>,
    default: () => [],
  },
})
</script>

<template>
  <div :class="`theme-${theme}`">
    <div
      class="grid grid-cols-1 desktop:grid-cols-2 gap-8 list-user__content"
    >
      <PlanItem
        v-for="(item, index) in planLists"
        :key="index"
        :plan-item="item"
        :theme="theme"
      />
    </div>
  </div>
</template>
