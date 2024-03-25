import { useUploadFile } from '@/stores/upload'

export const useUpload = () => {
  const uploadStore = useUploadFile()

  const uploadFile = async (file: File) => {
    try {
      const res = await uploadStore.getPresignedUrl(
        file.name
      )
      if (res) {
        const url = res.data?.url
        const result = await uploadStore.uploadFile(
          file,
          url
        )
        if (result === 'OK') {
          return res.data?.path
        }
      }
      return 'ERROR'
    } catch (e) {}
    return 'ERROR'
  }

  return { uploadFile }
}
