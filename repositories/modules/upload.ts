import { $fetch } from 'ohmyfetch'
import HttpFactory from '../http-factory'
class UploadModule extends HttpFactory {
  private config = useRuntimeConfig()

  async getPresignedUrl(filename: string) {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/uploads/presigned-url`,
      { file_name: filename }
    )
  }

  upload(
    file: File,
    url: string
  ): Promise<Object[] | null | any> {
    const headersOption = new Headers()
    headersOption.set('Content-Type', file.type)
    return $fetch(url, {
      method: 'PUT',
      body: file,
      headers: headersOption,
    })
      .then(() => {
        return 'OK'
      })
      .catch(() => {
        return 'NG'
      })
  }
}

export default UploadModule
