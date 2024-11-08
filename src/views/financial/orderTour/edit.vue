<!-- edit.vue -->
<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    @close="handleClose"
    width="600px"
  >
    <el-form :model="expenseData" ref="formRef" label-width="100px">
      <el-form-item label="出差人员">
        <el-input v-model="expenseData.employeeName"></el-input>
      </el-form-item>
      <el-form-item label="目的地">
        <el-input v-model="expenseData.destination"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="expenseData.startDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="expenseData.endDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="总金额">
        <el-input v-model="expenseData.totalAmount" type="number"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="expenseData.status">
          <el-option label="审批中" :value="1"></el-option>
          <el-option label="已批准" :value="2"></el-option>
          <el-option label="已驳回" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';

interface ExpenseForm {
  id?: number;
  employeeName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: number;
}

interface ExpenseVO {
  id: number;
  employeeName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: number;
}

const props = defineProps<{ expenseList: ExpenseVO[] }>();
const emit = defineEmits(['update']);

const visible = ref(false);
const dialogTitle = ref('');

// 表单数据
const expenseData = reactive<ExpenseForm>({
  id: undefined,
  employeeName: '',
  destination: '',
  startDate: '',
  endDate: '',
  totalAmount: 0,
  status: 1,
});

// 显示对话框
const show = (id: number) => {
  if (id === 0) {
    // 新增
    dialogTitle.value = '新增报销单';
    Object.assign(expenseData, {
      id: undefined,
      employeeName: '',
      destination: '',
      startDate: '',
      endDate: '',
      totalAmount: 0,
      status: 1,
    });
  } else {
    // 编辑
    dialogTitle.value = '编辑报销单';
    const data = props.expenseList.find((item) => item.id === id);
    if (data) {
      Object.assign(expenseData, data);
    }
  }
  visible.value = true;
};

const handleClose = () => {
  visible.value = false;
};

const handleSubmit = () => {
  if (
    !expenseData.employeeName ||
    !expenseData.destination ||
    !expenseData.startDate ||
    !expenseData.endDate ||
    expenseData.totalAmount <= 0
  ) {
    ElMessage.error('请填写完整信息');
    return;
  }

  const isNew = expenseData.id === undefined || expenseData.id === null;
  if (isNew) {
    expenseData.id = props.expenseList.length
      ? props.expenseList[props.expenseList.length - 1].id + 1
      : 1;
    props.expenseList.push({ ...expenseData } as ExpenseVO);
    ElMessage.success('新增成功');
  } else {
    const index = props.expenseList.findIndex(
      (item) => item.id === expenseData.id
    );
    if (index > -1) {
      props.expenseList[index] = { ...expenseData } as ExpenseVO;
      ElMessage.success('修改成功');
    }
  }

  handleClose();
  emit('update');
};

defineExpose({
  show,
});
</script>

<style scoped>
/* 添加组件样式 */
</style>
