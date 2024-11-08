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
import DeptAPI, { DeptForm, DeptVO } from '../../user/department/dept';
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['update']);
const formData = reactive<DeptForm>({
  id: undefined,
  name: '',
  code: '',
  status: 1,
  parentId: 0,
  parentName: '',
  sort: 1,
});
const visible = ref(false);
const title = ref('');
const props = defineProps<{ deptList: DeptVO[] }>();

const deptTreeData = computed(() => generateDeptTree(props.deptList));

const treeProps = {
  children: 'children',
  label: 'name',
  value: 'id',
};

const generateDeptTree = (departments: DeptVO[]): DeptVO[] => {
  return departments.map((department) => ({
    ...department,
    children: department.children ? generateDeptTree(department.children) : [],
  }));
};

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

const getParentName = (parentId: number) => {
  const parentDept = props.deptList.find((dept) => dept.id === parentId);
  return parentDept ? parentDept.name : '';
};

watch(
  () => formData.parentId,
  (newParentId) => {
    formData.parentName = getParentName(newParentId);
  }
);

const handleClose = () => {
  visible.value = false;
};

const handleSubmit = () => {
  if (!formData.name || !formData.code) {
    ElMessage.error('请填写完整信息');
    return;
  }

  const isNew = formData.id === undefined || formData.id === null;

  const deptAPI = isNew
    ? Promise.resolve() // 模拟成功的 API 调用
    : DeptAPI.update(formData.id as number, formData);

  deptAPI
    .then(() => {
      ElMessage.success(isNew ? '新增成功' : '修改成功');
      const newDept = {
        id: formData.id || new Date().getTime(), // 更新时保持 ID，否则生成唯一 ID
        name: formData.name,
        code: formData.code,
        status: formData.status,
        parentId: formData.parentId,
        parentName: getParentName(formData.parentId),
        sort: formData.sort,
        children: [],
      };

      if (isNew) {
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
        // 编辑的处理
        if (formData.id) {
          const index = findDeptIndex(props.deptList, formData.id);
          if (index !== -1) {
            // 更新已有部门
            props.deptList[index] = { ...props.deptList[index], ...newDept };
          }
        }
      }

      handleClose();
      emit('update'); // 通知父组件更新
    })
    .catch((error) => {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'));
    });
};

// 找到部门的索引
const findDeptIndex = (departments: DeptVO[], id: number): number => {
  for (let i = 0; i < departments.length; i++) {
    if (departments[i].id === id) {
      return i;
    }
    const children = departments[i].children; // 将 children 提取到一个变量
    if (Array.isArray(children) && children.length > 0) {
      const childIndex = findDeptIndex(children, id);
      if (childIndex !== -1) {
        return childIndex;
      }
    }
  }
  return -1; // 没找到
};

defineExpose({
  show,
});
</script>
