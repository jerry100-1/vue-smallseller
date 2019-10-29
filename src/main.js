// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import store from './store'
import VueResource from 'vue-resource'; 
import './icons' // icon
import '@/permission' // 权限
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
/* eslint-disable no-new */

Vue.use(VueResource); 
Vue.http.options.emulateJSON = true; 


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
