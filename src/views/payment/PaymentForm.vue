<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContractStore } from '../../store/contract'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const contractStore = useContractStore()

// 合同ID
const contractId = route.params.id
// 判断是新增还是编辑
const isEdit = computed(() => route.query.paymentId !== undefined)
const paymentId = route.query.paymentId

// 合同信息
const contractInfo = ref({})
// 表单数据
const paymentForm = reactive({
  contractId: contractId,
  amount: '',
  paymentDate: '',
  paymentType: '',
  paymentNo: '',
  status: '已付款',
  remarks: ''
})

// 表单验证规则
const rules = {
  amount: [
    { required: true, message: '请输入付款金额', trigger: 'blur' },
    { type: 'number', message: '付款金额必须为数字', trigger: 'blur', transform: value => Number(value) }
  ],
  paymentDate: [
    { required: true, message: '请选择付款日期', trigger: 'change' }
  ],
  paymentType: [
    { required: true, message: '请选择付款方式', trigger: 'change' }
  ],
  paymentNo: [
    { required: true, message: '请输入付款单号', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref(null)
// 加载状态
const loading = ref(false)
// 提交状态
const submitting = ref(false)

// 付款方式选项
const paymentTypeOptions = [
  { value: '银行转账', label: '银行转账' },
  { value: '支票', label: '支票' },
  { value: '现金', label: '现金' },
  { value: '电子支付', label: '电子支付' },
  { value: '其他', label: '其他' }
]

// 付款状态选项
const statusOptions = [
  { value: '已付款', label: '已付款' },
  { value: '未付款', label: '未付款' },
  { value: '部分付款', label: '部分付款' }
]

// 获取合同信息
const getContractInfo = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    contractInfo.value = {
      id: contractId,
      name: '设备采购合同',
      contractNo: 'HT-2023-002',
      type: '付款合同',
      customerName: '上海设备制造有限公司',
      contractAmount: 850000,
      paidAmount: 425000,
      unpaidAmount: 425000
    }
  } catch (error) {
    console.error('获取合同信息失败', error)
    ElMessage.error('获取合同信息失败')
  } finally {
    loading.value = false
  }
}

// 获取付款记录详情
const getPaymentDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    Object.assign(paymentForm, {
      contractId: contractId,
      amount: 425000,
      paymentDate: '2023-04-20',
      paymentType: '银行转账',
      paymentNo: 'FK-2023-001',
      status: '已付款',
      remarks: '合同签订后首付款'
    })
  } catch (error) {
    console.error('获取付款记录详情失败', error)
    ElMessage.error('获取付款记录详情失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (!valid) {
      console.error('表单验证失败', fields)
      return
    }
    
    // 检查付款金额是否超过未付金额
    if (!isEdit.value && paymentForm.amount > contractInfo.value.unpaidAmount) {
      ElMessage.warning(`付款金额不能超过未付金额 ${contractInfo.value.unpaidAmount}`)
      return
    }
    
    submitting.value = true
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push(`/payment-contracts/detail/${contractId}`)
    } catch (error) {
      console.error(isEdit.value ? '更新付款记录失败' : '创建付款记录失败', error)
      ElMessage.error(isEdit.value ? '更新付款记录失败' : '创建付款记录失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}

// 取消操作
const handleCancel = () => {
  ElMessageBox.confirm('确定要取消操作吗？未保存的数据将会丢失！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push(`/payment-contracts/detail/${contractId}`)
  }).catch(() => {})
}

// 生成付款单号
const generatePaymentNo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  paymentForm.paymentNo = `FK-${year}${month}${day}-${random}`
}

// 格式化金额
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

onMounted(() => {
  getContractInfo()
  getPaymentDetail()
  
  // 如果是新增，自动生成付款单号和设置当前日期
  if (!isEdit.value) {
    generatePaymentNo()
    paymentForm.paymentDate = new Date().toISOString().split('T')[0]
  }
})
</script>

<template>
  <div class="payment-form-container">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑付款记录' : '新增付款记录' }}</h2>
    </div>
    
    <el-card class="form-card" v-loading="loading">
      <!-- 合同信息 -->
      <div class="contract-info">
        <el-descriptions title="合同信息" :column="3" border>
          <el-descriptions-item label="合同名称">{{ contractInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="合同编号">{{ contractInfo.contractNo }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ contractInfo.customerName }}</el-descriptions-item>
          <el-descriptions-item label="合同金额">{{ formatAmount(contractInfo.contractAmount) }}</el-descriptions-item>
          <el-descriptions-item label="已付金额">{{ formatAmount(contractInfo.paidAmount) }}</el-descriptions-item>
          <el-descriptions-item label="未付金额">{{ formatAmount(contractInfo.unpaidAmount) }}</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <el-divider />
      
      <!-- 付款表单 -->
      <el-form
        ref="formRef"
        :model="paymentForm"
        :rules="rules"
        label-width="100px"
        label-position="right"
        size="default"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="付款金额" prop="amount">
              <el-input-number
                v-model="paymentForm.amount"
                :min="0"
                :precision="2"
                :step="1000"
                style="width: 100%"
                placeholder="请输入付款金额"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="付款日期" prop="paymentDate">
              <el-date-picker
                v-model="paymentForm.paymentDate"
                type="date"
                placeholder="请选择付款日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="付款方式" prop="paymentType">
              <el-select v-model="paymentForm.paymentType" placeholder="请选择付款方式" style="width: 100%">
                <el-option
                  v-for="item in paymentTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="付款单号" prop="paymentNo">
              <el-input v-model="paymentForm.paymentNo" placeholder="请输入付款单号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="付款状态" prop="status">
              <el-select v-model="paymentForm.status" placeholder="请选择付款状态" style="width: 100%">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="paymentForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        
        <!-- 附件上传 -->
        <el-form-item label="付款凭证">
          <el-upload
            action="#"
            :auto-upload="false"
            multiple
            :limit="3"
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持上传PDF、图片等格式文件，单个文件不超过5MB</div>
        </el-form-item>
        
        <!-- 表单操作 -->
        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEdit ? '更新' : '保存' }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.payment-form-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.form-card {
  margin-bottom: 20px;
}

.contract-info {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.form-actions .el-button {
  min-width: 100px;
  margin: 0 10px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 10px;
}
</style>