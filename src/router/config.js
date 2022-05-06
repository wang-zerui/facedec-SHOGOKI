import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'
import SignPage from '@/components/pdf/SignPage'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '人脸识别管理系统',
      component: TabsView,
      children: [
        {
          path: 'list',
          name: '管理员控制台',
          meta: {
            page: {
              breadcrumb: ['首页', 'Dashboard']
            },
            icon: 'table'
          },
          component: PageView,
          children: [
            {
              path: 'primary',
              name: '用户管理',
              meta: {
                icon: 'project',
              },
              component: () => import('@/pages/list/StandardList'),
            },
            {
              name: '用户人脸管理',
              path: 'user/:id',
              meta: {
                icon: 'project',
                id: '',
                invisible: true
              },
              component: () => import('@/pages/Demo')
            },
            {
              path: 'pdf',
              name: "签字",
              component: SignPage
            }
          ]
        },
      ],
    }
  ]
}

export default options
