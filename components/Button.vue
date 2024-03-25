<script lang="ts" setup>
import { PropType } from 'vue'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'

type TypeButton =
  | 'primary'
  | 'outline'
  | 'link'
  | 'secondary'
  | 'danger'
  | 'outline-error'

const props = defineProps({
  text: {
    type: [String, HTMLElement],
    default: '',
  },
  type: {
    type: String as PropType<TypeButton>,
    default: 'primary',
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  classButton: {
    type: String,
    default: '',
  },
})

const defaultStyle = `
  w-full h-13 rounded-2xl font-bold text-base
  cursor-pointer brightness
  transition-color duration-300
  focus:outline-none focus:ring-1 focus:ring-offset-1
  flex items-center justify-center font-bold
`
const emit = defineEmits(['click'])
const onClick = (event: MouseEvent) => {
  if (props.isDisabled) return
  const router = useRouter()
  if (props.to) {
    router.push(props.to)
  }
  if (!props.href) {
    emit('click')
  }
}
</script>

<template>
  <NuxtLink
    v-if="to"
    tag="a"
    :to="to"
    :class="`${defaultStyle} button-${theme} ${type} ${classButton}`"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    :class="`select-none ${defaultStyle} button-${theme} ${classButton} ${type} ${
      !!isDisabled
        ? 'cursor-default button-disable'
        : 'cursor-pointer'
    }`"
    :href="href"
    @click="onClick"
  >
    <slot />
  </a>
</template>
<style lang="scss" scoped>
@media (hover: hover) {
  .brightness:hover {
    opacity: 0.6;
    transition: 0.3s;
  }
}

.button-shinseido {
  &.primary {
    background-image: $gradient-90-shinseido;
    color: $color-white;
  }

  &.outline {
    border: 2px solid $color-shinseido;
    outline: none;
    color: $color-shinseido;
  }
}

.button-trainer {
  &.primary {
    background-image: $gradient-90-trainer;
    color: $color-white;
  }

  &.outline {
    border: 2px solid $color-trainer;
    outline: none;
    color: $color-trainer;
  }
}

.button-disable {
  background: #e4e7e8 !important;
  border: 1px solid #3333 !important;

  &:hover {
    filter: none;
    opacity: unset;
    transition: unset;
  }
}

.button-kanrisha {
  &.primary {
    background-image: $gradient-90-kanrisha;
    color: $color-white;
  }

  &.outline {
    border: 2px solid $color-kanrisha;
    outline: none;
    color: $color-kanrisha;
  }
}

.primary {
  border: 2px solid transparent;
  background-size: 105%;
  background-position: center;
}

.danger {
  background: $color-red-1;
  color: $color-white-2;
}

.secondary {
  background: $color-gray-2;
  color: $color-white-2;
}

.outline-error {
  border: 1px solid $color-red-1;
}
</style>
