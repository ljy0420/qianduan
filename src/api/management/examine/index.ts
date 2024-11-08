import myAxios from '@/utils/axios';

/**
 * 发起审核
 *
 * @param
 * @returns
 */

export function startAudit(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderTour/startAudit',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 费用报销单撤销审核
 *
 * @param
 * @returns
 */

export function cancelAuditOrderManage(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/cancelAudit',
    method: 'put',
    params: paramsList,
  });
}

/**
 * 审核意见
 *
 * @param
 * @returns
 */

export function opinionAuditOrderTour(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderTour/opinionAudit',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 差旅费报销单撤销审核
 *
 * @param
 * @returns
 */

export function cancelAuditOrderTour(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderTour/cancelAudit',
    method: 'put',
    params: paramsList,
  });
}

/**
 * 审批意见
 *
 * @param
 * @returns
 */

export function opinionAuditOrderManage(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/opinionAudit',
    method: 'post',
    params: paramsList,
  });
}
