import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token: ''
  },
  getters: {
  },
  mutations: {
    // 2. 更新 token 的 mutation 函数
    updateToken(state, val) {
      state.token = val
    }
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()],
  actions: {
  },
  modules: {
  }
})

// vuex默认保存在内存中，所以刷新所有的值会回归初始化(无法做到持久存储)
// 借助yarn add vuex-persistedstate@3.2.1这个包可以让vuex做持久化存储
