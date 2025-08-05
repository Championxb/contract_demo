<script setup>
import { ref, onMounted } from 'vue'
import { useContractStore } from '../store/contract'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
])

const contractStore = useContractStore()

// 统计数据
const statistics = ref({
  totalContracts: 0,
  paymentContracts: 0,
  receiptContracts: 0,
  draftContracts: 0,
  pendingContracts: 0,
  executingContracts: 0,
  completedContracts: 0,
  terminatedContracts: 0,
  totalAmount: 0,
  paymentAmount: 0,
  receiptAmount: 0
})

// 图表引用
const contractTypeChartRef = ref(null)
const contractStatusChartRef = ref(null)
const contractTrendChartRef = ref(null)
const amountDistributionChartRef = ref(null)

// 加载状态
const loading = ref(false)

// 获取统计数据
const getStatistics = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    statistics.value = {
      totalContracts: 56,
      paymentContracts: 24,
      receiptContracts: 32,
      draftContracts: 8,
      pendingContracts: 12,
      executingContracts: 28,
      completedContracts: 6,
      terminatedContracts: 2,
      totalAmount: 15680000,
      paymentAmount: 6520000,
      receiptAmount: 9160000
    }
    
    // 初始化图表
    initCharts()
  } catch (error) {
    console.error('获取统计数据失败', error)
  } finally {
    loading.value = false
  }
}

// 初始化图表
const initCharts = () => {
  // 合同类型分布图
  initContractTypeChart()
  
  // 合同状态分布图
  initContractStatusChart()
  
  // 合同金额分布图
  initAmountDistributionChart()
  
  // 合同趋势图
  initContractTrendChart()
  
  // 监听窗口大小变化，重新调整图表大小
  window.addEventListener('resize', () => {
    const charts = [
      contractTypeChartRef.value,
      contractStatusChartRef.value,
      contractTrendChartRef.value,
      amountDistributionChartRef.value
    ]
    
    charts.forEach(chart => {
      if (chart) {
        chart.resize()
      }
    })
  })
}

// 初始化合同类型分布图
const initContractTypeChart = () => {
  const chartDom = document.getElementById('contract-type-chart')
  if (!chartDom) return
  
  const chart = echarts.init(chartDom)
  contractTypeChartRef.value = chart
  
  const option = {
    title: {
      text: '合同类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: ['付款合同', '收款合同']
    },
    series: [
      {
        name: '合同类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: statistics.value.paymentContracts, name: '付款合同' },
          { value: statistics.value.receiptContracts, name: '收款合同' }
        ]
      }
    ]
  }
  
  chart.setOption(option)
}

// 初始化合同状态分布图
const initContractStatusChart = () => {
  const chartDom = document.getElementById('contract-status-chart')
  if (!chartDom) return
  
  const chart = echarts.init(chartDom)
  contractStatusChartRef.value = chart
  
  const option = {
    title: {
      text: '合同状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: ['草稿', '待审批', '执行中', '已完成', '已终止']
    },
    series: [
      {
        name: '合同状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: statistics.value.draftContracts, name: '草稿' },
          { value: statistics.value.pendingContracts, name: '待审批' },
          { value: statistics.value.executingContracts, name: '执行中' },
          { value: statistics.value.completedContracts, name: '已完成' },
          { value: statistics.value.terminatedContracts, name: '已终止' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
}

// 初始化合同金额分布图
const initAmountDistributionChart = () => {
  const chartDom = document.getElementById('amount-distribution-chart')
  if (!chartDom) return
  
  const chart = echarts.init(chartDom)
  amountDistributionChartRef.value = chart
  
  const option = {
    title: {
      text: '合同金额分布（万元）',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 万元'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['付款合同', '收款合同', '总金额']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 万'
      }
    },
    series: [
      {
        name: '合同金额',
        type: 'bar',
        data: [
          statistics.value.paymentAmount / 10000,
          statistics.value.receiptAmount / 10000,
          statistics.value.totalAmount / 10000
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#5470c6', '#91cc75', '#ee6666']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
}

// 初始化合同趋势图
const initContractTrendChart = () => {
  const chartDom = document.getElementById('contract-trend-chart')
  if (!chartDom) return
  
  const chart = echarts.init(chartDom)
  contractTrendChartRef.value = chart
  
  // 模拟近6个月的数据
  const months = []
  const paymentData = []
  const receiptData = []
  
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
    months.push(monthStr)
    
    // 模拟数据
    paymentData.push(Math.floor(Math.random() * 5) + 1)
    receiptData.push(Math.floor(Math.random() * 6) + 2)
  }
  
  const option = {
    title: {
      text: '近6个月合同数量趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['付款合同', '收款合同'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '付款合同',
        type: 'line',
        data: paymentData,
        smooth: true
      },
      {
        name: '收款合同',
        type: 'line',
        data: receiptData,
        smooth: true
      }
    ]
  }
  
  chart.setOption(option)
}

// 格式化金额
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

onMounted(() => {
  getStatistics()
})
</script>

<template>
  <div class="dashboard-container" v-loading="loading">
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-card-content">
              <div class="stat-icon blue">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-title">合同总数</div>
                <div class="stat-value">{{ statistics.totalContracts }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-card-content">
              <div class="stat-icon green">
                <el-icon><Wallet /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-title">收款合同</div>
                <div class="stat-value">{{ statistics.receiptContracts }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-card-content">
              <div class="stat-icon orange">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-title">付款合同</div>
                <div class="stat-value">{{ statistics.paymentContracts }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-card-content">
              <div class="stat-icon purple">
                <el-icon><Coin /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-title">合同总金额</div>
                <div class="stat-value">{{ (statistics.totalAmount / 10000).toFixed(2) }} 万</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <div id="contract-type-chart" class="chart"></div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <div id="contract-status-chart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" class="mt-20">
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <div id="amount-distribution-chart" class="chart"></div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <div id="contract-trend-chart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 待办事项 -->
    <div class="todo-container">
      <el-card shadow="hover" class="todo-card">
        <template #header>
          <div class="card-header">
            <span>待办事项</span>
            <el-button type="primary" size="small">查看全部</el-button>
          </div>
        </template>
        
        <el-table :data="[
          { id: 1, title: '软件开发服务合同审批', type: '合同审批', date: '2023-08-05', status: '待审批' },
          { id: 2, title: '设备采购合同付款', type: '付款提醒', date: '2023-08-07', status: '待付款' },
          { id: 3, title: '网络服务合同收款', type: '收款提醒', date: '2023-08-10', status: '待收款' },
          { id: 4, title: '办公用品采购合同到期', type: '合同到期', date: '2023-08-15', status: '即将到期' }
        ]" style="width: 100%">
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button link type="primary" size="small">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
// 获取状态对应的标签类型
function getStatusType(status) {
  switch (status) {
    case '待审批':
      return 'warning'
    case '待付款':
      return 'danger'
    case '待收款':
      return 'success'
    case '即将到期':
      return 'info'
    default:
      return ''
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
}

.stat-card-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.stat-icon .el-icon {
  font-size: 24px;
  color: #fff;
}

.blue {
  background-color: #409eff;
}

.green {
  background-color: #67c23a;
}

.orange {
  background-color: #e6a23c;
}

.purple {
  background-color: #8e44ad;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-container {
  margin-bottom: 20px;
}

.chart-card {
  height: 350px;
}

.chart {
  width: 100%;
  height: 300px;
}

.mt-20 {
  margin-top: 20px;
}

.todo-container {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>