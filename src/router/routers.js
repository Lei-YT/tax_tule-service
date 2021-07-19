import Main from '@/components/main'
import uuidv4 from 'uuid/v4'
// const NAMESPACE = uuidv4();
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
const homePath = uuidv4()
export default [
  {
    path: `/`,
    name: 'login',
    meta: {
      title: '登陆页面',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    redirect: `/${homePath}`,
    name: 'home',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      icon: '_jiqiren1',
      perms: ['data_search', 'control_search', 'control_operate', 'info_search', 'info_operate', 'log_search'],
      showAlways: true,
      title: '机器人控制台'
    },
    children: [
      {
        path: homePath,
        name: 'robotDataMonitor',
        meta: {
          icon: '_shuju',
          perms: ['data_search'],
          title: '机器人数据监控'
        },
        component: () => import('@/view/robotDataMonitor.vue')
      },
      {
        path: homePath,
        name: 'robotProcessIndex',
        meta: {
          icon: '_xingzhuangjiehe',
          perms: ['control_search', 'control_operate', 'info_search', 'info_operate', 'log_search'],
          title: '机器人监控'
        },
        component: () => import('@/view/robotProcess.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'manageUser',
    meta: {
      hideInBread: true,
      icon: '_18zhiyudiceng',
      title: '权限管理',
      perms: ['organ_search','organ_operate','user_search','user_operate', 'station_search', 'station_operate'],
      showAlways: true,
    },
    component: Main,
    children: [
      {
        path: homePath,
        name: 'institutionsMange',
        meta: {
          icon: '_custom-department',
          perms: ['organ_search','organ_operate',],
          title: '机构管理'
        },
        component: () => import('@/view/institutions.vue')
      },
      {
        path: homePath,
        name: 'manageUserIndex',
        meta: {
          icon: '_iconfontloginuser',
          perms: ['user_search','user_operate',],
          title: '用户管理'
        },
        component: () => import('@/view/manageUser.vue')
      },
      {
        path: homePath,
        name: 'workPermiss',
        meta: {
          icon: '_qunzhong',
          title: '岗位权限管理',
          perms: ['station_search','station_operate',]
        },
        component: () => import('@/view/workPermiss.vue')
      },
      {
        path: homePath,
        name: 'addWorks',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          icon: '_qunzhong',
          perms: ['station_search','station_operate',],
          title: '岗位权限管理'
        },
        component: () => import('@/view/addWorks.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'auditLog',
    meta: {
      hideInBread: true,
      icon: '_15',
      title: '人机协同',
      perms: ['bill_search','bill_operate','manage_search', 'manage_operate'],
      showAlways: true,
    },
    component: Main,
    children: [
      {
        path: homePath,
        name: 'auditLogIndex',
        meta: {
          icon: '_shenpi',
          title: '智能审单',
          perms: ['bill_search','bill_operate','manage_search', 'manage_operate'],
          keepAlive: true,
          isBack: false
        },
        component: () => import('@/view/auditLog.vue')
      },
      {
        path: homePath,
        name: 'logResultIndex',
        meta: {
          icon: 'ios-create-outline',
          title: '机器人审单日志 / 机器人审核结果页',
          perms: ['bill_search','bill_operate',],
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/logResult.vue')
      },
    ]
  },
  {
    path: '/logResult/shareResult',
    name: 'shareResult',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      needLogin: false,
      forbidExternal: true,
      title: '机器人审单日志 / 机器人审核结果页',
    },
    component: () => import('@/view/logResult.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
    // component: () => import('@/view/error-page/404.vue')
  }
]
