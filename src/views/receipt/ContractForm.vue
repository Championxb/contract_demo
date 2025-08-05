<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContractStore } from '../../store/contract'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const contractStore = useContractStore()

// 判断是新增还是编辑
const isEdit = computed(() => route.params.id !== undefined)
const contractId = route.params.id

// 表单数据
const contractForm = reactive({
  name: '',
  contractNo: '',
  type: '收款合同',
  customerName: '',
  customerContact: '',
  customerPhone: '',
  contractAmount: '',
  signDate: '',
  startDate: '',
  endDate: '',
  paymentTerms: '',
  content: '',
  remarks: '',
  status: '草稿'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入合同名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  contractNo: [
    { required: true, message: '请输入合同编号', trigger: 'blur' }
  ],
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ],
  contractAmount: [
    { required: true, message: '请输入合同金额', trigger: 'blur' },
    { type: 'number', message: '合同金额必须为数字', trigger: 'blur', transform: value => Number(value) }
  ],
  signDate: [
    { required: true, message: '请选择签订日期', trigger: 'change' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' }
  ]
}

// 表单引用
const formRef = ref(null)
// 加载状态
const loading = ref(false)
// 提交状态
const submitting = ref(false)

// 客户列表
const customerOptions = ref([])
// 合同状态选项
const statusOptions = [
  { value: '草稿', label: '草稿' },
  { value: '待审批', label: '待审批' },
  { value: '执行中', label: '执行中' },
  { value: '已完成', label: '已完成' },
  { value: '已终止', label: '已终止' }
]

// 获取合同详情
const getContractDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    Object.assign(contractForm, {
      name: '软件开发服务合同',
      contractNo: 'HT-2023-001',
      type: '收款合同',
      customerName: '北京科技有限公司',
      customerContact: '王经理',
      customerPhone: '13900139001',
      contractAmount: 1200000,
      signDate: '2023-04-10',
      startDate: '2023-04-15',
      endDate: '2023-10-15',
      paymentTerms: '签订合同后支付50%，项目验收后支付50%',
      content: '本合同为软件开发服务合同，乙方为甲方提供软件系统开发服务，包括但不限于需求分析、设计、开发、测试、部署等。',
      remarks: '项目需按照合同约定的技术标准进行验收',
      status: '执行中'
    })
  } catch (error) {
    console.error('获取合同详情失败', error)
    ElMessage.error('获取合同详情失败')
  } finally {
    loading.value = false
  }
}

// 获取客户列表
const getCustomers = async () => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟数据
    customerOptions.value = [
      { value: '北京科技有限公司', label: '北京科技有限公司' },
      { value: '上海信息技术有限公司', label: '上海信息技术有限公司' },
      { value: '广州信息科技有限公司', label: '广州信息科技有限公司' },
      { value: '深圳教育科技有限公司', label: '深圳教育科技有限公司' },
      { value: '杭州网络科技有限公司', label: '杭州网络科技有限公司' }
    ]
  } catch (error) {
    console.error('获取客户列表失败', error)
    ElMessage.error('获取客户列表失败')
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
    
    submitting.value = true
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/receipt-contracts')
    } catch (error) {
      console.error(isEdit.value ? '更新合同失败' : '创建合同失败', error)
      ElMessage.error(isEdit.value ? '更新合同失败' : '创建合同失败')
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
    router.push('/receipt-contracts')
  }).catch(() => {})
}

// 生成合同编号
const generateContractNo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  contractForm.contractNo = `HT-${year}${month}${day}-${random}`
}

// 选择客户后自动填充联系人信息
const handleCustomerChange = (value) => {
  // 实际项目中应该根据选择的客户从后端获取联系人信息
  // 这里简单模拟
  if (value === '北京科技有限公司') {
    contractForm.customerContact = '王经理'
    contractForm.customerPhone = '13900139001'
  } else if (value === '上海信息技术有限公司') {
    contractForm.customerContact = '张经理'
    contractForm.customerPhone = '13800138001'
  } else if (value === '广州信息科技有限公司') {
    contractForm.customerContact = '李经理'
    contractForm.customerPhone = '13700137001'
  } else {
    contractForm.customerContact = ''
    contractForm.customerPhone = ''
  }
}

onMounted(() => {
  getContractDetail()
  getCustomers()
  
  // 如果是新增，自动生成合同编号
  if (!isEdit.value) {
    generateContractNo()
  }
})
</script>

<template>
  <div class="contract-form-container">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑合同' : '新增合同' }}</h2>
    </div>
    
    <el-card class="form-card" v-loading="loading">
      <el-form
        ref="formRef"
        :model="contractForm"
        :rules="rules"
        label-width="100px"
        label-position="right"
        size="default"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3>基本信息</h3>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="合同名称" prop="name">
                <el-input v-model="contractForm.name" placeholder="请输入合同名称" />
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input v-model="contractForm.contractNo" placeholder="请输入合同编号" />
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="合同类型" prop="type">
                <el-input v-model="contractForm.type" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="客户名称" prop="customerName">
                <el-select
                  v-model="contractForm.customerName"
                  placeholder="请选择客户"
                  filterable
                  clearable
                  style="width: 100%"
                  @change="handleCustomerChange"
                >
                  <el-option
                    v-for="item in customerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="联系人" prop="customerContact">
                <el-input v-model="contractForm.customerContact" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="联系电话" prop="customerPhone">
                <el-input v-model="contractForm.customerPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="合同金额" prop="contractAmount">
                <el-input-number
                  v-model="contractForm.contractAmount"
                  :min="0"
                  :precision="2"
                  :step="1000"
                  style="width: 100%"
                  placeholder="请输入合同金额"
                />
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="签订日期" prop="signDate">
                <el-date-picker
                  v-model="contractForm.signDate"
                  type="date"
                  placeholder="请选择签订日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="合同状态" prop="status">
                <el-select v-model="contractForm.status" placeholder="请选择合同状态" style="width: 100%">
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
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  v-model="contractForm.startDate"
                  type="date"
                  placeholder="请选择开始日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="contractForm.endDate"
                  type="date"
                  placeholder="请选择结束日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <!-- 付款条件 -->
        <div class="form-section">
          <div class="section-header">
            <h3>付款条件</h3>
          </div>
          
          <el-form-item prop="paymentTerms">
            <el-input
              v-model="contractForm.paymentTerms"
              type="textarea"
              :rows="3"
              placeholder="请输入付款条件"
            />
          </el-form-item>
        </div>
        
        <!-- 合同内容 -->
        <div class="form-section">
          <div class="section-header">
            <h3>合同内容</h3>
          </div>
          
          <el-form-item prop="content">
            <el-input
              v-model="contractForm.content"
              type="textarea"
              :rows="5"
              placeholder="请输入合同内容"
            />
          </el-form-item>
        </div>
        
        <!-- 备注 -->
        <div class="form-section">
          <div class="section-header">
            <h3>备注</h3>
          </div>
          
          <el-form-item prop="remarks">
            <el-input
              v-model="contractForm.remarks"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </div>
        
        <!-- 附件上传 -->
        <div class="form-section">
          <div class="section-header">
            <h3>附件上传</h3>
          </div>
          
          <el-upload
            action="#"
            :auto-upload="false"
            multiple
            :limit="5"
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持上传PDF、Word、Excel、图片等格式文件，单个文件不超过10MB</div>
        </div>
        
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
.contract-form-container {
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

.form-section {
  margin-bottom: 30px;
}

.section-header {
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
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