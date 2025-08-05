<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContractStore } from '../../store/contract'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const contractStore = useContractStore()

// 表格数据
const tableData = ref([])
// 加载状态
const loading = ref(false)
// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

// 合同状态选项
const statusOptions = [
  { value: '', label: '全部状态' },
  { value: '草稿', label: '草稿' },
  { value: '待审批', label: '待审批' },
  { value: '执行中', label: '执行中' },
  { value: '已完成', label: '已完成' },
  { value: '已终止', label: '已终止' }
]

// 获取合同列表
const getContractList = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    const mockData = []
    for (let i = 1; i <= 25; i++) {
      mockData.push({
        id: i.toString(),
        name: `设备采购合同${i}`,
        contractNo: `HT-2023-${String(i).padStart(3, '0')}`,
        customerName: `供应商${i}`,
        contractAmount: Math.floor(Math.random() * 1000000) + 100000,
        signDate: '2023-04-15',
        endDate: '2023-10-15',
        status: getRandomStatus(),
        createTime: '2023-04-10 10:00:00'
      })
    }
    
    // 模拟搜索过滤
    let filteredData = [...mockData]
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.contractNo.toLowerCase().includes(keyword) ||
        item.customerName.toLowerCase().includes(keyword)
      )
    }
    
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const startDate = new Date(searchForm.dateRange[0]).getTime()
      const endDate = new Date(searchForm.dateRange[1]).getTime()
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.signDate).getTime()
        return itemDate >= startDate && itemDate <= endDate
      })
    }
    
    // 模拟分页
    pagination.total = filteredData.length
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
  } catch (error) {
    console.error('获取合同列表失败', error)
    ElMessage.error('获取合同列表失败')
  } finally {
    loading.value = false
  }
}

// 随机生成状态
const getRandomStatus = () => {
  const statuses = ['草稿', '待审批', '执行中', '已完成', '已终止']
  const weights = [0.1, 0.2, 0.4, 0.2, 0.1] // 权重，使执行中的概率更高
  
  let random = Math.random()
  let sum = 0
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random < sum) {
      return statuses[i]
    }
  }
  
  return statuses[0]
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  getContractList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 处理分页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  getContractList()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  getContractList()
}

// 查看合同详情
const viewContract = (row) => {
  router.push(`/payment-contracts/detail/${row.id}`)
}

// 编辑合同
const editContract = (row) => {
  router.push(`/payment-contracts/edit/${row.id}`)
}

// 删除合同
const deleteContract = (row) => {
  ElMessageBox.confirm(`确定要删除合同"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      ElMessage.success('删除成功')
      getContractList()
    } catch (error) {
      console.error('删除合同失败', error)
      ElMessage.error('删除合同失败')
    }
  }).catch(() => {})
}

// 新增合同
const addContract = () => {
  router.push('/payment-contracts/add')
}

// 格式化金额
const formatAmount = (row, column, cellValue) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(cellValue)
}

// 获取状态对应的标签类型
const getStatusType = (status) => {
  switch (status) {
    case '草稿':
      return 'info'
    case '待审批':
      return 'warning'
    case '执行中':
      return 'primary'
    case '已完成':
      return 'success'
    case '已终止':
      return 'danger'
    default:
      return ''
  }
}

onMounted(() => {
  getContractList()
})
</script>

<template>
  <div class="contract-list-container">
    <div class="page-header">
      <h2>付款合同管理</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="合同名称/编号/供应商"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="合同状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="签订日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-operations">
        <el-button type="primary" @click="addContract">
          <el-icon><Plus /></el-icon>新增合同
        </el-button>
      </div>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="contractNo" label="合同编号" width="120" />
        <el-table-column prop="name" label="合同名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="customerName" label="供应商" width="150" show-overflow-tooltip />
        <el-table-column prop="contractAmount" label="合同金额" width="150" :formatter="formatAmount" />
        <el-table-column prop="signDate" label="签订日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewContract(scope.row)">查看</el-button>
            <el-button link type="primary" @click="editContract(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteContract(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.contract-list-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.table-operations {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>