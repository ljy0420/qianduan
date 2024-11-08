import myAxios from '@/utils/axios';

/**
 * getMenuAll
 *
 * @param
 * @returns
 */

export function getMenuAll(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/menu/getMenuAll',
    method: 'get',
    params: paramsList,
  });
}

/**
 * getUserMenus
 *
 * @param
 * @returns
 */

export function getMenus(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/user/getMenus',
    method: 'get',
    params: paramsList,
  });
}

/**
 * setMenu
 *
 * @param
 * @returns
 */

export function setMenu(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/rolesMenu/setMenu/1',
    method: 'post',
    params: paramsList,
  });
}
