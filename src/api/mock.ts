// mock.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { TableResponse } from '@/utils/table'; // 导入 TableResponse 类型

// 创建 Mock Adapter 实例
const mock = new MockAdapter(axios);

// 示例数据
const users = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  age: 20 + (index % 30),
}));

interface SearchFilter {
  field: keyof (typeof users)[0];
  value: string | number;
}

interface TableFilter {
  page: number;
  limit: number;
  order?: string;
  search?: SearchFilter[];
}

// 拦截 GET 请求到 /api/users
mock.onGet('/api/users').reply((config) => {
  const {
    page = 1,
    limit = 10,
    order,
    search,
  } = config.params as unknown as TableFilter;

  // 模拟数据分页
  let filteredUsers = users;

  // 模拟搜索功能
  if (search) {
    search.forEach(({ field, value }) => {
      filteredUsers = filteredUsers.filter((user) =>
        user[field].toString().includes(value.toString())
      );
    });
  }

  // 模拟排序功能
  if (order) {
    const [key, direction] = order.split(' ') as [
      keyof (typeof users)[0],
      'asc' | 'desc'
    ];
    filteredUsers.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const pageUsers = filteredUsers.slice(start, end);

  const response: TableResponse<(typeof users)[0]> = {
    data: pageUsers,
    total: filteredUsers.length,
  };

  return [200, response];
});
