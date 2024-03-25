<script lang="ts" setup>
import { PropType } from 'vue'
import {
  userStatusList,
  userOrderList,
  levels,
} from '@/constants/member'
import {
  IMemberStatus,
  IMemberOrder,
  IMemberFilter,
  IMemberLevel,
} from '@/interfaces/member'
import { useMember } from '@/stores/member'
import { useTrainer } from '@/stores/trainer'
import { Theme } from '@/interfaces/role'
import { RoleEnum } from '@/constants/role'
import { IUser } from '@/interfaces/user'
import { useUser } from '@/stores/user'
import { useFacility } from '@/stores/facility'
import { ModalNameEnum } from '@/constants/modal'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})
const { t } = useLang()
const memberStore = useMember()
const trainerStore = useTrainer()
const userStore = useUser()
const router = useRouter()
const route = useRoute()
const facilityStore = useFacility()
const { $showModal, $hiddenModal } = useNuxtApp()

const { getFullName } = useHelper()
const sortList = userOrderList.map(
  (item: IMemberOrder) => item.name
)
const levelList = ref<IMemberLevel[]>(levels)
const levelNameList = computed(() =>
  levelList.value.map((item) => item.name)
)
const isLoading = ref<boolean>(true)
const status = ref<string>(
  route.query?.status
    ? userStatusList[2].name
    : userStatusList[0].name
)
const keyword = ref<string>('')
const orderName = ref<string>(userOrderList[0].name)
const orderBy = ref<string>(userOrderList[0].order_by)
const orderType = ref<string>(userOrderList[0].order_type)
const level = ref<string>()
const trainerName = ref<string>('')
const facilityName = ref<string>('')
const groupId = ref<string>('')
const filter = computed(() => {
  return {
    status: userStatusList.find(
      (item) => item.name === status.value
    )?.value,
    keyword: keyword.value,
    order_by: orderBy.value,
    order_type: orderType.value,
    level:
      levelList.value
        .find((item) => item.name === level.value)
        ?.value?.toString() || null,
    trainer_id:
      trainerStore.trainers?.find(
        (item) =>
          getFullName(item.last_name, item.first_name) ===
          trainerName.value
      )?.id || '',
    facility_id:
      facilityStore.facilityList?.find(
        (item) => item.name === facilityName.value
      )?.id || '',
    group_id: groupId.value,
    page: memberStore.page,
  }
})

const statusList = computed(() => {
  if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
    return userStatusList
      .filter((item) => item.value !== 2)
      .map((item: IMemberStatus) => item.name)
  }
  return userStatusList.map(
    (item: IMemberStatus) => item.name
  )
})

const trainerNameList = computed(() => {
  return (
    trainerStore.trainers?.map((item) => ({
      label: getFullName(item.last_name, item.first_name),
      value: getFullName(item.last_name, item.first_name),
      checked: userStore.userData?.id === item.id!,
    })) || []
  )
})

const facilityNameList = computed(() => {
  return facilityStore.facilityList
    ? facilityStore.facilityList.map((item) => item.name)
    : []
})

const getMemberList = async () => {
  isLoading.value = true
  if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
    await memberStore.getMembersForSuperAdmin(
      filter.value as IMemberFilter
    )
  } else {
    await memberStore.getListMemberByFacility(
      filter.value as IMemberFilter
    )
  }
  isLoading.value = false
}

const onPageChange = (value: number) => {
  memberStore.page = value
  getMemberList()
}

const onFacilityChange = async (value: string) => {
  trainerName.value = 'pages.user_list.all'
  const facility = facilityStore.facilityList.find(
    (item) => item.name === value
  )
  if (facility) {
    if (value === t('pages.user_list.all')) {
      await trainerStore.getTrainerForSuperAdmin({
        limit: '0',
        status: 1,
      })
    } else {
      await trainerStore.getAllTrainerByFacilityId(
        facility.id as number
      )
    }
    trainerStore.trainers = [
      { last_name: t('pages.user_list.all'), id: null },
      ...(trainerStore.trainers as IUser[]),
    ]
  }
}

const onFilter = () => {
  memberStore.page = 1
  getMemberList()
}

const onExportCsv = async () => {
  await memberStore.exportMembersByFacility(
    filter.value as IMemberFilter
  )
  if (memberStore.urlExportCsv) {
    window.location.href =
      memberStore.urlExportCsv as string
  }
  $hiddenModal(ModalNameEnum.CONFIRM_EXPORT_CSV)
}

const onOrder = (value: string) => {
  orderName.value = value
  const order = userOrderList.find(
    (item) => item.name === value
  )
  if (order) {
    orderBy.value = order.order_by
    orderType.value = order.order_type
    getMemberList()
  }
}

onMounted(async () => {
  levelList.value = [
    { name: 'pages.user_list.all', value: null },
    ...levelList.value,
  ]
  if (userStore.roleName === RoleEnum.ADMINISTRANTOR) {
    await facilityStore.getFacilityList({ limit: '0' })
    await trainerStore.getTrainerForSuperAdmin({
      limit: '0',
      status: 1,
    })
    facilityStore.facilityList = [
      { name: t('pages.user_list.all'), id: null },
      ...facilityStore.facilityList,
    ]
  } else {
    await trainerStore.getAllTrainerByFacilityId(
      userStore.userData?.facility_id as number
    )
    if (userStore.roleName === RoleEnum.TRAINER) {
      trainerName.value = getFullName(
        userStore.userData?.last_name,
        userStore.userData?.first_name
      )
    }
  }
  trainerStore.trainers = [
    { last_name: t('pages.user_list.all'), id: null },
    ...(trainerStore.trainers as IUser[]),
  ]
  await getMemberList()
})

const handleViewDetailMember = (id: number | string) => {
  const role = userStore.roleName
  router.push(`/app/${role}/user/${id}`)
}
</script>

<template>
  <div :class="`theme-${theme}`">
    <div
      class="filter-header flex flex-col mobile:gap-8 mobile:flex-row gap-2 desktop:max-w-892px"
    >
      <Dropdown
        v-model="status"
        :label="$t('pages.user_list.status')"
        :text-button="$t('pages.user_list.all')"
        :items="statusList"
        class="filter-item"
      />
      <Dropdown
        v-if="
          userStore.roleName === RoleEnum.ADMINISTRANTOR
        "
        v-model="facilityName"
        :label="$t('pages.user_list.facility')"
        :text-button="$t('pages.user_list.all')"
        :items="facilityNameList"
        class="filter-item"
        @on-selected="onFacilityChange"
      />
      <Dropdown
        v-else
        v-model="level"
        :label="$t('pages.user_list.level')"
        :text-button="$t('pages.user_list.all')"
        :items="levelNameList"
        class="filter-item"
      />
      <Dropdown
        v-model="trainerName"
        :label="$t('pages.user_list.trainer')"
        :text-button="$t('pages.user_list.all')"
        :object-item="trainerNameList"
        class="filter-item"
      />
    </div>
    <div
      class="flex mt-18px mobile:gap-8 gap-2 <sm:flex-col"
    >
      <FormTextInput
        v-model="keyword"
        type-input="search"
        class="flex-1 desktop:max-w-584px h-54px"
        :placeholder="
          $t('pages.user_list.placeholder_search')
        "
      />
      <Button
        :theme="theme"
        :is-disabled="isLoading"
        type="primary"
        class="mobile:w-37 w-30 text-16px desktop:w-276px desktop:text-20px h-53px <mobile:w-full"
        @click="onFilter"
      >
        {{ $t('pages.facility.search') }}
      </Button>
      <Button
        :theme="theme"
        type="outline"
        class="<desktop:hidden desktop:flex mobile:w-37 w-30 text-16px desktop:w-276px h-53px <mobile:w-full"
        :is-disabled="memberStore.listMember.length === 0"
        @click="
          $showModal(ModalNameEnum.CONFIRM_EXPORT_CSV)
        "
      >
        {{ $t('pages.user_list.export_csv') }}
      </Button>
    </div>
    <div
      class="flex mt-18px desktop:mt-16px mb-43px gap-8px desktop:gap-24px flex-wrap"
    >
      <Button
        v-for="(item, index) in sortList"
        :key="index"
        :theme="theme"
        :type="item === orderName ? 'primary' : 'outline'"
        class="rounded-xl w-max h-30px px-4 text-14px border-2 border-transparent button-order"
        @click="onOrder(item)"
      >
        {{ $t(item) }}
      </Button>
    </div>
    <HeaderLists
      :number-subject="memberStore.total"
      :total-subject="memberStore.listMember.length"
      class="mb-22px"
    />
    <Loading
      v-if="isLoading"
      :theme="theme"
      class="h-202px"
    />
    <template v-else-if="memberStore.listMember.length">
      <div
        class="grid grid-cols-1 desktop:grid-cols-2 gap-8 <sm:gap-4 list-user__content"
      >
        <UserCard
          v-for="(item, index) in memberStore.listMember"
          :key="index"
          :theme="theme"
          :member="item"
          @click="handleViewDetailMember(item.id)"
        />
      </div>
      <Pagination
        v-if="memberStore.total > 10"
        :theme="theme"
        :current-page="memberStore.page"
        :total-items="memberStore.total"
        :per-page="10"
        class="mt-40px desktop:mt-56px"
        @page-changed="onPageChange"
      />
      <Button
        :theme="theme"
        type="outline"
        class="mt-39px desktop:hidden"
        @click="
          $showModal(ModalNameEnum.CONFIRM_EXPORT_CSV)
        "
      >
        {{ $t('pages.user_list.export_csv') }}
      </Button>
    </template>
    <div v-else class="text-center m-100px">
      {{ $t('others.no_data') }}
    </div>
    <ModalMessage
      :id="ModalNameEnum.ALERT_MANY_REQUEST"
      :theme="userStore.roleName"
      :message="$t('others.many_request_title')"
      :sub-message="$t('others.many_request_message')"
    />
    <ModalWrapper
      :id="ModalNameEnum.CONFIRM_EXPORT_CSV"
      content-class="px-56px w-11/12 tablet:w-max mt-176px pt-41px pb-40px flex flex-col items-center gap modal-content"
    >
      <div class="text-22px leading-22px font-bold title">
        {{ $t('others.title_modal_confirm') }}
      </div>
      <div class="text-16px leading-16px sub-title">
        {{ $t('pages.user_list.content') }}
      </div>
      <Button
        type="primary"
        class="w-280px h-52px"
        :theme="userStore.roleName"
        @click="onExportCsv"
      >
        {{ $t('pages.user_list.button_dowload_csv') }}
      </Button>
      <div
        class="text-14px leading-14px mt-14px cancel cursor-pointer transition-opacity all duration-200 opacity-100 hover:opacity-80"
        @click="
          $hiddenModal(ModalNameEnum.CONFIRM_EXPORT_CSV)
        "
      >
        {{ $t('components.button.cancel') }}
      </div>
    </ModalWrapper>
  </div>
</template>

<style scoped lang="scss">
.list-user__content {
  @media screen and (min-width: $screen-desktop) {
    margin-top: -2px;
  }
}

.button-order {
  padding-left: 16px;

  &:nth-child(1) {
    padding-right: 0px;
  }

  &:nth-child(2) {
    padding-right: 0px;
  }

  &:nth-child(3) {
    padding-right: 11px;
  }

  &:nth-child(4) {
    padding-right: 11px;
  }
}

.filter-header {
  width: calc(100vw - 80px);

  @media (max-width: 425px) {
    width: calc(100vw - 32px);
  }

  .filter-item {
    width: calc((100% - 64px) / 3);

    @media (max-width: 425px) {
      width: 100%;
    }
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
</style>
