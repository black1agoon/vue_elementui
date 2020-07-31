<template>
    <el-container class="content-wrapper">
      <el-header>
        <navbar @togglemenu="togglemenu"></navbar>
      </el-header>
      <el-container>
        <sidebar ref="sidebar"></sidebar>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  import Sidebar from '@/components/sidebar/Sidebar'
  import Navbar from '@/components/header/Navbar'

  export default {
    name: 'Dash',
    components: {
      Navbar,
      Sidebar
    },
    data: function () {
      return {
        year: new Date().getFullYear()
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      togglemenu() {
        this.$refs.sidebar.toggleMenu()
      }
    },
    mounted() {
    },
    destroyed() {
      console.log('destroyed Dash!!')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-wrapper
  width: 100%
  height: 100%
  position: relative
  overflow: hidden
  .el-header
    padding: 0
    flex: 0 0 60px
    font-size: 0
  .el-main
    padding: 0
  .el-container
    overflow: hidden
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .el-aside
    border-right: 1px solid #e4e7ed
</style>
