export const useUploadFile = defineStore('upload', {
  actions: {
    async getPresignedUrl(filename: string) {
      const { $api } = useNuxtApp()
      return await $api.upload.getPresignedUrl(filename)
    },

    async uploadFile(file: File, url: string) {
      const { $api } = useNuxtApp()
      return await $api.upload.upload(file, url)
    },
  },
})
