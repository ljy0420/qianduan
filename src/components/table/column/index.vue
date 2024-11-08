<template>
  <!-- 使用 Element Plus 的 el-table-column 组件来定义表格列 -->
  <el-table-column
    :prop="attr.prop"
    :label="attr.label"
    :sortable="attr.sortable"
    :width="attr.width"
    :fixed="attr.fixed"
  >
    <!-- 使用默认插槽提供列的内容 -->
    <template #default="scope">
      <!-- 通过插槽将行数据传递给父组件，以便灵活渲染 -->
      <slot :row="scope.row"></slot>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
// 定义 ColumnProps 接口，用于列属性的类型定义
interface ColumnProps {
  prop: string; // 列字段的名称
  label: string; // 列的标题
  sortable?: boolean; // 是否允许排序
  width?: string | number; // 列的宽度
  fixed?: string | boolean; // 是否固定列
}

// 使用 defineProps 定义组件的属性 props
const props = defineProps<{
  attr: ColumnProps; // 列属性，对象类型为 ColumnProps
}>();
</script>
