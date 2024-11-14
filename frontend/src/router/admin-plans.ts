
export const plansRoutes = {
    path: '/admin/plans',
    name: '',
    component: () => import('@/views/Admin/plans/plan.vue'),
    children: [
        {
            path: '/admin/plans/list',
            name: '',
            component: () => import('@/views/Admin/plans/list/plan-list.vue'),
        },
    ]
}

