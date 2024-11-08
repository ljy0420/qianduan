<template>
  <div class="visit-trend">
    <div class="chart-placeholder">这里是访问趋势图的占位符。</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'VisitTrend',
  inheritAttrs: false,
});
</script>

<style scoped>
.visit-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border: 1px dashed #ccc;
  background-color: #f9f9f9;
}

.chart-placeholder {
  color: #666;
  font-size: 18px;
}
</style>
