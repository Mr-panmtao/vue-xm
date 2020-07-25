<template>
  <div>
    <van-nav-bar
      title="我的优惠券"
      left-text="返回"
      left-arrow
      @click-left="toggle"
    />

    <!-- 优惠券 -->
    <div>
      <!-- 优惠券列表 -->
      <van-popup
        v-model="showList"
        round
        position="bottom"
        style="height: 90%; padding-top: 4px;"
      >
        <van-coupon-list
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          :disabled-coupons="disabledCoupons"
          @change="onChange"
          @exchange="onExchange"
          :show-close-button="false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
const coupon = {
  available: 1,
  condition: '无使用门槛\n最多优惠12元',
  reason: '',
  value: 150,
  name: '店铺优惠券',
  startAt: 1489104000,
  endAt: 1514592000,
  valueDesc: '1.5',
  unitDesc: '元'
}
export default {
  data () {
    return {
      // 优惠券相关
      showList: false,
      chosenCoupon: -1,
      coupons: [coupon],
      disabledCoupons: [coupon]
    }
  },
  methods: {

    // 优惠券相关
    onChange (index) {
      this.showList = false
      this.chosenCoupon = index
    },
    onExchange (code) {
      this.coupons.push(coupon)
    },

    // 返回上一级
    toggle () {
      this.$router.go(-1)
    }
  }
}
</script>
