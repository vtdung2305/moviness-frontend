<script setup lang="ts">
import { PropType } from 'vue'
import { IUserListVideo } from '@/interfaces/user'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { useUser } from '@/stores/user'
import { timeDuration } from '@/helper/number'
import { userStatusList } from '@/constants/member'

const props = defineProps({
  user: {
    type: Object as PropType<IUserListVideo>,
    default: null,
  },
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  index: {
    type: Number,
    default: null,
  },
  status: {
    type: Number,
    default: null,
  },
})

const router = useRouter()
const userStore = useUser()
const route = useRoute()

const timeOfVideo = computed(() => {
  return props.user.time_length
    ? timeDuration(props.user.time_length)
    : '00:00'
})

const themeTrainer = computed(() => {
  return props.theme === RoleEnum.TRAINER
})

const themeKanrisha = computed(() => {
  return props.theme === RoleEnum.ADMIN
})

const themeShinseido = computed(() => {
  return props.theme === RoleEnum.ADMINISTRANTOR
})

const numericalOrder = computed(() => {
  return (props.index < 10 ? '0' : '') + props.index
})

const { t } = useLang()
const dateTime = computed(() => {
  if (props.user.last_date_evaluation) {
    const year = props.user.last_date_evaluation?.slice(
      0,
      4
    )
    const month = props.user.last_date_evaluation?.slice(
      5,
      7
    )
    const day = props.user.last_date_evaluation?.slice(
      8,
      10
    )
    return t('pages.group_registration_confirmation.date', {
      year,
      month,
      day,
    })
  }
  return ''
})

const evaluation = computed(() => {
  return props.user?.number_evaluation
    ? props.user?.number_evaluation +
        t('pages.user_detail.times')
    : 'ー'
})

const gotoEvaluation = (slug: string) => {
  const videoId = props.user?.id
  const userId = route.params.id
  router.push(
    `/app/${userStore.roleName}/user/${userId}/video/${videoId}/evaluation-${slug}`
  )
}
</script>

<template>
  <div
    class="video-item flex mt-4 flex-col tablet:flex-row"
  >
    <div class="flex-1 order-2 tablet:order-1">
      <div class="video-item__info">
        <div
          class="flex items-center tablet:block my-10px tablet:my-0"
        >
          <div
            class="tracking-[.08em] video-item__order w-35px h-35px text-14px rounded-full inline-flex justify-center items-center text-white font-bold mb-14px mt-11px"
            :class="{
              trainer: themeTrainer,
              kanrisha: themeKanrisha,
              disable:
                props.status === userStatusList[3].value,
            }"
          >
            {{ numericalOrder }}
          </div>
          <h1
            class="video-item__title ml-10px tablet:ml-0px tracking-[.08em]"
          >
            {{ user.name }}
          </h1>
        </div>
        <p class="mt-4 mb-16px flex items-end">
          <i class="icon-checkmark-outline text-16px" />
          <span
            class="mr-1 ml-4px leading-16px tracking-[.08em]"
          >
            {{
              $t(
                'components.video.item_list.checkpoint_number'
              )
            }}:
          </span>
          <span class="leading-16px tracking-[.08em]">
            {{ user.number_check_point }}
          </span>
          <span class="leading-16px tracking-[.08em]">
            {{
              $t(
                'components.video.item_list.checkpoint_number_unit'
              )
            }}
          </span>
        </p>
      </div>

      <div
        class="flex flex-col justify-center gap-6px desktop:gap-0px tracking-[.08em]"
      >
        <div class="flex mt-24px mb-7px items-center">
          <p class="mr-16px text-14px tracking-[.08em]">
            {{ $t('pages.user_detail.date_time') }}
          </p>
          <p class="font-bold text-14px tracking-[.08em]">
            {{ dateTime || $t('others.empty') }}
          </p>
        </div>
        <div class="flex items-center">
          <p class="mr-31px text-14px tracking-[.08em]">
            {{
              $t('pages.user_detail.number_of_evaluations')
            }}
          </p>
          <p class="font-bold text-14px tracking-[.08em]">
            {{ evaluation }}
          </p>
        </div>
      </div>
    </div>

    <div class="order-1 tablet:order-2">
      <div
        class="video-item__thumnail relative flex w-full h-155px tablet:w-275px"
      >
        <img
          alt=""
          class="w-full"
          :src="
            user.thumbnail_url
              ? user.thumbnail_url
              : '/images/img_default.png'
          "
        />
        <label class="absolute">
          {{ timeOfVideo }}
        </label>
        <label class="video_copyright">
          {{ $t('components.footer.video_copyright') }}
        </label>
      </div>
      <div class="flex justify-between">
        <div
          v-if="
            themeTrainer &&
            props.status !== userStatusList[3].value
          "
          class="video-item__button edit flex justify-center rounded-full mt-16px w-120px tablet:w-130px select-none"
          :class="{
            trainer: themeTrainer,
            kanrisha: themeKanrisha,
          }"
          @click="gotoEvaluation('movement')"
        >
          <span
            class="font-bold pt-5px pb-2px text-14px my-5px tracking-[.08em]"
          >
            <i class="icon-edit"></i>
            <span class="ml-8px tracking-[.08em]">
              {{ $t('pages.user_detail.rating_input') }}
            </span>
          </span>
        </div>
        <div
          :class="{
            'w-full':
              themeShinseido ||
              themeKanrisha ||
              props.status === userStatusList[3].value,
            'w-120px tablet:w-130px':
              themeTrainer &&
              props.status !== userStatusList[3].value,
            trainer: themeTrainer,
            kanrisha: themeKanrisha,
            disable:
              user.number_evaluation === 0 ||
              props.status === userStatusList[3].value,
          }"
          class="video-item__button flex justify-center rounded-full mt-16px select-none"
          @click="gotoEvaluation('history')"
        >
          <span
            class="font-bold pt-5px pb-2px text-14px my-5px"
          >
            <i class="icon-list"></i>
            <span class="ml-8px tracking-[.08em]">
              {{
                $t('pages.user_detail.evaluation_details')
              }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.video-item {
  background: $color-white-2;
  padding: 16px 16px 18px 28px;
  border-radius: 24px;
  filter: drop-shadow(0px 5px 5px rgba(51, 51, 51, 0.05));
  background: $color-white-2;
  margin-top: 0px;

  &__title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;

    @media screen and (max-width: $screen-tablet) {
      width: calc(100% - 45px);
      display: block;
    }
  }

  @media screen and (max-width: $screen-mobile) {
    padding: 20px;
  }
}

.video-item__info {
  margin-right: 36px;
  border-bottom: 1px solid $color-gray-3;

  @media screen and (max-width: $screen-tablet) {
    margin-right: unset;
  }

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: $font-20;
    line-height: $font-20;
    color: $color-black-1;

    @media screen and (max-width: $screen-tablet) {
      line-height: $font-24;
    }
  }

  p {
    font-style: normal;
    font-weight: 700;
    font-size: $font-14;
    line-height: $font-14;
    color: $color-gray-2;
  }
}

.video-item__order {
  background: $color-shinseido;

  &.trainer {
    background: $color-trainer;
  }

  &.kanrisha {
    background: $color-kanrisha;
  }

  &.disable {
    background: #aaaaac;
  }
}

.video-item__button {
  border: 1px solid $color-shinseido;
  color: $color-shinseido;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }

  &.trainer {
    border: 1px solid $color-trainer;
    color: $color-trainer;

    .icon-list:before {
      color: $color-trainer;
    }

    .icon-edit:before {
      color: $color-trainer;
    }
  }

  &.kanrisha {
    border: 1px solid $color-kanrisha;
    color: $color-kanrisha;

    .icon-list:before {
      color: $color-kanrisha;
    }
  }

  &.edit {
    background: $gradient-90-trainer;
    color: $color-white-2;
    border: unset;

    .icon-edit:before {
      color: $color-white-2;
    }

    &.kanrisha {
      background: $gradient-90-kanrisha;
    }
  }

  &.disable {
    border: 1px solid $color-gray-3;
    background-color: $color-white-2;
    color: $color-gray-3;
    pointer-events: none;

    .icon-list:before {
      color: $color-gray-3;
    }
  }
}

.video-item__thumnail {
  img {
    height: 155px;
    object-fit: cover;
    border-radius: 16px;
    background: $color-white-2;
  }

  .absolute {
    font-size: $font-16;
    font-weight: 500;
    line-height: 24px;
    font-style: normal;
    letter-spacing: 0.08px;
    color: $color-white;
    width: 72px;
    height: 24px;
    border-radius: 16px;
    background: #757578;
    text-align: center;
    top: 4px;
    right: 4px;
  }

  .video_copyright {
    position: absolute;
    font-size: $font-10;
    color: $color-white;
    bottom: 4px;
    right: 4px;
  }
}
</style>
