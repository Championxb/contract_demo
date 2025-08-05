<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSystemStore } from '../../store/system'
import { ElMessage, ElMessageBox } from 'element-plus'

const systemStore = useSystemStore()

// 角色列表
const roleList = ref([])
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
  name: '',
  status: ''
})

// 角色状态选项
const statusOptions = [
  { value: '1', label: '启用' },
  { value: '0', label: '禁用' }
]

// 对话框可见性
const dialogVisible = ref(false)
// 对话框标题
const dialogTitle = ref('新增角色')
// 表单引用
const roleFormRef = ref(null)
// 表单数据
const roleForm = reactive({
  id: null,
  name: '',
  code: '',
  sort: 0,
  status: '1',
  description: '',
  menuIds: []
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', message: '排序号必须为数字', trigger: 'blur', transform: value => Number(value) }
  ]
}

// 权限分配对话框可见性
const permissionDialogVisible = ref(false)
// 当前选中的角色
const currentRole = ref(null)
// 权限树数据
const permissionTreeData = ref([])
// 选中的权限
const checkedPermissions = ref([])
// 默认展开的节点
const defaultExpandedKeys = ref([])

// 获取角色列表
const getRoleList = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = [
      {
        id: 1,
        name: '系统管理员',
        code: 'ADMIN',
        sort: 1,
        status: '1',
        description: '系统管理员，拥有所有权限',
        createTime: '2023-01-01 00:00:00'
      },
      {
        id: 2,
        name: '部门经理',
        code: 'MANAGER',
        sort: 2,
        status: '1',
        description: '部门经理，拥有部门内所有权限',
        createTime: '2023-01-02 00:00:00'
      },
      {
        id: 3,
        name: '普通用户',
        code: 'USER',
        sort: 3,
        status: '1',
        description: '普通用户，拥有基本操作权限',
        createTime: '2023-01-03 00:00:00'
      },
      {
        id: 4,
        name: '合同管理员',
        code: 'CONTRACT_ADMIN',
        sort: 4,
        status: '1',
        description: '合同管理员，负责合同相关操作',
        createTime: '2023-01-04 00:00:00'
      },
      {
        id: 5,
        name: '财务人员',
        code: 'FINANCE',
        sort: 5,
        status: '1',
        description: '财务人员，负责财务相关操作',
        createTime: '2023-01-05 00:00:00'
      },
      {
        id: 6,
        name: '只读用户',
        code: 'READONLY',
        sort: 6,
        status: '1',
        description: '只读用户，只有查看权限',
        createTime: '2023-01-06 00:00:00'
      }
    ]
    
    // 模拟分页
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    roleList.value = mockData.slice(start, end)
    pagination.total = mockData.length
  } catch (error) {
    console.error('获取角色列表失败', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 获取权限树数据
const getPermissionTree = async () => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    permissionTreeData.value = [
      {
        id: 1,
        label: '系统管理',
        children: [
          {
            id: 11,
            label: '用户管理',
            children: [
              { id: 111, label: '查看用户' },
              { id: 112, label: '新增用户' },
              { id: 113, label: '编辑用户' },
              { id: 114, label: '删除用户' }
            ]
          },
          {
            id: 12,
            label: '角色管理',
            children: [
              { id: 121, label: '查看角色' },
              { id: 122, label: '新增角色' },
              { id: 123, label: '编辑角色' },
              { id: 124, label: '删除角色' }
            ]
          },
          {
            id: 13,
            label: '部门管理',
            children: [
              { id: 131, label: '查看部门' },
              { id: 132, label: '新增部门' },
              { id: 133, label: '编辑部门' },
              { id: 134, label: '删除部门' }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '合同管理',
        children: [
          {
            id: 21,
            label: '付款合同',
            children: [
              { id: 211, label: '查看合同' },
              { id: 212, label: '新增合同' },
              { id: 213, label: '编辑合同' },
              { id: 214, label: '删除合同' },
              { id: 215, label: '审批合同' }
            ]
          },
          {
            id: 22,
            label: '收款合同',
            children: [
              { id: 221, label: '查看合同' },
              { id: 222, label: '新增合同' },
              { id: 223, label: '编辑合同' },
              { id: 224, label: '删除合同' },
              { id: 225, label: '审批合同' }
            ]
          }
        ]
      },
      {
        id: 3,
        label: '付款管理',
        children: [
          { id: 31, label: '查看付款记录' },
          { id: 32, label: '新增付款记录' },
          { id: 33, label: '编辑付款记录' },
          { id: 34, label: '删除付款记录' }
        ]
      },
      {
        id: 4,
        label: '收款管理',
        children: [
          { id: 41, label: '查看收款记录' },
          { id: 42, label: '新增收款记录' },
          { id: 43, label: '编辑收款记录' },
          { id: 44, label: '删除收款记录' }
        ]
      },
      {
        id: 5,
        label: '统计分析',
        children: [
          { id: 51, label: '合同统计' },
          { id: 52, label: '付款统计' },
          { id: 53, label: '收款统计' }
        ]
      }
    ]
    
    // 设置默认展开的节点
    defaultExpandedKeys.value = permissionTreeData.value.map(item => item.id)
  } catch (error) {
    console.error('获取权限树失败', error)
    ElMessage.error('获取权限树失败')
  }
}

// 获取角色权限
const getRolePermissions = async (roleId) => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据 - 根据角色ID返回不同的权限
    let permissions = []
    
    if (roleId === 1) { // 系统管理员
      // 所有权限
      permissions = [1, 11, 12, 13, 111, 112, 113, 114, 121, 122, 123, 124, 131, 132, 133, 134, 2, 21, 22, 211, 212, 213, 214, 215, 221, 222, 223, 224, 225, 3, 31, 32, 33, 34, 4, 41, 42, 43, 44, 5, 51, 52, 53]
    } else if (roleId === 2) { // 部门经理
      // 部分管理权限
      permissions = [1, 11, 111, 112, 113, 2, 21, 22, 211, 212, 213, 215, 221, 222, 223, 225, 3, 31, 32, 33, 4, 41, 42, 43, 5, 51, 52, 53]
    } else if (roleId === 3) { // 普通用户
      // 基本查看权限
      permissions = [1, 11, 111, 2, 21, 22, 211, 221, 3, 31, 4, 41, 5, 51, 52, 53]
    } else if (roleId === 4) { // 合同管理员
      // 合同相关权限
      permissions = [2, 21, 22, 211, 212, 213, 214, 215, 221, 222, 223, 224, 225, 3, 31, 32, 33, 34, 4, 41, 42, 43, 44]
    } else if (roleId === 5) { // 财务人员
      // 财务相关权限
      permissions = [2, 21, 22, 211, 221, 3, 31, 32, 33, 34, 4, 41, 42, 43, 44, 5, 51, 52, 53]
    } else if (roleId === 6) { // 只读用户
      // 只读权限
      permissions = [1, 11, 111, 12, 121, 13, 131, 2, 21, 211, 22, 221, 3, 31, 4, 41, 5, 51, 52, 53]
    }
    
    checkedPermissions.value = permissions
  } catch (error) {
    console.error('获取角色权限失败', error)
    ElMessage.error('获取角色权限失败')
  }
}

// 搜索角色
const handleSearch = () => {
  pagination.currentPage = 1
  getRoleList()
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
  getRoleList()
}

// 每页条数变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  getRoleList()
}

// 打开新增对话框
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogTitle.value = '编辑角色'
  resetForm()
  
  // 填充表单数据
  roleForm.id = row.id
  roleForm.name = row.name
  roleForm.code = row.code
  roleForm.sort = row.sort
  roleForm.status = row.status
  roleForm.description = row.description
  
  dialogVisible.value = true
}

// 删除角色
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除角色 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      ElMessage.success('删除成功')
      getRoleList()
    } catch (error) {
      console.error('删除角色失败', error)
      ElMessage.error('删除角色失败')
    }
  }).catch(() => {})
}

// 重置表单
const resetForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
  
  roleForm.id = null
  roleForm.name = ''
  roleForm.code = ''
  roleForm.sort = 0
  roleForm.status = '1'
  roleForm.description = ''
  roleForm.menuIds = []
}

// 提交表单
const submitForm = async () => {
  if (!roleFormRef.value) return
  
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 这里应该是实际的API调用，现在先模拟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        ElMessage.success(roleForm.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        getRoleList()
      } catch (error) {
        console.error(roleForm.id ? '更新角色失败' : '添加角色失败', error)
        ElMessage.error(roleForm.id ? '更新角色失败' : '添加角色失败')
      }
    }
  })
}

// 修改角色状态
const changeRoleStatus = async (row) => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`已${row.status === '1' ? '启用' : '禁用'}角色`)
  } catch (error) {
    console.error('修改角色状态失败', error)
    ElMessage.error('修改角色状态失败')
    // 恢复原状态
    row.status = row.status === '1' ? '0' : '1'
  }
}

// 打开权限分配对话框
const handlePermission = async (row) => {
  currentRole.value = row
  permissionDialogVisible.value = true
  
  // 获取权限树数据
  await getPermissionTree()
  // 获取角色权限
  await getRolePermissions(row.id)
}

// 保存权限分配
const savePermissions = async () => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
  } catch (error) {
    console.error('权限分配失败', error)
    ElMessage.error('权限分配失败')
  }
}

onMounted(() => {
  getRoleList()
})
</script>

<template>
  <div class="role-management-container">
    <div class="page-header">
      <h2>角色管理</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable />
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
          <el-icon><Plus /></el-icon>新增角色
        </el-button>
      </div>
      
      <el-table
        :data="roleList"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="name" label="角色名称" min-width="120" />
        <el-table-column prop="code" label="角色编码" min-width="120" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="changeRoleStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="handlePermission(scope.row)">分配权限</el-button>
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
    
    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色编码" />
        </el-form-item>
        
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="roleForm.sort" :min="0" :max="999" style="width: 100%" />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="roleForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="分配权限"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentRole" class="permission-dialog-content">
        <div class="role-info">
          <p><strong>角色名称：</strong>{{ currentRole.name }}</p>
          <p><strong>角色编码：</strong>{{ currentRole.code }}</p>
        </div>
        
        <div class="permission-tree">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTreeData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="checkedPermissions"
            :props="{ label: 'label' }"
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermissions">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.role-management-container {
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

.permission-dialog-content {
  max-height: 500px;
  overflow-y: auto;
}

.role-info {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.permission-tree {
  margin-top: 10px;
}
</style>