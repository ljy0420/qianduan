<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 角色列表 -->
      <el-col :xs="24">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="角色名/描述"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery">
                <el-icon><i-ep-Search /></el-icon>
                <span>搜索</span>
              </el-button>
              <el-button @click="handleResetQuery">
                <el-icon><i-ep-Refresh /></el-icon>
                <span>重置</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" class="table-wrapper">
          <template #header>
            <div class="flex-x-between">
              <div>
                <el-button
                  v-hasPerm="['sys:role:add']"
                  type="success"
                  @click="handleOpenDialog()"
                >
                  <el-icon><i-ep-Plus /></el-icon>
                  <span>新增</span>
                </el-button>
                <el-button
                  v-hasPerm="['sys:role:delete']"
                  type="danger"
                  :disabled="removeIds.length === 0"
                  @click="handleDelete()"
                >
                  <el-icon><i-ep-Delete /></el-icon>
                  <span>删除</span>
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="currentPageData"
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="编号" align="center" prop="id" width="80" />
            <el-table-column label="角色名" align="center" prop="roleName" />
            <el-table-column label="描述" align="center" prop="description" />
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['sys:role:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id)"
                >
                  <el-icon><i-ep-Edit /></el-icon>
                  <span>编辑</span>
                </el-button>
                <el-button
                  v-hasPerm="['sys:role:delete']"
                  type="danger"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  <el-icon><i-ep-Delete /></el-icon>
                  <span>删除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination"
            :current-page.sync="queryParams.pageNum"
            :page-size.sync="queryParams.pageSize"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 角色表单弹窗 -->
    <EditRoleDialog
      ref="editDialogRef"
      :title="dialog.title"
      :formData="formData"
      :permissionOptions="permissionOptions"
      :rules="rules"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup lang="ts">
import EditRoleDialog from './edit.vue';

const editDialogRef = ref(); // 创建对话框组件的 ref
const queryFormRef = ref(); // 实例搜索表单对象
const loading = ref(false); //加载状态
const removeIds = ref([]); // 行复选框勾选对象集合
const total = ref(0); // 分页总计
const pageData = ref<any>([]); // 表格数据
const permissionOptions = ref<any>([]); // 用户权限
const currentPageData = ref<any>([]); // 当前页面数据
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keywords: '',
});

/** 角色弹窗对象 */
const dialog = reactive({
  visible: false,
  title: '',
});

// 角色表单数据
const formData = reactive<{
  id: number | null;
  roleName: string;
  description: string;
  permissions: number[];
  createTime: string;
}>({
  id: null,
  roleName: '',
  description: '',
  permissions: [],
  createTime: '',
});

/** 角色表单校验规则  */
const rules = reactive({
  roleName: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
});

const staticRoles = [
  {
    id: 1,
    roleName: '管理员',
    description: '拥有所有权限',
    createTime: '2023-01-01',
  },
  {
    id: 2,
    roleName: '用户',
    description: '普通用户',
    createTime: '2023-02-01',
  },
  {
    id: 3,
    roleName: '访客',
    description: '只读权限',
    createTime: '2023-03-01',
  },
];

const staticPermissions = [
  {
    id: 1,
    label: '用户管理',
    children: [
      { id: 2, label: '新增用户' },
      { id: 3, label: '编辑用户' },
      { id: 4, label: '删除用户' },
    ],
  },
  {
    id: 5,
    label: '角色管理',
    children: [
      { id: 6, label: '新增角色' },
      { id: 7, label: '编辑角色' },
      { id: 8, label: '删除角色' },
    ],
  },
  { id: 9, label: '系统设置' },
];

// 查询
const handleQuery = () => {
  loading.value = true;
  setTimeout(() => {
    pageData.value = staticRoles.filter((role) => {
      if (queryParams.keywords) {
        return (
          role.roleName.includes(queryParams.keywords) ||
          role.description.includes(queryParams.keywords)
        );
      }
      return true;
    });
    total.value = pageData.value.length;
    updateCurrentPageData();
    loading.value = false;
  }, 500);
};
// 更新当前页数据
const updateCurrentPageData = () => {
  const start = (queryParams.pageNum - 1) * queryParams.pageSize;
  const end = start + queryParams.pageSize;
  currentPageData.value = pageData.value.slice(start, end);
};

// 重置查询
const handleResetQuery = () => {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
};

// 行复选框选中记录选中ID集合
const handleSelectionChange = (selection: any) => {
  removeIds.value = selection.map((item: any) => item.id);
};

// 打开弹窗
const handleOpenDialog = async (id?: number) => {
  dialog.title = id ? '修改角色' : '新增角色';
  permissionOptions.value = staticPermissions;

  if (id) {
    const role = staticRoles.find((role) => role.id === id);
    if (role) {
      Object.assign(formData, { ...role });
    }
  } else {
    formData.id = null;
    formData.roleName = '';
    formData.description = '';
    formData.permissions = [];
    formData.createTime = '';
  }

  if (editDialogRef.value) {
    editDialogRef.value.show(formData);
  }
};

// 关闭弹窗
const handleCloseDialog = () => {
  dialog.visible = false;
};

// 表单提交
const handleSubmit = (submittedFormData: any) => {
  loading.value = true;
  setTimeout(() => {
    if (submittedFormData.id !== null) {
      const index = staticRoles.findIndex(
        (role) => role.id === submittedFormData.id
      );
      if (index !== -1) {
        staticRoles[index] = { ...submittedFormData } as any;
        ElMessage.success('修改角色成功');
      }
    } else {
      const newRole = {
        ...submittedFormData,
        id: staticRoles.length + 1,
        createTime: new Date().toISOString().split('T')[0],
      } as any;
      staticRoles.push(newRole);
      ElMessage.success('新增角色成功');
    }
    handleCloseDialog();
    handleQuery();
    loading.value = false;
  }, 500);
};

// 删除角色
const handleDelete = (id?: number) => {
  const roleIds = id ? [id] : removeIds.value;
  if (!roleIds.length) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm('确认删除角色?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      loading.value = true;
      setTimeout(() => {
        for (const roleId of roleIds) {
          const index = staticRoles.findIndex((role) => role.id === roleId);
          if (index !== -1) {
            staticRoles.splice(index, 1);
          }
        }
        ElMessage.success('删除成功');
        handleQuery();
        loading.value = false;
      }, 500);
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 页码改变
const handlePageChange = (page: number) => {
  queryParams.pageNum = page;
  updateCurrentPageData();
};

// 分页尺寸改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  updateCurrentPageData();
};

onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss">
.search-bar {
  padding: 18px 0 0 10px;
  margin-bottom: 10px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

.pagination {
  margin-top: 20px;
}
</style>
