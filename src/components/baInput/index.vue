<template>
  <el-input
    v-model="modelValue"
    :placeholder="placeholder"
    :type="type"
    :clearable="clearable"
    @input="$emit('update:modelValue', modelValue)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  placeholder?: string;
  type?: string;
  clearable?: boolean;
}>();

const emits = defineEmits(['update:modelValue']);

// 本地值，用于双向绑定
const modelValue = ref(props.modelValue);

// 监控外部值的变化
watch(
  () => props.modelValue,
  (newVal) => {
    modelValue.value = newVal;
  }
);
</script>

<style scoped>
/* 这里可以添加你的样式 */
</style>
