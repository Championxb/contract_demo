<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 系统管理菜单
const systemMenu = [
  {
    title: '用户管理',
    path: '/system/users',
    icon: 'User'
  },
  {
    title: '部门管理',
    path: '/system/departments',
    icon: 'OfficeBuilding'
  },
  {
    title: '角色管理',
    path: '/system/roles',
    icon: 'Lock'
  }
]

// 当前激活的菜单
const activeMenu = ref(route.path)
</script>

<template>
  <div class="system-layout">
    <el-row :gutter="20">
      <!-- 左侧菜单 -->
      <el-col :span="4">
        <el-card class="menu-card">
          <div class="menu-title">系统管理</div>
          <el-menu
            :default-active="activeMenu"
            router
            class="system-menu"
          >
            <el-menu-item
              v-for="item in systemMenu"
              :key="item.path"
              :index="item.path"
            >
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      
      <!-- 右侧内容 -->
      <el-col :span="20">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.system-layout {
  padding: 20px;
}

.menu-card {
  height: calc(100vh - 200px);
}

.menu-title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.system-menu {
  border-right: none;
}
</style>