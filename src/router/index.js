import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout')
    // 默认打开首页
  },
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    // webpack 提供import函数来路由懒加载导入组件
    // 路由懒加载，就是页面路由路径切换到/reg,才去加载对应组件代码
    // 好处:让首页加载文件体积更新，打开更快

  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    // 有token但是没有用户信息，才去请求用户信息保存到vuex里
    // 调用actions里方法请求数据
    store.dispatch('getUserInfoActions')
    // 下次切换页面vuex里有用户信息数据就不会重复请求用户信息
  }
  next() // 路由放行
})
export default router
// 退出登录，重新登录，只走相关组件代码(异步dom切换，不会导致所有代码重新执行，App.vue不走)
// 效果不对:你换个账号它得重新请求用户数据呀
// 解决:
// 1.可以在登录页面，登录成功后，再发请求去拿到用户信息
// 2.可以在全局前置路由守卫中，写(路由跳转的时候，判断+获取)
