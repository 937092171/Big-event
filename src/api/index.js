import request from '@/utils/request'// 引入request对象
import store from '@/store' // 引入store对象
// 形参obj的值
// obj = { username:'',password:'值',repassword: ''}
// 左侧想要对象解构赋值(语法4)
// { username: username变量名, password: 变量名,repassword: 变量名} = { username :'', password: '值', repassword:'' }
// 函数形参的obj就改成对象解构接收传入的数据对象
// { username: username, password: password, repassword: repassword }
// key是传入的对象key匹配,value是变量名,用于接收外面传入的值
// ES6规定,key和value变量同名的时候，可以简写(key既为key也是value变量名)

/**
 * 注册接口
 * @param {*} param0 { username: 用户名, password: 密码, repassword: 确认密码}
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    // method不写默认就是'get'方式请求
    // 传参给后台: params( 查询字符串query), data( 请求体body), headers( 请求头)
    headers: {
      Authorization: store.state.token
    }
  })
}
/**
 * 获取-侧边栏数据
 * @returns Promise对象
 */
export const getMenuListAPI = () => {
  return request({
    url: '/my/menus',
    headers: {
      Authorization: store.state.token
    }
  })
}
