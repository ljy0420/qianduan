import myAxios from '@/utils/axios';

/**
 * 登录API
 *
 * @param {Object} data - 登录请求数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise<AxiosResponse<any>>} - 登录请求的响应
 */
export function login(data: {
  userName: string;
  password: string;
}): Promise<any> {
  return myAxios({
    url: '/login',
    method: 'post',
    data: data,
  });
}
