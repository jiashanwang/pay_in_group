import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Pay from '@/views/pay'
import QrcodeAdmin from '@/views/qrcode_admin'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/pay/:type',
      name: 'pay',
      component: Pay
    }, 
    {
      path: '/admin',
      name: 'admin',
      component: QrcodeAdmin
    }, 
    {
      path: '*',
      redirect: '/'
    }
  ]
})
