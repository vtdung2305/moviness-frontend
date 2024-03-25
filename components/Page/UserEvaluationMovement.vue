<script setup lang="ts">
import { PropType } from 'vue'
import moment from 'moment'
import isEqual from 'lodash/isEqual'
import isEqualWith from 'lodash/isEqualWith'
import cloneDeep from 'lodash/cloneDeep'
import isNull from 'lodash/isNull'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { useUser } from '@/stores/user'
import { ICheckPoint } from '@/interfaces/video'
import { ModalNameEnum } from '@/constants/modal'
import { FormatDateEnum } from '@/constants/common'
import { IParamsEvaluation } from '@/interfaces/evaluation'
import { useMember } from '@/stores/member'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const { t } = useLang()

const { formatDate } = useHelper()

const { $api, $showModal, $hiddenModal } = useNuxtApp()

const userStore = useUser()
const memberStore = useMember()

const router = useRouter()
const toPage = ref()
const confirmModal = ref(false)
const route = useRoute()
const checkPointActionOrigin = ref<ICheckPoint[]>()
const commentOrigin = ref<string>()

const message = ref('message warning')
const buttonCancel = ref('button cancel')

const date = ref()

const ratingInput = computed(() => {
  if (hasEdit.value) {
    return t('pages.evaluation_movement.rating_input_edit')
  } else {
    return t('pages.evaluation_movement.rating_input')
  }
})

const btnSubmit = computed(() => {
  if (hasEdit.value) {
    return t('pages.evaluation_movement.btn_edit')
  } else {
    return t('pages.evaluation_movement.btn_add')
  }
})

const msgConfirm = computed(() => {
  if (hasEdit.value) {
    const date =
      route.query.evaluation_date ||
      moment().format('YYYY-MM-DD')
    return t(
      'pages.evaluation_movement.msg_evaluation_confirm_edit',
      {
        date: `${formatDate(
          date as string,
          FormatDateEnum.FORMAT_NORMAL
        )}`,
      }
    )
  } else {
    return t(
      'pages.evaluation_movement.msg_evaluation_confirm'
    )
  }
})

const hasCommentDiff = computed(() => {
  return !isEqualWith(
    commentOrigin.value,
    comment.value,
    (a, b) => {
      // if both are null or equal to an empty string then they are equal
      if (
        (isNull(a) || a === '') &&
        (isNull(b) || b === '')
      ) {
        return true
      }
    }
  )
})

const isDisabledButton = computed(() => {
  if (!checkPointAction.value?.length) return true
  if (hasEdit.value) {
    return (
      isEqual(
        checkPointActionOrigin.value,
        checkPointAction.value
      ) && !hasCommentDiff.value
      // !comment.value?.trim()
    )
  }
})

const updateCheckPoint = (checkpoint: ICheckPoint[]) => {
  checkPointAction.value = checkpoint
}

const leavePage = () => {
  confirmModal.value = true
  router.push(toPage.value)
}

const gotoUserVideoList = () => {
  const id = route.params.id
  router.push(`/app/${userStore.roleName}/user/${id}`)
}

const gotoEvaluationHistory = async () => {
  const id = route.params.id
  const videoId = route.params.videoId
  await $hiddenModal(ModalNameEnum.ALERT_CREATE_EVALUATION)
  router.push(
    `/app/${userStore.roleName}/user/${id}/video/${videoId}/evaluation-history`
  )
}

onBeforeRouteLeave((to) => {
  if (hasDiffData.value && !isCreateMovement.value) {
    toPage.value = to.path
    $showModal(ModalNameEnum.MESSAGE)
    if (!confirmModal.value) return false
    return true
  }
})

const onSubmit = async () => {
  const check = checkPointAction?.value?.every(
    (e) =>
      e.physical_point! > 0 && e.psychological_point! > 0
  )

  const id = route.params.id
  const params = {
    evaluation_date:
      route.query.evaluation_date ||
      moment().format('YYYY-MM-DD'),
    video_id: route.params.videoId,
    comment: comment.value,
    check_points: checkPointAction.value,
  }

  if (!check) {
    $api.member
      .createEvaluation(
        id as string,
        params as IParamsEvaluation
      )
      .then(() => {})
      .catch((e) => {
        memberStore.setErrorCheckPoint(
          e.response?._data?.errors
        )

        setTimeout(() => {
          document
            .getElementsByClassName('error-text')[0]
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
        }, 500)
      })
  } else {
    $showModal(ModalNameEnum.MESSAGE_CREATE_EVALUATION)
  }
}

onMounted(() => {
  checkPointActionOrigin.value = cloneDeep(
    checkPointAction.value
  )
  commentOrigin.value = cloneDeep(comment.value)
})

onBeforeRouteLeave((to) => {
  if (
    to.name !==
    `app-${userStore.roleName}-user-id-video-videoId-evaluation-movement`
  ) {
    memberStore.setErrorCheckPoint(null)
  }
})

const {
  isLoading,
  evaluationDate,
  comment,
  checkPointAction,
  hasDiffData,
  memberDetail,
  videoDetail,
  isCreateMovement,
  author,
  hasLeaveMember,
  hasEdit,
  createEvaluation,
  getMembersDetail,
  getVideoDetail,
} = useUserEvaluation()
</script>

<template>
  <div class="group-detail desktop:w-3/4 relative">
    <UserInfoEvaluation :member-detail="memberDetail" />

    <div class="user-evaluation mt-62px">
      <VideoPlayer
        :video-data="videoDetail || undefined"
        :class-name="`w-full h-auto`"
        :scroll="false"
      />
    </div>

    <div v-if="evaluationDate" class="user-evaluation">
      <div class="user-evaluation__video">
        <div
          v-if="!checkPointAction.length"
          class="user-evaluation__recent rounded-24px mt-40px p-30px <mobile:px-15px"
        >
          <div class="user-evaluation__recent__top no-data">
            <span
              class="user-evaluation__recent__title text-14px font-bold"
              >{{ ratingInput }}</span
            >
            <div class="text-center">
              <div class="text-center mt-10">
                <p>{{ $t('others.no_data') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="user-evaluation__recent rounded-24px mt-40px p-30px <mobile:px-15px"
        >
          <div class="user-evaluation__recent__top">
            <span
              class="user-evaluation__recent__title text-14px font-bold"
              >{{ ratingInput }}</span
            >
            <p
              class="text-16px leading-24px font-bold mt-15px"
            >
              {{
                $t(
                  'pages.evaluation_movement.evaluation_date'
                )
              }}
            </p>
            <span
              class="text-18px leading-35px font-medium"
              >{{ formatDate(moment()) }}</span
            >
            <p
              class="text-16px leading-24px font-bold mt-8px"
            >
              {{
                $t(
                  'pages.evaluation_movement.evaluation_user'
                )
              }}
            </p>
            <span class="text-18px font-medium">{{
              author
            }}</span>
          </div>
          <div
            class="user-evaluation__recent__center mt-20px"
          >
            <CheckpointListAction
              :length-check-point="
                checkPointAction.length || 0
              "
              :check-points-data="checkPointAction"
              @update-check-point="updateCheckPoint"
            />
          </div>
          <div class="form mt-20px">
            <div class="row-form__label font-bold">
              {{ $t('pages.evaluation_movement.comment') }}
            </div>
            <div class="row-form__content">
              <FormTextInput
                v-model="comment"
                :placeholder="
                  $t(
                    'pages.user_registration.placeholder_medical_history'
                  )
                "
                type-input="textarea"
                :rows="3"
                class="flex-1 textarea"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="">
        <div
          class="flex gap-31px mt-44px <mobile:flex-wrap-reverse"
        >
          <Button
            :theme="userStore.roleName"
            type="outline"
            @click="gotoUserVideoList"
          >
            {{ $t('others.btn_back') }}
          </Button>
          <Button
            v-if="
              checkPointAction.length && !hasLeaveMember
            "
            :theme="userStore.roleName"
            :class="{ disabledBtn: isDisabledButton }"
            @click="onSubmit"
          >
            {{ btnSubmit }}
          </Button>
        </div>
      </div>
    </div>
    <Loading
      v-if="isLoading"
      :theme="userStore.roleName"
      class="fixed w-full h-screen top-0 left-0 z-50"
    />
    <ModalMessage
      :id="ModalNameEnum.MESSAGE"
      :message="$t('others.title_modal_confirm')"
      :sub-message="$t('others.leave_page')"
      :button-cancel="$t('others.btn_check_again')"
      :button-submit="$t('others.btn_leave_page')"
      :theme="useUser().roleName"
      @click-submit="leavePage"
    />
    <ModalMessage
      :id="ModalNameEnum.MESSAGE_CREATE_EVALUATION"
      :message="$t('others.title_modal_confirm')"
      :sub-message="msgConfirm"
      :button-cancel="$t('components.logout.cancel')"
      :button-submit="btnSubmit"
      :theme="useUser().roleName"
      @click-submit="createEvaluation"
    />
    <ModalMessage
      :id="ModalNameEnum.ALERT_CREATE_EVALUATION"
      :message="$t('others.title_modal_common')"
      :sub-message="
        $t(
          'pages.evaluation_movement.msg_evaluation_created'
        )
      "
      :theme="useUser().roleName"
      @click-submit="gotoEvaluationHistory"
    />
  </div>
</template>

<style scoped lang="scss">
.user-evaluation {
  &__recent {
    background-color: $color-white;

    &__title {
      color: $color-gray-2;
    }

    &:deep(.checkpoint-list-basic__list) {
      // overflow-y: scroll;
      // max-height: 825px;
    }
  }

  &__processbar {
    .level {
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

    .total {
      color: $color-gray-2;
    }

    &__body {
      background-color: $color-gray-3;

      &__completed {
        width: 70%;

        &.shinseido {
          background: $gradient-90-shinseido;
        }

        &.kanrisha {
          background: $gradient-90-kanrisha;
        }

        &.trainer {
          background: $gradient-90-trainer;
        }
      }
    }
  }

  &__rating {
    background-color: $color-white;

    &__list {
      .title {
        color: $color-gray-2;
      }

      table {
        tr {
          border-top: 1px solid $color-gray-3;

          > td {
            padding: 15px 0;
          }

          &:last-child {
            border-bottom: 1px solid $color-gray-3;
          }
        }
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

.no-data {
  margin-bottom: calc(2.5rem + 14px);
}

.disabledBtn {
  background-image: unset;
  background: $color-gray-2 !important;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
