<script lang="ts" setup>
import { ImageDefaultEnum } from '@/constants/image'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  avatarWhite: {
    type: Boolean,
    default: false,
  },
  hideId: {
    type: Boolean,
    default: false,
  },
})

const { getFullName, truncateJapaneseString } = useHelper()
const { t } = useLang()

const srcImg = computed(() => {
  const avatarDefault =
    ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
  return props.user?.avatar
    ? props.user.url_avatar
    : avatarDefault
})

const level = computed(() => {
  if (props.user?.level === 0) {
    return t('others.no_value')
  } else {
    return props.user?.level
  }
})
</script>
<template>
  <div class="item-user p-3 tablet:p-4">
    <div class="item-user__content flex items-center">
      <div
        class="item-user__avatar min-w-10 w-10 w-10 tablet:min-w-14 tablet:w-14 tablet:h-14 rounded-full overflow-hidden"
      >
        <img :src="srcImg" />
      </div>
      <div class="item-user__info ml-2 tablet:ml-6">
        <div class="item-user__info-top flex items-center">
          <div
            v-if="!hideId"
            class="item-user__info-id text-xs tablet:text-base font-bold mr-2 tablet:mr-4"
          >
            {{ user.karute || $t('others.empty') }}
          </div>
          <div class="item-user__info-level font-medium">
            {{ $t('pages.user_detail.function_level') }}:
            <span class="font-bold">
              {{ level || $t('others.empty') }}
            </span>
          </div>
        </div>
        <div
          class="item-user__info-bot flex flex-col items-start tablet:flex-row tablet:items-center mt-1 tablet:mt-2"
        >
          <div class="item-user__info-name font-bold">
            {{
              truncateJapaneseString(
                getFullName(
                  user.last_name,
                  user.first_name
                ),
                15
              ) || $t('others.empty')
            }}
          </div>
          <div
            class="item-user__info-name-kana tablet:ml-1.5 text-xs tablet:ml-3.5 tablet:text-base font-medium"
          >
            {{
              truncateJapaneseString(
                getFullName(
                  user.last_name_kana,
                  user.first_name_kana
                ),
                15
              ) || $t('others.empty')
            }}
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
<style scoped lang="scss">
.item-user {
  &__info-level {
    font-size: $font-14;
    line-height: $font-14;

    @media screen and (max-width: $screen-mobile) {
      font-size: $font-10;
      line-height: $font-10;
    }
  }

  &__info-name {
    font-size: $font-22;
    line-height: $font-22;

    @media screen and (max-width: $screen-mobile) {
      font-size: $font-16;
      line-height: $font-16;
    }
  }
}
</style>
