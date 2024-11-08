// utils/common.ts
import axios, { AxiosResponse } from 'axios';
import type { TableResponse } from '@/utils/table';

export interface BaTableApi<T = any> {
  list(params: any): Promise<TableResponse<T>>;
  // 添加 index 方法
  index(params: any): Promise<TableResponse<T>>;
}

// 创建 API 工厂函数
export const createApi = <T>(resource: string): BaTableApi<T> => ({
  async list(params) {
    const response: AxiosResponse<TableResponse<T>> = await axios.get(
      `/api/${resource}`,
      { params }
    );
    return response.data;
  },
  async index(params) {
    const response: AxiosResponse<TableResponse<T>> = await axios.get(
      `/api/${resource}/index`,
      { params }
    );
    return response.data;
  },
  // 其他方法实现，比如 create, update, delete 等等
});
