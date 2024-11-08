import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStoreHook } from '@/store/modules/user';
import { ElMessage, ElMessageBox } from 'element-plus';
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, //从环境变量中读取基础 API 路径
  timeout: 50000, // 设置请求的超时时间为 50 秒
  headers: { 'Content-Type': 'application/json;charset=utf-8' }, //设置请求头，指定内容类型为 JSON
});

// 请求拦截器
service.interceptors.request.use(
  //在请求发送之前，如果用户存储中有 token，则将其添加到请求的 Authorization 头中，以进行身份验证
  (config: InternalAxiosRequestConfig) => {
    //这是请求的配置对象，类型为 InternalAxiosRequestConfig。这个对象包含了请求的所有相关信息，例如 URL、请求方法、请求头、数据等
    const userStore = useUserStoreHook(); //调用自定义的 useUserStoreHook 函数来获取用户的状态
    //检查用户存储中是否存在 token
    if (userStore.token) {
      config.headers.Authorization = userStore.token; //如果存在 token，则将其添加到请求的 Authorization 头中
    }
    return config; //将修改后的请求配置返回
  },
  (error: any) => {
    return Promise.reject(error); //如果在请求配置过程中出现错误（如获取 token 时失败），则返回一个被拒绝的 Promise
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(response);

    const { code, msg } = response.data;
    // 如果返回的 code 是 00000，则返回响应数据
    if (code === 0) {
      return response.data;
    }
    // 如果返回的code不为 00000，则提示系统出错
    // ElMessage.error(msg || '系统出错');
    return Promise.reject(new Error(msg || 'Error')); // 返回一个被拒绝的 Promise，并且传递一个错误对象作为拒绝的原因
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // 如果返回的 code 是 A0230，则表示 token 过期，弹出确认框并跳转登录
      if (code === 'A0230') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        }).then(() => {
          localStorage.clear(); //  清除本地存储
          window.location.href = '@/views/login/index.vue'; // 跳转到登录页
        });
      } else {
        // ElMessage.error(msg || '系统出错'); // 显示其他错误提示
      }
    }
    return Promise.reject(error.message); // 拒绝 Promise 并返回错误信息
  }
);

// 导出 axios 实例
export default service;
