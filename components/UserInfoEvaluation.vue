<script setup lang="ts">
import { PropType } from 'vue'
import moment from 'moment'
import { IMemberDetail } from '@/interfaces/member'
import { useUser } from '@/stores/user'
import { ImageDefaultEnum } from '@/constants/image'

const { getFullName } = useHelper()
const { t } = useLang()
const router = useRouter()
const route = useRoute()
const userStore = useUser()

const props = defineProps({
  memberDetail: {
    type: Object as PropType<IMemberDetail>,
    default: () => {},
  },
})

const age = computed(() => {
  return props?.memberDetail?.birthday
    ? moment().diff(
        props?.memberDetail?.birthday,
        'years',
        false
      ) + t('pages.user_detail.age')
    : ''
})

const imageUrl = computed(() =>
  props.memberDetail?.url_avatar
    ? props.memberDetail.url_avatar
    : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
)

const level = computed(() => {
  if (props.memberDetail?.level === 0) {
    return t('others.no_value')
  } else {
    return props.memberDetail?.level
  }
})
</script>

<template>
  <div>
    <div class="flex items-center gap-x-6 mb-14px">
      <div
        class="user-detail__image rounded-full overflow-hidden bg-white"
      >
        <img
          class="w-full h-full object-cover"
          :src="imageUrl"
        />
      </div>
      <div>
        <div class="text-xl leading-27px font-bold">
          {{
            getFullName(
              memberDetail?.last_name,
              memberDetail?.first_name
            )
          }}
        </div>
        <div class="text-base leading-21px mt-11px">
          {{ $t('pages.user_detail.function_level') }}:
          <span class="font-bold">
            {{ level }}
          </span>
        </div>
      </div>
    </div>
    <div class="user-evaluation">
      <Expansion
        :heading="
          $t('pages.evaluation_history.detail_infomation')
        "
      >
        <div class="row-info">
          <div class="label">
            {{
              $t(
                'components.user_infomation_evaluation.group_name'
              )
            }}
          </div>
          <div class="value">
            {{
              memberDetail?.group?.name ||
              $t('others.empty')
            }}
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{
              $t(
                'components.user_infomation_evaluation.trainer_name'
              )
            }}
          </div>
          <div class="value">
            {{
              getFullName(
                memberDetail?.trainer?.last_name,
                memberDetail?.trainer?.first_name
              ) || $t('others.empty')
            }}
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{
              $t(
                'components.user_infomation_evaluation.age_label'
              )
            }}
          </div>
          <div class="value">
            {{ age || $t('others.empty') }}
          </div>
        </div>
        <div class="row-info">
          <div class="label">
            {{
              $t(
                'components.user_infomation_evaluation.medical_history'
              )
            }}
          </div>
          <div class="value">
            {{
              memberDetail?.medical_history ||
              $t('others.empty')
            }}
          </div>
        </div>
        <div class="user-evaluation__more mt-12px">
          <Anchor
            class="transition-opacity hover:opacity-60"
            :text="$t('pages.evaluation_history.link')"
            :class="userStore.roleName"
            :to="`/app/${userStore.roleName}/user/${route.params.id}?tab_info=2`"
          />
        </div>
      </Expansion>
    </div>
  </div>
</template>

<style scoped lang="scss">
.row-info {
  display: flex;
  gap: 59px;
  padding-bottom: 15px;
  border-bottom: 1px solid $color-gray-3;
  padding-top: 16px;

  .value,
  .label {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    color: $color-gray-1;
    width: 121px;
  }

  .label {
    width: 120px;
  }

  .value {
    flex: 1;
    line-height: 24px;
    white-space: pre-wrap;
  }
}

.user-evaluation {
  &__more {
    &:deep(.shinseido) {
      color: $color-shinseido;
    }

    &:deep(.kanrisha) {
      color: $color-kanrisha;
    }

    &:deep(.trainer) {
      color: $color-trainer;
    }

    a {
      border-bottom: 1px solid;

      &:hover {
        text-decoration: none;
      }
    }
  }
}

.user-detail {
  &__image {
    width: 72px;
    height: 72px;
  }
}
</style>
