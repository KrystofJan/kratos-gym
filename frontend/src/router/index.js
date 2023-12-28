import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/reservations',
        name: 'Reservations',
        component: () => import('../views/Reservation.vue')
    },
    {
        path: '/about-us',
        name: 'About Us',
        component: () => import('../views/AboutUs.vue')
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: () => import('../views/Contacts.vue')
    },
    {
        path: '/log-in',
        name: 'Log in',
        component: () => import('../views/LogIn.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
);
export default router