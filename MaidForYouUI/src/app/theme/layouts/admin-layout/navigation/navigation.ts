export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'bookings-list',
    title: 'Bookings',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'list-bookings',
        title: 'List Bookings',
        type: 'item',
        classes: 'nav-item',
        url: '/bookings',
        icon: 'list',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'maids-list',
    title: 'Maids',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'list-maids',
        title: 'List Maids',
        type: 'item',
        classes: 'nav-item',
        url: '/maids',
        icon: 'team',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'customers-list',
    title: 'Customers',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'list-customers',
        title: 'List Customers',
        type: 'item',
        classes: 'nav-item',
        url: '/customers',
        icon: 'user',
        breadcrumbs: false
      }
    ]
  },
  // {
  //   id: 'authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'login',
  //       title: 'Login',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/login',
  //       icon: 'login',
  //       target: true,
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'register',
  //       title: 'Register',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/register',
  //       icon: 'profile',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  // {
  //   id: 'utilities',
  //   title: 'UI Components',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/typography',
  //       icon: 'font-size'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/color',
  //       icon: 'bg-colors'
  //     },
  //     {
  //       id: 'ant-icons',
  //       title: 'Ant Icons',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://ant.design/components/icon',
  //       icon: 'ant-design',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },

  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'About',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'chrome',
        breadcrumbs: false
      },

    ]
  }
];
