<template>
    <div class="tips-wrapper">
      <i class="light"></i>
      <span class="title">操作提示</span>
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'eui-tips'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tips-wrapper
  /*width: 100%*/
  padding: 11px 13px
  color: #707070
  border-radius: 5px
  /*background-color: #f5faff*/
  background: #ffffff
  /*border: 1px dashed #62b3ff*/
  text-align: left
  margin-bottom: 20px
  .light
    background-image: url('../../../assets/img/light.png')
    background-size: 20px 20px
    width: 20px
    height: 20px
    display: inline-block
  .title
    color: #62b3ff
    line-height: 20px
    vertical-align: top
  ul
    margin-top: 10px
    overflow: hidden
    padding-left: 35px
    li
      list-style: circle
      margin-bottom: 5px
      font-size: 14px
      em
        font-style: normal
        color: #ec5151
</style>
