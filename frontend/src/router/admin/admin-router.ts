
import {
    machineRoutes,
    accountRoutes,
    categoryRoutes,
    typesRoutes,
    plansRoutes,
    reservationsRoutes,
} from '.'
export const adminRouter = {
    path: '/admin',
    name: 'Administration',
    component: () => import('@/views/Admin/Admin.vue'),
    children: [
        {
            path: '/admin/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/Admin/Dashboard.vue'),
        },
        machineRoutes,
        accountRoutes,
        categoryRoutes,
        typesRoutes,
        plansRoutes,
        reservationsRoutes,
    ]
}
