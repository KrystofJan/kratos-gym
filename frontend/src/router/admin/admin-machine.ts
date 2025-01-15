
export const machineRoutes = {
    path: '/admin/machines',
    name: '',
    component: () => import('@/views/Admin/machines/machine.vue'),
    children: [
        {
            path: '/admin/machines/list',
            name: '',
            component: () => import('@/views/Admin/machines/list/machine-list.vue'),
        },
        {
            path: '/admin/machines/create',
            name: '',
            component: () => import('@/views/Admin/machines/machine-form.vue'),
        },
        {
            path: '/admin/machines/update/:id',
            name: '',
            component: () => import('@/views/Admin/machines/machine-form.vue'),
        }
    ]
}

