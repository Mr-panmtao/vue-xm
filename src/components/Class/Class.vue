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
    <van-sidebar v-model="activeKey" style="" @change="leftChange">
      <div :style="leftHeight">
        <van-sidebar-item
          v-for="(item, index) in leftList"
          :key="index"
          :title="item.goods_class_name"
        />
      </div>
    </van-sidebar>
    <div id="faler">
      <div class="right-top">
        <span>推荐</span>
        <span>会员特价</span>
      </div>

      <div ref="bscroll" class="wrapper goods_list">
        <ul v-if="isShow" class="content">
          <li
            v-for="(item, index) in goodsClass"
            :key="index"
            @click="gofuqian(item.id)"
          >
            <img :src="item.goods_Img" alt="" />
            <div>
              <h3 class="one-txt-cut" style="font-size:0.35rem;">
                {{ item.goods_Name }}
              </h3>
              <p class="one-txt-cut">{{ item.goods_desc }}</p>
              <div>
                <span>￥{{ item.goods_start_price }}</span>
                <span>￥{{ item.goods_end_price }}</span>
              </div>
            </div>
          </li>

          <div id="goodsNull" v-if="!flag">
            <van-loading size="22" type="spinner" >加载中...</van-loading>
          </div>
          <div class="bom" v-if="flag">
            到底啦...
          </div>
          <div class="zw"></div>
        </ul>
        <van-empty v-if="!isShow" description="居然是空的 ~ ~ ~" />
      </div>

    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'

export default {
  data () {
    return {
      // 侧边栏选中项
      activeKey: 0,
      // 分类侧边栏数据信息
      leftList: [],
      // 推荐商品分类数据
      goodsClass: [],
      // 底部数据为空时显示
      isShow: true,
      // 页码
      pageNum: 0,
      // 总页数
      pageCount: 0,
      // 分类商品id
      classId: 0,
      // 控制底部loading显示与隐藏
      flag: false,
      // 上拉刷新
      isLoading: false,
      // 延时器
      timeId: ''
    }
  },
  created () {
    this.leftNav()

    // 从地址栏获取商品分类id
    const classid = this.$route.params.classId
    // 判断是不是从首页导航栏点击过来的
    if (classid) {
      const id = classid
      console.log(id)
      this.getClassList(id - 1, 0)
      this.activeKey = id - 1
    } else {
      this.getClassList()
    }
  },
  methods: {
    //  获取分类导航数据信息
    async leftNav () {
      const { data: res } = await this.$http.get('getgoods_class')
      this.leftList = res.data
    },

    // 顶部返回
    onClickLeft () {
      this.$router.push('/index')
    },

    // 侧边栏切换 根据id查询分类商品信息
    leftChange (index) {
      this.goodsClass = []
      this.pageNum = 0
      this.classId = index
      this.getClassList(index, 0)
    },

    // 查询分类数据
    async getClassList (index, pageNum) {
      const id = index ? index + 1 : 1
      const { data: res } = await this.$http.get(`getgoodslist?id=${id}&pageNum=${pageNum}`)
      if (res.data.length <= 0) {
        this.$msg('当前分类是空的！')
        this.isShow = false
        return
      }
      this.isShow = true
      const pageCount = Math.ceil(res.total / 8)

      this.pageCount = pageCount
      this.goodsClass = [...this.goodsClass, ...res.data]
    },

    // 跳转商品详情页
    gofuqian (id) {
      this.$router.push({ name: 'goodsdesc', params: { goodsId: id } }) // 跳转b页面，参数链接不可见
    }

  },
  computed: {
    // 侧边栏高度
    leftHeight () {
      return 'height:' + document.documentElement.clientHeight + 'px'
    }
  },
  mounted () {
    // 使用better-scroll插件
    this.$nextTick(() => {
      const bscrollDom = this.$refs.bscroll
      this.aBScroll = new BScroll(bscrollDom, {
        scrollbar: true,
        probeType: 3,
        click: true,
        startY: 0
      })
      // 数据触底查询查询数据  上拉刷新
      this.aBScroll.on('scroll', pos => {
        if (pos.y <= this.aBScroll.maxScrollY + 10) {
          this.flag = false
          if (this.pageNum >= this.pageCount) {
            this.flag = true
            return
          }
          clearTimeout(this.fangdou)
          this.fangdou = setTimeout(() => {
            this.pageNum++
            this.getClassList(this.classId, this.pageNum)
          }, 300)
        }
      })
    })
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>

.quanju {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
}

.van-pull-refresh {
  padding-right: 70px !important;
}

.van-empty {
  padding-right: 70px !important;
}
#faler {
  position: relative;
  padding-top: 46px;
  padding-left: 85px;
  .right-top {
    position: fixed;
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 25px;
    background-color: #f3f5f7;
    border-top: 1px solid #e8e9e8;
    border-bottom: 1px solid #e8e9e8;
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
    height: 78%;
    position: fixed;
    top: 108px;
    overflow: hidden;
    background-color: #fff;
    padding-bottom: 20px;

    #goodsNull {
      padding-left: 100px;
      // text-align: center;
      // color: #666;
      // font-size: 14px;
      // margin-bottom: 15px;
      display: flex;
      // justify-content: center;
      align-items: center;
    }
    .bom {
      font-size: 16px;
      padding-left: 100px;
      color: #999;
    }
    .zw {
      height: 22px;
    }
    ul {
      padding-top: 10px;
    }
    ul li {
      display: flex;
      margin: 8px;
      height: 95px;
      border-bottom: 1px solid #e8e9e8;
      h3 {
        width: 185px;
        font-weight: normal;
        font-size: 16px;
        padding-left: 3px;
        // overflow: hidden;
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
        color: #e75450;
        margin-right: 8px;
      }
      span:last-child {
        text-decoration: line-through;
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
    border-top: 1px solid #e8e9e8;
    color: #666666;
  }
  a::before {
    width: 3px;
    height: 36px;
    background-color: #4fc173;
  }
}
</style>
