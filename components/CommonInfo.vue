<script lang="ts" setup>
import { PropType } from 'vue'
import { ItemValue } from '@/interfaces/group'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  srcImg: {
    type: String,
    default: '',
  },
  infors: {
    type: Array as PropType<ItemValue[]>,
    default: () => [],
  },
  textInfo: {
    type: String,
    default: '',
  },
})

const avatarDisplay = computed(() => {
  return props.srcImg || '/images/avatar-default-2.png'
})
</script>

<template>
  <div class="common-info">
    <div v-if="title" class="common-info__title font-bold">
      {{ title }}
    </div>
    <div
      v-if="textInfo"
      class="text-base leading-21px mt-18px <mobile:mt-8px"
    >
      {{ textInfo }}
    </div>
    <template v-else>
      <div
        class="common-info__image rounded-full overflow-hidden mt-21px"
      >
        <img
          :src="avatarDisplay"
          class="w-full h-full object-contain"
          alt="写真"
        />
      </div>
      <Information :infors="infors" class="mt-21px" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.common-info {
  &__title {
    font-size: $font-22;
    line-height: $font-30;

    @media (max-width: 768px) {
      font-size: $font-18;
    }
  }

  &__image {
    width: 116px;
    height: 116px;
  }
}
</style>
