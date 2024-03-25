<script setup lang="ts">
import { PropType } from 'vue'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const userStore = useUser()
const { formatDate } = useHelper()

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
    await getEvaluationHistories()
    isLoading.value = false
  }
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
                class="text-22px leading-24px font-bold mt-20px"
              >
                {{
                  $t('pages.evaluation_history.achievement')
                }}
              </p>
              <div class="user-evaluation__processbar">
                <div
                  class="user-evaluation__processbar__header flex justify-between items-center"
                >
                  <div class="user-evaluation__num">
                    <span
                      class="level text-72px leading-80px font-bold"
                      :class="userStore.roleName"
                      >{{
                        lastEvaluationHistories?.total_check_point_complete
                      }}</span
                    >
                    <span
                      class="total text-24px leading-40px font-bold"
                      >/{{
                        lastEvaluationHistories?.total_check_point
                      }}</span
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
                      <span class="value font-medium">{{
                        lastEvaluationHistories?.user_name_evaluation
                      }}</span>
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
              <CheckpointListBasic
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
              <!-- <div v-if="tab === 1">
                <div class="mt-6px">
                  <div
                    v-if="
                      evaluationHistories &&
                      evaluationHistories.length
                    "
                    id="table-scroll"
                    class="table-scroll"
                  >
                    <div class="table-wrap">
                      <table class="main-table">
                        <thead>
                          <tr>
                            <th
                              class="fixed-side font-bold text-left w-168px"
                            >
                              {{
                                $t(
                                  'pages.evaluation_history.evaluation_date'
                                )
                              }}
                            </th>
                            <th
                              class="font-bold text-left w-130px"
                              :class="{
                                'fixed-side':
                                  $device.isTablet,
                              }"
                            >
                              {{
                                $t(
                                  'pages.evaluation_history.rater'
                                )
                              }}
                            </th>
                            <th
                              class="font-bold text-left w-80px"
                              :class="{
                                'fixed-side':
                                  $device.isTablet,
                              }"
                            >
                              {{
                                $t(
                                  'pages.evaluation_history.achievements'
                                )
                              }}
                            </th>
                            <th
                              v-for="(
                                ck, k
                              ) in evaluationHistories[0]
                                .check_points"
                              :key="k"
                              class="col"
                            >
                              {{ k + 1 }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(
                              item, index
                            ) in evaluationHistories"
                            :key="index"
                          >
                            <td
                              class="fixed-side font-bold text-left"
                            >
                              <span
                                v-if="!themeTrainer"
                                class="font-bold underline"
                              >
                                {{
                                  formatDate(
                                    item.evaluation_date
                                  )
                                }}
                              </span>
                              <a
                                v-else
                                class="font-bold underline cursor-pointer"
                                @click="
                                  gotoEvaluationMovenment(
                                    item.evaluation_date
                                  )
                                "
                                >{{
                                  formatDate(
                                    item.evaluation_date
                                  )
                                }}</a
                              >
                            </td>
                            <td
                              class="font-bold text-left"
                              :class="{
                                'fixed-side':
                                  $device.isTablet,
                              }"
                            >
                              {{
                                item.user_name_evaluation
                              }}
                            </td>
                            <td
                              class="font-bold text-left"
                              :class="{
                                'fixed-side':
                                  $device.isTablet,
                              }"
                            >
                              <span class="text-24px">{{
                                item.total_check_point_complete
                              }}</span>
                              <span
                                >/{{
                                  item.total_check_point
                                }}</span
                              >
                            </td>
                            <td
                              v-for="(
                                check_point, k
                              ) in item.check_points"
                              :key="k"
                              class="text-center"
                            >
                              <span
                                v-if="
                                  check_point.is_complete
                                "
                                class="icon-check-circle-fill"
                                :class="userStore.roleName"
                              ></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <table class="main-table clone">
                      <thead>
                        <tr>
                          <th
                            class="fixed-side font-bold text-left w-168px"
                          >
                            {{
                              $t(
                                'pages.evaluation_history.evaluation_date'
                              )
                            }}
                          </th>
                          <th
                            class="font-bold text-left w-130px"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            {{
                              $t(
                                'pages.evaluation_history.rater'
                              )
                            }}
                          </th>
                          <th
                            class="font-bold text-left w-80px"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            {{
                              $t(
                                'pages.evaluation_history.achievements'
                              )
                            }}
                          </th>
                          <th
                            v-for="(
                              ck, k
                            ) in evaluationHistories[0]
                              .check_points"
                            :key="k"
                            class="col"
                          >
                            {{ k + 1 }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            item, index
                          ) in evaluationHistories"
                          :key="index"
                        >
                          <td
                            class="fixed-side font-bold text-left"
                          >
                            <span
                              v-if="!themeTrainer"
                              class="font-bold underline"
                            >
                              {{
                                formatDate(
                                  item.evaluation_date
                                )
                              }}
                            </span>
                            <a
                              v-else
                              class="font-bold underline cursor-pointer"
                              @click="
                                gotoEvaluationMovenment(
                                  item.evaluation_date
                                )
                              "
                              >{{
                                formatDate(
                                  item.evaluation_date
                                )
                              }}</a
                            >
                          </td>
                          <td
                            class="font-bold text-left"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            {{ item.user_name_evaluation }}
                          </td>
                          <td
                            class="font-bold text-left"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            <span class="text-24px">{{
                              item.total_check_point_complete
                            }}</span>
                            <span
                              >/{{
                                item.total_check_point
                              }}</span
                            >
                          </td>
                          <td
                            v-for="(
                              check_point, k
                            ) in item.check_points"
                            :key="k"
                            class="text-center"
                          >
                            <span
                              v-if="check_point.is_complete"
                              class="icon-check-circle-fill"
                              :class="userStore.roleName"
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="mt-10 no-data">
                    <p class="text-center">
                      {{ $t('others.no_data') }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="
                    evaluationHistories &&
                    evaluationHistories.length
                  "
                  class="user-evaluation__rating__list mt-26px pb-16px"
                >
                  <span
                    class="title text-16px leading-24px font-bold py-10px"
                    >コメント</span
                  >
                  <table
                    class="table-comment table-fixed border-collapse text-14px leading-24px w-full mt-13px"
                  >
                    <tr
                      v-for="(
                        comment, key
                      ) in evaluationHistories"
                      :key="key"
                    >
                      <td class="w-150px text-justify">
                        {{
                          formatDate(
                            comment.evaluation_date
                          )
                        }}
                      </td>
                      <td>{{ comment.comment }}</td>
                    </tr>
                  </table>
                </div>
              </div> -->
              <div v-if="tab === 1" class="mt-6px">
                <template
                  v-if="
                    evaluationHistories.data &&
                    evaluationHistories?.data.length
                  "
                >
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th
                            class="fixed-side font-bold text-left w-168px"
                          >
                            {{
                              $t(
                                'pages.evaluation_history.evaluation_date'
                              )
                            }}
                          </th>
                          <th
                            class="font-bold text-left w-130px"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            {{
                              $t(
                                'pages.evaluation_history.rater'
                              )
                            }}
                          </th>
                          <th
                            class="font-bold text-left w-80px"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            {{
                              $t(
                                'pages.evaluation_history.achievements'
                              )
                            }}
                          </th>
                          <th
                            v-for="(
                              ck, k
                            ) in evaluationHistories.data[0]
                              .check_points"
                            :key="k"
                            class="col"
                          >
                            {{ k + 1 }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            item, index
                          ) in evaluationHistories.data"
                          :key="index"
                        >
                          <td
                            class="fixed-side font-bold text-left"
                          >
                            <span
                              v-if="!themeTrainer"
                              class="font-bold underline"
                            >
                              {{
                                formatDate(
                                  item.evaluation_date
                                )
                              }}
                            </span>
                            <a
                              v-else
                              class="font-bold line-bottom cursor-pointer"
                              @click="
                                gotoEvaluationMovenment(
                                  item.evaluation_date
                                )
                              "
                              >{{
                                formatDate(
                                  item.evaluation_date
                                )
                              }}</a
                            >
                          </td>
                          <td
                            class="font-bold text-left"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            <div class="truncate pr-15px">
                              {{
                                item.user_name_evaluation
                              }}
                            </div>
                          </td>
                          <td
                            class="font-bold text-left"
                            :class="{
                              'fixed-side':
                                $device.isTablet,
                            }"
                          >
                            <span class="text-24px">{{
                              item.total_check_point_complete
                            }}</span>
                            <span
                              >/{{
                                item.total_check_point
                              }}</span
                            >
                          </td>
                          <td
                            v-for="(
                              check_point, k
                            ) in item.check_points"
                            :key="k"
                            class="text-center"
                          >
                            <span
                              v-if="check_point.is_complete"
                              class="icon-check-circle-fill"
                              :class="userStore.roleName"
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    v-if="
                      evaluationHistories &&
                      evaluationHistories?.data.length
                    "
                    class="user-evaluation__rating__list mt-26px pb-16px"
                  >
                    <span
                      class="title text-16px leading-24px font-bold py-10px"
                      >{{
                        $t(
                          'pages.evaluation_history.comment'
                        )
                      }}</span
                    >
                    <table
                      class="table-comment table-fixed border-collapse text-14px leading-24px w-full mt-13px"
                    >
                      <tr
                        v-for="(
                          comment, key
                        ) in evaluationHistories.data"
                        :key="key"
                      >
                        <td class="w-150px text-justify">
                          {{
                            formatDate(
                              comment.evaluation_date
                            )
                          }}
                        </td>
                        <td>
                          <div
                            class="leadding-24px whitespace-pre-line"
                          >
                            {{ comment.comment }}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </template>
                <div v-else class="mt-10 no-data">
                  <p class="text-center">
                    {{ $t('others.no_data') }}
                  </p>
                </div>
              </div>
              <div v-if="tab === 2">
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
            class="mt-40px desktop:mt-56px"
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
            @click="$showModal(ModalNameEnum.MESSAGE)"
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
        :message="
          $t('pages.evaluation_history.msg_heading_pdf')
        "
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
        :message="
          $t('components.modal.limit_date_section.heading')
        "
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
      max-height: 268px;
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

.table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  th,
  td {
    padding: 18px 0;
    white-space: nowrap;
    border-bottom: 1px solid $color-gray-3;
    background-color: #fff;

    &.col {
      width: 60px;
      font-weight: 500;
    }

    &:first-child,
    &:nth-child(2),
    &:nth-child(3) {
      position: sticky;
    }

    &:first-child {
      left: 0;
    }

    &:nth-child(2) {
      left: 168px;
    }

    &:nth-child(3) {
      left: 298px;
    }

    @media screen and (max-width: $screen-mobile) {
      &:nth-child(2),
      &:nth-child(3) {
        position: static;
      }
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

  td {
    white-space: nowrap;
  }
}

.line-bottom {
  border-bottom: 1px solid;
}
</style>
