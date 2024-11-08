import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';
import { useUserStoreHook } from '@/store/modules/user';

/**
 * 网络请求
 * @author ljy
 * @lastModified 2024-10-21 by ljy
 * @param
 * @returns
 */

// 用于存储当前正在进行的请求，以便在需要时可以取消重复请求
const pendingMap = new Map();

// 定义 LoadingInstance 的类型
interface LoadingInstance {
  _count: number;
  _target: ReturnType<typeof ElLoading.service> | null; // 确保 _target 的类型可以是 service 返回的类型或 null
}

// 用于管理 loading 状态。 _count 表示当前有多少个 loading 实例在运行， _target 用于保存 loading 实例
const LoadingInstance: LoadingInstance = {
  _target: null,
  _count: 0,
};

// 创建一个新的 Axios 实例
function myAxios(
  axiosConfig: any,
  customOptions: any = {},
  loadingOptions: any = {}
) {
  const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API, //从环境变量中读取基础 API 路径
    timeout: 10000, // 设置统一的超时时长
  });

  // 将默认配置与传入的 customOptions 合并，提供灵活性
  let custom_options = Object.assign(
    {
      repeat_request_cancel: true, // 是否开启取消重复请求, 默认为 true
      loading: false, // 是否开启loading层效果, 默认为false
      reduct_data_format: true, // 是否开启简洁的数据结构响应, 默认为true
      error_message_show: true, // 是否开启接口错误信息展示,默认为true
      code_message_show: false, // 是否开启code不为0时的信息提示, 默认为false
    },
    customOptions
  );

  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      console.log('请求发送前配置:', config);
      // 调用 removePending 和 addPending 函数来管理请求的状态
      removePending(config);
      custom_options.repeat_request_cancel && addPending(config);
      // 当 loading 为 true 时，如果这是第一个请求，则创建 loading 实例
      if (custom_options.loading) {
        LoadingInstance._count++;
        if (LoadingInstance._count === 1) {
          LoadingInstance._target = ElLoading.service(loadingOptions);
        }
      }
      // 自动携带token
      const userStore = useUserStoreHook(); //调用自定义的 useUserStoreHook 函数来获取用户的状态
      if (userStore.getTokenAUTH() && typeof window !== 'undefined') {
        // 从用户状态中获取 Token 并添加到请求头中
        config.headers.Authorization = userStore.getTokenAUTH();
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截,在收到响应后执行，主要是处理 loading 状态和可能的错误
  service.interceptors.response.use(
    (response) => {
      console.log(response);

      removePending(response.config);
      custom_options.loading && closeLoading(custom_options); // 关闭loading
      // 如果 code 不为 0，显示错误信息并拒绝 Promise
      if (
        custom_options.code_message_show &&
        response.data &&
        response.data.code !== 0
      ) {
        ElMessage({
          type: 'error',
          message: response.data.message,
        });
        return Promise.reject(response.data); // code不等于0, 页面具体逻辑就不执行了
      }

      return custom_options.reduct_data_format ? response.data : response;
    },
    (error) => {
      error.config && removePending(error.config);
      custom_options.loading && closeLoading(custom_options); // 关闭loading
      custom_options.error_message_show && httpErrorStatusHandle(error); // 处理错误状态码
      return Promise.reject(error); // 错误继续返回给到具体页面
    }
  );
  // 返回配置好的 Axios 实例
  return service(axiosConfig);
}

export default myAxios;

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error: any) {
  // 处理被取消的请求
  if (axios.isCancel(error))
    return console.error('请求的重复请求：' + error.message);
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！';
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break; // 在正确域名下
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network'))
    message = window.navigator.onLine ? '服务端异常！' : '您断网了！';

  ElMessage({
    type: 'error',
    message,
  });
}

/**
 * 关闭Loading层实例
 * @param {*} _options
 */
function closeLoading(_options: any) {
  if (_options.loading && LoadingInstance._count > 0) LoadingInstance._count--; // 检查 _options.loading 是否为 true，并且 LoadingInstance._count 大于 0，如果是，则减少计数
  // 检查 LoadingInstance._count 是否为 0，表示所有请求都完成
  if (LoadingInstance._count === 0) {
    // 添加 null 检查
    if (LoadingInstance._target) {
      LoadingInstance._target.close(); // 确保在 _target 存在时调用 close()
    }
    LoadingInstance._target = null; // 将 _target 设置为 null，以便下次可以重新创建
  }
}

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 * @param {*} config
 */
function addPending(config: any) {
  // 使用 getPendingKey 生成请求的唯一键
  const pendingKey = getPendingKey(config);
  // 如果 config 没有 cancelToken，则创建一个新的 axios.CancelToken
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        // 通过 pendingMap 存储这个 cancel 函数，确保同一请求不会重复存储
        pendingMap.set(pendingKey, cancel);
        console.log(`添加请求到 pendingMap: ${pendingKey}`); // 添加日志
      }
    });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config: any) {
  // 使用 getPendingKey 生成请求的唯一键
  const pendingKey = getPendingKey(config);
  // 检查 pendingMap 中是否存在这个键
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    // 如果存在，调用存储的 cancel 函数来取消请求，并从 pendingMap 中删除它
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
    console.log(`移除请求从 pendingMap: ${pendingKey}`); // 添加日志
  }
}

/**
 * 生成唯一的每个请求的唯一key
 * @param {*} config
 * @returns
 */
function getPendingKey(config: any) {
  let { url, method, params, data } = config;
  if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}
