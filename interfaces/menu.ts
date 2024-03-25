export interface MenuItemBase {
  text: string
  route?: any
  routeActive?: string[]
  action?: () => void
}

export interface MenuItem extends MenuItemBase {
  icon: string
  subMenus: Array<MenuItemBase>
}

export interface MenuUser {
  text: string
  action?: any
  route?: any
  icon: string
  onClick?(): void
}
