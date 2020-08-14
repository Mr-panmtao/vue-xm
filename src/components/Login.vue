<template>
  <div class="main" :style="leftHeight">
    <!-- 父盒子 -->
    <div class="father">
      <div class="form-top">
        <img src="../assets/tabBarImg/login-top.png" alt="" />
        <div>
          <van-icon name="close" size="25px" @click="goIndex" />
        </div>
      </div>

      <!-- tab栏 -->
      <van-tabs v-model="active">
        <van-tab title="登录">
          <van-form
            @submit="onSubmit1"
            validate-first
            scroll-to-error
            :show-error="false"
            label-width="4rem"
          >
            <van-field
              v-model="login.username"
              name="username"
              label="账号："
              placeholder="用户名 / 手机号 / 邮箱"
            />
            <van-field
              v-model="login.password"
              type="password"
              name="password"
              label="密码："
              placeholder="密码"
            />
            <div style="margin: 16px;">
              <van-button block type="info">
                登录
              </van-button>
            </div>
          </van-form>
          <!-- 其他登录方式 -->
          <div>
            <van-divider
              :style="{
                color: '#1989fa',
                borderColor: '#1989fa',
                padding: '0 16px'
              }"
            >
              其他登录方式
            </van-divider>
            <div class="paiban">
              <div class="login-fangshi" @click="disanflogin">
                <img class="wx" src="../assets/tabBarImg/wx.jpg" />
                <p>微信登录</p>
              </div>
              <div class="login-fangshi" @click="disanflogin">
                <img src="../assets/tabBarImg/qq.jpg" />
                <p>QQ登录</p>
              </div>
            </div>
          </div>
        </van-tab>

        <!-- 注册账号 -->
        <van-tab title="注册">
          <van-form
            @submit="onSubmit"
            validate-first
            scroll-to-error
            :show-error="false"
            ref="addform"
            label-width="4rem"
          >
            <van-field
              v-model="addInfo.username"
              name="username"
              label="账号："
              placeholder="用户名"
            />
            <van-field
              v-model="addInfo.password"
              type="password"
              name="password"
              label="密码："
              placeholder="密码"
            />
            <van-field
              v-model="addInfo.phone"
              name="phone"
              label="手机号："
              placeholder="手机号"
            />
             <van-field
              v-model="userCode"
              label="验证码："
              placeholder="请输入验证码"
            >
               <template #button>
                <van-button size="small" :disabled="isDisabled" @click="getCode" type="primary">发送验证码</van-button>
              </template>
            </van-field>
            <van-field
              v-model="addInfo.email"
              type="email"
              name="email"
              label="邮箱："
              placeholder="邮箱"
            />
            <div style="margin: 16px;">
              <van-button block type="info">
                注册
              </van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
      <div>
        <van-notice-bar
          left-icon="volume-o"
          text="温馨提示: 唯有心怀光亮望向远方，才能看见幸福真正的模样。真正拥抱自己。更好的生活，正在前方等着你！"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // tab栏默认选中项
      active: 0,
      // 登录表单数据对象
      login: {
        username: 'test',
        password: 'test'
      },
      // 注册表单数据对象
      addInfo: {
        username: '',
        password: '',
        phone: '',
        email: ''
      },
      // 用户输入的验证码
      userCode: '',
      // 后端返回的验证码
      resCode: '',
      // 是否禁用按钮
      isDisabled: false
    }
  },
  created () {},

  methods: {

    // 登录
    async onSubmit1 (values) {
      if (this.login.username.trim().length <= 0 || this.login.password.trim().length <= 0) {
        return this.$msg('用户名或密码不能为空哦！')
      }
      const { data: res } = await this.$http.get(
        `login?username="${values.username}"&&password="${values.password}"`
      )
      if (res.data.length <= 0) {
        return this.$Notify({ type: 'danger', message: '登录失败！' })
      }
      // 将用户数据存储到本地
      window.sessionStorage.setItem('token', JSON.stringify(...res.data))
      // this.$Notify({ type: 'primary', message: '登录成功！' })
      this.$router.go(-1)
    },

    // 获取手机验证码
    async getCode () {
      if (this.addInfo.phone.trim().length <= 0) return this.$msg('请输入手机号')
      this.isDisabled = true
      const { data: res } = await this.$http.get('phone?phoneNum=' + this.addInfo.phone)
      if (res.msg === 'fail') return this.$msg('请勿频繁发送验证码')
      this.resCode = res.code
      setTimeout(() => {
        this.resCode = ''
      }, 300000)
      setTimeout(() => {
        this.isDisabled = false
      }, 30000)
    },

    // 注册
    async onSubmit (values) {
      if (this.addInfo.username.trim().length <= 0) return this.$msg('请输入账号')
      if (this.addInfo.password.trim().length <= 0) return this.$msg('请输入密码')
      if (this.addInfo.phone.trim().length <= 0) return this.$msg('请输入手机号')
      if (this.userCode.trim().length <= 0) return this.$msg('请输入验证码')
      if (this.addInfo.email.trim().length <= 0) return this.$msg('请输入邮箱')
      if (this.userCode !== this.resCode) return this.$msg('验证码不正确')

      // 查询用户名是否已经存在
      const { data: result } = await this.$http.get('getusername?username=' + values.username)
      if (result.data.length >= 1) return this.$msg('用户名已经存在')

      // 用户默认头像
      this.addInfo.userimgs = 'https://oscar-start.oss-cn-beijing.aliyuncs.com/rty_blog-1596891246108.jpg'
      const { data: res } = await this.$http.post('adduserinfo', this.addInfo)
      if (res.status !== 201) {
        return this.$Notify({ type: 'danger', message: '注册失败！' })
      }
      this.$Notify({ type: 'success', message: '注册成功！' })
      this.addInfo = {}
      this.active = 0
      this.resCode = ''
    },

    // 其他方式登录
    disanflogin () {
      return this.$msg('第三方登录功能暂未开放 !')
    },
    // 返回上一页
    goIndex () {
      this.$router.go(-1)
    }
  },
  computed: {
    // 侧边栏高度
    leftHeight () {
      return 'height:' + document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  background: url("../assets/tabBarImg/back2.a864ff79.jpg") no-repeat;
  background-size: 100% 100%;

  .father {
    padding: 37px 35px 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 470px;
    background-color: #fff;
    opacity: 0.95;
    border-radius: 5px;
    .form-top {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: start;
      z-index: 999;
      img {
        width: 78px;
        height: 78px;
      }
      div {
        position: absolute;
        top: 37px;
        right: -130px;
      }
    }

    .paiban {
      margin-top: 40px;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
    }
    .login-fangshi {
      margin: 0 20px;
      text-align: center;
      width: 60px;
      height: 30px;
      color: #666;
      font-size: 12px;
      .wx {
        width: 26px;
        height: 26px;
      }
      img {
        width: 35px;
        // height: 28px;
        border-radius: 50%;
        margin-bottom: 5px;
      }
    }

    .van-form {
      margin-top: 20px;
    }
  }
}
</style>
