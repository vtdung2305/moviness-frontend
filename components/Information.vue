<script lang="ts" setup>
import { PropType } from 'vue'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { ItemValue } from '@/interfaces/group'

defineProps({
  infors: {
    type: Array as PropType<ItemValue[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const router = useRouter()

const handleClickLink = function (info: ItemValue) {
  router.push(info?.link || '')
}
</script>
<template>
  <div class="information">
    <div
      v-for="(info, index) in infors"
      :key="index"
      class="information__item flex py-14px <mobile:flex-col gap-y-8px py-16px"
    >
      <div
        class="information__item-label text-base leading-21px font-medium <mobile:font-bold text-14px"
      >
        {{ info.label }}
      </div>
      <div
        class="information__item-value text-base leading-21px text-justify whitespace-pre-wrap <mobile:text-14px !leading-snug"
      >
        {{ info.value }}
        <span
          v-if="info.linkText"
          class="information__item-link cursor-pointer font-bold text-sm leading-19px ml-4 underline underline-offset-2"
          :class="theme"
          @click="handleClickLink(info)"
        >
          {{ info.linkText }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.information {
  &__item {
    border-bottom: 1px solid $color-gray-3;
  }

  &__item-label {
    min-width: 180px;
  }

  &__item-link {
    color: $color-shinseido;
  }

  @media screen and (max-width: $screen-tablet) {
    &__item-label {
      min-width: 125px;
    }
  }
}
</style>
