<!-- index.vue -->
<template>
  <div>
    <div class="search-bar">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="出差人员">
          <el-input
            v-model="queryParams.employeeName"
            placeholder="请输入出差人员姓名"
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
            <el-option label="审批中" :value="1"></el-option>
            <el-option label="已批准" :value="2"></el-option>
            <el-option label="已驳回" :value="3"></el-option>
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
        :data="expenseList"
        style="width: 100%"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="employeeName" label="出差人员"></el-table-column>
        <el-table-column prop="destination" label="目的地"></el-table-column>
        <el-table-column prop="startDate" label="开始日期"></el-table-column>
        <el-table-column prop="endDate" label="结束日期"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 1
                  ? 'warning'
                  : row.status === 2
                  ? 'success'
                  : 'danger'
              "
            >
              {{
                row.status === 1
                  ? '审批中'
                  : row.status === 2
                  ? '已批准'
                  : '已驳回'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
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
    </el-card>
    <!-- 使用Edit组件 -->
    <EditForm
      @update="handleQuery"
      ref="editDialog"
      :expense-list="expenseList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue';
import EditForm from './edit.vue';

interface ExpenseVO {
  id: number;
  employeeName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: number;
}

interface ExpenseQuery {
  employeeName?: string;
  status?: number;
}

// 模拟的静态数据
const mockData: ExpenseVO[] = [
  {
    id: 1,
    employeeName: '张三',
    destination: '北京',
    startDate: '2023-10-01',
    endDate: '2023-10-05',
    totalAmount: 3000,
    status: 1,
  },
  {
    id: 2,
    employeeName: '李四',
    destination: '上海',
    startDate: '2023-10-10',
    endDate: '2023-10-15',
    totalAmount: 5000,
    status: 2,
  },
  // 其他模拟数据...
];

const queryFormRef = ref();
const removeIds = ref<number[]>([]);
const loading = ref(false);
const expenseList = ref<ExpenseVO[]>([]);
const editDialog = ref();

const queryParams = reactive<ExpenseQuery>({
  employeeName: '',
  status: 0, // 默认值为0
});

function handleQuery() {
  loading.value = true;
  // 模拟 API 请求
  setTimeout(() => {
    expenseList.value = mockData.filter((item) => {
      const employeeName = queryParams.employeeName || ''; // 使用默认值
      return (
        (employeeName === '' || item.employeeName.includes(employeeName)) &&
        (queryParams.status === 0 || item.status === queryParams.status)
      );
    });
    loading.value = false;
  }, 500);
}

function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.status = 0; // 重置为0
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
const handleSelectionChange = (selection: any) => {
  removeIds.value = selection.map((item: any) => item.id);
};

function handleOpenDialog(id: number = 0) {
  editDialog.value.show(id);
}

function handleDelete(expenseId?: number) {
  const expenseIds = expenseId ? [expenseId] : removeIds.value;

  if (expenseIds.length === 0) {
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
      // 模拟删除操作
      setTimeout(() => {
        expenseList.value = expenseList.value.filter(
          (item) => !expenseIds.includes(item.id)
        );
        ElMessage.success('删除成功');
        handleQuery();
        loading.value = false;
      }, 500);
    },
    () => {
      ElMessage.info('已取消删除');
    }
  );
}

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
