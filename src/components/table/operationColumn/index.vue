<template>
  <el-table-column label="操作">
    <template #default="scope">
      <el-button
        v-if="actions.includes('add')"
        type="success"
        link
        size="small"
        @click="handleAdd(scope.row.id)"
      >
        <Plus /> 新增
      </el-button>
      <el-button
        v-if="actions.includes('edit')"
        type="primary"
        link
        size="small"
        @click="handleEdit(scope.row)"
      >
        <Edit /> 编辑
      </el-button>
      <el-button
        v-if="actions.includes('delete')"
        type="danger"
        link
        size="small"
        @click="handleDelete(scope.row.id)"
      >
        <Delete /> 删除
      </el-button>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
// 定义 props
const props = defineProps<{
  actions: ('add' | 'edit' | 'delete')[];
}>();

const { actions } = toRefs(props);

// 定义 emit
const emit = defineEmits<{
  (e: 'add', id: any): void;
  (e: 'edit', row: any): void;
  (e: 'delete', id: any): void;
}>();

const handleAdd = (id: any) => {
  emit('add', id);
};

const handleEdit = (row: any) => {
  emit('edit', row);
};

const handleDelete = (id: any) => {
  emit('delete', id);
};
</script>

<style scoped>
/* 如果需要特定的样式，可以在此处添加 */
</style>
