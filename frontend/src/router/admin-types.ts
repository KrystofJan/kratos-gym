
export const typesRoutes = {
    path: '/admin/types',
    name: '',
    component: () => import('@/views/Admin/types/types.vue'),
    children: [
        {
            path: '/admin/types/list',
            name: '',
            component: () => import('@/views/Admin/types/types-list.vue'),
        },
        {
            path: '/admin/types/create',
            name: '',
            component: () => import('@/views/Admin/types/types-form.vue'),
        }
    ]
}

