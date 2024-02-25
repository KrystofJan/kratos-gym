import {createRouter, createWebHistory} from 'vue-router';

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
        path: '/log-in',
        name: 'Log in',
        component: () => import('@/views/User/LogIn/LogIn.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/User/Register/Register.vue')
    },
    {
        path: '/form-test',
        name: 'Form Test',
        component: () => import('@/views/pages/FormKitTest/FormKitTest.vue')
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
);
export default router