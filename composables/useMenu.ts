import { MenuItem, MenuUser } from '@/interfaces/menu'
import { useUser } from '@/stores/user'
import { ModalNameEnum } from '@/constants/modal'
import { RoleEnum } from '@/constants/role'
import { roles, Theme } from '@/interfaces/role'

const menusShinseido: MenuItem[] = [
  {
    text: 'components.menu.home',
    route: { name: 'app-shinseido' },
    routeActive: ['app-shinseido'],
    icon: 'icon-home',
    subMenus: [],
  },
  {
    text: 'components.menu.institution',
    route: { name: 'app-shinseido-facility' },
    routeActive: [
      'app-shinseido-facility',
      'app-shinseido-facility-id',
    ],
    icon: 'icon-office',
    subMenus: [],
  },
  {
    text: 'components.menu.trainer',
    route: { name: 'app-shinseido-trainer' },
    routeActive: [
      'app-shinseido-trainer',
      'app-shinseido-trainer-id',
    ],
    icon: 'icon-training',
    subMenus: [],
  },
  {
    text: 'components.menu.group',
    icon: 'icon-flag-star',
    route: { name: 'app-shinseido-group' },
    routeActive: [
      'app-shinseido-group',
      'app-shinseido-group-id',
    ],
    subMenus: [],
  },
  {
    text: 'components.menu.user',
    route: { name: 'app-shinseido-user' },
    routeActive: [
      'app-shinseido-user',
      'app-shinseido-user-id',
    ],
    icon: 'icon-user',
    subMenus: [],
  },
  {
    text: 'components.menu.movie',
    route: { name: '' },
    icon: 'icon-film',
    routeActive: [
      'app-shinseido-videos',
      'app-shinseido-videos-upload',
      'app-shinseido-videos-id',
      'app-shinseido-videos-id-edit',
      'app-shinseido-videos-id-edit-confirmation',
      'app-shinseido-user-id-video-videoId-evaluation-history',
    ],
    subMenus: [
      {
        text: 'components.menu.video_list',
        route: { name: 'app-shinseido-videos' },
        routeActive: ['app-shinseido-videos'],
      },
      {
        text: 'components.menu.add_video',
        route: { name: 'app-shinseido-videos-upload' },
        routeActive: ['app-shinseido-videos-upload'],
      },
    ],
  },
  {
    text: 'components.menu.plan',
    route: { name: 'app-shinseido-plan' },
    routeActive: [
      'app-shinseido-plan',
      'app-shinseido-plan-id',
      'app-shinseido-plan-id-edit',
      'app-shinseido-plan-id-edit-confirmation',
    ],
    icon: 'icon-crown',
    subMenus: [],
  },
]

const menusKanrisha: MenuItem[] = [
  {
    text: 'components.menu.home',
    route: { name: 'app-kanrisha' },
    routeActive: ['app-kanrisha'],
    icon: 'icon-home',
    subMenus: [],
  },
  {
    text: 'components.menu.trainer',
    route: { name: '' },
    routeActive: [
      'app-kanrisha-trainer',
      'app-kanrisha-trainer-registration',
      'app-kanrisha-trainer-id',
      'app-kanrisha-trainer-id-trainer-transfer-confirmation',
    ],
    icon: 'icon-training',
    subMenus: [
      {
        text: 'components.menu.trainer_list',
        route: {
          name: 'app-kanrisha-trainer',
        },
      },
      {
        text: 'components.menu.trainer_registration',
        route: {
          name: 'app-kanrisha-trainer-registration',
        },
        routeActive: ['app-kanrisha-trainer-registration'],
      },
    ],
  },
  {
    text: 'components.menu.group',
    route: { name: '' },
    routeActive: [
      'app-kanrisha-group',
      'app-kanrisha-group-id',
      'app-kanrisha-group-id-delete',
      'app-kanrisha-group-registration',
      'app-kanrisha-group-registration-confirmation',
      'app-kanrisha-group-id-edit',
      'app-kanrisha-group-id-edit-confirmation',
    ],
    icon: 'icon-flag-star',
    subMenus: [
      {
        text: 'components.menu.group_list',
        route: { name: 'app-kanrisha-group' },
        routeActive: ['app-kanrisha-group'],
      },
      {
        text: 'components.menu.group_registration',
        route: { name: 'app-kanrisha-group-registration' },
        routeActive: [
          'app-kanrisha-group-registration',
          'app-kanrisha-group-registration-confirmation',
        ],
      },
    ],
  },
  {
    text: 'components.menu.user',
    route: { name: '' },
    icon: 'icon-user',
    routeActive: [
      'app-kanrisha-user-registration',
      'app-kanrisha-user-registration-confirmation',
      'app-kanrisha-user',
      'app-kanrisha-user-id',
      'app-kanrisha-user-id-user-edit',
      'app-kanrisha-user-id-user-edit-confirmation',
      'app-kanrisha-user-id-video-videoId-evaluation-history',
    ],
    subMenus: [
      {
        text: 'components.menu.user_list',
        route: { name: 'app-kanrisha-user' },
        routeActive: ['app-kanrisha-user'],
      },
      {
        text: 'components.menu.user_registration',
        route: { name: 'app-kanrisha-user-registration' },
        routeActive: [
          'app-kanrisha-user-registration',
          'app-kanrisha-user-registration-confirmation',
        ],
      },
    ],
  },
  {
    text: 'components.menu.plan',
    route: { name: 'app-kanrisha-plan' },
    routeActive: [
      'app-kanrisha-plan',
      'app-kanrisha-plan-id',
      'app-kanrisha-plan-id-upgrade',
      'app-kanrisha-plan-id-video-videoId',
    ],
    icon: 'icon-crown',
    subMenus: [],
  },
]

const menusTrainer: MenuItem[] = [
  {
    text: 'components.menu.home',
    route: { name: 'app-trainer' },
    routeActive: ['app-trainer'],
    icon: 'icon-home',
    subMenus: [],
  },
  {
    text: 'components.menu.group',
    route: { name: '' },
    routeActive: [
      'app-trainer-group',
      'app-trainer-group-id',
      'app-trainer-group-id-delete',
      'app-trainer-group-registration',
      'app-trainer-group-registration-confirmation',
      'app-trainer-group-id-edit',
      'app-trainer-group-id-edit-confirmation',
    ],
    icon: 'icon-flag-star',
    subMenus: [
      {
        text: 'components.menu.group_list',
        route: { name: 'app-trainer-group' },
        routeActive: ['app-trainer-group'],
      },
      {
        text: 'components.menu.group_registration',
        route: { name: 'app-trainer-group-registration' },
        routeActive: [
          'app-trainer-group-registration',
          'app-trainer-group-registration-confirmation',
        ],
      },
    ],
  },
  {
    text: 'components.menu.user',
    route: { name: '' },
    icon: 'icon-user',
    routeActive: [
      'app-trainer-user-registration',
      'app-trainer-user-registration-confirmation',
      'app-trainer-user',
      'app-trainer-user-id',
      'app-trainer-user-id-user-edit',
      'app-trainer-user-id-user-edit-confirmation',
      'app-trainer-user-id-video-videoId-evaluation-movement',
      'app-trainer-user-id-video-videoId-evaluation-history',
      'app-trainer-user-id-leave-facility',
    ],
    subMenus: [
      {
        text: 'components.menu.user_list',
        route: { name: 'app-trainer-user' },
        routeActive: ['app-trainer-user'],
      },
      {
        text: 'components.menu.user_registration',
        route: { name: 'app-trainer-user-registration' },
        routeActive: [
          'app-trainer-user-registration',
          'app-trainer-user-registration-confirmation',
        ],
      },
    ],
  },
]

export const useMenu = () => {
  const { t } = useLang()
  const { getFullName } = useHelper()
  const userStore = useUser()

  const menusUser: MenuUser[] = [
    {
      text: 'components.menu.setting',
      icon: 'icon-user',
      route: { name: `app-${userStore.roleName}-setting` },
    },
    {
      text: 'components.menu.change_password',
      icon: 'icon-lock',
      route: {
        name: `app-${userStore.roleName}-change-password`,
      },
    },
    {
      text: 'components.menu.logout',
      icon: 'icon-power',
      onClick: () => {
        const { $showModal } = useNuxtApp()
        try {
          $showModal(ModalNameEnum.LOGOUT)
        } catch (error) {}
      },
    },
  ]

  const roleId = computed(() => userStore.userData?.role)
  const userName = computed(() => {
    return userStore.userData
      ? getFullName(
          userStore.userData.last_name,
          userStore.userData.first_name
        )
      : t('others.empty')
  })
  const userAvatar = computed(() => {
    return userStore.userData?.avatar
      ? userStore.userData?.url_avatar
      : '/images/avatar-default.png'
  })
  const role = computed(() => {
    const route = useRoute()
    return roles.includes(route.path.split('/')[2] as Theme)
      ? route.path.split('/')[2]
      : userStore.roleName
  })

  const menus = computed(() => {
    if (roleId.value === RoleEnum.ADMINISTRANTOR_ID) {
      return menusShinseido
    } else if (roleId.value === RoleEnum.ADMIN_ID) {
      return menusKanrisha
    } else {
      return menusTrainer
    }
  })

  return { role, menus, menusUser, userName, userAvatar }
}
