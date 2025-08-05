import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
    baseURL: '/api', // API的基础URL
    timeout: 15000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const res = response.data

        // 如果返回的状态码不是200，说明接口请求有误
        if (res.code !== 200) {
            ElMessage({
                message: res.message || '系统错误',
                type: 'error',
                duration: 5 * 1000
            })

            // 50001: 未登录; 50002: Token过期; 50003: 无权限
            if (res.code === 50001 || res.code === 50002 || res.code === 50003) {
                // 重新登录
                ElMessage({
                    message: '您已被登出，请重新登录',
                    type: 'error',
                    duration: 5 * 1000
                })

                // 清除本地token和用户信息
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')

                // 跳转到登录页
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1500)
            }

            return Promise.reject(new Error(res.message || '系统错误'))
        } else {
            return res
        }
    },
    error => {
        // 对响应错误做点什么
        console.error('响应错误:', error)

        let message = error.message
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = '未授权，请重新登录'
                    // 清除本地token和用户信息
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    // 跳转到登录页
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 1500)
                    break
                case 403:
                    message = '拒绝访问'
                    break
                case 404:
                    message = '请求错误，未找到该资源'
                    break
                case 500:
                    message = '服务器端出错'
                    break
                default:
                    message = `连接错误${error.response.status}`
            }
        }

        ElMessage({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })

        return Promise.reject(error)
    }
)

// 封装GET请求
export function get(url, params) {
    return service({
        url,
        method: 'get',
        params
    })
}

// 封装POST请求
export function post(url, data) {
    return service({
        url,
        method: 'post',
        data
    })
}

// 封装PUT请求
export function put(url, data) {
    return service({
        url,
        method: 'put',
        data
    })
}

// 封装DELETE请求
export function del(url, params) {
    return service({
        url,
        method: 'delete',
        params
    })
}

export default service