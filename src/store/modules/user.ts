import { getMenus, login, userinfo } from '@/api';
import { LoginData } from '@/api/auth/types';
import router from '@/router';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { rolePermissions } from './rolePermissions';
/**
 * 用户相关
 * @author ljy
 * @lastModified 2024-10-21 by ljy
 * @param {LoginData}
 * @returns
 */

const state: {
  rolePermissions: any;
  userMenus: any;
  userMenus2: any;
} = reactive({
  rolePermissions: rolePermissions,
  userMenus2: {
    role: [
      {
        id: 2,
        name: 'user',
        nameZh: '用户',
        creatime: '1993-09-30 22:42:36',
        updateTime: '2000-06-20 01:09:21',
        createUser: 11,
        updateUser: 22,
        isDelete: true,
      },
    ],
    menu: [
      {
        id: 1,
        pid: null,
        name: '首页',
        icon: 'home',
        path: 'dashboard',
        pagePath: '',
        parentPagePath: '',
        description: '',
      },
      {
        id: 2,
        pid: null,
        name: '用户相关',
        icon: 'user',
        path: '',
        pagePath: '',
        parentPagePath: '',
        description: '',
        children: [
          {
            id: 22,
            pid: 2,
            name: '部门管理',
            icon: '',
            path: 'department',
            pagePath: '',
            parentPagePath: 'user',
            description: '',
          },
        ],
      },
    ],
  },
  userMenus: {
    role: [
      {
        id: 1,
        name: 'admin',
        nameZh: '超级管理员',
        creatime: '1993-09-30 22:42:36',
        updateTime: '2000-06-20 01:09:21',
        createUser: 25,
        updateUser: 59,
        isDelete: true,
      },
      // {
      //   id: 2,
      //   name: 'user',
      //   nameZh: '用户',
      //   creatime: '1993-09-30 22:42:36',
      //   updateTime: '2000-06-20 01:09:21',
      //   createUser: 11,
      //   updateUser: 22,
      //   isDelete: true,
      // },
    ],
    menu: [
      // {
      //   id: 1,
      //   pid: 11,
      //   name: '首页',
      //   icon: 'home',
      //   path: 'dashboard',
      //   pagePath: '',
      //   parentPagePath: '',
      //   description: '',
      // },
      {
        id: 2,
        pid: null,
        name: '用户相关',
        icon: 'user',
        path: '',
        pagePath: '',
        parentPagePath: '',
        description: '',
        children: [
          {
            id: 22,
            pid: 2,
            name: '部门管理',
            icon: '',
            path: 'department',
            pagePath: '',
            parentPagePath: 'user',
            description: '',
          },
          {
            id: 23,
            pid: 2,
            name: '用户管理',
            icon: '',
            path: 'userManage',
            pagePath: '',
            parentPagePath: 'user',
            description: '',
          },
          {
            id: 24,
            pid: 2,
            name: '角色管理',
            icon: '',
            path: 'roleManage',
            pagePath: '',
            parentPagePath: 'user',
            description: '',
          },
          {
            id: 25,
            pid: 2,
            name: '菜单管理',
            icon: '',
            path: 'menuManage',
            pagePath: '',
            parentPagePath: 'user',
            description: '',
          },
        ],
      },
      {
        id: 3,
        pid: null,
        name: '财务管理',
        icon: 'finance',
        path: '',
        pagePath: '',
        parentPagePath: '',
        description: '',
        children: [
          {
            id: 26,
            pid: 3,
            name: '差旅费报销单',
            icon: '',
            path: 'orderTour',
            pagePath: '',
            parentPagePath: 'financial',
            description: '',
          },
          {
            id: 27,
            pid: 3,
            name: '发票',
            icon: '',
            path: 'invoice',
            pagePath: '',
            parentPagePath: 'financial',
            description: '',
          },
          {
            id: 28,
            pid: 3,
            name: '费用报销单',
            icon: '',
            path: 'orderManage',
            pagePath: '',
            parentPagePath: 'financial',
            description: '',
          },
          {
            id: 29,
            pid: 3,
            name: '审批',
            icon: '',
            path: 'approval',
            pagePath: '',
            parentPagePath: 'financial',
            description: '',
          },
        ],
      },
    ],
  },
});

export const useUserStoreHook = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '', //从localStorage中获取token
    isAuthenticated: !!localStorage.getItem('isAuthenticated'), // 从 localStorage 获取初始认证状态
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'), // 从 localStorage 获取用户信息
    userMenus: JSON.parse(localStorage.getItem('userMenus') || '[]'), // 从 localStorage 获取菜单信息
    roles: JSON.parse(localStorage.getItem('roles') || '[]'), // 从 localStorage 获取角色信息
  }),
  getters: {
    isLoggedIn: (state) => !!state.token, // 判断用户是否已登录
  },
  actions: {
    // 存储token
    setToken(newToken: string) {
      this.token = newToken;
      this.isAuthenticated = true;
      localStorage.setItem('token', newToken);
    },
    // 清除token
    clearToken() {
      this.token = '';
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    // 存储userInfo
    setUserInfo(info: any) {
      this.userInfo = info;
      localStorage.setItem('userInfo', JSON.stringify(info));
    },
    // 清除userInfo
    clearUserInfo() {
      this.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    // 存储userMenus
    setUserMenus(menus: any) {
      this.userMenus = menus;
      localStorage.setItem('userMenus', JSON.stringify(menus));
    },
    // 清空userMenus
    clearUserMenus() {
      this.userMenus = [];
      localStorage.removeItem('userMenus');
    },
    setRoles(roles: any) {
      this.roles = roles;
      localStorage.setItem('roles', JSON.stringify(roles));
    },
    clearRoles() {
      this.roles = [];
      localStorage.removeItem('roles');
    },
    // 获取Token
    getTokenAUTH() {
      return localStorage.getItem('token');
    },
    // 登录
    async login(loginData: LoginData) {
      try {
        const response = await login(loginData);
        const accessToken = response.map.token;
        this.setToken(`${accessToken}`); // 更新 token 状态
        // 获取用户信息和菜单
        await this.fetchUserInfo();
        // 设置初始跳转路径
        // 存储初始路径
        localStorage.setItem('currentPath', router.currentRoute.value.path);
      } catch (error) {
        throw error; // 抛出错误以便外部捕获
      }
    },
    // 页面初始化
    initialize() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userInfo = localStorage.getItem('userInfo');
        const userMenus = localStorage.getItem('userMenus');
        const roles = localStorage.getItem('roles');
        if (userInfo) {
          this.userInfo = JSON.parse(userInfo);
        }
        if (userMenus) {
          this.userMenus = JSON.parse(userMenus);
          this.generateRoutes(this.userMenus, this.roles); // 初始化时生成动态路由
        }
        if (roles) {
          this.roles = JSON.parse(roles);
        }
      }
    },
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const userInfoResponse = await userinfo(''); // 调用用户信息接口
        // const menusResponse = await getMenus(''); // 调用菜单接口
        const userInfo = userInfoResponse.data;

        this.setUserInfo(userInfo); // 存储用户信息
        const menus = state.userMenus.menu;
        const roles = state.userMenus.role;

        this.setUserMenus(menus); //存储用户菜单
        this.setRoles(roles); // 存储用户角色信息

        this.generateRoutes(this.userMenus, this.roles); // 生成动态路由
      } catch (error) {
        console.error('Failed to fetch user info or menus:', error);
      }
    },
    // 动态生成路由
    generateRoutes(menus: any, roles: any) {
      const dynamicRoutes: Array<RouteRecordRaw> = [];

      // 递归生成动态路由
      const generate = (menuItems: any[]) => {
        menuItems.forEach((menu) => {
          if (
            menu.path &&
            roles.some((role: any) =>
              state.rolePermissions[role.name]?.includes(menu.path)
            )
          ) {
            // console.log(menu);

            // 如果父页面路径为空或者不存在父页面路径
            if (menu.parentPagePath === '' || !menu.parentPagePath) {
              const route: RouteRecordRaw = {
                path: menu.path,
                name: menu.name,
                component: () => import(`@/views/${menu.path}/index.vue`), // 假设你的页面组件路径是 views 目录下的文件
              };
              dynamicRoutes.push(route);
            } else {
              const route: RouteRecordRaw = {
                path: menu.path,
                name: menu.name,
                component: () =>
                  import(
                    `@/views/${menu.parentPagePath}/${menu.path}/index.vue`
                  ), // 假设你的页面组件路径是 views 目录下的文件
                meta: { breadcrumb: menu.name }, // 动态生成面包屑
              };
              dynamicRoutes.push(route);
            }
          }
          // 如果菜单有子属性且子属性数组长度大于0
          if (menu.children && menu.children.length > 0) {
            generate(menu.children);
          }
        });
      };

      generate(menus);

      // 将动态路由添加到基础路由的 children 中
      const layoutRoute = router
        .getRoutes()
        .find((route) => route.name === 'Layout');
      if (layoutRoute) {
        layoutRoute.children = dynamicRoutes;
      }

      // 添加动态路由到路由器
      dynamicRoutes.forEach((route) => {
        router.addRoute('Layout', route); // 使用 'Layout' 作为父路由的名称
      });
      // const routes = router.getRoutes();
      // console.log(routes);
    },
  },
});
