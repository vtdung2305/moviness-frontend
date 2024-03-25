<script lang="ts" setup>
// micro compiler
const props = defineProps({
  numberSubject: {
    type: Number,
    default: 0,
  },
  totalSubject: {
    type: Number,
    default: 0,
  },
  minPage: {
    type: Number,
    default: 1,
  },
  maxPage: {
    type: Number,
    default: 10,
  },
  showTotal: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="flex justify-between mb-24px color-black">
    <div
      v-if="showTotal"
      class="font-bold text-16px leading-16px"
    >
      {{ $t('components.header_lists.number_subject') }}:
      <span class="text-24px leading-24px">
        {{ numberSubject }}
      </span>
      {{ $t('components.header_lists.unit_subject') }}
    </div>
    <div v-else></div>
    <div
      class="text-total text-14px leading-14px font-medium"
    >
      {{ minPage }}-{{ maxPage }}（ {{ totalSubject
      }}{{
        $t('components.header_lists.unit_total_subject')
      }}）
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.text-total {
  padding-top: 9px;
  margin-right: -1px;
}

.color-black {
  color: $color-gray-1;
}
</style>
