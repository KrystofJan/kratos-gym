
export const accountRoutes = {
    path: '/admin/account',
    name: '',
    component: () => import('@/views/Admin/account/account.vue'),
    children: [
        {
            path: '/admin/account/list',
            name: '',
            component: () => import('@/views/Admin/account/account-list.vue'),
        },
    ]
}

