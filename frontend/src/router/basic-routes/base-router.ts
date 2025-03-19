export const baseRouter = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/pages/Home/Home.vue'),
  },
  {
    path: '/about-us',
    name: 'About Us',
    // component: () => import('@/views/pages/AboutUs/AboutUs.vue'),
    component: () => import('@/views/pages/WIP/WorkInProgress.vue'),
  },
  {
    path: '/contacts',
    name: 'Contacts',
    // component: () => import('@/views/pages/Contacts/Contacts.vue'),
    component: () => import('@/views/pages/WIP/WorkInProgress.vue'),
  },
  {
    path: '/gdpr',
    name: 'Client section - GDPR',
    // component: () => import('@/views/pages/AboutUs/AboutUs.vue'),
    component: () => import('@/views/pages/WIP/WorkInProgress.vue'),
  },
  {
    path: '/cookies',
    name: 'Client section - Cookies',
    // component: () => import('@/views/pages/AboutUs/AboutUs.vue'),
    component: () => import('@/views/pages/WIP/WorkInProgress.vue'),
  },
]
