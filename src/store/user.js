import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '../api/user'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
        permissions: []
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        username: (state) => state.userInfo.username || '',
        name: (state) => state.userInfo.name || '',
        avatar: (state) => state.userInfo.avatar || '',
        roles: (state) => state.userInfo.roles || []
    },

    actions: {
        // 登录
        async login(loginData) {
            try {
                const response = await login(loginData)
                const { token, userInfo } = response.data

                this.token = token
                this.userInfo = userInfo

                localStorage.setItem('token', token)
                localStorage.setItem('userInfo', JSON.stringify(userInfo))

                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 退出登录
        async logout() {
            try {
                await logout()
                this.resetState()
                return Promise.resolve()
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 获取用户信息
        async getUserInfo() {
            try {
                const response = await getUserInfo()
                const { userInfo, permissions } = response.data

                this.userInfo = userInfo
                this.permissions = permissions

                localStorage.setItem('userInfo', JSON.stringify(userInfo))

                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 重置状态
        resetState() {
            this.token = ''
            this.userInfo = {}
            this.permissions = []

            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
        }
    }
})