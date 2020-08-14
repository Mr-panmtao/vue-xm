<template>
  <div id="">
    <!-- 搜索 -->
    <van-search
      show-action
      placeholder="请输入商品名称"
      background="#4fc08d"
      @click="goserach"
    >
      <template #action>
        <div @click="goMy" class="myIcon"><van-icon name="manager-o" /></div>
      </template>
    </van-search>
    <div id="nidaye">
      <!-- 轮播图 -->
      <van-swipe :autoplay="4000">
        <van-swipe-item v-for="(item, index) in swiperData" :key="index">
          <img v-lazy="item.imgUrl" />
        </van-swipe-item>
      </van-swipe>
      <!-- 信息 -->
      <div class="info">
        <van-grid
          :border="false"
          icon-size="16px"
          direction="horizontal"
          :column-num="3"
        >
          <van-grid-item
            v-for="(item, index) in infoData"
            :key="index"
            :icon="item.img"
            :text="item.title"
          />
        </van-grid>
      </div>
    </div>

    <img
      style="width:100%; height:110px"
      src="../../assets/tabBarImg/homead2.gif"
      alt=""
    />

    <!-- 宫格快捷导航区 -->
    <div class="crids">
      <van-grid :column-num="5" :border="false">
        <van-grid-item
          @click.stop="goodsClick(item.classId)"
          v-for="(item, index) in cridData"
          :key="index"
          :icon="item.imgurl"
          :text="item.title"
        >
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 加入会员 -->
    <div class="huiyaun">
      <span>加入会员，每年预计节省806元</span>
      <a href="javascript:;">五折开卡> </a>
    </div>

    <!-- 限时抢购 -->
    <div style="background-color: #fff;padding-top: 10px">
      <!-- 头部 -->
      <div class="purchase-header">
        <div class="header-left">
          <h4>限时抢购</h4>

          <!-- 定时器 -->
          <van-count-down :time="time">
            <template v-slot="timeData">
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div>
        <a href="javascript:;" style="font-size:18px">更多 </a>
      </div>
      <!-- 商品列表 :style="ulHeight"-->
      <div id="goods">
        <ul id="goodsList" class="clearfix">
          <li
            v-for="(item, index) in goodsList.slice(0, 15)"
            :key="index"
            @click="gofuqian(item.id)"
          >
            <img style="width: 110px" :src="item.goods_Img" alt="" />
            <h5 class="one-txt-cut">{{ item.goods_Name }}</h5>
            <div class="til">
              <div>
                <p>￥{{ item.goods_start_price }}</p>
                <p>￥{{ item.goods_end_price }}</p>
              </div>
              <img src="../../assets/tabBarImg/shoop-active.png" alt="" />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 特色专区 -->
    <div style="background-color: #fff;padding-top:20px" id="goodsTeseList">
      <div class="purchase-header">
        <div class="header-left">
          <h4>特色专区</h4>
        </div>
      </div>
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
</template>

<script>
import Iscroll from 'iscroll'
// 信息相关数据
const info = [
  {
    img: require('../../assets/tabBarImg/peisong.png'),
    title: '运输快'
  },
  { img: require('../../assets/tabBarImg/pice.png'), title: '免运费' },
  { img: require('../../assets/tabBarImg/exit.png'), title: '安心退' }
]
export default {
  data () {
    return {
      // 轮播图数据
      swiperData: [],
      // 信息区域数据
      infoData: info,
      // 快捷导航数据
      cridData: [],
      // 特色专区商品数据
      goodsClass: [],
      // 倒计时
      time: '3000000000',
      // 所有商品
      goodsList: []
    }
  },
  created () {
    // 测试添加商品信息
    this.getGoodsAlls()
    this.addGoodsInfo()

    this.getImgList()
    this.getcridList()
    this.goodsClassList()
  },
  methods: {
    async getGoodsAlls () {
      const { data: res } = await this.$http.get('getGoodsAll')
      this.goodsList = res.data

      // 给限时抢购商品的ul设置宽度
      var uls = document.querySelector('#goodsList')
      uls.style.width = this.goodsList.slice(0, 15).length * 3.5 + 'rem'
      // 阻止浏览器的默认行为
      uls.addEventListener(
        'touchmove',
        function (ev) {
          ev.preventDefault()
        },
        { passive: false }
      )

      this.iscroll = new Iscroll('#goods', {
        scrollX: true
      })

      // 测试添加
      this.goodsList.forEach(i => {
        const goodsInfo = {}

        goodsInfo.goods_Img = i.goods_Img
        goodsInfo.goods_Name = i.goods_Name
        goodsInfo.goods_classId = i.goods_classId
        goodsInfo.goods_desc = i.goods_desc
        goodsInfo.goods_end_price = i.goods_end_price
        goodsInfo.goods_start_price = i.goods_start_price

        // this.$http.post('addGoods', goodsInfo)
      })
    },
    // 测试添加商品信息
    addGoodsInfo () {},

    // 获取轮播图数据
    async getImgList () {
      const { data: res } = await this.$http.get('getswiper')
      this.swiperData = res.data
    },

    // 获取快捷导航数据
    async getcridList () {
      const { data: res } = await this.$http.get('getcrid')
      this.cridData = res.data
      // this.loading = false
    },

    // 获取特色专区商品数据
    async goodsClassList () {
      const { data: res } = await this.$http.get('getgoodslist?id=6')
      for (let i = 0, len = res.data.length; i < len; i++) {
        const currentRandom = parseInt(Math.random() * (len - 1))
        const current = res.data[i]
        res.data[i] = res.data[currentRandom]
        res.data[currentRandom] = current
      }
      this.goodsClass = res.data
    },

    // 倒计时结束
    finish () {
      console.log('倒计时结束')
    },

    // 导航栏点击
    goodsClick (id) {
      this.$router.push({ name: 'class', params: { classId: id } })
    },
    // 跳转商品详情页
    gofuqian (id) {
      // this.$router.push({
      //   path: '/goodsdesc',
      //   query: {
      //     goodsId: id
      //   }
      // })
      this.$router.push({ name: 'goodsdesc', params: { goodsId: id } }) // 跳转b页面，参数链接不可见
    },

    // 去往我的页面
    goMy () {
      this.$router.push('/myxm')
      window.sessionStorage.setItem('active', 3)
    },

    // 去往搜索页
    goserach () {
      this.$router.push('/serach')
    }
  },
  computed: {
    ulHeight () {
      return 'width:' + this.goodsList.slice(0, 15).length * 3.5 + 'rem'
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
#nidaye {
  background: url("../../assets/tabBarImg/backImage.png");
}
.van-search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5;
  /* background-color: #f2f2f2; */
  background-color: #4fc08d !important;
}
.van-search__content {
  background-color: #fff !important;
}
.van-swipe {
  margin-top: 54px;
}
.van-swipe img {
  width: 100%;
  height: 207px;
}

.myIcon i::before {
  position: relative;
  top: 5px;
  font-size: 22px;
}

.info .van-grid {
  // background-color: rgba(0, 0, 0, 0) !important;
  background-color: pink;

  .van-grid-item__content {
    color: #45c763 !important;
    background-color: pink !important;
  }
}

.crids .van-grid-item__content {
  padding: 10px 8px;
}

/* 会员区 */
.huiyaun {
  display: flex;
  justify-content: space-between;
  margin: 10px 10px 10px;
  padding: 0 10px;
  height: 40px;
  border-radius: 5px;
  background-color: #4fc173;
  line-height: 40px;
  font-size: 14px;
  color: #fff;
}
.huiyaun a {
  color: #fff;
}

/* 限时抢购 */
/* 倒计时样式 */
.colon {
  display: inline-block;
  margin: 0 4px;
  color: #000;
}
.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #000;
}
.purchase-header {
  display: flex;
  justify-content: space-between;
  height: 30px;
  padding-left: 5px;
  border-left: 5px solid #4fc173;
  margin: 0px 10px 10px;
}

.van-count-down {
  margin-top: 5px;
}
.purchase-header h4 {
  font-weight: 400;
  font-size: 23px;
  margin-right: 10px;
}
.purchase-header a {
  color: #4fc173;
}
.purchase-header .header-left {
  display: flex;
  justify-content: space-around;
}
#goods {
  // overflow: auto;
  overflow: hidden;
  // margin-bottom: 15px;
}
#goods h5 {
  height: 32px;
  text-align: center;
  font-weight: 400;
}
#goods ul {
  display: flex;
  height: 189px;
}
/* 限时抢购-商品列表 */
#goodsList li {
  text-align: center;
  width: 111px;
  margin: 0 10px;
  font-size: 12px;
}

#goodsList .til {
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 25px;
  font-size: 16px;
}
#goodsList .til p:first-child {
  color: #f37078;
}
#goodsList .til p:last-child {
  text-decoration: line-through;
  color: #ccc;
}
#goodsList .til img {
  margin-top: 10px;
  width: 25px;
  height: 25px;
}
// 特色专区
#goodsTeseList {
  margin-bottom: 50px;

  .goodsTeseList {
    background-color: #f5f5f5;
    padding: 15px 10px 0;
    ul li {
      float: left;
      // width: 174px;
      width: 49%;
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
        justify-content: space-between;

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
</style>
