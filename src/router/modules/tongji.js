

import Layout from '@/view/layout/Layout'
const h5activeRouter = {
  path: '/h5-acitive',
  component: Layout,
  alwaysShow: true,
  redirect: '/h5-acitive/prize',
  name:'h5-acitive',
  title: 'title',
  children: [
    {
      path: 'prize',
      component: () => import('@/view/h5-acitive/prize'),
      meta: {
        title: '奖品配置'
      }
    },
    {
      path: 'hongbao',
      component: () => import('@/view/h5-acitive/hongbao'),
      meta: {
        title: '发红包'
      }
    },
    {
      path: 'tongji',
      component: () => import('@/view/h5-acitive/tongji'),
      meta: {
        title: '统计'
      }
    },
    {
      path: 'fuka-tongji',
      component: () => import('@/view/h5-acitive/fuka-tongji'),
      meta: {
        title: '福卡统计'
      }
    },
    {
      path: 'fuka-hongbao',
      component: () => import('@/view/h5-acitive/fuka-hongbao'),
      meta: {
        title: '福卡红包配置'
      }
    },
    {
      path: 'fuka-prize',
      component: () => import('@/view/h5-acitive/fuka-prize'),
      meta: {
        title: '福卡奖品配置'
      }
    },
    {
      path: 'fuka-fafang',
      component: () => import('@/view/h5-acitive/fuka-fafang'),
      meta: {
        title: '福卡红包发放'
      }
    },
    {
      path: 'fuka-fuzhu',
      component: () => import('@/view/h5-acitive/fuka-fuzhu'),
      meta: {
        title: '福卡辅助'
      }
    },
    {
      path: 'fuka-keys',
      component: () => import('@/view/h5-acitive/fuka-keys'),
      meta: {
        title: '公众号关键字'
      }
    },
    {
      path: 'boc',
      component: () => import('@/view/h5-acitive/boc'),
      meta: {
        title: '中国银行儿童节'
      }
    },
    {
      path: 'zz-qiyi',
      component: () => import('@/view/h5-acitive/zz-qiyi'),
      meta: {
        title: '郑银七一活动'
      }
    },
    {
      path: 'zz-qiyi-fuzhu',
      component: () => import('@/view/h5-acitive/zz-qiyi-fuzhu'),
      meta: {
        title: '郑银七一辅助'
      }
    },
    {
      path: 'xianzhi',
      component: () => import('@/view/h5-acitive/xianzhi'),
      meta: {
        title: '限制'
      }
    },
  ]
}
export default h5activeRouter
