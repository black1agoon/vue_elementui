<template>
  <div class="error-wrapper">
    <p class="error">404</p>
    <p class="message">抱歉！您访问的页面<span>失联</span>啦 ...</p>
    <el-button class="button" @click="goback">返回上一页</el-button>
    <el-button class="button" type="primary" @click="gohome">进入首页</el-button>
  </div>
</template>
<script>
  export default {
    name: 'NotFound',
    data() {
      return {}
    },
    methods: {
      gohome() {
        this.$router.push('/')
      },
      goback() {
        window.history.back()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.error-wrapper
  width: 500px
  margin: 15% auto
  text-align: center
  .error
    color: #37474f
    font-size: 100px
  .message
    margin: 30px 0
    font-size: 26px
    color: #76838f
    span
      color: #ee8145
  .button
    margin: 0 20px
</style>
