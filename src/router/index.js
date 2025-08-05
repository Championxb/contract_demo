import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

// 路由配置
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: () => import('../App.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { requiresAuth: true, title: '仪表盘' }
            },
            // 付款合同路由
            {
                path: 'payment-contracts',
                name: 'PaymentContracts',
                component: () => import('../views/payment/ContractList.vue'),
                meta: { requiresAuth: true, title: '付款合同管理' }
            },
            {
                path: 'payment-contracts/add',
                name: 'AddPaymentContract',
                component: () => import('../views/payment/ContractForm.vue'),
                meta: { requiresAuth: true, title: '新增付款合同' }
            },
            {
                path: 'payment-contracts/edit/:id',
                name: 'EditPaymentContract',
                component: () => import('../views/payment/ContractForm.vue'),
                meta: { requiresAuth: true, title: '编辑付款合同' }
            },
            {
                path: 'payment-contracts/detail/:id',
                name: 'PaymentContractDetail',
                component: () => import('../views/payment/ContractDetail.vue'),
                meta: { requiresAuth: true, title: '付款合同详情' }
            },
            // 收款合同路由
            {
                path: 'receipt-contracts',
                name: 'ReceiptContracts',
                component: () => import('../views/receipt/ContractList.vue'),
                meta: { requiresAuth: true, title: '收款合同管理' }
            },
            {
                path: 'receipt-contracts/add',
                name: 'AddReceiptContract',
                component: () => import('../views/receipt/ContractForm.vue'),
                meta: { requiresAuth: true, title: '新增收款合同' }
            },
            {
                path: 'receipt-contracts/edit/:id',
                name: 'EditReceiptContract',
                component: () => import('../views/receipt/ContractForm.vue'),
                meta: { requiresAuth: true, title: '编辑收款合同' }
            },
            {
                path: 'receipt-contracts/detail/:id',
                name: 'ReceiptContractDetail',
                component: () => import('../views/receipt/ContractDetail.vue'),
                meta: { requiresAuth: true, title: '收款合同详情' }
            },
            // 系统管理路由
            {
                path: 'system',
                name: 'System',
                component: () => import('../views/system/Layout.vue'),
                redirect: '/system/users',
                meta: { requiresAuth: true, title: '系统管理' },
                children: [
                    {
                        path: 'users',
                        name: 'Users',
                        component: () => import('../views/system/Users.vue'),
                        meta: { requiresAuth: true, title: '用户管理' }
                    },
                    {
                        path: 'departments',
                        name: 'Departments',
                        component: () => import('../views/system/Departments.vue'),
                        meta: { requiresAuth: true, title: '部门管理' }
                    },
                    {
                        path: 'roles',
                        name: 'Roles',
                        component: () => import('../views/system/Roles.vue'),
                        meta: { requiresAuth: true, title: '角色管理' }
                    }
                ]
            }
        ]
    },
    // 404页面
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const token = userStore.token

    // 判断该路由是否需要登录权限
    if (to.meta.requiresAuth) {
        if (token) {
            next()
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        if (token && to.path === '/login') {
            // 已登录且要跳转的页面是登录页
            next({ path: '/' })
        } else {
            next()
        }
    }
})

export default router