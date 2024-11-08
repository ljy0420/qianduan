<template>
  <el-dialog :model-value="visible" :title="title" @close="handleClose">
    <el-form
      ref="userFormRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="formData.username"
          :readonly="!!formData.id"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="formData.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="formData.mobile"
          placeholder="请输入手机号码"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-tree-select
          v-model="formData.deptId"
          placeholder="请选择所属部门"
          :data="deptOptions"
          filterable
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select v-model="formData.roles" multiple placeholder="请选择角色">
          <el-option
            v-for="role in roleOptions"
            :key="role"
            :label="role"
            :value="role"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="formData.status"
          inline-prompt
          active-text="正常"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { OptionType } from './dept-tree.vue'; // 引入部门树组件
import { mockUserData, User } from './mockData'; // 导入共享数据
import type { FormItemRule } from 'element-plus';
import { Arrayable } from 'element-plus/es/utils/typescript';

const roleOptions = ['管理员', '用户', '审计员']; // 静态角色数据

const deptOptions = ref<OptionType[]>([
  {
    value: 1,
    label: '部门1',
    children: [
      {
        value: 2,
        label: '子部门1-1',
      },
      {
        value: 3,
        label: '子部门1-2',
      },
    ],
  },
]); // 部门列表

const visible = ref(false);
const title = ref('');
const userFormRef = ref();

const formData = reactive<Partial<User>>({
  id: undefined,
  username: '',
  nickname: '',
  gender: '',
  deptId: undefined, // 使用部门ID
  mobile: '',
  email: '',
  roles: [],
  status: 1,
  createTime: '',
});
// 表单校验
const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  roles: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择至少一个角色',
      trigger: 'change',
    },
  ],
};
const emits = defineEmits(['save']);
// 打开对话框
const show = (id?: number) => {
  visible.value = true;
  if (id !== undefined) {
    title.value = '修改用户';
    const user = mockUserData.find((user) => user.id === id);
    if (user) {
      Object.assign(formData, user);
    }
  } else {
    title.value = '新增用户';
    Object.assign(formData, {
      id: undefined,
      username: '',
      nickname: '',
      gender: '',
      deptId: undefined,
      mobile: '',
      email: '',
      roles: [],
      status: 1,
      createTime: new Date().toISOString().substring(0, 10),
    });
  }
};
// 关闭对话框
const handleClose = () => {
  visible.value = false;
  userFormRef.value.resetFields();
};
// 表单提交
const handleSubmit = () => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userDataToSave = { ...formData };
      console.log(userDataToSave);

      emits('save', userDataToSave);
      handleClose();
    }
  });
};

defineExpose({
  show,
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
