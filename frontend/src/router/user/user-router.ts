export const userRouter = [
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/User/Profile/Profile.vue')
    },
    {
        path: '/confirm-new-account',
        name: 'Confirm New Account',
        component: () => import('@/views/User/Profile/AfterAuth.vue')
    },
]
