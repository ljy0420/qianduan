<template>
  <div class="main">
    <el-container class="main-content">
      <el-aside :width="isFold ? '60px' : '210px'">
        <Menu :is-fold="isFold" :menus="filteredMenus" />
      </el-aside>
      <el-container>
        <el-header height="50px">
          <Header @fold-change="handleFoldChange" />
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Header from '@/components/header.vue';
import Menu from '@/components/menu.vue';
import { useUserStoreHook } from '@/store/modules/user';
import { rolePermissions } from '@/store/modules/rolePermissions';
import { userMenus, updateUserMenus } from '@/store/eventBus'; // 引入事件总线

const isFold = ref(false);
const userStore = useUserStoreHook();

const loadUserMenus = () => {
  const data = localStorage.getItem('userMenus');
  if (data) {
    updateUserMenus(JSON.parse(data)); // 使用事件总线更新菜单数据
  }
};

onMounted(() => {
  loadUserMenus();
  userStore.fetchUserInfo();
});

const filteredMenus = computed(() => {
  const roles = userStore.roles; // 假设角色信息在 userStore 中
  return userMenus.value
    .map((menu) => {
      if (menu.children) {
        menu.children = menu.children.filter((menuitem: any) =>
          hasPermission(menuitem, roles)
        );
      }
      const hasMenuPermission = hasPermission(menu, roles);
      if (hasMenuPermission || (menu.children && menu.children.length > 0)) {
        return menu;
      }
      return null;
    })
    .filter((menu) => menu !== null);
});

const hasPermission = (menu: any, roles: any[]) => {
  return roles.some((role) => rolePermissions[role.name]?.includes(menu.path));
};

const handleFoldChange = (flag: boolean) => {
  isFold.value = flag;
};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
}

.main-content {
  height: 100%;
  .el-aside {
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 200px;
    text-align: left;
    cursor: pointer;
    background-color: #001529;
    scrollbar-width: none;
    -ms-overflow-style: none;
    transition: width 0.3s ease;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  .el-main {
    background-color: rgb(236, 234, 232);
  }
}
</style>
