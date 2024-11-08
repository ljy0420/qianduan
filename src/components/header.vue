<template>
  <div class="header">
    <div class="icon" @click="handleMenuIconClick">
      <el-icon v-if="isFold" size="28px">
        <i-ep-Fold />
      </el-icon>
      <el-icon v-else size="28px">
        <i-ep-Expand />
      </el-icon>
    </div>
    <div class="content">
      <HeaderCrumb />
      <HeaderInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderCrumb from './header-crumb.vue';
import HeaderInfo from './header-info.vue';
//内部自定义事件
const emit = defineEmits(['foldChange']);

// 折叠状态
const isFold = ref(false);
const handleMenuIconClick = () => {
  // 内部改变状态
  isFold.value = !isFold.value;
  // 将事件和状态床底给父组件
  emit('foldChange', isFold.value);
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
}
.icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 0 18px;
}
</style>
