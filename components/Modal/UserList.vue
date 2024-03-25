<script lang="ts" setup>
import { PropType } from 'vue'
import { ModalNameEnum } from '@/constants/modal'
import { Theme } from '@/interfaces/role'
import { IUserList } from '@/interfaces/group'
import { useGroup } from '@/stores/group'
import { ImageDefaultEnum } from '@/constants/image'
import { useCommon } from '@/stores/index'

defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: 'shinseido',
  },
  userListNotSet: {
    type: Array as PropType<IUserList[]>,
    default: null,
  },
})

const groupStore = useGroup()
const commonStore = useCommon()
const { getFullName } = useHelper()
const { $hiddenModal } = useNuxtApp()

const userSelect = ref([] as number[])

const check = (userId: number) => {
  if (!userSelect.value.includes(userId)) {
    userSelect.value.push(userId)
  } else {
    userSelect.value.splice(
      userSelect.value.indexOf(userId),
      1
    )
  }
}

const submit = () => {
  groupStore.removeItemUserListNotSet(userSelect.value)
  $hiddenModal(ModalNameEnum.USER_LIST)
  commonStore.setStatusModal(false)
}

const isOpenModal = computed(() => commonStore.showModal)

watch(isOpenModal, () => {
  userSelect.value = []
})
</script>
<template>
  <ModalWrapper
    :id="ModalNameEnum.USER_LIST"
    content-class="p-32px flex flex-col gap pb-30px mt-10vh !max-w-none w-688px <tablet:w-90vw <tablet:w-max <tablet:!max-w-sm"
    @hide-modal="$emit('hide-modal')"
  >
    <div class="px-25px py-8px <tablet:p-0">
      <div class="text-22px leading-24px font-bold">
        {{ $t('components.modal.user_list.heading') }}
      </div>
      <div class="modal-body">
        <div
          class="video-list mt-22px h-336px overflow-y-scroll"
        >
          <div
            v-for="(user, index) in userListNotSet"
            :key="index"
            class="video-list__item flex items-center py-16px px-14px"
          >
            <FormCheckbox
              :key="index"
              v-model="user.id"
              :theme="theme"
              :list-checked="userSelect"
              :multiple-checkbox="true"
              @update-checked="check"
            />
            <div
              class="video-list__item__thumbnail mr-0 tablet:mr-38px min-w-56px"
            >
              <img
                alt=""
                class="w-45px h-45px rounded-full tablet:w-56px tablet:h-56px"
                :src="
                  user.url_avatar
                    ? user.url_avatar
                    : ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
                "
              />
            </div>
            <div class="video-list__item__info">
              <div
                class="video-list__item__title flex flex-col tablet:flex-row items-baseline"
              >
                <div
                  class="font-bold text-10px tablet:text-16px mr-17px mb-5px tablet:mb-0"
                >
                  {{ user.karute }}
                </div>
                <div class="text-10px tablet:text-14px">
                  {{
                    $t(
                      'components.modal.update_user.level'
                    )
                  }}：
                  {{ user.level || $t('others.no_value') }}
                </div>
              </div>
              <div
                class="video-list__item__checkpoint flex items-center mt-10px flex-col tablet:flex-row items-baseline"
              >
                <div
                  class="name font-bold text-14px tablet:text-22px mr-16px mb-5px tablet:mb-0 tablet:leading-24px"
                >
                  {{
                    getFullName(
                      user.last_name,
                      user.first_name
                    )
                  }}
                </div>
                <div
                  class="name text-14px tablet:text-16px"
                >
                  {{
                    getFullName(
                      user.last_name_kana,
                      user.first_name_kana
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-32px mt-26px">
        <Button
          type="outline"
          :theme="theme"
          @click="$hiddenModal(ModalNameEnum.USER_LIST)"
        >
          {{ $t('components.button.close') }}
        </Button>
        <Button
          type="primary"
          :theme="theme"
          @click="submit"
        >
          {{ $t('components.button.addition') }}
        </Button>
      </div>
    </div>
  </ModalWrapper>
</template>

<style lang="scss" scoped>
.video-list {
  &__item {
    border-top: 1px solid $color-gray-3;

    &:last-child {
      border-bottom: 1px solid $color-gray-3;
    }
  }
}

:deep(.form-checkbox__icon) {
  font-size: 25px;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
