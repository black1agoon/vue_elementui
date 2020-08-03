import api from '@/api'
// import axios from 'axios'

export const adminModule = {
  namespaced: true,
  state: {
    user: null,
    token: null,
    tabs: [],
    menus: [],
    systype: null,
    agencyId: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    ADD_TAB(state, tab) {
      if (tab.fullPath === '/') {
        state.tabs.unshift(tab)
      } else {
        state.tabs.push(tab)
      }
    },
    REMOVE_TAB(state, tabName) {
      let idx = state.tabs.findIndex(tab => tab.name === tabName)
      state.tabs.splice(idx, 1)
    },
    TOGGLE_TAB_KEEP(state, obj) {
      state.tabs[obj.index].keep = obj.boolean
    },
    UPDATE_TAB(state, obj) {
      let idx = state.tabs.findIndex(tab => tab.name === obj.name)
      Object.assign(state.tabs[idx], obj)
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    }
  },
  actions: {
    login({dispatch, commit}, usermsg) {
      return api.public.login(usermsg).then((data) => {
        let token = data.token
        let menus = data['permissionList'] || []
        commit('SET_USER', {
          name: data.userName,
          id: data.userId
        })
        commit('SET_TOKEN', token)
        commit('SET_MENUS', menus)

        window.localStorage.setItem('token', JSON.stringify(token))
        window.localStorage.setItem('menus', JSON.stringify(menus))
        window.localStorage.setItem('user', JSON.stringify({
          name: data.userName,
          id: data.userId
        }))
      })
    }
  }
}
