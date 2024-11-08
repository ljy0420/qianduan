import myAxios from '@/utils/axios';

/**
 * 获取用户与角色绑定信息
 *
 * @param
 * @returns
 */

export function getRoles(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/userRoles/getRoles',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 查询所有角色信息
 *
 * @param
 * @returns
 */

export function getRolesinfo(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/roles/getRolesinfo',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 获取当前登录用户的所有信息
 *
 * @param
 * @returns
 */

export function userinfo(data: any) {
  return myAxios({
    url: '/userinfo',
    method: 'get',
    data: data,
  });
}

/**
 * 设置用户与角色绑定
 *
 * @param
 * @returns
 */

export function userRoles(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/userRoles/setRoles/1',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 添加新角色
 *
 * @param
 * @returns
 */

export function setRoles(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/roles/setRoles',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 查询当前用户的差旅费报销单
 *
 * @param
 * @returns
 */

export function getQueryUserOrderTourListInfo(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/orderTour/getQueryUserOrderTourListInfo',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 编辑回显信息
 *
 * @param
 * @returns
 */

export function getEditRoles(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/roles/getEditRoles',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 获取给定id的用户信息
 *
 * @param
 * @returns
 */

export function getUser(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/getUser',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 新增用户
 *
 * @param
 * @returns
 */

export function setUser(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/setUser',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 获取当前登录用户的待办任务
 *
 * @param
 * @returns
 */

export function myTaskListInfo(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/myTaskListInfo',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 删除用户信息
 *
 * @param
 * @returns
 */

export function deleteUser(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/deleteUser',
    method: 'delete',
    params: paramsList,
  });
}

/**
 * 编辑用户信息
 *
 * @param
 * @returns
 */

export function updateUser(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/updateUser',
    method: 'put',
    params: paramsList,
  });
}

/**
 * 财务待办任务列表(组任务)
 *
 * @param
 * @returns
 */

export function financeList(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/OrderManage/financeList',
    method: 'get',
    params: paramsList,
  });
}

/**
 * getUserRids
 *
 * @param
 * @returns
 */

export function getRids(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/getRids',
    method: 'get',
    params: paramsList,
  });
}
