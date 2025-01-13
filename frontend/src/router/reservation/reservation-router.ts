export const reservationRouter = [
    {
        path: '/reservations',
        name: 'Reservations',
        component: () => import('@/views/pages/Reservation/Reservation.vue')
    },
    {
        path: '/reservation/:id',
        name: 'Form Test',
        component: () => import('@/components/Reservation/ReservationDetail.vue')
    },

]
