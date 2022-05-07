import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'
import SignPage from '@/pages/sign/SignPage'

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
            path: '',
            name: '管理',
            meta: {
              page: {
                breadcrumb: ['首页', 'Dashboard']
              },
              icon: 'home'
          },
          component: PageView,
          children: [
            {
              path: 'users',
              name: '用户管理',
              meta: {
                icon: 'user',
              },
              component: () => import('@/pages/users/UserManage'),
            },
            {
              name: '用户人脸管理',
              path: 'user/:id',
              meta: {
                icon: 'file-image',
                id: '',
                invisible: true
              },
              component: () => import('@/pages/users/FaceManage')
            },
            {
              path: 'contracts',
              name: "合同",
              meta:{
                icon: 'file-protect',
                id: '',
              },
              component: () => import('@/pages/sign/ContractList')
            },
            {
              path: 'contract/:id/sign',
              name: "签字",
              meta:{
                icon: 'edit',
                id: '',
                invisible: true
              },
              component: SignPage
            }
          ]
        },
      ],
    }
  ]
}

export default options
