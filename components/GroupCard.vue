<script setup lang="ts">
import { PropType } from 'vue'
import { IGroup } from '@/interfaces/group'
import { ImageDefaultEnum } from '@/constants/image'
import { useUser } from '@/stores/user'

const { t } = useLang()
const { getFullName } = useHelper()
const userStore = useUser()

const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    default: null,
  },
})

const isNotSpecified = computed(
  () => !props.group.trainer_id
)

const trainerName = computed(() => {
  return (
    getFullName(
      props.group.trainer?.last_name,
      props.group.trainer?.first_name
    ) || t('others.empty')
  )
})

const srcImg = computed(() => {
  const imageDefault = ImageDefaultEnum.IMAGE_GROUP_DEFAULT
  return props.group?.image
    ? props.group.url_image
    : imageDefault
})

const totalUser = computed(() => {
  const people = t('pages.group_detail.people')
  const male = t('pages.group_detail.male')
  const woman = t('pages.group_detail.woman')
  const noSet = t('pages.group_detail.gender_others')
  const maleNum = props.group.total_member_male
  const femaleNum = props.group.total_member_female
  const otherNum = props.group.total_member_unknow
  const totalNum = props.group.total_member
  return `${totalNum}${people}（${male}:${maleNum}${people} ${woman}:${femaleNum}${people} ${noSet}:${otherNum}${people}）`
})
</script>

<template>
  <div class="flex flex-col p-4 flex-1 card">
    <div
      class="flex pb-4 tablet:pb-12px desktop:pb-13px items-center content"
    >
      <div
        class="avatar overflow-hidden desktop:w-14 desktop:h-14 tablet:w-72px tablet:h-72px w-14 h-14 mr-6 desktop:mr-4"
      >
        <img
          :src="srcImg"
          class="w-full h-full object-contain"
          alt=""
        />
      </div>
      <div
        class="flex flex-1 flex-col justify-center gap-8px tablet:gap-13px overflow-hidden"
      >
        <div
          class="text-sm tablet:text-xl tablet:leading-27px font-bold whitespace-nowrap truncate"
        >
          {{ group.name || $t('others.empty') }}
        </div>
        <div
          class="text-sm tablet:text-sm tablet:leading-19px whitespace-nowrap truncate"
        >
          {{ group.content || $t('others.empty') }}
        </div>
      </div>
      <div
        v-if="isNotSpecified"
        class="flex flex-col gap-8px items-end min-w-16 tablet:min-w-100px"
      >
        <div
          class="tag outline-red text-xs tablet:text-sm tablet:leading-19px font-bold"
        >
          {{ $t('components.group_card.no_set') }}
        </div>
      </div>
    </div>
    <div
      class="flex gap-1 tablet:gap-38px pt-4 tablet:pt-13px flex-col tablet:flex-row"
    >
      <div
        class="text-sm tablet:text-base tablet:leading-21px"
      >
        <span class="icon-user mr-2" />{{ totalUser }}
      </div>
      <div
        class="text-sm tablet:text-base tablet:leading-21px"
      >
        <i class="icon-training mr-2" />
        <span
          :class="{
            'font-bold':
              props.group.trainer?.id ===
              userStore.userData?.id,
          }"
        >
          {{ trainerName }}
        </span>
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
    padding: 32px;
  }

  @media screen and (min-width: $screen-desktop) {
    padding: 32px;
  }
}

.content {
  border-bottom: 1px solid #d8d8db;
}

.avatar {
  background-color: $color-gray-5;
  border-radius: 50%;
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
