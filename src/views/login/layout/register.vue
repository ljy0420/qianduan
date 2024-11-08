<template>
  <div class="register">
    <el-form
      ref="formRef"
      :model="form"
      label-width="80px"
      :rules="accountRules"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="repeat_password">
        <el-input
          v-model="form.repeat_password"
          show-password
          placeholder="请再次输入密码"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormRules, FormInstance } from 'element-plus';
const formRef = ref<FormInstance>();

//定义用户数据
const form = reactive({
  username: '',
  password: '',
  repeat_password: '',
});
//定义校验规则
const accountRules: FormRules = {
  username: [
    { required: true, message: '必须输入账号', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{6,20}$/,
      message: '必须是6~20位数字或字母组成',
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
  repeat_password: [
    {
      required: true,
      message: '请确认密码',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};
</script>

<style scoped lang="scss"></style>
