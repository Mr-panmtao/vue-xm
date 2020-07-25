<template>
  <div class="fa">
    <div id="father" >
      <van-nav-bar
        title="我的订单"
        left-text="返回"
        left-arrow
        fixed
        @click-left="onClickLeft"
      />
      <van-tabs swipeable sticky offset-top="45px" v-model="active" animated>
        <van-tab title="全部">
          <div class="desc">
            <img
              style="width: 248px"
              src="../../assets/tabBarImg/noData.1c06e1e1.jpeg"
              alt=""
              srcset=""
            />
            <p>暂时还没有相关订单</p>
          </div>
        </van-tab>
        <van-tab title="待支付">
          <div class="desc">
            <img
              style="width: 248px"
              src="../../assets/tabBarImg/noData.1c06e1e1.jpeg"
              alt=""
              srcset=""
            />
            <p>暂时还没有相关订单</p>
          </div>
        </van-tab>
        <van-tab title="待收货">
          <div class="desc" v-if="shouhuoISnull">
            <div>
              <img
                style="width: 248px"
                src="../../assets/tabBarImg/noData.1c06e1e1.jpeg"
                alt=""
                srcset=""
              />
              <p>暂时还没有相关订单</p>
            </div>
          </div>
          <div id="orderlsit">
            <div v-for="item in orderList" :key="item.id">
              <div v-if="item.goods_status === 0">
                <div class="order-list">
                  <div class="title">订单已发货</div>
                  <div class="order-content">
                    <img class="goodsImg"  :src="item.goods_Img" />
                    <div class="context">
                      <h3>{{ item.goods_Name }}</h3>
                      <p>{{ item.goods_desc }}</p>
                    </div>
                    <div class="prices">
                      <p>￥{{ item.goods_start_price }}</p>
                      <div>x1</div>
                    </div>
                  </div>
                  <div class="title1">
                    <span> </span>
                    <span style="color: #CACACA;"
                      >备注：{{
                        item.goods_remarks ? item.goods_remarks : "无"
                      }}</span
                    >
                    <span>已出单</span>
                  </div>
                  <div class="results">
                    <span>总价￥{{ item.goods_start_price }} </span>
                    <span> 实付款￥{{ item.goods_start_price }}</span>
                  </div>
                  <div class="btnlist clearfix">
                    <van-button
                      @click="saveOrder(item)"
                      color="#FE945C"
                      hairline
                      plain
                      round
                      >确认收货</van-button
                    >
                    <van-button @click="queryWuliu" color="#959595" hairline plain round
                      >查看物流</van-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="待评价">
          <div class="desc" v-if="pinjiaISnull">
            <img
              style="width: 248px"
              src="../../assets/tabBarImg/noData.1c06e1e1.jpeg"
              alt=""
              srcset=""
            />
            <p>暂时还没有相关订单</p>
          </div>
          <div id="orderlsit">
            <div v-for="item in orderList" :key="item.id">
              <div v-if="item.goods_status === 1">
                <div class="order-list">
                  <div class="title">交易成功</div>
                  <div class="order-content">
                    <img class="goodsImg" :src="item.goods_Img" />
                    <div class="context">
                      <h3>{{ item.goods_Name }}</h3>
                      <p>{{ item.goods_desc }}</p>
                    </div>
                    <div class="prices">
                      <p>￥{{ item.goods_start_price }}</p>
                      <div>x1</div>
                    </div>
                  </div>
                  <div class="title1">
                    <span> </span>
                    <span style="color: #CACACA;"
                      >备注：{{
                        item.goods_remarks ? item.goods_remarks : "无"
                      }}</span
                    >
                    <span>已出单</span>
                  </div>
                  <div class="results">
                    <span>总价￥{{ item.goods_start_price }} </span>
                    <span> 实付款￥{{ item.goods_start_price }}</span>
                  </div>
                  <div class="btnlist clearfix">
                    <van-button
                      @click="pingjia"
                      color="#FE945C"
                      hairline
                      plain
                      round
                      >评价</van-button
                    >
                    <van-button
                      @click="delOrder(item.id)"
                      color="red"
                      hairline
                      plain
                      round
                      >删除</van-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 物流信息 -->
    <van-action-sheet id="wuliu" :round="false" v-model="show" title="物流信息">
      <div class="content">
        <van-steps direction="vertical" :active="0">
          <van-step>
            <h3>【贵阳市】快件已到达贵阳市</h3>
            <p>{{times}}</p>
          </van-step>
          <van-step>
            <h3>【榕江县】快件离开榕江中转部已发往贵阳</h3>
            <p>{{times}}</p>
          </van-step>
          <van-step>
            <h3>【榕江县】快件已到达榕江中转部</h3>
            <p>{{times}}</p>
          </van-step>
          <van-step>
            <h3>快件离开店家已发往贵阳</h3>
            <p>{{times}}</p>
          </van-step>
          <van-step>
            <h3>已揽件</h3>
            <p>{{times}}</p>
          </van-step>
          <van-step>
            <h3>已发货</h3>
            <p>{{times}}</p>
          </van-step>
        </van-steps>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      // 用户id
      userId: 0,
      // 订单列表
      orderList: [],
      // 控制代收或为空显示的盒子是否显示
      shouhuoISnull: true,
      // 控制代收或为空显示的盒子是否显示
      pinjiaISnull: true,
      // 控制物流信息显示与隐藏
      show: false,
      // 物流时间
      times: ''
    }
  },
  created () {
    // 接收传过来的默认选中tab下标
    this.active = this.$route.params.activeId

    // 获取用户id
    const uInfo = window.sessionStorage.getItem('token')
    this.userId = JSON.parse(uInfo).id

    this.getOrderList()
  },
  methods: {
    // 获取用户订单信息
    async getOrderList () {
      const { data: res } = await this.$http.get(
        'getorderinfo?userId=' + this.userId
      )
      if (res.status !== 201) return this.$msg('获取订单失败！')
      this.orderList = res.data

      // 判断是否存在 待收货 的的订单 并为 shouhuoISnull 赋值
      const shouhuoISnull = res.data.some(item => {
        return item.goods_status === 0
      })
      this.shouhuoISnull = !shouhuoISnull

      // 判断是否存在 待评价 的的订单 并为 shouhuoISnull 赋值
      const pinjiaISnull = res.data.some(item => {
        return item.goods_status === 1
      })
      this.pinjiaISnull = !pinjiaISnull
    },

    // 确认收货
    async saveOrder (item) {
      item.goods_status = 1
      const { data: res } = await this.$http.post('updateorder', item)
      if (res.status !== 201) return this.$msg('确认收货失败！')
      this.getOrderList()
      this.$Notify({
        type: 'success',
        message: '确认成功，您可以前往评价商品哦！'
      })
    },

    // 查看物流信息
    queryWuliu () {
      this.show = true
      const times = this.time(new Date())
      this.times = times
    },
    time (time) {
      var date = new Date(time + 8 * 3600 * 1000) // 增加8小时
      return date.toJSON().substr(0, 19).replace('T', ' ')
    },

    // 删除订单信息
    delOrder (id) {
      this.$Dialog
        .confirm({
          title: '温馨提示',
          message: '您确定要删除该订单信息吗？'
        })
        .then(async () => {
          const { data: res } = await this.$http.get('delorderinfo?id=' + id)
          if (res.status !== 201) {
            return this.$Notify({ type: 'danger', message: '删除订单失败！' })
          }
          this.getOrderList()
          this.$Notify({ type: 'success', message: '删除订单成功！' })
        })
        .catch(() => {
          // on cancel
        })
    },

    // 订单评价
    pingjia () {
      this.$msg('评价功能尚未开通！')
    },

    // 返回上一级
    onClickLeft () {
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

.fa {
    height: 100% !important;
    background-color: #F6F6F6;
}
#father {
    height: 100%;
    background-color: #F6F6F6;
    .goodsImg {
      width: 100px;
      height: 100px;
    }

  .desc {
    margin-top: 50px;
    text-align: center;
    color: #b3b3b3;
    font-size: 14px;
    height: 100%;
    // height: 575px;
    // background-color: #F7F8FA;
  }
  #orderlsit {
    margin-top: 54px;
    padding: 0 10px;
    > div:last-child {
      margin-bottom: 10px;
    }
  }

  .order-list {
    padding: 10px 16px 2px;
    margin-top: 10px;
    width: 100%;
    border-radius: 10px;
    // height: 150px;
    background-color: #fff;

    .title {
      font-size: 14px;
      color: #fd7934;
      text-align: right;
    }
    .title1 {
      display: flex;
      justify-content: space-between;

      span {
        flex: 1;
        font-size: 14px;
      }
      span:last-child {
        text-align: right;
        color: #fd7934;
      }
    }
    .results {
      margin: 15px 0;
      font-size: 14px;
      text-align: right;
      span:first-child {
        color: #b3b3b3;
      }
      span:last-child {
        color: #505050;
      }
    }
    .btnlist {
      margin-bottom: 10px;
      .van-button--normal {
        float: right;
        // margin: 10px 10px;
        padding: 0 20px;
        height: 30px;
      }
      .van-button--normal:last-child {
        margin-right: 10px;
      }
    }

    .order-content {
      // margin-top: 5px;
      display: flex;
      justify-content: space-between;

      .context {
        margin: 0 5px;
        h3 {
          margin-top: 15px;
          margin-bottom: 10px;
          font-weight: normal;
          font-size: 16px;
        }
        p {
          font-size: 13px;
          color: #cacaca;
        }
      }

      .prices {
        margin-top: 15px;
        p {
          font-size: 16px;
        }
        div {
          margin-top: 10px;
          text-align: right;
          font-size: 12px;
          color: #cacaca;
        }
      }
    }
  }
}

#wuliu {
  h3 {
    font-size: 14px;
  }
}
</style>
