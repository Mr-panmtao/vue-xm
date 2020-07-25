<template>
  <div>
    <!-- 路由占位符 -->
    <router-view style="height:100%"></router-view>

    <van-tabbar v-model="active" active-color="#75A342" @change="onChange">
      <van-tabbar-item :badge="item.badge" v-for="(item, index) in tabBar" :key="index" >
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.inactive : item.active" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
const iconArr = [
  { title: '首页', active: require('../assets/tabBarImg/home.png'), inactive: require('../assets/tabBarImg/home-active.png') },
  { title: '分类', active: require('../assets/tabBarImg/class.png'), inactive: require('../assets/tabBarImg/class-active.png') },
  { title: '购物车', badge: '', active: require('../assets/tabBarImg/shopp.png'), inactive: require('../assets/tabBarImg/shoop-active.png') },
  { title: '我的', badge: '', active: require('../assets/tabBarImg/my.png'), inactive: require('../assets/tabBarImg/my-active.png') }
]

export default {
  data () {
    return {
      active: 0,
      tabBar: iconArr,
      badge: 0,
      // 用户id
      uId: 0
    }
  },
  created () {
    // 获取tabBar栏选中项下标
    this.active = 0
    const actives = window.sessionStorage.getItem('active')
    if (actives) this.active = parseInt(actives)

    // 获取用户id
    const userInfo = window.sessionStorage.getItem('token')
    if (userInfo) {
      this.uId = JSON.parse(userInfo).id
    }

    // 获取用户的购物车数据
    this.getUserCart()

    // 获取用户订单信息
    this.getOrderList()
  },
  methods: {
    // 监听tabBar切换事件
    onChange (index) {
      if (index === 0) {
        window.sessionStorage.setItem('active', 0)
        this.$router.push('/index')
      } else if (index === 1) {
        window.sessionStorage.setItem('active', 1)
        this.$router.push('/class')
      } else if (index === 2) {
        window.sessionStorage.setItem('active', 2)
        this.$router.push('/shoop')
      } else {
        window.sessionStorage.setItem('active', 3)
        this.$router.push('/myxm')
      }
    },

    // 获取购物车数据
    async getUserCart () {
      const { data: res } = await this.$http.get('getusercart?id=' + this.uId)
      if (res.status !== 201) return this.$msg('获取购物车信息失败！')
      // 设置购物车tabbar显示个数图标
      if (res.data.length > 0) {
        iconArr[2].badge = res.data.length
      } else {
        iconArr[2].badge = ''
      }
    },

    // 获取订单信息
    async getOrderList () {
      const { data: res } = await this.$http.get(
        'getorderinfo?userId=' + this.uId
      )
      if (res.status !== 201) return this.$msg('获取订单信息失败！')
      // 设置我的tabbar显示个数图标
      if (res.data.length > 0) {
        iconArr[3].badge = res.data.length
      } else {
        iconArr[3].badge = ''
      }
    }

  },
  // 监听地址栏变化
  watch: {
    $route (to, from) {
      if (to.fullPath === '/index') {
        this.active = 0
      } else if (to.fullPath === '/class') {
        this.active = 1
      } else if (to.fullPath === '/shoop') {
        this.active = 2
      } else {
        this.active = 3
      }
    }
  }
}
</script>
