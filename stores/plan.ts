import {
  IPlan,
  IPlanState,
  IPlanStatisticInfo,
} from '@/interfaces/plan'
import { IVideo, IVideoList } from '@/interfaces/video'

export const usePlan = defineStore('plan', {
  state: (): {
    planList: IPlan[]
    videoList: IVideo[]
    planDetail: IPlan | null
    statisticInfo: IPlanStatisticInfo | null
  } => ({
    planList: [],
    videoList: [],
    planDetail: null,
    statisticInfo: null,
  }),

  actions: {
    async getPlanList() {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.plan.getPlanList()
        if (res && res.data) {
          this.planList = res.data
        }
      } catch (error) {}
    },

    async getPlanListAvailable() {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.plan.getPlanListAvailable()
        if (res && res.data) {
          this.planList = res.data
        }
      } catch (error) {}
    },

    async getPlanDetail(id: string) {
      const router = useRouter()
      try {
        const { $api } = useNuxtApp()
        const res = await $api.plan.getPlanDetail(id)
        if (res && res.data) {
          this.planDetail = res.data
        }
      } catch (error) {
        router.push('/404')
      }
    },

    async getVideoByPlan(id: string, params: any) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.plan.getVideoListByPlan(
          id,
          params
        )
        if (res && res.data) {
          this.videoList = res.data
        }
      } catch (error) {}
    },

    async getStatisticBySuperAdmin() {
      try {
        const { $api } = useNuxtApp()
        const res =
          await $api.plan.getStatisticBySuperAdmin()
        if (res && res.data) {
          // console.log(res.data)

          this.statisticInfo = res.data
        }
      } catch (error) {}
    },

    addVideoListToPlan(videos: IVideoList | any) {
      this.videoList.push(...videos)
      this.videoList.forEach((item, index) => {
        item.order = index
      })
    },

    updateVideoListToPlan(videos: IVideoList | any) {
      this.videoList = videos
    },

    removeVideoListToPlan(videoId: number | any) {
      this.videoList.splice(
        this.videoList.indexOf(videoId),
        1
      )
      this.videoList.forEach((item, index) => {
        item.order = index
      })
    },

    updatePlanById(plan: IPlan) {
      this.planDetail = plan
    },
  },
  getters: {},
})
