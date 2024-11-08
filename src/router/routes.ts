import { RouteRecordRaw } from 'vue-router';

// 定义静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard', // 重定向到 dashboard 路由
    component: () => import('@/layout/index.vue'), // 假设你的布局组件是 Layout.vue
    meta: { breadcrumb: '首页' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'), // 登录页面
        name: 'Dashboard',
      },
    ], // 动态路由将添加到这里
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'), // 登录页面
    name: 'Login',
    meta: { title: '登录' },
  },
  // 其他路由...
];
