<script lang="ts" setup>
import { MenuItemBase } from '@/interfaces/menu'
import { useVideo } from '@/stores/video'
import { RoleEnum } from '@/constants/role'

const videoStore = useVideo()
const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'page',
})

const isLoading = ref<Boolean>(true)

const listBreadcrumbs = ref<MenuItemBase[]>([
  {
    text: 'components.menu.home',
    route: { name: 'index' },
  },
  {
    text: 'components.menu.video_list',
    route: { name: 'app-shinseido-videos' },
  },
  {
    text: 'components.menu.video_detail',
    route: { name: '' },
  },
])

const getValueVideoDetail = async () => {
  isLoading.value = true
  await videoStore.getVideoDetail(
    route.params.videoId as string
  )
  isLoading.value = false
}

onBeforeMount(() => {
  getValueVideoDetail()
})

onMounted(() => {
  const fromLink: string | any =
    router.options?.history?.state?.back || null

  if (fromLink && fromLink.includes('/plan')) {
    listBreadcrumbs.value = []
    listBreadcrumbs.value = [
      {
        text: 'components.menu.home',
        route: { name: 'index' },
      },
      {
        text: 'components.menu.plan_list',
        route: { name: 'app-shinseido-plan' },
      },
      {
        text: 'components.menu.plan_detail',
        route: { path: fromLink },
      },
      {
        text: 'components.menu.video_detail',
        route: { name: '' },
      },
    ]
  }
})
</script>

<template>
  <PageWrapper class="flex-1 flex text-#333333">
    <PageBody class="flex-1 flex">
      <Loading
        v-if="isLoading"
        :theme="RoleEnum.ADMIN"
        class="h-100%"
      />
      <template v-else>
        <PageSection
          class="flex-1 flex flex-col"
          :list-breadcrumbs="listBreadcrumbs"
          :title-page="videoStore.videoDetail?.name"
        >
          <div class="desktop:w-3/4">
            <VideoPlayer
              :video-data="
                videoStore.videoDetail || undefined
              "
            />
            <CheckpointListBasic
              :length-check-point="
                videoStore.videoDetail?.check_points
                  .length || 0
              "
              :check-points-data="
                videoStore.videoDetail?.check_points
              "
            />
          </div>
        </PageSection>
      </template>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
