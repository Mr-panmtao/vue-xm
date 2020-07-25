<template>
  <div>
    <van-nav-bar
      fixed
      title="分类"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <!-- 左侧导航 -->
    <van-sidebar v-model="activeKey" style=""  @change="leftChange">
      <div :style="leftHeight">
      <van-sidebar-item v-for="(item,index) in leftList" :key="index" :title="item.goods_class_name" />
      </div>
    </van-sidebar>
    <div id="faler">
        <div class="right-top">
          <span>推荐</span>
          <span>会员特价</span>
        </div>
        <div class="goods_list">
           <ul v-if="isShow">
             <li v-for="(item,index) in goodsClass" :key="index" @click="gofuqian(item.id)">
               <img :src="item.goods_Img" alt="">
               <div>
                  <h3 class="one-txt-cut" style="font-size:0.35rem;">{{item.goods_Name}}</h3>
                  <p class="one-txt-cut">{{item.goods_desc}}</p>
                  <div>
                    <span>￥{{item.goods_start_price}}</span>
                    <span>￥{{item.goods_start_price}}</span>
                  </div>
               </div>
             </li>
             <div id="goodsNull">
               到底啦...
             </div>
           </ul>
           <van-empty v-if="!isShow" description="居然是空的 ~ ~ ~" />
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 侧边栏选中项
      activeKey: 0,
      // 分类侧边栏数据信息
      leftList: [],
      // 推荐商品分类数据
      goodsClass: [],
      isShow: true
    }
  },
  created () {
    this.leftNav()
    this.goodsClassList()

    // 从地址栏获取商品分类id
    const classid = this.$route.params.classId
    // 判断是不是从首页导航栏点击过来的
    if (classid) {
      const id = classid - 1
      this.leftChange(id)
      this.activeKey = id
    }
  },
  methods: {
    //  获取分类导航数据信息
    async leftNav () {
      const { data: res } = await this.$http.get('getgoods_class')
      this.leftList = res.data
    },

    // 获取分类商品数据
    async goodsClassList () {
      const { data: res } = await this.$http.get('getgoodslist')
      this.goodsClass = res.data
    },

    // 顶部返回
    onClickLeft () {
      this.$router.push('/index')
    },

    // 侧边栏切换 根据id查询分类商品信息
    async leftChange (index) {
      const id = index + 1
      const { data: res } = await this.$http.get('getgoodslist?id=' + id)
      // if (res.data.length <= 0) this.$msg('当前分类正在补货中...')
      if (res.data.length <= 0) {
        this.$Dialog({ title: '提示', message: '亲！当前分类正在补货中,请您耐心等待...' })
        this.isShow = false
        return
      }
      this.isShow = true
      this.goodsClass = res.data
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
    }
  },
  computed: {
    // 侧边栏高度
    leftHeight () {
      return 'height:' + document.documentElement.clientHeight + 'px'
    },
    // 商品列表ul的高度
    ulHeight () {
      const h = document.documentElement.clientHeight - 170
      return 'height:' + h + 'px'
    }
  },
  watch: {
    $route (to, from) {
      console.log('class', to)
    }
  }
}
</script>

<style lang="less" scoped>
  .van-empty {
    padding-right: 70px !important;
  }
  #faler{
    position: relative;
    padding-top: 46px;
    padding-left: 85px;
    .right-top {
      position: fixed;
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding-left: 25px;
      background-color: #F3F5F7;
      border-top: 1px solid #E8E9E8;
      border-bottom: 1px solid #E8E9E8;
      font-size: 15px;

      span:first-child {
        color: #4fc173;
      }

      span {
        margin: 0 7px;
        color: #666666;
      }
    }

    .goods_list {
      width: 100%;
      // height: 509px;
      height: 78%;
      position: fixed;
      top: 108px;
      overflow: auto;
      background-color: #fff;

      #goodsNull {
        padding-left: 110px;
        // text-align: center;
        color: #666;
        font-size: 14px;
        margin-bottom: 15px;
      }
      ul li {
        display: flex;
        margin: 8px;
        height: 95px;
        border-bottom: 1px solid #E8E9E8;
        h3 {
          width: 215px;
          font-weight: normal;
          font-size: 16px;
          padding-left: 3px;
          overflow: hidden;
        }
        p {
          width: 180px;
          font-size: 12px;
          color: #666;
          margin: 6px 0;
          padding-left: 3px;
        }
        img {
          width: 85px;
          height: 85px;
          margin-right: 7px;
        }
        span {
          font-size: 14px;
        }
        span:first-child {
          color: #E75450;
          margin-right: 8px;
        }
        span:last-child {
          text-decoration:line-through;
          color: #ccc;
        }
      }
    }
  }
  .van-sidebar {
    position: fixed;
    top: 46px;
    bottom: 50px;
    a {
      border-top: 1px solid #E8E9E8;
      color: #666666;
    }
    a::before{
      width: 3px;
      height: 36px;
      background-color: #4fc173;
    }
  }
</style>
