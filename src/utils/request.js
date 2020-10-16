import Vue from 'vue'
import axios from 'axios'
import {
  baseURL,
  contentType,
  debounce,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
  loginInterception,
} from '@/config/settings'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'

let loadingInstance

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断当前url是否需要加loading
 * @param {*} config
 * @returns
 */
const needLoading = (config) => {
  let status = false
  debounce.forEach((item) => {
    if (Vue.prototype.$baseLodash.includes(config.url, item)) {
      status = true
    }
  })
  return status
}
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})

instance.interceptors.request.use(
  (config) => {
    if (store.getters['user/accessToken']) {
      config.headers[tokenName] = store.getters['user/accessToken']
    }
    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    // if (config.data)
    //   config.data = Vue.prototype.$baseLodash.pickBy(
    //     config.data,
    //     Vue.prototype.$baseLodash.identity
    //   );
    if (
      contentType === 'application/x-www-form-urlencoded;charset=UTF-8' &&
      config.data
    ) {
      config.data = qs.stringify(config.data)
    }

    if (needLoading(config)) {
      loadingInstance = Vue.prototype.$baseLoading()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close()

    const { status, data, config } = response
    const { Code, Message } = data

    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]]
    // 是否操作正常
    if (codeVerificationArray.includes(Code)) {
      return data
    } else {
      handleCode(Code, Message)
      return Promise.reject(
        'vue-admin-beautiful请求异常拦截:' +
          JSON.stringify({ url: config.url, Code, Message }) || 'Error'
      )
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    const { response, message } = error
    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.Message || message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        if (code === '401') {
          handleCode(parseInt(code), '登录会话失效，请重新登录')
          return
        } else {
          message = '后端接口' + code + '异常'
        }
      }
      Vue.prototype.$baseMessage(message || `后端接口未知异常`, 'error')
      return Promise.reject(error)
    }
  }
)

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case invalidCode:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      store.dispatch('user/resetAccessToken').catch(() => {})
      if (loginInterception) {
        let fromPath = location.toString().split('#')
        if (fromPath && fromPath.length > 0) {
          router
            .push({ path: `/login?redirect=${fromPath[1]}` })
            .catch(() => {})
        } else {
          router.push({ path: '/login' }).catch(() => {})
        }
      } else {
        location.reload()
      }
      break
    case noPermissionCode:
      router.push({ path: '/403' }).catch(() => {})
      break
    default:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      break
  }
}

export default instance
