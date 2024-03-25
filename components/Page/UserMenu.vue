<script lang="ts" setup>
import { PropType } from 'vue'
import { MenuUser } from '@/interfaces/menu'

defineProps({
  username: {
    type: String,
    default: '',
  },
  useravatar: {
    type: String,
    default: '',
  },
  menusUser: {
    type: Array as PropType<MenuUser[]>,
    default: () => [],
  },
})

const showMenuUser = ref(false)
const router = useRouter()

const handleClickMenu = (item: MenuUser) => {
  if (item.route) {
    router.push(item.route)
    return
  } else if (item.onClick) {
    item.onClick()
    return
  }
  alert('開発しています。')
}

const checkHideMenu = ($event: any) => {
  const selfMenuUser = $event.target.closest(
    '.user-menu__icon-down'
  )
  if (!selfMenuUser) {
    showMenuUser.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', checkHideMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', checkHideMenu)
})
</script>

<template>
  <div
    class="user-menu flex items-center tablet:justify-end relative justify-between"
  >
    <div
      class="user-menu__info flex items-center flex-row-reverse tablet:flex-row"
    >
      <div
        class="user-menu__user-name text-white font-bold ml-15px tablet:ml-0 select-none"
      >
        {{ username }}
      </div>
      <div
        class="user-menu__user-avatar w-10 h-10 tablet:ml-1.5 tablet:w-8 tablet:h-8 rounded-lg overflow-hidden"
      >
        <img
          :src="useravatar"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div
      class="user-menu__icon-down ml-2 text-white cursor-pointer"
      @click="showMenuUser = !showMenuUser"
    >
      <span
        class="icon-overflow-menu-vertical tablet:hidden inline"
      ></span>
      <span
        class="icon-triangle-down tablet:inline hidden relative"
      ></span>
    </div>
    <div
      v-if="showMenuUser"
      class="user-menu__dropdown absolute right-0"
    >
      <div
        v-for="(item, index) in menusUser"
        :key="index"
        class="user-menu__dropdown-item flex items-center justify-between cursor-pointer transition-opacity ease-in duration-200 hover:opacity-60"
        @click="handleClickMenu(item)"
      >
        <span
          class="user-menu__dropdown-text text-sm font-bold select-none"
        >
          {{ $t(item.text) }}
        </span>
        <span
          :class="item.icon"
          class="user-menu__dropdown-icon"
        ></span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.user-menu {
  &__user-name {
    font-size: $font-14;
    line-height: $font-14;
    white-space: pre;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__icon-down {
    &::before {
      content: '';
      width: 120px;
      height: 32px;
      top: 0;
      right: 0;
      position: absolute;
      background: transparent;
    }

    span {
      font-size: $font-6;
    }
  }

  &__dropdown {
    background: $color-white;
    border-radius: 8px;
    overflow: hidden;
    width: 217px;
    top: calc(100% + 8px);
    z-index: 2;
    box-shadow: 0px 5px 10px
      rgba($color: #333333, $alpha: 0.05);
  }

  &__dropdown-text {
    font-size: $font-16;
    line-height: 21px;
  }

  &__dropdown-item {
    padding: 16px 18px 16px 12px;
    max-height: 46px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      top: 0;
      left: 0;
      background: $color-gray-3;
    }

    &:first-child {
      &::before {
        content: unset;
      }
    }
  }

  &__dropdown-icon {
    width: 15px;
  }

  @media screen and (max-width: $screen-tablet) {
    &__icon-down {
      span {
        font-size: $font-24;
      }

      &::before {
        content: unset;
      }
    }

    &__dropdown {
      top: -4px;
      right: -16px;
      width: 180px;
    }

    &__dropdown-item {
      padding: 13px 18px 14px 12px;
    }

    &__dropdown-text {
      font-size: $font-14;
      line-height: 19px;
    }
  }
}
</style>
