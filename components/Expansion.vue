<script setup lang="ts">
import { PropType } from 'vue'
import { IExpansion } from '@/interfaces/expansion'

// composable
const { t } = useLang()

const props = defineProps({
  heading: {
    type: String,
    default: null,
  },
})
const isShow = ref<Boolean>(false)
const clickToogle = () => {
  isShow.value = !isShow.value
}
</script>

<template>
  <div>
    <div class="expansion-pannel flex-1">
      <div
        class="expansion-pannel__header text-16px leading-24px py-9px font-bold flex justify-between content-center cursor-pointer"
        @click="clickToogle()"
      >
        {{ props.heading }}
        <span
          class="block transform transition"
          :class="`${isShow ? '-rotate-90' : 'rotate-90'}`"
          ><i class="icon-next text-25px leading-25px"></i
        ></span>
      </div>
      <div
        v-show="isShow"
        class="expansion-pannel__content transition duration-1000 ease-in"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.expansion-pannel {
  &__header {
    border-bottom: 1px solid #d8d8db;
  }
}
</style>
