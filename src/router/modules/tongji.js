

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
      path: 'qingchun-hongbao',
      component: () => import('@/view/h5-acitive/qingchun-hongbao'),
      meta: {
        title: '青春红包配置'
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
    {
      path: 'tree-tongji',
      component: () => import('@/view/h5-acitive/tree-tongji'),
      meta: {
        title: '摇钱树统计'
      }
    },
    {
      path: 'tree-baimingdan',
      component: () => import('@/view/h5-acitive/tree-baimingdan'),
      meta: {
        title: '摇钱树白名单'
      }
    },
    {
      path: 'tree-ads',
      component: () => import('@/view/h5-acitive/tree-ads'),
      meta: {
        title: '摇钱树广告'
      }
    },
    {
      path: 'yuandan-userlist',
      component: () => import('@/view/h5-acitive/yuandan-userlist'),
      meta: {
        title: '用户列表(元旦)'
      }
    },
    {
      path: 'yuandan-prizelist',
      component: () => import('@/view/h5-acitive/yuandan-prizelist'),
      meta: {
        title: '中奖列表(元旦)'
      }
    },
    {
      path: 'yuandan-set',
      component: () => import('@/view/h5-acitive/yuandan-set'),
      meta: {
        title: '配置(元旦)'
      }
    },
  ]
}
export default h5activeRouter
