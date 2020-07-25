import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Index from '@/components/Index/Index'
import Class from '@/components/Class/Class'
import shoop from '@/components/Shoop/shoop'
import myxm from '@/components/Myxm/myxm'
import goodsdesc from '@/components/Shoop/goodsdesc'
import Login from '@/components/Login'
import Serach from '@/components/Serach/Serach'
import SerachList from '@/components/Serach/SerachList'
import Mydata from '@/components/Myxm/Mydata'
import UpdateNc from '@/components/Myxm/UpdateNc'
import Order from '@/components/Myxm/Order'
import Coupon from '@/components/Myxm/Coupon'
import Address from '@/components/Myxm/Address'
import SaveAddress from '@/components/Myxm/SaveAddress'
import UpdateImg from '@/components/Myxm/UpdateImg'
import Payment from '@/components/Payment/Payment'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login },
  { path: '/serach', component: Serach },
  { path: '/serachlist', component: SerachList },
  { path: '/mydata', component: Mydata },
  { name: 'updatenc', path: '/updatenc', component: UpdateNc },
  { name: 'order', path: '/order', component: Order },
  { path: '/coupon', component: Coupon },
  { path: '/address', component: Address },
  { name: 'saveaddress', path: '/saveaddress', component: SaveAddress },
  { name: 'updateimg', path: '/updateimg', component: UpdateImg },
  { name: 'payment', path: '/payment', component: Payment },
  {
    path: '/index',
    component: Home,
    redirect: '/index',
    children: [
      { path: '/index', component: Index },
      { name: 'class', path: '/class', component: Class },
      { path: '/shoop', component: shoop },
      { path: '/myxm', component: myxm }
    ]
  },
  {
    name: 'goodsdesc',
    path: '/goodsdesc',
    component: goodsdesc
  }
]

const router = new VueRouter({
  routes
  // 进入页面滚动条置顶
  // scrollBehavior (to, from, savedPosition) {
  //   // return 期望滚动到哪个的位置
  //   return { x: 0, y: 0 }
  // }
})

export default router
