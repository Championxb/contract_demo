<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSystemStore } from '../../store/system'
import { ElMessage, ElMessageBox } from 'element-plus'

const systemStore = useSystemStore()

// 部门列表
const departmentList = ref([])
// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 部门状态选项
const statusOptions = [
  { value: '1', label: '启用' },
  { value: '0', label: '禁用' }
]

// 对话框可见性
const dialogVisible = ref(false)
// 对话框标题
const dialogTitle = ref('新增部门')
// 表单引用
const departmentFormRef = ref(null)
// 表单数据
const departmentForm = reactive({
  id: null,
  name: '',
  code: '',
  parentId: null,
  manager: '',
  phone: '',
  email: '',
  sort: 0,
  status: '1',
  description: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', message: '排序号必须为数字', trigger: 'blur', transform: value => Number(value) }
  ]
}

// 部门树形选项
const departmentOptions = ref([])

// 获取部门列表
const getDepartmentList = async () => {
  loading.value = true
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    departmentList.value = [
      {
        id: 1,
        name: '总公司',
        code: 'HQ',
        parentName: null,
        manager: '张总',
        phone: '13800138000',
        email: 'zhangtotal@example.com',
        sort: 1,
        status: '1',
        createTime: '2023-01-01 00:00:00',
        description: '公司总部'
      },
      {
        id: 2,
        name: '信息技术部',
        code: 'IT',
        parentName: '总公司',
        manager: '李经理',
        phone: '13800138001',
        email: 'it@example.com',
        sort: 2,
        status: '1',
        createTime: '2023-01-02 00:00:00',
        description: '负责公司信息系统建设与维护'
      },
      {
        id: 3,
        name: '财务部',
        code: 'FIN',
        parentName: '总公司',
        manager: '王经理',
        phone: '13800138002',
        email: 'finance@example.com',
        sort: 3,
        status: '1',
        createTime: '2023-01-03 00:00:00',
        description: '负责公司财务管理'
      },
      {
        id: 4,
        name: '人力资源部',
        code: 'HR',
        parentName: '总公司',
        manager: '赵经理',
        phone: '13800138003',
        email: 'hr@example.com',
        sort: 4,
        status: '1',
        createTime: '2023-01-04 00:00:00',
        description: '负责公司人力资源管理'
      },
      {
        id: 5,
        name: '销售部',
        code: 'SALES',
        parentName: '总公司',
        manager: '钱经理',
        phone: '13800138004',
        email: 'sales@example.com',
        sort: 5,
        status: '1',
        createTime: '2023-01-05 00:00:00',
        description: '负责公司产品销售'
      },
      {
        id: 6,
        name: '研发部',
        code: 'RD',
        parentName: '总公司',
        manager: '孙经理',
        phone: '13800138005',
        email: 'rd@example.com',
        sort: 6,
        status: '1',
        createTime: '2023-01-06 00:00:00',
        description: '负责公司产品研发'
      },
      {
        id: 7,
        name: '软件开发组',
        code: 'RD-SW',
        parentName: '研发部',
        manager: '周组长',
        phone: '13800138006',
        email: 'sw@example.com',
        sort: 1,
        status: '1',
        createTime: '2023-01-07 00:00:00',
        description: '负责软件开发'
      },
      {
        id: 8,
        name: '硬件开发组',
        code: 'RD-HW',
        parentName: '研发部',
        manager: '吴组长',
        phone: '13800138007',
        email: 'hw@example.com',
        sort: 2,
        status: '1',
        createTime: '2023-01-08 00:00:00',
        description: '负责硬件开发'
      }
    ]
    
    // 构建部门树形选项
    buildDepartmentOptions()
  } catch (error) {
    console.error('获取部门列表失败', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 构建部门树形选项
const buildDepartmentOptions = () => {
  // 找出所有顶级部门
  const topDepartments = departmentList.value.filter(item => !item.parentName)
  
  // 递归构建树形结构
  const buildTree = (departments, parentId = null) => {
    const result = []
    
    // 找出当前层级的部门
    const children = departments.filter(item => {
      if (parentId === null) {
        return !item.parentName
      } else {
        const parent = departments.find(d => d.id === parentId)
        return item.parentName === parent.name
      }
    })
    
    // 构建树节点
    for (const dept of children) {
      const node = {
        value: dept.id,
        label: dept.name,
        children: buildTree(departments, dept.id)
      }
      
      if (node.children.length === 0) {
        delete node.children
      }
      
      result.push(node)
    }
    
    return result
  }
  
  departmentOptions.value = buildTree(departmentList.value)
}

// 搜索部门
const handleSearch = () => {
  getDepartmentList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 打开新增对话框
const handleAdd = () => {
  dialogTitle.value = '新增部门'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogTitle.value = '编辑部门'
  resetForm()
  
  // 填充表单数据
  departmentForm.id = row.id
  departmentForm.name = row.name
  departmentForm.code = row.code
  departmentForm.parentId = row.parentName ? departmentList.value.find(item => item.name === row.parentName)?.id : null
  departmentForm.manager = row.manager
  departmentForm.phone = row.phone
  departmentForm.email = row.email
  departmentForm.sort = row.sort
  departmentForm.status = row.status
  departmentForm.description = row.description
  
  dialogVisible.value = true
}

// 删除部门
const handleDelete = (row) => {
  // 检查是否有子部门
  const hasChildren = departmentList.value.some(item => item.parentName === row.name)
  
  if (hasChildren) {
    ElMessage.warning('该部门下有子部门，不能删除')
    return
  }
  
  ElMessageBox.confirm(`确定要删除部门 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该是实际的API调用，现在先模拟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      ElMessage.success('删除成功')
      getDepartmentList()
    } catch (error) {
      console.error('删除部门失败', error)
      ElMessage.error('删除部门失败')
    }
  }).catch(() => {})
}

// 重置表单
const resetForm = () => {
  if (departmentFormRef.value) {
    departmentFormRef.value.resetFields()
  }
  
  departmentForm.id = null
  departmentForm.name = ''
  departmentForm.code = ''
  departmentForm.parentId = null
  departmentForm.manager = ''
  departmentForm.phone = ''
  departmentForm.email = ''
  departmentForm.sort = 0
  departmentForm.status = '1'
  departmentForm.description = ''
}

// 提交表单
const submitForm = async () => {
  if (!departmentFormRef.value) return
  
  await departmentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 这里应该是实际的API调用，现在先模拟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        ElMessage.success(departmentForm.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        getDepartmentList()
      } catch (error) {
        console.error(departmentForm.id ? '更新部门失败' : '添加部门失败', error)
        ElMessage.error(departmentForm.id ? '更新部门失败' : '添加部门失败')
      }
    }
  })
}

// 修改部门状态
const changeDepartmentStatus = async (row) => {
  try {
    // 这里应该是实际的API调用，现在先模拟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`已${row.status === '1' ? '启用' : '禁用'}部门`)
  } catch (error) {
    console.error('修改部门状态失败', error)
    ElMessage.error('修改部门状态失败')
    // 恢复原状态
    row.status = row.status === '1' ? '0' : '1'
  }
}

onMounted(() => {
  getDepartmentList()
})
</script>

<template>
  <div class="department-management-container">
    <div class="page-header">
      <h2>部门管理</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="部门名称">
          <el-input v-model="searchForm.name" placeholder="请输入部门名称" clearable />
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
          <el-icon><Plus /></el-icon>新增部门
        </el-button>
      </div>
      
      <el-table
        :data="departmentList"
        style="width: 100%"
        border
        stripe
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="loading"
      >
        <el-table-column prop="name" label="部门名称" min-width="150" />
        <el-table-column prop="code" label="部门编码" min-width="100" />
        <el-table-column prop="parentName" label="上级部门" min-width="120" />
        <el-table-column prop="manager" label="负责人" min-width="100" />
        <el-table-column prop="phone" label="联系电话" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="changeDepartmentStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 部门表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="departmentFormRef"
        :model="departmentForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departmentForm.name" placeholder="请输入部门名称" />
        </el-form-item>
        
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="departmentForm.code" placeholder="请输入部门编码" />
        </el-form-item>
        
        <el-form-item label="上级部门">
          <el-cascader
            v-model="departmentForm.parentId"
            :options="departmentOptions"
            :props="{ checkStrictly: true }"
            clearable
            placeholder="请选择上级部门"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="负责人">
          <el-input v-model="departmentForm.manager" placeholder="请输入负责人" />
        </el-form-item>
        
        <el-form-item label="联系电话">
          <el-input v-model="departmentForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="departmentForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="departmentForm.sort" :min="0" :max="999" style="width: 100%" />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="departmentForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="departmentForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
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
  </div>
</template>

<style scoped>
.department-management-container {
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
</style>