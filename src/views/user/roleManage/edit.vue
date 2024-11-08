<template>
  <el-dialog
    :model-value="isVisible"
    :title="title"
    append-to-body
    @close="handleClose"
    width="600px"
  >
    <el-form
      ref="formRef"
      :model="localFormData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="localFormData.roleName" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="localFormData.description"
          placeholder="请输入描述"
        />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          :data="permissionOptions"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="{ label: 'label', children: 'children' }"
          v-model="localFormData.permissions"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 定义props的数据类型
interface Props {
  title: string;
  formData: Record<string, any>;
  permissionOptions: Array<any>;
  rules: Record<string, any>;
}
// 接受父组件中传递的数据
const props = defineProps<Props>();
// 像父组件中传递自定义事件
const emits = defineEmits(['close', 'submit']);
// 对话框显示隐藏
const isVisible = ref(false);
const localFormData = ref({ ...props.formData }) as any;
const formRef = ref();
// 监听父组件中传递的数据，实时更新对话框表单
watch(
  () => props.formData,
  (newVal) => {
    localFormData.value = { ...newVal };
  },
  { deep: true }
);
// 打开对话框
const show = (data: any) => {
  localFormData.value = { ...data };
  isVisible.value = true;
};
// 关闭对话框
const handleClose = () => {
  isVisible.value = false;
  emits('close');
};
// 保存
const handleSubmit = () => {
  formRef.value?.validate((valid: any) => {
    if (valid) {
      emits('submit', localFormData.value);
      handleClose();
    }
  });
};

defineExpose({ show, handleClose });
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
