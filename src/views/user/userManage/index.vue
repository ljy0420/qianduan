<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <DeptTree v-model="queryParams.deptId" @node-click="handleQuery" />
      </el-col>

      <!-- 用户列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/手机号"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                class="!w-[100px]"
                style="width: 100px"
              >
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryParams.createTime"
                :editable="false"
                class="!w-[240px]"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD"
              />
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

        <el-card shadow="never" class="table-wrapper">
          <template #header>
            <div class="button-box">
              <div class="opreate">
                <el-button type="success" @click="handleOpenDialog()">
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
              <div class="other">
                <el-button class="ml-3" @click="handleOpenImportDialog">
                  <template #icon><Upload /></template>
                  导入
                </el-button>

                <el-button class="ml-3" @click="handleExport">
                  <template #icon><Download /></template>
                  导出
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="80"
            />
            <el-table-column
              key="username"
              label="用户名"
              align="center"
              prop="username"
            />
            <el-table-column label="用户昵称" align="center" prop="nickname" />

            <el-table-column
              label="性别"
              width="100"
              align="center"
              prop="gender"
            />

            <el-table-column label="部门" width="150" align="center">
              <template #default="scope">
                {{ getDeptName(scope.row.deptId) }}
                <!-- 调用方法获取部门名称 -->
              </template>
            </el-table-column>
            <el-table-column
              label="角色"
              width="150"
              align="center"
              prop="roles"
            >
              <template #default="scope">
                <el-tag
                  v-for="role in scope.row.roles"
                  :key="role"
                  type="info"
                  class="mr-2"
                  >{{ role }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              label="手机号码"
              align="center"
              prop="mobile"
              width="120"
            />

            <el-table-column
              label="状态"
              align="center"
              prop="status"
              width="100"
            >
              <template #default="scope">
                <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
                  {{ scope.row.status == 1 ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="handleResetPassword(scope.row)"
                >
                  <template #icon><RefreshLeft /></template>
                  重置密码
                </el-button>
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id)"
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

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单弹窗 -->
    <UserEditDialog ref="userEditDialog" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import DeptTree from './dept-tree.vue';
import UserEditDialog from './edit.vue';
import { mockUserData, User } from './mockData';
// 实例搜索表单
const queryFormRef = ref();
// 实例对话框对象
const userEditDialog = ref();
// 用户导入对话框显示隐藏
const importDialogVisible = ref(false);
// 加载状态
const loading = ref(false);
// 行复选框选中id集合
const removeIds = ref<number[]>([]);
// 分页总计
const total = ref(0);
// 页面数据
const pageData = ref<User[]>([]);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keywords: '',
  status: '' as number | '', // 初始化为 number 或空字符串
  deptId: undefined,
  createTime: undefined,
});

// 查询
const handleQuery = () => {
  console.log('Current Dept ID:', queryParams.deptId); //查询参数 部门ID
  loading.value = true;
  setTimeout(() => {
    const filteredData = mockUserData.filter((user) => {
      const meetsKeywords =
        !queryParams.keywords ||
        user.username.includes(queryParams.keywords) ||
        user.nickname.includes(queryParams.keywords) ||
        user.mobile.includes(queryParams.keywords);
      const meetsStatus =
        queryParams.status === '' || user.status === Number(queryParams.status);
      const meetsDept =
        !queryParams.deptId || user.deptId === queryParams.deptId;
      return meetsKeywords && meetsStatus && meetsDept;
    });
    pageData.value = filteredData;
    total.value = filteredData.length;
    loading.value = false;
  }, 500);
};
/** 重置查询 */
const handleResetQuery = () => {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.deptId = undefined;
  queryParams.createTime = undefined;
  handleQuery();
};

/** 行复选框选中记录选中ID集合 */
const handleSelectionChange = (selection: any) => {
  removeIds.value = selection.map((item: any) => item.id);
};

/** 重置密码 */
const handleResetPassword = (row: { [key: string]: any }) => {
  ElMessageBox.prompt(
    '请输入用户「' + row.username + '」的新密码',
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  ).then(
    ({ value }) => {
      if (!value || value.length < 6) {
        // 检查密码是否为空或少于6位
        ElMessage.warning('密码至少需要6位字符，请重新输入');
        return false;
      }
      ElMessage.success('密码重置成功，新密码是：' + value);
    },
    () => {
      ElMessage.info('已取消重置密码');
    }
  );
};

/** 打开用户编辑弹窗 */
const handleOpenDialog = (id?: number) => {
  userEditDialog.value?.show(id);
};

// 监听 save 事件，重新查询数据
const handleSave = (newUser: User) => {
  if (newUser.id === undefined) {
    // 为新用户自动生成ID
    newUser.id = pageData.value.length
      ? Math.max(...pageData.value.map((user) => user.id)) + 1
      : 1;
  }

  const index = mockUserData.findIndex((user) => user.id === newUser.id);
  if (index !== -1) {
    // 更新已有用户数据
    Object.assign(mockUserData[index], newUser);
  } else {
    // 添加新用户数据
    mockUserData.push(newUser);
  }
  handleQuery();
};

/** 删除用户 */
const handleDelete = (id?: number) => {
  const userIds = id ? [id] : removeIds.value;
  if (!userIds.length) {
    ElMessage.warning('请勾选删除项');
    return;
  }
  ElMessageBox.confirm('确认删除用户?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 模拟删除用户
    for (const userId of userIds) {
      const index = mockUserData.findIndex((user) => user.id === userId);
      if (index !== -1) {
        mockUserData.splice(index, 1);
      }
    }
    ElMessage.success('删除成功');
    handleResetQuery();
  });
};

// 获取部门名称的方法
const getDeptName = (deptId: any) => {
  const dept = pageData.value.find((department) => department.id === deptId);
  return dept ? dept.deptName : '未知部门';
};

const handleOpenImportDialog = () => {
  importDialogVisible.value = true;
};
// 用户导出
const handleExport = () => {
  console.log('用户导出');
};

onMounted(() => {
  handleQuery();
});
// 用户导入
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
.button-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
