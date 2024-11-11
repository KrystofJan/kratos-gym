
export const reservationsRoutes = {
    path: '/admin/reservations',
    name: '',
    component: () => import('@/views/Admin/reservations/reservation.vue'),
    children: [
        {
            path: '/admin/reservations/list',
            name: '',
            component: () => import('@/views/Admin/reservations/reservation-list.vue'),
        },
        {
            path: '/admin/reservations/create',
            name: '',
            component: () => import('@/views/Admin/reservations/reservation-form.vue'),
        }
    ]
}

