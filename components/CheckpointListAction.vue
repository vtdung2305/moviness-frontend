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
})

const emit = defineEmits(['update-check-point'])

watch(
  props.checkPointsData,
  (newVal) => {
    emit('update-check-point', newVal)
  },
  {
    deep: true,
  }
)
</script>

<template>
  <div class="checkpoint-list-basic">
    <p class="checkpoint-list-basic__title mb-15px">
      {{ $t('pages.evaluation_movement.check_point') }}
      {{ lengthCheckPoint
      }}{{ $t('pages.evaluation_movement.unit') }}
    </p>
    <ul class="checkpoint-list-basic__list">
      <li
        v-for="(item, index) in checkPointsData"
        :key="index"
      >
        <!-- <CheckpointItemAction
          v-model:is_complete="item.is_complete"
          :checkpoint="item"
        /> -->

        <CheckpointItemActionNew
          v-model:physical_point="item.physical_point"
          v-model:psychological_point="
            item.psychological_point
          "
          :checkpoint="item"
          :index="index + 1"
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
}

.checkpoint-list-basic__list {
  margin-top: 5px;
}

:deep(textarea) {
  background-color: $color-white;
}
</style>
