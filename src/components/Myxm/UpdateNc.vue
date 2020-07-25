<template>
  <div>
    <van-nav-bar
      title="修改昵称"
      left-text="返回"
      left-arrow
      right-text="保存"
      @click-left="toggle"
      @click-right="toggleRight"
    />

    <div :style="ulHeight" class="father">
      <div class="slip">
        请输入新昵称
      </div>
      <van-cell-group>
        <van-field clearable v-model="value" />
      </van-cell-group>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      // 用户数据对象
      userListInfo: {}
    }
  },
  created () {
    // 获取地址栏传过来的用户数据对象
    this.userListInfo = this.$route.params.userInfo
    this.value = this.userListInfo.userwangming
  },
  methods: {

    // 点击保存
    async toggleRight () {
      if (this.value === this.userListInfo.userwangming) return this.$msg('请更改名称！')
      if (this.value.trim().length <= 3) return this.$msg('昵称太短啦！')

      this.userListInfo.userwangming = this.value
      const { data: res } = await this.$http.post('updateUserInfo', this.userListInfo)
      if (res.status !== 201) return this.$msg('修改失败！')
      this.$msg('修改成功！')
      this.toggle()
    },

    // 返回上一级
    toggle () {
      this.$router.go(-1)
    }
  },
  computed: {
    //   父容器高度
    ulHeight () {
      const h = document.documentElement.clientHeight - 46
      return 'height:' + h + 'px'
    }
  }
}
</script>

<style lang="less" scoped>
.father {
  background-color: #f5f5f5;

  .slip {
    padding: 20px 16px 10px;
    font-size: 14px;
    color: #969799;
  }
}
</style>
