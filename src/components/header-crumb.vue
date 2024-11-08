<template>
  <div>
    <el-breadcrumb :separator-icon="breadcrumbs.length > 1 ? CaretRight : ''">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="index"
        :to="item.to"
      >
        {{ item.text }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { CaretRight } from '@element-plus/icons-vue';
const route = useRoute();
const router = useRouter();
const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched;
  const breadcrumbList = matchedRoutes
    .filter((match) => match.path !== '/dashboard') // 排除特定路径
    .map((match) => ({
      text: match.meta.breadcrumb,
      to: { path: match.path },
    }));
  return breadcrumbList;
});
</script>

<style scoped lang="scss"></style>
