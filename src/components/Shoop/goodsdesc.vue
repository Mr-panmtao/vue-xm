<template>
  <div>
    <van-nav-bar
      fixed
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div id="goodsDesc" v-for="item in goods_info" :key="item.id">
      <img :src="item.goods_Img" alt="" @click="yulan(item.goods_Img)"/>
      <div>
        <!-- 商品具体参数 -->
        <div class="goods-top">
          <h3>{{ item.goods_Name }}</h3>
          <p>{{ item.goods_desc }}</p>
          <div class="price">
            <div>
              <span>￥{{ item.goods_start_price }}</span>
              <span>￥{{ item.goods_end_price }}</span>
            </div>
            <div>
              <p>已售:9089</p>
            </div>
          </div>
          <div class="goods-center">
            <van-icon name="question-o" />
            此商品按500g/份计价,如实收少于500g将退还差价
          </div>
          <div class="goods-center">
            <van-icon name="clock-o" />
            最快一天内送达
          </div>
        </div>
        <!-- 商品规格 -->
        <div class="goodsspec">
          <h3>规格</h3>
          <div class="miaoshu">
            <span>保存条件</span>
            <span>冷藏</span>
          </div>
          <div class="miaoshu">
            <span>保 质 期 </span>
            <span>15天</span>
          </div>
        </div>
        <!-- 加入购物车 -->
        <van-goods-action>
          <van-goods-action-icon
            icon="chat-o"
            text="客服"
            @click="onClickIcon"
          />
          <van-goods-action-icon
            icon="cart-o"
            text="购物车"
            @click="onClickShoop"
          />
          <van-goods-action-icon
            icon="shop-o"
            text="店铺"
            @click="onClickIcon"
          />
          <van-goods-action-button
            type="danger"
            text="加入购物车"
            @click="onClickButton"
          />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品信息
      goods_info: [],
      // 加入购物车数据对象
      cart: {},
      // 用户id
      uid: 0,
      // 预览图片地址
      imgUrl: [],
      // 当前商品id
      goods_id: 0
    }
  },
  created () {
    var is = window.sessionStorage.getItem('token')
    if (!is) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }
    this.uid = JSON.parse(is).id

    // 从地址栏获取id
    this.getGoodsById(this.$route.params.goodsId)
  },
  methods: {

    // 图片预览
    yulan (url) {
      this.imgUrl.push(url)
      this.ImagePreview({
        images: this.imgUrl,
        closeable: true
      })
      this.imgUrl = []
    },

    // 根据id获取商品信息
    async getGoodsById (id) {
      // 如果id为空返回上一级
      if (!id) {
        return this.onClickLeft()
      }

      const { data: res } = await this.$http.get('getgoodsById?id=' + id)
      this.goods_info = res.data
      // 配置加入购物车数据
      res.data.forEach(item => {
        this.goods_id = item.id
        this.cart.goods_Name = item.goods_Name
        this.cart.goods_Img = item.goods_Img
        this.cart.goods_desc = item.goods_desc
        this.cart.goods_start_price = item.goods_start_price
        this.cart.goods_end_price = item.goods_end_price
        this.cart.userId = this.uid
        this.cart.is_Checked = false
        this.cart.num = 1
        this.cart.goods_id = item.id
      })
    },
    // 返回上一级
    onClickLeft () {
      this.$router.go(-1)
    },
    // 点击小图标
    onClickIcon () {
      return this.$msg('暂未实现！')
    },
    // 点击小图标
    onClickShoop () {
      this.$router.push('/shoop')
    },
    // 点击加入购物车
    onClickButton () {
      this.$Dialog.confirm({
        title: '提示',
        message: '你确认要将该商品加入购物车吗？'
      })
        .then(async () => {
          const { data: res } = await this.$http.get('getusercart?id=' + this.uid)
          const isYes = res.data.filter(item => item.goods_id === this.goods_id)

          // 如果购物车已经存在则将数量加 1
          if (isYes.length >= 1) {
            const num = isYes[0].num
            const id = isYes[0].id
            this.$http.post('updateCart', { num: num + 1, id: id })
          } else {
            this.$http.post('addCart', this.cart)
          }
          this.$Notify({ type: 'success', message: '加入购物车成功！' })
          this.$router.push('/shoop')
          window.sessionStorage.setItem('active', 2)
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="less" scoped>
#goodsDesc {
  padding-top: 46px;
  color: #808080;
  background-color: #f5f5f5;
  img {
    width: 100%;
  }
  // 商品具体描述
  .goods-top {
    padding: 5px 15px;
    background-color: #fff;
    h3 {
      font-weight: normal;
      font-size: 16px;
      color: #000;
    }
    p {
      font-size: 14px;
      margin: 5px 0;
    }
    span:first-child {
      font-size: 17px;
      margin-right: 8px;
    }
    span:last-child {
       font-size: 17px;
      text-decoration: line-through;
      color: #ccc;
    }
    .price {
      margin-bottom: 15px;
      color: #e75450;
      display: flex;
      justify-content: space-between;
    }

    .goods-center {
      padding: 15px 0;
      border-top: 1px solid #ddd;
      font-size: 12px;
    }
  }

  // 商品规格
  .goodsspec {
    margin: 20px 0 45px 0;
    padding: 5px 0 5px 15px;
    background-color: #fff;
    h3 {
      padding: 7px 0 13px 0;
      font-weight: normal;
      color: #000;
      font-size: 16px;
    }
    .miaoshu {
      padding: 10px 0 13px 0;
      border-top: 1px dashed #ddd;
      font-size: 12px;
      span:first-child {
        margin-right: 20px;
      }
    }
  }
}
</style>
