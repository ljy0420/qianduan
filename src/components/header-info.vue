<template>
  <div class="header-info">
    <!-- 操作图标 -->
    <div class="operation">
      <span>
        <el-icon><i-ep-Message /> </el-icon>
      </span>
      <span>
        <span class="dot"></span>
        <el-icon><i-ep-ChatDotRound /> </el-icon>
      </span>
      <span>
        <el-icon><i-ep-Search /> </el-icon>
      </span>
    </div>
    <!-- 个人信息 -->
    <div class="info">
      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="user-info">
            <el-avatar
              :size="30"
              src="https://img1.baidu.com/it/u=4081570746,311001242&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
            />
            <span class="name">coderwhy</span>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleExitClick">
              <el-icon><i-ep-CircleClose /></el-icon>
              <span>退出系统</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon><i-ep-InfoFilled /></el-icon>
              <span>个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><i-ep-Unlock /></el-icon>
              <span>修改密码</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useUserStoreHook } from '@/store/modules/user';
import { useRouter } from 'vue-router';
// 获取用户存储
const userStore = useUserStoreHook();
//获取认证状态
const authStore = useAuthStore();
//获取路由实例
const router = useRouter();
const handleExitClick = () => {
  userStore.clearUserInfo(); //清除用户信息
  userStore.clearToken(); // 清除 token
  authStore.clearAuthenticated(); // 设置为未认证
  router.push('/login');
};
</script>

<style scoped lang="scss">
.header-info {
  display: flex;
  align-items: center;
}
.operation {
  display: inline-flex;
  margin-right: 20px;
  span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 35px;

    &:hover {
      background-color: #f2f2f2;
    }

    i {
      font-size: 20px;
    }

    .dot {
      position: absolute;
      top: 3px;
      right: 3px;
      z-index: 10;
      width: 6px;
      height: 6px;
      background: red;
      border-radius: 100%;
    }
  }
}
.info {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    .name {
      margin-left: 5px;
    }
  }
}

.info {
  :global(.el-dropdown-menu__item) {
    line-height: 36px !important;
    padding: 6px 22px;
  }
}
</style>
