<script setup lang="ts">
import { PropType } from 'vue'
import { TrainerStatusEnum } from '@/constants/trainer'
import { ITrainer } from '@/interfaces/trainer'

const { t } = useLang()
const { getFullName, truncateJapaneseString } = useHelper()
const config = useRuntimeConfig()

const props = defineProps({
  trainer: {
    type: Object as PropType<ITrainer>,
    default: null,
  },
})

const isNotSpecified = computed(
  () => props.trainer.status === TrainerStatusEnum.INVALID
)

const isLock = computed(
  () => props.trainer.status === TrainerStatusEnum.BLOCK
)

const srcImg = computed(() => {
  const imageDefault = '/images/avatar-default-2.png'
  return props.trainer?.avatar
    ? props.trainer?.url_avatar
    : imageDefault
})

const totalUser = computed(() => {
  const people = t('pages.trainer_list.people')
  const male = t('pages.trainer_list.male')
  const woman = t('pages.trainer_list.woman')
  const noSet = t('pages.trainer_list.gender_others')
  const maleNum = props.trainer.total_member_male
  const femaleNum = props.trainer.total_member_female
  const otherNum = props.trainer.total_member_unknow
  const totalNum = props.trainer.total_member
  return `${totalNum}${people}（${male}:${maleNum}${people} ${woman}:${femaleNum}${people} ${noSet}:${otherNum}${people}）`
})
</script>

<template>
  <div class="flex flex-col p-4 flex-1 card">
    <div
      class="flex pb-4 tablet:pb-12px desktop:pb-13px items-center content"
    >
      <div
        class="avatar overflow-hidden desktop:w-14 desktop:h-14 tablet:w-72px tablet:h-72px w-14 h-14 mr-2 desktop:mr-4"
      >
        <img
          :src="srcImg"
          alt="トレーナー"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="flex flex-1 flex-col justify-center gap-8px tablet:gap-13px"
      >
        <div
          class="text-label text-sm tablet:text-xl tablet:leading-27px font-bold"
        >
          {{
            truncateJapaneseString(
              getFullName(
                trainer.last_name,
                trainer.first_name
              ),
              15
            ) || $t('others.empty')
          }}
        </div>
        <div
          class="text-content text-xs tablet:text-sm tablet:leading-19px font-medium whitespace-pre-wrap"
        >
          <span class="icon-phone text-17px mr-4px" />
          {{ trainer.tel || $t('others.empty') }}
        </div>
      </div>
      <div
        class="flex flex-1 flex-col gap-8px items-end min-w-16 tablet:min-w-100px"
      >
        <div
          v-if="isNotSpecified"
          class="tag outline-red text-xs tablet:text-sm tablet:leading-19px font-bold"
        >
          {{ t('pages.trainer_list.trainer_card.status') }}
        </div>
        <div
          v-else-if="isLock"
          class="tag outline-red text-xs tablet:text-sm tablet:leading-19px font-bold"
        >
          {{ trainer.status_label }}
        </div>
      </div>
    </div>
    <div
      class="flex gap-1 tablet:gap-38px pt-4 tablet:pt-13px flex-col tablet:flex-row"
    >
      <div
        class="text-xs tablet:text-base tablet:leading-21px"
      >
        <span class="icon-flag-star" />
        {{ trainer?.total_group }}
        {{ t('pages.trainer_list.trainer_card.group') }}
      </div>
      <div
        class="text-xs tablet:text-base tablet:leading-21px"
      >
        <span class="icon-user mr-2" /> {{ totalUser }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.card {
  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
  border-radius: 24px;
  background-color: $color-white-2;
  @media screen and (min-width: $screen-tablet) {
    padding: 29px 32px 31px;
  }

  @media screen and (min-width: $screen-desktop) {
    padding: 23px 40px 22px 24px;
  }
}

.content {
  border-bottom: 1px solid #d8d8db;
}

.avatar {
  background-color: $color-gray-5;
  border-radius: 50%;
}

.text-label {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (min-width: $screen-desktop) {
    -webkit-line-clamp: 1;
  }
}

.tag {
  padding: 5px 10px;
  border-radius: 12px;
  width: fit-content;

  &.outline-red {
    color: $color-red-1;
    border: 1px solid $color-red-1;
  }

  @media screen and (min-width: $screen-tablet) {
    padding: 5px 16px 6px 13px;
  }
}
</style>
