<template>
  <div class="login">
    <LoginPanel />
  </div>
</template>

<script setup lang="ts">
import LoginPanel from './layout/login-panel.vue';
</script>

<style scoped lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url('../../assets/img/bg.jpg') no-repeat center center;
  background-size: cover; /* 使背景图覆盖整个容器 */
}
</style>
