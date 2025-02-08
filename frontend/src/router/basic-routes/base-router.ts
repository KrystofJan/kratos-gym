export const baseRouter = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/pages/Home/Home.vue'),
  },
  {
    path: '/about-us',
    name: 'About Us',
    component: () => import('@/views/pages/AboutUs/AboutUs.vue'),
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('@/views/pages/Contacts/Contacts.vue'),
  },
]
