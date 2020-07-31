<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <img src="./../assets/img/lg.png" alt="logo">
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form ref="loginForm" label-position="top" :rules="rules"  :model="formLogin">
            <el-form-item prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                <i slot="prepend" class="fa fa-user-circle-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码">
                <i slot="prepend" class="fa fa-keyboard-o"></i>
              </el-input>
            </el-form-item>
            <el-button @click="submit" type="primary" class="button-login" :loading="loading">登录</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  require('particles.js')
  import config from './config/default'
  import api from '@/api'
  export default {
    name: 'Login',
    data() {
      return {
        loading: false,
        formLogin: {
          username: null,
          password: null
        },
        // 校验
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            let usermsg = {
              from: '0',
              username: this.formLogin.username,
              password: this.formLogin.password
            }
            this.loading = true
            this.$store.dispatch('admin/login', usermsg).then(() => {
              this.loading = false
              this.$router.push('/')
            }).catch(() => {
              this.loading = false
            })
          } else {
            if (!this.formLogin.username) {
              this.$message.error('请填写用户名')
            } else if (!this.formLogin.password) {
              this.$message.error('请填写密码')
            }
          }
        })
      }
    },
    mounted() {
      // 初始化例子插件
      particlesJS('login', config)
    },
    beforeDestroy() {
      // 销毁 particlesJS
      // thanks https://github.com/d2-projects/d2-admin/issues/65
      // ref https://github.com/VincentGarreau/particles.js/issues/63
      if (pJSDom && pJSDom.length > 0) {
        pJSDom[0].pJS.fn.vendors.destroypJS()
        pJSDom = []
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    height: 100%
    margin: 0
    padding: 0

  .login-page
    background-color: #EDF4FA
    height: 100%
    position: relative

  .layer
    position: absolute
    height: 100%
    width: 100%
    &.flex-center
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
    .logo-group
      margin-top: -145px
      position: relative
      top: 60px
      img
        height: 140px
    .form-group
      width: 300px
      .el-card
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5)
        &.is-always-shadow
          box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5)
        .el-card__body
          padding-top: 70px
      // 登录按钮
      .button-login
        width: 100%

      // 输入框左边的图表区域缩窄
      .el-input-group__prepend
        padding: 0 14px

      .login-code
        height: 40px - 2px
        display: block
        margin: 0px -20px
        border-top-right-radius: 2px
        border-bottom-right-radius: 2px
</style>

