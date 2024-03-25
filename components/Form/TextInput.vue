<script lang="ts" setup>
import { PropType } from 'vue'

type TypeInput =
  | 'email'
  | 'number'
  | 'text'
  | 'tel'
  | 'password'
  | 'textarea'
  | 'search'
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  subLabel: {
    type: String,
    default: '',
  },
  typeInput: {
    type: String as PropType<TypeInput>,
    default: 'text',
  },
  errors: {
    type: Array,
    default: () => [],
  },
  isValidData: {
    type: Boolean,
    default: true,
  },
  rows: {
    type: Number,
    default: 5,
  },
  maxLength: {
    type: Number,
    default: 10000,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  classInput: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
})
const input = ref(null)
const emit = defineEmits(['update:modelValue', 'on-enter'])
const modelValue = useSyncProps<string>(
  props,
  'modelValue',
  emit
)

defineExpose({
  focus: () => (input.value as any).focus(),
})
</script>

<template>
  <div
    :class="`text-input-container relative flex-col ${
      errors.length > 0 || !isValidData ? 'error' : ''
    }`"
  >
    <div class="flex">
      <div v-if="label" class="label mb-8px font-bold">
        {{ label }}
      </div>
      <span
        v-if="isRequired"
        class="text-xs tablet:text-sm tablet:leading-19px ml-2 text-validate font-medium"
      >
        {{ $t('common.required') }}
      </span>
    </div>
    <div class="flex relative">
      <div v-if="subLabel" class="sub-label">
        {{ subLabel }}
      </div>
      <span
        v-if="icon"
        :class="icon"
        class="absolute text-base top-1/2 left-4"
      ></span>
      <span
        v-if="typeInput === 'search'"
        class="icon-search absolute text-base top-1/2 left-4"
      ></span>
      <textarea
        v-if="typeInput === 'textarea'"
        ref="input"
        v-model="modelValue"
        :disabled="isDisabled"
        :placeholder="placeholder"
        :class="`input input--no-limit-height p-4 w-full text-base rounded-2xl border ${classInput}`"
        :rows="rows"
        :maxlength="maxLength"
      ></textarea>
      <input
        v-else
        ref="input"
        v-model="modelValue"
        :maxlength="maxLength"
        :disabled="isDisabled"
        :type="typeInput"
        :placeholder="placeholder"
        class="input p-4 w-full text-base rounded-2xl border"
        :class="[typeInput, classInput]"
        @keyup.enter="emit('on-enter')"
      />
      <span
        v-if="modelValue"
        class="icon-close-circle-outline absolute clear top-1/2 right-4"
        :class="{ disabled: isDisabled }"
        @click="modelValue = ''"
      ></span>
    </div>
    <div
      v-for="(error, index) in errors"
      :key="`error-${label}-${index}`"
      class="error-text font-medium"
    >
      {{ (error as any).$message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/sass/_variables.scss';

.label {
  font-style: normal;
  font-weight: 700;
  font-size: $font-16;
  line-height: $font-16;
  color: $color-gray-1;
}

.input {
  background: $color-white-2;
  color: $color-gray-2;
  border-color: $color-gray-3;
  max-height: 52px;
  padding-right: 40px;

  &--no-limit-height {
    max-height: unset;
  }

  &::-webkit-input-placeholder {
    letter-spacing: 0.08em;
  }

  &:-ms-input-placeholder {
    letter-spacing: 0.08em;
  }

  &::placeholder {
    letter-spacing: 0.08em;
  }

  &.number {
    &::-webkit-input-placeholder {
      letter-spacing: 0;
    }

    &:-ms-input-placeholder {
      letter-spacing: 0;
    }

    &::placeholder {
      letter-spacing: 0;
    }
  }

  &:disabled {
    background: #e4e7e8;
  }
}

.clear {
  transform: translateY(-50%);
  font-size: $font-14;
  cursor: pointer;

  &.disabled {
    &::before {
      content: '';
    }
  }
}

.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
  margin-top: 8px;
}

.text-validate {
  color: $color-red-1;
}

.error {
  textarea,
  input {
    background-color: $color-red-2 !important;
    border: 1px solid $color-red-1 !important;
  }
}

.icon-search {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.search {
  padding-left: 48px;
}
</style>
