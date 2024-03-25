<script lang="ts" setup>
import { RoleEnum } from '@/constants/role'

// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'seo-page',
})

const links = [
  {
    text: 'components.footer.user_guide',
    url: '/flow-to-procedure',
  },
  {
    text: 'components.footer.privacy_policy',
    url: '/policy',
  },
  {
    text: 'components.footer.terms_of_service',
    url: '/terms',
  },
  {
    text: 'components.footer.specified',
    url: '/specified',
  },
  {
    text: 'components.footer.operating_company',
    url: '',
  },
  {
    text: 'components.footer.inquiry',
    url: 'specified',
  },
]
</script>
<template>
  <div class="w-full app">
    <header>
      <div
        class="w-full flex h-80px justify-between items-center header"
      >
        <NuxtLink to="/">
          <img
            alt="配信動画"
            src="../assets/images/logos/logo-kanrisha.svg"
            class="w-197px h-36px cursor-pointer"
          />
        </NuxtLink>
        <div
          class="relative flex flex-1 justify-end items-center"
        >
          <a
            href="/#info"
            class="inquiry cursor-pointer <sm:hidden"
          >
            {{ $t('others.inquiry') }}
          </a>
          <Button
            :theme="RoleEnum.ADMIN"
            type="outline"
            class="relative rounded-22px h-44px w-112px py-10px px-24px btn-custom btn-custom-left"
          >
            {{ $t('others.login') }}
          </Button>
          <div
            class="sub-menu invisible flex justify-between items-center absolute top-62px right-30px rounded-8px w-303px h-48px px-38px py-12px bg-white opacity-1 duration-150"
          >
            <a
              href="/app/kanrisha/login"
              class="text-15px leading-normal"
            >
              {{ $t('common.admin') }}
            </a>
            <a
              href="/app/trainer/login"
              class="text-15px leading-normal"
            >
              {{ $t('common.trainer') }}
            </a>
          </div>
          <Button
            :theme="RoleEnum.ADMIN"
            to="/signup"
            type="primary"
            class="rounded-22px h-44px w-112px py-10px px-24px btn-custom <sm:hidden"
          >
            {{ $t('others.member_registration') }}
          </Button>
        </div>
      </div>
    </header>
    <slot />
    <div
      class="w-full flex flex-col justify-center items-center footer"
    >
      <img
        src="../assets/images/logos/logo-gray.svg"
        class="w-263px h-48px mb-40px"
      />
      <div
        class="flex gap-40px justify-center items-center mb-66px links"
      >
        <div
          v-for="(item, index) in links"
          :key="index"
          class="link"
        >
          <a :href="item.url">
            {{ $t(item.text) }}
          </a>
        </div>
      </div>
      <div class="copyright">
        Copyright © 2023 SHINSEIDO CO.,LTD. All Rights
        Reserved.
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.app {
  background: $background;
  font-family: 'Noto Sans JP', sans-serif;
}

header {
  background-color: $color-white;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 999;
}
.header {
  max-width: 1500px;
  margin: 0 auto;
  width: 90%;
  .btn-custom {
    letter-spacing: -1px;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    &.btn-custom-left {
      margin-right: 16px;
      margin-left: 24px;

      @media screen and (max-width: $screen-mobile) {
        padding-left: 24px;
        padding-right: 24px;
      }

      @media screen and (max-width: 320px) {
        padding-left: 14px;
        padding-right: 14px;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translateY(100%);
        width: 100%;
        height: 20px;
      }

      &:hover + div {
        visibility: visible;
        transition: 0.3s;
        opacity: 1;
      }
    }
  }

  .inquiry {
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    letter-spacing: 0;
    color: $color-black;
  }

  @media screen and (max-width: $screen-tablet) {
    img {
      width: auto;
      height: 20px;
    }

    .btn-custom {
      font-size: 12px;
      line-height: 12px;
      padding: 8px 12px;
      width: fit-content;
      height: 40px;

      &.btn-custom-left {
        margin: 8px;
      }
    }

    .inquiry {
      font-size: 12px;
    }
  }

  @media screen and (max-width: $screen-mobile) {
    img {
      width: auto;
      height: 28px;
    }

    .btn-custom {
      &.btn-custom-left {
        padding-left: 28px;
        padding-right: 28px;
        font-size: 16px;
      }
    }
  }

  .sub-menu {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 1px;
      height: 48px;
      background-color: #d8d8db;
    }

    &:hover {
      visibility: visible;
      opacity: 1;
    }

    & > a {
      color: $color-black;
      border-bottom: solid 2px transparent;
      transition: 0.3s;

      &:hover {
        color: $color-kanrisha;
        border-bottom: solid 2px $color-kanrisha;
        transition: 0.3s;
      }
    }
  }
}

.footer {
  background-color: $color-white;
  padding-bottom: 72px;
  padding-top: 80px;

  .link {
    font-weight: 500;
    font-size: 16px;
    line-height: 23px;
    color: $color-black;
    letter-spacing: 0;
    cursor: pointer;

    &:hover {
      color: $color-gray-2;
      transition: 0.3s;
    }
  }

  .copyright {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: $color-black;
    letter-spacing: 0px;
    margin-left: 40px;
  }

  @media screen and (max-width: calc($screen-desktop - 100px)) {
    padding: 32px 16px;

    img {
      width: auto;
      height: 32px;
      margin-bottom: 24px;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }

    .link {
      font-size: 12px;
      line-height: 12px;
    }
  }

  @media screen and (max-width: $screen-tablet) {
    .copyright {
      font-size: 12px;
      margin-left: 0;
    }
  }
}
</style>
