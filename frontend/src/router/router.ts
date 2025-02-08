import {
  machineRoutes,
  accountRoutes,
  categoryRoutes,
  typesRoutes,
  plansRoutes,
  reservationsRoutes,
} from './admin'
import { reservationRouter } from './reservation'
import { baseRouter } from './basic-routes'
import { userRouter } from './user'

export const routes = [
  ...baseRouter,
  ...reservationRouter,
  ...userRouter,
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
    ],
  },
]
