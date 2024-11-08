import myAxios from '@/utils/axios';

/**
 * 查询所有发票
 *
 * @param
 * @returns
 */

export function getAllInvoice(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/invoice/getAll',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 根据id查询发票
 *
 * @param
 * @returns
 */

export function getByIdInvoice(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/invoice/getById',
    method: 'get',
    params: paramsList,
  });
}

/**
 * 上传发票文件
 *
 * @param
 * @returns
 */

export function uploadInvoice(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/invoice/upload',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 添加发票
 *
 * @param
 * @returns
 */

export function addInvoice(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/invoice/addInvoice',
    method: 'post',
    params: paramsList,
  });
}

/**
 * 删除发票
 *
 * @param
 * @returns
 */

export function deleteInvoice(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/invoice/deleteInvoice',
    method: 'delete',
    params: paramsList,
  });
}

/**
 * 修改发票
 *
 * @param
 * @returns
 */

export function updateInvoice(paramsList: any) {
  return myAxios({
    url: 'http://127.0.0.1:4523/m1/5277442-4946095-default/invoice/updateInvoice',
    method: 'put',
    params: paramsList,
  });
}
