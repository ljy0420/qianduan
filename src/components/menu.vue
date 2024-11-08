<template>
  <div class="main-menu">
    <!-- logo -->
    <div class="logo">
      <svg-icon icon-class="block" size="30px" />
      <h2 v-show="!isFold" class="title">东江财务系统</h2>
    </div>
    <!-- menu -->
    <div class="menu">
      <el-menu
        default-active="3"
        :collapse="isFold"
        text-color="#b7bdc3"
        active-text-color="#fff"
        background-color="#001529"
      >
        <el-menu-item index="1" @click="handleHomeClick">
          <svg-icon icon-class="home" size="20" />
          <span>首页</span>
        </el-menu-item>
        <template v-for="item in state.userMenus" :key="item.id">
          <template v-if="item.children && item.children.length > 0">
            <el-sub-menu :index="item.id + ''">
              <template #title>
                <svg-icon :icon-class="item.icon" size="20px" />
                <span>{{ item.name }}</span>
              </template>
              <template v-for="subitem in item.children" :key="subitem.id">
                <el-menu-item
                  :index="subitem.id + ''"
                  @click="handleItemClick(subitem)"
                >
                  <svg-icon :icon-class="subitem.icon" size="20px" />
                  <span>{{ subitem.name }}</span>
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
          <!-- <template v-else>
            <el-menu-item :index="item.id + ''" @click="handleItemClick(item)">
              <svg-icon :icon-class="item.icon" size="20px" />
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template> -->
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/Index.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
//定义props
const props = defineProps({
  isFold: {
    type: Boolean,
    default: false,
  },
  menus: Array<{
    id: number;
    name: string;
    children?: Array<{ id: number; name: string }>;
  }>,
});

const state: {
  userMenus: any;
} = reactive({
  userMenus: [],
});

// 监听 props.menus 的变化
watch(
  () => props.menus,
  (newMenus) => {
    state.userMenus = newMenus;
  },
  { immediate: true } // 确保立即执行一次以初始化 state.userMenus
);

const handleHomeClick = () => {
  router.push('/dashboard');
};

const handleItemClick = (subitem: any) => {
  // 处理子菜单项点击逻辑
  console.log('Clicked on:', subitem.path);
  // 根据需要可以进行导航、打开模态框等操作
  // 例如 Vue Router 路由导航
  router.push(subitem.path);
};
</script>

<style scoped lang="scss">
.main-menu {
  height: 100%;
  background-color: #001529;
}

.logo {
  display: flex;
  height: 28px;
  padding: 12px 10px 8px 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
  user-select: none;
}

.el-sub-menu {
  .el-menu-item {
    padding-left: 50px !important;
    background-color: #0c2135;
    width: auto;
  }
  .el-menu-item:hover {
    color: #fff;
  }
  .el-menu-item.is-active {
    background-color: #0a60bd;
  }
}

.el-menu-item {
  display: flex;
  align-items: center;
  padding-left: 20px;
  width: auto !important;

  .svg-icon {
    margin-right: 10px;
    width: 20px !important;
    height: 20px !important;
  }
}

.svg-icon {
  margin-right: 10px;
}
</style>
