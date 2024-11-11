
import { createRouter, createWebHistory } from 'vue-router';
import { machineRoutes } from './admin-machine';
import { accountRoutes } from './admin-account';
import { categoryRoutes } from './admin-category';
import { typesRoutes } from './admin-types';
import { plansRoutes } from './admin-plans';
import { reservation } from '@/store/ReservationStore';
import { reservationsRoutes } from './admin-reservation';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/pages/Home/Home.vue')
    },
    {
        path: '/reservations',
        name: 'Reservations',
        component: () => import('@/views/pages/Reservation/Reservation.vue')
    },
    {
        path: '/about-us',
        name: 'About Us',
        component: () => import('@/views/pages/AboutUs/AboutUs.vue')
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: () => import('@/views/pages/Contacts/Contacts.vue')
    },
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
    {
        path: '/reservation/:id',
        name: 'Form Test',
        component: () => import('@/components/Reservation/Detail.vue')
    },
    {
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
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
);
export default router
