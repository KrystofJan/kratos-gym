export const setRoutes = (endpoint: string, endpoints: string) => {
  return {
    path: `/admin/${endpoint}}`,
    name: '',
    component: () => import(`@/views/Admin/${endpoints}/${endpoint}.vue`),
    children: [
      {
        path: `/admin/${endpoint}/list`,
        name: '',
        component: () =>
          import(`@/views/Admin/${endpoints}/list/${endpoint}-list.vue`),
      },
      {
        path: `/admin/${endpoint}/create`,
        name: '',
        component: () =>
          import(`@/views/Admin/${endpoints}/${endpoint}-form.vue`),
      },
      {
        path: `/admin/${endpoint}/update/:id`,
        name: '',
        component: () =>
          import(`@/views/Admin/${endpoints}/${endpoint}-form.vue`),
      },
    ],
  }
}
