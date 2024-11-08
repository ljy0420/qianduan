import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // 导入路由实例
import { useAuthStore } from '@/store/auth';
import { useUserStoreHook } from '@/store/modules/user';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as Icons from '@element-plus/icons-vue';
// 本地SVG图标
import 'virtual:svg-icons-register';

const app = createApp(App);

// 全局注册所有图标组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

const pinia = createPinia();
app.use(ElementPlus, {
  locale: zhCn, // 设置语言为中文
});

app.use(pinia); // 注册 Pinia
app.use(router); // 注册路由

// 初始化状态
const authStore = useAuthStore();
const userStore = useUserStoreHook();
const token = localStorage.getItem('token');

if (token) {
  userStore.token = token; // 设置 token
  authStore.setAuthenticated(true); // 设置认证状态为 true
}
userStore.initialize(); // 恢复用户信息

router.isReady().then(() => {
  const currentPath = localStorage.getItem('currentPath');
  if (currentPath) {
    router.push(currentPath);
  }

  app.mount('#app');
});
