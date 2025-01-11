
export const categoryRoutes = {
    path: '/admin/category',
    name: '',
    component: () => import('@/views/Admin/categories/category.vue'),
    children: [
        {
            path: '/admin/category/list',
            name: '',
            component: () => import('@/views/Admin/categories/list/category-list.vue'),
        },
        {
            path: '/admin/category/create',
            name: '',
            component: () => import('@/views/Admin/categories/category-form.vue'),
        }
    ]
}

