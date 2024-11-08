// mockData.ts
export interface User {
  id: number;
  username: string;
  nickname: string;
  gender: string;
  deptId: number;
  mobile: string;
  email: string;
  roles: string[];
  status: number;
  createTime: string;
  deptName?: string; // 确保定义了这个属性
}

export const mockUserData: User[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    gender: '男',
    deptId: 1,
    mobile: '13800138000',
    email: 'admin@example.com',
    roles: ['管理员'],
    status: 1,
    createTime: '2023-01-01',
    deptName: '部门1',
  },
  {
    id: 2,
    username: 'user',
    nickname: '普通用户',
    gender: '女',
    deptId: 2,
    mobile: '13800138001',
    email: 'user@example.com',
    roles: ['用户'],
    status: 1,
    createTime: '2023-01-02',
    deptName: '子部门1-1',
  },
];
