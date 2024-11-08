// mockApi.ts
export interface Department {
  id: number;
  name: string;
  manager: string;
  location: string;
  employeeCount: number;
}

export interface ApiParams {
  page: number;
  limit: number;
  order?: string;
  [key: string]: any; // 允许其他搜索参数
}

export const mockDepartmentData: Department[] = [
  {
    id: 1,
    name: 'A部门',
    manager: '张三',
    location: '北京',
    employeeCount: 30,
  },
  {
    id: 2,
    name: 'B部门',
    manager: '李四',
    location: '上海',
    employeeCount: 50,
  },
  {
    id: 3,
    name: 'C部门',
    manager: '王五',
    location: '广州',
    employeeCount: 40,
  },
  {
    id: 4,
    name: 'D部门',
    manager: '赵六',
    location: '深圳',
    employeeCount: 60,
  },
  {
    id: 5,
    name: 'E部门',
    manager: '孙七',
    location: '海南',
    employeeCount: 70,
  },
  {
    id: 6,
    name: 'F部门',
    manager: '周八',
    location: '天津',
    employeeCount: 55,
  },
  // 添加更多数据...
];

export const mockApi = {
  getDepartments: async (params: ApiParams) => {
    return new Promise<{ data: Department[]; total: number }>((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 过滤逻辑
        const filteredData = mockDepartmentData.filter((item) => {
          return Object.keys(params).every((key) => {
            if (['page', 'limit', 'order'].includes(key)) return true;
            if (!params[key]) return true;
            return item[key as keyof Department]
              .toString()
              .toLowerCase()
              .includes(params[key].toString().toLowerCase());
          });
        });

        // 排序逻辑
        if (params.order) {
          const [prop, order] = params.order.split(',');
          filteredData.sort((a, b) => {
            const propA = a[prop as keyof Department] as any;
            const propB = b[prop as keyof Department] as any;
            if (order === 'asc') {
              return propA > propB ? 1 : -1;
            } else {
              return propA < propB ? 1 : -1;
            }
          });
        }

        // 分页逻辑
        const start = (params.page - 1) * params.limit;
        const end = start + params.limit;
        const pagedData = filteredData.slice(start, end);

        resolve({ data: pagedData, total: filteredData.length });
      }, 500); // 模拟延迟 500ms
    });
  },
};
