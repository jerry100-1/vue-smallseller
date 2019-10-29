import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Message,MessageBox } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 //超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
   if (res.errcode !== 0) {
      Message.error(res.errmsg)
       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.errcode === 40001 || res.errcode === 40002 || res.errcode === 40005) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        })
      }
      return Promise.reject('error');
    } else {
      return response;
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message.error(res.message)
    return Promise.reject(error)
  }
)


export default service
