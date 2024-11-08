// 创建一个响应式的菜单数据引用
export const userMenus = ref<any[]>([]);

// 创建一个函数来更新菜单数据
export const updateUserMenus = (newMenus: any[]) => {
  userMenus.value = newMenus;
};
