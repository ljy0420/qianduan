<template>
  <div class="login-panel">
    <!-- 顶部标题 -->
    <h1 class="title">东江财务管理系统</h1>
    <!-- 中间的tab切换 -->
    <div class="tabs">
      <el-tabs v-model="activeName" type="border-card" stretch>
        <!-- 用户登录 -->
        <el-tab-pane label="登录" class="tab" name="login">
          <LoginView ref="loginRef" />
        </el-tab-pane>
        <!-- 用户注册 -->
        <el-tab-pane label="注册" class="tab" name="register">
          <RegisterView />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 登录底部区域 -->
    <div v-if="activeName === 'login'" class="login-bottom">
      <el-button
        class="login-btn"
        type="primary"
        size="large"
        @click="handleLoginBtnClick"
        >立即登录</el-button
      >
    </div>
    <div v-else class="register-bottom">
      <el-button class="login-btn" type="primary" size="large"
        >立即注册</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginView from './login.vue';
import RegisterView from './register.vue';
// tab的默认值
const activeName = ref('login');
//login组件的实例
const loginRef = ref();
const handleLoginBtnClick = () => {
  if (activeName.value === 'login') {
    loginRef.value.loginAction();
  } else {
    console.log('用户在进行注册');
  }
};
</script>

<style scoped lang="scss">
.login-panel {
  width: 330px;
  margin-bottom: 150px;
  .tab {
  }
  .title {
    text-align: center;
    margin-bottom: 15px;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text {
    margin-left: 5px;
  }

  .login-btn {
    margin-top: 15px;
    width: 100%;

    --el-button-size: 40px !important;
  }
}
</style>
