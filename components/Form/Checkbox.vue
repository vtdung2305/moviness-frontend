<script lang="ts" setup>
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'

const props = defineProps({
  modelValue: {
    type: [Number, Boolean],
    default: 1,
  },
  text: {
    type: String,
    default: '',
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  isRadio: {
    type: Boolean,
    default: false,
  },
  listChecked: {
    type: Array,
    default: () => [],
  },
  multipleCheckbox: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  numberAllow: {
    type: Number,
    default: -1,
  },
})
const emit = defineEmits([
  'update:modelValue',
  'update-checked',
])
const modelValue = useSyncProps<Number>(
  props,
  'modelValue',
  emit
)

const checked = computed(() => {
  if (!props.listChecked.length) return false
  return props.listChecked.includes(props.modelValue)
})

const isDisabledMultiCheckBox = computed(() => {
  if (!props.multipleCheckbox) return false
  return props.numberAllow === props.listChecked.length
})

const onClick = () => {
  if (props.multipleCheckbox) {
    emit('update-checked', props.modelValue)
  } else {
    emit('update:modelValue', modelValue.value ? 0 : 1)
  }
}
</script>

<template>
  <div
    class="form-checkbox cursor-pointer inline-flex items-center"
    :class="{
      'is-disabled': isDisabledMultiCheckBox && !checked,
    }"
    @click="onClick"
  >
    <template v-if="multipleCheckbox">
      <span
        :class="`${
          checked ? 'icon-checked' : 'icon-uncheck'
        } ${theme} form-checkbox__icon ${
          isDisabledMultiCheckBox && !checked
            ? 'is-disabled'
            : ''
        }`"
      />
      <span v-if="text" class="ml-12px form-checkbox__text">
        {{ text }}
      </span>
      <span v-else class="ml-12px form-checkbox__text">
        <slot />
      </span>
    </template>
    <template v-else>
      <span
        :class="`${
          isRadio
            ? modelValue
              ? 'icon-radio-checked'
              : 'icon-radio-unchecked'
            : modelValue
            ? 'icon-checked'
            : 'icon-uncheck'
        } ${theme} form-checkbox__icon`"
      />
      <span v-if="text" class="ml-12px form-checkbox__text">
        {{ text }}
      </span>
      <span v-else class="ml-12px form-checkbox__text">
        <slot />
      </span>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.form-checkbox {
  color: $color-gray-1;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &__icon {
    width: 20px;
    font-size: 20px;
    border-radius: 5px;
    background-color: $color-white;

    &.icon-checked.shinseido {
      &::before {
        color: $color-shinseido;
      }
    }

    &.icon-checked.trainer {
      &::before {
        color: $color-trainer;
      }
    }

    &.icon-checked.kanrisha {
      &::before {
        color: $color-kanrisha;
      }
    }

    &.icon-radio-checked.shinseido {
      &::before {
        color: $color-shinseido;
      }
    }

    &.icon-radio-checked.trainer {
      &::before {
        color: $color-trainer;
      }
    }

    &.icon-radio-checked.kanrisha {
      &::before {
        color: $color-kanrisha;
      }
    }

    &.is-disabled {
      &::before {
        color: $color-gray-2;
        background-color: $color-gray-2;
      }
    }
  }

  &__text {
    font-size: $font-14;
    line-height: $font-14;
    font-weight: bold;
  }
}

.is-disabled {
  @apply cursor-not-allowed pointer-events-none;
}
</style>
