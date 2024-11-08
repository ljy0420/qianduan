import { reactive } from 'vue';
import {
  type Pagination,
  type TableStatus,
  type BaTableApi,
  defaultPagination,
} from './table';

// BaTable 类，用于管理表格数据和状态
export class BaTable {
  public api: BaTableApi; // API 实例
  public table: TableStatus; // 表格状态
  public pagination: Pagination; // 分页信息
  private childrenKey: string; // 子数据的键
  private originalData: any[]; // 原始数据
  // 构造函数，接受一个 API 实例
  constructor(api: BaTableApi, childrenKey: string = 'children') {
    this.api = api;
    this.childrenKey = childrenKey;
    this.originalData = []; // 初始化原始数据
    // 使用 reactive 创建响应式的表格状态
    this.table = reactive<TableStatus>({
      data: [],
      pk: 'id',
      filter: {
        page: 1,
        limit: 10,
        order: '',
        search: [],
      },
      loading: false,
      selection: [],
      column: [],
      total: 0,
    });

    // 使用 reactive 创建响应式的分页信息
    this.pagination = reactive({ ...defaultPagination });
  }

  // 设置原始数据，供后续搜索和过滤使用
  setData(data: any[]) {
    this.originalData = data;
    this.table.data = data; // 初始化表格数据
    this.pagination.total = data.length; // 更新总记录数
  }

  // 异步方法，用于获取表格数据
  async getIndex() {
    if (this.api) {
      this.table.loading = true; // 设置加载状态为 true
      try {
        const res = await this.api.index(this.table.filter); // 发送请求获取数据
        this.table.data = res.data; // 更新表格数据
        this.table.total = res.total; // 确保总数被存储到表格状态中
        this.pagination.total = res.total; // 确保总数更新到 pagination 中
      } finally {
        this.table.loading = false; // 设置加载状态为 false
      }
    } else {
      // 如果没有 API，使用原始数据进行过滤
      if (this.table.filter.search) {
        this.filterData(this.table.filter.search);
      }
    }
  }

  // 过滤数据
  private filterData(searchCriteria: any[]) {
    const filteredData = this.originalData.filter((item) => {
      return searchCriteria.every((criterion) => {
        return item[criterion.field]
          ?.toString()
          .toLowerCase()
          .includes(criterion.value?.toString().toLowerCase() || '');
      });
    });

    this.table.data = filteredData; // 更新表格数据为过滤后的数据
    this.pagination.total = filteredData.length; // 更新总记录数
    this.handlePagination(); // 处理分页
  }

  // 处理分页
  private handlePagination() {
    const startIndex = (this.table.filter.page - 1) * this.table.filter.limit;
    const endIndex = startIndex + this.table.filter.limit;
    this.table.data = this.table.data.slice(startIndex, endIndex); // 更新表格数据
  }

  // 方法，处理嵌套数据展平
  flattenData(data: any[]): any[] {
    let result: any[] = [];
    const flatten = (arr: any[]) => {
      for (const item of arr) {
        result.push(item);
        if (item[this.childrenKey] && item[this.childrenKey].length) {
          flatten(item[this.childrenKey]);
        }
      }
    };
    flatten(data);
    return result;
  }
  // 方法，用于处理表格动作，如分页、排序、过滤等
  onTableAction(
    event:
      | 'page-size-change'
      | 'current-page-change'
      | 'sort-change'
      | 'filter',
    data?: any
  ) {
    // 定义各个动作的处理方法
    const actions: Record<typeof event, () => void> = {
      // 处理每页显示条数变化
      'page-size-change': () => {
        this.table.filter.limit = data.size;
        this.pagination.pageSize = data.size;
        this.getIndex();
      },

      // 处理页码变化
      'current-page-change': () => {
        this.table.filter.page = data.page;
        this.pagination.currentPage = data.page;
        this.getIndex();
      },

      // 处理排序变化
      'sort-change': () => {
        if (data && data.prop) {
          this.table.filter.order = `${data.prop},${
            data.order === 'ascending' ? 'asc' : 'desc'
          }`;
        } else {
          this.table.filter.order = '';
        }
        this.getIndex();
      },
      // 处理过滤条件变化
      filter: () => {
        this.table.filter.search = data.search;
        this.getIndex();
      },
    };

    // 执行相应的动作处理方法
    if (actions[event]) {
      actions[event]();
    }
  }

  // 方法，获取选中数据的主键值
  getSelectionIds() {
    return this.table.selection.map((item) => item[this.table.pk]);
  }
}
