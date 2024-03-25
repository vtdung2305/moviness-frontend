<script lang="ts" setup>
import { ICheckPoint } from '@/interfaces/video'
import { useVideo } from '@/stores/video'
import { useUser } from '@/stores/user'
import { timeDuration } from '@/helper/number'
import { ImageScale } from '@/constants/image'
import { useMember } from '@/stores/member'

const videoStore = useVideo()
const userStore = useUser()

const props = defineProps({
  checkpoint: {
    type: Object as () => ICheckPoint,
    default: null,
  },
  notAction: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: null,
  },
})

const { t } = useLang()
const { handelCheckImageScale } = useHelper()
const memberStore = useMember()

const physicalList = [
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_1'
    ),
    value: 1,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_2'
    ),
    value: 2,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_3'
    ),
    value: 3,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_4'
    ),
    value: 4,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_5'
    ),
    value: 5,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_6'
    ),
    value: 6,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_7'
    ),
    value: 7,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_8'
    ),
    value: 8,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_9'
    ),
    value: 9,
  },
  {
    label: t(
      'pages.evaluation_movement.physical_list.label_10'
    ),
    value: 10,
  },
]

const psychologicalList = [
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_1'
    ),
    value: 1,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_2'
    ),
    value: 2,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_3'
    ),
    value: 3,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_4'
    ),
    value: 4,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_5'
    ),
    value: 5,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_6'
    ),
    value: 6,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_7'
    ),
    value: 7,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_8'
    ),
    value: 8,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_9'
    ),
    value: 9,
  },
  {
    label: t(
      'pages.evaluation_movement.psychological_list.label_10'
    ),
    value: 10,
  },
]

const imgPhysical = ref<string>(ImageScale.SCALE_00)
const imgPsychological = ref<string>(ImageScale.SCALE_00)

const checkDisable = computed(() => {
  return (
    !!checkPointItem.value.physical_point &&
    !!checkPointItem.value.psychological_point
  )
})

const checkPointItem = ref(props.checkpoint)

watch(
  () => checkPointItem.value.physical_point,
  (newVal) => {
    imgPhysical.value = handelCheckImageScale(
      newVal as number
    )
  }
)

watch(
  () => checkPointItem.value.psychological_point,
  (newVal) => {
    imgPsychological.value = handelCheckImageScale(
      newVal as number
    )
  }
)

onMounted(() => {
  imgPhysical.value = handelCheckImageScale(
    checkPointItem.value.physical_point as number
  )
  imgPsychological.value = handelCheckImageScale(
    checkPointItem.value.psychological_point as number
  )
})
</script>

<template>
  <div>
    <div
      class="checkpoint-item flex content-center items-start mb-30px"
    >
      <span
        class="checkpoint-item__order"
        :class="[
          userStore.roleName,
          !checkDisable ? 'disable' : '',
        ]"
      >
        {{ index }}
      </span>
      <div class="w-[calc(100%-44px)]">
        <div class="flex items-end mb-9px">
          <img src="/images/time.svg" alt="" />
          <span
            class="checkpoint-item__time text-left cursor-pointer transition-opacity hover:opacity-60 ml-8px"
            :class="userStore.roleName"
            @click="
              !notAction &&
                videoStore.setTimeCheckPoint(
                  checkpoint.checkpoint_time || 0
                )
            "
          >
            {{ timeDuration(checkpoint?.checkpoint_time) }}
          </span>
        </div>
        <span class="checkpoint-item__note text-justify">
          {{ checkpoint?.content }}
        </span>
        <div class="mt-13px">
          <div class="flex mb-6px">
            <span
              class="checkpoint-item__label tracking-[.08em]"
            >
              {{
                $t(
                  'pages.evaluation_movement.physical_change'
                )
              }}
            </span>
            <img
              class="w-24px h-24px ml-16px"
              :src="imgPhysical"
              alt="physical"
            />
          </div>
          <Dropdown
            class="w-full"
            v-model="checkPointItem.physical_point"
            :errors="
              (!checkPointItem.physical_point &&
                memberStore.errorCheckPoint &&
                memberStore?.errorCheckPoint[
                  `check_points.${
                    props.index - 1
                  }.physical_point`
                ]) ||
              []
            "
            :object-item="physicalList"
            :text-button="
              $t('pages.user_edit.group_name_default')
            "
          />
          <span
            v-if="
              !checkPointItem.physical_point &&
              memberStore.errorCheckPoint &&
              memberStore?.errorCheckPoint[
                `check_points.${
                  props.index - 1
                }.physical_point`
              ]
            "
            class="error-text font-medium mr-2"
          >
            {{
              $t(
                'pages.evaluation_movement.validate.physical_point.required'
              )
            }}
          </span>
        </div>
        <div class="mt-13px">
          <div class="flex mb-6px">
            <span
              class="checkpoint-item__label tracking-[.08em]"
            >
              {{
                $t(
                  'pages.evaluation_movement.psychological_change'
                )
              }}
            </span>
            <img
              class="w-24px h-24px ml-16px"
              :src="imgPsychological"
              alt="psychological"
            />
          </div>
          <Dropdown
            class="w-full"
            v-model="checkPointItem.psychological_point"
            :errors="
              (!checkPointItem.psychological_point &&
                memberStore.errorCheckPoint &&
                memberStore?.errorCheckPoint[
                  `check_points.${
                    props.index - 1
                  }.psychological_point`
                ]) ||
              []
            "
            :object-item="psychologicalList"
            :text-button="
              $t('pages.user_edit.group_name_default')
            "
          />
          <span
            v-if="
              !checkPointItem.psychological_point &&
              memberStore.errorCheckPoint &&
              memberStore?.errorCheckPoint[
                `check_points.${
                  props.index - 1
                }.psychological_point`
              ]
            "
            class="error-text font-medium mr-2"
          >
            {{
              $t(
                'pages.evaluation_movement.validate.psychological_point.required'
              )
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.checkpoint-item {
  gap: 12px;
  width: 100%;

  &__order {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50% 50%;
    min-width: 32px;
    color: white;
    font-size: 16px;
    font-weight: bold;

    &.shinseido {
      background: $color-shinseido;
    }

    &.kanrisha {
      background: $color-kanrisha;
    }

    &.trainer {
      background: $color-trainer;
    }

    &.disable {
      background-color: $color-gray-2;
    }
  }

  &__label {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
  }
}

.checkpoint-item__time {
  font-size: $font-16;
  font-weight: 500;
  line-height: $font-14;
  font-style: normal;
  border-bottom: 1px solid;
  padding-top: 9px;

  &.shinseido {
    color: $color-shinseido;
  }

  &.kanrisha {
    color: $color-kanrisha;
  }

  &.trainer {
    color: $color-trainer;
  }
}

.checkpoint-item__note {
  font-size: $font-18;
  font-weight: 500;
  font-style: normal;
  color: $color-gray-1;
  line-height: 24px;
  padding-top: 4px;
}

:deep(.form-checkbox__icon) {
  font-size: 24px;
  width: 24px;
}

:deep(.form-checkbox__text) {
  margin-left: 0;
}

:deep(.list-item__content) {
  max-height: unset;
}

@media screen and (max-width: $screen-tablet) {
  :deep(.list-item__content) {
    max-height: 480px;
  }
}
.error-text {
  line-height: $font-14;
  color: $color-red-1;
  font-size: $font-14;
}
</style>
