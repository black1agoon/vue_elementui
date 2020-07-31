<template>
  <div>
    <div class="version">
      <div class="title">v.1.0.1</div>
      <div class="content">
        <p>1.修复bug</p>
      </div>
      <div class="title">v.1.0.2</div>
      <div class="content">
        <p>1.修复bug</p>
      </div>
      <div class="title">v.1.0.3</div>
      <div class="content">
        <p>1.修复bug</p>
      </div>
      <div class="title">v.1.0.4</div>
      <div class="content">
        <p>1.修复bug</p>
      </div>
    </div>
    <!--<vue-markdown>{{msg}}</vue-markdown>-->
  </div>
</template>

<script>
  // import VueMarkdown from 'vue-markdown'
  // import README from '../../../test/readme.md'

  export default {
    name: 'change-log',
    _meta: {
      path: '/change/log',
      title: '更新日志'
    },
    components: {
      // VueMarkdown
    },
    data() {
      return {
        // msg: README
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .title
    font-size: 20px
    padding: 10px

  .content
    p
      font-size: 14px
      color: #7e8c8d
      padding: 5px 10px
    .title2
      margin-left: 30px
</style>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
