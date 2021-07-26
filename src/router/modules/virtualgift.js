

import Layout from '@/view/layout/Layout'
const virtualgiftRouter = {
  path: '/virtualgift',
  component: Layout,
  alwaysShow: true,
  redirect: '/virtualgift/ncustomer',
  name:'virtualgift',
  title: 'title',
  children: [
    {
      path: 'ncustomer',
      component: () => import('@/view/virtualgift/ncustomer'),
      meta: {
        title: '客户管理'
      }
    },
    {
      path: 'ncustomer/price',
      component: () => import('@/view/virtualgift/price'),
      meta: {
        title: '价格设置'
      }
    },
    {
      path: 'ncustomer/priceshiwu',
      component: () => import('@/view/virtualgift/priceshiwu'),
      meta: {
        title: '价格设置(实物)'
      }
    },
    {
      path: 'userpayment',
      component: () => import('@/view/virtualgift/userpayment'),
      meta: {
        title: '用户加款统计'
      }
    },
    {
      path: 'tongji',
      component: () => import('@/view/virtualgift/tongji'),
      meta: {
        title: '账单统计'
      }
    },
    {
      path: 'product-cate',
      component: () => import('@/view/virtualgift/product-cate'),
      meta: {
        title: '产品分类'
      }
    },
    {
      path: 'product-list',
      component: () => import('@/view/virtualgift/product-list'),
      meta: {
        title: '产品列表'
      }
    },
    {
      path: 'product',
      component: () => import('@/view/virtualgift/product'),
      meta: {
        title: '产品列表(实体)'
      }
    },
    {
      path: 'product-list/kami',
      component: () => import('@/view/virtualgift/kami'),
      meta: {
        title: '库存'
      }
    },
    {
      path: 'order-list',
      component: () => import('@/view/virtualgift/order-list'),
      meta: {
        title: '订单列表(虚拟)'
      }
    },
    {
      path: 'order-shiti',
      component: () => import('@/view/virtualgift/order-shiti'),
      meta: {
        title: '订单列表(实体)'
      }
    },
    {
      path: 'duizhang',
      component: () => import('@/view/virtualgift/duizhang'),
      meta: {
        title: '对账'
      }
    },
  ]
}
export default virtualgiftRouter
