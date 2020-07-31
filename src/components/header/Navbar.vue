<template>
  <div class="navbar-wrapper clearfix">
    <div class="navbar-icon-wrapper">
      <span @click="go2home" :class="['navbar-icon', {active: togglemenu}]"></span>
    </div>
    <div class="toggle-icon" @click="toggleMenu">
      <i :class="['font fa fa-bars', {'rotate': togglemenu}]"></i>
    </div>
    <div class="header-right">
      <el-tooltip class="" v-if="!fullscreen" effect="dark" content="全屏" placement="bottom">
        <span class="func-wrapper font" @click="fullScreen"><i class="fa fa-arrows-alt func-icon"></i></span>
      </el-tooltip>
      <el-tooltip class="" v-else effect="dark" content="退出全屏" placement="bottom">
        <span class="func-wrapper font" @click="fullScreenCancel"><i class="fa fa-compress func-icon"></i></span>
      </el-tooltip>
      <!--<el-tooltip class="" effect="dark" content="这是提示" placement="bottom">-->
      <!--<span class="func-wrapper"><i class="fa fa-diamond func-icon"></i></span>-->
      <!--</el-tooltip>-->

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link font">
          <span class="username" v-show="username">你好&nbsp;,&nbsp;{{username}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changepwd">
            <i aria-hidden="true" class="fa d2-mr-5 fa-lock"></i>
            修改密码
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i aria-hidden="true" class="fa d2-mr-5 fa-power-off"></i>
            注销
          </el-dropdown-item>
          <el-dropdown-item command="">
            <i aria-hidden="true" class="fa d2-mr-5 fa-vimeo-square"></i>
            {{version}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="loading-mask" v-show="fullLoading" v-loading="fullLoading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
    </div>
  </div>
</template>

<script>
  // import api from '@/api'
  import axios from 'axios'

  export default {
    name: 'Navbar',
    data () {
      return {
        version: process.env.VERSION,
        fullscreen: false,
        fullLoading: false,
        togglemenu: false,
        username: this.$store.state.admin.user.name,
      }
    },
    methods: {
      toggleMenu () {
        this.togglemenu = !this.togglemenu
        let iconwrap = document.getElementsByClassName('navbar-icon-wrapper')[0]
        iconwrap.style.width = this.togglemenu ? '65px' : '200px'
        this.$emit('togglemenu')
      },
      fullScreen () {
        let docElm = document.documentElement
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen()
        }
        this.fullscreen = true
      },
      fullScreenCancel () {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.fullscreen = false
      },
      listenFullScreen () {
        document.addEventListener('webkitfullscreenchange', () => {
          let fullscreenEle = document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement
          if (fullscreenEle == null) {
            this.fullscreen = false
          }
        })
      },
      handleCommand (commond) {
        if (commond === 'logout') {
          axios({
            method: 'post',
            url: process.env.SERVER_URI + process.env.PREV + '/public/logout'
          }).then(() => {
            this.$store.commit('admin/SET_TOKEN', '')
            window.localStorage.removeItem('token')
            this.$router.push('/login')
          }).catch(() => {
            this.$store.commit('admin/SET_TOKEN', '')
            window.localStorage.removeItem('token')
            this.$router.push('/login')
          })
        } else if (commond === 'changepwd') {
          this.$router.push('/changepassword')
        }
      },
      go2home () {
        this.$router.push('/')
      },
    },
    mounted () {
      this.listenFullScreen()
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../assets/stylus/theme.styl'
  .navbar-wrapper
    width: 100%
    min-width: 1200px
    height: 61px
    background-color: $navbarColor
    /*border-bottom: 1px solid #e4e7ed*/

    .navbar-icon-wrapper
      float: left
      width: 200px
      height: 60px
      text-align: center
      transition: width 0.5s

      .navbar-icon
        transition: all 0.2s
        display: inline-block
        width: 200px
        height: 60px
        cursor: pointer
        background-image: url("../../assets/img/logo_1.png")
        background-size: 200px 60px
        background-repeat: no-repeat

        &.active
          width: 60px
          height: 60px
          background-image: url("../../assets/img/logo_2.png")
          background-size: 60px 60px

    .toggle-icon
      float: left
      width: 40px
      height: 30px
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer
      color: #ffffff
      opacity: 1
      margin-top: 15px
      border-radius: 4px

      i
        font-size: 20px
        transition: all .3s

      &:hover
        background: hsla(0, 0%, 100%, .2)

      .rotate
        transform: rotate(90deg)

    .header-right
      float: right
      height: 61px
      display: flex
      align-items: center
      margin-right: 30px

      .el-dropdown
        padding: 0 15px

      .func-wrapper
        padding: 14px 12px
        border-radius: 4px
        margin: 0 5px
        color: #606266

        .func-icon
          font-size: 16px

        &:hover
          background-color: #fff
          color: #409EFF

      .font
        color: #ffffff

        .username
          font-weight: bold
          margin-right: 10px
</style>
<style>
  .loading-mask {
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
