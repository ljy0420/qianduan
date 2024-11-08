import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoutes } from './routes'; // 导入路由配置
import { useAuthStore } from '@/store/auth'; // 导入状态管理
import { useUserStoreHook } from '@/store/modules/user';
import { rolePermissions } from '@/store/modules/rolePermissions';

/**
 * 创建路由
 */

const router = createRouter({
  history: createWebHashHistory(), // 使用 HTML5 历史模式
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }), // 刷新时，滚动条位置还原
});

/**
 * 添加全局路由守卫
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // 获取状态管理实例
  const userStore = useUserStoreHook(); //获取用户状态实例
  const isAuthenticated = authStore.isAuthenticated;

  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    if (isAuthenticated) {
      userStore.initialize(); // 确保初始化动态路由
      // 获取用户的角色
      const roles = userStore.roles;
      const path = to.path.startsWith('/') ? to.path.slice(1) : to.path;
      console.log(roles);
      next();
      // // 角色权限检查逻辑
      // const isAccessible = roles.some((role: any) =>
      //   rolePermissions[role.name]?.includes(path)
      // );
      // if (isAccessible) {
      //   localStorage.setItem('currentPath', to.path); // 存储当前路径
      //   next();
      // } else {
      //   next({ name: 'Unauthorized' }); // 如果没有权限，跳转到未授权页面
      // }
    } else {
      next();
    }
  }
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' });
  location.reload();
}

export default router;
