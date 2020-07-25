<template>
  <div>
    <!-- 顶部搜索 -->
    <van-search
      v-model="value"
      show-action
      show-left
      background="#4fc08d"
      :placeholder="searchObj.value"
      @search="onSearch"
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
    <div style="margin-top:54px">
      <van-tabs sticky offset-top="54px">
        <van-tab title="综合">
          <van-pull-refresh success-text="刷新成功" v-model="isLoading" @refresh="onRefresh">
            <div class="goodsList" v-if="searchEndList.length > 0">
              <div
                v-for="item in searchEndList"
                :key="item.id"
                @click="gofuqian(item.id)"
              >
                <img :src="item.goods_Img" alt="" />
                <div class="goods-right">
                  <h3>{{ item.goods_Name }}</h3>
                  <p>{{ item.goods_desc }}</p>
                  <div class="goods-desc">
                    <span>￥{{ item.goods_start_price }}</span>
                    <span>￥{{ item.goods_end_price }}</span>
                  </div>
                  <p>7856条评价 99.7%满意</p>
                </div>
              </div>
              <div class="goods-bottom">
                <p>暂无更多数据...</p>
              </div>
            </div>
          </van-pull-refresh>
          <van-empty
            v-if="searchEndList.length <= 0"
            description="暂无查询到相关数据 ~ ~ ~"
          />
        </van-tab>
        <van-tab title="销量" disabled></van-tab>
        <van-tab title="价格" disabled></van-tab>
        <van-tab title="筛选" disabled></van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      // 搜索的关键字
      value: '',
      count: 0,
      isLoading: false
    }
  },
  created () {},
  computed: {
    ...mapState(['searchEndList', 'searchObj'])
  },
  methods: {
    ...mapMutations(['onSearch']),

    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false
        this.count++
      }, 1500)
    },

    // 点击搜索
    onSearch () {
      if (this.value.trim().length > 0) {
        this.$store.commit('onSearch', {
          value: this.value,
          priveVal: this.priveVal
        })
      } else {
        this.$msg('请输入搜索内容')
      }
    },
    // 返回上一页
    goIndex () {
      this.$router.go(-1)
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
  }
}
</script>

<style lang="less" scoped>
.van-search {
  position: fixed;
  top: 0;
  z-index: 5;
  width: 100%;
}
.goodsList {
  background-color: #fff;
  > div {
    display: flex;
    justify-content: start;
    padding: 10px 18px;
    border-bottom: 1px solid #f2f2f2;

    img {
      margin-top: 27px;
      width: 100px;
      height: 100px;
      margin-right: 20px;
    }

    .goods-right {
      padding: 20px 0 10px;
      h3 {
        font-weight: normal;
        font-size: 16px;
        color: #212168;
      }
      p {
        margin: 10px 0;
        font-size: 12px;
        color: #757575;
      }

      .goods-desc {
        font-size: 16px;
        span:first-child {
          margin-right: 8px;
          color: #ff674a;
        }
        span:last-child {
          text-decoration: line-through;
          color: #ccc;
        }
      }
    }
  }

  .goods-bottom {
    position: relative;
    padding: 20px;
    p {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #757575;
      font-size: 14px;
    }
  }
}
</style>
