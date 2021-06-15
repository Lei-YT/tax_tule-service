import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Encrypt, Decrypt } from "@/libs/aes";
import { Notification, Loading } from 'element-ui'

let loadingInstance

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: 'Bearer ' + store.state.user.token
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      console.log('request', config)
      // 添加全局的loading...
      // loadingInstance = Loading.service({ fullscreen: true, background: 'hsla(0,0%,100%,.2)' })
      this.queue[url] = false
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // loadingInstance.close()
      this.destroy(url)
      const { data, status } = res
      console.log('response', res)
      const decryptData = JSON.parse(Decrypt(data));
      console.log('after decrypt res', decryptData)
      return { data: decryptData, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      console.log(error, 'error')
      // const { data, status } = errorInfo
      Notification.closeAll()
      Notification({
        message: data.msg || data.message,
        type: 'warning',
        duration: 2000
      })
      // loadingInstance.close()
      return Promise.reject(error)
    })
  }
  request (options) {
    const rawData = JSON.stringify(options.data);
    console.log('before encrypt', rawData);
    const encryptData = Encrypt(rawData);
    console.log('after encrypt', encryptData);
    options.data = encryptData;
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
