<script lang="ts" setup>
import { ICheckPoint } from '@/interfaces/video'

const router = useRouter()

// micro compiler
const props = defineProps({
  lengthCheckPoint: {
    type: Number,
    default: 0,
  },
  checkPointsData: {
    type: Object as () => ICheckPoint[],
    default: null,
  },
  hideLengthCheckPoint: {
    type: Boolean,
    default: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="checkpoint-list-basic">
    <p
      v-if="hideLengthCheckPoint"
      class="checkpoint-list-basic__title"
    >
      {{ $t('components.checkpoint_list_basic.title') }}
      ({{ lengthCheckPoint }}
      {{ $t('components.checkpoint_list_basic.unit') }})
    </p>
    <ul class="checkpoint-list-basic__list">
      <li
        v-for="(item, index) in checkPointsData"
        :key="index"
      >
        <CheckpointItem
          :checkpoint="item"
          :is-completed="isCompleted"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.checkpoint-list-basic__title {
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  text-align: left;
  color: $color-gray-1;

  margin-top: 40px;
}

.checkpoint-list-basic__list {
  margin-top: 15px;
}
</style>
