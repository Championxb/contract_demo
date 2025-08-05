import { defineStore } from 'pinia'
import { 
    getUserList, 
    getDepartmentList, 
    getRoleList 
} from '../api/system'

export const useSystemStore = defineStore('system', {
    state: () => ({
        // 用户管理
        users: {
            list: [],
            total: 0,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            searchParams: {
                keyword: '',
                status: '',
                departmentId: ''
            }
        },
        // 部门管理
        departments: {
            list: [],
            total: 0,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            searchParams: {
                keyword: '',
                status: ''
            }
        },
        // 角色管理
        roles: {
            list: [],
            total: 0,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            searchParams: {
                keyword: '',
                status: ''
            }
        }
    }),

    actions: {
        // 获取用户列表
        async getUserList() {
            this.users.loading = true
            try {
                const params = {
                    page: this.users.currentPage,
                    pageSize: this.users.pageSize,
                    ...this.users.searchParams
                }
                
                const response = await getUserList(params)
                const { list, total } = response.data
                
                this.users.list = list
                this.users.total = total
                
                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            } finally {
                this.users.loading = false
            }
        },
        
        // 获取部门列表
        async getDepartmentList() {
            this.departments.loading = true
            try {
                const params = {
                    page: this.departments.currentPage,
                    pageSize: this.departments.pageSize,
                    ...this.departments.searchParams
                }
                
                const response = await getDepartmentList(params)
                const { list, total } = response.data
                
                this.departments.list = list
                this.departments.total = total
                
                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            } finally {
                this.departments.loading = false
            }
        },
        
        // 获取角色列表
        async getRoleList() {
            this.roles.loading = true
            try {
                const params = {
                    page: this.roles.currentPage,
                    pageSize: this.roles.pageSize,
                    ...this.roles.searchParams
                }
                
                const response = await getRoleList(params)
                const { list, total } = response.data
                
                this.roles.list = list
                this.roles.total = total
                
                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            } finally {
                this.roles.loading = false
            }
        },
        
        // 设置用户分页
        setUserPagination(pagination) {
            this.users.currentPage = pagination.currentPage || 1
            this.users.pageSize = pagination.pageSize || 10
        },
        
        // 设置部门分页
        setDepartmentPagination(pagination) {
            this.departments.currentPage = pagination.currentPage || 1
            this.departments.pageSize = pagination.pageSize || 10
        },
        
        // 设置角色分页
        setRolePagination(pagination) {
            this.roles.currentPage = pagination.currentPage || 1
            this.roles.pageSize = pagination.pageSize || 10
        },
        
        // 设置用户搜索参数
        setUserSearchParams(params) {
            this.users.searchParams = {
                ...this.users.searchParams,
                ...params
            }
        },
        
        // 设置部门搜索参数
        setDepartmentSearchParams(params) {
            this.departments.searchParams = {
                ...this.departments.searchParams,
                ...params
            }
        },
        
        // 设置角色搜索参数
        setRoleSearchParams(params) {
            this.roles.searchParams = {
                ...this.roles.searchParams,
                ...params
            }
        },
        
        // 重置用户搜索参数
        resetUserSearchParams() {
            this.users.searchParams = {
                keyword: '',
                status: '',
                departmentId: ''
            }
        },
        
        // 重置部门搜索参数
        resetDepartmentSearchParams() {
            this.departments.searchParams = {
                keyword: '',
                status: ''
            }
        },
        
        // 重置角色搜索参数
        resetRoleSearchParams() {
            this.roles.searchParams = {
                keyword: '',
                status: ''
            }
        }
    }
})