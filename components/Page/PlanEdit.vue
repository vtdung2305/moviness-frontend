<script setup lang="ts">
import { PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'
import { required, helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { IPlan } from '@/interfaces/plan'
import { IVideo, IVideoList } from '@/interfaces/video'
import { comma } from '@/helper/number'
import { ModalNameEnum } from '@/constants/modal'
import { useUser } from '@/stores/user'
import {
  PlanStatus,
  PlanIdEnum,
  PlanUnlimitedEnum,
} from '@/constants/plan'
import { usePlan } from '@/stores/plan'
import { ImageDefaultEnum } from '@/constants/image'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
  planDetail: {
    type: Object as PropType<IPlan>,
    default: () => {},
  },
  videoList: {
    type: Array as PropType<IVideo[]>,
    default: () => [],
  },
})

const form = ref<IPlan>(cloneDeep(props.planDetail))
const videos = ref<IVideo[]>(cloneDeep(props.videoList))

const dragging = ref<boolean>(false)
const enabled = ref<boolean>(true)
const videoId = ref<number | string>(1)
const title = ref<string>('')
const { $showModal, $hiddenModal } = useNuxtApp()
const userStore = useUser()
const planStore = usePlan()
const { t } = useLang()
const router = useRouter()

const isDisabledButton = computed(() => {
  if (
    !props.videoList.length ||
    !props.planDetail?.max_video_count
  )
    return false
  if (
    props.videoList.length >=
    props.planDetail.max_video_count
  )
    return true
  return false
})

const rules = computed(() => {
  return {
    content: {
      required: helpers.withMessage(
        t('common.filed_no_required', {
          field: t('pages.plan_edit.content'),
        }),
        required
      ),
    },
  }
})

const errors = computed(() => {
  return {
    content: v$.value.content.$errors,
  }
})

const v$ = useValidate(rules, form as any)

const numberVideo = computed(() => props.videoList.length)

const totalVideoRemaining = computed(() => {
  if (!props?.planDetail.max_video_count) return 0
  return (
    props.planDetail.max_video_count - numberVideo.value
  )
})

const imageUrl = computed(() => {
  switch (props.planDetail.id) {
    case PlanIdEnum.FREE:
      return ImageDefaultEnum.IMAGE_PLAN_FREE
    case PlanIdEnum.LITE:
      return ImageDefaultEnum.IMAGE_PLAN_LITE
    case PlanIdEnum.STANDARD:
      return ImageDefaultEnum.IMAGE_PLAN_STANDARD
    case PlanIdEnum.ADVANCE:
      return ImageDefaultEnum.IMAGE_PLAN_ADVANCE
    default: //
  }
})

const planVideo = computed(() => {
  if (!props?.planDetail?.max_video_count) return null
  if (
    props.planDetail.max_video_count === PlanUnlimitedEnum
  ) {
    return t('pages.plan_list.unlimited')
  }
  return `${comma(props?.planDetail?.max_video_count)}${t(
    'others.book'
  )}`
})

const planStatus = computed(() => {
  if (props.planDetail.status === PlanStatus.PUBLIC) {
    return t('pages.plan_detail.plan_public')
  }
  return t('pages.plan_detail.plan_private')
})

const confirmDeleteVideo = (id: number | string) => {
  videoId.value = id
  const plan = props.videoList.find((e) => e.id === id)
  if (plan) title.value = plan.name
  $showModal(ModalNameEnum.MESSAGE)
}

const deleteVideo = () => {
  $hiddenModal(ModalNameEnum.MESSAGE)
  planStore.removeVideoListToPlan(videoId.value)
}

const confirmEditPlan = async () => {
  const validate = await v$.value.$validate()
  if (!validate) {
    const ele = document.querySelector('.error-text')
    if (ele) {
      ele.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
    }
  } else {
    planStore.updatePlanById(form.value as IPlan)
    router.push('edit-confirmation')
  }
}

const showModalAddVideo = () => {
  $showModal(ModalNameEnum.VIDEO_LIST)
}

const addVideoToList = async (videos: IVideoList) => {
  await planStore.addVideoListToPlan(videos as IVideoList)
}

const onDragEnd = async ($event: any) => {
  dragging.value = false
  const cloneVideos = cloneDeep(videos.value)
  cloneVideos.forEach((item, index) => {
    item.order = index
  })
  videos.value = cloneVideos
  await planStore.updateVideoListToPlan(cloneVideos as any)
}

const updatePlanDraft = () => {}

watch(
  [props.videoList, form],
  ([newVal, newForm]) => {
    videos.value = newVal
    planStore.updatePlanById(newForm as IPlan)
  },
  {
    immediate: true,
    deep: true,
  }
)

const {
  videosData,
  videoListIds,
  gotoPlanDetail,
  editPlan,
  isLoading,
} = usePlanEdit()
</script>

<template>
  <div :class="`theme-${theme}`">
    <div class="desktop:w-3/4 relative">
      <div
        class="grid grid-cols-1 gap-4 list-user__content"
      >
        <div
          class="plan-detail grid grid-cols-[80px,1fr] items-center gap-25px p-15px tablet:py-38px tablet:px-50px tablet:gap-50px"
        >
          <div class="plan-detail_img w-80px">
            <img
              class="rounded-1/2"
              :src="imageUrl"
              alt=""
            />
          </div>
          <div class="plan-detail_info">
            <h2
              class="plan-title text-20px leading-24px font-bold mb-10px"
            >
              {{ planDetail.name }}
            </h2>
            <FormTextInput
              v-model="form.content"
              type-input="textarea"
              class="flex-1 textarea plan-content"
              :placeholder="
                $t('pages.plan_edit.placeholder_content')
              "
              :rows="3"
              :is-required="true"
              :errors="errors.content"
            ></FormTextInput>
            <div
              class="plan-action grid grid-cols-[max-content,max-content,max-content] gap-20px mt-5"
            >
              <span
                class="flex items-center text-14px font-bold"
                ><i class="icon-film pr-5px"></i>
                {{ planVideo }}</span
              >
              <span
                class="flex items-center text-14px font-bold"
                ><i class="icon-clock pr-5px"></i>
                {{ comma(planDetail.time_plan_duration)
                }}{{ $t('others.date') }}</span
              >
              <span
                class="flex items-center text-14px font-bold"
              >
                {{ planStatus }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="flex justify-between mt-26px pr-24px <tablet:mt-10px"
        >
          <div
            class="flex font-bold text-26px leading-24px font-bold <mobile:text-20px"
          >
            {{ $t('components.menu.movie') }}
            <div
              class="text-14px leading-24px font-medium pl-16px <tablet:hidden"
            >
              {{ $t('pages.plan_edit.note') }}
            </div>
          </div>
          <div
            class="text-total text-16px leading-24px font-medium mt-6px"
          >
            {{ numberVideo }}
            {{ $t('components.header_lists.unit_subject') }}
          </div>
        </div>
        <div
          class="hidden text-14px leading-24px font-medium <tablet:block"
        >
          {{ $t('pages.plan_edit.note') }}
        </div>

        <div class="plan-list">
          <draggable
            v-model="videos"
            :disabled="!enabled"
            class="list-group"
            handle=".handle"
            draggable=".is-draggable"
            ghost-class="ghost"
            @start="dragging = true"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <PlanVideoItemAction
                :key="element.order"
                :plan-video="element"
                :class="`${
                  !element.is_required ? 'is-draggable' : ''
                }`"
                @delete-video="confirmDeleteVideo"
              ></PlanVideoItemAction>
            </template>
          </draggable>
        </div>
        <div class="plan-action -mt-6px">
          <Button
            type="outline"
            class="mb-23px text-16px"
            :is-disabled="
              isDisabledButton || !videosData.length
            "
            @click="showModalAddVideo"
          >
            <span
              class="icon-plus-circle mr-8px text-20px"
            ></span>
            {{ $t('components.menu.add_video') }}</Button
          >
          <Button
            :is-disabled="
              planDetail?.id !== PlanIdEnum.ADVANCE
                ? !isDisabledButton
                : false
            "
            @click="confirmEditPlan"
          >
            {{ $t('pages.shinseido.video_upload.submit') }}
          </Button>
          <div
            class="text-14px leading-14px mt-14px text-center save-draft underline cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
            @click="editPlan(PlanStatus.PRIVATE)"
          >
            {{ $t('others.save_draft') }}
          </div>
        </div>
      </div>
      <Loading
        v-if="isLoading"
        :theme="userStore.roleName"
        class="fixed w-full h-screen top-0 left-0 z-50"
      />
    </div>
    <!--Modal select video list-->
    <ModalVideoList
      :video-list="videosData"
      :max-video="totalVideoRemaining"
      @click-submit="addVideoToList"
    ></ModalVideoList>
    <!-- End -->

    <!--Modal Message confirm plan delete-->
    <ModalMessage
      :id="ModalNameEnum.MESSAGE"
      :message="$t('pages.plan_edit.title_delete_video')"
      :sub-message="
        $t('pages.plan_edit.msg_confirm_delete_video', {
          title: title,
        })
      "
      :button-cancel="$t('components.button.cancel')"
      :button-submit="$t('components.button.delete')"
      :theme="useUser().roleName"
      @click-submit="deleteVideo"
    />
    <!-- End -->

    <!--Modal Message show message after save draft -->
    <ModalMessage
      :id="ModalNameEnum.ALERT_SUCCESS"
      :message="$t('others.title_modal_common')"
      :sub-message="
        $t('pages.plan_edit.msg_confirm_save_draft', {
          field: planDetail.name,
        })
      "
      :button-submit="$t('components.button.close')"
      :theme="RoleEnum.ADMINISTRANTOR"
      @click-submit="gotoPlanDetail"
    />
    <!-- End -->
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

.plan-detail,
.plan-list_item {
  filter: drop-shadow(0px 5px 10px rgba(51, 51, 51, 0.051));
  border-radius: 24px;
  background-color: $color-white-2;
}

:deep(.button-disable) {
  background-color: $color-gray-2 !important;
}

.plan-content {
  &:deep(textarea) {
    background-color: $color-gray-6;
    resize: none;
    max-height: 103px;
    border: none;
    border-radius: 20px;
  }
}

.save-draft {
  color: $color-shinseido;
}

:deep(.button-disable) {
  color: $color-white-2 !important;
}

:deep(.plan-content .flex span.text-validate) {
  display: none;
}

.is-draggable {
  cursor: move;
}
</style>
