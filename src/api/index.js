import request from '@/utils/request'// 引入request对象
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
    url: '/my/userinfo'
    // method不写默认就是'get'方式请求
    // 传参给后台: params( 查询字符串query), data( 请求体body), headers( 请求头)
  })
}

/**
 * 获取-侧边栏数据
 * @returns Promise对象
 */
export const getMenuListAPI = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 * 更新-用户基本资料
 * @param {*} param0 { nickname：用户昵称}
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 * 更新-用户头像
 * @param {54*6} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 更新-用户密码
 * @param {*} param0
 * @returns Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取-文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 添加-文章分类
 * @param {*} param0 { cate_name：文章分类名字, cate_alias：文章分类别名}
 * @returns Promise对象
 */
export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新-文章分类
 * @param {*} param0 { id：文章分类id, cate_name：文章分类名字, cate_alias：文章分类别名 }
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除-文章分类
 * @param {*} id { id：文章分类id}
 * @returns Promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'delete',
    params: {
      id
    }
  })
}

/**
 * 发布-文章
 * @param {*} fd FormData 表单数据对象
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd
    // {} 如果是一个普通对象，axios会把它转成JSON字符串在请求体里交给后台
    // 这个接口文档要求请求体里是一个FormData类型(表单数据对象)携带文件给后台
  })
}

/**
 * 获取-文章列表
 * @param {*} param0 { pagenum：当前页码数, pagesize：当前页面需要的数据条数, cate_id：文章分类id, state：文章状态 }
 * @returns Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}
/**
 * 获取-文章详情
 * @param {*}  id：文章分类id
 * @returns Promise对象
 */
export const getArticleDetailFn = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}
/**
 * 删除-文章
 * @param {*} id：文章id
 * @returns Promise对象
 */
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
