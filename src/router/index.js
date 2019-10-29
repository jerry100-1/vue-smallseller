import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: _import('404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: _import('dashboard/index'), name: 'dashboard', meta: { title: '首页', noCache: true } },
      { path: 'minaManager/copyWriterManager/moduleManager/:id', component: _import('mina/copywriterMap/index'), name: 'copywriterModule', meta: { title: '文案模块', noCache: true } },
      { path: 'minaManager/wxUserManager/tradeOverview/:id', component: _import('mina/tradeOverview/index'), name: 'tradeOverview', meta: { title: '交易总览', noCache: true } },

    ]
  }
]
export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/baseManager',
    component: Layout,
    name: '基础配置管理',
    icon: 'setting',
    authority: 'baseManager',
    children: [
      {
        path: 'menuManager',
        icon: 'menu',
        component: _import('admin/menu/index'),
        name: '菜单管理',
        meta: { title: '菜单管理' },
        authority: 'menuManager'
      }, {
        path: 'userManager',
        icon: 'user',
        component: _import('admin/user/index'),
        name: '用户管理',
        meta: { title: '用户管理' },
        authority: 'userManager'
      }, {
        path: 'groupManager',
        icon: 'group_fill',
        component: _import('admin/group/index'),
        name: '角色权限管理',
        meta: { title: '角色权限管理' },
        authority: 'groupManager'
      }, {
        path: 'smsManager',
        icon: 'message',
        component: _import('admin/sms/index'),
        name: '短信记录',
        meta: { title: '短信记录' },
        authority: 'smsManager'
      }, {
        path: 'settingManager',
        icon: 'viewlist',
        component: _import('admin/setting/index'),
        name: '配置管理',
        meta: { title: '配置管理' },
        authority: 'settingManager'
      }
    ]
  },
  {
    path: '/minaManager',
    component: Layout,
    name: '小特卖',
    icon: 'mina',
    authority: 'minaManager',
    children: [
      {
        path: 'sysTradeManager',
        icon: 'sys',
        component: _import('mina/sysTradeOverview/index'),
        name: '平台总览',
        meta: { title: '平台总览' },
        authority: 'sysTradeManager'
      },
      {
        path: 'incomeAndExpenses',
        icon: 'sys',
        component: _import('mina/incomeAndExpenses/index'),
        name: '收入支出',
        meta: { title: '收入支出' },
        authority: 'incomeAndExpenses'
      },
      {
        path: 'wxUserManager',
        icon: 'user',
        component: _import('mina/user/index'),
        name: '用户信息',
        meta: { title: '用户信息' },
        authority: 'wxUserManager'
      },
      {
        path: 'accountManager',
        icon: 'account',
        component: _import('mina/aliAccount/index'),
        name: '账户管理',
        meta: { title: '账户管理' },
        authority: 'accountManager'
      }, {
        path: 'catManager',
        icon: 'cat',
        component: _import('mina/category/index'),
        name: '平台类目管理',
        meta: { title: '平台类目管理' },
        authority: 'catManager'
      }, {
        path: 'categoryFilterManager',
        icon: 'rule',
        component: _import('mina/categoryFilter/index'),
        name: '商品抓取配置',
        meta: { title: '商品抓取配置' },
        authority: 'categoryFilterManager'
      }, {
        path: 'taobaoCategoryManager',
        icon: 'taobao',
        component: _import('mina/taobaoCategory/index'),
        name: '第三方类目管理',
        meta: { title: '第三方类目管理' },
        authority: 'taobaoCategoryManager',
      },
      {
        path: 'navManager',
        icon: 'navi',
        component: _import('mina/nav/index'),
        name: '活动导航栏管理',
        meta: { title: '活动导航栏管理' },
        authority: 'navManager',
      },
      {
        path: 'copyWriterManager',
        icon: 'category',
        component: _import('mina/copywriter/index'),
        name: '文案管理',
        meta: { title: '文案管理' },
        authority: 'copyWriterManager'
      }, {
        path: 'encrashManager',
        icon: 'order',
        component: _import('mina/encrashlog/index'),
        name: '提现管理',
        meta: { title: '提现管理' },
        authority: 'encrashManager'
      }, {
        path: 'orderManager',
        icon: 'order',
        component: _import('mina/order/index'),
        name: '订单管理',
        meta: { title: '订单管理' },
        authority: 'orderManager'
      }, {
        path: 'goodsManager',
        icon: 'goods',
        component: _import('mina/goods/index'),
        name: '商品管理',
        meta: { title: '商品管理' },
        authority: 'goodsManager'
      }, {
        path: 'depositManager',
        icon: 'deposit',
        component: _import('mina/deposit/index'),
        name: '存钱明细',
        meta: { title: '存钱明细' },
        authority: 'depositManager',
      },
      {
        path: 'profitManager',
        icon: 'profit',
        component: _import('mina/profit/index'),
        name: '生钱明细',
        meta: { title: '生钱明细' },
        authority: 'profitManager',
      },
      {
        path: 'brokerageManager',
        icon: 'brokerage',
        component: _import('mina/commission/index'),
        name: '佣金明细',
        meta: { title: '佣金明细' },
        authority: 'brokerageManager',

      },
      {
        path: 'bannerManager',
        icon: 'group_fill',
        component: _import('mina/banner/index'),
        name: '广告管理',
        meta: { title: '广告管理' },
        authority: 'bannerManager',
      },

      {
        path: 'cusManager',
        icon: 'message',
        component: _import('mina/customer/index'),
        name: '客服管理',
        meta: { title: '客服管理' },
        authority: 'cusManager',
      },
    ]
  },
  {
    path:'/cutPrice',
    component: Layout,
    name: '砍价活动/轻搜',
    icon: 'cut',
    authority: 'cutPrice',
    children:[
      {
        path: 'cutGoods',
        icon: 'sys',
        component: _import('cut/goods/index'),
        name: '砍价商品管理',
        meta: { title: '砍价商品管理' },
        authority: 'cutGoods'
      },
      {
        path: 'redPack',
        icon: 'sys',
        component: _import('cut/red/index'),
        name: '红包使用列表',
        meta: { title: '红包使用列表' },
        authority: 'redPack'
      },
      {
        path: 'miniSearch',
        icon: 'sys',
        component: _import('cut/minisearch/index'),
        name: '轻搜数据采集',
        meta: { title: '轻搜数据采集' },
        authority: 'miniSearch'
      },

    ]
  }
];