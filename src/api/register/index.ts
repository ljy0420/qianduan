import myAxios from '@/utils/axios';

/**
 * 注册API
 *
 * @param
 * @returns
 */

export function register(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/reg',
    method: 'post',
    params: paramsList,
  });
}
