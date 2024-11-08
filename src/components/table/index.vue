<template>
  <!-- 搜索组件 -->
  <div class="search-bar">
    <Search
      :fields="searchFields"
      :searchModel="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />
  </div>
  <el-card>
    <!-- 按钮组 -->
    <div class="button-group" v-if="showButtonGroup">
      <div class="operate">
        <el-button type="success" @click="handleAdd(0)">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          type="danger"
          @click="handleDelete()"
          :disabled="!hasSelectedRows"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>
    </div>
    <!-- 表格组件 -->
    <el-table
      ref="tableRef"
      :data="filteredTableData"
      v-loading="tableLoading"
      row-key="id"
      @sort-change="handleSortChange"
      @selection-change="updateSelection"
    >
      <!-- 动态判断是否显示选择框 -->
      <el-table-column v-if="showSelection" type="selection" width="55" />
      <!-- 动态渲染表格列 -->
      <template v-for="(column, index) in nonActionColumns" :key="column.prop">
        <Column :attr="column">
          <template #default="scope">
            <div class="table-cell">
              <slot :name="'column-' + column.prop" :row="scope.row">
                <span>{{ scope.row[column.prop] }}</span>
              </slot>
            </div>
          </template>
        </Column>
      </template>
      <!-- 操作列 -->
      <template v-for="column in actionColumns" :key="column.prop">
        <OperationColumn
          :actions="column.actions ?? []"
          @add="handleAdd"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </template>
    </el-table>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, defineProps, onMounted } from 'vue';
import { ElInput, ElTable, ElCard, ElPagination } from 'element-plus';
import { BaTable } from '@/utils/baTable';
import type { BaTableApi, SearchField, TableColumn } from '@/utils/table';
import Search from '@/components/table/comsearch/index.vue';
import Column from '@/components/table/column/index.vue';
import OperationColumn from '@/components/table/operationColumn/index.vue';

// 定义组件的属性
const props = defineProps<{
  api?: BaTableApi; // 可选的API接口，用于定义数据获取方式
  data?: any[]; // 静态数据
  columns?: TableColumn[]; // 表格列配置
  searchFields?: SearchField[]; // 搜索字段配置
  showSelection?: boolean; // 是否显示表格行复选框
  showButtonGroup?: boolean; // 是否显示按钮组
  handleAdd?: (id?: number) => void; // 处理新增方法
  handleEdit?: (row: any) => void; // 处理编辑方法
  handleDelete?: (id?: number) => void; // 处理删除方法
}>();

// 设置默认值及初始化变量
const columns = props.columns || ([] as TableColumn[]); // 如果没有传递 columns 属性，则默认为空数组
const searchFields = props.searchFields || ([] as SearchField[]); // 如果没有传递 searchFields 属性，则默认为空数组
const showSelection = props.showSelection ?? false; // 如果没有传递 showSelection 属性，则默认为 false
const showButtonGroup = props.showButtonGroup ?? true; // 如果没有传递 showButtonGroup 属性，则默认为 true

// 实例引用
const tableRef = ref<InstanceType<typeof ElTable>>();
const selectedRows = ref<any[]>([]); // 选中的行数据

// 分离动作列和非动作列
const actionColumns = columns.filter((col) => col.isAction); // 筛选出动作列（isAction 属性为 true）
const nonActionColumns = columns.filter((col) => !col.isAction); // 筛选出非动作列（isAction 属性为 false）

// 定义默认 API 接口，用于获取数据
const defaultApi: BaTableApi = {
  index: async (filter) => {
    // 过滤数据
    const filteredData = (props.data || []).filter((item) => {
      return (
        filter.search?.every((searchItem) => {
          return item[searchItem.field]
            .toString()
            .toLowerCase()
            .includes(searchItem.value.toString().toLowerCase());
        }) ?? true
      );
    });
    // 排序数据
    let orderedData = filteredData;
    if (filter.order) {
      const [prop, order] = filter.order.split(',');
      orderedData = filteredData.sort((a, b) => {
        const comparison = a[prop] > b[prop] ? 1 : -1;
        return order === 'asc' ? comparison : -comparison;
      });
    }
    // 分页处理
    const pagedData = orderedData.slice(
      (filter.page - 1) * filter.limit,
      filter.page * filter.limit
    );
    return Promise.resolve({
      data: pagedData,
      total: filteredData.length,
    });
  },
};

// 使用传入的 API 或者默认 API
const baTableApi = props.api ?? defaultApi;

// 创建 BaTable 实例
const baTable = new BaTable(baTableApi);

// 初始化搜索模型
const searchModel = ref<Record<string, any>>({});
searchFields.forEach((field) => {
  searchModel.value[field.prop] = ''; // 初始化搜索字段为空字符串
});

// 设置响应式的表格数据和加载状态
const tableData = ref(baTable.table.data); // 表格数据
const tableLoading = ref(baTable.table.loading); // 表格加载状态

// 初始化分页数据
const pagination = reactive({
  currentPage: baTable.pagination.currentPage, // 当前页
  pageSize: baTable.pagination.pageSize, // 每页大小
  total: baTable.pagination.total, // 总记录数
});

// 监听表格数据变化并更新
watch(
  () => baTable.table.data,
  (newData) => {
    tableData.value = newData; // 更新表格数据
  }
);

// 监听分页数据变化并更新
watch(
  [
    () => baTable.pagination.currentPage,
    () => baTable.pagination.pageSize,
    () => baTable.pagination.total,
  ],
  ([newCurrentPage, newPageSize, newTotal]) => {
    pagination.currentPage = newCurrentPage; // 更新当前页
    pagination.pageSize = newPageSize; // 更新页大小
    pagination.total = newTotal; // 更新总记录数
  },
  { immediate: true } //确保执行一次
);

// 初始化选择行状态
const hasSelectedRows = ref(false); // 是否选中了行

const updateSelection = (selection: any[]) => {
  selectedRows.value = selection;
  hasSelectedRows.value = selectedRows.value.length > 0; // 更新选择状态
};

// 处理新增方法
const handleAdd = (id?: number) => {
  if (props.handleAdd) {
    props.handleAdd(id); // 调用外部传递的新增方法
  }
};

// 处理编辑方法
const handleEdit = (row: any) => {
  if (props.handleEdit) {
    props.handleEdit(row); // 调用外部传递的编辑方法
  }
};

// 处理删除方法
const handleDelete = (id?: number) => {
  if (props.handleDelete) {
    props.handleDelete(id); // 调用外部传递的删除方法
  }
};

// 计算过滤后的表格数据
const filteredTableData = computed(() => {
  return (props.data || []).filter((item) => {
    return (
      Object.keys(searchModel.value).every((key) => {
        const value = searchModel.value[key];
        if (!value) return true; // 如果没有输入则不过滤
        const itemValue = item[key]?.toString().toLowerCase() || '';
        return itemValue.includes(value.toString().toLowerCase());
      }) ||
      (searchModel.value.keywords &&
        Object.keys(item).some((prop) => {
          // 模糊搜索逻辑：检查所有可用字段
          return item[prop]
            ?.toString()
            .toLowerCase()
            .includes(searchModel.value.keywords.toLowerCase());
        }))
    );
  });
});

// 处理搜索操作
const handleSearch = (searchData: any) => {
  Object.keys(searchData).forEach((key) => {
    searchModel.value[key] = searchData[key];
  });
};

// 重置搜索操作
const handleReset = () => {
  searchFields.forEach((field) => {
    searchModel.value[field.prop] = ''; // 重置搜索字段为空字符串
  });
};

// 处理排序变更
const handleSortChange = (sort: {
  prop: string;
  order: 'ascending' | 'descending';
}) => {
  baTable.onTableAction('sort-change', sort); // 通知表格排序变化
};

// 处理页大小变更
const handleSizeChange = (size: number) => {
  baTable.onTableAction('page-size-change', { size }); // 通知表格页面大小变化
};

// 处理页码变更
const handleCurrentChange = (pageNumber: number) => {
  baTable.onTableAction('current-page-change', { page: pageNumber }); // 通知表格当前页面变化
};

// 获取表格数据
const getIndex = async () => {
  await baTable.getIndex(); // 获取表格数据
};

// 暴露组件方法给外部调用
defineExpose({
  getIndex,
  selectedRows,
});
// 组件挂载后初始调用获取数据
onMounted(() => {
  getIndex(); // 获取初始数据
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

.table-cell {
  display: flex;
}
</style>
