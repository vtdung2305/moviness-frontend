import HttpFactory from '../http-factory'
import {
  VideoParams,
  IParamsUploadVideo,
} from '@/interfaces/video'
class VideoModule extends HttpFactory {
  private config = useRuntimeConfig()
  async getListVideo(
    params: VideoParams
  ): Promise<Object | null | any> {
    const { serialize } = useHelper()
    return await this.call<Object | null | any>(
      'GET',
      `administrator${
        this.config.public.apiVer
      }/videos/?${serialize(params)}`
    )
  }

  async getVideoDetail(
    id: string
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/videos/${id}`
    )
  }

  async uploadVideo(
    params: IParamsUploadVideo
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `administrator${this.config.public.apiVer}/videos`,
      params
    )
  }

  async editVideo(
    id: string | number,
    params: IParamsUploadVideo
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `administrator${this.config.public.apiVer}/videos/${id}`,
      params
    )
  }
}

export default VideoModule
