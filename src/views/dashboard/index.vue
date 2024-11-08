<template>
  <div class="dashboard-container">
    <!-- 用户相关card -->
    <el-card class="user-card" shadow="never">
      <el-row justify="space-between">
        <el-col :span="18" :xs="24">
          <div class="user">
            <el-avatar
              class="user-avater"
              :size="60"
              src="https://img1.baidu.com/it/u=4081570746,311001242&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
            />
            <div class="user-greet">
              <p class="greet">{{ greetings }}</p>
              <p class="weather">今日天气晴朗，气温在15℃至25℃之间，东南风。</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="24">
          <div class="other">
            <el-statistic
              v-for="item in statisticData"
              :key="item.key"
              :value="item.value"
              class="statistic-item"
            >
              <template #title>
                <div class="item">
                  <component :is="item.iconClass" class="item-img" />
                  <span class="item-title">{{ item.title }}</span>
                </div>
              </template>
              <template v-if="item.suffix" #suffix>/100</template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据卡片 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="data-card" shadow="never">
          <template #header>
            <div class="pending-reimbursement">
              <span class="text-[var(--el-text-color-secondary)]">
                待报销
              </span>
              <el-tag type="success" size="small">-</el-tag>
            </div>
          </template>

          <div class="flex-x-between mt-2">
            <span class="text-lg">{{ pendingReimbursements }}</span>
            <el-icon>
              <i class="el-icon-money"></i>
            </el-icon>
          </div>
          <div
            class="flex-x-between mt-2 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span>总报销单</span>
            <span>{{ totalReimbursements }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col
        v-for="(item, index) in visitStatsList"
        :key="index"
        :xs="24"
        :sm="12"
        :lg="6"
      >
        <el-skeleton :loading="visitStatsLoading" :rows="5" animated>
          <template #template>
            <el-card>
              <template #header>
                <div>
                  <el-skeleton-item variant="h3" style="width: 40%" />
                  <el-skeleton-item
                    variant="rect"
                    style="float: right; width: 1em; height: 1em"
                  />
                </div>
              </template>

              <div class="flex-x-between">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item
                  variant="circle"
                  style="width: 2em; height: 2em"
                />
              </div>
              <div class="mt-5 flex-x-between">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 1em" />
              </div>
            </el-card>
          </template>
          <template v-if="!visitStatsLoading">
            <el-card shadow="never">
              <template #header>
                <div class="flex-x-between">
                  <span class="text-[var(--el-text-color-secondary)]">
                    {{ item.title }}
                  </span>
                  <el-tag :type="item.tagType" size="small">
                    {{ item.granularity }}
                  </el-tag>
                </div>
              </template>

              <div class="flex-x-between mt-2">
                <div class="flex-y-center">
                  <span class="text-lg">{{ item.todayCount }}</span>
                  <span
                    :class="[
                      'text-xs',
                      'ml-2',
                      getGrowthRateClass(item.growthRate),
                    ]"
                  >
                    <el-icon>
                      <i
                        v-if="item.growthRate > 0"
                        class="el-icon-arrow-up-bold"
                      ></i>
                      <i
                        v-else-if="item.growthRate < 0"
                        class="el-icon-arrow-down-bold"
                      ></i>
                    </el-icon>
                    {{ formatGrowthRate(item.growthRate) }}
                  </span>
                </div>
                <el-icon>
                  <i :class="item.icon"></i>
                </el-icon>
              </div>

              <div
                class="flex-x-between mt-2 text-sm text-[var(--el-text-color-secondary)]"
              >
                <span>总{{ item.title }}</span>
                <span>{{ item.totalCount }}</span>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="relation">
      <el-col :xs="24" :span="16" class="trend">
        <!-- 访问趋势统计图 -->
        <VisitTrend id="VisitTrend" width="100%" height="400px" />
      </el-col>
      <el-col :xs="24" :span="8" class="notice">
        <el-card class="notice-card">
          <template #header>
            <div class="notice">
              <div class="notice-title">
                通知公告
                <el-icon class="ml-1"><i class="el-icon-bell"></i></el-icon>
              </div>
              <el-link type="primary" class="notice-more">
                <span class="text-xs" @click="viewMoreNotice">查看更多</span>
                <el-icon class="text-xs"
                  ><i class="el-icon-arrow-right"></i
                ></el-icon>
              </el-link>
            </div>
          </template>

          <el-scrollbar height="400px">
            <div
              v-for="(item, index) in notices"
              :key="index"
              class="flex-y-center py-3"
            >
              <el-tag size="small">{{ item.type }}</el-tag>
              <el-text
                class="!mx-2 flex-1 !text-xs !text-[var(--el-text-color-secondary)]"
              >
                {{ item.title }}
              </el-text>
              <el-link @click="viewNoticeDetail(item.id)">
                <el-icon class="text-sm"><i class="el-icon-view"></i></el-icon>
              </el-link>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>

    <NoticeDetail ref="noticeDetailRef" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Dashboard',
  inheritAttrs: false,
});

import VisitTrend from '@/components/dashboard/VisitTrend.vue';
import NoticeDetail from '@/components/dashboard/NoticeDetail.vue';

import router from '@/router';
import { useUserStoreHook } from '@/store/modules/user';

const noticeDetailRef = ref();

const userStore = useUserStoreHook();
const date = new Date();
const greetings = computed(() => {
  const hours = date.getHours();
  if (hours >= 6 && hours < 8) {
    return '晨起披衣出草堂，轩窗已自喜微凉🌅！';
  } else if (hours >= 8 && hours < 12) {
    return '上午好，' + userStore.userInfo.userName + '！';
  } else if (hours >= 12 && hours < 18) {
    return '下午好，' + userStore.userInfo.userName + '！';
  } else if (hours >= 18 && hours < 24) {
    return '晚上好，' + userStore.userInfo.userName + '！';
  } else {
    return '偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！';
  }
});

// 定义类型
type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger';

// 右上角统计数据
const statisticData = ref([
  {
    value: 99,
    iconClass: 'Message',
    title: '消息',
    key: 'message',
  },
  {
    value: 50,
    iconClass: 'Timer',
    title: '待办',
    suffix: '/100',
    key: 'upcoming',
  },
  {
    value: 10,
    iconClass: 'Folder',
    title: '项目',
    key: 'project',
  },
]);

const pendingReimbursements = ref(2);
const totalReimbursements = ref(10); // 示例数据

const visitStatsLoading = ref(false);
const visitStatsList = ref([
  {
    title: '访问量',
    icon: 'el-icon-view',
    tagType: 'primary' as TagType,
    growthRate: 0.1,
    granularity: '日',
    todayCount: 150,
    totalCount: 2000,
  },
  {
    title: '用户数',
    icon: 'el-icon-user',
    tagType: 'success' as TagType,
    growthRate: -0.05,
    granularity: '日',
    todayCount: 50,
    totalCount: 500,
  },
  {
    title: 'IP 数量',
    icon: 'el-icon-monitor',
    tagType: 'warning' as TagType,
    growthRate: 0.2,
    granularity: '日',
    todayCount: 30,
    totalCount: 300,
  },
]);

// 格式化增长率
const formatGrowthRate = (growthRate: number): string => {
  if (growthRate === 0) {
    return '-';
  }

  const formattedRate = Math.abs(growthRate * 100)
    .toFixed(2)
    .replace(/\.?0+$/, '');
  return formattedRate + '%';
};

// 获取增长率文本颜色类
const getGrowthRateClass = (growthRate: number): string => {
  if (growthRate > 0) {
    return 'color-[--el-color-danger]';
  } else if (growthRate < 0) {
    return 'color-[--el-color-success]';
  } else {
    return 'color-[--el-color-info]';
  }
};

const notices = ref([
  { id: 1, type: '公告', title: '财务报销系统将于下周进行维护更新' },
  { id: 2, type: '通知', title: '请尽快提交本月的报销单' },
]);

// 查看更多
const viewMoreNotice = () => {
  router.push({ path: '/myNotice' });
};

// 阅读通知公告
const viewNoticeDetail = (id: any) => {
  noticeDetailRef.value.openNotice(id);
};

onMounted(() => {
  // 静态数据，不需要 API 调用
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-card {
  height: 100px;
  flex: 0 0 auto; /* 固定高度，不会伸缩 */
  margin-bottom: 10px;
  .user {
    height: 80px;
    display: flex;
    align-items: center;
    .user-avatar {
      margin-top: 10px;
    }
    .user-greet {
      height: 50px;
      margin-left: 10px; /* 头像和文字之间的间距 */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .greet {
        font-size: 16px;
        font-weight: bold;
      }
      .weather {
        font-size: 12px;
        color: gray;
      }
    }
  }

  .other {
    height: 80px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    .statistic-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px;
      .item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .item-img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
        .item-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
      }
    }
  }
}

.data-card {
  height: 100%; /* 动态计算高度并减去间距 */
}

.relation {
  margin-top: 10px;
  flex: 1; /* 占据剩余空间 */
  display: flex;
  flex-direction: row;
  .trend {
    flex: 2;
  }
  .notice {
    flex: 1;
    display: flex;
    flex-direction: column;
    .notice-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      .el-scrollbar {
        flex: 1;
      }
    }
  }
}
.notice-card {
  .notice {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
