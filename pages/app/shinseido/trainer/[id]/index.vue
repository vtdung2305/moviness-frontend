<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useUser } from '@/stores/user'

definePageMeta({
  layout: 'page',
})

const { getFullName, copyClipboard, getFullAddress } =
  useHelper()

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_list',
    route: { name: 'app-shinseido-trainer' },
  },
  {
    text: 'components.menu.trainer_detail',
    route: { name: '' },
  },
]

const {
  trainerDetail,
  fullName,
  currentPage,
  groupsData,
  meta,
  tab,
  isLoadingPage,
  avatarDisplay,
  gender,
  dateTime,
  birthDay,
  statusAccount,
  statusTrainer,
  handleChangeTab,
  handleViewDetailGroup,
} = useTrainerDetail()

const userStore = useUser()
const router = useRouter()

const handleGroupDetail = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/facility/${id}`)
}
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection
        class="flex-1 w-full relative"
        :list-breadcrumbs="listBreadcrumbs"
        :title-page="$t('pages.trainer_detail.title')"
      >
        <div class="group-detail w-full">
          <div class="flex items-center gap-x-6">
            <div
              class="trainer-detail__image rounded-full overflow-hidden bg-white"
            >
              <img
                :src="avatarDisplay"
                class="w-full h-full object-contain"
              />
            </div>
            <div>
              <div class="text-xl leading-27px font-bold">
                {{ fullName }}
              </div>
              <div class="text-base leading-21px mt-11px">
                <span class="icon-phone text-17px mr-3px" />
                {{
                  trainerDetail?.tel || $t('others.empty')
                }}
              </div>
            </div>
          </div>
          <div
            class="trainer-detail__tabs flex mt-37px w-max overflow-hidden"
          >
            <div
              class="trainer-detail__tab-1"
              :class="{ active: tab === 1 }"
              @click="handleChangeTab(1)"
            >
              {{
                $t(
                  'pages.trainer_detail.personal_information'
                )
              }}
            </div>
            <div
              class="trainer-detail__tab-2"
              :class="{ active: tab === 2 }"
              @click="handleChangeTab(2)"
            >
              {{
                $t('pages.trainer_detail.group_in_charge', {
                  total: meta?.total || 0,
                })
              }}
            </div>
          </div>
          <div v-if="tab === 1">
            <div class="desktop:w-3/4 mt-14px">
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.email') }}
                </div>
                <div class="value">
                  {{ trainerDetail?.email }}
                  <button
                    class="icon-copy-line pl-20px cursor-pointer"
                    :value="trainerDetail?.email"
                    @click="
                      copyClipboard($event.target.value)
                    "
                  ></button>
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.name') }}
                </div>
                <div class="value">
                  {{ fullName }}
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{
                    $t('pages.trainer_detail.name_furigana')
                  }}
                </div>
                <div class="value">
                  {{
                    getFullName(
                      trainerDetail?.last_name_kana,
                      trainerDetail?.first_name_kana
                    )
                  }}
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.address') }}
                </div>
                <div class="value flex flex-col gap-8px">
                  <template
                    v-if="
                      !trainerDetail?.zip1 &&
                      !trainerDetail?.address &&
                      !trainerDetail?.building_name
                    "
                  >
                    {{ $t('others.empty') }}
                  </template>
                  <template v-else>
                    <span>
                      {{
                        trainerDetail?.zip1
                          ? $t(
                              'pages.user_detail.address_symbol'
                            ) +
                            trainerDetail?.zip1 +
                            trainerDetail?.zip2
                          : $t('others.empty')
                      }}
                    </span>
                    <span>
                      {{
                        getFullAddress(
                          trainerDetail?.address,
                          trainerDetail?.building_name
                        ) || $t('others.empty')
                      }}
                    </span>
                  </template>
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.birth_day') }}
                </div>
                <div class="value">
                  {{ birthDay || $t('others.empty') }}
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.gender') }}
                </div>
                <div class="value">
                  {{
                    $t(gender) || $t('others.gender_others')
                  }}
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.situation') }}
                </div>
                <div class="value">
                  {{ statusTrainer || $t('others.empty') }}
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{ $t('pages.trainer_detail.remarks') }}
                </div>
                <div class="value">
                  {{
                    trainerDetail?.memo ||
                    $t('others.empty')
                  }}
                </div>
              </div>
              <div class="row-info">
                <div class="label">
                  {{
                    $t('pages.trainer_detail.facility_name')
                  }}
                </div>
                <div class="value">
                  {{
                    trainerDetail?.facility?.name ||
                    $t('others.empty')
                  }}
                  <span
                    class="facility cursor-pointer"
                    @click="
                      handleGroupDetail(
                        trainerDetail?.facility_id as number
                      )
                    "
                  >
                    {{
                      $t('pages.trainer_detail.see_more')
                    }}
                  </span>
                </div>
              </div>
              <div class="title mt-64px mb-7px">
                {{ $t('pages.trainer_detail.account') }}
              </div>
              <div class="row-info">
                <div class="label">
                  {{
                    $t(
                      'pages.trainer_detail.account_status'
                    )
                  }}
                </div>
                <div class="value">
                  {{ statusAccount || $t('others.empty') }}
                </div>
              </div>
              <div class="row-info mb-70px">
                <div class="label">
                  {{
                    $t('pages.trainer_detail.last_login')
                  }}
                </div>
                <div class="value">
                  {{ dateTime || $t('others.empty') }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="tab === 2">
            <template
              v-if="groupsData && groupsData.length"
            >
              <HeaderLists
                :show-total="false"
                :number-subject="meta?.total || 0"
                :total-subject="meta?.total || 0"
                :min-page="meta?.from || 0"
                :max-page="meta?.to || 0"
                class="mb-22px"
              />
              <div
                class="grid grid-cols-1 desktop:grid-cols-2 gap-8 <sm:gap-4"
              >
                <GroupCard
                  v-for="(item, index) in groupsData"
                  :key="index"
                  class="cursor-pointer"
                  :group="item"
                  @click="handleViewDetailGroup(item.id)"
                />
              </div>
              <Pagination
                v-if="meta?.last_page > 1"
                :current-page="currentPage"
                :total-items="meta?.total"
                :per-page="meta?.per_page"
                class="mt-8"
                :theme="RoleEnum.ADMINISTRANTOR"
                @page-changed="currentPage = $event"
              />
            </template>
            <div
              v-else
              class="w-full h-300px flex items-center justify-center"
            >
              {{ $t('pages.group_detail.no_data') }}
            </div>
          </div>
        </div>
        <Loading
          v-if="isLoadingPage"
          :theme="RoleEnum.ADMINISTRANTOR"
          class="absolute w-full h-screen top-0 left-0"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
<style scoped lang="scss">
.trainer-detail {
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
  }
  &__tab-1 {
    padding: 9px 22px 10px 26px;
    &:hover {
      filter: brightness(1.1);
    }
  }
  &__tab-2 {
    padding: 9px 15px 10px 22px;
    &:hover {
      filter: brightness(1.1);
    }
  }
}

.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  color: $color-gray-1;
}

.row-info {
  display: flex;
  //gap: 59px;
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
    width: 180px;

    @media screen and (max-width: $screen-mobile) {
      width: 140px;
    }
  }

  .value {
    flex: 1;
  }
}

.facility {
  display: inline-block;
  color: $color-shinseido;
  border-bottom: 1px solid $color-shinseido;
  margin-left: 25px;
  font-weight: bold;

  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }
}
</style>
