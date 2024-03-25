<script setup lang="ts">
import { PropType } from 'vue'
import { IFacility } from '@/interfaces/facility'
import { facilityStatusList } from '@/constants/facility'
import { ImageDefaultEnum } from '@/constants/image'

const props = defineProps({
  facility: {
    type: Object as PropType<IFacility>,
    required: true,
  },
})
const { getFullName, formatDate } = useHelper()
const { t } = useLang()
const createTime = computed(() => {
  const year = props.facility.created_at?.slice(0, 4)
  const month = props.facility.created_at?.slice(5, 7)
  const day = props.facility.created_at?.slice(8, 10)
  return t('pages.group_registration_confirmation.date', {
    year,
    month,
    day,
  })
})
const status = computed(() => {
  if (props.facility.is_request_upgrade_plan) {
    return t('pages.facility.status.requesting_renew')
  } else {
    return facilityStatusList.find(
      (item) => item.value === Number(props.facility.status)
    )?.name
  }
})
const srcImg = computed(() => {
  const imageDefault =
    ImageDefaultEnum.IMAGE_FACILITY_DEFAULT
  return props.facility?.avatar
    ? props.facility.url_avatar
    : imageDefault
})
</script>

<template>
  <NuxtLink :to="`/app/shinseido/facility/${facility.id}`">
    <div
      class="flex flex-col mobile:px-32px mobile:py-30px p-4 flex-1 desktop:p-24px desktop:pt-18px card"
    >
      <div
        class="flex pb-4 items-center desktop:pb-7px content"
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
          class="flex flex-col justify-center gap-8px intro"
        >
          <div
            class="text-20px leading-20px font-bold tracking-1.6px facility-name"
          >
            {{ facility.name }}
          </div>
          <div
            class="text-14px leading-14px tracking-1.12px"
          >
            {{ facility.name_kata }}
          </div>
        </div>
        <div
          class="flex flex-1 flex-col mt-6px desktop:mt-0 gap-8px items-end"
          :class="status"
        >
          <div class="tag primary font-bold">
            {{ facility.plan?.name || $t('others.empty') }}
          </div>
          <div class="tag outline-red font-bold">
            {{ $t(status as string) }}
          </div>
        </div>
      </div>
      <div class="flex gap-8 pt-4">
        <div class="text-16px leading-16px tracking-1.28px">
          <span class="icon-user mr-2" />
          {{
            getFullName(
              facility.info?.president_last_name,
              facility.info?.president_first_name
            )
          }}
        </div>
        <div class="text-16px leading-16px tracking-1.28px">
          <span class="icon-clock mr-2" />
          {{ formatDate(facility.plan_expire_at) }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
<style lang="scss" scoped>
.card {
  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
  border-radius: 24px;
  background-color: $color-white-2;
}

.content {
  border-bottom: 1px solid $color-gray-3;
}

.avatar {
  width: 72px;
  height: 72px;
  background-color: $color-gray-5;
  border-radius: 50%;
  margin-right: 24px;

  @media screen and (min-width: $screen-desktop) {
    width: 56px;
    height: 56px;
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
    background-color: $color-shinseido;
    color: $color-white;
  }

  &.outline-red {
    color: $color-red-1;
    border: 1px solid $color-red-1;
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

.facility-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.intro {
  max-width: 65%;
}
</style>
