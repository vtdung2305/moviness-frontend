export interface IAddress {
  postcode: string
  city: string
  address1: string
  address2: string
}
export interface ICommonState {
  showModal: boolean
  addressList: IAddress[]
}

export const useCommon = defineStore('common', {
  state: (): ICommonState => ({
    showModal: false,
    addressList: [],
  }),
  actions: {
    setStatusModal(status: boolean) {
      this.showModal = status
    },
    setAddressList(addressList: IAddress[]) {
      this.addressList = addressList
    },
  },
})
