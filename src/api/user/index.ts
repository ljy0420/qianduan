import myAxios from '@/utils/axios';

/**
 * 查询所有的用户
 *
 * @param
 * @returns
 */

export function selectAllUser(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/selectAllUser',
    method: 'get',
    params: paramsList,
  });
}
