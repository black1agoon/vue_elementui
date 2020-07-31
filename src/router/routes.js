import Login from '@/pages/Login'
import DashView from '@/pages/Dash.vue'
import NotFoundView from '@/pages/404.vue'
import TabsView from '@/components/views/TabsView.vue'
import AppRoutes from '@/app/app.routes'

// Routes
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      tab: false
    }
  }, {
    path: '/',
    component: DashView,
    children: [
      {
        path: '',
        component: TabsView,
        children: AppRoutes   // 如果是/ 就打开首页homeview
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView,
    meta: {
      tab: false
    }
  }
]
export default routes
