import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import '@/assets/stylus/index.styl'
import '@/assets/js/rewrite'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/scss/font-awesome.scss'
// import './mock/index.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
if (window.localStorage) {
// 如果需要多次使用到的话，放入vuex(缓存中)，之后调用速度会加快，
  let user = JSON.parse(window.localStorage.getItem('user') || '{}')
  let menus = JSON.parse(window.localStorage.getItem('menus') || '[]')
  let token = JSON.parse(window.localStorage.getItem('token') || null)

  store.commit('admin/SET_TOKEN', token)
  store.commit('admin/SET_MENUS', menus)
  store.commit('admin/SET_USER', user)
}
sync(store, router)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
