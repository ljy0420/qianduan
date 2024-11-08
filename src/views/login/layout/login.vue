<template>
  <div class="login">
    <el-form
      ref="formRef"
      :model="form"
      label-width="60px"
      :rules="accountRules"
    >
      <el-form-item label="账号" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
    </el-form>
  </div>
  <div class="controls">
    <el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
    <el-link type="primary">忘记密码</el-link>
  </div>
</template>

<script setup lang="ts">
import { FormRules, FormInstance, ElNotification } from 'element-plus';
import { useUserStoreHook } from '@/store/modules/user';
import { LoginData } from '@/api/auth/types';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
//记住密码选择框的值
const isRemPwd = ref(false);
const formRef = ref<FormInstance>();
// 获取用户存储
const userStore = useUserStoreHook();
const router = useRouter();
//获取认证状态
const authStore = useAuthStore();
//定义用户数据
const form = reactive({
  userName: '',
  password: '',
});
//定义校验规则
const accountRules: FormRules = {
  userName: [
    { required: true, message: '必须输入账号', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{3,20}$/,
      message: '必须是3~20位数字或字母组成',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '必须输入密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{3,}$/,
      message: '必须是3位以上数字或字母组成',
      trigger: 'blur',
    },
  ],
};
// 执行账号的登录逻辑
const loginAction = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      // 获取用户输入的账号和密码
      const userName = form.userName;
      const password = form.password;
      const loginData: LoginData = { userName, password }; // 创建 loginData 对象
      try {
        await userStore.login(loginData); // 调用用户存储的登录方法
        authStore.setAuthenticated(true); // 设置为已认证

        // router.push('/dashboard');
        ElNotification({
          message: '登录成功',
          type: 'success',
        });
      } catch (error: any) {
        ElNotification({
          message: '登录失败：' + error.message,
          type: 'error',
        });
      }
    } else {
      ElNotification({
        message: '登录失败，请输入正确的格式后再操作',
        type: 'error',
      });
    }
  });
};

defineExpose({
  loginAction,
});
</script>

<style scoped lang="scss">
.controls {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
</style>
