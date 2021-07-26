

import Layout from '@/view/layout/Layout'
const miaoshaRouter = {
  path: '/miaosha',
  component: Layout,
  alwaysShow: true,
  redirect: '/miaosha/list',
  name:'miaosha',
  title: 'title',
  children: [
    {
      path: 'list',
      component: () => import('@/view/miaosha/list'),
      meta: {
        title: '活动列表'
      }
    },
    {
      path: 'list/baimingdan',
      component: () => import('@/view/miaosha/baimingdan'),
      meta: {
        title: '设置白名单'
      }
    },
    {
      path: 'list/list-add-renwu',
      component: () => import('@/view/miaosha/list-add-renwu'),
      meta: {
        title: '活动任务增改'
      }
    },
    {
      path: 'list/list-add-chanpin',
      component: () => import('@/view/miaosha/list-add-chanpin'),
      meta: {
        title: '活动产品增改'
      }
    },
    {
      path: 'list/list-editor-product',
      component: () => import('@/view/miaosha/list-editor-product'),
      meta: {
        title: '活动产品修改'
      }
    },
    {
      path: 'product',
      component: () => import('@/view/miaosha/product'),
      meta: {
        title: '产品设置'
      }
    },
    {
      path: 'product/add-product',
      component: () => import('@/view/miaosha/add-product'),
      meta: {
        title: '产品设置'
      }
    },
    {
      path: 'renwu',
      component: () => import('@/view/miaosha/renwu'),
      meta: {
        title: '任务列表'
      }
    },
    {
      path: 'navactive',
      component: () => import('@/view/miaosha/navactive'),
      meta: {
        title: '引导活动'
      }
    },
    {
      path: 'navactive/add-navacitve',
      component: () => import('@/view/miaosha/add-navacitve'),
      meta: {
        title: '引导活动增改'
      }
    },
    {
      path: 'order-list',
      component: () => import('@/view/miaosha/order-list'),
      meta: {
        title: '订单列表'
      }
    },
    {
      path: 'order-list-self',
      component: () => import('@/view/miaosha/order-list-self'),
      meta: {
        title: '订单列表（自用）'
      }
    },
    {
      path: 'wuliu-fafang',
      component: () => import('@/view/miaosha/wuliu-fafang'),
      meta: {
        title: '物流发放'
      }
    },
    {
      path: 'liushui',
      component: () => import('@/view/miaosha/liushui'),
      meta: {
        title: '订单流水'
      }
    },
    {
      path: 'fuzhu',
      component: () => import('@/view/miaosha/fuzhu'),
      meta: {
        title: '辅助操作'
      }
    },
    {
      path: 'tongji',
      component: () => import('@/view/miaosha/tongji'),
      meta: {
        title: '数据统计'
      }
    },
    {
      path: 'maoshu',
      component: () => import('@/view/miaosha/maoshu'),
      meta: {
        title: '描述设置'
      }
    },
    {
      path: 'order-xuni',
      component: () => import('@/view/miaosha/order-xuni'),
      meta: {
        title: '虚拟订单列表'
      }
    },
    {
      path: 'test',
      component: () => import('@/view/miaosha/test'),
      meta: {
        title: 'test'
      }
    },
  ]
}
export default miaoshaRouter
