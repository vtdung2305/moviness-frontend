<script lang="ts" setup>
import moment from 'moment'
import { MenuItemBase } from '@/interfaces/menu'
import { RoleEnum } from '@/constants/role'
import { useTrainer } from '@/stores/trainer'
import { useUser } from '@/stores/user'
import { GENDERS } from '@/constants/common'
import { ImageDefaultEnum } from '@/constants/image'

definePageMeta({
  layout: 'page',
})

const listBreadcrumbs: MenuItemBase[] = [
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.trainer_settings',
    route: { name: '' },
  },
]

const isLoadingPage = ref(false)
const { getFullAddress, getFullName, copyClipboard } =
  useHelper()
const trainerStore = useTrainer()
const { t } = useLang()
const userStore = useUser()
const router = useRouter()

const avatarDisplay = computed(() => {
  return trainerStore.trainerDetail?.url_avatar
    ? trainerStore.trainerDetail?.url_avatar
    : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
})

const birthDay = computed(() => {
  if (!trainerStore.trainerDetail?.birthday) return ''
  const check = moment(
    trainerStore.trainerDetail?.birthday,
    'YYYY/MM/DD'
  )

  const month = check.format('MM')
  const day = check.format('DD')
  const year = check.format('YYYY')
  return t('pages.group_registration_confirmation.date', {
    year,
    month,
    day,
  })
})

const gender = computed(() => {
  if (trainerStore.trainerDetail?.sex) {
    return GENDERS[Number(trainerStore.trainerDetail.sex)]
  }
  return ''
})

const getUserDetail = async () => {
  isLoadingPage.value = true
  const id = userStore.userData?.id
  await trainerStore.getUserDetail(id as number)
  isLoadingPage.value = false
}

const handleViewEditInfo = () => {
  router.push(`edit`)
}

onMounted(() => {
  getUserDetail()
})
</script>

<template>
  <div>
    <PageWrapper class="flex-1 flex">
      <PageBody class="flex-1 flex flex-col">
        <PageSection
          class="flex-1 w-full"
          :list-breadcrumbs="listBreadcrumbs"
          :title-page="
            $t('pages.trainer_settings.title_shinseido')
          "
        >
          <div
            v-if="!isLoadingPage"
            class="laptop:w-3/4 mt-37px"
          >
            <img
              class="mt-24px w-116px h-116px mb-8px rounded-full object-contain"
              :src="avatarDisplay"
            />
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.email') }}
              </div>
              <div class="value">
                {{ trainerStore.trainerDetail?.email }}
                <button
                  class="icon-copy-line pl-20px cursor-pointer"
                  :value="trainerStore.trainerDetail?.email"
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
                {{
                  getFullName(
                    trainerStore.trainerDetail?.last_name,
                    trainerStore.trainerDetail?.first_name
                  )
                }}
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
                    trainerStore.trainerDetail
                      ?.last_name_kana,
                    trainerStore.trainerDetail
                      ?.first_name_kana
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
                    !trainerStore.trainerDetail?.zip1 &&
                    !trainerStore.trainerDetail?.address &&
                    !trainerStore.trainerDetail
                      ?.building_name
                  "
                >
                  {{ $t('others.empty') }}
                </template>
                <template v-else>
                  <span>
                    {{
                      trainerStore.trainerDetail?.zip1
                        ? $t(
                            'pages.user_detail.address_symbol'
                          ) +
                          trainerStore.trainerDetail?.zip1 +
                          '-' +
                          trainerStore.trainerDetail?.zip2
                        : $t('others.empty')
                    }}
                  </span>
                  <span class="whitespace">
                    {{
                      getFullAddress(
                        trainerStore.trainerDetail?.address,
                        trainerStore.trainerDetail
                          ?.building_name
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
                <span>{{
                  birthDay || $t('others.empty')
                }}</span>
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
                {{ $t('pages.trainer_detail.phone') }}
              </div>
              <div class="value">
                {{
                  trainerStore.trainerDetail?.tel ||
                  $t('others.empty')
                }}
              </div>
            </div>
            <div class="row-info">
              <div class="label">
                {{ $t('pages.trainer_detail.remarks') }}
              </div>
              <div class="value whitespace">
                {{
                  trainerStore.trainerDetail?.memo ||
                  $t('others.empty')
                }}
              </div>
            </div>

            <div class="flex gap-31px mt-38px">
              <Button
                :theme="RoleEnum.ADMINISTRANTOR"
                @click="handleViewEditInfo"
              >
                {{
                  $t('pages.trainer_settings.button_edit')
                }}
              </Button>
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.form-checkbox__icon) {
  font-size: 22px;
  position: relative;
  // top: -10px;
}
.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  color: $color-black-1;
}

.row-info {
  display: flex;
  //gap: 59px;
  padding-bottom: 15px;
  border-bottom: 1px solid $color-gray-3;
  padding-top: 16px;

  @media screen and (max-width: $screen-tablet) {
    flex-direction: column;
  }

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

    @media screen and (max-width: $screen-tablet) {
      width: 100%;
      font-weight: bold;
    }
  }

  .value {
    flex: 1;

    @media screen and (max-width: $screen-tablet) {
      width: 100%;
      margin-top: 10px;
    }
  }
}

:deep(.modal-content) {
  @media screen and (max-width: 450px) {
    padding: 32px;
  }
}

.title {
  color: $color-black-1;
  margin-bottom: 16px;
}

.sub-title {
  color: $color-black-1;
  margin-bottom: 40px;
}

.cancel {
  color: $color-red-1;
  text-decoration: underline;
  text-align: center;
}

.whitespace {
  line-height: 1.5 !important;
  white-space: pre-wrap;
}
</style>
