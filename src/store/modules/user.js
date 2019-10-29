import { login , logout,getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    permissions: [],
    roles: [],
    menus: undefined,
    eleemnts: undefined,
    permissionMenus: undefined
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.data.errcode==0) {
            const data = response.data.data
            console.log(data)
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            resolve()
          }else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          console.log('进入获取用户信息')
          console.log(response)
          if (response.data.errcode==0) {
            const data = response.data.data
            commit('SET_ROLES', 'admin')
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', 'http://git.oschina.net/uploads/42/547642_geek_qi.png?1499487420')
            commit('SET_INTRODUCTION', data.description)
            const menus = {};
            for (let i = 0; i < data.menus.length; i++) {
              menus[data.menus[i].code] = true;
            }
            commit('SET_MENUS', menus);
            const elements = {};
            for (let i = 0; i < data.elements.length; i++) {
              elements[data.elements[i].code] = true;
            }
            commit('SET_ELEMENTS', elements);
            resolve(response)
          }else{
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
