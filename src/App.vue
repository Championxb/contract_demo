<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from './store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 侧边栏折叠状态
const isCollapse = ref(false)
// 是否显示登录页
const isLoginPage = computed(() => route.path === '/login')

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
}

// 菜单项
const menuItems = [
  {
    icon: 'HomeFilled',
    title: '首页',
    path: '/dashboard'
  },
  {
    icon: 'Wallet',
    title: '付款类合同管理',
    path: '/payment-contracts'
  },
  {
    icon: 'Money',
    title: '收款类合同管理',
    path: '/receipt-contracts'
  },
  {
    icon: 'Setting',
    title: '系统管理',
    path: '/system',
    children: [
      {
        title: '用户管理',
        path: '/system/users'
      },
      {
        title: '部门管理',
        path: '/system/departments'
      },
      {
        title: '角色管理',
        path: '/system/roles'
      }
    ]
  }
]

// 在组件挂载时获取用户信息
onMounted(async () => {
  if (localStorage.getItem('token') && !isLoginPage.value) {
    try {
      await userStore.getUserInfo()
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }
})
</script>

<template>
  <!-- 登录页不显示布局 -->
  <div v-if="isLoginPage" class="login-container">
    <router-view />
  </div>
  
  <!-- 主布局 -->
  <el-container v-else class="app-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar-container">
      <div class="logo-container">
        <h1 v-if="!isCollapse">合同管理系统</h1>
        <el-icon v-else><Document /></el-icon>
      </div>
      
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        router
        unique-opened
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <template v-for="item in menuItems" :key="item.path">
          <!-- 有子菜单的菜单项 -->
          <el-sub-menu v-if="item.children" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item 
              v-for="child in item.children" 
              :key="child.path" 
              :index="child.path"
            >
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 没有子菜单的菜单项 -->
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    
    <el-container>
      <!-- 头部 -->
      <el-header class="header-container">
        <div class="header-left">
          <el-icon class="toggle-button" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-dropdown">
              {{ userStore.userInfo.name }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 主要内容区 -->
      <el-main class="main-container">
        <router-view />
      </el-main>
      
      <!-- 页脚 -->
      <el-footer class="footer-container">
        合同管理系统 &copy; {{ new Date().getFullYear() }}
      </el-footer>
    </el-container>
  </el-container>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

#app {
  height: 100vh;
}

/* 登录页容器 */
.login-container {
  height: 100%;
}

/* 应用容器 */
.app-container {
  height: 100%;
}

/* 侧边栏 */
.sidebar-container {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3649;
  color: #fff;
  overflow: hidden;
}

.logo-container h1 {
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
}

/* 头部 */
.header-container {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-button {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 主要内容区 */
.main-container {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 页脚 */
.footer-container {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 15px 0;
  background-color: #fff;
}

/* Element Plus 样式覆盖 */
.el-menu {
  border-right: none !important;
}

.el-menu--collapse {
  width: 64px;
}
</style>