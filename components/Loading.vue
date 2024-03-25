<script setup lang="ts">
import { PropType } from 'vue'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    class="flex flex-col justify-center items-center loading_wrapper w-screen h-screen"
  >
    <div class="loading_content mb-2" :class="theme" />
    <span class="text-base">
      {{ message ? message : $t('common.loading') }}
    </span>
  </div>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.loading_wrapper {
  width: 100%;
}

.loading_overlay {
  background: rgba(51, 51, 51, 0.5);
}

.loading_content {
  width: 50px;
  height: 50px;
  border: 2px solid $color-shinseido;
  border-bottom: none;
  border-radius: 50%;
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  &.shinseido {
    border-color: $color-shinseido;
  }

  &.trainer {
    border-color: $color-trainer;
  }

  &.kanrisha {
    border-color: $color-kanrisha;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
