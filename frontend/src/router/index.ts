
import { createRouter, createWebHistory } from 'vue-router';

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
        component: () => import('../views/pages/APIResolve/AfterAuth.vue')
    },
    {
        path: '/form-test',
        name: 'Form Test',
        component: () => import('@/views/pages/FormKitTest/FormKitTest.vue')
    },

    {
        path: '/reservation/:id',
        name: 'Form Test',
        component: () => import('@/components/Reservation/Detail.vue')
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
);
export default router
