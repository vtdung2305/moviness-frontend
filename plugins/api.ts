import { $fetch, FetchOptions } from 'ohmyfetch'
import { defineNuxtPlugin } from '#app'
import AuthModule from '@/repositories/modules/auth'
import VideoModule from '@/repositories/modules/video'
import FacilityModule from '@/repositories/modules/facility'
import GroupModule from '@/repositories/modules/group'
import PlanModule from '@/repositories/modules/plan'
import TrainerModule from '@/repositories/modules/trainer'
import UploadModule from '@/repositories/modules/upload'
import MemberModule from '@/repositories/modules/member'

interface IApiInstance {
  auth: AuthModule
  group: GroupModule
  video: VideoModule
  facility: FacilityModule
  plan: PlanModule
  trainer: TrainerModule
  upload: UploadModule
  member: MemberModule
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {}

  const apiFetcher = $fetch.create(fetchOptions)

  const modules: IApiInstance = {
    auth: new AuthModule(apiFetcher),
    video: new VideoModule(apiFetcher),
    facility: new FacilityModule(apiFetcher),
    group: new GroupModule(apiFetcher),
    plan: new PlanModule(apiFetcher),
    trainer: new TrainerModule(apiFetcher),
    upload: new UploadModule(apiFetcher),
    member: new MemberModule(apiFetcher),
  }

  return {
    provide: {
      api: modules,
    },
  }
})
