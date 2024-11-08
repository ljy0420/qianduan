<template>
  <div>
    <!-- 选择框 -->
    <select v-model="selectedItem" @change="addItemToTable">
      <!-- 遍历 availableItems 数组，生成选择框选项 -->
      <option v-for="item in availableItems" :key="item.id" :value="item">
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
        <!-- 遍历 tableItems 数组，生成表格行 -->
        <tr v-for="item in tableItems" :key="item.id">
          <td>{{ item.name }}</td>
          <!-- 点击删除按钮调用 removeItemFromTable 方法 -->
          <td><button @click="removeItemFromTable(item)">Remove</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
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

// 响应式数据
const availableItems: Ref<Item[]> = ref([...initialItems]); // 选择框中的选项
const tableItems: Ref<Item[]> = ref([]); // 表格中的选项
const selectedItem: Ref<Item | null> = ref(null); // 当前选中的项目

// 将选中的项目添加到表格中，并从选择框中移除
const addItemToTable = () => {
  // 只在选中项目非空时执行
  if (selectedItem.value) {
    tableItems.value.push(selectedItem.value); // 将选中项目添加到表格中
    availableItems.value = availableItems.value.filter(
      (item) => item.id !== selectedItem.value!.id
    ); // 从选择框选项中移除已选项目
    selectedItem.value = null; // 清除当前选中项目
  }
};

// 从表格中删除项目，并将其重新添加到选择框中
const removeItemFromTable = (item: Item) => {
  tableItems.value = tableItems.value.filter(
    (tableItem) => tableItem.id !== item.id
  ); // 从表格中删除项目
  availableItems.value.push(item); // 将删除的项目重新添加到选择框选项中
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
