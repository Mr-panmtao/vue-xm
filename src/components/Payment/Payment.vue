<template>
  <div>
    <van-nav-bar
      title="填写订单"
      left-text="返回"
      left-arrow
      @click-left="toggle"
    />

    <div :style="ulHeight" class="father">
      <!-- 收货地址 -->
      <van-contact-card
        @click="goaddress"
        :type="cardType"
        add-text="选择收货地址"
        :name="userAddressInfo.name ? userAddressInfo.name : 张三"
        :tel="userAddressInfo.tel ? userAddressInfo.tel : 11"
      />

      <!-- 商品信息 -->
      <div class="goodsinfo">
        <div id="good">
          <van-cell :value="goodsList.goods_Name.substring(0,9)">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <span class="custom-title">
                <img
                  id="goodsImg"
                  :src="goodsList.goods_Img"
                  alt=""
                  srcset=""
                />
              </span>
            </template>
          </van-cell>
        </div>
        <van-cell id="zf-title" title="支付方式" />
        <div id="zf">
          <van-cell clickable @click="wxclick">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <img src="../../assets/tabBarImg/wxzf.png" alt="" srcset="" />
              <span>微信支付</span>
            </template>
            <div>
              <input :checked="wx" class="checkbox" type="checkbox" />
            </div>
          </van-cell>
          <van-cell clickable @click="zfbclick">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <img src="../../assets/tabBarImg/zfb.png" alt="" srcset="" />
              <span>支付宝支付</span>
            </template>
            <div>
              <input :checked="zfb" class="checkbox" type="checkbox" />
            </div>
          </van-cell>
        </div>
        <van-field
          v-model="remarks"
          style="margin-top:16px"
          label="备注："
          placeholder="可以告诉我们您的特殊需求"
        />

        <div style="margin-top:16px">
          <van-cell
            title="商品金额"
            :value="'￥' + goodsList.goods_start_price"
          />
          <van-cell title="配送费" value="0.00" />
        </div>

        <div>
          <van-submit-bar default :disabled="isdisabled" @submit="onSubmit">
            <template #default>
              <div class="result">
                实付：<span>￥{{ goodsList.goods_start_price }}</span>
              </div>
              <div>
                <van-button
                  :disabled="isdisabled"
                  round
                  @click="onSubmit"
                  type="primary"
                  >提交订单</van-button
                >
              </div>
            </template>
          </van-submit-bar>
        </div>

        <!-- 支付密码弹窗 -->
        <van-action-sheet
          @close="close"
          :round="false"
          v-model="show"
          title="请输入支付密码"
        >
          <div class="content">
            <!-- 密码输入框 -->
            <div class="pwd">
              <van-password-input
                :value="value"
                info="密码为: 010414"
                :error-info="errorInfo"
                focused
              />
            </div>
            <!-- 数字键盘 -->
            <van-number-keyboard show @input="onInput" @delete="onDelete" />
          </div>
        </van-action-sheet>
      </div>
    </div>
  </div>
</template>
<script>
import eventBus from '../Myxm/eventbus.js'
export default {
  data () {
    return {
      // 用户id
      userId: 0,
      userAddressInfo: {
        name: '张三',
        tel: '李四'
      },
      // 当前的收货地址类型
      cardType: 'add',
      //   备注
      remarks: '',
      // 商品数据信息
      goodsList: {},
      wx: true,
      zfb: false,
      // 是否禁用提交按钮
      isdisabled: false,
      // 控制支付密码弹窗显示与隐藏
      show: false,
      // 用户输入的密码
      value: '',
      errorInfo: ''
    }
  },

  // 监听路由导航 获取从上一页面的路由地址
  beforeRouteEnter (to, from, next) {
    if (from.path === '/address') {
    }
    next(vm => {
      if (from.path === '/address') {
        vm.cardType = 'edit'
      }
    })
  },
  created () {
    this.activated()

    // 获取用户id
    var is = window.sessionStorage.getItem('token')
    if (!is) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }
    this.userId = JSON.parse(is).id

    // 获取本地存储的地址信息对象
    const addresInfo = window.sessionStorage.getItem('addressInfo')
    if (addresInfo) {
      this.userAddressInfo = JSON.parse(addresInfo)
    }

    // 获取当前点击的商品数据信息
    if (this.$route.params.goodsInfo) {
      window.sessionStorage.setItem(
        'goodsInfo',
        JSON.stringify(this.$route.params.goodsInfo)
      )
    }
    const goodsInfo = window.sessionStorage.getItem('goodsInfo')
    this.goodsList = JSON.parse(goodsInfo)
  },
  methods: {
    // 每次激活时 获取从上一页面传递过来的值
    activated () {
      // 根据key名获取传递回来的参数，data就是map
      eventBus.$on('addressInfo', function (data) {
        // 将从上一页面传递过来的地址信息对象存储到本地
        window.sessionStorage.setItem('addressInfo', JSON.stringify(data))
      })
    },

    // 用户输入密码
    async onInput (key) {
      this.value = (this.value + key).slice(0, 6)
      if (this.value.length === 6) {
        if (this.value !== '010414') {
          this.errorInfo = '密码错误'
          return
        }

        // 支付密码正确后提交订单
        const goodsOrderInfo = {}
        goodsOrderInfo.goods_Name = this.goodsList.goods_Name
        goodsOrderInfo.goods_Img = this.goodsList.goods_Img
        goodsOrderInfo.goods_desc = this.goodsList.goods_desc
        goodsOrderInfo.goods_start_price = this.goodsList.goods_start_price
        goodsOrderInfo.goods_remarks = this.remarks
        // 订单状态 0表示已发货 1表示已收货
        goodsOrderInfo.goods_status = 0
        goodsOrderInfo.userId = this.userId

        const { data: res } = await this.$http.post('addorder', goodsOrderInfo)
        if (res.status !== 201) {
          return this.$Notify({ type: 'danger', message: '支付失败！' })
        }
        // 删除购物车数据
        this.$http.get('delcartById?id=' + this.goodsList.id)
        this.$Notify({ type: 'success', message: '支付成功！' })
        this.show = false
        this.$router.push('shoop')
      } else {
        this.errorInfo = ''
      }
    },
    // 删除已输入的密码
    onDelete () {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    // 密码弹出层关闭
    close () {
      this.$Dialog.confirm({
        message: '是否放弃本次付款？'
      })
        .then(() => {
          this.value = ''
          this.errorInfo = ''
        })
        .catch(() => {
          this.show = true
        })
    },

    wxclick (e) {
      this.wx = true
      this.zfb = false
      this.$msg('当前为微信支付！')
    },
    zfbclick (e) {
      this.wx = false
      this.zfb = true
      this.$msg('当前为支付宝支付！')
    },

    // 提交订单
    onSubmit () {
      if (this.cardType === 'add') {
        this.$msg('请选择收货地址！')
        this.isdisabled = true
      } else {
        this.isdisabled = false
        this.show = true
      }
    },

    // 去往收货地址页面 选择收货地址
    goaddress () {
      this.$router.push('address')
    },

    // 返回上一级
    toggle () {
      this.$router.go(-1)
    }
  },
  computed: {
    //   父容器高度
    ulHeight () {
      const h = document.documentElement.clientHeight - 46
      return 'height:' + h + 'px'
    }
  }
}
</script>
<style lang="less" scoped>
.father {
  background-color: #f5f5f5;
  .goodsinfo {
    #goodsImg {
      width: 120px;
    }
    #good .van-cell .van-cell__value {
      line-height: 127px;
      font-size: 16px;
    }
  }
  #zf-title {
    background-color: #f5f5f5;
    padding-bottom: 4px;
    color: #969799;
  }

  #zf .van-cell {
    // height: 45px;
    .van-cell__title {
      display: flex;
      justify-content: start;
      span {
        margin-left: 5px;
      }
    }
    img {
      width: 25px;
      height: 25px;
    }
  }

  .result {
    position: absolute;
    left: 16px;
    span {
      font-size: 16px;
      color: #ee0a24;
    }
  }
  .van-submit-bar__bar > .van-submit-bar__button {
    display: none !important;
  }
  .van-button--normal {
    padding: 0 25px;
    height: 38px;
  }
  .van-password-input {
    margin-bottom: 300px !important;
  }
}
</style>
