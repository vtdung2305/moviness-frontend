<script lang="ts" setup>
import { PropType } from 'vue'
import {
  MenuItem,
  MenuItemBase,
  MenuUser,
} from '@/interfaces/menu'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'

const { isDesktop } = useDevice()

const props = defineProps({
  menus: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
  useravatar: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  menusUser: {
    type: Array as PropType<MenuUser[]>,
    default: () => [],
  },
})

const showMenuDropdown = ref(false)
const showMenuMb = ref(false)
const subMenuShow = ref(-1)
const shownSubMenu = ref(false)

const route = useRoute()
const router = useRouter()

const handleShowSubMenu = (menuIndex: number) => {
  shownSubMenu.value = false

  if (subMenuShow.value !== menuIndex) {
    subMenuShow.value = menuIndex
  } else {
    subMenuShow.value = -1
  }
}

const checkHideSubmenu = ($event: any) => {
  const selfMenu = $event.target.closest('.menu__item')
  if (!selfMenu || !selfMenu.querySelector('.submenu')) {
    subMenuShow.value = -1
  }
  const selfMenuUser = $event.target.closest(
    '.header__use-info'
  )
  if (!selfMenuUser) {
    showMenuDropdown.value = false
  }
  const selfMenuMb = $event.target.closest(
    '.header__toggle-menu'
  )
  const selfMenuContainerMb = $event.target.closest('.menu')
  const selfSingleMenuMb = $event.target.closest(
    '.menu__item-link'
  )
  if (
    (!selfMenuMb && !selfMenuContainerMb) ||
    selfSingleMenuMb
  ) {
    showMenuMb.value = false
  }
}

const checkActiveMenu = (item: MenuItemBase) => {
  return item.routeActive?.includes(route.name as string)
}

const showAlert = () => {
  alert('開発しています。')
}

const handleClickSub = (
  item: MenuItemBase,
  $event: any
) => {
  shownSubMenu.value = true

  if (item.route) {
    router.push(item.route)
  } else {
    showAlert()
  }
  const subMenu = $event.target.closest('.submenu')
  if (subMenu) {
    subMenuShow.value = -1
    subMenu.style.display = 'none'
    setTimeout(() => {
      subMenu.style.display = ''
    }, 100)
  }
  showMenuMb.value = false
}

onMounted(() => {
  window.addEventListener('click', checkHideSubmenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', checkHideSubmenu)
})

watch(
  () => route.fullPath,
  () => {
    showMenuMb.value = false
  }
)
</script>

<template>
  <div class="header-menu z-10" :class="theme">
    <div class="header">
      <div
        class="header__container flex items-center justify-between px-10"
      >
        <div class="header__toggle-menu w-2/6">
          <span
            class="icon-menu cursor-pointer"
            @click="showMenuMb = true"
          ></span>
        </div>
        <div class="header__logo w-2/6 text-center">
          <NuxtLink to="/">
            <img
              src="/images/logo.png"
              class="mx-auto"
              alt="配信動画"
            />
          </NuxtLink>
        </div>
        <PageUserMenu
          :menus-user="menusUser"
          :username="username"
          :useravatar="useravatar"
          class="w-2/6 tablet:flex hidden"
        />
        <div class="w-2/6 tablet:hidden block"></div>
      </div>
    </div>
    <div
      class="menu"
      :class="{
        pc: $device.isDesktop,
        show: showMenuMb,
      }"
    >
      <div class="menu__header tablet:hidden block">
        <span
          class="icon-close text-22px"
          @click="showMenuMb = false"
        ></span>
        <PageUserMenu
          :menus-user="menusUser"
          :username="username"
          :useravatar="useravatar"
          class="mt-7"
        />
      </div>
      <div class="menu__list flex justify-between">
        <div
          v-for="(item, index) in menus"
          :key="index"
          class="menu__item cursor-pointer py-1.5 relative"
          :class="{
            showmenu:
              !checkActiveMenu(item) &&
              subMenuShow === index,
            active: checkActiveMenu(item),
          }"
        >
          <a
            v-if="!item.route && !item.subMenus.length"
            class="text-center"
            @click="showAlert()"
          >
            <div class="menu__item-container">
              <div
                class="menu__icon-container flex items-center justify-center"
              >
                <span
                  :class="item.icon"
                  class="menu__icon"
                ></span>
              </div>
              <div
                class="menu__text text-sm font-bold mt-2"
              >
                {{ $t(item.text) }}
              </div>
            </div>
          </a>
          <NuxtLink
            v-else-if="!item.subMenus.length"
            tag="a"
            :to="item.route ? item.route : undefined"
            class="text-center menu__item-link"
          >
            <div class="menu__item-container">
              <div
                class="menu__icon-container flex items-center justify-center"
              >
                <span
                  :class="item.icon"
                  class="menu__icon"
                ></span>
              </div>
              <div
                class="menu__text text-sm font-bold mt-2"
              >
                {{ $t(item.text) }}
              </div>
            </div>
          </NuxtLink>
          <a v-else class="text-center">
            <div
              class="menu__item-container"
              @click="handleShowSubMenu(index)"
            >
              <div
                class="menu__icon-container flex items-center justify-center"
              >
                <span
                  :class="item.icon"
                  class="menu__icon"
                ></span>
              </div>
              <div
                class="menu__text mt-2 text-sm font-bold flex items-center justify-center gap-x-1 whitespace-nowrap"
              >
                {{ $t(item.text) }}
                <span class="icon-down menu__icon-down" />
              </div>
            </div>
            <div
              class="submenu absolute"
              :class="{
                tablet: $device.isTablet,
                'show-submenu': subMenuShow === index,
                'sub-hidden': shownSubMenu,
              }"
            >
              <div
                v-for="(sub, i) in item.subMenus"
                :key="i"
                class="submenu__item font-bold"
                :class="{ active: checkActiveMenu(sub) }"
                @click="handleClickSub(sub, $event)"
              >
                {{ $t(sub.text) }}
              </div>
            </div>
          </a>
        </div>
      </div>
      <div
        class="menu__footer flex-1 flex flex-col justify-end tablet:hidden block pl-4 pb-30px"
      >
        <NuxtLink
          :to="`/terms`"
          target="_blank"
          class="menu__footer-text text-xs mt-2"
        >
          {{ $t('components.footer.rule') }}
        </NuxtLink>
        <NuxtLink
          :to="`/specified`"
          target="_blank"
          class="menu__footer-text text-xs mt-2"
        >
          {{ $t('components.footer.rule_desc') }}
        </NuxtLink>
        <NuxtLink
          :to="`/policy`"
          target="_blank"
          class="menu__footer-text text-xs mt-2"
        >
          {{ $t('components.footer.privacy_policy') }}
        </NuxtLink>
        <a
          href="https://ugoki-clinic.com/"
          target="_blank"
          class="text-12px leading-12px text-gray-2 cursor-pointer mt-2"
        >
          {{ $t('components.footer.video_copyright') }}
        </a>
        <p class="menu__footer-copyright mt-5">
          {{ $t('components.footer.copyright') }}
        </p>
      </div>
    </div>
    <ModalLogout :theme="theme" />
  </div>
</template>

<style scoped lang="scss">
.header {
  background: linear-gradient(
    132.08deg,
    #56bdb0 4.83%,
    #5bc2da 90.41%
  );
  padding: 17px 0;

  &__container {
    max-width: 1280px;
    margin: auto;
  }

  &__logo {
    img {
      width: 138px;
    }
  }

  &__toggle-menu {
    .icon-menu {
      display: none;
      &::before {
        color: white;
      }
    }
  }

  &__use-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    overflow: hidden;
  }

  &__use-name {
    font-size: $font-14;
    line-height: $font-14;
  }

  &__icon-down {
    span {
      font-size: $font-8;
    }
  }

  &__dropdown {
    background: $color-white;
    border-radius: 8px;
    overflow: hidden;
    width: 180px;
    top: calc(100% + 8px);
    z-index: 2;
  }

  &__dropdown-text {
    font-size: $font-16;
    line-height: $font-16;
  }

  &__dropdown-item {
    padding: 14px 18px 12px;
    border-top: 1px solid #d8d8db;

    &:first-child {
      border: none;
    }
  }

  &__dropdown-icon {
    max-width: 14px;
  }
}

.menu {
  padding: 6px 40px;
  background: $color-white;

  &__list {
    max-width: 828px;
    margin: auto;
  }

  &__item {
    width: 90px;
    height: 90px;

    a {
      text-decoration: none;
    }

    .icon-down {
      transition: all 0.3s ease;
    }

    &.active {
      .menu__icon-container {
        background: linear-gradient(
          180deg,
          #56bdb0 0%,
          #5bc2da 100%
        );
      }

      .menu__icon {
        color: $color-white;
      }

      .menu__text {
        color: $color-shinseido;
      }
    }

    &-link {
      &:hover:not(.router-link-active) {
        .menu__icon-container {
          border: 1px solid transparent;
        }
      }
    }
  }

  &__icon-container {
    width: 52px;
    height: 52px;
    border-radius: 20px;
    overflow: hidden;
    margin: auto;
  }

  &__icon {
    font-size: $font-26;
  }

  &__icon-down {
    font-size: $font-8;
  }

  &.pc {
    .menu__item {
      &:hover {
        position: relative;

        .icon-down {
          transform: rotate(180deg);
        }

        .submenu {
          transition: 0.2s;
          display: block;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: -20px;
          right: 0;
          width: 200%;
          height: 30px;
          background: transparent;
          z-index: 1;
        }
      }

      &:hover:not(.active) {
        .menu__icon-container {
          transition: 0.2s;
          border: 1px solid $color-shinseido;
        }

        .menu__icon {
          transition: 0.2s;
          color: $color-shinseido;
        }

        .menu__text {
          color: $color-shinseido;
        }
      }
    }
  }
}

.submenu {
  min-width: 83px;
  width: max-content;
  background: $color-white;
  border-radius: 8px;
  overflow: hidden;
  z-index: 2;
  top: calc(100% + 4px);
  right: 0;
  box-shadow: 0px 5px 10px
    rgba($color: #333333, $alpha: 0.05);
  display: none;

  &__item {
    padding: 13px 24px 14px;
    border-top: 1px solid $color-gray-3;
    font-size: $font-16;
    line-height: 21px;

    &:first-child {
      border: none;
    }

    &.active {
      color: $color-shinseido;
    }
  }

  @media screen and (min-width: $screen-tablet) {
    transition: all 0.2s ease 0s;
  }

  &.tablet.show-submenu {
    display: block;
  }
}

.kanrisha {
  .header {
    background: linear-gradient(
      132.08deg,
      #2cabdb 4.83%,
      #8b9bce 90.41%
    );
  }

  .menu {
    &__list {
      max-width: 584px;
    }

    &__item {
      &.active {
        .menu__icon-container {
          background: linear-gradient(
            180deg,
            #2cabdb 0%,
            #8b9bce 100%
          );
        }

        .menu__text {
          color: $color-kanrisha;
        }
      }
    }

    &.pc {
      .menu__item {
        &:hover {
          .submenu {
            transition: 0.2s;
            display: block;
          }
        }

        &:hover:not(.active) {
          .menu__icon-container {
            transition: 0.2s;
            border: 1px solid $color-kanrisha;
          }

          .menu__icon {
            transition: 0.2s;
            color: $color-kanrisha;
          }

          .menu__text {
            color: $color-kanrisha;
          }
        }
      }
    }
  }

  .submenu {
    &__item {
      &.active {
        color: $color-kanrisha;
      }
    }
  }
}

.trainer {
  .header {
    background: linear-gradient(
      132.08deg,
      #ef8a94 4.83%,
      #f6b38e 90.41%
    );
  }

  .menu {
    &__list {
      max-width: 584px;
    }

    &__item {
      &.active {
        .menu__icon-container {
          background: linear-gradient(
            180deg,
            #ef8a94 0%,
            #f6b38e 100%
          );
        }

        .menu__text {
          color: $color-trainer;
        }
      }
    }
    &.pc {
      .menu__item {
        &:hover {
          .submenu {
            transition: 0.2s;
            display: block;
          }
        }

        &:hover:not(.active) {
          .menu__icon-container {
            transition: 0.2s;
            border: 1px solid $color-trainer;
          }

          .menu__icon {
            transition: 0.2s;
            color: $color-trainer;
          }

          .menu__text {
            color: $color-trainer;
          }
        }
      }
    }
  }

  .submenu {
    &__item {
      &.active {
        color: $color-trainer;
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .menu__item {
    &.showmenu {
      .icon-down {
        transform: rotate(180deg);
      }

      .menu__icon-container {
        border: 1px solid $color-shinseido;
      }

      .menu__icon {
        color: $color-shinseido;
      }

      .menu__text {
        color: $color-shinseido;
      }
    }
  }

  .submenu {
    &.show-submenu {
      display: block;
    }
  }

  .kanrisha {
    .menu__item {
      &.showmenu {
        .menu__icon-container {
          border: 1px solid $color-kanrisha;
        }

        .menu__icon {
          color: $color-kanrisha;
        }

        .menu__text {
          color: $color-kanrisha;
        }
      }
    }
  }

  .trainer {
    .menu__item {
      &.showmenu {
        .menu__icon-container {
          border: 1px solid $color-trainer;
        }

        .menu__icon {
          color: $color-trainer;
        }

        .menu__text {
          color: $color-trainer;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .kanrisha {
    .menu {
      &__list {
        max-width: 508px;
      }
    }
  }

  .trainer {
    .menu {
      &__list {
        max-width: 368px;
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .header {
    padding: 20px 0;

    &__container {
      padding: 0 16px;
    }

    &__toggle-menu {
      .icon-menu {
        display: block;
      }
    }

    &__use-name {
      display: none;
    }

    &__icon-down {
      display: none;
    }

    &__logo {
      img {
        width: 92px;
      }
    }
  }

  .menu {
    position: fixed;
    padding: 0;
    top: 0;
    left: -100%;
    width: 319px;
    height: 100vh;
    z-index: 3;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;

    &.show {
      left: 0;
    }

    &__header {
      padding: 24px 32px 32px 16px;
      background: linear-gradient(
        132deg,
        #56bdb0 0%,
        #5bc2da 100%
      );

      .icon-close::before {
        color: $color-white-2;
      }
    }

    &__list {
      display: block;
      margin: inherit;
      overflow-y: auto;
    }

    &__item {
      width: unset;
      height: unset;
      padding: 0;

      &.active {
        .menu__icon-container {
          background: none !important;
        }

        .menu__icon {
          color: $color-gray-1 !important;
        }

        .menu__text {
          color: $color-gray-1 !important;
        }
      }

      &.showmenu {
        .menu__icon-container {
          border: none !important;
        }

        .menu__icon {
          color: $color-gray-1 !important;
        }

        .menu__text {
          color: $color-gray-1 !important;
        }
      }
    }

    &__item-container {
      text-align: left;
      display: flex;
      align-items: center;
      column-gap: 6px;
      padding: 16px;
      border-bottom: 1px solid $color-gray-3;
    }

    &__icon-container {
      margin: 0;
      width: 24px;
      height: 24px;
      border-radius: unset;
    }

    &__icon {
      font-size: unset;
    }

    &__text {
      margin: 0;
    }

    &__footer {
      color: $color-gray-2;
    }

    &__footer-copyright {
      font-size: $font-10;
      line-height: $font-14;
    }
  }

  .submenu {
    position: relative;
    width: unset;
    background: $color-gray-6;
    border-radius: unset;
    padding: 14px 24px;

    &__item {
      border-top: none;
      padding: 10px 0;
      padding-left: 40px;
      font-size: $font-14;
      line-height: 19px;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        width: 8px;
        height: 1px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 24px;
        background: $color-gray-2;
      }
    }
    &.show-submenu {
      display: block;
    }
  }

  .kanrisha {
    .menu {
      &__header {
        background: linear-gradient(
          132deg,
          #2cabdb 0%,
          #8b9bce 100%
        );
      }
    }
  }

  .trainer {
    .menu {
      &__header {
        background: linear-gradient(
          132deg,
          #ef8a94 0%,
          #f6b38e 100%
        );
      }
    }
  }
}
.sub-hidden {
  @media screen and (max-width: 1024px) and (min-width: 768px) {
    display: none !important;
  }
}
</style>
