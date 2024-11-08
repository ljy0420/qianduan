<template>
  <div>
    <div class="search-bar">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keywords"
            placeholder="请输入部门名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            style="width: 100px"
          >
            <el-option label="全部" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <div class="button-box">
          <div class="opreate">
            <el-button type="success" @click="handleOpenDialog(0)">
              <template #icon><Plus /></template>
              新增
            </el-button>
            <el-button
              type="danger"
              :disabled="removeIds.length === 0"
              @click="handleDelete()"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </div>
        </div>
      </template>
      <el-table
        :data="deptList"
        style="width: 100%"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="部门名称"></el-table-column>
        <el-table-column prop="code" label="部门编码"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="success"
              link
              size="small"
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Plus /></template>
              新增
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(scope.row.id, scope.row.parentId)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 使用Edit组件 -->
    <EditForm :dept-list="deptList" @update="handleQuery" ref="editDialog" />
  </div>
</template>

<script setup lang="ts">
import EditForm from './edit.vue';
import DeptAPI, { DeptVO, DeptQuery, DeptForm } from './dept';
//实例搜索表单对象
const queryFormRef = ref();
// 行复选框选中记录选中ID集合
const removeIds = ref<number[]>([]);
// 加载状态
const loading = ref(false);
// 部门列表数据
const deptList = ref<DeptVO[]>([]);
// 实例对话框对象
const editDialog = ref();

const queryParams = reactive<DeptQuery>({
  keywords: '', //关键词
  status: 0, // 默认值为0
});
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
// 查询
const handleQuery = () => {
  //开启加载状态
  loading.value = true;
  // 获取部门数据
  DeptAPI.getList(queryParams).then((data) => {
    deptList.value = data;
    loading.value = false;
  });
};
//重置
const handleResetQuery = () => {
  queryFormRef.value.resetFields();
  queryParams.status = 0; // 重置为0
  handleQuery();
};

/** 行复选框选中记录选中ID集合 */
const handleSelectionChange = (selection: any) => {
  removeIds.value = selection.map((item: any) => item.id);
};
// 打开对话框
const handleOpenDialog = (id: number = 0, parentId: number | null = null) => {
  console.log(id);

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
// 删除部门
const handleDelete = (deptId?: number) => {
  const deptIds = deptId ? deptId.toString() : removeIds.value.join(',');

  if (!deptIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(
    () => {
      loading.value = true;
      DeptAPI.deleteByIds(deptIds)
        .then(() => {
          ElMessage.success('删除成功');
          handleQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info('已取消删除');
    }
  );
};

onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.search-bar {
  padding: 18px 0 0 10px;
  margin-bottom: 10px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}
.button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.opreate {
  display: flex;
  gap: 10px;
}
</style>
