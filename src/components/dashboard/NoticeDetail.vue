<template>
  <el-dialog :visible.sync="visible" title="通知详情" width="50%">
    <div v-if="notice">
      <h3>{{ notice.title }}</h3>
      <p>{{ notice.content }}</p>
    </div>
    <div v-else>
      <p>没有选择任何通知</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({
  name: 'NoticeDetail',
  inheritAttrs: false,
});

const visible = ref(false);
const notice = ref<{ title: string; content: string } | null>(null);

const openNotice = (id: string) => {
  // 模拟通知详情数据
  const notices = [
    {
      id: '1',
      title: '财务报销系统将于下周进行维护更新',
      content: '具体内容详见公告...',
    },
    {
      id: '2',
      title: '请尽快提交本月的报销单',
      content: '请务必在本月内提交所有报销单...',
    },
  ];

  const selectedNotice = notices.find((n) => n.id === id);
  if (selectedNotice) {
    notice.value = selectedNotice;
    visible.value = true;
  } else {
    notice.value = null;
    visible.value = false;
  }
};

const expose = {
  openNotice,
};
</script>

<style scoped>
/* 这里可以添加样式 */
</style>
