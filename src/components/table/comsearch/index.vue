<template>
  <el-form :model="searchModel" :inline="true">
    <el-form-item
      v-for="field in fields"
      :key="field.prop"
      :label="field.label"
      :style="{ width: getFieldWidth(field) }"
    >
      <!-- 动态生成搜索表单项 -->
      <component
        :is="getInputComponent(field)"
        v-model="searchModel[field.prop]"
        :placeholder="field.placeholder || '请输入'"
        v-bind="getInputAttrs(field)"
        clearable
        @keyup.enter="handleSearch"
      >
        <el-option
          v-if="field.type === 'select'"
          v-for="option in field.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
      /></component>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch"
        ><template #icon><Search /></template> 搜索</el-button
      >
      <el-button @click="handleReset"
        ><template #icon><Refresh /></template> 重置</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { SearchField } from '@/utils/table';

// 接收父组件传递的属性
const props = defineProps<{
  fields: SearchField[]; // 搜索字段配置
  searchModel: Record<string, any>; // 搜索模型
}>();

// 定义可触发的事件
const emit = defineEmits(['search', 'reset']);

// 搜索功能
const handleSearch = () => {
  emit('search', props.searchModel); // 触发search事件，并传递当前搜索模型
};

// 重置功能
const handleReset = () => {
  for (const key in props.searchModel) {
    if (Object.prototype.hasOwnProperty.call(props.searchModel, key)) {
      props.searchModel[key] = ''; // 将搜索模型的每个字段值重置为空字符串
    }
  }
  emit('reset'); // 触发reset事件
};

// 根据字段类型返回相应的组件
const getInputComponent = (field: SearchField) => {
  switch (field.type) {
    case 'select':
      return 'el-select'; // 返回选择框组件
    default:
      return 'el-input'; // 默认返回输入框组件
  }
};

// 根据字段类型返回相应的组件属性
const getInputAttrs = (field: SearchField) => {
  const attrs: Record<string, any> = {};
  switch (field.type) {
    case 'select':
      attrs.filterable = true; // 允许搜索选择框中的选项
      break;
    default:
      break;
  }
  return attrs;
};

// 根据字段的 prop 获取相应的宽度
const getFieldWidth = (field: SearchField) => {
  switch (field.prop) {
    case 'username':
      return '250px'; // 示例，username字段宽度设为250px
    case 'email':
      return '300px'; // 示例，email字段宽度设为300px
    default:
      return '200px'; // 默认宽度200px
  }
};
</script>
