import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Toast } from 'vant'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 所有商品列表
    goodslistd: [],
    // 搜索功能相关数据对象
    searchObj: {},
    // 控制历史搜索记录盒子显示与隐藏
    historyIsShow: false,
    // 历史搜索记录
    historyList: [],
    // 搜索到的数据
    searchEndList: [],
    // 控制搜索记录渲染列表显示与隐藏
    searchAndhistory: true,
    // 商品分类id
    goodsId: 1
  },
  mutations: {

    // 为所有商品列表赋值
    getGoodsList (state, data) {
      state.goodslistd = data
    },

    // 监听搜索框值得变化
    wathInput (state, value) {
      if (value.trim().length === 0) {
        state.searchAndhistory = true
        return Toast('请输入搜索内容！')
      }
      // 数据筛选
      const newArr = state.goodslistd.filter(function (item) {
        return item.goods_Name.indexOf(value) !== -1
      })
      // 筛选出的数据
      state.searchEndList = newArr

      if (state.searchEndList.length > 0) {
        state.searchAndhistory = false
      } else {
        state.searchAndhistory = true
      }
    },

    // 点击搜索
    onSearch (state, obj) {
      state.searchObj = obj

      // 历史记录点击
      if (state.searchObj.history) {
        state.searchObj.value = state.searchObj.history
      }

      if (state.searchObj.value.trim().length === 0) {
        state.searchAndhistory = true
        return Toast('请输入搜索内容！')
      }

      // 数据筛选
      const newArr = state.goodslistd.filter(function (item) {
        return item.goods_Name.indexOf(state.searchObj.value) !== -1
      })
      // 筛选出的数据
      state.searchEndList = newArr.sort(() => Math.random() - 0.5)
      // 如果当前搜索记录与上一次搜索记录一样则不再重复搜索
      if (state.searchObj.priveVal === state.searchObj.value || state.searchObj.value.trim().length === 0) return

      // 保存当前搜索记录
      state.searchObj.priveVal = state.searchObj.value

      // 保存历史搜索记录到本地
      const startArr = [{ val: state.searchObj.value }]
      const endArr = { val: state.searchObj.value }
      var bendiArr = window.sessionStorage.getItem('history')
      if (bendiArr !== null) {
        const newArr = JSON.parse(bendiArr)

        // 判断本地是否存在当前记录 存在则不再缓存以免添加不必要的记录
        const isNull = newArr.some(item => {
          return item.val === state.searchObj.value
        })
        if (isNull) return

        newArr.push(endArr)

        // 保存最新搜索历史记录到data
        state.historyList = newArr.reverse()

        window.sessionStorage.setItem('history', JSON.stringify(newArr))
      } else {
        window.sessionStorage.setItem('history', JSON.stringify(startArr))
        var newArr1 = window.sessionStorage.getItem('history')
        state.historyList = JSON.parse(newArr1)
        // 显示搜索历史盒子
        state.historyIsShow = true
      }
    },

    // 获取商品分类id
    goodsClassId (state, info) {
      state.goodsId = info.id
      state.searchObj.value = info.val
    },
    // 搜索发现点击后重新为 searchEndList 赋值
    getGoodsListById (state, data) {
      state.searchEndList = data.sort(() => Math.random() - 0.5)
    },

    // 查询本地存储是否有历史搜索记录
    searchHistory (state) {
      state.searchAndhistory = true
      // 获取本地历史记录
      var newArr = window.sessionStorage.getItem('history')
      if (newArr) {
        state.historyList = JSON.parse(newArr).reverse()
        if (state.historyList.length > 0) {
          state.historyIsShow = true
        }
      }
    },

    // 隐藏搜索记录渲染列表
    hideSearch (state) {
      state.searchAndhistory = true
    },
    // 隐藏搜索历史记录盒子
    hideSearchBox (state) {
      state.historyIsShow = false
    }
  },
  actions: {

    // 查询所有商品数据
    async getGoodsAll (context) {
      axios.get('/getGoodsAll').then(({ data: res }) => {
        context.commit('getGoodsList', res.data)
      })
    },

    // 根据分类id搜索
    // 搜索发现区域点击搜索
    async goClassIdSearch (context) {
      axios.get('getgoodslist?id=' + context.rootState.goodsId).then(({ data: res }) => {
        context.commit('getGoodsListById', res.data)
      })
    }
  }

})
