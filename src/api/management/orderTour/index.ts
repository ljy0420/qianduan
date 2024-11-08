import myAxios from '@/utils/axios';

/**
 * 添加差旅费报销单信息（未使用）
 *
 * @param
 * @returns
 */

export function addOrderTour(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderTour/add',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 提交差旅费报销单信息
 *
 * @param
 * @returns
 */

export function submitTour(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderTour/submitTour',
    method: 'post',
    params: paramsList,
  });
}
