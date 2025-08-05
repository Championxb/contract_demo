<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSystemStore } from '../../store/system'
import { ElMessage, ElMessageBox } from 'element-plus'

const systemStore = useSystemStore()

// 用户列表
const userList = ref([])
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
  username: '',
  realName: '',
  department: '',
  status: ''
})

// 用户状态选项
const statusOptions = [
  { value: '1', label: '启用' },
  { value: '0', label: '禁用' }
]

// 部门选项
const departmentOptions = ref([
  { value: '信息技术部', label: '信息技术部' },
  { value: '财务部', label: '财务部' },
  { value: '人力资源部', label: '人力资源部' },
  { value: '销售部', label: '销售部' },
  { value: '研发部', label: '研发部' }
])

// 角色选项
const roleOptions = ref([
  { value: '1', label: '系统管理员' },
  { value: '2', label: '部门经理' },
  { value: '3', label: '普通用户' }
])

// 对话框可见性
const dialogVisible = ref(false)
// 对话框标题
const dialogTitle = ref('新增用户')
// 表单引用
const userFormRef = ref(null)
// 表单数据
const userForm = reactive({
  id: null,
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  department: '',
  roleIds: [],
  status: '1'
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = []
    for (let i = 1; i <= 25; i++) {
      mockData.push({
        id: i,
        username: `user${i}`,
        realName: `用户${i}`,
        email: `user${i}@example.com`,
        phone: `1380013${i.toString().padStart(4, '0')}`,
        department: i % 5 === 0 ? '研发部' : i % 4 === 0 ? '销售部' : i % 3 === 0 ? '人力资源部' : i % 2 === 0 ? '财务部' : '信息技术部',
        roles: i === 1 ? ['系统管理员'] : i % 3 === 0 ? ['部门经理'] : ['普通用户'],
        status: i % 7 === 0 ? '0' : '1',
        createTime: '2023-05-15 10:30:00'
      })
    }
    
    // 模拟分页
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    userList.value = mockData.slice(start, end)
    pagination.total = mockData.length
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索用户
const handleSearch = () => {
  pagination.currentPage = 1
  getUserList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 页码变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  getUserList()
}

// 每页条数变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  getUserList()
}

// 打开新增对话框
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  resetForm()
  
  // 填充表单数据
  userForm.id = row.id
  userForm.username = row.username
  userForm.password = '' // 编辑时不显示密码
  userForm.realName = row.realName
  userForm.email = row.email
  userForm.phone = row.phone
  userForm.department = row.department
  userForm.roleIds = row.roles.map(role => {
    if (role === '系统管理员') return '1'
    if (role === '部门经理') return '2'
    return '3'
  })
  userForm.status = row.status
  
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.realName} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      ElMessage.success('删除成功')
      getUserList()
    } catch (error) {
      console.error('删除用户失败', error)
      ElMessage.error('删除用户失败')
    }
  }).catch(() => {})
}

// 重置表单
const resetForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  
  userForm.id = null
  userForm.username = ''
  userForm.password = ''
  userForm.realName = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.department = ''
  userForm.roleIds = []
  userForm.status = '1'
}

// 提交表单
const submitForm = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 这里应该是实际的API调用，现在先模拟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        ElMessage.success(userForm.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        getUserList()
      } catch (error) {
        console.error(userForm.id ? '更新用户失败' : '添加用户失败', error)
        ElMessage.error(userForm.id ? '更新用户失败' : '添加用户失败')
      }
    }
  })
}

// 修改用户状态
const changeUserStatus = async (row) => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`已${row.status === '1' ? '启用' : '禁用'}用户`)
  } catch (error) {
    console.error('修改用户状态失败', error)
    ElMessage.error('修改用户状态失败')
    // 恢复原状态
    row.status = row.status === '1' ? '0' : '1'
  }
}

// 重置密码
const resetPassword = (row) => {
  ElMessageBox.confirm(`确定要重置 ${row.realName} 的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      ElMessage.success('密码重置成功，新密码已发送至用户邮箱')
    } catch (error) {
      console.error('重置密码失败', error)
      ElMessage.error('重置密码失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="user-management-container">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        
        <el-form-item label="姓名">
          <el-input v-model="searchForm.realName" placeholder="请输入姓名" clearable />
        </el-form-item>
        
        <el-form-item label="部门">
          <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增用户
        </el-button>
      </div>
      
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="realName" label="姓名" min-width="100" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="department" label="部门" min-width="120" />
        <el-table-column label="角色" min-width="120">
          <template #default="scope">
            <el-tag
              v-for="(role, index) in scope.row.roles"
              :key="index"
              :type="role === '系统管理员' ? 'danger' : role === '部门经理' ? 'warning' : 'info'"
              class="role-tag"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="changeUserStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    
    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="!!userForm.id" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password" v-if="!userForm.id">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        
        <el-form-item label="部门" prop="department">
          <el-select v-model="userForm.department" placeholder="请选择部门" style="width: 100%">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="userForm.roleIds" placeholder="请选择角色" multiple style="width: 100%">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-management-container {
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

.table-header {
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.role-tag {
  margin-right: 5px;
}

.role-tag:last-child {
  margin-right: 0;
}
</style>