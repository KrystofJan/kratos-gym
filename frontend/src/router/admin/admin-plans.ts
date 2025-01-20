
export const plansRoutes = {
    path: '/admin/plan',
    name: '',
    component: () => import('@/views/Admin/plans/plan.vue'),
    children: [
        {
            path: '/admin/plan/list',
            name: '',
            component: () => import('@/views/Admin/plans/list/plan-list.vue'),
        },
    ]
}

