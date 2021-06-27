import Vue from 'vue';
import iView from 'iview'
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
    if (!store.state.user.token) {
      delete config.headers.Authorization;
    }
    return config
  }
  destroy (url) {
    iView.LoadingBar.finish()
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // loadingInstance = Loading.service({ fullscreen: true, background: 'hsla(0,0%,100%,.2)' })
      iView.LoadingBar.start()
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
      const decryptData = JSON.parse(Decrypt(data));
      return { data: decryptData, status }
    }, err => {
      if (err && err.response) {
        switch (err.response.status) {
          case 400:
            err.message = '错误请求'
            break;
          case 401:
            err.message = '未授权'
            break;
          case 403:
            err.message = '拒绝访问'
            break;
          case 404:
            err.message = '请求错误,未找到该资源'
            break;
          case 405:
            err.message = '请求方法未允许'
            break;
          case 408:
            err.message = '请求超时'
            break;
          case 500:
            err.message = '服务器端出错'
            break;
          case 501:
            err.message = '网络未实现'
            break;
          case 502:
            err.message = '网络错误'
            break;
          case 503:
            err.message = '服务不可用'
            break;
          case 504:
            err.message = '网络超时'
            break;
          case 505:
            err.message = 'http版本不支持该请求'
            break;
          default:
            err.message = `连接错误`
        }
        err.message += ' (Status Code:' + err.response.status + ')'
      } else {
        err.message = "连接到服务器失败"
      }

      Vue.prototype.$Notice.warning({
        title: '温馨提示',
        desc: err.message
      });
      this.destroy(url)
      return Promise.reject(err)
    })
  }
  request (options) {
    const rawData = JSON.stringify(options.data);
    const encryptData = Encrypt(rawData);
    options.data = encryptData;
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
