<script setup lang="ts">
import { PropType } from 'vue'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'
import { ICheckPoint } from '@/interfaces/video'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const userStore = useUser()
const { t } = useLang()
const {
  formatDate,
  handelCheckImageScale,
  getContentPhysical,
  getContentPsychological,
  isSafari,
} = useHelper()

const { isMobile, isTablet } = useDevice()
const { $hiddenModal, $showModal } = useNuxtApp()

const themeShinseido = computed(() => {
  return props.theme === RoleEnum.ADMINISTRANTOR
})

const themeKanrisha = computed(() => {
  return props.theme === RoleEnum.ADMIN
})

const themeTrainer = computed(() => {
  return props.theme === RoleEnum.TRAINER
})

const getPointItem = (checkpoints: ICheckPoint[]) => {
  const physicalPoint = checkpoints.reduce<number>(
    (previousValue: number, currentValue) => {
      return (
        previousValue + Number(currentValue.physical_point)
      )
    },
    0
  )

  const psychologicalPoint = checkpoints.reduce<number>(
    (previousValue: number, currentValue) => {
      return (
        previousValue +
        Number(currentValue.psychological_point)
      )
    },
    0
  )
  return Number(physicalPoint) + Number(psychologicalPoint)
}

const setWidthEvaluationHistory = () => {
  const evaluationHistory: any =
    document.querySelector('body')
  const totalCheckpointVideo =
    totalCheckPoint.value / 10 / 2
  if (evaluationHistory) {
    evaluationHistory.style.setProperty(
      `--width-checkpoint`,
      `${73 * totalCheckpointVideo + 87}px`
    )
  }
}

const {
  chartData,
  chartValue,
  chartDate,
  isLoading,
  tab,
  colorChart,
  memberDetail,
  videoDetail,
  evaluationHistories,
  lastEvaluationHistories,
  totalCheckPoint,
  percentCompleted,
  date,
  loadCount,
  optionChart,
  lastCheckPointHistories,
  hasLeaveMember,
  filter,
  totalCheckpointComplete,
  handleChangeTab,
  getEvaluationHistories,
  gotoEvaluationMovenment,
  onPageChange,
  exportPdfHistoriesEvaluation,
  confirmExportPdf,
} = useUserEvaluation()

watch(date, async (newVal, oldVal) => {
  if (oldVal) {
    isLoading.value = true
    filter.value.page = 1
    await getEvaluationHistories()
    isLoading.value = false
  }
})

onMounted(async () => {
  await setWidthEvaluationHistory()
})
</script>

<template>
  <div class="group-detail desktop:w-3/4">
    <UserInfoEvaluation :member-detail="memberDetail" />

    <div class="user-evaluation mt-62px">
      <VideoPlayer
        :video-data="videoDetail || undefined"
        :class-name="`w-full h-auto`"
        :scroll="false"
      />
    </div>

    <div class="user-evaluation">
      <div class="user-evaluation__video">
        <template
          v-if="loadCount === 1 && !lastEvaluationHistories"
        >
          <div
            class="user-evaluation__recent rounded-24px mt-40px p-30px <mobile:px-15px"
          >
            <div class="user-evaluation__recent__top">
              <span
                class="user-evaluation__recent__title text-14px font-bold"
                >{{
                  $t(
                    'pages.evaluation_history.recent_evaluation'
                  )
                }}</span
              >
            </div>
            <div class="text-center mt-10 no-data">
              <p>{{ $t('others.no_data') }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="user-evaluation__recent rounded-24px mt-40px p-30px <mobile:px-15px"
          >
            <div class="user-evaluation__recent__top">
              <span
                class="user-evaluation__recent__title text-14px font-bold"
                >{{
                  $t(
                    'pages.evaluation_history.recent_evaluation'
                  )
                }}</span
              >
              <p
                class="text-22px leading-24px font-bold mt-20px <tablet:text-18px <tablet:leading-20px"
              >
                {{
                  $t('pages.evaluation_history.achievement')
                }}
              </p>
              <div class="user-evaluation__processbar">
                <div
                  class="user-evaluation__processbar__header flex justify-between items-center <tablet:gap-x-15px"
                >
                  <div class="user-evaluation__num">
                    <span
                      class="level text-72px leading-80px font-bold <tablet:text-40px <tablet:leading-55px"
                      :class="userStore.roleName"
                      >{{ totalCheckpointComplete }}</span
                    >
                    <span
                      class="total text-24px leading-40px font-bold <tablet:text-20px <tablet:leading-35px"
                      >/{{ totalCheckPoint }}</span
                    >
                  </div>
                  <div
                    class="user-evaluation__info grid grid-rows-2 gap-8px"
                  >
                    <div
                      class="grid grid-cols-[88px,1fr] text-14px leading-24px gap-y-8px"
                    >
                      <span class="flex items-center"
                        ><i
                          class="text-16px icon-clock pr-5px"
                        />{{
                          $t(
                            'pages.evaluation_history.evaluation_date'
                          )
                        }}
                      </span>
                      <span class="value font-medium">{{
                        formatDate(
                          lastEvaluationHistories?.evaluation_date
                        )
                      }}</span>
                    </div>
                    <div
                      class="grid grid-cols-[88px,1fr] text-14px leading-24px"
                    >
                      <span class="flex items-center"
                        ><i
                          class="text-16px icon-user pr-5px"
                        />{{
                          $t(
                            'pages.evaluation_history.rater'
                          )
                        }}
                      </span>
                      <span
                        class="value font-medium line-clamp-1"
                        >{{
                          lastEvaluationHistories?.user_name_evaluation
                        }}</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="user-evaluation__processbar__body relative w-full h-24px rounded-12px mt-4px"
                >
                  <div
                    class="user-evaluation__processbar__body__completed absolute top-0 left-0 h-24px rounded-12px"
                    :class="userStore.roleName"
                    :style="{
                      width: `${percentCompleted}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div
              class="user-evaluation__recent__center mb-20px"
            >
              <CheckpointLastEvaluation
                :length-check-point="
                  lastCheckPointHistories.length || 0
                "
                :check-points-data="lastCheckPointHistories"
                :hide-length-check-point="false"
                :is-completed="true"
              />
            </div>
            <div class="user-evaluation__recent__bottom">
              <span class="text-18px font-bold">{{
                $t('pages.evaluation_history.comment')
              }}</span>
              <p
                class="text-16px leading-24px mt-8px text-justify whitespace-pre-line"
              >
                {{ lastEvaluationHistories?.comment }}
              </p>
            </div>
          </div>
        </template>

        <div
          class="user-evaluation__rating rounded-24px mt-30px py-32px px-30px <mobile:px-15px"
        >
          <template
            v-if="
              loadCount === 1 &&
              !evaluationHistories?.data.length
            "
          >
            <div
              class="user-evaluation__rating__top flex justify-between <tablet:flex-wrap <tablet:flex-col"
            >
              <span class="title text-14px font-bold">{{
                $t(
                  'pages.evaluation_history.rating_history'
                )
              }}</span>
              <FormDatePicker
                v-if="date?.length"
                v-model:value="date"
                :disabled="(date) => date >= new Date()"
                :range="true"
              />
            </div>
            <div class="text-center mt-10 no-data">
              <p>{{ $t('others.no_data') }}</p>
            </div>
          </template>
          <template v-else>
            <div
              class="user-evaluation__rating__top flex justify-between <tablet:flex-wrap <tablet:flex-col"
            >
              <span class="title text-14px font-bold">{{
                $t(
                  'pages.evaluation_history.rating_history'
                )
              }}</span>
              <!-- <FormDatePickerRanger
                v-model="date"
                class="<tablet:mt-16px"
              ></FormDatePickerRanger> -->
              <FormDatePicker
                v-model:value="date"
                :disabled="(date) => date >= new Date()"
                :range="true"
              />
            </div>
            <div
              v-if="
                evaluationHistories &&
                evaluationHistories?.data.length
              "
              class="user-detail__tabs flex mt-15px w-max overflow-hidden"
              :class="userStore.roleName"
            >
              <div
                class="user-detail__tab"
                :class="{ active: tab === 1 }"
                @click="handleChangeTab(1)"
              >
                {{
                  $t(
                    'pages.evaluation_history.evaluation_comparison'
                  )
                }}
              </div>
              <div
                class="user-detail__tab"
                :class="{ active: tab === 2 }"
                @click="handleChangeTab(2)"
              >
                {{
                  $t(
                    'pages.evaluation_history.evaluation_transition'
                  )
                }}
              </div>
            </div>
            <Loading
              v-if="isLoading"
              :theme="userStore.roleName"
              class="h-300px"
            />
            <template v-if="!isLoading">
              <div v-show="tab === 1" class="mt-6px">
                <template
                  v-if="
                    evaluationHistories.data &&
                    evaluationHistories?.data.length
                  "
                >
                  <div class="evaluation-history">
                    <div
                      v-for="(
                        item, k
                      ) in evaluationHistories.data"
                      :key="k"
                      class="evaluation-history__item"
                    >
                      <div
                        class="evaluation-history__item__head relative items-end text-16px leading-20px <tablet:flex-wrap <tablet:justify-between"
                      >
                        <span
                          class="evaluation-history__date"
                          >{{
                            formatDate(item.evaluation_date)
                          }}</span
                        >
                        <span
                          class="evaluation-history__author max-w-100px line-clamp-1"
                          >{{
                            item.user_name_evaluation
                          }}</span
                        >
                        <div
                          class="flex items-end pl-50px <tablet:pl-0 <tablet:mt-10px"
                        >
                          <span
                            class="achievement text-16px leading-24px font-bold"
                            >{{
                              $t(
                                'pages.evaluation_history.achievements'
                              )
                            }}</span
                          >
                          <div class="font-bold ml-12px">
                            <span
                              class="evaluation-history__point text-30px leading-24px"
                              >{{
                                getPointItem(
                                  item.check_points
                                )
                              }}</span
                            >
                            <span
                              class="evaluation-history__total text-19px leading-24px ml-4px"
                              >/{{ totalCheckPoint }}</span
                            >
                          </div>
                        </div>
                        <span
                          v-if="themeTrainer"
                          class="evaluation-history__action select-none absolute right-13px top-6px <tablet:static"
                          @click="
                            gotoEvaluationMovenment(
                              item.evaluation_date
                            )
                          "
                          >{{
                            $t('components.button.update')
                          }}</span
                        >
                      </div>
                      <div class="table-responsive">
                        <div
                          class="evaluation-history__item__body flex gap-x-17px"
                        >
                          <div
                            class="evaluation-history__item__body__info w-70px flex items-end gap-x-17px sticky left-0"
                          >
                            <div
                              class="label text-16px leading-20px font-bold grid grid-cols-1 gap-y-12px"
                            >
                              <div>
                                {{
                                  $t(
                                    'pages.evaluation_movement.physical_change'
                                  )
                                }}
                              </div>
                              <div>
                                {{
                                  $t(
                                    'pages.evaluation_movement.psychological_change'
                                  )
                                }}
                              </div>
                            </div>
                          </div>
                          <div
                            class="evaluation-history__item__body__checkpoint flex pt-22px"
                          >
                            <div
                              v-for="(
                                ck, v
                              ) in item.check_points"
                              :key="v"
                              class="checkpoint__item w-73px text-center"
                            >
                              <span
                                class="checkpoint__item__num font-medium"
                                >{{ v + 1 }}</span
                              >
                              <div
                                class="checkpoint__item__info grid grid-cols-1 gap-y-12px pt-14px"
                              >
                                <div
                                  class="checkpoint__item__value flex justify-center items-center gap-x-10px"
                                >
                                  <span
                                    class="leading-20px"
                                    :class="{
                                      'w-22px':
                                        ck.psychological_point >
                                        9,
                                      '-tracking-1.7px':
                                        isSafari,
                                    }"
                                    >{{
                                      ck.physical_point
                                    }}</span
                                  >
                                  <span
                                    v-tooltip="{
                                      content: $t(
                                        getContentPhysical(
                                          ck.physical_point
                                        )
                                      ),
                                      container:
                                        '.group-detail',
                                    }"
                                    class="cursor-pointer"
                                  >
                                    <img
                                      class="w-20px h-20px"
                                      :src="
                                        handelCheckImageScale(
                                          ck.physical_point
                                        )
                                      "
                                      alt="physical"
                                    />
                                  </span>
                                </div>
                                <div
                                  class="checkpoint__item__value flex justify-center gap-x-10px"
                                >
                                  <span
                                    class="leading-20px"
                                    :class="{
                                      'w-22px':
                                        ck.physical_point >
                                        9,
                                      '-tracking-1.7px':
                                        isSafari,
                                    }"
                                    >{{
                                      ck.psychological_point
                                    }}</span
                                  >
                                  <span
                                    v-tooltip="{
                                      content: $t(
                                        getContentPsychological(
                                          ck.psychological_point
                                        )
                                      ),
                                      container:
                                        '.group-detail',
                                    }"
                                    class="cursor-pointer"
                                  >
                                    <img
                                      class="w-20px h-20px"
                                      :src="
                                        handelCheckImageScale(
                                          ck.psychological_point
                                        )
                                      "
                                      alt="physical"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="evaluation-history__item__comment pt-21px pb-7px flex gap-x-33px"
                      >
                        <span
                          class="title text-16px leading-24px font-bold comment"
                          >{{
                            $t(
                              'pages.evaluation_history.comment'
                            )
                          }}</span
                        >
                        <p
                          class="content text-16px leading-24px font-medium whitespace-pre-line text-justify"
                        >
                          {{ item.comment }}
                        </p>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="mt-10 no-data">
                  <p class="text-center">
                    {{ $t('others.no_data') }}
                  </p>
                </div>
              </div>
              <div v-show="tab === 2">
                <div
                  v-if="
                    evaluationHistories &&
                    evaluationHistories?.data.length
                  "
                  class="user-evaluation__chart mt-40px"
                >
                  <LineChart
                    :chart-data="chartData"
                    :option-chart="optionChart"
                  />
                </div>
                <div v-else class="mt-10 no-data">
                  <p class="text-center">
                    {{ $t('others.no_data') }}
                  </p>
                </div>
              </div>
            </template>
          </template>

          <Pagination
            v-if="evaluationHistories?.meta?.last_page > 1"
            :theme="userStore.roleName"
            :current-page="
              evaluationHistories?.meta?.current_page
            "
            :total-items="evaluationHistories?.meta.total"
            :per-page="evaluationHistories?.meta?.per_page"
            class="mt-30px"
            @page-changed="onPageChange"
          />
        </div>
      </div>

      <div
        v-if="themeShinseido || themeKanrisha"
        class="user-evaluation__action mt-40px"
      >
        <Button
          v-if="evaluationHistories?.data.length"
          :theme="userStore.roleName"
          type="outline"
          class="desktop:flex text-16px h-53px"
          @click="confirmExportPdf"
        >
          {{ $t('pages.evaluation_history.btn_pdf') }}
        </Button>
      </div>
      <div v-else class="user-evaluation__action mt-40px">
        <div class="flex gap-31px">
          <Button
            v-if="evaluationHistories?.data.length"
            :theme="userStore.roleName"
            type="outline"
            @click="confirmExportPdf"
          >
            {{ $t('pages.evaluation_history.btn_pdf') }}
          </Button>
          <Button
            v-if="
              (RoleEnum.ADMIN || RoleEnum.TRAINER) &&
              !hasLeaveMember
            "
            :theme="userStore.roleName"
            @click="gotoEvaluationMovenment"
          >
            <span
              class="icon-plus-circle text-24px pr-10px"
            ></span
            >{{ $t('pages.evaluation_history.btn_rating') }}
          </Button>
        </div>
      </div>

      <ModalMessage
        :id="ModalNameEnum.MESSAGE"
        :message="$t('others.title_modal_confirm')"
        :sub-message="
          $t('pages.evaluation_history.msg_body_pdf')
        "
        :button-cancel="$t('components.button.cancel')"
        :button-submit="
          $t('pages.user_list.button_dowload_csv')
        "
        :theme="userStore.roleName"
        @click-submit="exportPdfHistoriesEvaluation"
      />

      <ModalMessage
        :id="ModalNameEnum.LIMIT_DATE_SELECT"
        :message="$t('others.title_modal_common')"
        :sub-message="
          $t('components.modal.limit_date_section.content')
        "
        :theme="userStore.roleName"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon-check-circle-fill {
  &.shinseido::before {
    color: $color-shinseido;
  }

  &.kanrisha::before {
    color: $color-kanrisha;
  }

  &.trainer::before {
    color: $color-trainer;
  }
}

.user-evaluation {
  &__recent {
    background-color: $color-white;

    &__title {
      color: $color-gray-2;
    }

    &:deep(.checkpoint-list-basic__list) {
      overflow-y: scroll;
      max-height: 330px;
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
    .title {
      color: $color-gray-2;
    }
    &__list {
      table {
        tr {
          border-top: 1px solid $color-gray-3;

          > td {
            padding: 10px 0;
            vertical-align: top;
          }

          &:last-child {
            border-bottom: 1px solid $color-gray-3;
          }
        }
      }
    }
  }

  &__num {
    @media screen and (max-width: $screen-mobile) {
      flex: 0 0 auto;
    }
  }
}

.user-detail {
  &__image {
    width: 72px;
    height: 72px;
  }

  &__tabs {
    background: $color-gray-3;
    color: $color-gray-2;
    border-radius: 20px;
    cursor: pointer;

    .active {
      font-weight: bold;
      color: $color-white-2;
      background: $color-shinseido;
    }

    &.trainer {
      .active {
        font-weight: bold;
        color: $color-white-2;
        background: $color-trainer;
      }
    }

    &.kanrisha {
      .active {
        font-weight: bold;
        color: $color-white-2;
        background: $color-kanrisha;
      }
    }
  }

  &__tab {
    padding: 9px 22px 10px 26px;

    @media (hover: hover) {
      &:hover {
        filter: brightness(1.1);
      }
    }

    &:last-child {
      padding: 9px 20px 10px 22px;
    }
  }
}

.table-wrap {
  width: 100%;
  overflow: auto;
}

.table-scroll {
  position: relative;
  max-width: 100%;
  margin: auto;
  overflow: hidden;

  @media screen and (max-width: 940px) {
    max-width: 800px;
  }

  table {
    width: 100%;
    margin: auto;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
  }

  th,
  td {
    padding: 18px 0;
    border-bottom: 1px solid $color-gray-3;
    background: #fff;
    white-space: nowrap;
    vertical-align: top;

    &.col {
      width: 60px;
      font-weight: 500;
    }
  }

  th {
    color: $color-gray-2;
    padding: 12px 0;

    &:first-child,
    &:nth-child(2),
    &:nth-child(3) {
      font-weight: bold;
    }
  }
}

.clone {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  th,
  td {
    visibility: hidden;
    border-color: transparent;
  }

  tbody th {
    border-color: transparent;
    visibility: visible;
  }

  .fixed-side {
    border-bottom: 1px solid $color-gray-3;
    visibility: visible;
  }

  thead,
  tfoot {
    background: transparent;
  }
}

.icon-check-circle-fill {
  &::before {
    font-size: 24px;
  }
}

.table-comment {
  tr > td {
    padding: 5px 0;
  }
}

.icon-plus-circle::before {
  color: $color-white;
}

.no-data {
  margin-bottom: calc(2.5rem + 14px);
}

// new table
.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: block;
  }
}

.line-bottom {
  border-bottom: 1px solid;
}

.evaluation-history {
  margin-top: 35px;
  &__item {
    border-top: 1px solid $color-gray-3;
    padding: 24px 0;

    &:last-child {
      border-bottom: 1px solid $color-gray-3;
    }

    &__head {
      display: flex;
      // align-items: end;
      color: $color-black-1;
      column-gap: 15px;
    }

    &__body {
      width: var(--width-checkpoint);

      &__info {
        background-color: $color-white;
      }
    }

    &__comment {
      span {
        flex: 0 0 auto;
      }

      .content {
        color: $color-black-1;
      }

      @media screen and (max-width: $screen-mobile) {
        flex-wrap: wrap;

        .content {
          margin-top: 10px;
        }
      }
    }
  }

  &__action {
    color: $color-trainer;
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    cursor: pointer;
    transition: 0.3s;
    border-bottom: 1px solid;

    &:hover {
      opacity: 0.6;
    }

    i {
      margin-right: 5px;
    }
  }

  .achievement {
    color: $color-gray-2;
  }

  .label {
    color: $color-gray-2;
  }
}

.checkpoint__item {
  font-size: 16px;

  &__num {
    color: $color-gray-2;
  }
  &__value {
    font-weight: bold;
    color: $color-black-1;
  }
}
</style>

<style>
.group-detail .v-popper__inner {
  width: 200px;
  font-size: 14px;
}
</style>
