import moment from 'moment'
import { useFacility } from '@/stores/facility'
import {
  PlanUpgradeEnum,
  PlanInfoEnum,
} from '@/constants/plan'
import { FormatDateEnum } from '@/constants/common'

export const usePlanUpgrade = () => {
  const facilityStore = useFacility()
  const route = useRoute()
  const { plansData } = usePlanEdit()
  const { t } = useLang()

  const usePeriod = computed(() => {
    const currentPlan =
      facilityStore.facilityDetail?.plan?.id
    const upgradePlan = Number(route?.params?.id)

    const planUpgrade = upgradeInfo(
      currentPlan as number,
      upgradePlan as number
    )

    const expiryDatePlan = calcExpiryDatePlan(
      planUpgrade as number
    )
    return expiryDatePlan
  })

  const statistic = computed(
    () => facilityStore.facilityStatistic?.statistic
  )

  const isAllowUpgrade = computed(() => {
    const currentPlanId =
      facilityStore.facilityDetail?.plan?.id
    const upgradePlanId = Number(route.params.id)

    const planUpgrade = PlanInfoEnum.find(
      (e) => e.id === upgradePlanId
    )

    const checkPlan = upgradeInfo(
      currentPlanId as number,
      upgradePlanId as number
    )

    if (checkPlan !== PlanUpgradeEnum.DOWNGRAGE) return true
    if (!statistic.value || !planUpgrade) return false
    return (
      statistic.value?.total_group_available <=
        planUpgrade.max_group_count &&
      statistic.value?.total_trainer_available <=
        planUpgrade.max_trainer_count &&
      statistic.value?.total_member_available <=
        planUpgrade.max_member_count
    )
  })

  const msgDownGrade = computed(() => {
    const upgradePlanId = Number(route.params.id)
    const planUpgrade = PlanInfoEnum.find(
      (e) => e.id === upgradePlanId
    )
    const currentPlan = facilityStore.facilityDetail?.plan

    if (
      !statistic.value ||
      !planUpgrade ||
      isAllowUpgrade.value
    )
      return null
    // trainer
    if (
      statistic.value?.total_trainer_available >
      planUpgrade.max_trainer_count
    ) {
      return t('pages.plan_upgrade.msg_downgrade_trainer', {
        plan_name: currentPlan?.name,
        num1: statistic.value?.total_trainer_available,
        num2: planUpgrade.max_trainer_count,
      })
    }
    // member
    if (
      statistic.value?.total_member_available >
      planUpgrade.max_member_count
    ) {
      return t('pages.plan_upgrade.msg_downgrade_member', {
        plan_name: currentPlan?.name,
        num1: statistic.value?.total_member_available,
        num2: planUpgrade.max_member_count,
      })
    }
    // group
    if (
      statistic.value?.total_group_available >
      planUpgrade.max_group_count
    ) {
      return t('pages.plan_upgrade.msg_downgrade_group', {
        plan_name: currentPlan?.name,
        num1: statistic.value?.total_group_available,
        num2: planUpgrade.max_group_count,
      })
    }
  })

  const upgradeInfo = (
    currentPlanId: number,
    upgradePlanId: number
  ): number => {
    if (upgradePlanId === currentPlanId) {
      return PlanUpgradeEnum.EXTEND
    } else if (upgradePlanId > currentPlanId) {
      return PlanUpgradeEnum.UPGRADE
    } else {
      return PlanUpgradeEnum.DOWNGRAGE
    }
  }

  const calcExpiryDatePlan = (
    upgradePlan: number
  ): string => {
    const expiryDateFacility =
      facilityStore.facilityDetail?.plan_expire_at
    if (upgradePlan === PlanUpgradeEnum.EXTEND) {
      return moment(expiryDateFacility)
        .add(plansData.value?.time_plan_duration, 'days')
        .format(FormatDateEnum.FORMAT_NORMAL)
    } else {
      return moment()
        .add(plansData.value?.time_plan_duration, 'days')
        .format(FormatDateEnum.FORMAT_NORMAL)
    }
  }
  return { usePeriod, isAllowUpgrade, msgDownGrade }
}
