<template>
  <div>
    <van-nav-bar fixed title="购物车" />

    <div class="myCait">
      <!-- 购物车为空的时候显示 -->
      <div class="isnull" v-if="!isShow">
        <img src="../../assets/tabBarImg/empty.5053d452.png" alt="" srcset="" />
        <h3>购物车是空的 ~</h3>
        <a href="#" @click="goHome">去逛逛</a>
      </div>

      <!-- 购车列表 -->
      <div class="cartList">
        <ul v-if="isShow">
          <li v-for="item in usercart" :key="item.id">
            <img :src="item.goods_Img" alt="" />
            <div class="cart-centet">
              <h3 class="one-txt-cut">{{ item.goods_Name }}</h3>
              <p class="one-txt-cut">{{ item.goods_desc }}</p>
              <div class="price">
                <div>
                  <span>￥{{ item.goods_start_price }}</span
                  ><span>￥{{ item.goods_end_price }}</span>
                </div>
                <div></div>
              </div>
            </div>
            <div class="count">
              <van-tag round size="large" plain>x1</van-tag>
              <div>
                <van-button
                  type="danger"
                  size="mini"
                  @click="delCartGoods(item.id)"
                  >删 除</van-button
                >
                <van-button type="primary" size="mini" @click="gomai(item)"
                  >购 买</van-button
                >
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 猜你喜欢 -->
      <van-divider
        :style="{ color: '#000', borderColor: '#BABABA', padding: '0 16px' }"
      >
        猜你喜欢
      </van-divider>
      <div id="goodsTeseList">
        <div class="goodsTeseList">
          <ul class="clearfix">
            <li
              v-for="item in goodsClass"
              :key="item.id"
              @click="gofuqian(item.id)"
            >
              <img :src="item.goods_Img" alt="" srcset="" />
              <h3>{{ item.goods_Name }}</h3>
              <p>{{ item.goods_desc }}</p>
              <div id="cart_goods">
                <div>
                  <span>￥{{ item.goods_start_price }}</span>
                  <span>￥{{ item.goods_end_price }}</span>
                </div>
                <img src="../../assets/tabBarImg/shoop-active.png" alt="" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 控制购物车的元素显示与隐藏
      isShow: true,
      // 猜你喜欢商品数据
      goodsClass: [],
      // 用户购物车数据
      usercart: [],
      // 用户id
      uId: 0
    }
  },
  created () {
    // 获取用户id
    var userId = window.sessionStorage.getItem('token')
    if (!userId) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }
    this.uId = JSON.parse(userId).id

    this.goodsClassList()
    this.getuserCart()
  },
  methods: {
    // 跳转到首页
    goHome () {
      this.$router.push('/index')
    },
    // 获取猜你喜欢商品数据
    async goodsClassList () {
      const { data: res } = await this.$http.get('getgoodslist')
      this.goodsClass = res.data
    },

    // 获取用户购物车商品数据
    async getuserCart () {
      const { data: res } = await this.$http.get('getusercart?id=' + this.uId)
      if (res.data.length <= 0) {
        this.isShow = false
        return
      }
      this.isShow = true
      this.usercart = res.data
    },

    // 根据id删除购物车数据
    delCartGoods (id) {
      const info =
        this.usercart.length === 1
          ? '在删购物车就空啦！'
          : '你确定要删除该商品吗？'
      this.$Dialog
        .confirm({
          title: '提示',
          message: info
        })
        .then(() => {
          this.$http.get('delcartById?id=' + id)
          this.$Notify({ type: 'success', message: '删除成功！' })
          this.getuserCart()
          // 删除购物车数据成功后刷新父级页面
          parent.location.reload()
        })
        .catch(() => {})
    },

    // 购买商品 跳转填写订单页面
    gomai (item) {
      this.$router.push({ name: 'payment', params: { goodsInfo: item } })
    },
    // 跳转商品详情页
    gofuqian (id) {
      this.$router.push({ name: 'goodsdesc', params: { goodsId: id } }) // 跳转b页面，参数链接不可见
    }
  }
}
</script>

<style lang="less" scoped>
.myCait {
  margin-top: 46px;
  background-color: #f5f5f5;
  padding-top: 10px;
  .isnull {
    text-align: center;
    img {
      width: 207px;
      padding-top: 37px;
    }
    h3 {
      font-weight: normal;
      padding: 5px 0;
      font-size: 16px;
    }
    a {
      padding: 8px 25px;
      line-height: 37px;
      border-radius: 35px;
      background-color: #45c763;
      font-size: 18px;
      color: #fff;
    }
  }
  // 猜你喜欢
  #goodsTeseList {
    margin-bottom: 50px;

    .goodsTeseList {
      background-color: #f5f5f5;
      padding: 0 10px;
      ul li {
        float: left;
        width: 174px;
        height: 300px;
        margin-bottom: 7px;
        background-color: #fff;
        padding-left: 7px;
        img {
          width: 100%;
        }

        h3 {
          font-weight: normal;
          font-size: 14px;
        }
        p {
          margin: 5px 0 15px 0;
          font-size: 14px;
          color: #808080;
        }
        #cart_goods {
          display: flex;

          img {
            width: 25px;
            height: 25px;
            position: relative;
            right: 20px;
          }
          span {
            font-size: 16px;
            color: #808080;
          }
          span:first-child {
            color: #f370a3;
          }
          span:last-child {
            margin: 0 30px 0 5px;
          }
        }

        #cart_goods {
          width: 25px;
        }
      }
      ul li:nth-child(even) {
        margin-left: 7px;
      }
    }
  }

  // 购物车列表
  .cartList {
    ul {
      padding: 0 10px;
      li {
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: start;
        width: 100%;
        height: 135px;
        margin-bottom: 10px;
        padding: 15px;
        background-color: #fff;
        border-radius: 11px;
        img {
          width: 100px;
          height: 100px;
          margin-right: 10px;
        }
        .cart-centet {
          width: 124px;
        }
        h3 {
          height: 22px;
          // margin-top: 10px;
          font-weight: normal;
          font-size: 16px;
        }
        p {
          height: 22px;
          margin: 10px 0;
          font-size: 14px;
          color: #808080;
        }
        .price {
          margin-bottom: 15px;
          color: #e75450;
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          span:first-child {
            margin-right: 8px;
          }
          span:last-child {
            text-decoration: line-through;
            color: #ccc;
          }
        }

        .count {
          position: absolute;
          top: 0;
          right: 25px;
          background-color: #fff;
          // padding: 30px 0;
          padding-top: 15px;
          .van-tag {
            margin: 0 0 15px 20px;
          }
          > div {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
