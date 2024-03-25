<script lang="ts" setup>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'

interface IItemObject {
  label: string
  value: string | number
  checked?: boolean
}

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  textButton: {
    type: String,
    default: '',
  },
  items: {
    type: Array<String>,
    default: [],
  },
  errors: {
    type: Array,
    default: () => [],
  },
  objectItem: {
    type: Object as () => IItemObject[],
    default: null,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})
const isShowMenuItems = ref<Boolean>(false)
const emit = defineEmits([
  'update:modelValue',
  'on-selected',
  'loadmore',
])
const modelValue = useSyncProps<String>(
  props,
  'modelValue',
  emit
)
const onSelected = (value: String) => {
  emit('update:modelValue', value)
  emit('on-selected', value)
}

const handleOnScroll = ($event: any) => {
  if (
    $event.target.scrollTop + $event.target.clientHeight >=
    $event.target.scrollHeight
  ) {
    emit('loadmore')
  }
}

const labelSelected = computed(() => {
  if (
    !props.objectItem ||
    props.objectItem.length < 1 ||
    !props.modelValue
  )
    return ''
  return props.objectItem.find(
    (el) => el.value === props.modelValue
  )?.label
})

const setStatus = () => {
  setTimeout(() => {
    isShowMenuItems.value = !!document.getElementById(
      'dropdow-menu-custom'
    )
  }, 100)
}
</script>
<template>
  <Menu
    as="div"
    :class="`relative flex flex-col ${
      errors.length > 0 ? 'error' : ''
    } ${isDisabled ? 'disabled' : ''}`"
  >
    <div
      v-if="label"
      class="text-sm leading-14px tracking-1.12px mb-2 font-bold label"
    >
      {{ $t(label) }}
    </div>
    <MenuButton
      class="text-base relative font-medium dropdown-button whitespace-nowrap"
      :class="`${isShowMenuItems ? 'open' : ''}`"
    >
      {{
        labelSelected
          ? labelSelected
          : modelValue
          ? $t(modelValue)
          : $t(textButton)
      }}
      <span class="icon-down" />
    </MenuButton>
    <span
      v-for="(error, index) in errors"
      :key="`error-${label}-${index}`"
      class="error-text text-sm font-medium mt-1.5"
    >
      {{ (error as any).$message }}
    </span>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
      class="list-item__wrapper !w-full"
    >
      <MenuItems
        class="absolute top-full left-0 z-10 mt-2 w-max min-w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        @vnode-updated="setStatus"
      >
        <div
          id="dropdow-menu-custom"
          class="py-1 max-h-180px tablet:max-h-360px overflow-auto list-item__content"
          @scroll="handleOnScroll($event)"
        >
          <div v-if="!objectItem && !items.length">
            <MenuItem>
              <div
                :class="[
                  'active',
                  'block px-4 py-2 text-base',
                ]"
                class="cursor-pointer menu-item"
              >
                {{ $t(textButton) }}
              </div>
            </MenuItem>
          </div>
          <div v-if="!!objectItem">
            <MenuItem
              v-for="(item, index) in objectItem"
              v-slot="{ active }"
              :key="index"
            >
              <div
                :class="[
                  active || modelValue === item.value
                    ? 'active'
                    : 'nomal',
                  item.checked ? 'font-bold' : '',
                  'block px-4 py-2 text-base',
                ]"
                class="cursor-pointer menu-item"
                @click="onSelected(item?.value as String)"
              >
                {{ $t(item?.label as string) }}
              </div>
            </MenuItem>
          </div>
          <div v-else>
            <MenuItem
              v-for="(item, index) in items"
              v-slot="{ active }"
              :key="index"
            >
              <div
                :class="[
                  active || modelValue === item
                    ? 'active'
                    : 'nomal',
                  'block px-4 py-2 text-base',
                ]"
                class="cursor-pointer menu-item"
                @click="onSelected(item)"
              >
                {{ $t(item as string) }}
              </div>
            </MenuItem>
          </div>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.label {
  color: $color-black-1;
}

.dropdown-button {
  border: solid 1px $color-gray-3;
  border-radius: 16px;
  background-color: $color-white-2;
  padding: 17px 36px 17px 16px;
  text-align: left;
  color: $color-gray-2;
  letter-spacing: 0.08em;
  line-height: 1;
  white-space: pre;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;

  &.open {
    .icon-down {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  .icon-down {
    font-size: 7px;
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%) rotate(0deg);
    transition: 0.3s;

    &::before {
      color: $color-black-2;
    }
  }
}

.menu-item {
  background-color: $color-white-2;
  color: $color-gray-2;
  border-bottom: solid 1px $color-gray-3;

  &:last-child {
    border-bottom: none;
  }
}

.active {
  background-color: rgb(243, 244, 246);
}

.error-text {
  color: $color-red-1;
  white-space: pre;
}

.error {
  .dropdown-button {
    background-color: $color-red-2 !important;
    border: 1px solid $color-red-1 !important;
  }
}

.disabled {
  pointer-events: none;
  touch-action: none;

  .dropdown-button {
    color: $color-gray-2;
    background-color: $color-gray-5;
  }
}
</style>
