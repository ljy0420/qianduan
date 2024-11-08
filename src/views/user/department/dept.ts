// src/api/system/dept.ts

export interface DeptVO {
  id: number;
  name: string;
  code: string;
  status: number;
  parentId: number;
  parentName?: string;
  sort: number;
  children?: DeptVO[];
}

export interface DeptForm {
  id?: number;
  name: string;
  code: string;
  status: number;
  parentId: number;
  parentName?: string;
  sort: number;
}

export interface DeptQuery {
  keywords?: string;
  status?: number;
}

const mockDeptData: DeptVO[] = [
  {
    id: 1,
    name: '技术部',
    code: 'tech',
    status: 1,
    parentId: 0,
    sort: 1,
  },
  {
    id: 3,
    name: '市场部',
    code: 'market',
    status: 1,
    parentId: 0,
    sort: 2,
  },
];

// 模拟API
const DeptAPI = {
  getList(query: DeptQuery): Promise<DeptVO[]> {
    let result = [...mockDeptData];
    // 确保 keywords 使用默认值
    const keywords = query.keywords ?? '';
    if (keywords) {
      result = result.filter((dept) => dept.name.includes(keywords));
    }
    // 检查 status, 0 表示全部
    if (query.status !== undefined && query.status !== 0) {
      result = result.filter((dept) => dept.status === query.status);
    }
    return Promise.resolve(result);
  },

  getOptions(): Promise<DeptVO[]> {
    return Promise.resolve(mockDeptData);
  },

  getFormData(deptId: number): Promise<DeptForm> {
    const dept = mockDeptData.find((dept) => dept.id === deptId);
    return dept
      ? Promise.resolve(dept)
      : Promise.reject('Department not found');
  },

  add(data: DeptForm): Promise<void> {
    const id = Math.max(...mockDeptData.map((dept) => dept.id)) + 1;
    mockDeptData.push({ ...data, id, children: [] });
    return Promise.resolve();
  },

  update(deptId: number, data: DeptForm): Promise<void> {
    const index = mockDeptData.findIndex((dept) => dept.id === deptId);
    if (index !== -1) {
      mockDeptData.splice(index, 1, { ...mockDeptData[index], ...data });
      return Promise.resolve();
    }
    return Promise.reject('Department not found');
  },

  deleteByIds(deptIds: string): Promise<void> {
    const ids = new Set(deptIds.split(',').map((id) => Number(id))); // 使用 Set 存储要删除的 ID
    let deleted = 0;

    // 递归删除子节点及其父节点
    function deleteNode(id: number) {
      // 删除父节点
      const index = mockDeptData.findIndex((dept) => dept.id === id);
      if (index !== -1) {
        mockDeptData.splice(index, 1); // 删除父节点
        deleted++; // 计数删除了多少项
      }

      // 删除所有包含该 ID 的子节点
      mockDeptData.forEach((dept) => {
        if (dept.children) {
          dept.children = dept.children.filter((child) => {
            if (ids.has(child.id)) {
              deleted++; // 计数删除了多少子节点
              return false; // 删除子节点
            }
            return true;
          });
        }
      });
    }

    // 先遍历传入的 ID，删除所有匹配的节点和它们的子节点
    ids.forEach((id) => deleteNode(id));

    return Promise.resolve();
  },

  index(params?: any): Promise<{ data: DeptVO[]; total: number }> {
    // 这里的实现和 getList 类似，只是返回的数据结构可能不同
    const result = mockDeptData.filter((item) => {
      // 添加简化的过滤逻辑
      return params ? item.name.includes(params.keywords || '') : true;
    });
    return Promise.resolve({ data: result, total: result.length });
  },
};

export default DeptAPI;
