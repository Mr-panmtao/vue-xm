<template>
  <div class="fa">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="toggle"
    />

    <div class="father">
      <div>
        <van-cell title="头像" default="" @click="imgshow = true">
          <template #default>
            <img class="userImg" :src="userinfo.userimgs" alt="" srcset="" />
          </template>
        </van-cell>
        <van-cell
          title="昵称"
          :value="userinfo.userwangming"
          is-link
          @click="gomynic"
        />
        <van-cell
          title="性别"
          :value="userinfo.sex ? userinfo.sex : '未填写'"
          is-link
          to=""
          @click="showSex = true"
        />
        <van-cell
          title="生日"
          :value="userinfo.birthday ? userinfo.birthday : '未填写'"
          is-link
          to=""
          @click="show = true"
        />

        <van-cell
          title="手机号"
          @click="updatePhone"
          :value="userinfo.phone"
          is-link
          to=""
        />
      </div>
      <van-button
        @click="exitshow = true"
        style="margin-top: 25px"
        type="primary"
        block
        >退出登录</van-button
      >
      <!-- 日期组件弹出层 -->
      <van-action-sheet v-model="show">
        <div class="content">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="thisData"
            @cancel="exitData"
          />
        </div>
      </van-action-sheet>

      <!-- 性别选项弹出层 -->
      <van-action-sheet
        :round="false"
        v-model="showSex"
        :actions="actions"
        @select="onSelect"
      />

      <!-- 更换头像弹出层 -->
      <van-action-sheet
        v-model="imgshow"
        :round="false"
        :actions="imgactions"
        cancel-text="取消"
        close-on-click-action
        @select="onCancelimg"
      />

        <!-- 单独设置上传图片功能 enctype='multipart/form-data'-->
        <form method="" >
            <input type="file" id="imgFile" name="goods_Img" @input="myimg">
        </form>

      <!-- 查看头像组件 -->
      <van-overlay duration=0.5 :show="chakanimg" @click="chakanimg = false">
        <div class="wrapper" @click.stop="chakanimg=false">
          <div class="block">
            <img :src="userinfo.userimgs" alt="" srcset="">
          </div>
        </div>
      </van-overlay>

      <!-- 退出弹出层 -->
      <van-action-sheet
        :round="false"
        v-model="exitshow"
        :actions="exitactions"
        cancel-text="取消"
        close-on-click-action
        @select="exitSelect"
      />
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 用户id
      userId: 0,
      // 用户信息列表
      userinfo: {
        userId: 0,
        // 用户头像
        userimgs: '',
        // 用户昵称
        userwangming: '',
        // 勾选后的性别
        sex: '',
        // 选择后的生日
        birthday: '',
        // 手机号
        phone: '',
        // 用户账号
        username: '',
        // 用户密码
        password: '',
        // 邮箱
        email: ''
      },

      // 控制日期弹出层显示与隐藏
      show: false,
      minDate: new Date(1975, 0, 1),
      maxDate: new Date(2020, 10, 1),
      currentDate: new Date(),

      // 控制性别弹出层显示与隐藏
      showSex: false,
      actions: [{ name: '男' }, { name: '女' }],

      // 点击更换头像弹出层相关配置
      imgshow: false,
      imgactions: [
        { name: '查看头像' },
        { name: '从相册选择图片' },
        { name: '拍照' }
      ],
      // 控制查看头像显示与隐藏
      chakanimg: false,

      // 退出
      exitshow: false,
      exitactions: [{ name: '退出登录' }, { name: '切换账号' }]
    }
  },
  created () {
    // 获取用户信息
    var is = window.sessionStorage.getItem('token')
    if (!is) {
      this.$Notify({ type: 'warning', message: '请先登录！' })
      return this.$router.push('/login')
    }

    this.userId = JSON.parse(is).id
    this.getUserList()
  },
  methods: {
    // 获取用户数据
    async getUserList () {
      const { data: res } = await this.$http.get(
        `getUserInfo?id=${this.userId}`
      )
      if (res.status !== 201) {
        return this.$Notify({ type: 'warning', message: '获取用户数据失败！' })
      }
      // 配置用户信息
      const [lsit] = res.data
      this.userinfo.userId = lsit.id
      this.userinfo.userimgs = lsit.userimgs
      this.userinfo.userwangming = lsit.userwangming
      this.userinfo.sex = lsit.sex
      this.userinfo.birthday = lsit.birthday
      this.userinfo.phone = lsit.phone
      this.userinfo.username = lsit.username
      this.userinfo.password = lsit.password
      this.userinfo.email = lsit.email
      // this.currentDate = lsit.birthday
    },

    // 修改用户信息
    async updateUserInfo () {
      const { data: res } = await this.$http.post(
        'updateUserInfo',
        this.userinfo
      )
      if (res.status !== 201) return this.$msg('修改失败！')
      this.$msg('修改成功！')
    },

    // 日期组件的确认按钮点击
    thisData (value) {
      var nowdate = value.toLocaleDateString().replace(/\//g, '-')
      // this.$msg(nowdate)
      this.userinfo.birthday = nowdate
      this.updateUserInfo()
      this.show = false
    },
    // 日期组件取消按钮点击
    exitData () {
      this.show = false
    },

    // 用户选中的性别
    onSelect (item) {
      this.showSex = false
      // this.$msg('您选择了：' + item.name)
      this.userinfo.sex = item.name
      this.updateUserInfo()
    },

    // 更换头像
    onCancelimg (item) {
      if (item.name === '查看头像') {
        this.chakanimg = true
      } else if (item.name === '从相册选择图片') {
        const files = document.querySelector('#imgFile')
        files.click()
      } else if (item.name === '拍照') {
        return this.$msg('暂未完成！')
      }
    },
    // 选择图片
    async myimg (e) {
      const fileBook = e.target.files[0]

      // multipart/form-data 提交
      const formData = new FormData()
      formData.append('userimgs', fileBook)
      formData.append('userId', this.userinfo.userId)
      formData.append('userwangming', this.userinfo.userwangming)
      formData.append('sex', this.userinfo.sex ? this.userinfo.sex : '未填写')
      formData.append('birthday', this.userinfo.birthday ? this.userinfo.birthday : '未填写')
      formData.append('phone', this.userinfo.phone)
      formData.append('username', this.userinfo.username)
      formData.append('password', this.userinfo.password)
      formData.append('email', this.userinfo.email)

      const { data: res } = await this.$http.post('upload', formData)
      if (res.status !== 201) return this.$msg('上传头像失败！')
      this.$Notify({ type: 'success', message: '上传头像成功！' })
      this.getUserList()
    },

    // 去往修改昵称页面
    gomynic () {
      this.$router.push({ name: 'updatenc', params: { userInfo: this.userinfo } })
    },
    // 去往上传头像页面
    goupdateimg () {
      this.$router.push({
        name: 'updateimg',
        params: { userInfo: this.userinfo }
      })
    },

    // 退出相关操作
    exitSelect (item) {
      if (item.name === '退出登录') {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      } else {
        this.$msg(item.name)
      }
    },

    // 修改手机号
    updatePhone () {
      this.$msg('手机号不可更改，请牢记！')
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
.fa {
  height: 100%;
  background-color: #f5f5f5;
}
.father {
  padding-top: 15px;

  .van-cell:first-child {
    height: 84px;
    position: relative;

    .van-cell__title {
      line-height: 60px;
    }
    .userImg {
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}
 .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 100%;
    height: 400px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  #imgFile {
    display: none;
  }
</style>
