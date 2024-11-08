import myAxios from '@/utils/axios';

/**
 * 获取所有图标信息
 *
 * @param
 * @returns
 */

export function getIcon(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/roles/getIcon',
    method: 'get',
    params: paramsList,
  });
}
