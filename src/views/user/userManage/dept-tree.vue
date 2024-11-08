<template>
  <el-card shadow="never">
    <el-input v-model="deptName" placeholder="部门名称" clearable>
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <el-tree
      ref="deptTreeRef"
      class="mt-2"
      :data="deptList"
      :props="{ children: 'children', label: 'label' }"
      :expand-on-click-node="false"
      :filter-node-method="handleFilter"
      default-expand-all
      @node-click="handleNodeClick"
    />
  </el-card>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ElTree } from 'element-plus';
// 定义部门数据类型
export interface OptionType {
  value: number;
  label: string;
  children?: OptionType[];
}
// 接收父组件传递数据
const props = defineProps({
  modelValue: {
    type: [Number],
    default: undefined,
  },
});
// 静态部门数据
const deptList = ref<OptionType[]>([
  {
    value: 1,
    label: '部门1',
    children: [
      {
        value: 2,
        label: '子部门1-1',
      },
      {
        value: 3,
        label: '子部门1-2',
      },
    ],
  },
]); // 部门列表

const deptTreeRef = ref<InstanceType<typeof ElTree> | null>(null); // 部门树
const deptName = ref(''); // 部门名称

const emits = defineEmits(['update:modelValue', 'node-click']);

const deptId = useVModel(props, 'modelValue', emits);

watchEffect(
  () => {
    if (deptTreeRef.value) {
      deptTreeRef.value.filter(deptName.value);
    }
  },
  {
    flush: 'post', // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/** 部门筛选 */
function handleFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.label.indexOf(value) !== -1;
}

/** 部门树节点点击 */
function handleNodeClick(data: { [key: string]: any }) {
  deptId.value = data.value;
  emits('node-click');
}

onBeforeMount(() => {
  // 模拟静态数据加载
  // deptList.value = getDeptOptions(); // 这里已经在 ref 定义时初始化了数据
});
</script>
<style scoped lang="scss">
.mt-2 {
  margin-top: 8px;
}
</style>
