<template>
  <div class="fa">
    <van-nav-bar fixed title="我的" :border="false" />
    <div class="my-top">
      <div class="userinfo" @click="goMydata">
        <img :src="userList.userimgs" alt="" />
        <div>
          <p>{{ userList.userwangming }}</p>
          <p>手机号：{{ userList.phone }}</p>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" color="#9699A6" size="25px" />
        </div>
      </div>
    </div>

    <!-- userInfoList -->
    <div id="userinfo">
      <van-cell
        title="我的订单"
        icon="label-o"
        is-link
        to="order"
        value="查看全部订单"
      />
      <van-grid :border="false">
        <van-grid-item @click="goOrder(1)" icon="cart-circle-o" text="待支付" />
        <van-grid-item
          @click="goOrder(2)"
          :badge="receivedBadge"
          icon="gift-o"
          text="待收货"
        />
        <van-grid-item
          @click="goOrder(3)"
          icon="smile-comment-o"
          text="待评价"
          :badge="goodBadge"
        />
        <van-grid-item
          @click="goOrder(4)"
          icon="cash-back-record"
          text="售后/退款"
        />
      </van-grid>

      <div class="m-top">
        <van-cell title="我的优惠券" icon="gold-coin-o" is-link to="coupon" />
        <van-cell title="我的收货地址" icon="logistics" is-link to="address" />
      </div>
      <div class="m-top">
        <van-cell
          title="我的绿卡"
          @click="nokaifa"
          icon="vip-card-o"
          is-link
          to=""
        />
      </div>
      <div class="m-top">
        <van-cell
          @click="nokaifa"
          title="联系客服"
          icon="phone-o"
          is-link
          to=""
          value="客服时间 07:00-22:00"
        />
        <van-cell
          @click="feedbackShow = true"
          title="意见反馈"
          icon="comment-circle-o"
          is-link
          to=""
        />
      </div>
      <div class="m-top bottom">
        当前版本: 1.3.1.4
      </div>
    </div>

    <!-- 反馈面板 -->
    <van-action-sheet :round="false" v-model="feedbackShow">
      <div class="content">
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
          请填写您的反馈信息！
        </van-notice-bar>
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入反馈内容"
          show-word-limit
        />
        <div id="feedback">
          <van-button type="primary" @click="addfeedback">提交</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户数据
      userList: {},
      // 控制反馈面板的显示与隐藏
      feedbackShow: false,
      // 反馈内容
      message: '',
      // 用户id
      userId: 0,
      // 待收货的徽章显示数量
      receivedBadge: '',
      // 待评价的徽章显示数量
      goodBadge: ''
    }
  },
  created () {
    var is = window.sessionStorage.getItem('token')
    if (!is) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }

    this.userId = JSON.parse(is).id
    this.getUserList()
    this.getOrderList()
  },
  methods: {
    // 获取用户数据
    async getUserList () {
      const { data: res } = await this.$http.get(
        `getUserInfo?id=${this.userId}`
      )
      if (res.status !== 201) {
        return this.$Notify({ type: 'warning', message: '获取用户数据失败！' })
      }

      const [lsit] = res.data
      this.userList = lsit
    },

    // 获取用户订单信息
    async getOrderList () {
      const { data: res } = await this.$http.get(
        'getorderinfo?userId=' + this.userId
      )
      if (res.status !== 201) return this.$msg('获取用户订单信息失败！')

      // 获取待收货的数据
      const receive = res.data.filter(item => item.goods_status === 0)
      if (receive.length > 0) {
        this.receivedBadge = receive.length
      } else {
        this.receivedBadge = ''
      }

      // 获取待评价的数据
      const goodBadge = res.data.filter(item => item.goods_status === 1)
      if (goodBadge.length > 0) {
        this.goodBadge = goodBadge.length
      } else {
        this.goodBadge = ''
      }
    },

    // 去往个人资料页面
    goMydata () {
      this.$router.push('/mydata')
    },
    // 去往订单页面
    goOrder (val) {
      if (val === 4) return this.$msg('该功能尚未开通！')
      this.$router.push({ name: 'order', params: { activeId: val } }) // 跳转b页面，参数链接不可见
    },

    // 意见反馈
    async addfeedback () {
      if (this.message.trim().length <= 5) {
        return this.$msg('反馈内容不能太短！')
      }
      const { data: res } = await this.$http.post('addfeedback', {
        userid: this.userList.id,
        username: this.userList.username,
        content: this.message
      })
      if (res.status !== 201) return this.$msg('反馈失败！')
      this.$msg('反馈成功！')
      this.feedbackShow = false
      this.message = ''
    },

    nokaifa () {
      this.$msg('该功能尚未开通！')
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #3bba63 !important;
  color: #fff !important;
}

.fa {
  height: 100%;
  background-color: #f5f5f5;
}
.my-top {
  //   margin-top: 46px;
  padding-top: 46px;
  height: 141px;
  background-color: #3bba63;

  .userinfo {
    position: relative;
    padding: 5px 20px;
    display: flex;
    justify-content: start;
    img {
      border-radius: 50%;
      width: 78px;
      height: 78px;
    }
    > div {
      font-size: 14px;
      margin-left: 15px;
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      justify-items: center;
      color: #fff;
      p:first-child {
        margin-top: 5px;
        margin-bottom: 3px;
      }
    }

    .right-icon {
      position: absolute;
      top: 50%;
      right: 13px;
      transform: translateY(-50%);
    }
  }
}

// userInfo
#userinfo {
  // height: 580px;
  background-color: #f7f8fa;
  i:first-child::before {
    color: #3bba63;
    font-size: 21px;
    font-weight: 700;
  }
  .m-top {
    margin-top: 10px;
  }
  .bottom {
    text-align: center;
    font-size: 14px;
    color: #666;
  }
}

#feedback {
  margin: 20px 0 100px;
  text-align: center;
  .van-button {
    width: 200px;
  }
}
</style>
