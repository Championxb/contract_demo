<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContractStore } from '../../store/contract'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const contractStore = useContractStore()

// 合同ID
const contractId = route.params.id
// 合同详情
const contractDetail = ref({})
// 收款记录列表
const receiptRecords = ref([])
// 合同附件列表
const attachments = ref([])
// 合同审批记录
const approvalRecords = ref([])
// 加载状态
const loading = ref(false)

// 获取合同详情
const getContractDetail = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    contractDetail.value = {
      id: contractId,
      name: '软件开发服务合同',
      contractNo: 'HT-2023-001',
      type: '收款合同',
      customerName: '北京科技有限公司',
      customerContact: '王经理',
      customerPhone: '13900139001',
      contractAmount: 1200000,
      receivedAmount: 600000,
      unreceiveAmount: 600000,
      signDate: '2023-04-10',
      startDate: '2023-04-15',
      endDate: '2023-10-15',
      paymentTerms: '签订合同后支付50%，项目验收后支付50%',
      content: '本合同为软件开发服务合同，乙方为甲方提供软件系统开发服务，包括但不限于需求分析、设计、开发、测试、部署等。',
      remarks: '项目需按照合同约定的技术标准进行验收',
      status: '执行中',
      createBy: '张三',
      createTime: '2023-04-05 10:20:00',
      updateBy: '李四',
      updateTime: '2023-04-10 09:30:00'
    }
  } catch (error) {
    console.error('获取合同详情失败', error)
    ElMessage.error('获取合同详情失败')
  } finally {
    loading.value = false
  }
}

// 获取收款记录
const getReceiptRecords = async () => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟数据
    receiptRecords.value = [
      {
        id: 1,
        contractId: contractId,
        amount: 600000,
        receiptDate: '2023-04-15',
        receiptType: '银行转账',
        receiptNo: 'SK-2023-001',
        status: '已收款',
        remarks: '合同签订后首付款',
        createBy: '王五',
        createTime: '2023-04-15 15:30:00'
      }
    ]
  } catch (error) {
    console.error('获取收款记录失败', error)
    ElMessage.error('获取收款记录失败')
  }
}

// 获取合同附件
const getAttachments = async () => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟数据
    attachments.value = [
      {
        id: 1,
        name: '软件开发服务合同.pdf',
        size: '3.2MB',
        type: 'application/pdf',
        uploadTime: '2023-04-05 10:30:00',
        uploadBy: '张三'
      },
      {
        id: 2,
        name: '需求说明书.docx',
        size: '2.5MB',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadTime: '2023-04-05 10:35:00',
        uploadBy: '张三'
      },
      {
        id: 3,
        name: '项目计划书.pptx',
        size: '4.1MB',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        uploadTime: '2023-04-05 10:40:00',
        uploadBy: '张三'
      }
    ]
  } catch (error) {
    console.error('获取合同附件失败', error)
    ElMessage.error('获取合同附件失败')
  }
}

// 获取审批记录
const getApprovalRecords = async () => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟数据
    approvalRecords.value = [
      {
        id: 1,
        type: '合同审批',
        approver: '李经理',
        approvalTime: '2023-04-07 10:20:00',
        status: '通过',
        comments: '合同内容无异议，同意签订'
      },
      {
        id: 2,
        type: '合同审批',
        approver: '王总监',
        approvalTime: '2023-04-08 14:30:00',
        status: '通过',
        comments: '项目需求已核对，价格合理'
      },
      {
        id: 3,
        type: '合同审批',
        approver: '张总',
        approvalTime: '2023-04-09 09:15:00',
        status: '通过',
        comments: '同意签订合同'
      }
    ]
  } catch (error) {
    console.error('获取审批记录失败', error)
    ElMessage.error('获取审批记录失败')
  }
}

// 编辑合同
const handleEdit = () => {
  router.push(`/receipt-contracts/edit/${contractId}`)
}

// 删除合同
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该合同吗？删除后无法恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      ElMessage.success('删除成功')
      router.push('/receipt-contracts')
    } catch (error) {
      console.error('删除合同失败', error)
      ElMessage.error('删除合同失败')
    }
  }).catch(() => {})
}

// 新增收款记录
const handleAddReceipt = () => {
  router.push(`/receipt-contracts/receipt/${contractId}`)
}

// 下载附件
const handleDownload = (file) => {
  ElMessage.success(`开始下载文件：${file.name}`)
  // 实际项目中这里应该调用下载API
}

// 预览附件
const handlePreview = (file) => {
  ElMessage.info(`预览文件：${file.name}`)
  // 实际项目中这里应该调用预览API
}

// 格式化金额
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

// 返回列表
const goBack = () => {
  router.push('/receipt-contracts')
}

onMounted(() => {
  getContractDetail()
  getReceiptRecords()
  getAttachments()
  getApprovalRecords()
})
</script>

<template>
  <div class="contract-detail-container">
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack">
          <el-icon><Back /></el-icon>返回
        </el-button>
        <h2>合同详情</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>删除
        </el-button>
      </div>
    </div>
    
    <!-- 合同基本信息 -->
    <el-card class="detail-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <h3>基本信息</h3>
          <el-tag :type="contractDetail.status === '执行中' ? 'success' : contractDetail.status === '已完成' ? 'info' : 'warning'">
            {{ contractDetail.status }}
          </el-tag>
        </div>
      </template>
      
      <el-descriptions :column="3" border>
        <el-descriptions-item label="合同名称">{{ contractDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="合同编号">{{ contractDetail.contractNo }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">{{ contractDetail.type }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ contractDetail.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ contractDetail.customerContact }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ contractDetail.customerPhone }}</el-descriptions-item>
        <el-descriptions-item label="合同金额">{{ formatAmount(contractDetail.contractAmount) }}</el-descriptions-item>
        <el-descriptions-item label="已收金额">{{ formatAmount(contractDetail.receivedAmount) }}</el-descriptions-item>
        <el-descriptions-item label="未收金额">{{ formatAmount(contractDetail.unreceiveAmount) }}</el-descriptions-item>
        <el-descriptions-item label="签订日期">{{ contractDetail.signDate }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ contractDetail.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ contractDetail.endDate }}</el-descriptions-item>
        <el-descriptions-item label="付款条件" :span="3">{{ contractDetail.paymentTerms }}</el-descriptions-item>
        <el-descriptions-item label="合同内容" :span="3">{{ contractDetail.content }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="3">{{ contractDetail.remarks }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ contractDetail.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ contractDetail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ contractDetail.updateTime }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    
    <!-- 收款记录 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <h3>收款记录</h3>
          <el-button type="primary" @click="handleAddReceipt">
            <el-icon><Plus /></el-icon>新增收款
          </el-button>
        </div>
      </template>
      
      <el-table :data="receiptRecords" style="width: 100%" border stripe>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="receiptDate" label="收款日期" min-width="120" />
        <el-table-column prop="amount" label="收款金额" min-width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="receiptType" label="收款方式" min-width="120" />
        <el-table-column prop="receiptNo" label="收款单号" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已收款' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createBy" label="创建人" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="empty-block" v-if="receiptRecords.length === 0">
        <el-empty description="暂无收款记录" />
      </div>
    </el-card>
    
    <!-- 合同附件 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <h3>合同附件</h3>
          <el-button type="primary">
            <el-icon><Upload /></el-icon>上传附件
          </el-button>
        </div>
      </template>
      
      <el-table :data="attachments" style="width: 100%" border stripe>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="name" label="文件名称" min-width="200" />
        <el-table-column prop="size" label="文件大小" width="100" />
        <el-table-column prop="uploadBy" label="上传人" width="100" />
        <el-table-column prop="uploadTime" label="上传时间" min-width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handlePreview(scope.row)">预览</el-button>
            <el-button link type="primary" @click="handleDownload(scope.row)">下载</el-button>
            <el-button link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="empty-block" v-if="attachments.length === 0">
        <el-empty description="暂无附件" />
      </div>
    </el-card>
    
    <!-- 审批记录 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <h3>审批记录</h3>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in approvalRecords"
          :key="index"
          :type="activity.status === '通过' ? 'success' : activity.status === '拒绝' ? 'danger' : 'primary'"
          :timestamp="activity.approvalTime"
        >
          <div class="timeline-title">
            <span>{{ activity.type }}</span>
            <el-tag :type="activity.status === '通过' ? 'success' : 'danger'" size="small">
              {{ activity.status }}
            </el-tag>
          </div>
          <div class="timeline-content">
            <p><strong>审批人：</strong>{{ activity.approver }}</p>
            <p><strong>审批意见：</strong>{{ activity.comments }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
      
      <div class="empty-block" v-if="approvalRecords.length === 0">
        <el-empty description="暂无审批记录" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.contract-detail-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left h2 {
  margin: 0 0 0 15px;
  font-size: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.empty-block {
  padding: 30px 0;
}

.timeline-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.timeline-content {
  color: #606266;
  font-size: 14px;
}

.timeline-content p {
  margin: 5px 0;
}
</style>