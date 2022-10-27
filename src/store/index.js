import { getUserInfoAPI } from '@/api'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token: '', // 保存token字符串
    userInfo: {} // 保存用户信息(id, username, nickname, email, user_pic)
  },
  getters: {
    // nickname (state) {
    //   return state.userInfo.nickname
    // }
    // nickname: (state) => {
    //   return state.userInfo.nickname
    // }
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 2. 更新 token 的 mutation 函数
    updateToken(state, val) {
      state.token = val
    },
    // 保存用户信息
    updateUserInfo(state, val) {
      state.userInfo = val
    }
  },
  actions: {
    // 请求->用户信息
    async getUserInfoActions(store) {
      const res = await getUserInfoAPI()
      console.log(res)
      store.commit('updateUserInfo', res.data.data)
    }
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()],
  modules: {
  }
})

// vuex默认保存在内存中，所以刷新所有的值会回归初始化(无法做到持久存储)
// 借助yarn add vuex-persistedstate@3.2.1这个包可以让vuex做持久化存储
