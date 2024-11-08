import { defineStore } from 'pinia';

/**
 * 登录认证状态
 * @author ljy
 * @lastModified 2024-10-21 by ljy
 * @param
 * @returns
 */

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('isAuthenticated'), // 从 localStorage 获取初始状态
  }),
  actions: {
    setAuthenticated(status: boolean) {
      this.isAuthenticated = status; // 设置认证状态
      localStorage.setItem('isAuthenticated', status.toString());
    },
    clearAuthenticated() {
      this.isAuthenticated = false; // 设置未认证状态
      localStorage.removeItem('isAuthenticated');
    },
  },
});
