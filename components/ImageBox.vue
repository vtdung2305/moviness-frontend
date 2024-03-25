<script setup lang="ts">
import { ImageDefaultEnum } from '@/constants/image'

const props = defineProps({
  src: {
    type: String,
    default: ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT,
  },
  aspectRatio: {
    type: [String, Number],
    default: '',
  },
  objectFit: {
    type: String,
    default: 'cover', // contain / cover / fill / none
  },
  classes: {
    type: String,
    default: '',
  },
})

const styleImg = computed(() => {
  const obj: any = {}
  if (props.objectFit) {
    obj.objectFit = props.objectFit
  }
  return obj
})

const styleOuter = computed(() => {
  if (props.aspectRatio) {
    const obj: any = {
      aspectRatio: props.aspectRatio,
    }
    return obj
  }
  return undefined
})
</script>

<template>
  <div class="image-extend" :style="styleOuter">
    <img
      :src="src"
      :class="classes"
      :style="styleImg"
      alt=""
    />
  </div>
</template>

<style scoped lang="scss">
.image-extend {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-top: 100%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
