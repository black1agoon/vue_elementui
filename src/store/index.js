import Vue from 'vue'
import Vuex from 'vuex'

import { adminModule } from './admin.module'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    usage: {},
    search: {},
  },
  mutations: {},
  actions: {},
  modules: {
    admin: adminModule,
  },
})
