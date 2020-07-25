<template>
  <div id="test">
    <!-- 顶部搜索 -->
    <van-search
      v-model="value"
      show-action
      show-left
      background="#4fc08d"
      placeholder="热门搜索  ' 豆 '"
      @search="onSearch"
      @input="inputSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
      <template #left>
        <div @click="goIndex" style="margin: 5px 5px 0 -5px">
          <van-icon name="arrow-left" size="22px" />
        </div>
      </template>
    </van-search>

    <div id="search">
      <!-- 搜索历史与发现 -->
      <div>
        <!-- 搜索历史 -->
        <div v-if="historyIsShow" class="search-lishi">
          <div class="search-lishi-top">
            <h3>搜索历史</h3>
            <div @click="hidehistory">
              <van-icon name="delete" />
            </div>
          </div>
          <!-- 历史记录 -->
          <div>
            <van-tag
             @click="onSearchTag(item.val)"
              v-for="(item, index) in historyList"
              :key="index"
              round
              color="#F5F5F5"
              size="large"
              text-color="#000"
              style="padding: 5px 16px; margin: 7px 10px;"
            >
              {{ item.val }}
            </van-tag>
          </div>
        </div>
        <!-- 搜索发现 -->
        <div class="search-lishi clearfix serach-ls">
          <div class="search-lishi-top">
            <h3>搜索发现</h3>
          </div>
          <!-- 搜索列表 -->
          <div class="search-list">
            <img src="../../assets/tabBarImg/timg.jpg" alt="" />
            <div class="search-list-centent">
              <div v-for="item in searchList" :key="item.id" @click="goClassIdSearch(item.id,item.goods_class_name)">
                <van-tag style="padding: 5px 15px" plain type="success">{{
                  item.goods_class_name
                }}</van-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 渲染搜索弹出层列表 -->
      <div
        @click="divClick"
        v-if="!searchAndhistory"
        id="search-content-list"
        :style="div_Height"
      >
        <van-cell-group>
          <van-cell @click.stop="onSearch"
          v-for="item in searchEndList.slice(0,6)" :key="item.id" :title="item.goods_Name"  />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      // 所有商品数据
      goodsList: [],
      // 筛选出来的商品数据
      nextGoods: [],
      // 搜索关键字
      value: '',
      // 存储上一次搜索记录
      priveVal: '',
      // 搜索发现数据
      searchList: []
      // 历史记录盒子
    }
  },
  created () {
    this.$store.commit('searchHistory')

    // 页面加载后立即查询在vuex中查询所有商品的数据列表
    this.$store.dispatch('getGoodsAll')
    this.leftNav()
  },
  // 计算属性
  computed: {
    ...mapState(['historyIsShow', 'historyList', 'searchAndhistory', 'searchEndList']),
    // 侧边栏高度
    div_Height () {
      const h = document.documentElement.clientHeight - 54
      return 'height:' + h + 'px'
    }
  },
  methods: {
    ...mapMutations(['onSearch', 'searchHistory',
      'hideSearch', 'wathInput', 'hideSearchBox',
      'goClassIdSearch', 'goodsClassId']),

    // 点击搜索
    onSearch () {
      if (this.value.trim().length > 0) {
        this.$store.commit('onSearch', {
          value: this.value,
          priveVal: this.priveVal
        })
        this.$router.push('/serachlist')
      }
    },

    // 历史记录点击搜索
    onSearchTag (val) {
      this.$store.commit('onSearch', {
        value: this.value,
        priveVal: this.priveVal,
        history: val
      })
      this.$router.push('/serachlist')
    },

    // 热门发现点击搜索
    goClassIdSearch (id, val) {
      this.$store.commit('goodsClassId', { id: id, val: val })
      this.$store.dispatch('goClassIdSearch')
      this.$router.push('/serachlist')
    },

    // 监听搜索框的值
    inputSearch () {
      this.$store.commit('wathInput', this.value)
    },

    // 获取商品分类数据信息
    async leftNav () {
      const { data: res } = await this.$http.get('getgoods_class')
      this.searchList = res.data
    },

    // 返回上一页
    goIndex () {
      this.$router.go(-1)
    },

    // 隐藏搜索历史盒子
    hidehistory () {
      this.$store.commit('hideSearchBox')
    },

    // 隐藏搜索到的结果渲染列表
    divClick () {
      this.$store.commit('hideSearch')
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
html,
body,
#app {
  height: 100%;
}
#test {
  height: 100%;
  background-color: #fff;
}
#search {
  background-color: #fff;
  //搜索历史
  .search-lishi {
    padding: 23px 17px 0;
    // margin-bottom: 20px;
    //   头部
    .search-lishi-top {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      i::before {
        font-size: 22px;
      }
      h3 {
        font-weight: 550;
        font-size: 16px;
        color: #3c3c3c;
      }
    }

    .search-list {
      height: 100%;
      width: 100%;
      img {
        width: 100%;
        border-radius: 10px;
        margin-bottom: 5px;
      }
      .search-list-centent {
        color: #3c3c3c;
        font-size: 14px;
        div {
          margin: 10px 6px;
          float: left;
          // width: 50%;
        }
      }
    }
  }
  #search-content-list {
    position: absolute;
    top: 54px;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);

    .van-cell {
        padding: 10px 33px;
    }
  }
}
</style>
