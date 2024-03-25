<script lang="ts" setup>
import { ICheckPoint } from '@/interfaces/video'
import { useVideo } from '@/stores/video'
import { useUser } from '@/stores/user'

const videoStore = useVideo()
const userStore = useUser()
const {
  handelCheckImageScale,
  getContentPhysical,
  getContentPsychological,
  isSafari,
} = useHelper()

const props = defineProps({
  checkpoint: {
    type: Object as () => ICheckPoint,
    default: null,
  },
  notAction: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="checkpoint-item flex content-center items-center"
    :class="{ '<tablet:flex-wrap': isCompleted }"
  >
    <label
      v-if="isCompleted"
      class="checkpoint-item__position flex content-center items-center"
      :class="`${userStore.roleName}`"
    >
      <span class="text-center">
        {{ checkpoint?.index }}
      </span>
    </label>
    <label
      v-else
      class="checkpoint-item__position flex content-center items-center"
      :class="`${userStore.roleName}`"
    >
      <span class="text-center">
        {{ checkpoint?.index }}
      </span>
    </label>
    <span
      class="checkpoint-item__time text-left cursor-pointer transition-opacity hover:opacity-60"
      :class="userStore.roleName"
      @click="
        !notAction &&
          videoStore.setTimeCheckPoint(
            checkpoint.checkpoint_time || 0
          )
      "
      >{{ checkpoint?.checkpoint_time_conver }}
    </span>
    <div
      v-if="isCompleted"
      class="checkpoint-item__note text-left"
    >
      <div class="checkpoint-item__note__content">
        {{ checkpoint?.content }}
      </div>
      <div
        class="checkpoint-item__note__point flex gap-x-30px <tablet:gap-x-5px"
        :class="{ safari: isSafari }"
      >
        <div
          class="checkpoint-item__point inline-grid gap-x-14px mt-7px <tablet:gap-x-10px"
        >
          <span class="checkpoint-item__point__heading">{{
            $t('pages.evaluation_movement.physical_change')
          }}</span>
          <p
            class="checkpoint-item__point__body inline-grid grid-cols-2"
          >
            <span :class="{ '-tracking-0.7px': isSafari }">
              {{ checkpoint.physical_point
              }}{{ $t('others.unit_point') }}
            </span>
            <span
              v-tooltip="{
                content: $t(
                  getContentPhysical(
                    checkpoint.physical_point
                  )
                ),
                container: '.checkpoint-item',
              }"
              class="cursor-pointer"
            >
              <img
                class="w-24px h-24px"
                :src="
                  handelCheckImageScale(
                    checkpoint.physical_point
                  )
                "
                alt="physical"
              />
            </span>
          </p>
        </div>
        <div
          class="checkpoint-item__point inline-grid grid-cols-2 gap-x-14px mt-7px <tablet:gap-x-10px"
        >
          <span class="checkpoint-item__point__heading">{{
            $t(
              'pages.evaluation_movement.psychological_change'
            )
          }}</span>
          <p
            class="checkpoint-item__point__body inline-grid grid-cols-2"
          >
            <span :class="{ '-tracking-0.7px': isSafari }">
              {{ checkpoint.psychological_point
              }}{{ $t('others.unit_point') }}
            </span>
            <span
              v-tooltip="{
                content: $t(
                  getContentPsychological(
                    checkpoint.psychological_point
                  )
                ),
                container: '.checkpoint-item',
              }"
              class="cursor-pointer"
            >
              <img
                class="w-24px h-24px"
                :src="
                  handelCheckImageScale(
                    checkpoint.psychological_point
                  )
                "
                alt="physical"
              />
            </span>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="checkpoint-item__note text-left">
      {{ checkpoint?.content }}
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.checkpoint-item {
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  text-align: left;
  color: $color-white-2;

  border-bottom: 1px solid $color-gray-3;
  padding: 12px 0 10px;
  display: flex;
  align-items: flex-start;
}

.checkpoint-item__position {
  width: 32px;
  height: 32px;
  // background: $color-shinseido;
  border-radius: 100%;
  margin-right: 16px;
  font-size: $font-16;
  font-weight: bold;
  line-height: $font-16;
  font-style: normal;
  color: $color-white-2;
  letter-spacing: 0;

  &.shinseido {
    background: $color-shinseido;
  }

  &.kanrisha {
    background: $color-kanrisha;
  }

  &.trainer {
    background: $color-trainer;
  }

  span {
    width: 32px;
  }

  &.no-complete {
    background: $color-gray-2;
  }
}

.checkpoint-item__time {
  font-size: $font-14;
  font-weight: 500;
  line-height: $font-14;
  font-style: normal;
  // text-decoration: underline;
  border-bottom: 1px solid;
  // color: $color-shinseido;
  margin-right: 15px;
  // min-width: 42px;
  padding-top: 8px;
  letter-spacing: 1.5px;
  flex: 0 0 auto;

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
  font-size: $font-16;
  font-weight: 500;
  line-height: 24px;
  font-style: normal;
  color: $color-gray-1;
  text-align: justify;
  padding-top: 4px;
}

.checkpoint-item__point {
  font-size: 16px;
  color: $color-black-1;
  font-weight: bold;
  grid-template-columns: 70px 88px;

  @media screen and (max-width: $screen-mobile) {
    font-size: 14px;
    grid-template-columns: 64px 80px;
  }
}
</style>

<style>
.checkpoint-item .v-popper__inner {
  width: 200px;
  font-size: 14px;
  line-height: 22px;
  font-weight: normal;
}
</style>
