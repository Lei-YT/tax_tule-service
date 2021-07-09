// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import VueLazyload from 'vue-lazyload'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/icon2/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import ElementUI from 'element-ui'
import 'view-design/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(VueLazyload)
import lodash from 'lodash'
Vue.prototype._ = lodash

// Vue.use(VueLazyLoad, {
//   preLoad: 1,
//   error: require('@/assets/images/1.jpg'),
//   loading: require('@/assets/images/2.jpg'),
//   attempt: 2,
// })
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

if (process.env.NODE_ENV === 'development') {
  require('@/mock/index')
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
