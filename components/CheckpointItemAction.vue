<script lang="ts" setup>
import { ICheckPoint } from '@/interfaces/video'
import { useVideo } from '@/stores/video'
import { useUser } from '@/stores/user'
import { timeDuration } from '@/helper/number'

const videoStore = useVideo()
const userStore = useUser()

const props = defineProps({
  checkpoint: {
    type: Object as () => ICheckPoint,
    default: null,
  },
  notAction: {
    type: Boolean,
    default: false,
  },
})

const checkPointItem = ref(props.checkpoint)
const emit = defineEmits(['change', 'update:is_complete'])
const onClick = () => {
  emit(
    'update:is_complete',
    !!checkPointItem.value.is_complete
  )
}
</script>

<template>
  <div>
    <div
      class="checkpoint-item flex content-center items-start"
    >
      <FormCheckbox
        v-model="checkPointItem.is_complete"
        :theme="userStore.roleName"
        class="checkbox pt-4px"
        @click="onClick"
      >
      </FormCheckbox>
      <span
        class="checkpoint-item__time text-left cursor-pointer transition-opacity hover:opacity-60"
        :class="userStore.roleName"
        @click="
          !notAction &&
            videoStore.setTimeCheckPoint(
              checkpoint.checkpoint_time || 0
            )
        "
      >
        {{ timeDuration(checkpoint?.checkpoint_time) }}
      </span>
      <span
        class="checkpoint-item__note text-justify <tablet:hidden"
      >
        {{ checkpoint?.content }}
      </span>
      <slot></slot>
    </div>
    <span
      class="checkpoint-item__note text-justify hidden <tablet:block"
    >
      {{ checkpoint?.content }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.checkpoint-item {
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  text-align: left;
  color: $color-white-2;

  padding: 10px 0;
  margin-bottom: 12px;

  @media screen and (max-width: $screen-tablet) {
    margin-bottom: 0;
  }
}

.checkpoint-item__position {
  min-width: 32px;
  height: 32px;
  // background: $color-shinseido;
  border-radius: 100%;
  margin-right: 16px;
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  color: $color-white-2;

  &.shinseido {
    background: $color-shinseido;
  }

  &.kanrisha {
    background: $color-kanrisha;
  }

  &.trainer {
    background: $color-trainer;
  }

  span {
    width: 32px;
  }
}

.checkpoint-item__time {
  font-size: $font-16;
  font-weight: 500;
  line-height: $font-14;
  font-style: normal;
  // text-decoration: underline;
  border-bottom: 1px solid;
  // color: $color-shinseido;
  margin-right: 15px;
  // min-width: 75px;
  padding-top: 9px;
  margin: 0 17px;
  flex: 0 0 auto;

  &.shinseido {
    color: $color-shinseido;
  }

  &.kanrisha {
    color: $color-kanrisha;
  }

  &.trainer {
    color: $color-trainer;
  }
}

.checkpoint-item__note {
  font-size: $font-18;
  font-weight: 500;
  font-style: normal;
  color: $color-gray-1;
  line-height: 24px;
  padding-top: 4px;
}

:deep(.form-checkbox__icon) {
  font-size: 24px;
  width: 24px;
}

:deep(.form-checkbox__text) {
  margin-left: 0;
}

// :deep(.checkpoint-item__time) {
//   padding-left: 18px;
// }
</style>
