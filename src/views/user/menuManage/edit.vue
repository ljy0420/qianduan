<template>
  <el-dialog :title="dialogTitle" :model-value="isVisible" width="600px">
    <el-form ref="menuFormRef" :model="form" label-width="80px">
      <el-form-item v-if="!isParentMenu || !isEdit" label="父级菜单">
        <el-select
          v-model="form.pid"
          placeholder="请选择父级菜单"
          :disabled="isEdit"
        >
          <el-option
            v-for="menu in parentMenuOptions"
            :key="menu.id"
            :label="menu.name"
            :value="menu.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.icon" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="是否缓存">
        <el-switch v-model="form.cache" />
      </el-form-item>
      <el-form-item label="菜单状态">
        <el-select v-model="form.status">
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { MenuItem, ParentMenuOption } from '@/api/system/menu';

const props = defineProps<{
  menu: MenuItem | null;
  parentMenuOptions: ParentMenuOption[];
}>();

const emit = defineEmits(['save']);
// 表单数据
const form = ref<MenuItem>({
  id: null,
  pid: undefined,
  name: '',
  icon: '',
  path: '',
  description: '',
});
// 对话框显示隐藏
const isVisible = ref(false);
// 是否编辑
const isEdit = computed(() => !!form.value.id);
//是否是父级菜单
const isParentMenu = computed(() => !form.value.pid);
// 对话框名称
const dialogTitle = computed(() => (form.value.id ? '编辑菜单' : '新增菜单'));
// 监听菜单变化实时同步表单数据
watch(
  () => props.menu,
  (newMenu) => {
    if (newMenu) {
      form.value = { ...newMenu };
    } else {
      form.value = {
        id: null,
        pid: undefined,
        name: '',
        icon: '',
        path: '',
        description: '',
        type: '',
        cache: false,
        status: 0,
      };
    }
  },
  // 确保执行一次
  { immediate: true }
);
// 打开对话框
const show = (menu: MenuItem | null = null) => {
  if (menu) {
    form.value = { ...menu };
  } else {
    form.value = {
      id: null,
      pid: undefined,
      name: '',
      icon: '',
      path: '',
      description: '',
      type: '',
      cache: false,
      status: 0,
    };
  }
  isVisible.value = true;
};
// 关闭对话框
const closeDialog = () => {
  isVisible.value = false;
};
// 保存
const submitForm = () => {
  emit('save', form.value);
  closeDialog();
};

defineExpose({ show });
</script>

<style scoped lang="scss">
/* 样式代码 */
</style>
