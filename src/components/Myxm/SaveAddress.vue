<template>
  <div>
    <div class="father" :style="ulHeight">
      <van-nav-bar
        :title="addressTil"
        left-text="返回"
        left-arrow
        @click-left="toggle"
      />
      <div>
        <van-address-edit
          :area-list="areaList"
          show-postal
          show-set-default
          show-search-result
          :show-delete="delShow"
          :address-info="addressInfo"
          @save="onSave"
          @change-default="onchangedefault"
          @delete="ondelete"
        />
      </div>
    </div>
  </div>
</template>
<script>
import car from './citydata'
export default {
  data () {
    return {
      // 地区数据
      areaList: {},
      // 收货人信息初始值
      addressInfo: {},
      // 用户id
      userId: 0,
      // 当前收货地址id
      addressId: 0,
      // 导航标题
      addressTil: '添加地址',
      // 删除按钮是否显示
      delShow: false,
      // 是否为默认收货地址
      isDefault: false
    }
  },
  created () {
    // 地区数据
    this.areaList = car
    // 判断当前是否处于登录状态
    var is = window.sessionStorage.getItem('token')
    if (!is) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }
    this.userId = JSON.parse(is).id

    // 获取地址栏地址
    if (this.$route.params.addressInfo) {
      this.addressTil = '编辑地址'
      this.delShow = true
      this.addressInfo = this.$route.params.addressInfo
      this.addressId = this.$route.params.addressInfo.id
    } else {
      this.addressTil = '添加地址'
      this.delShow = false
    }
  },
  methods: {

    // 添加与编辑地址
    async onSave (content) {
      if (this.userId === 0) return this.$msg('请先登录！')

      const addressInfo = {}
      addressInfo.name = content.name
      addressInfo.tel = content.tel
      addressInfo.address = content.province + content.city + content.county + content.addressDetail
      addressInfo.addressDetail = content.addressDetail
      addressInfo.postalCode = content.postalCode
      addressInfo.isDefault = this.isDefault
      addressInfo.userId = this.userId

      // 当前为编辑地址信息相关业务
      if (this.delShow) {
        // 当前收货地址id
        addressInfo.addressId = this.addressId
        const { data: res } = await this.$http.post('updateaddress', addressInfo)
        if (res.status !== 201) return this.$Notify({ type: 'danger', message: '编辑地址失败！' })
        this.$Notify({ type: 'success', message: '编辑地址成功！' })
        return this.toggle()
      }

      // 添加地址信息相关业务
      const { data: res } = await this.$http.post('saveaddress', addressInfo)
      if (res.status !== 201) return this.$Notify({ type: 'danger', message: '添加地址失败！' })
      this.$Notify({ type: 'success', message: '添加地址成功！' })
      this.toggle()
    },

    // 删除地址
    async ondelete (content) {
      const { data: res } = await this.$http.get(`deladdress?id=${content.id}&&userId=${content.userId}`)
      if (res.status !== 201) return this.$Notify({ type: 'danger', message: '删除地址失败！' })
      this.$Notify({ type: 'success', message: '删除地址成功！' })
      return this.toggle()
    },

    // 是否设置为默认收货地址
    onchangedefault (value) {
      this.isDefault = value
    },

    // 返回上一级
    toggle () {
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
.father {
  background-color: #f6f6f6;

}
</style>
