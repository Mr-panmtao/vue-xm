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
           <van-checkbox @change="checkboxchange(item.is_Checked,item.id,item.num)" v-model="item.is_Checked" checked-color="#07c160"></van-checkbox>
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
              <van-tag round size="large" plain>x{{item.num}}</van-tag>
              <div class="num_toll">
                <div class="num_reduce" @click="operationCount(0,item.num,item.is_Checked,item.id)">-</div>
                <div>{{item.num}}</div>
                <div class="num_plus" @click="operationCount(1,item.num,item.is_Checked,item.id)">+</div>
                <!-- <van-button
                  type="danger"
                  size="mini"
                  @click="delCartGoods(item.id)"
                  >删 除</van-button
                >
                <van-button type="primary" size="mini"
                  >购 买</van-button
                > -->
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 底部结算 -->
      <div class="btm_toll">
        <div class="chkall">
          <van-checkbox v-model="allChecked" @click="checkboxchangeAll"  checked-color="#07c160">全选</van-checkbox>
        </div>
        <div class="num">
          <span>合计:</span>
          <span class="price">￥{{totalCount}}</span>
        </div>
        <div class="settlement" @click="gomai">
          结算<span v-if="totalNum>=1">({{totalNum}})</span>
        </div>
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
      uId: 0,
      // 复选框值
      is_Checked: 0,
      // 总价钱
      totalCount: 0,
      // 总数量
      totalNum: 0,
      // 全选默认为未选择
      allChecked: false
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

    this.getuserCart()
    this.goodsClassList()
  },
  methods: {

    // 购物车加减数量操作
    operationCount (type, num, checked, id) {
      if (type === 0 && num === 1) {
        this.delCartGoods(id)
        return
      }
      type === 0 ? num-- : num++
      // 修改商品数量
      this.$http.post('updateCart', { num: num, id: id })
      this.updateCartInfo(checked, id, num)
    },

    // 复选框发生改变
    checkboxchange (Checked, id, num) {
      this.updateCartInfo(Checked, id, num)
    },
    // 全选
    checkboxchangeAll () {
      this.updateCartInfo(this.allChecked, null)
    },

    // 修改购物车状态数据
    updateCartInfo (Checked, id, num) {
      // 获取购物车数据
      const cart = JSON.parse(window.sessionStorage.getItem('cart'))
      cart.filter(item => {
        if (item.id === id) {
          item.is_Checked = Checked
          item.num = num
        } else if (id === null) {
          item.is_Checked = Checked
        }
      })
      this.usercart = cart
      this.allChecked = cart.length ? cart.every(item => item.is_Checked) : false

      window.sessionStorage.setItem('cart', JSON.stringify(cart))
      this.settlementPrice()
    },

    // 计算总价钱总数量
    settlementPrice () {
      const res = this.resultTrue()

      let totalCount = 0
      let totalNum = 0
      res.forEach(item => {
        totalCount = totalCount + item.goods_start_price * item.num
        totalNum = totalNum + item.num
      })
      this.totalCount = totalCount.toFixed(2)
      this.totalNum = totalNum
    },

    // 获取勾选的商品
    resultTrue () {
      // 获取购物车数据
      const cart = JSON.parse(window.sessionStorage.getItem('cart'))
      const isTrue = cart.filter(item => item.is_Checked)
      return isTrue
    },

    // 跳转到首页
    goHome () {
      this.$router.push('/index')
    },
    // 获取猜你喜欢商品数据
    async goodsClassList () {
      const { data: res } = await this.$http.get('getgoodslist?id=3')
      this.goodsClass = res.data
    },

    // 获取用户购物车商品数据
    async getuserCart () {
      const { data: res } = await this.$http.get('getusercart?id=' + this.uId)

      // 将购物车数据存储到本地
      window.sessionStorage.setItem('cart', JSON.stringify(res.data))

      // 获取购物车数据
      const cart = JSON.parse(window.sessionStorage.getItem('cart'))

      if (cart.length <= 0) {
        this.isShow = false
        return
      }
      this.isShow = true
      this.usercart = cart
    },

    // 根据id删除购物车数据
    delCartGoods (id) {
      this.$Dialog
        .confirm({
          title: '提示',
          message: '你确定要删除该商品吗？'
        })
        .then(() => {
          this.$http.get('delcartById?id=' + id)
          this.$Notify({ type: 'success', message: '删除成功！' })
          this.getuserCart()
          // 删除购物车数据成功后刷新父级页面
          parent.location.reload()
        })
        .catch(() => {
        })
    },

    // 购买商品 跳转填写订单页面
    gomai () {
      const item = this.resultTrue()
      if (item.length <= 0) return this.$msg('请选择要购买的商品！')
      this.$router.push({ name: 'payment', params: { goodsInfo: item, totalCount: this.totalCount, totalNum: this.totalNum } })
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
    margin-bottom: 100px;

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
        // position: relative;
        // overflow: hidden;
        display: flex;
        justify-content: start;
        width: 100%;
        height: 135px;
        margin-bottom: 10px;
        padding: 15px 3px 15px 15px;
        background-color: #fff;
        border-radius: 11px;

        .van-checkbox {
          flex: 0.5;
        //  margin-right: 10px;
        }

        img {
          flex: 1;
          width: 100px;
          height: 100px;
          margin-right: 10px;
        }
        .cart-centet {
          flex: 2;
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
          flex: 1;
          background-color: #fff;
          text-align: center;
          color: #333;
          .num_toll {
            display: flex;
            margin-top: 30px;
            font-size: 16px;
            div {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .num_plus,.num_reduce {
              border: 1px solid #ccc;
            }
          }
        }
      }
    }
  }

  // 底部工具栏
  .btm_toll {
    position: fixed;
    z-index: 999;
    left: 0;
    bottom: 50px;
    height: 50px;
    width: 100%;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-color: #fff;

    .chkall {
      flex: 2;
      font-size: 16px;
    }
    .num {
      flex: 3;
      text-align: right;
      font-size: 16px;
      padding-right: 15px;
      color: #333;
      .price {
        color: #e75450;
      }
    }
    .settlement {
      flex: 2;
      width: 100%;
      height: 75%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      background-color: #07C160;
      font-size: 18px;
      color: #fff;
    }
  }
}
</style>
