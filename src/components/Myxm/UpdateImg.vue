<template>
  <div>
    <van-nav-bar
      title="更换头像"
      left-text="返回"
      left-arrow
      right-text="保存"
      @click-left="toggle"
      @click-right="toggleRight"
    />

    <div>
      <van-field name="uploader" label="文件上传">
        <template #input>
          <van-uploader v-model="uploader" />
        </template>
      </van-field>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      uploader: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }]
    }
  },
  methods: {
    // 保存
    toggleRight () {},

    // 返回上一级
    toggle () {
      this.$router.go(-1)
    }
  }
}
</script>
