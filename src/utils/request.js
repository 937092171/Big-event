import store from '@/store'
import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

myAxios.interceptors.request.use(function(config) {
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
// 导出axios自定义函数
export default myAxios
