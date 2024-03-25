<script lang="ts" setup>
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'

defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: 'shinseido',
  },
})

const emit = defineEmits(['change-file'])

const fileInput = ref()
const file = ref()

const updateValue = () => {
  fileInput.value.click()
}

const selectFile = ($event: any) => {
  if ($event.target.files[0]) {
    file.value = $event.target.files[0]
    fileInput.value.value = null
    emit('change-file', file.value)
  }
}
</script>
<template>
  <div class="upload-file" :class="theme">
    <Button
      type="outline"
      :theme="theme"
      class="bg-white"
      @click="updateValue()"
    >
      <template v-if="file">
        {{ $t('components.button.reselect_the_file') }}
      </template>
      <template v-else>
        <span class="icon-plus-circle text-2xl mr-2"></span
        >{{ $t('components.button.addition') }}
      </template>
    </Button>
    <input
      ref="fileInput"
      type="file"
      accept=".csv"
      class="hidden"
      @change="selectFile($event)"
    />
  </div>
</template>
<style scoped lang="scss">
.upload-file {
  &.kanrisha {
    .icon-plus-circle::before {
      color: $color-kanrisha;
    }
  }
}
</style>
