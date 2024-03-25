<script setup lang="ts">
import { PropType } from 'vue'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { IMemberItem } from '@/interfaces/member'
import { levels } from '@/constants/member'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  member: {
    type: Object as PropType<IMemberItem>,
    required: true,
  },
})

const {
  getFullName,
  getStatusMember,
  truncateJapaneseString,
} = useHelper()

const avatar = computed(() => {
  return props.member.avatar && props.member.url_avatar
    ? props.member.url_avatar
    : '/images/avatar-default-2.png'
})

const status = computed(() => {
  return getStatusMember(
    props.member.group?.id,
    props.member.trainer?.id,
    props.member.status
  )
})

const level = computed(() => {
  return (
    levels.find((item) => item.value === props.member.level)
      ?.name || useLang().t('others.no_value')
  )
})
</script>

<template>
  <div
    class="flex flex-col mobile:px-8 mobile:py-30px px-4 py-4 flex-1 card cursor-pointer"
    :class="`theme-${theme}`"
  >
    <div
      class="flex pb-4 items-center content desktop:pb-8px"
    >
      <img
        class="avatar"
        :src="avatar"
        alt="利用者の写真"
      />
      <div
        class="flex flex-col justify-center gap-8px desktop:gap-0px"
      >
        <div
          class="text-20px leading-21px font-bold tracking-3px mt-4px desktop:mt-0px desktop:mb-8px"
        >
          {{
            truncateJapaneseString(
              getFullName(
                member.last_name,
                member.first_name
              ),
              15
            ) || $t('others.empty')
          }}
        </div>
        <div class="text-14px leading-14px tracking-1.12px">
          {{
            truncateJapaneseString(
              getFullName(
                member.last_name_kana,
                member.first_name_kana
              ),
              15
            ) || $t('others.empty')
          }}
        </div>
      </div>
      <div
        class="flex flex-1 flex-col gap-8px items-end min-w-100px"
        :class="{
          expired: status.value === 3,
          configured: status.value === 1,
        }"
      >
        <div class="tag primary">
          {{ member.karute || $t('others.empty') }}
        </div>
        <div class="tag outline-red font-bold">
          {{ $t(status.name) || $t('others.empty') }}
        </div>
      </div>
    </div>
    <div
      class="flex gap-20px pt-4 footer-card <sm:gap-16px <sm:flex-col"
    >
      <div
        class="text-16px leading-19px footer-carrd__info"
      >
        <span class="icon-flag-star mr-4px" />
        {{
          truncateJapaneseString(member.group?.name, 12) ||
          $t('others.empty')
        }}
      </div>
      <div
        class="text-16px leading-19px footer-carrd__info"
      >
        <span class="icon-training mr-2px" />
        {{
          member.trainer
            ? getFullName(
                member.trainer.last_name,
                member.trainer.first_name
              )
            : $t('others.empty')
        }}
      </div>
      <div
        class="text-16px leading-19px ml-4px footer-carrd__info"
      >
        {{ $t('pages.user_list.level') }}:
        {{ level }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.card {
  @media screen and (min-width: $screen-desktop) {
    padding: 18px 24px 24px 24px;
    padding-bottom: 23px;
  }

  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
  border-radius: 24px;
  background-color: $color-white-2;
  color: $color-gray-1;
}

.theme-shinseido .tag.primary {
  background-color: $color-shinseido;
}

.theme-trainer .tag.primary {
  background-color: $color-trainer;
}

.theme-kanrisha .tag.primary {
  background-color: $color-kanrisha;
}

.content {
  border-bottom: 1px solid $color-gray-3;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-right: 18px;
  object-fit: cover;

  @media screen and (min-width: $screen-desktop) {
    width: 56px;
    height: 56px;
    margin-right: 18px;
  }
}

.tag {
  padding: 8px 16px;
  font-size: $font-14;
  line-height: $font-14;
  letter-spacing: 1.12px;
  border-radius: 12px;
  width: fit-content;

  &.primary {
    color: $color-white;
  }

  &.outline-red {
    color: $color-red-1;
    border: 1px solid $color-red-1;
    padding: 7px 14px;
  }
}

.theme-shinseido .configured {
  .tag.outline-red {
    border-color: $color-shinseido;
    color: $color-shinseido;
  }
}

.theme-kanrisha .configured {
  .tag.outline-red {
    border-color: $color-kanrisha;
    color: $color-kanrisha;
  }
}

.theme-trainer .configured {
  .tag.outline-red {
    border-color: $color-trainer;
    color: $color-trainer;
  }
}

.expired {
  .tag.primary {
    background-color: #aaaaac;
  }

  .tag.outline-red {
    border-color: $color-gray-4;
    color: $color-gray-4;
    opacity: 0.6;
  }
}

.requesting_renew {
  .tag.outline-red {
    border-color: $color-red-1;
    background-color: $color-red-1;
    color: white;
  }
}

.has_deadline {
  .tag.outline-red {
    border-color: $color-red-1;
    background-color: transparent;
    color: $color-red-1;
  }
}

.no_deadline {
  .tag.outline-red {
    display: none;
  }
}

.footer-card {
  color: $color-gray-2;

  @media screen and (max-width: 600px) {
    .footer-carrd__info {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
    }
  }
}
</style>
