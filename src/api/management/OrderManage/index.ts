import myAxios from '@/utils/axios';

/**
 * 提交费用报销单
 *
 * @param
 * @returns
 */

export function submitOrderManage(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/submit',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 根据父级id查询费用项目
 *
 * @param
 * @returns
 */

export function getManageProject(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderManageProject/getManageProject',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 获取当前登录用户的费用报销单List
 *
 * @param
 * @returns
 */

export function getUserManageListInfo(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/getUserManageListInfo',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 发起费用报销单审核流程
 *
 * @param
 * @returns
 */

export function startAudit(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/startAudit',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 撤销费用报销单流程cancelAuditManage
 *
 * @param
 * @returns
 */

export function cancelAuditManage(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/cancelAudit',
    method: 'delete',
    params: paramsList,
  });
}
