import { defineStore } from 'pinia'
import {
    getPaymentContractList,
    getPaymentContractDetail,
    getReceiptContractList,
    getReceiptContractDetail
} from '../api/contract'

export const useContractStore = defineStore('contract', {
    state: () => ({
        // 付款合同
        paymentContracts: {
            list: [],
            total: 0,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            searchParams: {
                keyword: '',
                status: '',
                startDate: '',
                endDate: '',
                departmentId: ''
            }
        },
        // 收款合同
        receiptContracts: {
            list: [],
            total: 0,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            searchParams: {
                keyword: '',
                status: '',
                startDate: '',
                endDate: '',
                departmentId: ''
            }
        },
        // 当前选中的合同
        currentContract: null
    }),

    actions: {
        // 获取付款合同列表
        async getPaymentContractList() {
            this.paymentContracts.loading = true
            try {
                const params = {
                    page: this.paymentContracts.currentPage,
                    pageSize: this.paymentContracts.pageSize,
                    ...this.paymentContracts.searchParams
                }

                const response = await getPaymentContractList(params)
                const { list, total } = response.data

                this.paymentContracts.list = list
                this.paymentContracts.total = total

                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            } finally {
                this.paymentContracts.loading = false
            }
        },

        // 获取付款合同详情
        async getPaymentContractDetail(id) {
            try {
                const response = await getPaymentContractDetail(id)
                this.currentContract = response.data
                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 获取收款合同列表
        async getReceiptContractList() {
            this.receiptContracts.loading = true
            try {
                const params = {
                    page: this.receiptContracts.currentPage,
                    pageSize: this.receiptContracts.pageSize,
                    ...this.receiptContracts.searchParams
                }

                const response = await getReceiptContractList(params)
                const { list, total } = response.data

                this.receiptContracts.list = list
                this.receiptContracts.total = total

                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            } finally {
                this.receiptContracts.loading = false
            }
        },

        // 获取收款合同详情
        async getReceiptContractDetail(id) {
            try {
                const response = await getReceiptContractDetail(id)
                this.currentContract = response.data
                return Promise.resolve(response)
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 设置付款合同分页
        setPaymentPagination(pagination) {
            this.paymentContracts.currentPage = pagination.currentPage || 1
            this.paymentContracts.pageSize = pagination.pageSize || 10
        },

        // 设置收款合同分页
        setReceiptPagination(pagination) {
            this.receiptContracts.currentPage = pagination.currentPage || 1
            this.receiptContracts.pageSize = pagination.pageSize || 10
        },

        // 设置付款合同搜索参数
        setPaymentSearchParams(params) {
            this.paymentContracts.searchParams = {
                ...this.paymentContracts.searchParams,
                ...params
            }
        },

        // 设置收款合同搜索参数
        setReceiptSearchParams(params) {
            this.receiptContracts.searchParams = {
                ...this.receiptContracts.searchParams,
                ...params
            }
        },

        // 重置付款合同搜索参数
        resetPaymentSearchParams() {
            this.paymentContracts.searchParams = {
                keyword: '',
                status: '',
                startDate: '',
                endDate: '',
                departmentId: ''
            }
        },

        // 重置收款合同搜索参数
        resetReceiptSearchParams() {
            this.receiptContracts.searchParams = {
                keyword: '',
                status: '',
                startDate: '',
                endDate: '',
                departmentId: ''
            }
        }
    }
})