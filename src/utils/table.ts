// 定义分页接口
export interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

// 定义表格状态接口
export interface TableStatus {
  data: any[]; // 表格中的数据
  pk: string; // 主键字段名称
  filter: {
    // 过滤器，用于分页和搜索
    page: number; // 当前页码
    limit: number; // 每页显示的条目数
    order?: string; // 排序规则
    search?: any[]; // 搜索查询参数
  };
  loading: boolean; // 加载状态
  selection: any[]; // 选中的数据
  column: any[]; // 列信息
  total: number; // 数据总数
}

// 示例 API 接口，用于获取数据
export interface BaTableApi {
  index(filter: {
    page: number;
    limit: number;
    order?: string;
    search?: any[];
  }): Promise<{ data: any[]; total: number }>;
}

// 默认的分页信息
export const defaultPagination: Pagination = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
};

// 定义搜索字段的接口
export interface SearchField {
  label: string;
  prop: string;
  type: 'input' | 'select';
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
}

// 定义表格列的接口
export interface TableColumn {
  prop: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  fixed?: string | boolean;
  editable?: boolean;
  isAction?: boolean; // 用于标识操作列
  actions?: ('add' | 'edit' | 'delete')[]; // 使用字符串数组表示操作按钮类型
  render?: (scope: any) => ReturnType<typeof h>;
}

// 定义 Table Response 类型
export interface TableResponse<T> {
  data: T[];
  total: number;
}

export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
