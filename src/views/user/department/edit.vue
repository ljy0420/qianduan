<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    @close="handleClose"
    width="600px"
  >
    <!-- 上级部门字段 -->
    <el-form-item
      v-if="formData.parentId !== 0"
      label="上级部门"
      label-width="80px"
    >
      <el-tree-select
        v-model="formData.parentId"
        :data="deptTreeData"
        check-strictly
        placeholder="请选择上级部门"
        default-expand-all
        :props="treeProps"
        :expand-on-click-node="false"
      />
    </el-form-item>
    <el-form :model="formData" ref="formRef" label-width="80px">
      <el-form-item label="部门名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.status">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="formData.sort"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import DeptAPI, { DeptForm, DeptVO } from './dept';

const emit = defineEmits(['update']);
//表单数据
const formData = reactive<DeptForm>({
  id: undefined, //部门id
  name: '', //部门名称
  code: '', //部门代码
  status: 1, //状态
  parentId: 0, //父级部门id
  parentName: '', //父级部门名称
  sort: 1, //排序
});
// 对话框显示隐藏
const visible = ref(false);
//对话框名称
const title = ref('');

// 接收传递的 deptList
const props = defineProps<{ deptList: DeptVO[] }>();

// 用于树形选择的数据
const deptTreeData = computed(() => {
  return generateDeptTree(props.deptList);
});

// 树形控件的属性
const treeProps = {
  children: 'children', //子节点
  label: 'name', //节点名称
  value: 'id', //节点值
};

// 生成树形结构的数据
const generateDeptTree = (departments: DeptVO[]): DeptVO[] => {
  return departments.map((department) => ({
    ...department,
    children: department.children ? generateDeptTree(department.children) : [],
  }));
};

// 显示对话框
const show = (data: DeptForm) => {
  Object.assign(formData, data);
  formData.parentName = data.parentId ? getParentName(data.parentId) : '';
  title.value = data.id
    ? '修改部门'
    : data.parentId
    ? '新增子部门'
    : '新增父级部门';
  visible.value = true;
};

// 获取上级部门名称
const getParentName = (parentId: number) => {
  const parentDept = props.deptList.find((dept) => dept.id === parentId);
  return parentDept ? parentDept.name : '';
};

// 监控 parentId 的变化，更新 parentName
watch(
  () => formData.parentId,
  (newParentId) => {
    formData.parentName = getParentName(newParentId);
  }
);
// 关闭对话框
const handleClose = () => {
  visible.value = false;
};
// 表单提交
const handleSubmit = () => {
  if (!formData.name || !formData.code) {
    ElMessage.error('请填写完整信息');
    return;
  }

  // 判断是新增还是更新
  const isNew = formData.id === undefined || formData.id === null;

  const deptAPI = isNew
    ? Promise.resolve() // 模拟成功的 API 调用
    : DeptAPI.update(formData.id as number, formData);

  deptAPI
    .then(() => {
      ElMessage.success(isNew ? '新增成功' : '修改成功');
      if (isNew && formData.parentId) {
        // 手动创建一个新的部门对象
        const newDept = {
          id: new Date().getTime(), // 生成一个唯一的ID，例如使用当前时间戳
          name: formData.name,
          code: formData.code,
          status: formData.status,
          parentId: formData.parentId,
          parentName: getParentName(formData.parentId),
          sort: formData.sort,
          children: [],
        };

        const parentDept = props.deptList.find(
          (dept) => dept.id === formData.parentId
        );
        if (parentDept) {
          if (!parentDept.children) {
            parentDept.children = [];
          }
          parentDept.children.push(newDept);
        }
      } else {
        // 手动创建一个新的部门对象
        const newDept = {
          id: new Date().getTime(), // 生成一个唯一的ID，例如使用当前时间戳
          name: formData.name,
          code: formData.code,
          status: formData.status,
          parentId: formData.parentId,
          parentName: getParentName(formData.parentId),
          sort: formData.sort,
          children: [],
        };
        DeptAPI.add(newDept);
      }
      handleClose();
      emit('update');
    })
    .catch((error) => {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'));
    });
};
defineExpose({
  show,
});
</script>

<style scoped>
/* 添加组件样式 */
</style>
