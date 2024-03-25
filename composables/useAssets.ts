import { fetch } from 'ohmyfetch'
import { useCommon } from '@/stores'

export const useAssets = () => {
  const commonStore = useCommon()

  const addressList = computed(() => {
    return commonStore?.addressList
  })
  const getAddressList = async () => {
    if (!addressList.value?.length) {
      const val = await fetch('/assets/KEN_ALL.CSV')
        .then((value: any) => {
          return value
        })
        .catch(() => {
          return 'NG'
        })
      const reader = val.body.getReader()
      const decoder = new TextDecoder()
      const result = []
      let data = ''
      let done = false

      while (!done) {
        const { value, done: readerDone } =
          await reader.read()
        done = readerDone

        const decodedValue = decoder.decode(
          value || new Uint8Array()
        )

        data += decodedValue
        const lines = data.split('\n')

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].split(',')
          const address = {
            postcode: line[2].replaceAll('"', '').trim(),
            city: line[6].replaceAll('"', '').trim(),
            address1: line[7].replaceAll('"', '').trim(),
            address2: line[8]
              .replaceAll('"', '')
              .trim()
              .split('（')[0],
          }
          result.push(address)
        }

        data = lines[lines.length - 1]
      }
      commonStore.setAddressList(result)
    }
  }

  return {
    getAddressList,
  }
}
