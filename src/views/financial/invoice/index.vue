<template>
  <div>
    <!-- 选择框 -->
    <select v-model="selectedItemId" @change="addItemToTable">
      <!-- 遍历 availableItemsMap，生成选择框选项 -->
      <option
        v-for="item in availableItemsArray"
        :key="item.id"
        :value="item.id"
      >
        {{ item.name }}
      </option>
    </select>

    <!-- 表格 -->
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- 遍历 tableItemsMap，生成表格行 -->
        <tr v-for="item in tableItemsArray" :key="item.id">
          <td>{{ item.name }}</td>
          <!-- 点击删除按钮调用 removeItemFromTable 方法 -->
          <td><button @click="removeItemFromTable(item.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, Ref } from 'vue';
interface Item {
  id: number;
  name: string;
}
// 初始数据
const initialItems: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

// availableItemsMap 和 tableItemsMap 使用 Vue 的 ref 和 Map 数据结构来存储选择框和表格中的项目。
const availableItemsMap: Ref<Map<number, Item>> = ref(
  new Map(initialItems.map((item) => [item.id, item]))
);
const tableItemsMap: Ref<Map<number, Item>> = ref(new Map());
const selectedItemId: Ref<number | null> = ref(null); // 当前选中的项目 ID

// 计算属性，将 Map 转换为数组，用于模板渲染
// 将 availableItemsMap 转换为数组
const availableItemsArray = computed(() =>
  Array.from(availableItemsMap.value.values())
);
// 将 tableItemsMap 转换为数组
const tableItemsArray = computed(() =>
  Array.from(tableItemsMap.value.values())
);

// 将选中的项目从选择框添加到表格，并从选择框中移除
const addItemToTable = () => {
  if (selectedItemId.value !== null) {
    const selectedItem = availableItemsMap.value.get(selectedItemId.value); //从 availableItemsMap 获取选中的项目
    if (selectedItem) {
      tableItemsMap.value.set(selectedItemId.value, selectedItem); // 添加到表格 Map 中
      availableItemsMap.value.delete(selectedItemId.value); // 从选择框 Map 中删除
      selectedItemId.value = null; // 清除当前选中项目
    }
  }
};

// 从表格中删除项目，并将其重新添加到选择框中
const removeItemFromTable = (itemId: number) => {
  const item = tableItemsMap.value.get(itemId); //从 tableItemsMap 获取选中的项目
  if (item) {
    tableItemsMap.value.delete(itemId); // 从表格 Map 中删除项目
    availableItemsMap.value.set(itemId, item); // 重新添加到选择框 Map 中
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: left;
}
button {
  padding: 4px 8px;
  color: #fff;
  background-color: #f00;
  border: none;
  cursor: pointer;
}
</style>
