<template>
  <div class="app-container">
    <!-- 顶部card -->
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="state" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="state.keywords"
            placeholder="菜单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><i-ep-Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="handleResetQuery">
            <el-icon><i-ep-Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 菜单管理card -->
    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <el-button
          v-hasPerm="['sys:menu:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <el-icon><i-ep-Plus /></el-icon>
          <span>新增</span>
        </el-button>
      </template>

      <el-table
        :data="filteredMenus"
        style="width: 100%"
        class="no-vertical-lines"
        row-key="id"
        default-expand-all
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="名称" width="200"></el-table-column>
        <el-table-column
          prop="type"
          label="菜单类型"
          width="150"
        ></el-table-column>
        <el-table-column prop="path" label="路径" width="300"></el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="300"
        ></el-table-column>
        <el-table-column prop="icon" label="图标" width="200"></el-table-column>

        <!-- 新增菜单类型列 -->
        <el-table-column prop="cache" label="是否缓存" width="100">
          <template #default="{ row }">
            <el-tag :type="row.cache ? 'success' : 'warning'">
              {{ row.cache ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 新增是否缓存列 -->
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 新增菜单状态列 -->
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(row)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑对话框 -->
    <EditMenuDialog
      ref="editMenuDialog"
      :menu="editForm"
      :parentMenuOptions="parentMenuOptions"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import EditMenuDialog from './edit.vue';
import { MenuItem, ParentMenuOption } from '@/api/system/menu';
import { updateUserMenus } from '@/store/eventBus';
// 实例搜索表单对象
const queryFormRef = ref(ElForm);
// 实例对话框对象
const editMenuDialog = ref();
// 加载状态
const loading = ref(false);
const dialog = reactive({
  visible: false,
});

const state: {
  // 用户菜单数据
  userMenus: MenuItem[];
  /** 搜索关键字 */
  keywords?: string;
} = reactive({
  userMenus: [],
  keywords: '',
});
// 对话框表单数据
const editForm = reactive<MenuItem>({
  id: null,
  pid: undefined,
  name: '',
  icon: '',
  path: '',
  description: '',
});
// 过滤菜单
const filterMenus = (menus: any) => {
  return menus.map((menu: any) => {
    const filteredMenu = { ...menu };
    // 检查和处理子菜单
    if (filteredMenu.children && filteredMenu.children.length > 0) {
      filteredMenu.children = filterMenus(filteredMenu.children);
    }
    return filteredMenu;
  });
};
// 查询
const handleQuery = () => {
  const data = localStorage.getItem('userMenus');
  if (!data) {
    console.warn('没有找到菜单数据');
    return;
  }

  const allMenus = JSON.parse(data);
  if (!state.keywords) {
    // 没有搜索关键字，显示所有菜单
    state.userMenus = filterMenus(allMenus);
  } else {
    // 进行严格的匹配过滤
    const query = state.keywords.toLowerCase();
    const filterMenusByKeywords = (menus: any) => {
      return menus.filter((menu: any) => {
        const matched = menu.name.toLowerCase().includes(query);
        if (matched) {
          return true;
        }
        if (menu.children) {
          menu.children = filterMenusByKeywords(menu.children);
          return menu.children.length > 0;
        }
        return false;
      });
    };
    state.userMenus = filterMenusByKeywords(allMenus);
  }
};
// 重置
const handleResetQuery = () => {
  queryFormRef.value.resetFields();
  state.keywords = ''; // 重置关键字
  handleQuery(); // 获取所有菜单数据
};
//打开对话框
const handleOpenDialog = (menu: MenuItem | null = null) => {
  editForm.id = menu?.id || null;
  editForm.pid = menu?.pid || undefined;
  editForm.name = menu?.name || '';
  editForm.icon = menu?.icon || '';
  editForm.path = menu?.path || '';
  editForm.description = menu?.description || '';
  editMenuDialog.value.show(menu);
};
// 根据id查找部门
const findMenuById = (menus: MenuItem[], id: number): MenuItem | null => {
  for (const menu of menus) {
    if (menu.id === id) {
      return menu;
    }
    if (menu.children) {
      const found = findMenuById(menu.children, id);
      if (found) return found;
    }
  }
  return null;
};
// 删除
const handleDelete = (menuId: number) => {
  const data = localStorage.getItem('userMenus');
  if (data) {
    let allMenus = JSON.parse(data) as MenuItem[];
    allMenus = removeMenuById(allMenus, menuId);
    localStorage.setItem('userMenus', JSON.stringify(allMenus));
    state.userMenus = filterMenus(allMenus);
    updateUserMenus(allMenus);
  }
};
// 根据选中id查找菜单
const removeMenuById = (menus: MenuItem[], id: number): MenuItem[] => {
  return menus.filter((menu: MenuItem) => {
    if (menu.id === id) {
      return false;
    }
    if (menu.children) {
      menu.children = removeMenuById(menu.children, id);
    }
    return true;
  });
};
// 保存
const handleSave = (menu: MenuItem) => {
  const data = localStorage.getItem('userMenus');
  if (data) {
    let allMenus = JSON.parse(data) as MenuItem[];
    const newMenu = { ...menu, id: menu.id ?? Date.now() };

    // 如果是编辑菜单，更新对应的菜单信息
    if (menu.id) {
      const menuToUpdate = findMenuById(allMenus, newMenu.id);
      if (menuToUpdate) {
        Object.assign(menuToUpdate, newMenu);
      }
    } else {
      // 如果是新增菜单
      if (newMenu.pid) {
        const parentMenu = findMenuById(allMenus, newMenu.pid);
        if (parentMenu) {
          parentMenu.children = parentMenu.children || [];
          parentMenu.children.push(newMenu);
        }
      } else {
        allMenus.push(newMenu);
      }
    }

    // 存储菜单数据
    localStorage.setItem('userMenus', JSON.stringify(allMenus));
    state.userMenus = filterMenus(allMenus);
    dialog.visible = false;

    // 更新用户菜单
    updateUserMenus(allMenus);
    handleQuery();
  }
};

onMounted(() => {
  handleQuery();
});
// 计算出过滤后的菜单
const filteredMenus = computed(() => filterMenus(state.userMenus));
// 获取父级菜单选项
const parentMenuOptions = computed(() => {
  const findParentMenus = (menus: MenuItem[]): ParentMenuOption[] => {
    return menus.reduce((acc: ParentMenuOption[], menu: MenuItem) => {
      if (menu.children && menu.children.length > 0) {
        if (menu.id != null) {
          acc.push({ id: menu.id, name: menu.name });
        }
        acc.push(...findParentMenus(menu.children));
      }
      return acc;
    }, []);
  };
  return findParentMenus(state.userMenus);
});
</script>

<style scoped lang="scss">
.search-bar {
  padding: 18px 0 0 10px;
  margin-bottom: 10px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}
:deep(.no-vertical-lines .el-table__row) {
  border-right: none;
}

:deep(.no-vertical-lines .el-table__cell) {
  border-right: none;
}
</style>
