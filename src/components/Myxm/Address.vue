<template>
  <div>
    <div class="father" :style="ulHeight">
      <van-nav-bar
        title="添加地址"
        left-text="返回"
        left-arrow
        @click-left="toggle"
      />
      <!-- 没有收货地址的时候显示 -->
      <div class="desc" v-if="isShow">
        <img
          style="width: 248px"
          src="../../assets/tabBarImg/noData.1c06e1e1.jpeg"
          alt=""
          srcset=""
        />
        <p>还没有添加过地址呢,添加一个吧😄</p>
      </div>

      <!-- 收货地址列表 -->
      <div>
        <van-address-list
        @select="applications"
          v-model="chosenAddressId"
          :list="addressList"
          @edit="editAddress"
        />
      </div>

      <div class="bottom-btn">
        <van-button round to="saveaddress" type="primary">添加地址</van-button>
      </div>
    </div>

  </div>
</template>
<script>
import eventBus from './eventbus.js'
export default {
  data () {
    return {
      chosenAddressId: '0',
      id: 0,
      // 用户id
      userId: 0,

      isShow: true,
      // 收货地址列表
      addressList: []
    }
  },
  created () {
    var is = window.sessionStorage.getItem('token')
    if (!is) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }
    this.userId = JSON.parse(is).id
    this.getUserAddress()
  },
  methods: {
    // 获取用户收货地址
    async getUserAddress () {
      const { data: res } = await this.$http.get(
        'getaddress?userId=' + this.userId
      )
      if (res.data.length > 0) this.isShow = false

      this.addressList = res.data
    },

    // 前往编辑地址页面
    editAddress (item, index) {
      this.$router.push({ name: 'saveaddress', params: { addressInfo: item } })
    },

    // 使用当前收货地址
    applications (item) {
      eventBus.$emit('addressInfo', item)
      this.toggle()
    },

    // 返回上一级
    toggle () {
      this.$router.go(-1)
    }
  },
  computed: {
    //   父容器高度
    ulHeight () {
      const h = document.documentElement.clientHeight
      return 'height:' + h + 'px'
    }
  }
}
</script>

<style lang="less" scoped>
.father {
  background-color: #f6f6f6;
  .desc {
    margin-top: 50px;
    text-align: center;
    color: #b3b3b3;
    font-size: 14px;
  }

  .bottom-btn {
    .van-button {
      position: absolute;
      left: 50%;
      bottom: 40px;
      transform: translateX(-50%);
      width: 300px;
    }
  }
}
</style>
