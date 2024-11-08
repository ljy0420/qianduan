<template>
  <div>
    <!-- 使用公共表格组件 -->
    <BaseTable
      ref="baseTableRef"
      :api="DeptAPI"
      :data="deptList"
      :columns="columns"
      :searchFields="searchFields"
      showSelection
      :showButtonGroup="true"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
      :handleDelete="handleDelete"
      childrenKey="children"
    >
      <!-- 自定义 status 列的渲染 -->
      <template #column-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'info'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </BaseTable>
    <!-- 使用 EditForm 组件 -->
    <EditForm :dept-list="deptList" @update="handleQuery" ref="editDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EditForm from './edit.vue';
import BaseTable from '@/components/table/index.vue';
import { ElMessageBox, ElMessage, ElTag } from 'element-plus';
import DeptAPI, { DeptForm, DeptVO } from '../../user/department/dept';
import { TableColumn, SearchField } from '@/utils/table';

// 表格列配置
const columns: TableColumn[] = [
  { prop: 'name', label: '部门名称', width: '600px' },
  { prop: 'code', label: '部门编码' },
  {
    prop: 'status',
    label: '状态',
  },
  { prop: 'sort', label: '排序' },
  // 确保 actions 字段只包含允许的字符串
  {
    prop: 'operations',
    isAction: true,
    label: '操作',
    actions: ['edit', 'delete', 'add'],
  },
];

// 搜索字段配置
const searchFields: SearchField[] = [
  { label: '关键词', prop: 'keywords', type: 'input' },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '全部', value: 0 },
      { label: '启用', value: 1 },
      { label: '禁用', value: 2 },
    ],
  },
];

const deptList = ref<DeptVO[]>([]);

// 查询并获取部门数据
const handleQuery = async () => {
  try {
    const data = await DeptAPI.getList({});
    deptList.value = data;
  } catch (error) {
    console.error('获取部门数据失败:', error);
  }
};
// 获取 BaseTable 的引用
const baseTableRef = ref<InstanceType<typeof BaseTable> | null>(null);

// 编辑表单的引用，用于打开编辑对话框
const editDialog = ref();

// 新增
const handleAdd = (id?: number) => {
  if (id) {
    showEditDialog(id);
  } else {
    showEditDialog(0);
  }
};

// 编辑
const handleEdit = (row: any) => {
  showEditDialog(row.id, row.parentId);
};

// 删除
const handleDelete = (id?: number) => {
  // 获取选中的部门ID数组
  const deptIds = id
    ? [id]
    : baseTableRef.value?.selectedRows.map((row) => row.id) ?? [];
  console.log(deptIds);

  // 检查是否有选中的ID
  if (!deptIds.length) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  // 转换ID数组为逗号分隔的字符串
  const deptIdsString = deptIds.join(',');

  // 弹出确认对话框
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 调用API删除选中的部门
      DeptAPI.deleteByIds(deptIdsString).then(() => {
        ElMessage.success('删除成功');
        deptList.value = deptList.value.filter((item) => item.id !== id); // 从列表中移除
        baseTableRef.value?.getIndex(); // 调用 BaseTable 方法获取最新数据
      });
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 显示编辑对话框
const showEditDialog = (id: number, parentId: number | null = null) => {
  const maxId = getMaxId(deptList.value);

  // 初始化 initialData
  let initialData: DeptForm = {
    id: undefined,
    name: '',
    code: '',
    status: 1,
    parentId: 0,
    parentName: '',
    sort: 1,
  };

  // 查找部门的递归函数
  const findDept = (depts: DeptVO[], id: number): DeptVO | null => {
    for (const dept of depts) {
      if (dept.id === id) return dept;
      if (dept.children && dept.children.length) {
        const found = findDept(dept.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  if (id === 0) {
    // 新增父级部门
    initialData.parentId = 0;
    initialData.parentName = '';
  } else if (parentId === null) {
    // 新增子部门
    const parentDept = deptList.value.find((dept) => dept.id === id);
    initialData.parentId = id;
    initialData.parentName = parentDept ? parentDept.name : '';
  } else {
    // 编辑部门
    const deptToEdit = findDept(deptList.value, id);
    if (deptToEdit) {
      initialData = {
        ...deptToEdit,
        parentName: getParentName(deptToEdit.parentId),
      };
    } else {
      console.error('未找到部门数据', id);
    }
  }
  // 打开对话框并传递当前部门数据及部门id
  editDialog.value.show(initialData, maxId);
};

// 获取父级部门名称
const getParentName = (parentId: number) => {
  const parentDept = deptList.value.find((dept) => dept.id === parentId);
  return parentDept ? parentDept.name : '';
};

//获取id的最大值，确保生成唯一id
const getMaxId = (departments: DeptVO[]): number => {
  let maxId = 0;

  const recurse = (depts: DeptVO[]) => {
    // 遍历部门树
    depts.forEach((dept) => {
      // 对每个部门，检查其 id 是否大于当前的 maxId，如果是则更新 maxId
      if (dept.id > maxId) {
        maxId = dept.id;
      }
      // 如果部门有子部门，则递归调用 recurse
      if (dept.children && dept.children.length) {
        recurse(dept.children);
      }
    });
  };

  recurse(departments);

  return maxId;
};

onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>
