import myAxios from '@/utils/axios';

/**
 * 获取部门人员信息
 *
 * @param
 * @returns
 */

export function getUsersInfo(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/Division/getUsersInfo',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 级联数据获取所有部门人员信息
 *
 * @param
 * @returns
 */

export function getDivisionLeadInfo(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/Division/getDivisionLeadInfo',
    method: 'get',
    params: paramsList,
  });
}
