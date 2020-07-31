import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
// Routing logic
Vue.use(VueRouter)
let router = new VueRouter({
  routes: routes,
  mode: 'history',
  base: process.env.BASE_URL
})
router.beforeEach((to, from, next) => {
    let tabs = store.state.admin.tabs
    if (to.meta.tab !== false) {
      if (!tabs.find(tab => tab.path === to.path)) {
        store.commit('admin/ADD_TAB', {
          ...to,
          title: to.meta.title || to.name,
          keep: to.meta.keep || false
        })
      }
    }
    if (to.path !== '/login') {
      if (store.state.admin.token) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    } else {
      next()
    }
  })

export default router
