import {
  VideoParams,
  IVideoList,
  IVideo,
  ICheckPoint,
  IParamsUploadVideo,
  IVideoEdit,
} from '@/interfaces/video'
import { converSencondToMinuteSecond } from '@/helper/time'

export const useVideo = defineStore('video', {
  state: (): {
    videos: IVideoList | null
    videoDetail: IVideo | null
    timeCheckPoint: number
    checkPoints: ICheckPoint[]
    videoEdit: IVideoEdit | null
    dataUpload: IParamsUploadVideo | null
  } => ({
    videos: null,
    videoDetail: null,
    timeCheckPoint: 0,
    checkPoints: [],
    videoEdit: null,
    dataUpload: null,
  }),
  actions: {
    async getVideos(params: VideoParams) {
      try {
        const { $api } = useNuxtApp()
        const res = await $api.video.getListVideo(params)
        if (res && res.data && res.data.data) {
          const videos = {
            videoList: res.data.data,
            meta: res.data.meta,
          }
          this.videos = videos
        } else if (res.data && !res.data?.data) {
          this.videos = res.data
        }
      } catch (error) {
        throw { message: error }
      }
    },
    async getVideoDetail(id: string) {
      try {
        const { $api } = useNuxtApp()
        this.videoDetail = null
        const res = await $api.video.getVideoDetail(id)
        if (res && res.data) {
          const result = res.data
          result.check_points = result.check_points.map(
            (el: any, index: number) => ({
              ...el,
              checkpoint_time_conver:
                converSencondToMinuteSecond(
                  el.checkpoint_time
                ),
              index: index + 1,
            })
          )
          this.videoDetail = result
        }
      } catch (error) {
        throw { message: '' }
      }
    },
    async uploadVideo(params: IParamsUploadVideo) {
      try {
        const { $api } = useNuxtApp()
        const { data } = await $api.video.uploadVideo(
          params
        )
        return data
      } catch (error) {
        throw { message: '' }
      }
    },
    async editVideo(
      id: string | number,
      params: IParamsUploadVideo
    ) {
      try {
        const { $api } = useNuxtApp()
        const { data } = await $api.video.editVideo(
          id,
          params
        )
        return data
      } catch (error) {
        throw { message: '' }
      }
    },
    setTimeCheckPoint(value: number) {
      this.timeCheckPoint = value
    },
    resetCheckPoints() {
      this.checkPoints = []
    },
    addCheckPoint(value: ICheckPoint) {
      const indexValue = this.checkPoints.findIndex(
        (el) => el.checkpoint_time === value.checkpoint_time
      )
      if (indexValue > -1) {
        return this.checkPoints.splice(indexValue, 1, value)
      }
      this.checkPoints.push(value)
    },
    removeCheckPoint(value: ICheckPoint) {
      const indexValue = this.checkPoints.findIndex(
        (el) => el.checkpoint_time === value.checkpoint_time
      )
      if (indexValue > -1)
        this.checkPoints.splice(indexValue, 1)
    },
    replaceCheckPoint(value: ICheckPoint) {
      const indexValue = this.checkPoints.findIndex(
        (el) => el.checkpoint_time === value.checkpoint_time
      )
      if (indexValue > -1)
        this.checkPoints.splice(indexValue, 1, value)
    },
    setDataUpload(payload: IParamsUploadVideo) {
      this.dataUpload = payload
    },
  },
})
