<script setup lang="ts">
import { PropType } from 'vue'
import { ImageDefaultEnum } from '@/constants/image'
import { RoleEnum } from '@/constants/role'
import { Theme } from '@/interfaces/role'
import { ModalNameEnum } from '@/constants/modal'

const props = defineProps({
  theme: {
    type: String as PropType<Theme>,
    default: RoleEnum.ADMINISTRANTOR,
  },
})

const { getFullName, formatDate, getFullAddress } =
  useHelper()
const isLoadingPage = ref(false)
const { $showModal, $hiddenModal } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const errorMsg = ref<string>('')

const leaveFacility = async () => {
  try {
    isLoadingPage.value = true
    const { $api } = useNuxtApp()
    const id = route.params.id
    isLoading.value = true
    const res = await $api.member.leaveFacility(
      id as string
    )
    if (res && res.data) {
      $showModal(ModalNameEnum.ALERT_SUCCESS)
    } else {
      errorMsg.value = res.message
      $showModal(ModalNameEnum.ALERT_ERROR)
    }
    isLoading.value = false
  } catch (error: any) {
    showError({
      statusCode: error?.status,
      statusMessage: error?.statusText,
    })
    console.log(error)
  }
  isLoadingPage.value = false
}

const {
  memberDetail,
  gender,
  age,
  level,
  isAgree,
  isDelete,
  classBtn,
  isLoading,
  gotoMemberDetail,
} = useMemberDetail()
</script>

<template>
  <div class="user-detail desktop:w-3/4 -mt-5px">
    <div class="user-detail__container relative mt-42px">
      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.user_delete.title_info') }}
        </div>

        <div class="common-info__image mt-20px mb-9px">
          <img
            :src="
              ImageDefaultEnum.IMAGE_GRAY_MEMBER_DEFAULT
            "
            class="w-full h-full object-contain"
            alt=""
          />
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.record') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                memberDetail?.karute || $t('others.empty')
              }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.function_level') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{ level || $t('others.empty') }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.name') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                getFullName(
                  memberDetail?.last_name,
                  memberDetail?.first_name
                )
              }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.name_furigana') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                getFullName(
                  memberDetail?.last_name_kana,
                  memberDetail?.first_name_kana
                )
              }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.address') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              <template
                v-if="
                  !memberDetail?.zip1 &&
                  !memberDetail?.address &&
                  !memberDetail?.building_name
                "
              >
                {{ $t('others.empty') }}
              </template>
              <template v-else>
                <div class="flex flex-col">
                  <span>
                    {{
                      memberDetail?.zip1
                        ? $t(
                            'pages.user_detail.address_symbol'
                          ) +
                          memberDetail?.zip1 +
                          '-' +
                          memberDetail?.zip2
                        : $t('others.empty')
                    }}
                  </span>
                  <span>
                    {{
                      getFullAddress(
                        memberDetail?.address,
                        memberDetail?.building_name
                      ) || $t('others.empty')
                    }}
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_registration.birth_day') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                formatDate(memberDetail?.birthday) ||
                $t('others.empty')
              }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.age_label') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{ age || $t('others.empty') }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.gender') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{ $t(gender) || $t('others.gender_others') }}
            </div>
          </div>
        </div>

        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.mobile_phone') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{ memberDetail?.tel || $t('others.empty') }}
            </div>
          </div>
        </div>

        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.medical_history') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                memberDetail?.medical_history ||
                $t('others.empty')
              }}
            </div>
          </div>
        </div>

        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_detail.remarks') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{ memberDetail?.memo || $t('others.empty') }}
            </div>
          </div>
        </div>
      </div>

      <div class="common-info">
        <div class="common-info__title font-bold">
          {{ $t('pages.user_delete.trainer_info') }}
        </div>

        <div class="information mt-5px">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_delete.trainer_name') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                getFullName(
                  memberDetail?.trainer?.last_name,
                  memberDetail?.trainer?.first_name
                ) || $t('others.empty')
              }}
            </div>
          </div>
        </div>

        <div class="information">
          <div class="information__item flex py-11px">
            <div
              class="information__item-label text-16px leading-24px font-medium"
            >
              {{ $t('pages.user_delete.group_name') }}
            </div>
            <div
              class="information__item-value text-16px leading-24px font-medium text-justify whitespace-pre-wrap"
            >
              {{
                memberDetail?.group?.name ||
                $t('others.empty')
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="user-detail__action">
        <FormCheckbox
          v-model="isAgree"
          :theme="theme"
          class="mt-27px group-detail__checkbox"
        >
          {{ $t('pages.user_delete.policy_delete') }}
        </FormCheckbox>
        <Button
          :type="classBtn"
          class="mt-19px"
          :class="{ disabled: !isAgree || isDelete }"
          @click="$showModal(ModalNameEnum.MESSAGE)"
        >
          {{ $t('pages.user_delete.btn_cancel') }}
        </Button>
      </div>

      <Loading
        v-if="isLoadingPage"
        :theme="theme"
        class="fixed w-full h-screen top-0 left-0 z-50"
      />

      <!-- Modal leave facility error -->
      <ModalMessage
        :id="ModalNameEnum.MESSAGE"
        :message="$t('others.title_modal_confirm')"
        :sub-message="
          $t(
            'components.modal.delete_user.msg_confirm_leave_group'
          )
        "
        :button-cancel="
          $t('components.modal.delete_user.btn_cancel')
        "
        :button-submit="
          $t('components.modal.delete_user.btn_delete')
        "
        :theme="theme"
        @click-submit="leaveFacility"
      />
      <!-- End -->

      <!-- Modal leave facility error -->
      <ModalMessage
        :id="ModalNameEnum.ALERT_SUCCESS"
        :message="$t('others.title_modal_common')"
        :sub-message="
          $t(
            'components.modal.delete_user.msg_deleted_group'
          )
        "
        :theme="theme"
        @click-submit="gotoMemberDetail"
      />
      <!-- End -->

      <!-- Modal leave facility error -->
      <ModalMessage
        :id="ModalNameEnum.ALERT_ERROR"
        :message="$t('others.title_modal_common')"
        :sub-message="errorMsg"
        :theme="theme"
        @click-submit="gotoMemberDetail"
      />
      <!-- End -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-info {
  &__title {
    font-size: $font-22;
    line-height: $font-30;
  }

  &__image {
    width: 116px;
    height: 116px;
  }

  &:not(:first-child) {
    margin-top: 60px;
  }
}

.information {
  &__item {
    border-bottom: 1px solid $color-gray-3;
  }

  &__item-label {
    min-width: 176px;
  }

  &__item-link {
    color: $color-shinseido;
  }

  @media screen and (max-width: $screen-tablet) {
    &__item-label {
      min-width: 125px;
    }
  }

  @media screen and (max-width: $screen-mobile) {
    &__item {
      display: block;

      &-label {
        padding-bottom: 5px;
        font-weight: bold;
      }
    }
  }
}
:deep(.form-checkbox) {
  @media screen and (max-width: $screen-mobile) {
    display: flex;
    align-items: flex-start;
  }
}

:deep(.form-checkbox__icon) {
  font-size: 24px;
}

:deep(.form-checkbox__text) {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  @media screen and (max-width: $screen-mobile) {
    margin-top: -3px;
  }
}
</style>
